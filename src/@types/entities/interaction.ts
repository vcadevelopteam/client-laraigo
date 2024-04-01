export interface IInteraction {
    interactionid: number;
    interactiontype: string;
    interactiontext: string;
    createdate: string;
    userid?: number | null;
    personid?: number | null;
    usertype?: string | null;
    avatar?: string | null;
    emailcopy?: string;
    emailcocopy?: string;
    reply?: boolean;
    indexImage?: number | undefined;
    listImage?: string[] | undefined;
    isHide?: boolean;
    onlyTime?: string;
}

export interface IGroupInteraction {
    createdate: string;
    userid?: number | null;
    personid?: number | null;
    usertype: string | null;
    reply?: boolean;
    interactions: IInteraction[];
    interactionid: number;
    interactiontext?: string;
    interactiontype?: string;
    listImage?: string[];
    emailcopy?: string;
    emailcocopy?: string;
}