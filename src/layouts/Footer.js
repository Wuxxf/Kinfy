import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'Kinfy 首页',
          title: 'Kinfy 首页',
          href: 'https://github.com/Wuxxf/Kinfy',
          blankTarget: true,
        },
        {
          key: '联系我们',
          title: <Icon type="customer-service" />,
          href: 'https://github.com/Wuxxf/Kinfy',
          blankTarget: true,
        },
        {
          key: 'Kinfy 官网',
          title: 'Kinfy 官网',
          href: 'https://github.com/Wuxxf/Kinfy',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 温州职业技术学院
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
