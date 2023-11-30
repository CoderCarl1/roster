import {
  OperationError,
  CustomerOperationError,
  AddressOperationError,
  AppointmentOperationError,
} from '~/functions/errors';

describe('OperationError', () => {
  it('creates a generic OperationError', () => {
    const error = new OperationError('Generic error message');
    expect(error).toBeInstanceOf(OperationError);
    expect(error.getDetails()).toEqual({
      message: 'Generic error message',
      errorData: undefined,
      componentName: 'UnknownComponent',
      stackTrace: 'StackTraceNotAvailable',
    });
  });

  it('creates a generic OperationError with errorData', () => {
    const errorData = { additionalInfo: 'Some additional info' };
    const error = new OperationError('Generic error message', errorData);
    expect(error).toBeInstanceOf(OperationError);
    expect(error.getDetails()).toEqual({
      message: 'Generic error message',
      errorData,
      componentName: 'UnknownComponent',
      stackTrace: 'StackTraceNotAvailable',
    });
  });

  it('creates a CustomerOperationError', () => {
    const error = new CustomerOperationError('Customer error message');
    expect(error).toBeInstanceOf(CustomerOperationError);
    expect(error.getDetails()).toEqual({
      message: 'Customer error message',
      errorData: undefined,
      componentName: 'UnknownComponent',
      stackTrace: 'StackTraceNotAvailable',
    });
  });

  it('creates an AddressOperationError', () => {
    const error = new AddressOperationError('Address error message');
    expect(error).toBeInstanceOf(AddressOperationError);
    expect(error.getDetails()).toEqual({
      message: 'Address error message',
      errorData: undefined,
      componentName: 'UnknownComponent',
      stackTrace: 'StackTraceNotAvailable',
    });
  });

  it('creates an AppointmentOperationError', () => {
    const error = new AppointmentOperationError('Appointment error message');
    expect(error).toBeInstanceOf(AppointmentOperationError);
    expect(error.getDetails()).toEqual({
      message: 'Appointment error message',
      errorData: undefined,
      componentName: 'UnknownComponent',
      stackTrace: 'StackTraceNotAvailable',
    });
  });

});
