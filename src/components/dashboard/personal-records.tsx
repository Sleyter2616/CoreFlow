'use client'

import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { PersonalRecord } from "@prisma/client";

interface PersonalRecordsProps {
  records: (PersonalRecord & {
    exercise: {
      name: string;
      id: string;
    };
  })[];
}

export function PersonalRecords({ records }: PersonalRecordsProps) {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Your Personal Records 🏆</h2>
        {records.map((record) => (
          <Card key={record.id} className="p-4 mb-4 bg-background border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{record.exercise.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {record.value} {record.unit} • {record.type}
                </p>
              </div>
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Achieved on {new Date(record.date).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
