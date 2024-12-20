'use client'

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { Loader2 } from "lucide-react";

interface ProgressData {
  date: string;
  workouts: number;
  duration: number;
  calories: number;
  type?: string;
}

interface ProgressSummary {
  totalWorkouts: number;
  avgDuration: number;
  totalDuration: number;
  totalCalories: number;
  workoutTypes: { name: string; value: number }[];
  weeklyProgress: number;
  monthlyProgress: number;
}

interface ProgressResponse {
  data: ProgressData[];
  summary: ProgressSummary;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ProgressPage() {
  const [timeframe, setTimeframe] = useState('week');
  const [data, setData] = useState<ProgressData[]>([]);
  const [summary, setSummary] = useState<ProgressSummary>({
    totalWorkouts: 0,
    avgDuration: 0,
    totalDuration: 0,
    totalCalories: 0,
    workoutTypes: [],
    weeklyProgress: 0,
    monthlyProgress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/progress?timeframe=${timeframe}`);
        if (!response.ok) throw new Error('Failed to fetch progress data');
        const result: ProgressResponse = await response.json();
        setData(result.data);
        setSummary(result.summary);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Workouts</h3>
          <p className="text-2xl font-bold">{summary.totalWorkouts}</p>
          <p className="text-xs text-muted-foreground">
            {summary.weeklyProgress > 0 ? '+' : ''}{summary.weeklyProgress}% this week
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Average Duration</h3>
          <p className="text-2xl font-bold">{summary.avgDuration} min</p>
          <p className="text-xs text-muted-foreground">Per workout</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Duration</h3>
          <p className="text-2xl font-bold">{summary.totalDuration} min</p>
          <p className="text-xs text-muted-foreground">
            {summary.monthlyProgress > 0 ? '+' : ''}{summary.monthlyProgress}% this month
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Calories Burned</h3>
          <p className="text-2xl font-bold">{summary.totalCalories}</p>
          <p className="text-xs text-muted-foreground">Total calories</p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="duration">Duration</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="types">Workout Types</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Overview</h2>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="p-2 border rounded-md bg-background"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    formatter={(value, name) => {
                      switch (name) {
                        case 'Duration':
                          return [`${value} min`, name];
                        case 'Calories':
                          return [`${value} kcal`, name];
                        default:
                          return [value, name];
                      }
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="workouts" 
                    stroke="#8884d8" 
                    name="Workouts" 
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#82ca9d" 
                    name="Duration" 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#ffc658" 
                    name="Calories" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Workout Progress</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                  />
                  <Legend />
                  <Bar dataKey="workouts" fill="#8884d8" name="Workouts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="duration" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Duration Progress</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    formatter={(value) => [`${value} min`, 'Duration']}
                  />
                  <Legend />
                  <Bar dataKey="duration" fill="#82ca9d" name="Duration (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="calories" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Calories Progress</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    formatter={(value) => [`${value} kcal`, 'Calories']}
                  />
                  <Legend />
                  <Bar dataKey="calories" fill="#ffc658" name="Calories" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Workout Types Distribution</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.workoutTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {summary.workoutTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
