import type { AuthState } from '~/services/oidc';
import type { UserManager } from 'oidc-client-ts';
import type { ArrayItem } from '~/utils/type-helpers';

export const INITIAL_AUTH_STATE: AuthState = {
  isLoading: true,
  isAuthenticated: false,
} as const satisfies AuthState;

export const CLEAR_STALE_STATE = 'clearStaleState';
export const QUERY_SESSION_STATUS = 'querySessionStatus';
export const REVOKE_TOKENS = 'revokeTokens';
export const START_SILENT_RENEW = 'startSilentRenew';
export const STOP_SILENT_RENEW = 'stopSilentRenew';

export const USER_MANAGER_CONTEXT_KEYS = [
  CLEAR_STALE_STATE,
  QUERY_SESSION_STATUS,
  REVOKE_TOKENS,
  START_SILENT_RENEW,
  STOP_SILENT_RENEW,
] as const satisfies Readonly<(keyof UserManager)[]>;

export type UserManagerContextKey = ArrayItem<typeof USER_MANAGER_CONTEXT_KEYS>;

export const SIGNIN_POPUP = 'signinPopup';
export const SIGNIN_SILENT = 'signinSilent';
export const SIGNIN_REDIRECT = 'signinRedirect';
export const SIGNIN_RESOURCE_OWNER_CREDENTIALS =
  'signinResourceOwnerCredentials';
export const SIGNOUT_POPUP = 'signoutPopup';
export const SIGNOUT_REDIRECT = 'signoutRedirect';
export const SIGNOUT_SILENT = 'signoutSilent';

export const NAVIGATOR_KEYS = [
  SIGNIN_POPUP,
  SIGNIN_SILENT,
  SIGNIN_REDIRECT,
  SIGNIN_RESOURCE_OWNER_CREDENTIALS,
  SIGNOUT_POPUP,
  SIGNOUT_REDIRECT,
  SIGNOUT_SILENT,
] as const satisfies Readonly<(keyof UserManager)[]>;
export type NavigatorKey = ArrayItem<typeof NAVIGATOR_KEYS>;
