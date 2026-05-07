import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import { TabPanels } from 'src/components/Tabs/TabPanels';
import { Tabs } from 'src/components/Tabs/Tabs';
import { TanStackTabLinkList } from 'src/components/Tabs/TanStackTabLinkList';
import { useTabs } from 'src/hooks/useTabs';

import { SuspenseLoader } from '../../Shared/SuspenseLoader/SuspenseLoader';

// TODO: Implement Manage SSO Enforcement page shell (breadcrumb, header, tabs)
export const SSOLanding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tabs, tabIndex, handleTabChange } = useTabs([
    {
      to: '/iam/login-settings/sso/idp-configurations',
      title: 'IDP Configurations',
    },
    {
      to: '/iam/login-settings/sso/enforcement-settings',
      title: 'Enforcement Settings',
    },
  ]);

  if (location.pathname === '/iam/login-settings/sso') {
    navigate({
      to: '/iam/login-settings/sso/idp-configurations',
      replace: true,
    });
  }

  return (
    <Tabs index={tabIndex} onChange={handleTabChange}>
      <TanStackTabLinkList tabs={tabs} />
      <React.Suspense fallback={<SuspenseLoader />}>
        <TabPanels>
          <Outlet />
        </TabPanels>
      </React.Suspense>
    </Tabs>
  );
};
