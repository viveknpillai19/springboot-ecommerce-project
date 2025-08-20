import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { clsx } from 'clsx';
import UserManagement from '../components/Admin/UserManagement';
import ProductManagement from '../components/Admin/ProductManagement';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Admin() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { name: 'Products', component: ProductManagement },
    { name: 'Users', component: UserManagement },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary-100 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                clsx(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-primary-700 shadow'
                    : 'text-primary-600 hover:bg-white/[0.12] hover:text-primary-700'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx} className="focus:outline-none">
              <tab.component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}