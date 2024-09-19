export interface IRootAccessRights{
    nav_name: string;
    slug: string;
    selected: boolean;
    nav_section: INavSection[]
}

interface INavSection{
    section_name: string;
    slug: string;
    selected: boolean;
    section_action: ISectionAction[]
}

interface ISectionAction{
    name: string;
    slug: string;
    selected: boolean;
}