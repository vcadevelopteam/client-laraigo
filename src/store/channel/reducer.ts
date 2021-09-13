import { Dictionary, IListStatePaginated } from "@types";
import { createReducer, initialListPaginatedState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    channelList: IListStatePaginated<Dictionary>;
    successinsert: Boolean;
}

export const initialState: IState = {
    channelList: initialListPaginatedState,
    successinsert: false
};

export default createReducer<IState>(initialState, {
    [actionTypes.CHANNELS]: caseFUnctions.getChannels,
    [actionTypes.CHANNELS_SUCCESS]: caseFUnctions.getChannelsSuccess,
    [actionTypes.CHANNELS_FAILURE]: caseFUnctions.getChannelsFailure,
    [actionTypes.CHANNELS_RESET]: caseFUnctions.getChannelsReset,
    [actionTypes.CHANNELS_INSERTSUCCESS]: caseFUnctions.getChannelsSuccessInsert,
});
