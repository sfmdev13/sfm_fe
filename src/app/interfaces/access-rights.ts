export interface IRootAccessRights{
    nav_name: string;
    slug: string;
    nav_section: INavSection[]
}

interface INavSection{
    section_name: string;
    slug: string;
    section_action: ISectionAction[]
}

interface ISectionAction{
    name: string;
    slug: string;
}