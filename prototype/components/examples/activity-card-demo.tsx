"use client";

import { ActivityCard, Goal, Metric } from "@/components/ui/activity-card";
import { useState } from "react";

const INITIAL_METRICS: Metric[] = [
  { label: "Move", value: "420", trend: 85, unit: "cal" },
  { label: "Exercise", value: "35", trend: 70, unit: "min" },
  { label: "Stand", value: "10", trend: 83, unit: "hrs" },
];

const INITIAL_GOALS: Goal[] = [
  { id: "1", title: "30min Morning Baithak & Dand", isCompleted: true },
  { id: "2", title: "10k Campus Steps", isCompleted: false },
  { id: "3", title: "Drink 2L Water", isCompleted: true },
];

export function ActivityCardDemo() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [metrics, setMetrics] = useState<Metric[]>(INITIAL_METRICS);

  const handleToggleGoal = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, isCompleted: !goal.isCompleted }
        : goal
    ));
  };

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: `goal-${goals.length + 1}`,
      title: `New Goal ${goals.length + 1}`,
      isCompleted: false,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleViewDetails = () => {
    console.log("Viewing details");
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <ActivityCard
          metrics={metrics}
          dailyGoals={goals}
          onAddGoal={handleAddGoal}
          onToggleGoal={handleToggleGoal}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
}
