export interface IUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    emailConfirmed?: boolean;
    passwordHash?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    joinDate?: Date;
    updatedDate?: Date;
    profilePicture?: string;
    role?: string;
    blocked?:boolean;
}
