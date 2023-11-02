import type {
  ProcessResourceOwnerPasswordCredentialsArgs,
  SigninPopupArgs,
  SigninRedirectArgs,
  SigninSilentArgs,
  SignoutPopupArgs,
  SignoutRedirectArgs,
  SignoutSilentArgs,
  UserManager,
} from 'oidc-client-ts';
import type { NavigatorKey, UserManagerContextKey } from '~/services/oidc';
import {
  CLEAR_STALE_STATE,
  QUERY_SESSION_STATUS,
  REVOKE_TOKENS,
  SIGNIN_POPUP,
  SIGNIN_REDIRECT,
  SIGNIN_RESOURCE_OWNER_CREDENTIALS,
  SIGNIN_SILENT,
  SIGNOUT_POPUP,
  SIGNOUT_REDIRECT,
  SIGNOUT_SILENT,
  START_SILENT_RENEW,
  STOP_SILENT_RENEW,
  unsupportedEnvironmentErrorMessage,
} from '~/services/oidc';
import type { Store } from '~/services/oidc';
import type { AuthContext } from '~/services/oidc';

export const shallowCloneUserManagerSettingsAndEvents = (
  userManager: UserManager
) =>
  ({
    settings: userManager.settings,
    events: userManager.events,
  }) as const;

/**
 * NOTE: We are faithfully refactoring `react-oidc-context`.
 *
 * When we better understand what's happening under the hood
 * we will remove truly unnecessary checks
 */
export const shallowCloneAndBindThisToUserManagerMethods = (
  userManager: UserManager
) => {
  const CLEAR_STALE_STATE_METHOD =
    userManager[CLEAR_STALE_STATE].bind(userManager);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!CLEAR_STALE_STATE_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(CLEAR_STALE_STATE));

  const QUERY_SESSION_STATUS_METHOD =
    userManager[QUERY_SESSION_STATUS].bind(userManager);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!QUERY_SESSION_STATUS_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(QUERY_SESSION_STATUS));

  const REVOKE_TOKENS_METHOD = userManager[REVOKE_TOKENS].bind(userManager);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!REVOKE_TOKENS_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(REVOKE_TOKENS));

  const START_SILENT_RENEW_METHOD =
    userManager[START_SILENT_RENEW].bind(userManager);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!START_SILENT_RENEW_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(START_SILENT_RENEW));

  const STOP_SILENT_RENEW_METHOD =
    userManager[STOP_SILENT_RENEW].bind(userManager);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!STOP_SILENT_RENEW_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(STOP_SILENT_RENEW));

  return {
    [CLEAR_STALE_STATE]: userManager[CLEAR_STALE_STATE],
    [QUERY_SESSION_STATUS]: userManager[QUERY_SESSION_STATUS],
    [REVOKE_TOKENS]: userManager[REVOKE_TOKENS],
    [START_SILENT_RENEW]: userManager[START_SILENT_RENEW],
    [STOP_SILENT_RENEW]: userManager[STOP_SILENT_RENEW],
  } as const satisfies {
    [Key in UserManagerContextKey]: UserManager[Key];
  };
};
export type BoundUserManagerMethods = ReturnType<
  typeof shallowCloneAndBindThisToUserManagerMethods
>;

