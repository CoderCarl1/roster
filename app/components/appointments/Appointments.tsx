import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { Appointment_Card, useAppointments } from '@components';
import {
    addFullAddressToAppointment,
    addFullName,
    formatDate,
} from '@functions';
import {
    TAppointmentWithCustomerName,
    TAppointmentWithCustomerNameAndFullAddress,
} from '@types';
import { useCalendarContext } from '~/contexts';
import { loaderType } from '~/routes/_index';
import { useCalendar } from '../calendar';
import Table, { Caption, Row, TD, TH } from '../table/table';

function Main() {
    const { appointmentsLoaderData } = useLoaderData<loaderType>();

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
        console.log(
            'getAppointmentsForWeek searched appointments for',
            selectedDate
        );
        const appointmentsArray = getAppointmentsForMonth(selectedDate);
        const filteredAppointments = getDay(
            selectedDate,
            appointmentsArray
        ).filter((apt) => apt.appointment !== null);
        // const appointmentsForWeek = getWeek(selectedDate, appointmentsArray)
        // const appointmentsForMonth = getMonth(selectedDate, appointmentsArray)
        console.log('total filtered Appointments', filteredAppointments.length);
        console.log('filtered Appointments left with', filteredAppointments);
        // console.log("appointmentsForWeek found ", appointmentsForWeek)
        // console.log("appointmentsForMonth found ", appointmentsForMonth)
    }, [selectedDate]);
    useEffect(() => {
        console.log(' useEffect setAppointments');
        const appointmentsWithCustomerName = appointmentsLoaderData.map(
            (item) => {
                let updatedAppointment = addFullName(
                    item as any
                ) as TAppointmentWithCustomerName;
                updatedAppointment =
                    addFullAddressToAppointment(updatedAppointment);
                return updatedAppointment;
            }
        );
        console.log(
            'appointmentsWithCustomerName',
            appointmentsWithCustomerName
        );
        setAppointments(appointmentsWithCustomerName);
    }, [appointmentsLoaderData]);

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
        <section className="section-wrapper" {...props}>
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
