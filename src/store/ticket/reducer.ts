import { IListStatePaginated, ITicket } from "@types";
import { createReducer, initialListPaginatedState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    ticketList: IListStatePaginated<ITicket>;
}

export const initialState: IState = {
    ticketList: initialListPaginatedState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.GET_TICKETS]: caseFUnctions.getTickets,
    [actionTypes.GET_TICKETS_SUCCESS]: caseFUnctions.getTicketsSuccess,
    [actionTypes.GET_TICKETS_FAILURE]: caseFUnctions.getTicketsFailure,
    [actionTypes.GET_TICKETS_RESET]: caseFUnctions.getTicketsReset,
});
