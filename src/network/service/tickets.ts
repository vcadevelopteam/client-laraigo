import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function getTickets(page: number, pageSize: number) {
    const data = { page, pageSize, sort: 'DESC', query: [] };
    return APIManager.post(apiUrls.TICKET_URL, { data }, false);
}
