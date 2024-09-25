export interface IRootUnit{
    data: IDataUnit[];
    meta: IMeta;
}

export interface IDataUnit{
    id: number;
    name: string;
    measurement: string;
    unit: string;
    description: string;
    created_at: string | Date;
    updated_at: string | Date;
}

interface IMeta{
    message: string;
    status_code: string;
}