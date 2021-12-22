/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch, FieldMultiSelect } from 'components';
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

const YEARS = [{ desc: "2010" }, { desc: "2011" }, { desc: "2012" }, { desc: "2013" }, { desc: "2014" }, { desc: "2015" }, { desc: "2016" }, { desc: "2017" }, { desc: "2018" }, { desc: "2020" }, { desc: "2021" }, { desc: "2022" }, { desc: "2023" }, { desc: "2024" }, { desc: "2025" }]
const MONTHS = [{ val: "01" }, { val: "02" }, { val: "03" }, { val: "04" }, { val: "05" }, { val: "06" }, { val: "07" }, { val: "08" }, { val: "09" }, { val: "10" }, { val: "11" }, { val: "12" },]

const InvoiceGeneration: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const [dataInvoice, setDataInvoice] = useState<Dictionary[]>([]);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
    const [filterMonth, setFilterMonth] = useState((new Date().getMonth() + 1).toString())

    useEffect(() => {
        dispatch(getMultiCollection([selInvoice(parseInt(filterYear), filterMonth)]));
    }, [])

    useEffect(() => {
        if (!multiData.loading && !multiData.error) {
            const invoiceData = multiData.data.find(x => x.key === "UFN_INVOICE_SEL");
            if (invoiceData) {
                setDataInvoice(invoiceData.data);
            }
        }
    }, [multiData])

    const columns = React.useMemo(
        () => [
            // {
            //     accessor: 'billingsupportid',
            //     isComponent: true,
            //     minWidth: 60,
            //     width: '1%',
            //     Cell: (props: any) => {
            //         const row = props.cell.row.original;
            //         return (
            //             <TemplateIcons
            //                 deleteFunction={() => handleDelete(row)}
            //                 editFunction={() => handleEdit(row)}
            //                 viewFunction={() => handleView(row)} //esta es la funcion de duplicar
            //                 extraOption={t(langKeys.duplicate)}
            //             />
            //         )
            //     }
            // },
            {
                Header: "RUC",
                accessor: 'issuerruc',
            },
            {
                Header: "Razon social",
                accessor: 'issuerbusinessname',
            },
            {
                Header: "Nombre comercial",
                accessor: 'issuertradename',
            },
            {
                Header: "Serie",
                accessor: 'serie',
            },
            {
                Header: "Correlativo",
                accessor: 'correlative',
            },
            {
                Header: "Fecha de emisión",
                accessor: 'invoicedate',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.fechafin ? new Date(row.invoicedate).toLocaleString() : ''
                }
            },
            {
                Header: "Fecha de expiración",
                accessor: 'expirationdate',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.fechafin ? new Date(row.invoicedate).toLocaleString() : ''
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
            },
            {
                Header: t(langKeys.amount),
                accessor: 'totalamount',
            },
            {
                Header: "Estado factura",
                accessor: 'invoicestatus',
            },
            {
                Header: "Estado pago",
                accessor: 'paymentstatus',
            },
        ],
        []
    );

    const search = () => {
        dispatch(getMultiCollection([selInvoice(parseInt(filterYear), filterMonth)]));
    }

    return (
        <div>
            <TableZyx
                columns={columns}
                ButtonsElement={() => (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <FieldSelect
                            label={t(langKeys.year)}
                            style={{ width: 150 }}
                            valueDefault={filterYear}
                            variant="outlined"
                            onChange={(value) => setFilterYear(value?.desc || "")}
                            data={YEARS}
                            optionDesc="desc"
                            optionValue="desc"
                        />
                        <FieldMultiSelect
                            label={t(langKeys.month)}
                            style={{ width: 300 }}
                            valueDefault={filterMonth}
                            variant="outlined"
                            onChange={(value) => setFilterMonth(value.map((o: Dictionary) => o.val).join())}
                            data={MONTHS}
                            uset={true}
                            prefixTranslation="month_"
                            optionDesc="val"
                            optionValue="val"
                        />
                        <Button
                            disabled={multiData.loading}
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon style={{ color: 'white' }} />}
                            style={{ width: 120, backgroundColor: "#55BD84" }}
                            onClick={search}
                        >{t(langKeys.search)}
                        </Button>
                    </div>
                )}
                // titlemodule={t(langKeys.billingplan, { count: 2 })}
                data={dataInvoice}
                filterGeneral={false}
                loading={multiData.loading}
                download={true}
                register={false}
            />

        </div>
    )
}

const BillingSetup: FC = () => {
    // const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);

    // const multiData = useSelector(state => state.main.multiData);
    const [pageSelected, setPageSelected] = useState(user?.roledesc === "SUPERADMIN" ? 0 : 5);
    const [sentfirstinfo, setsentfirstinfo] = useState(false);

    useEffect(() => {
        setsentfirstinfo(true)


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
                    <InvoiceGeneration />
                    {/* <SupportPlan dataPlan={dataPlan} /> */}
                </div>
            }
        </div>
    );
}

export default BillingSetup;