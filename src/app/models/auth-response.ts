import { IUser } from "./iuser";

export type AuthResponse = {user:IUser, accessToken:string,refreshToken : string }