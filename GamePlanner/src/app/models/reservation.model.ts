import { gameSessionModel } from "./gameSession.model";
import { User } from "./user.model";

export interface reservationModel {
    reservationId: number,
    token: string,
    isConfirmed: boolean,
    isDeleted: boolean,
    sessionId: number,
    userId: number,
    session?: gameSessionModel,
    user?: User
}