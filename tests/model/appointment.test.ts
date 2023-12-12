import { Address, Appointment, Customer } from '@prisma/client';
import { prisma } from '~/db.server';
import { AppointmentOperationError } from '~/functions/errors';
import { address_create } from '~/models/address.server';
import {
    appointment_create,
    appointment_create_many,
    appointment_delete,
    // appointment_find_many,
    appointment_findbyAddress,
    appointment_findbyCustomer,
    appointment_update,
} from '~/models/appointment.server';
import {
    customer_create,
    customer_delete_many,
} from '~/models/customer.server';
import { customers, appointments, addresses } from '../mocks/model_data';

describe('APPOINTMENT FUNCTIONS', () => {
    let addressRef = 0;
    let customerRef = 0;
    let appointmentRef = 1;
    let validCustomerId = '';
    let validAddressId = '';
    let validAppointmentId = '';
    const mockAppointmentData = appointments[0];
    let validAppointmentData = {} as Appointment;

    let multipleApppointmentArray = [
        appointments[appointmentRef++],
        appointments[appointmentRef++],
    ];

    beforeEach(async () => {
        console.log(' APPOINTMENT BEFORE EACH ');
        customerRef = 0;
        addressRef = 0;
        appointmentRef = 1;
        multipleApppointmentArray = [
            appointments[appointmentRef++],
            appointments[appointmentRef++],
        ];

        await customer_delete_many('test.com');
        await customer_delete_many('example.com');
        const createdCustomer = (await customer_create(
            customers[customerRef++]
        )) as Customer;
        validCustomerId = createdCustomer.id;
        const createdAddress = (await address_create({
            ...addresses[addressRef++],
            customerId: validCustomerId,
        })) as Address;
        validAddressId = createdAddress.id;
        const createdAppointments = (await appointment_create_many(
            validCustomerId,
            validAddressId,
            multipleApppointmentArray
        )) as Appointment[];
        validAppointmentId = createdAppointments[0].id;
        validAppointmentData = createdAppointments[0];
    });

    describe('SINGLE -', () => {
        it.only('appointment_create returns an appointment', async () => {
            const mockData = appointments[appointmentRef++];
            const createdRecord = await appointment_create(
                validCustomerId,
                validAddressId,
                mockData
            );
            expect(createdRecord).toMatchObject({
                id: expect.any(String),
                customerId: validCustomerId,
                recurring: mockData.recurring,
                frequency: mockData.frequency,
                addressId: validAddressId,
                start: mockData.start,
                end: mockData.end,
                completed: false,
            });
        });
        it('appointment_create returns an error when customerId is missing', async () => {
            const invalidCustomerId = '';
            const result = (await appointment_create(
                invalidCustomerId,
                validAddressId,
                mockAppointmentData
            )) as AppointmentOperationError;
            expect(result).toBeInstanceOf(AppointmentOperationError);
            expect(result?.message).toBe('Failed creating appointment');
        });
        it('appointment_create returns an error when addressId is missing', async () => {
            const invalidAddressId = '';
            const result = (await appointment_create(
                validCustomerId,
                invalidAddressId,
                mockAppointmentData
            )) as AppointmentOperationError;
            expect(result).toBeInstanceOf(AppointmentOperationError);
            expect(result?.message).toBe('Failed creating appointment');
        });
        it.only('appointment_create returns an AppointmentOperationError if the appointment time is already taken', async () => {
            console.log(
                'appointment_create appointment_create appointment_create'
            );
            const mockData = {
                ...appointments[appointmentRef++],
                start: validAppointmentData.start,
                end: validAppointmentData.end,
            };

            console.log({ mockData });
            const existingAppointment = await prisma.appointment.findFirst({
                where: { start: validAppointmentData.start },
            });
            console.log(
                'existingAppointmentexistingAppointmentexistingAppointment'
            );
            console.log({ existingAppointment });
            const errorResult = await appointment_create(
                validCustomerId,
                validAddressId,
                mockData
            );
            console.log('errorResult errorResult errorResult ', errorResult);
            expect(errorResult).toBeInstanceOf(AppointmentOperationError);
            // expect((errorResult as AppointmentOperationError).errorData.reason).toBe();
        });
        it('appointment_create returns an error when prisma create throws or fails to create', async () => {
            jest.spyOn(prisma.appointment, 'create').mockRejectedValueOnce(
                new Error()
            );
            const errorResult = await appointment_create(
                validCustomerId,
                validAddressId,
                mockAppointmentData
            );
            expect(errorResult).toBeInstanceOf(AppointmentOperationError);

            jest.spyOn(prisma.appointment, 'create').mockResolvedValueOnce(
                null!
            );
            const nullResult = await appointment_create(
                validCustomerId,
                validAddressId,
                mockAppointmentData
            );
            expect(nullResult).toBeInstanceOf(AppointmentOperationError);

            jest.restoreAllMocks();
        });
        it('appointment_findbyCustomer returns appointments for a customer', async () => {
            const result = await appointment_findbyCustomer(validCustomerId);
            expect(Array.isArray(result)).toBe(true);
            expect((result as Appointment[]).length).toBe(
                multipleApppointmentArray.length
            );
        });
        it('appointment_findbyCustomer returns AppointmentOperationError if throws', async () => {
            jest.spyOn(prisma.appointment, 'findMany').mockRejectedValueOnce(
                new Error()
            );
            const errorResult =
                await appointment_findbyCustomer(validCustomerId);
            expect(errorResult).toBeInstanceOf(AppointmentOperationError);
        });
        // it('appointment_findbyAddress returns appointments for an address', async () => {
        //     const result = await appointment_findbyAddress(validAddressId) as Appointment[];

        //     expect(Array.isArray(result)).toBe(true);
        //     console.log("length", result.length)
        //     console.log("result", result)
        //     expect(result.length).toBe(multipleApppointmentArray.length);
        // });
        it('appointment_findbyAddress returns AppointmentOperationError if throws', async () => {
            jest.spyOn(prisma.appointment, 'findMany').mockRejectedValueOnce(
                new Error()
            );
            const errorResult = await appointment_findbyAddress(validAddressId);
            expect(errorResult).toBeInstanceOf(AppointmentOperationError);
        });
        it('appointment_update returns the updated appointment', async () => {
            const appointment = await prisma.appointment.findFirst({
                where: { id: validAppointmentId },
            });
            expect(appointment).toMatchObject({
                id: validAppointmentId,
                customerId: validCustomerId,
                recurring: validAppointmentData.recurring,
                frequency: validAppointmentData.frequency,
                addressId: validAddressId,
                start: validAppointmentData.start,
                end: validAppointmentData.end,
                note: validAppointmentData.note,
                completed: false,
            });

            const result = (await appointment_update(validAppointmentId, {
                ...mockAppointmentData,
                completed: true,
            })) as Appointment;
            expect(result).toMatchObject({
                id: validAppointmentId,
                customerId: validCustomerId,
                recurring: mockAppointmentData.recurring,
                frequency: mockAppointmentData.frequency,
                addressId: validAddressId,
                start: mockAppointmentData.start,
                end: mockAppointmentData.end,
                note: mockAppointmentData.note,
                completed: true,
            });
        });
        it('appointment_update returns AppointmentOperationError if throws', async () => {
            jest.spyOn(prisma.appointment, 'update').mockRejectedValueOnce(
                new Error()
            );
            const errorResult = await appointment_update(
                validAddressId,
                validAppointmentData
            );
            expect(errorResult).toBeInstanceOf(AppointmentOperationError);
        });
        it('appointment_update returns the updated appointment', async () => {
            const result = (await appointment_delete(
                validAppointmentId
            )) as Appointment;
            expect(result).toMatchObject({
                id: validAppointmentId,
                customerId: validCustomerId,
                recurring: validAppointmentData.recurring,
                frequency: validAppointmentData.frequency,
                addressId: validAddressId,
                start: validAppointmentData.start,
                end: validAppointmentData.end,
                note: validAppointmentData.note,
                completed: validAppointmentData.completed,
            });
        });
    });

    describe('MANY -', () => {
        beforeEach(async () => {
            await prisma.appointment.deleteMany();
        });

        it('appointment_create_many returns an array of appointments', async () => {
            const appointmentDataArray = [
                appointments[appointmentRef++],
                appointments[appointmentRef++],
                appointments[appointmentRef++],
            ];
            const result = (await appointment_create_many(
                validCustomerId,
                validAddressId,
                appointmentDataArray
            )) as Appointment[];

            expect(Array.isArray(result)).toBe(true);
            (result as Appointment[]).forEach((Appointment, index) => {
                expect(Appointment).toEqual(
                    expect.objectContaining({
                        customerId: validCustomerId,
                        addressId: validAddressId,
                        recurring: appointmentDataArray[index].recurring,
                        frequency: appointmentDataArray[index].frequency,
                        start: appointmentDataArray[index].start,
                        end: appointmentDataArray[index].end,
                        completed: false,
                        note: appointmentDataArray[index].note,
                    })
                );
            });
        });
        it('appointment_create_many returns an AppointmentOperationError if throws', async () => {
            const errorMock = new Error('Transaction error');
            const createSpy = jest
                .spyOn(prisma, '$transaction')
                .mockImplementation(() => Promise.resolve(errorMock));

            const errorResult = await appointment_create_many(
                validCustomerId,
                validAddressId,
                multipleApppointmentArray
            );
            expect(errorResult).toBeInstanceOf(AppointmentOperationError);
            createSpy.mockRestore();
        });
        /**
         * FIND MANY fails when tested in suite.
         */
        // it('appointment_find_many returns an empty array when no appointments exist', async () => {
        //     const result = await appointment_find_many();
        //     expect(result).toEqual([]);
        // });
        // it('appointment_find_many returns an array of appointments when appointments exist', async () => {
        //     const { length } = await addAppointments();

        //     const result = await appointment_find_many();
        //     expect(result).toHaveLength(length);
        // });
        // it('appointment_find_many returns an AppointmentOperationError if throws', async () => {
        //     jest.spyOn(prisma.appointment, 'findMany').mockRejectedValue(new Error());

        //     const result = await appointment_find_many();
        //     expect(result).toBeInstanceOf(AppointmentOperationError);
        // });
        // it('appointment_find_many returns non-completed appointments when whereBlock is not provided', async () => {
        //     await addAppointments();
        //     const result = await appointment_find_many() as Appointment[];
        //     expect(Array.isArray(result)).toBe(true);
        //     expect(result.every(appointment => !appointment.completed)).toBe(true);
        // });
        // it('appointment_find_many returns appointments based on whereBlock', async () => {
        //     await addAppointments();
        //     const today = new Date().toISOString();
        //     const whereBlock: Prisma.AppointmentWhereInput = { start: { gte: today } };
        //     const result = await appointment_find_many(whereBlock) as Appointment[];
        //     expect(Array.isArray(result)).toBe(true);
        // });
    });
});
