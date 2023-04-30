import type { Tappointment, Tperson } from "@/types";

type Props = {
  time: string;
  appointment: Tappointment | undefined;
  customer?: Tperson;
};

const AppointmentRow: React.FC<Props> = ({ time, appointment, customer }) => {
  return (
    <tr>
      <td>{time}</td>
      <td>{appointment && customer ? `${customer?.fName} ${customer?.lName}` : "-"}</td>
    </tr>
  );
};

export default AppointmentRow;