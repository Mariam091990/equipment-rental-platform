export type TUserRole = "admin" | "owner" | "customer";

export interface IUser {
    name: string;
    email: string;
    role: TUserRole;
    image?: string;
}

 export interface IEquipment {
    _id: string;
    equipmentName: string;
    description: string;
    category: string;
    location: string;
    rentalPrice: number;
    rentalType: string;
    availableQuantity: number;
    equipmentCondition: string;
    brand: string;
    model: string;
    equipmentImage: string;
    rentalTerms: string;
    status: "Pending" | "Approved" | "Rejected";
    createdAt: string;
}