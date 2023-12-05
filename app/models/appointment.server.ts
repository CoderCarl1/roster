import { Appointment, Prisma } from '@prisma/client';
import { TAppointment_data_for_creation } from '@types';
import { prisma } from '~/db.server';
import { AppointmentOperationError } from '~/functions/errors';
import { log } from '~/functions/helpers/functions';

/**
 * Creates a new appointment.
 *
 * @param customerId - The ID of the customer for whom the appointment is created.
 * @param addressId - The ID of the address associated with the appointment.
 * @param appointmentData - The appointment data for creation.
 * @returns A promise that resolves to the created appointment or an AppointmentOperationError.
 */
export async function appointment_create(
    customerId: string,
    addressId: string,
    appointmentData: TAppointment_data_for_creation
): Promise<Appointment | AppointmentOperationError> {
    try {
        if (!customerId) throw new Error('no customer ID');
        if (!addressId) throw new Error('no address ID');
        const createdAppointment = await prisma.appointment.create({
            data: { ...appointmentData, customerId, addressId },
        });

        if (!createdAppointment) {
            log('red', 'Failed Creating appointment, dumping data');
            console.log(appointmentData);
            throw new Error(JSON.stringify(appointmentData));
        }
        return createdAppointment;
    } catch (err) {
        return new AppointmentOperationError('Failed creating appointment', err);
    }
}

/**
 * Creates several new appointments.
 *
 * @param customerId - The ID of the customer for whom the appointment is created.
 * @param addressId - The ID of the address associated with the appointment.
 * @param appointmentDataArray - The appointment data for creation.
 * @returns A promise that resolves to the created appointments in an array or an AppointmentOperationError.
 */
export async function appointment_create_many(
    customerId: string,
    addressId: string,
    appointmentDataArray: TAppointment_data_for_creation[]
): Promise<Appointment[] | AppointmentOperationError> {
    try {
        if (!customerId) throw new Error('no customer ID');
        if (!addressId) throw new Error('no address ID');
        const createdAppointments = await prisma.$transaction(async (tx) => {
            const appointments = await Promise.all(
                appointmentDataArray.map(async (appointmentData) => {
                    const appointment = await tx.appointment.create({
                        data: { ...appointmentData, customerId, addressId },
                    });
                    if (!appointment){
                        throw new Error(`unable to create appointment, ${JSON.stringify(appointmentData)}`)
                    }
                    return appointment;
                })
            );
            return appointments
        })

        if (!createdAppointments || createdAppointments.length !== appointmentDataArray.length) {
            throw new AppointmentOperationError('Failed Creating appointment, dumping data', appointmentDataArray);
        }
        return createdAppointments;
    } catch (err) {
        if (err instanceof AppointmentOperationError) {
            return err;
        }
        return new AppointmentOperationError('Failed creating appointment', err);
    }
}



/**
 * Retrieves all appointments from the database.
 * @returns A promise that resolves to an array of appointments or an AppointmentOperationError.
 */
export async function appointment_find_many(whereBlock?: Prisma.AppointmentWhereInput | undefined): Promise<Appointment[] | AppointmentOperationError> {
    try {
        const appointments = await prisma.appointment.findMany({
            where: { completed: false, ...whereBlock }
        });
        return appointments;
    } catch (err) {
        return new AppointmentOperationError(`Error while retrieving appointments \n ${JSON.stringify(whereBlock)}`, err);
    }
}

/**
 * Retrieves all Completed appointments from the database.
 * @returns A promise that resolves to an array of appointments or an AppointmentOperationError.
 */
export async function appointment_find_many_completed(): Promise<Appointment[] | AppointmentOperationError> {
    return await appointment_find_many({ completed: true });
}

/**
 * Retrieves all appointments from the database for a customer.
 * @param customerId - The ID of the customer for whom the appointment was created.
 * @returns A promise that resolves to an array of appointments or an AppointmentOperationError.
 */
export async function appointment_findbyCustomer(
    customerId: string
): Promise<Appointment[] | AppointmentOperationError> {
    try {
        const appointments = await prisma.appointment.findMany({ where: { customerId } });
        return appointments;
    } catch (err) {
        return new AppointmentOperationError(`Error while retrieving appointments for customer ${customerId}`, err);
    }
}

/**
 * Retrieves all appointments from the database for a customer.
 * @param addressId - The ID of the address for where the appointment was to take place.
 * @returns A promise that resolves to an array of appointments or an AppointmentOperationError.
 */
export async function appointment_findbyAddress(
    addressId: string
): Promise<Appointment[] | AppointmentOperationError> {
    try {
        const appointments = await prisma.appointment.findMany({ where: { addressId } });
        return appointments;
    } catch (err) {
        return new AppointmentOperationError(`Error while retrieving appointments for address ${addressId}`, err);
    }
}

/**
 * Updates an appointment in the database.
 *
 * @param id - The ID of the appointment to be updated.
 * @param ...args - the new values for the appointment
 * @returns A promise that resolves to the updated appointment or an AppointmentOperationError.
 */
export async function appointment_update(
    id: string,
    { ...args
    }: Omit<Partial<Appointment>, 'id' | 'updatedAt' | 'createdAt'>): Promise<Appointment | AppointmentOperationError> {
    try {
        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: args,
        });
        if (!updatedAppointment) {
            throw new Error(`appointment with ID ${id} not updated.`);
        }
        console.log(
            `Customer with ID ${id} and associated data updated successfully.`
        );
        return updatedAppointment;
    } catch (err) {
        if (err instanceof AppointmentOperationError) {
            return err;
        }
        return new AppointmentOperationError('failed to update appointment', err);
    }
}

/**
 * Deletes an appointment in the database.
 * @param appointmentId - The ID of the appointment to be deleted.
 * @returns A promise that resolves to the deleted appointment or an AppointmentOperationError.
 */
export async function appointment_delete(appointmentId: string) {
    try {
        const appointment = await prisma.appointment.delete({
            where: { id: appointmentId },
        });

        return appointment;
    } catch (err) {
        return new AppointmentOperationError(`failed to delete id: ${appointmentId}`, err)
    }
}
