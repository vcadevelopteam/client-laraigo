export interface IInteraction {
    interactionid: number;
    interactiontype: string;
    interactiontext: string;
    createdate: string;
    userid?: number | null;
    personid?: number | null;
    usertype?: string | null;
    avatar?: string | null;
    likewall?: boolean | null;
    hiddenwall?: boolean | null;
}

export interface IGroupInteraction {
    createdate: string;
    userid?: number | null;
    personid?: number | null;
    usertype: string | null;
    interactions: IInteraction[];
    interactionid: number;
}