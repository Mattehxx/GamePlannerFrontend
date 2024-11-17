import { EventModel } from "./event.model";
import { GameModel } from "./game.model";
import { reservationModel } from "./reservation.model";
import { User } from "./user.model";

export interface gameSessionModel{
    sessionId: number,
    startDate: Date,
    endDate: Date,
    seats: number,
    isDeleted: boolean,
    masterId: string,
    master?: User,
    eventId: number,
    event?: EventModel,
    gameId: number,
    game?: GameModel,
    reservations: Array<reservationModel>
}
