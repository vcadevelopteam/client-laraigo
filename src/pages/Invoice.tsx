/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch, FieldMultiSelect } from 'components';
import { selInvoice, insInvoice, cancelInvoice, getLocaleDateString, selInvoiceClient } from 'common/helpers';
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
import { IconButton, MenuItem, Tabs, TextField, Tooltip } from '@material-ui/core';
import * as locale from "date-fns/locale";
import Menu from '@material-ui/core/Menu';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import PaymentIcon from '@material-ui/icons/Payment';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Visibility from '@material-ui/icons/Visibility';
import MoreVert from '@material-ui/icons/MoreVert';
import Fab from '@material-ui/core/Fab';
import DescriptionIcon from '@material-ui/icons/Description';

interface DetailProps {
    data: Dictionary | null;
    setViewSelected: (view: string) => void;
    fetchData?: () => void,
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
    fieldView: {
        // flex: '1 1 250px'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16
    },
    containerField: {
        borderRadius: theme.spacing(2),
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 16,
        border: '1px solid #e1e1e1',
        padding: theme.spacing(2),
    },
    titleCard: {
        fontSize: 16,
        fontWeight: 'bold',
    }
}));

const invocesBread = [
    { id: "view-1", name: "Invoices" },
    { id: "view-2", name: "Invoice detail" }
];

const YEARS = [{ desc: "2010" }, { desc: "2011" }, { desc: "2012" }, { desc: "2013" }, { desc: "2014" }, { desc: "2015" }, { desc: "2016" }, { desc: "2017" }, { desc: "2018" }, { desc: "2020" }, { desc: "2021" }, { desc: "2022" }, { desc: "2023" }, { desc: "2024" }, { desc: "2025" }]
const MONTHS = [{ val: "01" }, { val: "02" }, { val: "03" }, { val: "04" }, { val: "05" }, { val: "06" }, { val: "07" }, { val: "08" }, { val: "09" }, { val: "10" }, { val: "11" }, { val: "12" },]

const statusToEdit = ["DRAFT", "INVOICED", "ERROR", "CANCELED"];



