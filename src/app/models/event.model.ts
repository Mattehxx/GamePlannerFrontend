import { GameModel } from "./game.model";
import { gameSessionModel } from "./gameSession.model";
import { User } from "./user.model";

export interface EventModel{
    eventId: number
    name: string,
    description: string,
    isPublic: boolean,
    imgUrl: string,
    isDeleted: boolean,
    sessions?: Array<gameSessionModel>,
    adminId: number,
    admin?: User,
}
export interface EventSessionsModel{
    sessionId : number,
    startDate : Date,
    endDate : Date,
    seats : number,
    master : User | undefined,
    game :  {
        name : string,
        description : string,
        imgUrl: string
    },
    event : {
        eventId : number,
        name: string,
        description : string
    }
}

