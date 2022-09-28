import { ITransaction } from '@types';
import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function witaitest(requestBody: any) {
    return APIManager.post(apiUrls.WITAITEST, { data: requestBody }, true);
}