const InvoiceDetail: FC<DetailProps> = ({ data, setViewSelected, fetchData }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            filenumber: data?.filenumber || '',
            purchaseorder: data?.purchaseorder || '',
            executingunitcode: data?.executingunitcode || '',
            selectionprocessnumber: data?.selectionprocessnumber || '',
            contractnumber: data?.contractnumber || '',
            comments: data?.comments || '',
        }
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])


    const onSubmit = handleSubmit((row) => {
        const callback = () => {
            dispatch(execute(insInvoice({ ...data!!, ...row })));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{ width: '100%' }}>
            <div>
                <TemplateBreadcrumbs
                    breadcrumbs={invocesBread}
                    handleClick={setViewSelected}
                />
                <TitleDetail
                    title={data?.description}
                />
                <div style={{ backgroundColor: 'white', padding: 16 }}>
                    <div className={classes.container}>

                        <div className={classes.containerField}>
                            <div className={classes.titleCard}>{t(langKeys.clientinformation)}</div>
                            <FieldView
                                label={t(langKeys.docType)}
                                value={data?.receiverdoctype}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.documentnumber)}
                                value={data?.receiverdocnum}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.bussinessname)}
                                value={data?.receiverbusinessname}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.address)}
                                value={data?.receiverfiscaladdress}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.country)}
                                value={data?.receivercountry}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.email)}
                                value={data?.receivermail}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            <div className={classes.titleCard}>{t(langKeys.invoiceinformation)}</div>
                            <FieldView
                                label={t(langKeys.documentnumber)}
                                value={data?.serie + " - " + (data?.correlative || "")}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.invoicedate)}
                                value={data?.invoicedate}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.dueDate)}
                                value={data?.expirationdate}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.totalamount)}
                                value={data?.totalamount}
                                className={classes.fieldView}
                            />

                            <FieldView
                                label={t(langKeys.currency)}
                                value={data?.currency}
                                className={classes.fieldView}
                            />
                            <div>
                                <a href={data?.urlpdf} target="_blank" rel="noreferrer">{t(langKeys.urlpdf)}</a>
                            </div>
                            <div>
                                <a href={data?.urlcdr} target="_blank" rel="noreferrer">{t(langKeys.urlcdr)}</a>
                            </div>
                            <div>
                                <a href={data?.urlxml} target="_blank" rel="noreferrer">{t(langKeys.urlxml)}</a>
                            </div>
                            {/* <FieldView
                                label={t(langKeys.urlcdr)}
                                value={data?.urlcdr}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.urlpdf)}
                                value={data?.urlpdf}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.urlxml)}
                                value={data?.urlxml}
                                className={classes.fieldView}
                            /> */}
                        </div>
                        <div className={classes.containerField} style={{ position: 'relative' }}>
                            <div className={classes.titleCard}>{t(langKeys.additional_information)}</div>
                            {statusToEdit.includes(data?.invoicestatus) ? (
                                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <Fab
                                        onClick={onSubmit}
                                        type="submit"
                                        size="small"
                                        style={{ position: 'absolute', top: 8, right: 8, zIndex: 99999, backgroundColor: '#fff' }}
                                    >
                                        <SaveIcon color="primary" />
                                    </Fab>
                                    <FieldEdit
                                        label={t(langKeys.filenumber)}
                                        className="col-6"
                                        type="number"
                                        valueDefault={getValues('filenumber')}
                                        onChange={(value) => setValue('filenumber', parseInt(value || "0"))}
                                        error={errors?.filenumber?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.purchaseorder)}
                                        className="col-6"
                                        valueDefault={getValues('purchaseorder')}
                                        onChange={(value) => setValue('purchaseorder', value)}
                                        error={errors?.purchaseorder?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.executingunitcode)}
                                        className="col-6"
                                        valueDefault={getValues('executingunitcode')}
                                        onChange={(value) => setValue('executingunitcode', value)}
                                        error={errors?.executingunitcode?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.selectionprocessnumber)}
                                        className="col-6"
                                        valueDefault={getValues('selectionprocessnumber')}
                                        onChange={(value) => setValue('selectionprocessnumber', value)}
                                        error={errors?.selectionprocessnumber?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.contractnumber)}
                                        className="col-6"
                                        valueDefault={getValues('contractnumber')}
                                        onChange={(value) => setValue('contractnumber', value)}
                                        error={errors?.contractnumber?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.comments)}
                                        className="col-6"
                                        valueDefault={getValues('comments')}
                                        onChange={(value) => setValue('comments', value)}
                                        error={errors?.comments?.message}
                                    />
                                </form>
                            ) : (
                                <>

                                    <FieldView
                                        label={t(langKeys.filenumber)}
                                        value={data?.filenumber}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.purchaseorder)}
                                        value={data?.purchaseorder}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.executingunitcode)}
                                        value={data?.executingunitcode}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.selectionprocessnumber)}
                                        value={data?.selectionprocessnumber}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.contractnumber)}
                                        value={data?.contractnumber}
                                        className={classes.fieldView}
                                    />
                                    <FieldView
                                        label={t(langKeys.comments)}
                                        value={data?.comments}
                                        className={classes.fieldView}
                                    />
                                </>
                            )}
                        </div>
                        <div className={classes.containerField}>
                            <div className={classes.titleCard}>{t(langKeys.paymentinformation)}</div>
                            
                            {/* <FieldView
                                label={t(langKeys.orderjson)}
                                value={data?.orderjson}
                                className={classes.fieldView}
                            /> */}
                            <FieldView
                                label={t(langKeys.paymentstatus)}
                                value={data?.paymentstatus}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.paymentdate)}
                                value={data?.paymentdate}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.paidby)}
                                value={data?.paidby}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.email)}
                                value={data?.email}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.id_payment)}
                                value={data?.orderid}
                                className={classes.fieldView}
                            />
                            {/* <FieldView
                                label={t(langKeys.capture)}
                                value={data?.capture}
                                className={classes.fieldView}
                            /> */}
                            <FieldView
                                label={t(langKeys.paymentnote)}
                                value={data?.paymentnote}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.paymentfile)}
                                value={data?.paymentfile}
                                className={classes.fieldView}
                            />
                        </div>
                        {/* <div className={classes.containerField}>
                            <div className={classes.titleCard}>{t(langKeys.optionalfields)}</div>
                            <FieldView
                                label={t(langKeys.invoicetype)}
                                value={data?.invoicetype}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.sunatopecode)}
                                value={data?.sunatopecode}
                                className={classes.fieldView}
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        </div >
    )
}

const InvoiceGeneration: FC = () => {
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [dataInvoice, setDataInvoice] = useState<Dictionary[]>([]);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
    const [filterMonth, setFilterMonth] = useState((new Date().getMonth() + 1).toString())
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);

    const fetchData = () => dispatch(getMultiCollection([selInvoice(parseInt(filterYear), filterMonth)]));
    useEffect(() => {
        fetchData()
    }, [])


    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: "Factura anulada correctamente" }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

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
            {
                accessor: 'billingsupportid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
                    const handleClose = () => setAnchorEl(null);
                    return (
                        <>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                size="small"
                                onClick={() => handleView(row)}
                            >
                                <Visibility style={{ color: '#B6B4BA' }} />
                            </IconButton>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                size="small"
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                                <MoreVert style={{ color: '#B6B4BA' }} />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={(e) => {
                                    setAnchorEl(null)
                                    handleGenerate(row)
                                }}>Generar factura</MenuItem>
                                <MenuItem onClick={(e) => {
                                    setAnchorEl(null)
                                    handleSend(row)
                                }}>Envíar factura</MenuItem>
                                <MenuItem onClick={(e) => {
                                    setAnchorEl(null)
                                    handleCancel(row)
                                }}>Anular factura</MenuItem>
                            </Menu>
                        </>
                    )
                }
            },
            {
                Header: "RUC",
                accessor: 'issuerruc',
            },
            {
                Header: t(langKeys.bussinessname),
                accessor: 'issuerbusinessname',
            },
            {
                Header: t(langKeys.tradename),
                accessor: 'issuertradename',
            },
            {
                Header: "Serie",
                accessor: 'serie',
            },
            {
                Header: t(langKeys.correlative),
                accessor: 'correlative',
            },
            {
                Header: t(langKeys.dateofissue),
                accessor: 'invoicedate',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.invoicedate ? new Date(row.invoicedate).toLocaleString() : ''
                }
            },
            {
                Header: t(langKeys.expirationdate),
                accessor: 'expirationdate',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.expirationdate ? new Date(row.invoicedate).toLocaleString() : ''
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
            },
            {
                Header: t(langKeys.amount),
                accessor: 'totalamount',
                type: 'number',
            },
            {
                Header: t(langKeys.invoicestatus),
                accessor: 'invoicestatus',
            },
            {
                Header: t(langKeys.paymentstatus),
                accessor: 'paymentstatus',
            },
        ],
        []
    );

    const handleCancel = (row: Dictionary) => {
        // cancelInvoice
        const callback = () => {
            dispatch(execute(cancelInvoice(row.invoiceid)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: "¿Está seguro de anular la factura?",
            callback
        }))
    }
    const handleGenerate = (row: Dictionary) => {

    }
    const handleSend = (row: Dictionary) => {

    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected(row);
    }

    const search = () => dispatch(getMultiCollection([selInvoice(parseInt(filterYear), filterMonth)]))

    if (viewSelected === "view-1") {
        return (
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
        )
    } else {
        return (
            <InvoiceDetail
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        );
    }
}
const InvoiceControl: FC = () => {
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [dataInvoice, setDataInvoice] = useState<Dictionary[]>([]);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
    const [filterMonth, setFilterMonth] = useState((new Date().getMonth() + 1).toString())
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);

    const fetchData = () => dispatch(getMultiCollection([selInvoiceClient(parseInt(filterYear), filterMonth)]));
    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: "Factura anulada correctamente" }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (!multiData.loading && !multiData.error) {
            const invoiceData = multiData.data.find(x => x.key === "UFN_INVOICE_SELCLIENT");
            if (invoiceData) {
                setDataInvoice(invoiceData.data);
            }
        }
    }, [multiData])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'paymentstatus',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <Button
                            disabled={row.paymentstatus!=="PENDING"}
                            variant="contained"
                            color="primary"
                            startIcon={<PaymentIcon style={{ color: 'white' }} />}
                            style={{ width: 120, backgroundColor: "#55BD84" }}
                            onClick={search}
                        >{t(langKeys.paynow)}
                        </Button>
                    )
                }
            },
            {
                Header: t(langKeys.documentnumber),
                accessor: 'docnumber',
            },
            {
                Header: t(langKeys.concept),
                accessor: 'concept',
            },
            {
                Header: t(langKeys.dateofissue),
                accessor: 'invoicedate',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.invoicedate ? new Date(row.invoicedate).toLocaleString() : ''
                }
            },
            {
                Header: t(langKeys.amounttopay),
                accessor: 'totalamount',
                type: "number",
                sortType: 'number',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.totalamount ? (row.totalamount).toFixed(2) : '0.00'
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
            },
            {
                Header: t(langKeys.invoicestatus),
                accessor: 'invoicestatus',
            },
            {
                accessor: 'urlcdr',
                NoFilter: true,
                Cell: (props: any) => {
                    const urlcdr = props.cell.row.original.urlcdr;
                    const urlpdf = props.cell.row.original.urlpdf;
                    const urlxml = props.cell.row.original.urlxml;
                    return (
                        <Fragment>
                            <div>
                                <a href={urlcdr} style={{ display: "block" }}>{`${t(langKeys.download)} CDR`}</a>
                                <a href={urlpdf} style={{ display: "block" }}>{`${t(langKeys.download)} PDF`}</a>
                                <a href={urlxml} style={{ display: "block" }}>{`${t(langKeys.download)} XML`}</a>
                            </div>
                        </Fragment>
                    )
                }
            },
        ],
        []
    );

    const handleCancel = (row: Dictionary) => {
        // cancelInvoice
        const callback = () => {
            dispatch(execute(cancelInvoice(row.invoiceid)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: "¿Está seguro de anular la factura?",
            callback
        }))
    }
    const handleGenerate = (row: Dictionary) => {

    }
    const handleSend = (row: Dictionary) => {

    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected(row);
    }

    const search = () => dispatch(getMultiCollection([
        selInvoice(parseInt(filterYear), filterMonth),
        selInvoiceClient(parseInt(filterYear), filterMonth),
    ]))

    if (viewSelected === "view-1") {
        return (
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
        )
    } else {
        return (
            <InvoiceDetail
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        );
    }
}

const Invoice: FC = () => {
    // const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);

    const [pageSelected, setPageSelected] = useState(user?.roledesc === "SUPERADMIN" ? 0 : 5);

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
                </div>
            }
            {pageSelected === 1 &&
                <div style={{ marginTop: 16 }}>
                    <InvoiceControl />
                </div>
            }
        </div>
    );
}

export default Invoice;