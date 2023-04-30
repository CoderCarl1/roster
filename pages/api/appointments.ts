import type { NextApiRequest, NextApiResponse } from 'next'
import type { Tappointment } from "@/types";

const today = new Date().toISOString().slice(0, 10);

const appointments: Tappointment[] = [
  {
    id: "1",
    customerId: "1",
    startTime: new Date(`${today}T09:00:00`).toISOString(),
    endTime: new Date(`${today}T09:45:00`).toISOString(),
  },
  {
    id: "2",
    customerId: "2",
    startTime: new Date(`${today}T10:30:00`).toISOString(),
    endTime: new Date(`${today}T11:00:00`).toISOString(),
  },
  {
    id: "3",
    customerId: "3",
    startTime: new Date(`${today}T13:00:00`).toISOString(),
    endTime: new Date(`${today}T14:00:00`).toISOString(),
  },
  {
    id: "4",
    customerId: "4",
    startTime: new Date(`${today}T14:30:00`).toISOString(),
    endTime: new Date(`${today}T15:00:00`).toISOString(),
  },
  {
    id: "5",
    customerId: "5",
    startTime: new Date(`${today}T16:00:00`).toISOString(),
    endTime: new Date(`${today}T17:00:00`).toISOString(),
  },
];


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tappointment[]>
) {
  res.status(200).json(appointments)
}