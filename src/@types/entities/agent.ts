export interface IAgent {
    userid: number;
    name: string;
    countActive: number;
    countPaused: number;
    countClosed: number;
    coundPending: number;
    status: string | null;
    channels: string[]
}