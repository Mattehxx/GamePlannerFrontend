export interface PatchOperation {
    operationType: number | undefined;
    path: string; 
    op: string;
    from: string | undefined;
    value: string;
}