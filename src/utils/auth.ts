export const hasAuthParams = (location = window.location): boolean => {
  // response_mode: query
  let searchParams = new URLSearchParams(location.search);
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }

  // response_mode: fragment
  searchParams = new URLSearchParams(location.hash.replace("#", "?"));
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }

  return false;
};

export const normalizeError =
  (fallbackMessage: string) =>
  (error: unknown): Error => {
    if (error instanceof Error) {
      return error;
    }
    return new Error(fallbackMessage);
  };

export const loginError = normalizeError("Login failed");

export const unsupportedEnvironmentErrorMessage = (methodName: string) =>
  `UserManager#${methodName} was called from an unsupported context. If this is a server-rendered page, defer this call with useEffect() or pass a custom UserManager implementation.`;

export const throwUnsupportedEnvironmentError = (methodName: string) => () => {
  throw new Error(unsupportedEnvironmentErrorMessage(methodName));
};
