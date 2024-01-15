import Addresses, { Address_Card, useAddresses } from './addresses';
import Appointments, {
    Appointment_Card,
    useAppointments,
} from './appointments';
import Customers, { Customer_Card, useCustomers } from './customers';
import Form, { Text, NumberInput, Checkbox } from './form';
import DateTimePicker from './form/datepicker';
import { Button, Card } from './general';
import ErrorCard from './general/errorCard';
import LoadingComponent from './general/LoadingComponent';
import Table, {
    Caption,
    Row,
    TD,
    TH,
    TableBody,
    TableHead,
} from './table/table';

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
    Table,
    Caption,
    TableHead,
    TH,
    TableBody,
    Row,
    TD,
    Text,
    NumberInput,
    Checkbox,
    // Generic
    Form,
    Card,
    ErrorCard,
    Button,
    DateTimePicker,
    LoadingComponent,
};
