export interface User {
    userId?: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    birthDate?: Date;
    imgUrl?: string;
    canBeMaster?: boolean;
    level?: number;
    isDeleted?:boolean;
    role:string;
}
 