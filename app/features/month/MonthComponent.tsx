import { Result, Button } from 'antd';
import * as React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import LayoutApp from '../../containers/Layout';

export default function MonthComponent() {
  return (
    <LayoutApp>
      <Result
        icon={<SmileOutlined />}
        title="Раздел находится в разработке!"
        extra={<Button type="primary">Next</Button>}
      />
    </LayoutApp>
  );
}
