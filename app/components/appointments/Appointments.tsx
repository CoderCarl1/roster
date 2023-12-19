import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { Appointment_Card, useAppointments } from '@components';
import {
    addFullAddressToAppointment,
    addFullName,
    formatDate,
} from '@functions';
import {
    TAppointment,
    TAppointmentWithCustomerName,
    TAppointmentWithCustomerNameAndFullAddress,
} from '@types';
import { useCalendarContext } from '~/contexts';
import { loaderType } from '~/routes/_index';
import { useCalendar } from '../calendar';
import Table, { Caption, Row, TD, TH } from '../table/table';

function Main() {
    const data = useLoaderData<loaderType>();
    const appointmentsData = data.appointmentsLoaderData as unknown as TAppointment[];

    const {
        setAppointment,
        currentAppointment,
        setAppointments,
        appointments,
    } = useAppointments();
    const {
        getAppointmentsForDay,
        getAppointmentsForWeek,
        getAppointmentsForMonth,
    } = useAppointments();
    const { getDay, getWeek, getMonth } = useCalendar();
    const { currentDate, nextDay } = useCalendarContext();
    const selectedDate = new Date(
        currentDate.year,
        currentDate.month,
        currentDate.day
    );

 
    useEffect(() => {
        const appointmentsWithCustomerName = appointmentsData.map(
            (appointment) => {
                let updatedAppointment = addFullName(appointment) as TAppointmentWithCustomerName;
                return addFullAddressToAppointment(updatedAppointment);
            }
        );

        setAppointments(appointmentsWithCustomerName);
    }, [ appointmentsData ]);

    return (
        <Appointments
            setAppointment={setAppointment}
            appointments={appointments as any}
            className={currentAppointment ? 'disabled' : ''}
        >
            <button onClick={nextDay}>DAY ++ </button>
            {currentAppointment ? (
                <Appointment_Card
                    clearAppointment={setAppointment}
                    appointment={currentAppointment}
                />
            ) : null}
        </Appointments>
    );
}

type appointmentProps = {
    appointments: null | TAppointmentWithCustomerName[];
    setAppointment: (appointmentId?: string) => void;
    children?: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Appointments({
    appointments = [],
    setAppointment,
    children,
    ...props
}: appointmentProps) {
    return (
        <section  {...props} className={"section-wrapper" + props.className}>
            {children}

            <Table>
                <Caption>Appointments</Caption>

                <TH>Customer Name</TH>
                <TH>Start</TH>
                <TH>End</TH>
                <TH>Recurring</TH>
                <TH>Frequency</TH>
                <TH>Completed</TH>
                {/* <th>Note</th> */}

                {appointments
                    ? appointments.map((appointment) => {
                        const {
                            id,
                            fullName,
                            start,
                            end,
                            recurring,
                            frequency,
                            completed,
                        } = appointment;

                        return (
                            <Row
                                key={id + fullName}
                                cb={() => setAppointment(id)}
                            >
                                <TD>{fullName}</TD>
                                <TD>{formatDate(start)}</TD>
                                <TD>{formatDate(end)}</TD>
                                <TD>{recurring ? 'Yes' : 'No'}</TD>
                                <TD>{frequency}</TD>
                                <TD>{completed ? '✅' : '❌'}</TD>

                                {/* <TD>{note ? <Note note={note} /> : null}</TD> */}
                            </Row>
                        );
                    })
                    : null}
            </Table>
        </section>
    );
}

export default Main;
