export interface IApplication {
    delete: boolean;
    insert: boolean;
    modify: boolean;
    view: boolean;
    path: string;
    description: string;
}

interface ObjectApps {
    [key: string]: boolean[]
}

interface Organization {
    orgid: number;
    corpid: number;
    orgdesc: string;
    corpdesc: string;
}

export interface IUser {
    email: string;
    firstname: string;
    lastname: string;
    status: string;
    token: string;
    usr: string;
    roledesc: string;
    corpdesc: string;
    orgdesc: string;
    redirect: string;
    userid: number;
    corpid: number;
    orgid: number;
    menu: ObjectApps;
    organizations: Organization[];
}
