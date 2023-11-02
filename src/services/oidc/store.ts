import type { NoSerialize, QRL } from '@builder.io/qwik';
import type { User } from 'oidc-client-ts';
import type { AuthState } from '~/services/oidc/state';

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
