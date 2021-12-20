import { useEffect } from 'react';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { resetForcedDisconnection } from 'store/inbox/actions';
import { showSnackbar } from 'store/popus/actions';
import { useSelector } from './store';

export function useForcedDisconnection(callback?: () => void) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const fd = useSelector(state => state.inbox.forceddisconnect);

    useEffect(() => {
        if (fd.value) {
            const key = fd.code! in langKeys ? fd.code! : langKeys.DEFAULT_FORCED_DISCONNECTION;
            dispatch(showSnackbar({
                message: t(key),
                show: true,
                success: false,
            }));
            dispatch(resetForcedDisconnection());
            callback?.();
        }
    }, [fd, callback, t, dispatch]);
}
