export interface RecommendData {
  targetCareer: {
    title: string;
    description: string;
    reasoning: string;
  };
  programs: Array<{
    name: string;
    reasoning: string;
  }>;
  institutes: Array<{
    name: string;
    bio: string;
    url: string;
  }>;
  marketInsights: {
    salaryTrend: string;
    jobDemand: string;
    summary: string;
  };
  roadmap: Array<{
    phase: string;
    description: string;
  }>;
}

export interface FormData {
  topSubjects: string;
  passionSubject: string;
  workPreference: string;
  location: string;
  relocate: boolean;
}
