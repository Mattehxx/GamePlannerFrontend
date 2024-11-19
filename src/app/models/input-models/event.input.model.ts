export interface EventInputModel{
    name: string,
    description: string,
    isPublic: boolean,
    image: FormData | File,
    adminId: number
}