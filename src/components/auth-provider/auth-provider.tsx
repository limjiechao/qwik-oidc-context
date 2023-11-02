import type { PropFunction, QRL } from '@builder.io/qwik';
import {
  $,
  component$,
  noSerialize,
  type NoSerialize,
  Slot,
  useSignal,
  useStore,
  useVisibleTask$,
} from '@builder.io/qwik';
import type {
  SignoutPopupArgs,
  SignoutRedirectArgs,
  SignoutSilentArgs,
  User,
} from 'oidc-client-ts';
import { UserManager, type UserManagerSettings } from 'oidc-client-ts';
import type { AuthContext, MaybeAuthContext } from '~/contexts/auth';
import { useProvideAuthContext } from '~/contexts/auth';
import type {
  BoundUserManagerMethods,
  StatefulNavigatorMethods,
} from '~/utils/auth';
import {
  hasAuthParams,
  loginError,
  mapToStatefulNavigatorMethods,
  shallowCloneAndBindThisToUserManagerMethods,
  shallowCloneUserManagerSettingsAndEvents,
  unsupportedEnvironmentErrorMessage,
} from '~/utils/auth';
import type { userManagerContextKeys } from '~/constants/auth';
import { initialAuthState } from '~/constants/auth';

// The auth state which, when combined with the auth methods, make up the return object of the `useAuth` hook.
export interface AuthState {
  /**
   * See [User](https://authts.github.io/oidc-client-ts/classes/User.html) for more details.
   */
  user?: User | null;

  /**
   * True when the library has been initialized and no navigator request is in progress.
   */
  isLoading?: boolean;

  /**
   * True while the user has a valid access token.
   */
  isAuthenticated?: boolean;

  /**
   * Tracks the status of most recent signin/signout request method.
   */
  activeNavigator?:
    | 'signinRedirect'
    | 'signinResourceOwnerCredentials'
    | 'signinPopup'
    | 'signinSilent'
    | 'signoutRedirect'
    | 'signoutPopup'
    | 'signoutSilent';

  /**
   * Was there a signin or silent renew error?
   */
  error?: Error;
}

export type StoreAction =
  | {
      type: 'INITIALIZATION';
    }
  | {
      type: 'INITIALISED' | 'USER_LOADED';
      user: User | null;
    }
  | {
      type: 'USER_UNLOADED';
    }
  | {
      type: 'NAVIGATOR_INIT';
      method: NonNullable<AuthState['activeNavigator']>;
    }
  | {
      type: 'NAVIGATOR_CLOSE';
    }
  | {
      type: 'ERROR';
      error: Error;
    };

export type StoreDispatch = QRL<
  (
    this: {
      auth: NoSerialize<AuthState>;
    },
    action: StoreAction
  ) => void
>;

export type Store = {
  dispatch: StoreDispatch;
  auth: NoSerialize<AuthState>;
};

export type AuthProviderProps = Pick<
  UserManagerSettings,
  'redirect_uri' | 'client_id' | 'authority'
> & {
  /**
   * On sign in callback hook. Can be a async function.
   * Here you can remove the code and state parameters from the url when you are redirected from the authorize page.
   *
   * ```jsx
   * const onSigninCallback = (_user: User | void): void => {
   *     window.history.replaceState(
   *         {},
   *         document.title,
   *         window.location.pathname
   *     )
   * }
   * ```
   */
  onSigninCallback?: PropFunction<(user: User | void) => Promise<void> | void>;

  /**
   * By default, if the page url has code/state params, this provider will call automatically the userManager.signinCallback.
   * In some cases the code might be for something else (another OAuth SDK perhaps). In these
   * instances you can instruct the client to ignore them.
   *
   * ```jsx
   * <AuthProvider
   *   skipSigninCallback={window.location.pathname === '/stripe-oauth-callback'}
   * >
   * ```
   */
  skipSigninCallback?: boolean;

  /**
   * On remove user hook. Can be a async function.
   * Here you can change the url after the user is removed.
   *
   * ```jsx
   * const onRemoveUser = (): void => {
   *     // go to home after logout
   *     window.location.pathname = ""
   * }
   * ```
   */
  onRemoveUser?: PropFunction<() => Promise<void> | void>;
};

