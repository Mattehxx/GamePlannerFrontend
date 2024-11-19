import { EventModel } from "./event.model";
import { gameSessionModel } from "./gameSession.model";
import { preferenceModel } from "./preference.model";
import { reservationModel } from "./reservation.model";

export interface User {
    userId?: string,
    name: string,
    surname: string,
    email?: string,
    phoneNumber?: string,
    birthDate?: Date,
    imgUrl?: string,
    level?: number,
    isDeleted?:boolean,
    role:string;
    adminEvents?: Array<EventModel>;
    sessions?: Array<gameSessionModel>;
    reservations?: Array<reservationModel>;
    preferences?: Array<preferenceModel>;
}
 