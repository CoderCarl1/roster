// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Tperson } from "@/types";

const customers: Tperson[] = [
  {
    id: "1",
    fName: "John",
    lName: "Doe",
    address: [
      {
        personID: "1",
        number: "123",
        street: "Main St",
        streetType: "Ave",
        suburb: "Anytown",
        state: "CA",
        postcode: "12345",
      },
    ],
  },
  {
    id: "2",
    fName: "Jane",
    lName: "Smith",
    address: [
      {
        personID: "2",
        number: "456",
        street: "Broadway",
        streetType: "St",
        suburb: "Sometown",
        state: "NY",
        postcode: "54321",
      },
      {
        personID: "2",
        number: "789",
        street: "5th Ave",
        streetType: "Ave",
        suburb: "Othertown",
        state: "NY",
        postcode: "67890",
      },
    ],
  },
  {
    id: "3",
    fName: "Bob",
    lName: "Johnson",
    address: [
      {
        personID: "3",
        number: "321",
        street: "Oak St",
        streetType: "Rd",
        suburb: "Smalltown",
        state: "IL",
        postcode: "54321",
      },
    ],
  },
  {
    id: "4",
    fName: "Sarah",
    lName: "Williams",
    address: [
      {
        personID: "4",
        number: "456",
        street: "Park Ave",
        streetType: "Blvd",
        suburb: "Cityville",
        state: "CA",
        postcode: "98765",
      },
    ],
  },
  {
    id: "5",
    fName: "Mike",
    lName: "Lee",
    address: [
      {
        personID: "5",
        number: "789",
        street: "Maple St",
        streetType: "Dr",
        suburb: "Ruraltown",
        state: "TX",
        postcode: "34567",
      },
    ],
  },
];


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tperson[]>
) {
  res.status(200).json(customers)
}
