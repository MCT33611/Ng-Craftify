import { IUser } from "./iuser"

export interface IWorker {
  id?: string;
  userId?: string;
  user?: IUser;
  serviceTitle?: string;
  description?: string;
  certificationUrl?: string;
  skills?: string;
  hireDate?: Date;
  perHourPrice?: number;
  approved?: boolean;
  logoUrl?: string;
  smallPreviewImageUrl?: string,
  mediumPreviewImageUrl?: string,
  largePreviewImageUrl?: string
}                         