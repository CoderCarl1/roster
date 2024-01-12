import { type MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
      { title: 'Schedule App' },
      {
          name: 'description',
          content: 'An app to schedule gardening appointments',
      },
  ];
};
