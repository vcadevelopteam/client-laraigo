import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function witaitest(requestBody: any) {
    return APIManager.post(apiUrls.WITAITEST, { data: requestBody }, true);
}

export function witaitrain() {
    return APIManager.post(apiUrls.WITAITRAIN, { data: {model: ""} }, true);
}

export function witaientityins(request: any) {
    return APIManager.post(apiUrls.WITAIENTITYINS, { data: request }, true);
}

export function witaiintentutteranceins(request: any) {
    return APIManager.post(apiUrls.WITAIUTTERANCEINS, { data: request }, true);
}

export function witaiintentdel(request: any) {
    return APIManager.post(apiUrls.WITAIINTENTDEL, { data: request }, true);
}

export function witaientitydel(request: any) {
    return APIManager.post(apiUrls.WITAIENTITYDEL, { data: request }, true);
}

export function witaientityimport(request: any) {
    return APIManager.post(apiUrls.WITAIENTITYIMPORT, { data: request }, true);
}

export function witaiintentimport(request: any) {
    return APIManager.post(apiUrls.WITAIINTENTIMPORT, { data: request }, true);
}