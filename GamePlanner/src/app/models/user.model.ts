import { Knowledge } from "./knowledge.model";

export interface User {
    UserId: string;
    Name: string;
    Surname: string;
    Email: string;
    Phone: string;
    BirthDate: Date;
    ImgUrl?: ImageBitmap;
    CanBeMaster: boolean;
    KnowledgeId: number;
    Knowledge?: Knowledge;

}