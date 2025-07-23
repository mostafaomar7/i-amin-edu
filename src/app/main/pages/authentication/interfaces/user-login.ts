export interface UserLoginData {
    id: number;
    email?: string;
    userId: number;
    userType: number;
    role?: Role;
    firstName?: string;
    image?: string;
    lastName?: string;
}

export interface Role {
    id: number;
    name: string;
    guardName: string;
    createdAt: string;
    updatedAt: string;
}
