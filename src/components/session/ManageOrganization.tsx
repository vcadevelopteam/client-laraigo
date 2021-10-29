import React, { FC } from "react";
import { changeOrganization } from 'store/login/actions';

import { FieldSelect } from 'components';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';

const ManageOrganization: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const user = useSelector(state => state.login.validateToken.user);

    const resChangeOrganization = useSelector(state => state.login.triggerChangeOrganization);
    const [triggerSave, setTriggerSave] = React.useState(false)

    const handleChangeOrganization = (value: any) => {
        if (value) {
            dispatch(changeOrganization(value.corpid, value.orgid, value.corpdesc, value.orgdesc));
            dispatch(showBackdrop(true));
            setTriggerSave(true)
        }
    }

    React.useEffect(() => {
        if (triggerSave) {
            if (!resChangeOrganization.loading && !resChangeOrganization.error) {
                dispatch(showBackdrop(false));
                window.location.reload()
                // dispatch(wsConnect({ userid: user?.userid, orgid: user?.orgid, usertype: 'PLATFORM' }));
                // // history.replace(`/`);
                // setTimeout(() => {
                //     history.push(redirect);
                // });
            } else if (resChangeOrganization.error) {
                const errormessage = t(resChangeOrganization.code || "error_unexpected_error")
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setTriggerSave(false);
                dispatch(showBackdrop(false));
            }
        }
        // return () => {
        //     dispatch(resetChangeOrganization());
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resChangeOrganization, triggerSave])

    return (
        <FieldSelect
            label="Organization"
            valueDefault={user?.orgid}
            className="w-full"
            onChange={handleChangeOrganization}
            variant="outlined"
            disabled={resChangeOrganization.loading}
            data={user?.organizations!!}
            optionDesc="orgdesc"
            optionValue="orgid"
        />
    );
};

export default ManageOrganization;
