// src/types/Job.ts

export interface Job {
  id?: number;          // optional because backend generates this
  companyName: string;
  jobTitle: string;
  status: string;
  appliedDate: string;  // ISO date string (e.g. "2025-05-14")
  notes?: string;       // optional notes
}
