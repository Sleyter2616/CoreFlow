import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function WorkoutNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h1 className="text-3xl font-bold mb-2">Workout Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The workout you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Link href="/dashboard/workouts">
        <Button>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workouts
        </Button>
      </Link>
    </div>
  )
}
