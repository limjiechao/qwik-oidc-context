export const normalizeError =
  (fallbackMessage: string) =>
  (error: unknown): Error => {
    if (error instanceof Error) {
      return error;
    }
    return new Error(fallbackMessage);
  };

export const loginError = normalizeError('Login failed');

export const unsupportedEnvironmentErrorMessage = (methodName: string) =>
  `UserManager#${methodName} was called from an unsupported context. If this is a server-rendered page, defer this call with useEffect() or pass a custom UserManager implementation.`;
