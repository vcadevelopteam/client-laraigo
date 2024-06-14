import { apiUrls } from "common/constants";
import { APIManager } from "network/manager";

export function createCollection3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_CREATE_COLLECTION, { data }, true);
}

export function createCollectionDocument3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_CREATE_COLLECTION_DOCUMENT, { data }, true);
}

export function createCollectionDocuments3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_CREATE_COLLECTION_DOCUMENTS, { data }, true);
}

export function deleteCollection3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_DELETE_COLLECTION, { data }, true);
}

export function massiveDeleteCollection3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_MASSIVE_DELETE_COLLECTION, { data }, true);
}

export function editCollection3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_EDIT_COLLECTION, { data }, true);
}

export function addFile3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_ADD_FILE, { data }, true);
}

export function addFiles3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_ADD_FILES, { data }, true);
}

export function deleteFile3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_DELETE_FILE, { data }, true);
}

export function query3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_QUERY, { data }, true);
}

export function deleteThread3(data: any) {
    return APIManager.post(apiUrls.LLAMA3_DELETE_THREAD, { data }, true);
}