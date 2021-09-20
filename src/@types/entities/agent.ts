export interface IAgent {
    userid: number;
    name: string;
    countActive: number;
    countPaused: number;
    countClosed: number;
    countAnwsered: number;
    countNotAnwsered?: number;
    countPending: number;
    status: string | null;
    channels: string[]
}