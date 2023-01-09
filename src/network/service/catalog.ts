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