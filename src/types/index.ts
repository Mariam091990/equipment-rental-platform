export type TUserRole = "admin" | "owner" | "customer";

export interface IUser {
    name: string;
    email: string;
    role: TUserRole;
    image?: string;
}