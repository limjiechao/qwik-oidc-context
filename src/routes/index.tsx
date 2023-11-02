import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useAuthContext } from '~/services/oidc';

export default component$(() => {
  const authContext = useAuthContext();

  if (!authContext.value || authContext.value.isLoading) {
    return <div>Loading...</div>;
  }

  if (authContext.value.error) {
    return <div>Oops... {authContext.value.error.message}</div>;
  }

  if (authContext.value.isAuthenticated) {
    return (
      <div>
        Hello {authContext.value.user?.profile.sub}{' '}
        <button
          onClick$={() => {
            if (!authContext.value)
              throw new Error('`authContext.value` is not defined');

            void authContext.value.removeUser();
          }}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick$={() => {
          if (!authContext.value)
            throw new Error('`authContext.value` is not defined');

          void authContext.value.signinRedirect();
        }}
      >
        Log in
      </button>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
