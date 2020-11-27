/* eslint-disable @typescript-eslint/naming-convention */
import { PageHeader } from 'antd';
import * as React from 'react';
import SettingsComponent from '../features/settings/SettingsComponent';
import LayoutApp from './Layout';

export default function SettingsPage() {
  return (
    <LayoutApp>
      <PageHeader title="Настройки приложения" />
      <SettingsComponent />
    </LayoutApp>
  );
}
