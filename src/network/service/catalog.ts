import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function catalogBusinessList(request: any) {
    return APIManager.post(apiUrls.CATALOG_BUSINESSLIST, { data: request }, true);
}

export function catalogManageCatalog(request: any) {
    return APIManager.post(apiUrls.CATALOG_MANAGECATALOG, { data: request }, true);
}

export function catalogSynchroCatalog(request: any) {
    return APIManager.post(apiUrls.CATALOG_SYNCHROCATALOG, { data: request }, true);
}

export function catalogSynchroProduct(request: any) {
    return APIManager.post(apiUrls.CATALOG_SYNCHROPRODUCT, { data: request }, true);
}

export function catalogImportProduct(request: any) {
    return APIManager.post(apiUrls.CATALOG_IMPORTPRODUCT, { data: request }, true);
}

export function catalogManageProduct(request: any) {
    return APIManager.post(apiUrls.CATALOG_MANAGEPRODUCT, { data: request }, true);
}

export function catalogDeleteProduct(request: any) {
    return APIManager.post(apiUrls.CATALOG_DELETEPRODUCT, { data: request }, true);
}