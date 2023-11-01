export const initialAuthState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
} as const;

export const userManagerContextKeys = [
  "clearStaleState",
  "querySessionStatus",
  "revokeTokens",
  "startSilentRenew",
  "stopSilentRenew",
] as const;

export const navigatorKeys = [
  "signinPopup",
  "signinSilent",
  "signinRedirect",
  "signinResourceOwnerCredentials",
  "signoutPopup",
  "signoutRedirect",
  "signoutSilent",
] as const;
