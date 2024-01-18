import { useLoaderData } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';
import { Appointment_Card, Button } from '@components';
import {
    addFullAddress,
    addFullName,
    dates,
    isAppointment,
    log,
    useToggle,
} from '@functions';
import {
    homeLoaderDataType,
    TAppointmentWithCustomerNameAndFullAddress,
} from '@types';

// import Calendar from '../../components/calendar/calendar';
import { AppointmentProvider, useAppointments } from '~/components/appointments/appointment.hooks';
import Table, { Caption, Row, TD, TH } from '../../components/table/table';
import AppointmentView, { AppointmentViewTypes } from '~/components/appointments/views';
import Appointment_Controls from '~/components/appointments/components/Appointment_controls';


type appointmentPageProps = {
    displayType: AppointmentViewTypes;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Main({ displayType = 'day', ...props }: appointmentPageProps) {
    const data = useLoaderData<homeLoaderDataType>();

    const {
        setAppointment,
        currentAppointment,
        setAppointments,
        appointmentsList,
        appointmentsData,
        timeSlotsForMonth,
    } = useAppointments();

    useEffect(() => {
        const appointmentsLoaderData =
            data.appointmentsLoaderData as unknown as Record<
                string,
                Record<string, TAppointmentWithCustomerNameAndFullAddress>
            >;
        // console.log("data.appointmentsLoaderData initialk", appointmentsLoaderData)
        // setLoading(true);
        setAppointments(appointmentsLoaderData);
        // setLoading(false);
    }, []);

    useEffect(() => {
        console.log('use effect in appointment page');
        console.log('appointmentsList', appointmentsList && appointmentsList);
        console.log('appointmentsData', appointmentsData && appointmentsData);
        console.log(
            'timeslotsForMonth',
            timeSlotsForMonth && timeSlotsForMonth
        );
    }, [appointmentsList]);

    return (
        <AppointmentProvider>
            <Appointment_Controls />
            <AppointmentView displayType={displayType}/>
        </AppointmentProvider>

    );

    // const { toggle: loading, setToggleStatus: setLoading } = useToggle(true);

    // const [displayType, setDisplayType] = useState<displayTypeEnum>('week');
    // const {
    //     setAppointment,
    //     currentAppointment,
    //     setAppointmentsData,
    //     appointmentsData,
    // } = useAppointments();

    // const appointmentsWithCustomerName = useCallback(() => {
    //     return appointmentsLoaderData.reduce<
    //         TAppointmentWithCustomerNameAndFullAddress[]
    //     >((acc, appointment) => {
    //         let updatedAppointment = addFullName(appointment);

    //         if ('address' in updatedAppointment) {
    //             updatedAppointment = addFullAddress(updatedAppointment);
    //         }

    //         if (isAppointment(updatedAppointment)) {
    //             acc.push(updatedAppointment);
    //         }
    //         return acc;
    //     }, []);
    // }, [appointmentsLoaderData]);

    // useEffect(() => {
    //     setLoading(true);
    //     setAppointmentsData(appointmentsWithCustomerName);
    //     setLoading(false);
    // }, [appointmentsWithCustomerName, loading]);

    // function handleDisplayTypeChange(e: React.MouseEvent<HTMLButtonElement>) {
    //     if (!loading) {
    //         setLoading(true);
    //         const newDisplayType = e.currentTarget.dataset
    //             .calendartype as displayTypeEnum;
    //         if (!newDisplayType) return;
    //         setDisplayType(newDisplayType);
    //     }
    // }

    // const appointmentsControls = () => {
    //     return (
    //         <>
    //             <Button
    //                 data-calendartype="day"
    //                 onClick={handleDisplayTypeChange}
    //                 disabled={displayType === 'day'}
    //             >
    //                 Day
    //             </Button>
    //             <Button
    //                 data-calendartype="week"
    //                 onClick={handleDisplayTypeChange}
    //                 disabled={displayType === 'week'}
    //             >
    //                 Week
    //             </Button>
    //             <Button
    //                 data-calendartype="month"
    //                 onClick={handleDisplayTypeChange}
    //                 disabled={displayType === 'month'}
    //             >
    //                 Month
    //             </Button>
    //             <Button
    //                 data-calendartype="appointments"
    //                 onClick={handleDisplayTypeChange}
    //                 disabled={displayType === 'appointments'}
    //             >
    //                 appointments
    //             </Button>
    //         </>
    //     );
    // };

    // if (appointmentsData && appointmentsData.length) {
    //     return displayType !== 'appointments' ? (
    //         <DatePicker className="carl" />
    //     ) : (
    // <Calendar
    //     displayType={displayType}
    //     setLoading={setLoading}
    //     loading={loading}
    //     {...props}
    //     className="calendar"
    // >
    //     {appointmentsControls()}
    //     {currentAppointment ? (
    //         <Appointment_Card
    //             clearAppointment={setAppointment}
    //             appointment={currentAppointment}
    //             className="calendar__appointment--single"
    //         />
    //     ) : null}
    // </Calendar>
    //         <Appointments className={currentAppointment ? 'disabled' : ''}>
    //             {appointmentsControls()}
    //             {currentAppointment ? (
    //                 <Appointment_Card
    //                     clearAppointment={setAppointment}
    //                     appointment={currentAppointment}
    //                 />
    //             ) : null}
    //         </Appointments>
    //     );
    // }
}

// type appointmentProps = {
//     children?: React.ReactNode;
// } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

// function Appointments({
//     children,
//     className = '',
//     ...props
// }: appointmentProps) {
//     const { appointmentsData, setAppointment } = useAppointments();
//     return (
//         <section {...props} className={'section-wrapper ' + className}>
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
//                           const {
//                               id,
//                               fullName,
//                               start,
//                               end,
//                               recurring,
//                               completed,
//                           } = appointment;

//                           return (
//                               <Row
//                                   key={id + fullName}
//                                   cb={() => setAppointment(id)}
//                               >
//                                   <TD>{fullName}</TD>
//                                   <TD>{dates.localTimeStringFromDate(start)}</TD>
//                                   <TD>{dates.localTimeStringFromDate(end)}</TD>
//                                   <TD>{recurring ? '🔁' : ''}</TD>
//                                   <TD>{completed ? '✅' : '❌'}</TD>
//                               </Row>
//                           );
//                       })
//                     : null}
//             </Table>
//         </section>
//     );
// }

export default Main;
