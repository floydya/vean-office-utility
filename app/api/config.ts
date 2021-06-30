import { machineId } from 'node-machine-id';

export const getApiURI = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://crm.vean-tattoo.com';
  }
  return 'http://0.0.0.0:8000';
};

export const buildURI = (url: string) => {
  return `${getApiURI()}${url}`;
};

export const getFetchConfiguration = async (
  token: string,
  externalData: Record<string, unknown> = {}
) => {
  return {
    ...externalData,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Hardware-ID': await machineId(),
      ...externalData.headers,
    },
  };
};

export default { getApiURI };

export class BaseAPI {
  static getFetchConfiguration(
    token: string,
    externalData: Record<string, unknown> = {}
  ) {
    return getFetchConfiguration(token, externalData);
  }
}
