'use client'

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UserSettings {
  name: string;
  height: number;
  weight: number;
  notifications: {
    email: boolean;
    workout: boolean;
    progress: boolean;
  };
  preferences: {
    language: string;
    units: string;
  };
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    name: session?.user?.name || '',
    height: 0,
    weight: 0,
    notifications: {
      email: true,
      workout: true,
      progress: false,
    },
    preferences: {
      language: 'en',
      units: 'metric',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({
            ...prev,
            ...data,
          }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    if (session?.user?.email) {
      fetchSettings();
    }
  }, [session?.user?.email]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      const updatedUser = await response.json();
      
      // Update the session with the new name if it changed
      if (updatedUser.name !== session?.user?.name) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
          },
        });
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={session?.user?.email || ''} 
                  disabled 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  value={settings.height}
                  onChange={(e) => setSettings(prev => ({ ...prev, height: Number(e.target.value) }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  value={settings.weight}
                  onChange={(e) => setSettings(prev => ({ ...prev, weight: Number(e.target.value) }))}
                />
              </div>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your workouts and progress
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked: boolean) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked }
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Workout Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about your scheduled workouts
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.workout}
                  onCheckedChange={(checked: boolean) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, workout: checked }
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Progress Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly progress reports
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.progress}
                  onCheckedChange={(checked: boolean) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, progress: checked }
                    }))
                  }
                />
              </div>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">App Preferences</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="w-full p-2 border rounded-md bg-background"
                  value={settings.preferences.language}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, language: e.target.value }
                  }))}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="units">Units</Label>
                <select
                  id="units"
                  className="w-full p-2 border rounded-md bg-background"
                  value={settings.preferences.units}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, units: e.target.value }
                  }))}
                >
                  <option value="metric">Metric (kg, cm)</option>
                  <option value="imperial">Imperial (lb, in)</option>
                </select>
              </div>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Plan</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-primary/5">
                <h3 className="font-semibold">Current Plan: Free</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You are currently on the free plan
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-6">
                  <h3 className="font-semibold">Pro Plan</h3>
                  <p className="text-2xl font-bold mt-2">$9.99/month</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Unlimited workouts
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Priority support
                    </li>
                  </ul>
                  <Button className="w-full mt-4">Upgrade to Pro</Button>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold">Elite Plan</h3>
                  <p className="text-2xl font-bold mt-2">$19.99/month</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Everything in Pro
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Personal trainer
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Custom meal plans
                    </li>
                  </ul>
                  <Button className="w-full mt-4">Upgrade to Elite</Button>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
