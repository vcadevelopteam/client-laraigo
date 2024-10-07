import { IAction, IUser } from "@types";
import { initialState, IState } from "./reducer";
import { saveAuthorizationToken, removeAuthorizationToken } from "common/helpers";
import { keys } from "common/constants";

export const login = (state: IState): IState => ({
    ...state,
    validateToken: initialState.validateToken,
    login: {
        ...state.login,
        loading: true,
        error: false
    }
});

export const loginSuccess = (state: IState, action: IAction): IState => {
    saveAuthorizationToken(action.payload.data.token);
    // localStorage.removeItem(keys.HIDE_LOGS)
    return {
        ...state,
        login: {
            ...state.login,
            loading: false,
            error: false,
            user: action.payload.data,
        }
    }
};

export const loginFailure = (state: IState, action: IAction): IState => ({
    ...state,
    login: {
        ...state.login,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
    }
});

export const loginReset = (state: IState): IState => ({
    ...state,
    login: initialState.login,
});





export const invokeIncremental = (state: IState): IState => ({
    ...state,
    invokeIncremental: {
        ...state.invokeIncremental,
        loading: true,
        error: false
    }
});

export const invokeIncrementalSuccess = (state: IState): IState => {
    return {
        ...state,
        invokeIncremental: {
            ...state.invokeIncremental,
            loading: false,
            error: false,
        }
    }
};

export const invokeIncrementalFailure = (state: IState, action: IAction): IState => ({
    ...state,
    invokeIncremental: {
        ...state.invokeIncremental,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
    }
});

export const invokeIncrementalReset = (state: IState): IState => ({
    ...state,
    invokeIncremental: initialState.invokeIncremental,
});







export const updateUserInformation = (state: IState, action: IAction): IState => ({
    ...state,
    validateToken: {
        ...state.validateToken,
        user: {
            ...state.validateToken.user,
            ...action.payload
        },
    }
});

export const validateToken = (state: IState): IState => ({
    ...state,
    validateToken: {
        ...state.validateToken,
        loading: true,
        error: false
    }
});

export const validateTokenSuccess = (state: IState, action: IAction): IState => {
    saveAuthorizationToken(action.payload.data.token);
    return {
        ...state,
        validateToken: {
            ...state.validateToken,
            loading: false,
            error: false,
            user: action.payload.data,
            notifications: action.payload.data.notifications
        }
    }
};

export const validateTokenFailure = (state: IState, action: IAction): IState => {
    removeAuthorizationToken()
    return {
        ...state,
        validateToken: {
            ...state.validateToken,
            loading: false,
            error: true,
            code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        }
    }
};

export const validateTokenReset = (state: IState): IState => ({
    ...state,
    validateToken: initialState.validateToken,
});


export const newNotification = (state: IState, action: IAction): IState => ({
    ...state,
    validateToken: {
        ...state.validateToken,
        notifications: [...(state.validateToken?.notifications || []), action.payload]
    }
});

export const updateConnection = (state: IState, action: IAction): IState => ({
    ...state,
    validateToken: {
        ...state.validateToken,
        lastConnection: action.payload
    }
});




export const changeOrganization = (state: IState): IState => ({
    ...state,
    triggerChangeOrganization: {
        ...state.triggerChangeOrganization,
        loading: true,
        error: false
    }
});

export const changeOrganizationSuccess = (state: IState, action: IAction): IState => {
    saveAuthorizationToken(action.payload.data.token);
    return {
        ...state,
        triggerChangeOrganization: {
            ...state.triggerChangeOrganization,
            automaticConnection: action.payload.data.automaticConnection,
            loading: false,
            error: false,
        }
    }
};

export const changeOrganizationFailure = (state: IState, action: IAction): IState => {
    // removeAuthorizationToken()
    return {
        ...state,
        triggerChangeOrganization: {
            ...state.triggerChangeOrganization,
            loading: false,
            error: true,
            code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        }
    }
};

export const changeOrganizationReset = (state: IState): IState => ({
    ...state,
    triggerChangeOrganization: initialState.triggerChangeOrganization,
});







export const logout = (state: IState): IState => {
    return {
        ...state,
        login: {
            ...state.login,
            loading: false,
            error: false,
            user: null
        },
        logout: {
            ...state.logout,
            loading: true,
            error: false
        }
    }
};

export const logoutSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        logout: {
            ...state.logout,
            data: action.payload.data,
            loading: false,
            error: false,
        },
        // validateToken: initialState.validateToken,
    }
};

export const cleanValidateToken = (state: IState): IState => ({
    ...state,
    validateToken: initialState.validateToken,
});

export const logoutFailure = (state: IState, action: IAction): IState => {
    return {
        ...state,
        logout: {
            ...state.logout,
            loading: false,
            error: true,
            code: action.payload.code || 'logoutFailure:error',
        }
    }
};

export const logoutReset = (state: IState): IState => ({
    ...state,
    logout: initialState.logout,
});

export const changePwdFirstLogin = (state: IState, action: IAction): IState => ({
    ...state,
    validateToken: {
        ...state.validateToken,
        user: {
            ...(state.validateToken.user || {} as IUser),
            pwdchangefirstlogin: action.payload.value,
        },
    },
    ignorePwdchangefirstloginValidation: action.payload.ignorePwdchangefirstloginValidation,
});


export const updateLanguage = (state: IState, action: IAction): IState => {
    return ({
        ...state,
        validateToken: {
            ...state.validateToken,
            user: {
                ...(state.validateToken.user || {} as IUser),
                languagesettings: JSON.parse(action.payload.value),
            },
        },

    })
}

export const updateListOrgs = (state: IState, action: IAction): IState => {
    const orgs = (state.validateToken.user?.organizations || []);
    const orgExisted = orgs.some(x => x.orgid === action.payload.org.orgid)
    return ({
        ...state,
        validateToken: {
            ...state.validateToken,
            user: {
                ...(state.validateToken.user || {} as IUser),
                organizations: orgExisted ? (orgs).map(x => x.orgid === action.payload.org.orgid ? action.payload.org : x) : [
                    ...(orgs),
                    action.payload.org
                ]
            },
        },

    })
}