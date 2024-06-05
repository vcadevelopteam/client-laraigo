import { IAction, IActionTypes, IAPIMiddlewareAction } from '@types';
import { AxiosError } from 'axios';
import { messages } from 'common/constants';
// import { type } from 'os';
import { Middleware, Dispatch } from 'redux';

const validTypes = (types: IActionTypes): boolean => {
    return types.failure !== "" && types.success !== "" && types.loading !== "";
}

const handleError = (error: AxiosError, dispatch: Dispatch<IAction>, actionType: string) => {
    const response = error.response;
    const errorMessage = (error.toJSON() as any)['message'] as string;
    if (errorMessage.toLocaleLowerCase() === 'network error') {
        console.error('Axios network error');
        dispatch({ type: actionType, payload: { error: true, message: 'network error', code: error.code } });
        return;
    }

    if (!response) {
        dispatch({ type: actionType, payload: { error: true, message: messages.GENERAL_ERROR, code: '500' } });
    } else if (response.data) {
        console.error('Error Code:', response.status);
        const { message, code, key } = response.data;
        dispatch({ type: actionType, payload: { message, code, key } }); 
    }
    // else if (await authorizationHelper.isUnauthorizedCall(dispatch, response)) return;
    else if (response.status === 400 || response.status === 404) {
        if (actionType?.startsWith('integrationmanager')) {
            dispatch({ type: actionType, payload: { error: true, message: errorMessage, code: response.status } });
        }
        else {
            if (response.data.message) dispatch({ type: actionType, payload: { error: response.data.message } });
            else dispatch({ type: actionType, payload: { error: messages.GENERAL_ERROR } });
        }
    }
    else {
        if (actionType?.startsWith('integrationmanager')) {
            dispatch({ type: actionType, payload: { error: true, message: errorMessage, code: response.status } });
        }
        else {
            dispatch({ type: actionType, payload: { error: messages.GENERAL_ERROR } });
        }
    }
}

const callAPIMiddleware: Middleware = ({ dispatch, getState }) => {
    return (next: Dispatch) => async (action: IAPIMiddlewareAction) => {
        const { types, callAPI, shouldCallAPI, successFunction, failureFunction, payload = {} } = action;

        if (!types) return next(action);

        if (!callAPI) throw new Error("Aborting callAPIMiddleware because callAPI is null or undefined");

        if (!validTypes(types)) throw new Error("Invalid Action.types value");

        if (!(shouldCallAPI?.(getState()) ?? true)) return;

        dispatch<IAction>({ payload, type: types.loading });

        try {
            const response = await callAPI();
            const responseData = response.data;

            let combinedPayload = {};

            if (responseData) {
                // if (responseData instanceof Blob)

                if (Array.isArray(responseData)) {
                    combinedPayload = {
                        ...payload,
                        data: responseData,
                    };
                } else {
                    combinedPayload = {
                        ...payload,
                        ...responseData,
                    };
                }

                if (responseData.error) {
                    dispatch<IAction>({ payload: combinedPayload, type: types.failure });
                    return;
                }

                successFunction?.(responseData);
                dispatch({ payload: combinedPayload, type: types.success });
            } else {
                const payload = {
                    error: true,
                    message: 'No encontrado',
                    code: 'error:not-found',
                };
                dispatch<IAction>({ payload, type: types.failure });
            }
        } catch (error) {
            console.error('On APIMiddleware error');
            const axiosError = error as AxiosError;
            // if (axioserror.response && axioserror.response.data instanceof Blob)
            failureFunction?.(axiosError);
            handleError(axiosError, dispatch, types.failure);
        }
    };
};


export default callAPIMiddleware;
