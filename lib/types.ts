export type CategoryId =
  | "core"
  | "productivity"
  | "integration"
  | "platform"
  | "security"
  | "dx";

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
}

export interface Feature {
  id: string;
  title: string;
  summary: string;
  details: string;
  category: CategoryId;
  date: string; // YYYY-MM-DD
  version: string;
  importance: 1 | 2 | 3 | 4 | 5;
  usability: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  docUrl: string;
}

export interface FeaturesData {
  meta: {
    source: string;
    lastUpdated: string;
    currentVersion: string;
  };
  categories: Category[];
  features: Feature[];
}

export type SortMode = "date" | "importance" | "usability";
