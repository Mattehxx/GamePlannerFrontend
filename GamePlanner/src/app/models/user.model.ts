import { Knowledge } from "./knowledge.model";

export interface User {
    userId: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthDate: Date;
    imgUrl?: string;
    canBeMaster: boolean;
    knowledgeId: number;
    knowledge?: Knowledge;

}