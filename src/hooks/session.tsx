import { useEffect } from 'react';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { resetForcedDisconnection } from 'store/inbox/actions';
import { showSnackbar } from 'store/popus/actions';
import { useSelector } from './store';
import { disconnectVoxi } from "store/voximplant/actions";
import { logout } from 'network/service/common';
import { cleanValidateToken } from 'store/login/actions';

export function useForcedDisconnection(callback?: () => void) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const fd = useSelector(state => state.inbox.forceddisconnect);
    const user = useSelector((state) => state.login.validateToken.user);
    // const voxiConnection = useSelector(state => state.voximplant.connection);    

    useEffect(() => {
        console.log('useForcedDisconnection:', fd);
        if (fd.value) {
            const key = fd.code! in langKeys ? fd.code! : langKeys.DEFAULT_FORCED_DISCONNECTION;
            dispatch(showSnackbar({
                message: t(key),
                show: true,
                severity: "error"
            }));
            dispatch(resetForcedDisconnection());
            if (user?.samlAuth) {
                logout({session_expired: true}).then(({data}) => {
                    dispatch(cleanValidateToken())
                    if (data?.data?.redirectUrl) {
                        window.location.href = data.data.redirectUrl;
                    }
                });
            }
            callback?.();
            // if (!voxiConnection.error) {
            dispatch(disconnectVoxi())
            // }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fd, callback, t, dispatch, user]);
}
