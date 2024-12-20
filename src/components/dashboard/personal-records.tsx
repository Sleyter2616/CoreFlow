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
      {records.map((record) => (
        <Card key={record.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{record.exercise.name}</h4>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {record.value} {record.unit} • {record.type}
              </p>
            </div>
            <Trophy className="h-5 w-5 text-[hsl(var(--primary))]" />
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
            Achieved on {new Date(record.date).toLocaleDateString()}
          </p>
        </Card>
      ))}
    </div>
  );
}
