export type ItemType = 'TASK' | 'HABIT';

export interface GrindItem {
  id: string;
  title: string;
  value: number;
  type: ItemType;
  createdAt: number;
  completedAt?: number | null; // For tasks
  lastCompletedDate?: string | null; // For habits (YYYY-MM-DD)
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
}

export interface Goal {
  title: string;
  targetAmount: number;
}

export interface AppState {
  balance: number;
  goal: Goal;
  items: GrindItem[];
  rewards: RewardItem[];
}