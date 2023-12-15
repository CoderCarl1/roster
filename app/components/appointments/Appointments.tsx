import {
    Appointment_Card,
    useAppointments,
} from '@components';
import { TAppointmentWithCustomerName } from '@types';
import Table, { Caption, Row, TD, TH } from '../table/table';
import { useLoaderData } from '@remix-run/react';
import { loaderType } from '~/routes/_index';
import { useEffect } from 'react';

function Main() {
    const { appointmentsLoaderData } = useLoaderData<loaderType>();

    const { setAppointment, currentAppointment, setAppointments, appointments } = useAppointments();
    
    useEffect(() => {
        console.log(" useEffect setAppointments")
        setAppointments(appointmentsLoaderData as any);
    }, [ setAppointments, appointmentsLoaderData ]);
    
    return (
        <Appointments
            setAppointment={setAppointment}
            appointments={appointments as any}
        >
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
};
function Appointments({
    appointments = [],
    setAppointment,
    children,
}: appointmentProps) {
    return (
        <section className="section-wrapper">
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
                                <TD>{start}</TD>
                                <TD>{end}</TD>
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
