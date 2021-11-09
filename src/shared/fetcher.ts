import { addOriginToApiPath } from 'shared/helpers/url';

export const fetcher = async <T = unknown>(path: string, options?: RequestInit): Promise<T>  => {
  let fetchImplementation = fetch;

  // TODO: Вернуть как было!
  // if (process.env.NODE_ENV === 'development') {
  //   fetchImplementation = (await import('mocks/fetch-mock')).default;
  // }

  // TODO: Временный хардкод для Vercel
  fetchImplementation = (await import('mocks/fetch-mock')).default;

  const response = await fetchImplementation(addOriginToApiPath(path), options);

  if (response.ok) {
    const data = await response.json();

    return data;
  }

  throw new Error('Invalid response');
};
