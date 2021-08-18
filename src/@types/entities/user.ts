export interface IApplication {
    delete: boolean;
    insert: boolean;
    modify: boolean;
    view: boolean;
    path: string;
    description: string;
}

interface ObjectApps {
    [key: string]: IApplication
}

export interface IUser {
    email: string;
    firstname: string;
    lastname: string;
    status: string;
    token: string;
    usr: string;
    roledesc: string;
    redirect: string;
    menu: ObjectApps
}
