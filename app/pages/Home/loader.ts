// remix stuff
import {
  json,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { SerializeFrom } from '@remix-run/node'
// App specific
import {
  AddressOperationError,
  AppointmentOperationError,
  CustomerOperationError,
} from '@errors';

import { address_find_all } from '@address';
import { appointment_find_many } from '@appointment';
import { customer_find_many } from '@customer';

export type homeLoaderDataType = SerializeFrom<typeof loader>

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const customersLoaderData = await customer_find_many({
      addresses: true,
      appointments: true,
  });

  if (
      !customersLoaderData ||
      customersLoaderData instanceof CustomerOperationError ||
      customersLoaderData instanceof AddressOperationError ||
      customersLoaderData instanceof AppointmentOperationError
  ) {
      throw new Response('Customers Not Found', { status: 404 });
  }

  const appointmentsLoaderData = await appointment_find_many({
      address: true,
      customer: true,
  });
  if (
      !appointmentsLoaderData ||
      appointmentsLoaderData instanceof CustomerOperationError ||
      appointmentsLoaderData instanceof AddressOperationError ||
      appointmentsLoaderData instanceof AppointmentOperationError
  ) {
      throw new Response('Appointments Not Found', { status: 404 });
  }

  // const addressesLoaderData = [];
  const addressesLoaderData = await address_find_all({
      customer: true,
      appointments: true,
  });
  if (
      !addressesLoaderData ||
      addressesLoaderData instanceof CustomerOperationError ||
      addressesLoaderData instanceof AddressOperationError ||
      addressesLoaderData instanceof AppointmentOperationError
  ) {
      throw new Response('addresses Not Found', { status: 404 });
  }
  
  return json({
      customersLoaderData,
      addressesLoaderData,
      appointmentsLoaderData,
  });
};

export type loaderType = typeof loader;
