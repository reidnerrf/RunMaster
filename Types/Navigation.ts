export type AuthStackParamList = {
  Onboarding?: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  PostSignup?: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
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
  Goals: undefined;
  CreateRoute: undefined;
  PostSignup: undefined;
};