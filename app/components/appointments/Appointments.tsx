import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { Appointment_Card, useAppointments } from '@components';
import {
    addFullAddressToAppointment,
    addFullName,
    dates,
    useToggle,
} from '@functions';
import {
    TAppointment,
    TAppointmentWithCustomerName,
    TAppointmentWithCustomerNameAndFullAddress,
} from '@types';
import { loaderType } from '~/routes/_index';
import Table, { Caption, Row, TD, TH } from '../table/table';
import Calendar from '../calendar/calendar';

function Main() {
    const data = useLoaderData<loaderType>();
    const appointmentsLoaderData = data.appointmentsLoaderData as unknown as TAppointment[];
    const {
        setAppointment,
        currentAppointment,
        setAppointmentsData,
        appointmentsData
    } = useAppointments();
    
    useEffect(() => {
        console.log("35 - appointments.tsx useEffect");
        console.log("adding customerName and fullAddress to each appointment");

        const appointmentsWithCustomerName = appointmentsLoaderData.map(
            (appointment) => {
                let updatedAppointment = addFullName(appointment) as TAppointmentWithCustomerName;
                return addFullAddressToAppointment(updatedAppointment) as TAppointmentWithCustomerNameAndFullAddress;
            }
        );
        setAppointmentsData(appointmentsWithCustomerName);
    }, []);

    if (appointmentsData && appointmentsData.length){
        // return <Calendar type="day" />
        // return <Calendar type="week" />
        return <Calendar type="month" />

    }
    // return (
        // {appointmentsData && <Calendar type="day" />}
        // {appointmentsData && <Calendar type="week" />}

    //     <Appointments
    //         className={currentAppointment ? 'disabled' : ''}
    //     >
    //     {currentAppointment ? (
    //         <Appointment_Card
    //             clearAppointment={setAppointment}
    //             appointment={currentAppointment}
    //         />
    //     ) : null}
    // </Appointments>
        
    // );
}

// type appointmentProps = {
//     children?: React.ReactNode;
// } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

// function Appointments({
//     children,
//     ...props
// }: appointmentProps) {

//     const {appointmentsData, setAppointment} = useAppointments()
//     return (
//         <section  {...props} className={"section-wrapper" + props.className}>
//             {children}

//             <Table>
//                 <Caption>Appointments</Caption>

//                 <TH>Customer Name</TH>
//                 <TH>Start</TH>
//                 <TH>End</TH>
//                 <TH>Recurring</TH>
//                 <TH>Completed</TH>

//                 {appointmentsData
//                     ? appointmentsData.map((appointment) => {
//                         const {
//                             id,
//                             fullName,
//                             start,
//                             end,
//                             recurring,
//                             completed,
//                         } = appointment;

//                         return (
//                             <Row
//                                 key={id + fullName}
//                                 cb={() => setAppointment(id)}
//                             >
//                                 <TD>{fullName}</TD>
//                                 <TD>{dates.formatDate(start)}</TD>
//                                 <TD>{dates.formatDate(end)}</TD>
//                                 <TD>{recurring ? '🔁' : ''}</TD>
//                                 <TD>{completed ? '✅' : '❌'}</TD>
//                             </Row>
//                         );
//                     })
//                     : null}
//             </Table>
//         </section>
//     );
// }

export default Main;
