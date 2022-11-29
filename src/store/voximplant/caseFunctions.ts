import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const manageConnection = (state: IState, action: IAction): IState => ({
    ...state,
    connection: {
        error: action.payload.error,
        message: action.payload.message,
        loading: action.payload.loading
    }
});

export const setModalCall = (state: IState, action: IAction): IState => {
    return {
        ...state,
        showcall: action.payload.showModalCall,
        // transferAction: action.payload.transferAction,
    }
}
export const setPhoneNumber = (state: IState, action: IAction): IState => ({
    ...state,
    phoneNumber: action.payload,
})

export const setHold = (state: IState, action: IAction): IState => ({
    ...state,
    calls: state.calls.map(x => x.statusCall !== "DISCONNECTED" && x.number === action.payload.number ? ({
        ...x,
        onholddate: new Date().toISOString(),
        onhold: action.payload.hold,
    }) : x),
})

export const initCall = (state: IState, action: IAction): IState => ({
    ...state,
    calls: [...state.calls, action.payload],
    callOnLine: true
})

export const manageStatusCall = (state: IState, action: IAction): IState => {
    const newcalls = state.calls.map(x => x.statusCall !== "DISCONNECTED" && x.number === action.payload.number ? ({
        ...x,
        statusCall: action.payload.status
    }) : x)
    return {
        ...state,
        callOnLine: newcalls.some(call => call.statusCall !== "DISCONNECTED"),
        calls: newcalls
    }
}

export const resetCall = (state: IState, action: IAction): IState => ({
    ...state,
    calls: state.calls.filter(x => x.statusCall !== "DISCONNECTED" && x.number === action.payload)
})

export const setTransferAction = (state: IState, action: IAction): IState => {
    return {
        ...state,
        transferAction: action.payload
    }
}

export const initTransferCall = (state: IState, action: IAction): IState => {
    return {
        ...state,
        calls: state.calls.map(x => x.statusCall !== "DISCONNECTED" && x.number === action.payload.number ? ({
            ...x,
            transfer: {
                ...action.payload,
                statusCall: "CONNECTING",
                mute: false,
                hold: false,
            }
        }): x),
    }
}

export const connectedTransferCall = (state: IState, action: IAction): IState => {
    return {
        ...state,
        calls: state.calls.map(x => x.statusCall !== "DISCONNECTED" && x.number === action.payload.number ? ({
            ...x,
            transfer: {
                ...x.transfer,
                statusCall: "CONNECTED",
            }
        }): x),
    }
}

export const setTransferCall = (state: IState, action: IAction): IState => {
    return {
        ...state,
        calls: state.calls.map(x => x.statusCall !== "DISCONNECTED" && x.number === action.payload.number ? ({
            ...x,
            transfer: {
                ...x.transfer,
                ...action.payload
            }
        }): x),
    }
}

export const resetTransferCall = (state: IState, action: IAction): IState => {
    return {
        ...state,
        calls: state.calls.map(x => x.statusCall !== "DISCONNECTED" && x.number === action.payload.number ? ({
            ...x,
            transfer: undefined
        }): x),
    }
}

export const getCategories = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCategories: {
        ...state.requestGetCategories,
        error: false,
        loading: true,
    }
})

export const getCategoriesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCategories: {
        ...state.requestGetCategories,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getCategoriesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCategories: {
        ...state.requestGetCategories,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getCategoriesReset = (state: IState): IState => ({
    ...state,
    requestGetCategories: initialState.requestGetCategories,
})

export const getCountryStates = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCountryStates: {
        ...state.requestGetCountryStates,
        error: false,
        loading: true,
    }
})

export const getCountryStatesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCountryStates: {
        ...state.requestGetCountryStates,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getCountryStatesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCountryStates: {
        ...state.requestGetCountryStates,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getCountryStatesReset = (state: IState): IState => ({
    ...state,
    requestGetCountryStates: initialState.requestGetCountryStates,
})

export const getRegions = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetRegions: {
        ...state.requestGetRegions,
        error: false,
        loading: true,
    }
})

export const getRegionsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetRegions: {
        ...state.requestGetRegions,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getRegionsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetRegions: {
        ...state.requestGetRegions,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getRegionsReset = (state: IState): IState => ({
    ...state,
    requestGetRegions: initialState.requestGetRegions,
})


export const getHistory = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetHistory: {
        ...state.requestGetHistory,
        error: false,
        loading: true,
    }
})

export const getHistoryFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetHistory: {
        ...state.requestGetHistory,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getHistorySuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetHistory: {
        ...state.requestGetHistory,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getHistoryReset = (state: IState): IState => ({
    ...state,
    requestGetHistory: initialState.requestGetHistory,
})

export const getAdvisors = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetAdvisors: {
        ...state.requestGetAdvisors,
        error: false,
        loading: true,
    }
})

export const getAdvisorsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetAdvisors: {
        ...state.requestGetAdvisors,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getAdvisorsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetAdvisors: {
        ...state.requestGetAdvisors,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getAdvisorsReset = (state: IState): IState => ({
    ...state,
    requestGetAdvisors: initialState.requestGetAdvisors,
})

export const getMaximumConsumption = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetMaximumConsumption: {
        ...state.requestGetMaximumConsumption,
        error: false,
        loading: true,
    }
})

export const getMaximumConsumptionFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetMaximumConsumption: {
        ...state.requestGetMaximumConsumption,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getMaximumConsumptionSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetMaximumConsumption: {
        ...state.requestGetMaximumConsumption,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getMaximumConsumptionReset = (state: IState): IState => ({
    ...state,
    requestGetMaximumConsumption: initialState.requestGetMaximumConsumption,
})

export const transferAccountBalance = (state: IState, action: IAction): IState => ({
    ...state,
    requestTransferAccountBalance: {
        ...state.requestTransferAccountBalance,
        error: false,
        loading: true,
    }
})

export const transferAccountBalanceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestTransferAccountBalance: {
        ...state.requestTransferAccountBalance,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const transferAccountBalanceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestTransferAccountBalance: {
        ...state.requestTransferAccountBalance,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const transferAccountBalanceReset = (state: IState): IState => ({
    ...state,
    requestTransferAccountBalance: initialState.requestTransferAccountBalance,
})

export const getAccountBalance = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetAccountBalance: {
        ...state.requestGetAccountBalance,
        error: false,
        loading: true,
    }
})

export const getAccountBalanceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetAccountBalance: {
        ...state.requestGetAccountBalance,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getAccountBalanceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetAccountBalance: {
        ...state.requestGetAccountBalance,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getAccountBalanceReset = (state: IState): IState => ({
    ...state,
    requestGetAccountBalance: initialState.requestGetAccountBalance,
})

export const getCallRecord = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCallRecord: {
        ...state.requestGetCallRecord,
        error: false,
        loading: true,
    }
})

export const getCallRecordFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCallRecord: {
        ...state.requestGetCallRecord,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getCallRecordSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCallRecord: {
        ...state.requestGetCallRecord,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getCallRecordReset = (state: IState): IState => ({
    ...state,
    requestGetCallRecord: initialState.requestGetCallRecord,
})

export const updateScenario = (state: IState, action: IAction): IState => ({
    ...state,
    requestUpdateScenario: {
        ...state.requestUpdateScenario,
        error: false,
        loading: true,
    }
})

export const updateScenarioFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestUpdateScenario: {
        ...state.requestUpdateScenario,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const updateScenarioSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestUpdateScenario: {
        ...state.requestUpdateScenario,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const updateScenarioReset = (state: IState): IState => ({
    ...state,
    requestUpdateScenario: initialState.requestUpdateScenario,
})