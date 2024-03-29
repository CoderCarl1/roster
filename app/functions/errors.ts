import { Prisma } from '@prisma/client';
import { TprismaErrorDataType } from '@types';
import { log } from '~/functions';
import { isDataErrorType } from './helpers/typechecks';

export class OperationError extends Error {
    constructor(
        message: string,
        public errorData?: TprismaErrorDataType | unknown,
        public stackTrace?: string,
        public componentName?: string
    ) {
        super(message);
        this.name = 'OperationError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OperationError);
        }
        this.errorData = { reason: errorData };
        this.stackTrace = stackTrace;
        this.componentName = componentName;

        if (this._isPrismaError()) {
            this._handlePrismaError();
        }

        this._log();
    }

    getDetails() {
        return {
            message: this.message,
            errorData: this.errorData,
            componentName: this.componentName || 'UnknownComponent',
            stackTrace: this.stackTrace || 'StackTraceNotAvailable',
        };
    }

    // Expand on this
    public _log() {
        const dataToLog: unknown[] = [`[${this.name}] ${this.message}`];
        if (this.errorData && isDataErrorType(this.errorData)) {
            dataToLog.push({
                errorData: JSON.stringify({ ...this.errorData }),
            });
        }
        log(...dataToLog);
    }

    private _isPrismaError() {
        return (
            this.errorData instanceof Prisma.PrismaClientKnownRequestError ||
            this.errorData instanceof Prisma.PrismaClientUnknownRequestError ||
            this.errorData instanceof Prisma.PrismaClientRustPanicError ||
            this.errorData instanceof Prisma.PrismaClientInitializationError ||
            this.errorData instanceof Prisma.PrismaClientValidationError ||
            this.errorData instanceof Prisma.NotFoundError ||
            this.errorData instanceof CustomerOperationError ||
            this.errorData instanceof AddressOperationError ||
            this.errorData instanceof AppointmentOperationError
        );
    }

    private _handlePrismaError() {
        const prismaErrorData =
            typeof this.errorData === 'string'
                ? { reason: this.errorData }
                : (this.errorData as TprismaErrorDataType);
        const prismaErrorMessage = this.message;
        const prismaErrorStack = this.stack;
        if (this instanceof Prisma.PrismaClientKnownRequestError) {
            // The meta lists the duplicate field
            prismaErrorData.duplicateField = this.meta || {};
            prismaErrorData.code = this.code;
        }
        if (this instanceof Prisma.PrismaClientValidationError) {
            // returns a message only. no need to do anything except log.
            prismaErrorData.code = 'G4000';
        }
        if (this instanceof Prisma.PrismaClientUnknownRequestError) {
            // returns a message only. no need to do anything except log.
            prismaErrorData.code = 'G5001';
        }
        if (this instanceof Prisma.PrismaClientInitializationError) {
            prismaErrorData.code = this.errorCode;
            // may occur when initializing or making a request.
        }
        this.errorData = { ...prismaErrorData };
        this.stackTrace = prismaErrorStack;
        this.message = prismaErrorMessage;
    }
}

export class CustomerOperationError extends OperationError {}
export class AddressOperationError extends OperationError {}
export class AppointmentOperationError extends OperationError {}
