import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const getChannels = (state: IState): IState => ({
    ...state,
    channelList: { ...state.channelList, loading: true, error: false },
});

export const getChannelsSuccess = (state: IState, action: IAction): IState => {
    return{
        ...state,
        channelList: {
            data: action.payload.pageData.data || [],
            count: action.payload.count,
            loading: false,
            error: false,
        },
        successinsert:true
    }
};

export const getChannelsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    channelList: {
        ...state.channelList,
        loading: false,
        error: true,
        code: action.payload.code || 'getChannelsFailure:error',
        message: action.payload.message || 'Error al obtener la lista de tickets',
    },
    successinsert:false
});

export const getChannelsReset = (state: IState): IState => ({
    ...state,
    channelList: initialState.channelList,
    successinsert: false
});
