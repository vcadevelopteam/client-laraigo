import { apiUrls } from "common/constants";
import { APIManager } from "network/manager";

export function createCollection(data: any) {
    return APIManager.post(apiUrls.LLAMA_CREATE_COLLECTION, { data }, true);
}

export function createCollectionDocument(data: any) {
    return APIManager.post(apiUrls.LLAMA_CREATE_COLLECTION_DOCUMENT, { data }, true);
}

export function createCollectionDocuments(data: any) {
    return APIManager.post(apiUrls.LLAMA_CREATE_COLLECTION_DOCUMENTS, { data }, true);
}

export function deleteCollection(data: any) {
    return APIManager.post(apiUrls.LLAMA_DELETE_COLLECTION, { data }, true);
}

export function massiveDeleteCollection(data: any) {
    return APIManager.post(apiUrls.LLAMA_MASSIVE_DELETE_COLLECTION, { data }, true);
}

export function editCollection(data: any) {
    return APIManager.post(apiUrls.LLAMA_EDIT_COLLECTION, { data }, true);
}

export function addFile(data: any) {
    return APIManager.post(apiUrls.LLAMA_ADD_FILE, { data }, true);
}

export function addFiles(data: any) {
    return APIManager.post(apiUrls.LLAMA_ADD_FILES, { data }, true);
}

export function deleteFile(data: any) {
    return APIManager.post(apiUrls.LLAMA_DELETE_FILE, { data }, true);
}

export function query(data: any) {
    return APIManager.post(apiUrls.LLAMA_QUERY, { data }, true);
}

export function deleteThread(data: any) {
    return APIManager.post(apiUrls.LLAMA_DELETE_THREAD, { data }, true);
}