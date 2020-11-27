import { buildURI } from './config';

interface UserCredentials {
  username: string;
  password: string;
}

export default class UserAPI {
  static async authorize(credentials: UserCredentials) {
    const response = await fetch(buildURI('/api/v1/auth/jwt/obtain/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...credentials, parlor: null }),
    });
    return [response.status, await response.json()];
  }

  static async fetchCurrentUser(token: string) {
    const response = await fetch(buildURI('/api/v1/auth/current/'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return [response.status, await response.json()];
  }
}
