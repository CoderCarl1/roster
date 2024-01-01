import { Appointment, Prisma } from '@prisma/client';
import { TAppointment, TAppointment_data_for_creation } from '@types';
import { prisma } from '~/db.server';
import { dates, log } from '~/functions';
import { AppointmentOperationError } from '~/functions/errors';

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
): Promise<TAppointment | AppointmentOperationError> {
    try {
        if (!customerId) throw new Error('no customer ID');
        if (!addressId) throw new Error('no address ID');

        const startTime = Date.parse(appointmentData.start);
        const endTime = Date.parse(appointmentData.end);

        if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
            throw new Error('Invalid start or end time');
        }

        const timeConflictExists = await existingAppointmentCheck(
            appointmentData.start,
            appointmentData.end
        );

        if (timeConflictExists instanceof AppointmentOperationError) {
            throw timeConflictExists;
        }

        const createdAppointment = await prisma.appointment.create({
            data: { ...appointmentData, customerId, addressId },
        });

        if (!createdAppointment) {
            log({ color: 'red' }, 'Failed Creating appointment, dumping data', {
                data: appointmentData,
            });
            throw new Error(JSON.stringify(appointmentData));
        }
        return addLocaleDates(createdAppointment);
    } catch (err) {
        if (err instanceof AppointmentOperationError) {
            return err;
        }
        return new AppointmentOperationError(
            'Failed creating appointment',
            err
        );
    }
}

export async function existingAppointmentCheck(
    start: string | Date,
    end: string | Date
) {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    const oneMinute = 60 * 1000; // 1 minute in milliseconds

    // TODO: check that this works??
    // const existingAppointmentsData = await prisma.appointment.findMany({
    //     where: {
    //         start: {
    //             gte: new Date(startDate - oneMinute).toISOString(),
    //             lt: new Date(endDate + oneMinute).toISOString(),
    //         },
    //         end: {
    //             gte: new Date(startDate - oneMinute).toISOString(),
    //             lt: new Date(endDate + oneMinute).toISOString(),
    //         },
    //     },
    // });
    const existingAppointmentsData = await prisma.appointment.findMany({
        where: {
            OR: [
                {
                    start: {
                        lte: new Date(endDate).toISOString(),
                        gte: new Date(startDate).toISOString(),
                    },
                },
                {
                    end: {
                        lte: new Date(endDate).toISOString(),
                        gte: new Date(startDate).toISOString(),
                    },
                },
            ],
        },
    });

    if (existingAppointmentsData && existingAppointmentsData.length) {
        return new AppointmentOperationError(
            'conflicting appointments found',
            existingAppointmentsData
        );
    }
    return false;
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
): Promise<TAppointment[] | AppointmentOperationError> {
    try {
        const createdAppointments = await prisma.$transaction(async (tx) => {
            const appointments = await Promise.all(
                appointmentDataArray.map(async (appointmentData) => {
                    const startTime = Date.parse(appointmentData.start);
                    const endTime = Date.parse(appointmentData.end);

                    if (
                        isNaN(startTime) ||
                        isNaN(endTime) ||
                        startTime >= endTime
                    ) {
                        throw new Error('Invalid start or end time');
                    }
                    const timeConflictExists = await existingAppointmentCheck(
                        appointmentData.start,
                        appointmentData.end
                    );

                    if (
                        timeConflictExists instanceof AppointmentOperationError
                    ) {
                        throw timeConflictExists;
                    }

                    const appointment = await tx.appointment.create({
                        data: { ...appointmentData, customerId, addressId },
                    });

                    if (!appointment) {
                        throw new Error(
                            `unable to create appointment, ${JSON.stringify(
                                appointmentData
                            )}`
                        );
                    }
                    return addLocaleDates(appointment);
                })
            );
            return appointments;
        });

        /** removing for now as I am unsure if it is needed */
        // if (
        //     !createdAppointments ||
        //     createdAppointments.length !== appointmentDataArray.length
        // ) {
        //     throw new AppointmentOperationError(
        //         'Failed Creating appointment, dumping data',
        //         appointmentDataArray
        //     );
        // }
        return createdAppointments;
    } catch (err) {
        if (err instanceof AppointmentOperationError) {
            return err;
        }
        return new AppointmentOperationError(
            'Failed creating appointment',
            err
        );
    }
}

/**
 * Retrieves all appointments from the database.
 * @param include - Optional. Specify the related entities to include in the result.
 * @param whereBlock - Optional. Specify the filters.
 * @returns A promise that resolves to an array of appointments or an AppointmentOperationError.
 */
