/* eslint-disable react-hooks/exhaustive-deps */
import CircularProgress from '@material-ui/core/CircularProgress';
import CulqiModal from 'components/fields/CulqiModal';

import { FC, useEffect } from 'react';
import { langKeys } from 'lang/keys';
import { makeStyles } from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { useLocation } from "react-router";
import { useParams } from 'react-router';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    back: {
        backgroundColor: '#fbfcfd',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerSuccess: {
        minHeight: 600,
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        width: '80vw',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            width: '100vw',
        },
        flexDirection: 'column',
    },
}));

export const PaymentOrder: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main.mainData);

    const { corpid, orgid, ordercode }: any = useParams();

    const location = useLocation();

    useEffect(() => {

    }, [])

    if (mainResult.loading) {
        return (
            <div className={classes.back}>
                <CircularProgress />
            </div>
        )
    }
    else {
        return (
            <div className={classes.back}>
                <div className={classes.containerSuccess}>
                    <div style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.confirmed)}</div>
                    <div style={{ marginTop: 16, textAlign: 'center' }} >{t(langKeys.successfully_scheduled)}</div>
                    <div style={{ width: '70%', height: 1, backgroundColor: '#e1e1e1', marginTop: 24, marginBottom: 24 }}></div>
                    <div style={{ width: '70%', height: 1, backgroundColor: '#e1e1e1', marginTop: 24, marginBottom: 24 }}></div>
                    <CulqiModal
                        type="CHARGE"
                        invoiceid={0}
                        title={'TITLE'}
                        description={'DESCRIPTION'}
                        currency={'USD'}
                        amount={Math.round(((100 * 100) + Number.EPSILON) * 100) / 100}
                        callbackOnSuccess={() => { }}
                        buttontitle={t(langKeys.proceedpayment)}
                        purchaseorder={''}
                        comments={''}
                        corpid={0}
                        orgid={0}
                        disabled={false}
                        successmessage={t(langKeys.culqipaysuccess)}
                        publickey={''}
                        override={false}
                        totalpay={0}
                    >
                    </CulqiModal>
                </div>
            </div>
        )
    }
}

export default PaymentOrder;