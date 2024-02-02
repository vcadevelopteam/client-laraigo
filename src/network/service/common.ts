import { apiUrls } from '../../common/constants';
import { IRequestBody, IRequestBodyPaginated, ITransaction, IRequestBodyDynamic, Dictionary } from '@types';
import { APIManager, ExternalRequestManager } from '../manager';
import { removeAuthorizationToken } from "common/helpers";

export function login(usr: string, password: string, facebookid: string, googleid: string, token_recaptcha: string) {
    const data = { usr, password, facebookid, googleid, token_recaptcha };
    return APIManager.post(apiUrls.LOGIN_URL, { data: { data } }, false);
}

export function logout() {
    const tmp = APIManager.post(apiUrls.LOGOUT_URL, {}, true);
    removeAuthorizationToken()
    return tmp;
}

export function uploadFile(data: FormData) {
    return APIManager.post(apiUrls.UPLOAD_FILE, { data }, true);
}

export function uploadFileMetadata(data: FormData) {
    return APIManager.post(apiUrls.UPLOAD_FILEMETADATA, { data }, true);
}

export function exportData(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.EXPORT_DATA, { data: requestBody }, true);
}

export function validateToken(firstLoad: string) {
    return APIManager.get(apiUrls.LOGIN_URL + `?firstload=${firstLoad ?? ""}`, {}, true);
}

export function incrementalInvokeToken() {
    return APIManager.get(apiUrls.INVOKE_INCREMENTAL, {}, true);
}

export function reeschedulecall(requestBody: Dictionary) {
    return APIManager.post(apiUrls.REESCHEDULECALL, { data: requestBody }, true);
}

export function changeOrganization(newcorpid: number, neworgid: number, corpdesc: string, orgdesc: string) {
    return APIManager.post(apiUrls.CHANGE_ORGANIZATION, { data: { parameters: { newcorpid, neworgid, corpdesc, orgdesc } } }, true);
}

export function main(requestBody: IRequestBody | ITransaction, transaction: boolean = false) {
    return APIManager.post(transaction ? apiUrls.EXECUTE_TRANSACTION : apiUrls.MAIN_URL, { data: requestBody }, true);
}
export function mainPublic(requestBody: IRequestBody | ITransaction) {
    return APIManager.post(apiUrls.MAIN_URL_PUBLIC, { data: requestBody }, true);
}
export function mainPaymentOrder(requestBody: IRequestBody | ITransaction) {
    return APIManager.post(apiUrls.MAIN_URL_PAYMENTORDER, { data: requestBody }, true);
}

export function multiMain(requestBody: IRequestBody[]) {
    return APIManager.post(apiUrls.MAIN_MULTI, { data: requestBody }, true);
}
export function multiMainPublic(requestBody: string[]) {
    return APIManager.post(apiUrls.MAIN_MULTI_PUBLIC, { data: { parameters: { domains: requestBody } } }, true);
}

export function mainPaginated(requestBody: IRequestBodyPaginated) {
    return APIManager.post(apiUrls.MAIN_PAGINATED, { data: requestBody }, true);
}

export function testRequest(data: Dictionary) {
    return APIManager.post(apiUrls.TEST_REQUEST, { data: data }, true);
}

export function generateApiKey() {
    return APIManager.get(apiUrls.GENERATE_APIKEY, {  }, true);
}

export function mainGraphic(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.MAIN_GRAPHIC, { data: requestBody }, true);
}

export function mainDynamic(requestBody: IRequestBodyDynamic) {
    return APIManager.post(apiUrls.MAIN_DYNAMIC, { data: requestBody }, true);
}

export function mainDynamicExport(requestBody: IRequestBodyDynamic) {
    return APIManager.post(apiUrls.MAIN_DYNAMIC_EXPORT, { data: requestBody }, true);
}

export function mainEventBooking(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.MAIN_EVENT_BOOKING_URL, { data: requestBody }, false);
}
export function mainEventCancelBooking(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.MAIN_EVENT_CANCELBOOKING_URL, { data: requestBody }, false);
}

export function request_send(request: any) {
    const { method, url, authorization, headers, bodytype, body, parameters } = request;
    let headersjson = headers.reduce((a: any, x: any) => ({ ...a, [x.key]: x.value }), {});
    let parametersjson = parameters.reduce((a: any, x: any) => ({ ...a, [x.key]: x.value }), {});
    if (method === 'POST') {
        if (bodytype === 'URLENCODED') {
            return ExternalRequestManager.postForm(url, { auth: authorization, headers: headersjson, data: parametersjson })
        }
        else {
            return ExternalRequestManager.post(url, { auth: authorization, headers: headersjson, data: body })
        }
    }
    else {
        return ExternalRequestManager.get(url, { auth: authorization, headers: headersjson });
    }
}