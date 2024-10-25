export interface IRootUnitReport{
    data: IDataUnitReport[]
    meta: IMeta
}

export interface IDataUnitReport{
    id: string
    name: string
    description: string
    value: string
    dimension: string
    code: string
    unit: IUnit
}

interface IUnit{
    id: number;
    name: string;
    measurement: string
    unit: string
    description: string
}

interface IMeta {
    message: string
    status_code: number
}
  