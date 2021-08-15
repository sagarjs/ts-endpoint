

export interface Stuff {
    key: String,
    createdAt: String,
    totalCount: number,
}

export interface StuffRequest {
    startDate: string,
    endDate: string,
    minCount: number,
    maxCount: number
}

export interface StuffResponse {
    code: number,
    msg: string,
    records: Stuff[]

}