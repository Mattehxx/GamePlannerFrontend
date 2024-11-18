import { gameSessionModel } from "./gameSession.model";
import { User } from "./user.model";

export interface reservationModel {
    reservationId: number,
    token: string,
    isConfirmed: boolean,
    isDeleted: boolean,
    sessionId: number,
    userId: string,
    session?: gameSessionModel,
    user?: User
}