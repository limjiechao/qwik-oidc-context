const checkHasAuthParams = (searchParams: URLSearchParams) => {
  const hasCodeOrError = Boolean(
    searchParams.get('code') || searchParams.get('error')
  );
  const hasState = Boolean(searchParams.get('state'));

  return hasCodeOrError && hasState;
};

export const hasAuthParams = (location = window.location): boolean => {
  // response_mode: query
  const queryModeSearchParams = new URLSearchParams(location.search);
  const queryModeHasAuthParams = checkHasAuthParams(queryModeSearchParams);

  // response_mode: fragment
  const fragmentModeSearchParams = new URLSearchParams(
    location.hash.replace('#', '?')
  );
  const fragmentModeHasAuthParams = checkHasAuthParams(
    fragmentModeSearchParams
  );

  return queryModeHasAuthParams || fragmentModeHasAuthParams;
};
