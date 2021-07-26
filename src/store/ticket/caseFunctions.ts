import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const getTickets = (state: IState): IState => ({
    ...state,
    ticketList: { ...state.ticketList, loading: true, error: false },
});

export const getTicketsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    ticketList: {
        data: action.payload.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const getTicketsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    ticketList: {
        ...state.ticketList,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al obtener la lista de tickets',
    },
});

export const getTicketsReset = (state: IState): IState => ({
    ...state,
    ticketList: initialState.ticketList,
});
