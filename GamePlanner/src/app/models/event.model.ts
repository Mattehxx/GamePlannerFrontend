export interface EventModel{
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
    adminId: number
}