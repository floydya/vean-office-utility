/* eslint-disable @typescript-eslint/naming-convention */
import { Layout } from 'antd';
import * as React from 'react';
import SettingsComponent from '../features/settings/SettingsComponent';

export default function ConfigurationPage() {
  return (
    <Layout>
      <Layout.Header>
        <h1>Предварительная настройка программы</h1>
      </Layout.Header>
      <Layout.Content>
        <SettingsComponent configuration />
      </Layout.Content>
      <Layout.Footer>
        <p>Все данные сохраняются автоматически при изменении.</p>
        <p>Эти настройки можно будет изменить позже.</p>
      </Layout.Footer>
    </Layout>
  );
}
