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
    gameSessions?: Array<gameSessionModel>,
    adminId: number,
    admin?: User,
}

