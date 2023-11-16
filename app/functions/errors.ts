class CreationError extends Error {
    constructor(
        message: string,
        public errorData?: any,
        public stackTrace?: string,
        public componentName?: string
    ) {
        super(message);
        this.name = 'CreationError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CreationError);
        }
        this.errorData = errorData;
        this.stackTrace = stackTrace;
        this.componentName = componentName;
        this.log();
    }

    getDetails() {
        return {
            message: this.message,
            errorData: this.errorData,
            componentName: this.componentName || 'UnknownComponent',
            stackTrace: this.stackTrace || 'StackTraceNotAvailable',
        };
    }

    log() {
        console.error(`[${this.name}] ${this.message}`);
        if (this.errorData) {
            console.error('Error Data:', this.errorData);
        }
    }
}

class CustomerCreationError extends CreationError {}

class AddressCreationError extends CreationError {}

class AppointmentCreationError extends CreationError {}

class NoteCreationError extends CreationError {}
