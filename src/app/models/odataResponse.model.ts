export interface ODataResponse<T>{
    '@odata.context' : string,
    value : T[]
}