export interface IInteraction {
    interactionid: number;
    interactiontype: string;
    interactiontext: string;
    createdate: string;
    userid?: number | null;
    personid?: number | null;
    usertype?: string | null;
    avatar?: string | null;
    emailcopy: string | null;
    emailcocopy: string | null;
    likewall?: boolean | null;
    hiddenwall?: boolean | null;
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
    interactions: IInteraction[];
    interactionid: number;
    interactiontext?: string;
    interactiontype?: string;
    listImage?: string[];
    emailcopy?: string;
    emailcocopy?: string;
}