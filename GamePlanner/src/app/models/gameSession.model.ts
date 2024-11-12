import { tableModel } from "./table.model";
import { User } from "./user.model";

export interface gameSessionModel{
    gameSessionId: number,
    gameSessionDate: Date,
    gameSessionEndDate: Date,
    isDeleted: boolean,
    masterId: number,
    eventId: number,
    tableId: number,
    master?: User,
    table?: tableModel
}
