export interface IRootAllRoles{
    data: IDataAllRoles[];
    meta: IMeta
}

interface IDataAllRoles{
    id: number;
    title: string;
    slug: string;
}

interface IMeta{
    message: string;
    status_code: string;
}