export async function appointment_find_many(
    include?: Prisma.AppointmentInclude | undefined,
    whereBlock?: Prisma.AppointmentWhereInput | undefined
): Promise<TAppointment[] | AppointmentOperationError> {
    try {
        const appointments = await prisma.appointment.findMany({
            where: { completed: false, ...whereBlock },
            orderBy: { start: 'asc' },
            include,
        });

        if (!appointments) {
            return [];
        }
        return appointments.map(addLocaleDates);
    } catch (err) {
        return new AppointmentOperationError(
            `Error while retrieving appointments \n ${JSON.stringify(
                whereBlock
            )}`,
            err
        );
    }
}

/**
 * Retrieves all Completed appointments from the database.
 * @returns A promise that resolves to an array of appointments or an AppointmentOperationError.
 */
export async function appointment_find_many_completed(): Promise<
    TAppointment[] | AppointmentOperationError
> {
    return await appointment_find_many({}, { completed: true });
}

/**
 * Retrieves all appointments from the database for a customer.
 * @param customerId - The ID of the customer for whom the appointment was created.
 * @returns A promise that resolves to an array of appointments or an AppointmentOperationError.
 */
export async function appointment_findbyCustomer(
    customerId: string
): Promise<TAppointment[] | AppointmentOperationError> {
    try {
        const appointments = await appointment_find_many(undefined, {
            customerId,
        });

        return appointments;
    } catch (err) {
        return new AppointmentOperationError(
            `Error while retrieving appointments for customer ${customerId}`,
            err
        );
    }
}

/**
 * Retrieves all appointments from the database for a customer.
 * @param addressId - The ID of the address for where the appointment was to take place.
 * @returns A promise that resolves to an array of appointments or an AppointmentOperationError.
 */
export async function appointment_findbyAddress(
    addressId: string
): Promise<TAppointment[] | AppointmentOperationError> {
    try {
        const appointments = await appointment_find_many(undefined, {
            addressId,
        });
        return appointments;
    } catch (err) {
        return new AppointmentOperationError(
            `Error while retrieving appointments for address ${addressId}`,
            err
        );
    }
}

/**
 * Retrieves the appointment from the database.
 * @param appointmentId - The ID of the appointment.
 * @returns A promise that resolves to an appointment or an AppointmentOperationError.
 */
export async function appointment_findbyId(
    appointmentId: string
): Promise<TAppointment | AppointmentOperationError> {
    try {
        const appointment = await prisma.appointment.findUniqueOrThrow({
            where: { id: appointmentId },
        });

        return addLocaleDates(appointment);
    } catch (err) {
        return new AppointmentOperationError(
            `Error while retrieving appointment ${appointmentId}`,
            err
        );
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
    { ...args }: Omit<Partial<Appointment>, 'id' | 'updatedAt' | 'createdAt'>
): Promise<TAppointment | AppointmentOperationError> {
    try {
        const existingAppointment = await appointment_findbyId(id);

        if (existingAppointment instanceof AppointmentOperationError) {
            throw existingAppointment;
        }

        const startTime = Date.parse(args.start || existingAppointment.start);
        const endTime = Date.parse(args.end || existingAppointment.end);

        if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
            throw new AppointmentOperationError('Invalid start or end time');
        }
        const timeConflictExists = await existingAppointmentCheck(
            args.start || existingAppointment.start,
            args.end || existingAppointment.end
        );

        if (timeConflictExists instanceof AppointmentOperationError) {
            throw timeConflictExists;
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: { ...args },
        });

        if (!updatedAppointment) {
            throw new Error(`appointment with ID ${id} not updated.`);
        }

        return addLocaleDates(updatedAppointment);
    } catch (err) {
        if (err instanceof AppointmentOperationError) {
            return err;
        }
        return new AppointmentOperationError(
            'failed to update appointment',
            err
        );
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
        return new AppointmentOperationError(
            `failed to delete id: ${appointmentId}`,
            err
        );
    }
}

function addLocaleDates(appointment: TAppointment): TAppointment {
    const localTime = {
        start: dates.formatDate(new Date(appointment.start)),
        end: dates.formatDate(new Date(appointment.end)),
        completedAt:
            appointment.completed && appointment.completedAt
                ? dates.formatDate(appointment.completedAt)
                : '',
    };
    return { ...appointment, localTime };
}
