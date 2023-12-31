import { component$, Slot } from '@builder.io/qwik';
import { AuthProvider } from '~/services/oidc';

const oidcConfig = {
  authority: '<your authority>',
  client_id: '<your client id>',
  redirect_uri: '<your redirect uri>',
};

export default component$(() => {
  return (
    <AuthProvider {...oidcConfig}>
      <main>
        <Slot />
      </main>
    </AuthProvider>
  );
});
