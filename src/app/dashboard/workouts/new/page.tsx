"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FitnessProfile {
  type: string;
  difficulty: string;
  fitnessGoal: string;
  workoutFrequency: number;
  experienceLevel: string;
  currentBenchPress?: number;
  currentSquat?: number;
  currentDeadlift?: number;
  injuries: string;
  equipment: string[];
  focusAreas: string[];
  timeAvailable: number;
}

const initialProfile: FitnessProfile = {
  type: "strength",
  difficulty: "intermediate",
  fitnessGoal: "build_muscle",
  workoutFrequency: 3,
  experienceLevel: "intermediate",
  injuries: "",
  equipment: ["barbell", "dumbbell"],
  focusAreas: ["chest", "back"],
  timeAvailable: 45,
};

const equipmentOptions = [
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'barbell', label: 'Barbell' },
  { id: 'pull_up_bar', label: 'Pull-up Bar' },
  { id: 'resistance_bands', label: 'Resistance Bands' },
  { id: 'kettlebells', label: 'Kettlebells' },
  { id: 'bench', label: 'Weight Bench' },
  { id: 'squat_rack', label: 'Squat Rack' },
  { id: 'cables', label: 'Cable Machine' },
  { id: 'smith_machine', label: 'Smith Machine' },
];

const fitnessGoals = [
  { value: 'strength', label: 'Build Strength' },
  { value: 'muscle', label: 'Build Muscle' },
  { value: 'endurance', label: 'Improve Endurance' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'general_fitness', label: 'General Fitness' },
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'advanced', label: 'Advanced (3+ years)' },
];

export default function NewWorkoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<FitnessProfile>(initialProfile);

  const updateProfile = (key: keyof FitnessProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const generateWorkout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/workouts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to generate workout");
      }

      const workout = await response.json();
      router.push(`/dashboard/workouts/${workout.id}`);
    } catch (error) {
      console.error("Error generating workout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div className="space-y-4">
          <Label>What is your primary fitness goal?</Label>
          <Select
            value={profile.fitnessGoal}
            onValueChange={(value) => updateProfile('fitnessGoal', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent>
              {fitnessGoals.map((goal) => (
                <SelectItem key={goal.value} value={goal.value}>
                  {goal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>What is your experience level?</Label>
          <Select
            value={profile.experienceLevel}
            onValueChange={(value) => updateProfile('experienceLevel', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>How many days per week can you workout?</Label>
          <Select
            value={profile.workoutFrequency.toString()}
            onValueChange={(value) => updateProfile("workoutFrequency", parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select days per week" />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6].map((days) => (
                <SelectItem key={days} value={days.toString()}>
                  {days} days per week
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>How much time do you have for each workout?</Label>
          <Select
            value={profile.timeAvailable.toString()}
            onValueChange={(value) => updateProfile("timeAvailable", parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select workout duration" />
            </SelectTrigger>
            <SelectContent>
              {[30, 45, 60, 75, 90].map((duration) => (
                <SelectItem key={duration} value={duration.toString()}>
                  {duration} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full" onClick={() => setStep(2)}>
        Next: Experience Level
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Experience & Current Level</h2>

        <div className="space-y-4">
          <RadioGroup
            value={profile.experienceLevel}
            onValueChange={(value) => updateProfile("experienceLevel", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner">Beginner (0-1 years)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate (1-3 years)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced">Advanced (3+ years)</Label>
            </div>
          </RadioGroup>
        </div>

        {profile.type === "strength" && (
          <div className="space-y-4">
            <Label>Current Lift Numbers (in lbs)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Bench Press</Label>
                <Input
                  type="number"
                  value={profile.currentBenchPress || ""}
                  onChange={(e) =>
                    updateProfile("currentBenchPress", Number(e.target.value))
                  }
                  placeholder="e.g., 185"
                />
              </div>
              <div className="space-y-2">
                <Label>Squat</Label>
                <Input
                  type="number"
                  value={profile.currentSquat || ""}
                  onChange={(e) =>
                    updateProfile("currentSquat", Number(e.target.value))
                  }
                  placeholder="e.g., 225"
                />
              </div>
              <div className="space-y-2">
                <Label>Deadlift</Label>
                <Input
                  type="number"
                  value={profile.currentDeadlift || ""}
                  onChange={(e) =>
                    updateProfile("currentDeadlift", Number(e.target.value))
                  }
                  placeholder="e.g., 315"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
          Previous
        </Button>
        <Button className="w-full" onClick={() => setStep(3)}>
          Next: Equipment & Restrictions
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Equipment & Health Considerations</h2>

        <div className="space-y-4">
          <Label>What equipment do you have access to?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {equipmentOptions.map((equipment) => (
              <div
                key={equipment.id}
                className="flex items-center space-x-2 bg-zinc-900/50 p-3 rounded-lg hover:bg-zinc-900/70 transition-colors"
              >
                <Checkbox
                  id={equipment.id}
                  checked={profile.equipment.includes(equipment.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateProfile('equipment', [...profile.equipment, equipment.id]);
                    } else {
                      updateProfile(
                        'equipment',
                        profile.equipment.filter((e) => e !== equipment.id)
                      );
                    }
                  }}
                />
                <label
                  htmlFor={equipment.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {equipment.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Any injuries or areas to avoid?</Label>
          <Textarea
            value={profile.injuries}
            onChange={(e) => updateProfile("injuries", e.target.value)}
            placeholder="e.g., Lower back injury, shoulder pain..."
          />
        </div>

        <div className="space-y-4">
          <Label>Areas you want to focus on:</Label>
          <div className="grid grid-cols-2 gap-4">
            {[
              "chest",
              "back",
              "legs",
              "shoulders",
              "arms",
              "core",
              "cardio",
              "flexibility",
            ].map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={area}
                  checked={profile.focusAreas.includes(area)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateProfile("focusAreas", [...profile.focusAreas, area]);
                    } else {
                      updateProfile(
                        "focusAreas",
                        profile.focusAreas.filter((i) => i !== area)
                      );
                    }
                  }}
                />
                <Label htmlFor={area} className="capitalize">
                  {area}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" className="w-full" onClick={() => setStep(2)}>
          Previous
        </Button>
        <Button
          className="w-full"
          onClick={generateWorkout}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Workout...
            </>
          ) : (
            "Generate Workout"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Your Workout Plan</h1>

      <div className="mb-8 flex justify-between">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center ${
              i !== 3 ? "flex-1 relative" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i}
            </div>
            {i !== 3 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  step > i ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </Card>
    </div>
  );
}
