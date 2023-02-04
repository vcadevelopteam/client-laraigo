import axios, { ResponseType } from 'axios';
import { getAuthorizationToken } from '../common/helpers';

interface IRequestConfig {
    params?: any;
    auth?: any;
    headers?: any;
    data?: any;
    responseType?: ResponseType;
}

enum RequestType {
    GET,
    POST,
    PUT,
    DELETE,
}

// createFormData is a recursive func, that detect any File object in our long struct and attach that file on 'files'(that will be catch by filepond, nest(using interceptors)), at the same time our object with data mantain the same struct.
function createFormData(object: any, form?: FormData, namespace?: string): FormData {
    const formData = form || new FormData();

    for (let property in object) {
        const formKey = namespace ? `${namespace}[${property}]` : property;

        if (object[property] instanceof Date)
            formData.append(formKey, object[property].toString());
        else if (typeof object[property] === 'object' && !(object[property] instanceof File))
            createFormData(object[property], formData, formKey);
        else if (object[property] instanceof File)
            formData.append('files', object[property]);
        else
            formData.append(formKey, object[property]);
    }

    return formData;
}
function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const statusAllowed = [200, 201, 202, 204, 400, 401, 404, 500];
export const APIManager = {
    async get<T = any>(url: string, config: IRequestConfig = {}, withToken = true) {
        const { params, responseType } = config;
        const headers = await getHeaders(RequestType.GET, withToken);
        return axios.get<T>(url, { params, headers, responseType });
    },

    async post<T = any>(url: string, config: IRequestConfig = {}, withToken = true) {
        const { params, data, responseType } = config;
        const headers = await getHeaders(RequestType.POST, withToken);
        let rr = null
        let retry = 3;
        retry = retry - 1;
        while (true) {
            try {
                rr = await axios.post<T>(url, data, { params, headers, responseType })
            } catch (error) {
                if (error?.response) {
                    if (!statusAllowed.includes(error?.response?.status) && retry !== 0) {
                        retry = retry - 1;
                        await timeout(3000);
                        continue;
                    }
                    throw error
                } else {
                    if (retry !== 0) {
                        retry = retry - 1;
                        await timeout(3000);
                        continue;
                    }
                    throw error
                }
            }
            break;
        }

        return rr;
    },

    async put<T = any>(url: string, config: IRequestConfig = {}) {
        const { params, data, responseType } = config;
        const headers = await getHeaders(RequestType.PUT);
        return axios.put<T>(url, data, { params, headers, responseType });
    },

    async delete<T = any>(url: string, config: IRequestConfig = {}) {
        const { params, responseType } = config;
        const headers = await getHeaders(RequestType.DELETE);
        return axios.delete<T>(url, { params, headers, responseType });
    },

    async postWithFiles<T = any>(url: string, config: IRequestConfig) {
        const { params, data } = config,
            headers = await getHeaders(RequestType.POST);

        return axios.post<T>(url, createFormData(data), { params, headers });
    },

    async putWithFiles<T = any>(url: string, config: IRequestConfig) {
        const { params, data } = config,
            headers = await getHeaders(RequestType.PUT);

        return axios.put<T>(url, createFormData(data), { params, headers });
    },
};

async function getHeaders(type: RequestType, withToken = true): Promise<any> {
    const defaults: any = { Accept: 'application/json' };
    if (type !== RequestType.GET) defaults['Content-type'] = 'application/json';
    if (withToken === true) {
        const token = getAuthorizationToken();
        defaults['Authorization'] = `Bearer ${token}`;
    }
    return defaults;
}

export const ExternalRequestManager = {
    async get<T = any>(url: string, config: IRequestConfig = {}) {
        const { auth, headers } = config;
        return axios.get<T>(url, await setConfig(auth, headers));
    },

    async post<T = any>(url: string, config: IRequestConfig = {}) {
        const { auth, headers, data } = config;
        return axios.post<T>(url, data, await setConfig(auth, headers));
    },

    async postForm<T = any>(url: string, config: IRequestConfig) {
        const { auth, headers, data } = config;
        return axios.post<T>(url, createFormData(data), await setConfig(auth, headers));
    },
}

async function setConfig(auth: any, headers: any): Promise<any> {
    const defaults: any = { headers: headers };
    const { type, token, username, password } = auth;
    if (token) {
        defaults['headers']['Authorization'] = `Bearer ${token}`;
    }
    if (type === 'BASIC') {
        defaults['auth'] = { username, password }
    }
    return defaults;
}