// Provides the `AuthContext` to its child components.
const AuthProvider = component$(
  ({
    onSigninCallback,
    skipSigninCallback,
    onRemoveUser,
    redirect_uri,
    client_id,
    authority,
  }: AuthProviderProps) => {
    const userManager = useSignal<NoSerialize<UserManager>>(
      noSerialize(undefined)
    );

    useVisibleTask$(() => {
      userManager.value = noSerialize(
        new UserManager({
          redirect_uri,
          client_id,
          authority,
        })
      );
    });

    const store = useStore<Store>({
      dispatch: $(function (
        this: {
          auth: NoSerialize<AuthState>;
        },
        action: StoreAction
      ): void {
        const previousAuthState = this.auth ?? initialAuthState;

        switch (action.type) {
          case 'INITIALIZATION':
            this.auth = noSerialize({
              ...previousAuthState,
              ...initialAuthState,
            }) satisfies NoSerialize<AuthState>;
            break;
          case 'INITIALISED':
          case 'USER_LOADED':
            this.auth = noSerialize({
              ...previousAuthState,
              user: action.user,
              isLoading: false,
              isAuthenticated: action.user ? !action.user.expired : false,
              error: undefined,
            }) satisfies NoSerialize<AuthState>;
            break;
          case 'USER_UNLOADED':
            this.auth = noSerialize({
              ...previousAuthState,
              user: undefined,
              isAuthenticated: false,
            }) satisfies NoSerialize<AuthState>;
            break;
          case 'NAVIGATOR_INIT':
            this.auth = noSerialize({
              ...previousAuthState,
              isLoading: true,
              activeNavigator: action.method,
            }) satisfies NoSerialize<AuthState>;
            break;
          case 'NAVIGATOR_CLOSE':
            // we intentionally don't handle cases where multiple concurrent navigators are open
            this.auth = noSerialize({
              ...previousAuthState,
              isLoading: false,
              activeNavigator: undefined,
            }) satisfies NoSerialize<AuthState>;
            break;
          case 'ERROR':
            this.auth = noSerialize({
              ...previousAuthState,
              isLoading: false,
              error: action.error,
            }) satisfies NoSerialize<AuthState>;
            break;
          default:
            this.auth = noSerialize({
              ...previousAuthState,
              isLoading: false,
              error: new Error(`unknown type ${action['type'] as string}`),
            }) satisfies NoSerialize<AuthState>;
            break;
        }
      }),
      auth: noSerialize(undefined),
    });
    // Initialize store upon hitting browser
    useVisibleTask$(() => {
      void store.dispatch({ type: 'INITIALIZATION' });
    });

    /**
     * NOTE: Implied type declaration from `react-oidc-context`
     * FIXME: Remove this commented code once we're confident
     */
    // type UserManagerContext = {
    //   settings: AuthContext['settings'];
    //   events: AuthContext['events'];
    // } & Pick<UserManager, (typeof userManagerContextKeys)[number]> &
    //   Pick<UserManager, (typeof navigatorKeys)[number]>;

    type UserManagerContext = {
      settings: AuthContext['settings'];
      events: AuthContext['events'];
    } & BoundUserManagerMethods &
      StatefulNavigatorMethods;
    const userManagerContext = useSignal<NoSerialize<UserManagerContext>>();
    // Initialize user manager context
    useVisibleTask$(() => {
      if (!userManager.value) throw new Error('`userManager` is undefined');
      const _userManager = userManager.value;

      const userManagerSettingsAndEvents =
        shallowCloneUserManagerSettingsAndEvents(_userManager);

      const userManagerMethods = shallowCloneAndBindThisToUserManagerMethods(
        _userManager
      ) satisfies Pick<UserManager, (typeof userManagerContextKeys)[number]>;

      const statefulNavigationMethods = mapToStatefulNavigatorMethods(
        store,
        _userManager
      );

      userManagerContext.value = noSerialize({
        ...userManagerSettingsAndEvents,
        ...userManagerMethods,
        ...statefulNavigationMethods,
      } satisfies UserManagerContext);
    });

    const didInitialize = useSignal(false);
    // Check if returning back from authority server
    useVisibleTask$(({ track }) => {
      // Dependency array: [userManager, skipSigninCallback, onSigninCallback]
      track(() => [userManager.value, skipSigninCallback, onSigninCallback]);

      if (!userManager.value || didInitialize.value) return;
      didInitialize.value = true;

      void (async (): Promise<void> => {
        let user: User | void | null = null;
        try {
          if (!userManager.value) return;

          // Check if returning back from authority server
          if (hasAuthParams() && !skipSigninCallback) {
            user = await userManager.value.signinCallback();
            onSigninCallback && (await onSigninCallback(user));
          }
          user = !user ? await userManager.value.getUser() : user;

          await store.dispatch({ type: 'INITIALISED', user });
        } catch (error) {
          await store.dispatch({ type: 'ERROR', error: loginError(error) });
        }
      })();
    });

    // Register to `userManager` events
    useVisibleTask$(({ track, cleanup }) => {
      // Dependency array: [userManager]
      track(() => [userManager.value]);

      if (!userManager.value) return undefined;

      // event `UserLoaded` (e.g. initial load, silent renew success)
      const handleUserLoaded = (user: User) => {
        void store.dispatch({ type: 'USER_LOADED', user });
      };
      userManager.value.events.addUserLoaded(handleUserLoaded);

      // event `UserUnloaded` (e.g. userManager.removeUser)
      const handleUserUnloaded = () => {
        void store.dispatch({ type: 'USER_UNLOADED' });
      };
      userManager.value.events.addUserUnloaded(handleUserUnloaded);

      // event `SilentRenewError` (silent renew error)
      const handleSilentRenewError = (error: Error) => {
        void store.dispatch({ type: 'ERROR', error });
      };
      userManager.value.events.addSilentRenewError(handleSilentRenewError);

      cleanup(() => {
        if (!userManager.value) return;

        userManager.value.events.removeUserLoaded(handleUserLoaded);
        userManager.value.events.removeUserUnloaded(handleUserUnloaded);
        userManager.value.events.removeSilentRenewError(handleSilentRenewError);
      });
    });

    const authContext = useSignal<NoSerialize<MaybeAuthContext>>();

    useVisibleTask$(({ track }) => {
      track(() => [userManagerContext.value, store.auth]);

      if (!userManagerContext.value) return;
      if (!store.auth) return;

      const _userManagerContext = userManagerContext.value;
      const _storeAuth = store.auth;

      // Dependency array: [userManager, onRemoveUser]
      const removeUser = () => {
        if (!userManager.value)
          throw new Error(unsupportedEnvironmentErrorMessage('removeUser'));

        const _userManager = userManager.value;

        return _userManager.removeUser().then(onRemoveUser);
      };

      // Dependency array: [userManagerContext.signoutRedirect, onSignoutRedirect]
      const signoutRedirect = (args: SignoutRedirectArgs) =>
        _userManagerContext.signoutRedirect(args);

      // Dependency array: [userManagerContext.signoutPopup, onSignoutPopup]
      const signoutPopup = (args: SignoutPopupArgs) =>
        _userManagerContext.signoutPopup(args);

      // Dependency array: [userManagerContext.signoutSilent]
      const signoutSilent = (args: SignoutSilentArgs) =>
        _userManagerContext.signoutSilent(args);

      authContext.value = noSerialize({
        ..._storeAuth,
        ..._userManagerContext,
        removeUser,
        signoutRedirect,
        signoutSilent,
        signoutPopup,
      });
    });

    useProvideAuthContext(authContext);

    return (
      <>
        <Slot />
        <pre>{JSON.stringify(store.auth, null, 4)}</pre>
        <pre>{JSON.stringify(userManagerContext.value, null, 4)}</pre>
      </>
    );
  }
);

export default AuthProvider;
