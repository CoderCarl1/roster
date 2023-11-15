import { Appointment } from '@prisma/client';
import { TAppointment_data_for_creation } from '@types';
import { prisma } from '~/db.server';
import { appointments } from '~/lib/placeholder-data';
/**
 * CREATE
 */
export async function createAppointment(
    appointmentData: TAppointment_data_for_creation
): Promise<Appointment> {
    const appointment = await prisma.appointment.create({
        data: appointmentData,
    });
    return appointments[0];
    return appointment;
}
/**
 * READ
 */

export async function findAllAppointments(): Promise<Appointment[] | null> {
    const appointments = await prisma.appointment.findMany();
    return appointments;
}

export async function findAllAppointments_NonCompleted(): Promise<
    Appointment[] | null
> {
    const appointments = prisma.appointment.findMany({
        where: {
            completed: false,
        },
    });
    return appointments;
}

export async function findAllAppointments_completed(): Promise<
    Appointment[] | null
> {
    const appointments = prisma.appointment.findMany({
        where: {
            completed: true,
        },
    });
    return appointments;
}

export async function findAppointments_byCustomer(
    customerId: string
): Promise<Appointment[] | null> {
    const appointments = await prisma.appointment.findMany({
        where: {
            customerId: customerId,
        },
    });
    return appointments;
}
export async function findAppointments_byAddress(
    addressId: string
): Promise<Appointment[] | null> {
    const appointments = await prisma.appointment.findMany({
        where: {
            addressId: addressId,
        },
    });
    return appointments;
}
/**
 * UPDATE
 */
type UpdateAppointmentInput = {
    id: string;
    customerId?: string;
    number?: string;
    line1?: string;
    line2?: string;
    suburb?: string;
};
export async function updateAppointment({
    id,
    ...args
}: UpdateAppointmentInput): Promise<Appointment> {
    await prisma.appointment.update({
        where: { id },
        data: args,
    });

    const updatedAppointment = await prisma.appointment.findUnique({
        where: { id },
    });

    if (!updatedAppointment) {
        throw new Error(`appointment with ID ${id} not found.`);
    }

    console.log(
        `Customer with ID ${id} and associated data updated successfully.`
    );

    return updatedAppointment;
}
/**
 * DELETE
 */
export async function deleteAppointment(appointmentId: string) {
    const appointment = await prisma.appointment.delete({
        where: { id: appointmentId },
    });

    return appointment;
}
