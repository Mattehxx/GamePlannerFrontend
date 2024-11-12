import { GameModel } from "./game.model";
import { gameSessionModel } from "./gameSession.model";

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
    adminId: number,
    game?: GameModel,
    gameSessions?: Array<gameSessionModel>
}

