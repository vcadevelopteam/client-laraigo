export interface IAgent {
    userid: number;
    name: string;
    countActive: number;
    countPaused: number;
    countClosed: number;
    countAnswered: number;
    countNotAnswered?: number;
    countPending: number;
    status: string | null;
    motivetype?: string | null;
    userstatustype?: string | null;
    groups: string | null;
    image: string | null;
    channels: string[];
    isConnected?: boolean;
    showinfo?: boolean;
    avgtimewaiting?: string,
    maxtimewaiting?: string,
    mintimewaiting?: string,
}