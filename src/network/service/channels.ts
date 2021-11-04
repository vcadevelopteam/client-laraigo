import { IRequestBody } from '@types';
import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function getPagelist(accessToken: String) {
    const data = { accessToken: accessToken };
    return APIManager.post(apiUrls.GET_PAGELIST, { data }, true);
}
export function getPagelistSub(accessToken: String) {
    const data = { accessToken: accessToken };
    return APIManager.post(apiUrls.GET_PAGELISTSUB, { data }, true);
}
export function insertchnl(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.INSERT_CHANNEL, { data: requestBody }, true);
}
export function activateChannel(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.ACTIVATE_CHANNEL, { data: requestBody }, true);
}
export function execSub(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.EXEC_SUB, { data: requestBody }, true);
}
export function validateNewUser(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.VALIDATE_NEW_USER, { data: requestBody }, true);
}
export function getCurrencyList( ) {
    return APIManager.get(apiUrls.CURRENCYLIST, { data: {} }, true);
}
export function getCountryList( ) {
    return APIManager.get(apiUrls.COUNTRYLIST, { data: {} }, true);
}
export function deletechnl(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.DELETE_CHANNEL, { data: requestBody }, true);
}
export function checkPaymentPlan(requestBody: IRequestBody ) {
    return APIManager.post(apiUrls.CHECK_PAYMENTPLAN, { data: requestBody }, true);
}
export function editchnl(requestBody: IRequestBody ) {
    const uri = `${apiUrls.CHANNELS}/updatechannel`;
    return APIManager.post(uri, { data: requestBody }, true);
}
export function vrfplan(accessToken: String ) {
    const data = { parameters:{code: accessToken }};
    return APIManager.post(apiUrls.VERIFY_CHANNEL, { data }, true);
}
