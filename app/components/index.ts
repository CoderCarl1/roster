import Addresses, { Address_Card, useAddresses } from './addresses';
import Appointments, {
    Appointment_Card,
    useAppointments,
} from './appointments';
import Customers, { Customer_Card, useCustomers } from './customers';
import Form, { Text, NumberInput, Checkbox } from './form';
import DateTimePicker from './form/datepicker';
import { Button, Card } from './general';
import LoadingComponent from './general/LoadingComponent';


export {
    // Appointment
    Appointments,
    Appointment_Card,
    useAppointments,
    // Address
    Addresses,
    Address_Card,
    useAddresses,
    // Customer
    Customers,
    Customer_Card,
    useCustomers,
    // inputs
    Text,
    NumberInput,
    Checkbox,
    // Generic
    Form,
    Card,
    Button,
    DateTimePicker,
    LoadingComponent,
};
