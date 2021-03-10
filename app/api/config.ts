import { machineId } from 'node-machine-id';

export const getApiURI = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://crm.vean-tattoo.com';
  }
  return 'https://crm.vean-tattoo.com';
};

export const buildURI = (url: string) => {
  return `${getApiURI()}${url}`;
};

export default { getApiURI };

export class BaseAPI {
  static async getFetchConfiguration(
    token: string,
    externalData: Record<string, unknown> = {}
  ) {
    return {
      ...externalData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Hardware-ID': await machineId(),
        ...externalData.headers,
      },
    };
  }
}
