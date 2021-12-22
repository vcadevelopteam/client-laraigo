/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch } from 'components';
import { selInvoice, getBillingConfigurationSel, getBillingPeriodCalc, billingpersonreportsel, billinguserreportsel, getBillingSupportSel, getPlanSel, getPaymentPlanSel, billingConfigurationIns, billingPeriodUpd, getBillingConversationSel, billingConversationIns, getBillingPeriodSel, getOrgSelList, getCorpSel, getBillingPeriodHSMSel, billingPeriodHSMUpd, getBillingPeriodSummarySel, getBillingPeriodSummarySelCorp, getLocaleDateString } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, exportData } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Tabs, TextField } from '@material-ui/core';
import { getCountryList } from 'store/signup/actions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import * as locale from "date-fns/locale";
import Paper from '@material-ui/core/Paper';
import { DownloadIcon } from 'icons';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
export const DateOptionsMenuComponent = (value: any, handleClickItemMenu: (key: any) => void) => {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(locale as any)[navigator.language.split('-')[0]]} >
            <KeyboardDatePicker
                format={getLocaleDateString()}
                value={value === '' ? null : value}
                onChange={(e: any) => handleClickItemMenu(e)}
                style={{ minWidth: '150px' }}
                views={["month", "year"]}
            />
        </MuiPickersUtilsProvider>
    )
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        width: "100%",
        color: 'rgb(143, 146, 161)'
    },
    fieldsfilter: {
        width: 220,
    },
    transparent: {
        color: "transparent"
    }
}));

const BillingSetup: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const countryListreq = useSelector(state => state.signup.countryList);
    const multiData = useSelector(state => state.main.multiData);
    const [pageSelected, setPageSelected] = useState(user?.roledesc === "SUPERADMIN" ? 0 : 5);
    const [sentfirstinfo, setsentfirstinfo] = useState(false);

    useEffect(() => {
        // if (!multiData.loading && sentfirstinfo) {
        //     setsentfirstinfo(false)
        //     setdataPlan(multiData.data[0] && multiData.data[0].success ? multiData.data[0].data : [])
        //     setdataPaymentPlan(multiData.data[3] && multiData.data[3].success ? multiData.data[3].data : [])
        // }
    }, [multiData])


    useEffect(() => {
        setsentfirstinfo(true)
        dispatch(getCountryList())
        dispatch(getMultiCollection([
            selInvoice(2021, 12),
        ]));
    }, [])
    return (
        <div style={{ width: '100%' }}>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={t(langKeys.invoice_generation)} />
                <AntTab label={t(langKeys.invoice)} />
            </Tabs>
            {pageSelected === 0 &&
                <div style={{ marginTop: 16 }}>
                    {/* <SupportPlan dataPlan={dataPlan} /> */}
                </div>
            }
        </div>
    );
}

export default BillingSetup;