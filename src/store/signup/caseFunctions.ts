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

export const getChannelsSuccessInsert = (state: IState, action: IAction): IState => {
    return{
        ...state,
        channelList: {
            data: [],
            count: 0,
            loading: false,
            error: false,
        },
        successinsert:false
    }
}
;

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

export const insertChannel = (state: IState): IState => ({
    ...state,
    insertChannel: { ...state.insertChannel, loading: true, error: false },
});

export const insertChannelSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    insertChannel: {
        ...state.insertChannel,
        value: action.payload,
        loading: false,
        error: !(action.payload?.success||true),
    },
});

export const insertChannelFailure = (state: IState, action: IAction): IState => ({
    ...state,
    insertChannel: {
        value: undefined,
        loading: false,
        error: true,
        message: action.payload?.message || "Ocurrio uun error al insertar el canal"
    },
});

export const insertChannelReset = (state: IState): IState => ({
    ...state,
    insertChannel: initialState.insertChannel,
});

export const checkvalidity = (state: IState): IState => ({
    ...state,
    isvalid: false,
    loading: true,
    error: false,
});
export const checkvaliditySuccess = (state: IState, action: IAction): IState => ({
    ...state,
    isvalid: action.payload?.isvalid,
    loading: false,
    error: false,
});
export const checkvalidityFailure = (state: IState, action: IAction): IState => ({
    ...state,
    loading: false,
    error: true,
    message: action.payload?.message || "Ocurrio uun error al insertar el canal"
});
export const checkvalidityReset = (state: IState): IState => ({
    ...state,
    isvalid: false,
    loading: false,
    error: false,
    message: ""
});

export const verifyPlanFunc = (state: IState): IState => ({
    ...state,
    verifyPlan: { ...state.verifyPlan, loading: true, error: false },
});

export const verifyPlanSuccess = (state: IState, action: IAction): IState => {
    return{
        ...state,
        verifyPlan: {
            ...state.verifyPlan,
            loading: false,
            data: action.payload?.data||[],
            error: action.payload?.error,
        },
    }
};
export const verifyPlanFailure = (state: IState, action: IAction): IState => {
    return{
        ...state,
        verifyPlan: {
            ...state.verifyPlan,
            loading: false,
            error: true,
        },
    }
};

export const getCurrency = (state: IState): IState => ({
    ...state,
    currencyList: { ...state.currencyList, loading: true, error: false },
});

export const getCurrencySuccess = (state: IState, action: IAction): IState => {
    return{
        ...state,
        currencyList: {
            data: action.payload.data || [],
            count: action.payload.count,
            loading: false,
            error: false,
        },
        successinsert:true
    }
};

export const getCurrencyFailure = (state: IState, action: IAction): IState => ({
    ...state,
    currencyList: {
        ...state.currencyList,
        loading: false,
        error: true,
        code: action.payload.code || 'getCurrencyFailure:error',
        message: action.payload.message || 'Error al obtener la lista de Monedas',
    },
    successinsert:false
});
export const getCountry = (state: IState): IState => ({
    ...state,
    countryList: { ...state.countryList, loading: true, error: false },
});

export const getCountrySuccess = (state: IState, action: IAction): IState => {
    return{
        ...state,
        countryList: {
            data: action.payload.data || [],
            count: action.payload.count,
            loading: false,
            error: false,
        },
        successinsert:true
    }
};

export const getCountryFailure = (state: IState, action: IAction): IState => ({
    ...state,
    countryList: {
        ...state.countryList,
        loading: false,
        error: true,
        code: action.payload.code || 'getCurrencyFailure:error',
        message: action.payload.message || 'Error al obtener la lista de Monedas',
    },
    successinsert:false
});