import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const getChannels = (state: IState): IState => ({
    ...state,
    channelList: { ...state.channelList, loading: true, error: false },
});

export const getChannelsSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        successinsert: true,
        channelList: {
            count: action.payload.count,
            data: action.payload.pageData.data || [],
            error: false,
            loading: false,
        },
    };
};

export const getChannelsSuccessInsert = (state: IState): IState => {
    return {
        ...state,
        successinsert: false,
        channelList: {
            count: 0,
            data: [],
            error: false,
            loading: false,
        },
    };
};

export const getChannelsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    successinsert: false,
    channelList: {
        ...state.channelList,
        code: action.payload.code || "getChannelsFailure:error",
        error: true,
        loading: false,
        message: action.payload.message || "Error al obtener la lista de tickets",
    },
});

export const getChannelsReset = (state: IState): IState => ({
    ...state,
    channelList: initialState.channelList,
    successinsert: false,
});

export const insertChannel = (state: IState): IState => ({
    ...state,
    insertChannel: { ...state.insertChannel, loading: true, error: false },
});

export const insertChannelSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    insertChannel: {
        ...state.insertChannel,
        error: !(action.payload?.success || true),
        loading: false,
        value: action.payload,
    },
});

export const insertChannelFailure = (state: IState, action: IAction): IState => ({
    ...state,
    insertChannel: {
        value: undefined,
        code: action.payload?.code,
        loading: false,
        error: true,
        message: action.payload?.message,
    },
});

export const insertChannelReset = (state: IState): IState => ({
    ...state,
    insertChannel: initialState.insertChannel,
});

export const valChannelsChannel = (state: IState): IState => ({
    ...state,
    valChannelsChannel: { ...state.valChannelsChannel, loading: true, error: false },
});

export const valChannelsChannelSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    valChannelsChannel: {
        ...state.valChannelsChannel,
        error: !(action.payload?.success || true),
        loading: false,
        value: action.payload,
    },
});

export const valChannelsChannelFailure = (state: IState, action: IAction): IState => ({
    ...state,
    valChannelsChannel: {
        code: action.payload?.code,
        error: true,
        loading: false,
        message: action.payload?.message,
        value: action.payload,
    },
});

export const valChannelsChannelReset = (state: IState): IState => ({
    ...state,
    valChannelsChannel: initialState.valChannelsChannel,
});

export const checkvalidity = (state: IState): IState => ({
    ...state,
    error: false,
    isvalid: false,
    loading: true,
});

export const checkvaliditySuccess = (state: IState, action: IAction): IState => ({
    ...state,
    error: false,
    isvalid: action.payload?.isvalid,
    loading: false,
});

export const checkvalidityFailure = (state: IState, action: IAction): IState => ({
    ...state,
    error: true,
    loading: false,
    message: action.payload?.message || "Ocurrio un error al validar el canal",
});

export const checkvalidityReset = (state: IState): IState => ({
    ...state,
    error: false,
    isvalid: false,
    loading: false,
    message: "",
});

export const verifyPlanFunc = (state: IState): IState => ({
    ...state,
    verifyPlan: { ...state.verifyPlan, loading: true, error: false },
});

export const verifyPlanSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        verifyPlan: {
            ...state.verifyPlan,
            data: action.payload?.data || [],
            error: action.payload?.error,
            loading: false,
        },
    };
};

export const verifyPlanFailure = (state: IState): IState => {
    return {
        ...state,
        verifyPlan: {
            ...state.verifyPlan,
            error: true,
            loading: false,
        },
    };
};

export const getCurrency = (state: IState): IState => ({
    ...state,
    currencyList: { ...state.currencyList, loading: true, error: false },
});

export const getCurrencySuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        successinsert: true,
        currencyList: {
            count: action.payload.count,
            data: action.payload.data || [],
            error: false,
            loading: false,
        },
    };
};

export const getCurrencyFailure = (state: IState, action: IAction): IState => ({
    ...state,
    successinsert: false,
    currencyList: {
        ...state.currencyList,
        code: action.payload.code || "getCurrencyFailure:error",
        error: true,
        loading: false,
        message: action.payload.message || "Error al obtener la lista de Monedas",
    },
});

export const getCountry = (state: IState): IState => ({
    ...state,
    countryList: { ...state.countryList, loading: true, error: false },
});

export const getCountrySuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        successinsert: true,
        countryList: {
            count: action.payload.count,
            data: action.payload.data || [],
            error: false,
            loading: false,
        },
    };
};

export const getCountryFailure = (state: IState, action: IAction): IState => ({
    ...state,
    successinsert: false,
    countryList: {
        ...state.countryList,
        code: action.payload.code || "getCurrencyFailure:error",
        error: true,
        loading: false,
        message: action.payload.message || "Error al obtener la lista de Monedas",
    },
});