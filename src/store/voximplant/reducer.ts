import { IListState, IObjectState, ITicket } from "@types";
import { createReducer, initialListState, initialObjectState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { Client } from 'voximplant-websdk/Client';
import { Call } from 'voximplant-websdk/Call/Call';

export interface IState {
    sdk: Client | null;
    call: { call?: Call | null, type: string, number: string, identifier: string, data?: ITicket };
    statusCall: string;
    connection: { error: boolean; message: string; loading: boolean };
    showcall: boolean;
}

export const initialState: IState = {
    sdk: null,
    call: { call: null, type: "", number: "", identifier: "" },
    statusCall: "DISCONNECTED",
    connection: { error: false, message: "", loading: false },
    showcall: false,
};

export default createReducer<IState>(initialState, {
    [actionTypes.INIT_CALL]: caseFUnctions.initCall,
    [actionTypes.SET_MODAL_CALL]: caseFUnctions.setModalCall,
    [actionTypes.MANAGE_STATUS_CALL]: caseFUnctions.manageStatusCall,
    [actionTypes.MANAGE_CONNECTION]: caseFUnctions.manageConnection,
});
