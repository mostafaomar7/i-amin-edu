import { Role } from './role';

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  token?: string;
  gender: number;
  phone: string;
  image: string;
  walletBalance: number;
  accountStatus: number;
  userType: number;
  roleId: number;
  role: Role;
  language: number;
  promoCode: string;
  center: any; // Replace 'any' with the actual type if possible
  teacher: any; // Replace 'any' with the actual type if possible
}
