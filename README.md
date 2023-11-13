# Schedule App

This application has been designed for a small business that mows and maintains gardens for their clients.

There is limited need for data outside of scheduling and basic customer data - SQLite was considered the best option for this purpose and ease within development

To keep the app light and to ensure a good dev experience, the application has been written in [Remix Run](https://remix.run/) which uses web APIs to minimize code that is delivered on the front end along with React and React Router.

Testing has been done with a combination of Jest and Cypress

### How to use

If you want to see how this app works, either locally or online, please ensure that you migrate and seed the database by running the npm script `db:setup`

## Requirements of the client

The business requires

- Customer information
  - Addresses
  - Contacts
- Appointments
  - They need to be rescheduled regularly due to appointments running over time
  - notifications to clients
  - records for invoicing/ auditing purposes
- Addresses
- Auth login
