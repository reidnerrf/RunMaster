export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Wellness: undefined;
  Community: undefined;
  Mentorship: undefined;
  Explorer: undefined;
  Social: undefined;
  Stats: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Run: { from?: 'Home' | 'Workouts' } | undefined;
  Upgrade: { source?: string } | undefined;
  ConnectSpotify: undefined;
  ConnectWatch: undefined;
  // changed param to { id: string } to align with screens navigating with { id }
  RouteDetail: { id: string };
  SavedRoutes: undefined;
  RunSummary: { runId: string };
  Registration: undefined;
  MentorApplication: undefined;
};