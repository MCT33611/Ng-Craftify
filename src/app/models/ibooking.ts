import { IBookingStatus } from "./ibooking-status";
import { IUser } from "./iuser";
import { IWorker } from "./iworker";



export interface IBooking {
    id?: string;
    status?: IBookingStatus;
    workingTime?: number;
    date?: string;
    bookedAt?: string;
    location?: string;
    locationName?: string;
    customerId?: string;
    customer?: IUser;
    providerId?: string;
    provider?: IWorker;
}
