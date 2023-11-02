import type { NoSerialize, Signal } from '@builder.io/qwik';
import {
  createContextId,
  useContext,
  useContextProvider,
} from '@builder.io/qwik';
import type {
  UserManagerSettings,
  UserManagerEvents,
  User,
  SessionStatus,
  SigninPopupArgs,
  SigninSilentArgs,
  SigninRedirectArgs,
  SignoutRedirectArgs,
  SignoutPopupArgs,
  QuerySessionStatusArgs,
  RevokeTokensTypes,
  SignoutSilentArgs,
  SigninResourceOwnerCredentialsArgs,
} from 'oidc-client-ts';
import type { AuthState } from '~/components/auth-provider/auth-provider';

export interface AuthContext extends AuthState {
  /**
   * UserManager functions. See [UserManager](https://github.com/authts/oidc-client-ts) for more details.
   */
  readonly settings: UserManagerSettings;
  readonly events: UserManagerEvents;

  clearStaleState(): Promise<void>;

  removeUser(): Promise<void>;

  signinPopup(args?: SigninPopupArgs): Promise<User | null>;

  signinSilent(args?: SigninSilentArgs): Promise<User | null>;

  signinRedirect(args?: SigninRedirectArgs): Promise<void | null>;

  signinResourceOwnerCredentials(
    args: SigninResourceOwnerCredentialsArgs
  ): Promise<User | null>;

  signoutRedirect(args?: SignoutRedirectArgs): Promise<void | null>;

  signoutPopup(args?: SignoutPopupArgs): Promise<void | null>;

  signoutSilent(args?: SignoutSilentArgs): Promise<void | null>;

  querySessionStatus(
    args?: QuerySessionStatusArgs
  ): Promise<SessionStatus | null>;

  revokeTokens(types?: RevokeTokensTypes): Promise<void>;

  startSilentRenew(): void;

  stopSilentRenew(): void;
}

export type MaybeAuthContext = AuthContext | undefined;
export type AuthContextSignal = Signal<NoSerialize<MaybeAuthContext>>;

// Context ID
export const AuthContext = createContextId<AuthContextSignal>('AUTH_CONTEXT');

// Context consumer
export const useAuthContext = () => useContext(AuthContext);

// Context provider
export const useProvideAuthContext = (newValue: AuthContextSignal) =>
  useContextProvider(AuthContext, newValue);
