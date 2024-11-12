import { GameModel } from "./game.model";
import { gameSessionModel } from "./gameSession.model";
import { User } from "./user.model";

export interface EventModel{
    eventId: number
    name: string,
    description: string,
    eventDate: Date,
    eventEndDate: Date, 
    duration: number,
    isPublic: boolean,
    imgUrl: string,
    isDeleted: boolean,
    recurrenceId: number,
    gameId: number, 
    game?: GameModel,
    gameSessions?: Array<gameSessionModel>,
    adminId: number,
    admin?: User,
}

