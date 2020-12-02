import { BaseAPI, buildURI } from './config';

export default class TimerAPI extends BaseAPI {
  static async fetchTimer(token: string, date: string) {
    const response = await fetch(
      buildURI(`/api/v1/activity/${date}`),
      await this.getFetchConfiguration(token)
    );
    return [response.status, await response.json()];
  }

  static async toggleTimer(token: string, date: string) {
    const response = await fetch(
      buildURI(`/api/v1/activity/${date}/`),
      await this.getFetchConfiguration(token, { method: 'POST' })
    );
    return [response.status, await response.json()];
  }

  static async finishLastDay(
    token: string,
    date: string,
    finishedTime: string
  ) {
    const response = await fetch(
      buildURI(`/api/v1/activity/${date}/`),
      await this.getFetchConfiguration(token, {
        method: 'PATCH',
        body: JSON.stringify({ end_at: finishedTime }),
      })
    );
    return [response.status, await response.json()];
  }
}