export const mapToStatefulNavigatorMethods = (
  store: Store,
  userManager: UserManager
) => {
  const SIGNIN_POPUP_METHOD = async (args: SigninPopupArgs) => {
    try {
      return await userManager[SIGNIN_POPUP](args);
    } catch (error) {
      await store.dispatch({
        type: 'ERROR',
        error: error as Error,
      });

      return null;
    } finally {
      await store.dispatch({ type: 'NAVIGATOR_CLOSE' });
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!SIGNIN_POPUP_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(SIGNIN_POPUP));

  const SIGNIN_SILENT_METHOD = async (args: SigninSilentArgs) => {
    try {
      return await userManager[SIGNIN_SILENT](args);
    } catch (error) {
      await store.dispatch({
        type: 'ERROR',
        error: error as Error,
      });

      return null;
    } finally {
      await store.dispatch({ type: 'NAVIGATOR_CLOSE' });
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!SIGNIN_SILENT_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(SIGNIN_SILENT));

  const SIGNIN_REDIRECT_METHOD = async (args: SigninRedirectArgs) => {
    try {
      return await userManager[SIGNIN_REDIRECT](args);
    } catch (error) {
      await store.dispatch({
        type: 'ERROR',
        error: error as Error,
      });

      return null;
    } finally {
      await store.dispatch({ type: 'NAVIGATOR_CLOSE' });
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!SIGNIN_REDIRECT_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(SIGNIN_REDIRECT));

  const SIGNIN_RESOURCE_OWNER_CREDENTIALS_METHOD = async (
    args: ProcessResourceOwnerPasswordCredentialsArgs
  ) => {
    try {
      return await userManager[SIGNIN_RESOURCE_OWNER_CREDENTIALS](args);
    } catch (error) {
      await store.dispatch({
        type: 'ERROR',
        error: error as Error,
      });

      return null;
    } finally {
      await store.dispatch({ type: 'NAVIGATOR_CLOSE' });
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!SIGNIN_RESOURCE_OWNER_CREDENTIALS_METHOD)
    throw new Error(
      unsupportedEnvironmentErrorMessage(SIGNIN_RESOURCE_OWNER_CREDENTIALS)
    );

  const SIGNOUT_REDIRECT_METHOD = async (args: SignoutRedirectArgs) => {
    try {
      return await userManager[SIGNOUT_REDIRECT](args);
    } catch (error) {
      await store.dispatch({
        type: 'ERROR',
        error: error as Error,
      });

      return null;
    } finally {
      await store.dispatch({ type: 'NAVIGATOR_CLOSE' });
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!SIGNOUT_REDIRECT_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(SIGNOUT_REDIRECT));

  const SIGNOUT_POPUP_METHOD = async (args: SignoutPopupArgs) => {
    try {
      return await userManager[SIGNOUT_POPUP](args);
    } catch (error) {
      await store.dispatch({
        type: 'ERROR',
        error: error as Error,
      });

      return null;
    } finally {
      await store.dispatch({ type: 'NAVIGATOR_CLOSE' });
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!SIGNOUT_POPUP_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(SIGNOUT_POPUP));

  const SIGNOUT_SILENT_METHOD = async (args: SignoutSilentArgs) => {
    try {
      return await userManager[SIGNOUT_SILENT](args);
    } catch (error) {
      await store.dispatch({
        type: 'ERROR',
        error: error as Error,
      });

      return null;
    } finally {
      await store.dispatch({ type: 'NAVIGATOR_CLOSE' });
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!SIGNOUT_SILENT_METHOD)
    throw new Error(unsupportedEnvironmentErrorMessage(SIGNOUT_SILENT));

  return {
    [SIGNIN_POPUP]: SIGNIN_POPUP_METHOD,
    [SIGNIN_SILENT]: SIGNIN_SILENT_METHOD,
    [SIGNIN_REDIRECT]: SIGNIN_REDIRECT_METHOD,
    [SIGNIN_RESOURCE_OWNER_CREDENTIALS]:
      SIGNIN_RESOURCE_OWNER_CREDENTIALS_METHOD,
    [SIGNOUT_POPUP]: SIGNOUT_POPUP_METHOD,
    [SIGNOUT_REDIRECT]: SIGNOUT_REDIRECT_METHOD,
    [SIGNOUT_SILENT]: SIGNOUT_SILENT_METHOD,
  } as const satisfies {
    [Key in NavigatorKey]: AuthContext[Key];
  };
};
export type StatefulNavigatorMethods = ReturnType<
  typeof mapToStatefulNavigatorMethods
>;
