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
    orgid: number;
    menu: ObjectApps
}
