/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch, FieldMultiSelect } from 'components';
import { selInvoice, cancelInvoice, getLocaleDateString } from 'common/helpers';
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
import { IconButton, MenuItem, Tabs, TextField } from '@material-ui/core';
import * as locale from "date-fns/locale";
import Menu from '@material-ui/core/Menu';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Visibility from '@material-ui/icons/Visibility';
import MoreVert from '@material-ui/icons/MoreVert';

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
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 16,
        border: '1px solid #e1e1e1',
        padding: theme.spacing(2),
    }
}));

const invocesBread = [
    { id: "view-1", name: "Invoices" },
    { id: "view-2", name: "Invoice detail" }
];

const YEARS = [{ desc: "2010" }, { desc: "2011" }, { desc: "2012" }, { desc: "2013" }, { desc: "2014" }, { desc: "2015" }, { desc: "2016" }, { desc: "2017" }, { desc: "2018" }, { desc: "2020" }, { desc: "2021" }, { desc: "2022" }, { desc: "2023" }, { desc: "2024" }, { desc: "2025" }]
const MONTHS = [{ val: "01" }, { val: "02" }, { val: "03" }, { val: "04" }, { val: "05" }, { val: "06" }, { val: "07" }, { val: "08" }, { val: "09" }, { val: "10" }, { val: "11" }, { val: "12" },]

// (DRAFT, INVOICED, ERROR, CANCELED)


const InvoiceDetail: FC<DetailProps> = ({ data, setViewSelected, fetchData }) => {
    const classes = useStyles();
    const { t } = useTranslation();
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
                            <div>Información general</div>
                            <FieldView
                                label={t(langKeys.corporation)}
                                value={data?.corpdesc}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.year)}
                                value={data?.year}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.month)}
                                value={data?.month}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={t(langKeys.description)}
                                value={data?.description}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            <div>Información de la empresa</div>
                            <FieldView
                                label={"issuerruc"}
                                value={data?.issuerruc}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"issuerbusinessname"}
                                value={data?.issuerbusinessname}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"issuertradename"}
                                value={data?.issuertradename}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"issuerfiscaladdress"}
                                value={data?.issuerfiscaladdress}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"issuerubigeo"}
                                value={data?.issuerubigeo}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            <div>Información de la facturación</div>
                            <FieldView
                                label={"emittertype"}
                                value={data?.emittertype}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"annexcode"}
                                value={data?.annexcode}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"printingformat"}
                                value={data?.printingformat}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"sendtosunat"}
                                value={data?.sendtosunat}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"xmlversion"}
                                value={data?.xmlversion}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"ublversion"}
                                value={data?.ublversion}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            <div>Información del cliente</div>
                            <FieldView
                                label={"receiverdoctype"}
                                value={data?.receiverdoctype}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"receiverdocnum"}
                                value={data?.receiverdocnum}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"receiverbusinessname"}
                                value={data?.receiverbusinessname}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"receiverfiscaladdress"}
                                value={data?.receiverfiscaladdress}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"receivercountry"}
                                value={data?.receivercountry}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"receivermail"}
                                value={data?.receivermail}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            Informacion de la factura
                            <FieldView
                                label={"serie"}
                                value={data?.serie}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"correlative"}
                                value={data?.correlative}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"concept"}
                                value={data?.concept}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"invoicedate"}
                                value={data?.invoicedate}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"expirationdate"}
                                value={data?.expirationdate}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"subtotal"}
                                value={data?.subtotal}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"taxes"}
                                value={data?.taxes}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"totalamount"}
                                value={data?.totalamount}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"currency"}
                                value={data?.currency}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"exchangerate"}
                                value={data?.exchangerate}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            <div>Informacion resp sunat</div>
                            <FieldView
                                label={"invoicestatus"}
                                value={data?.invoicestatus}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"errordescription"}
                                value={data?.errordescription}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"qrcode"}
                                value={data?.qrcode}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"hashcode"}
                                value={data?.hashcode}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"urlcdr"}
                                value={data?.urlcdr}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"urlpdf"}
                                value={data?.urlpdf}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"urlxml"}
                                value={data?.urlxml}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            <div>Campos opcionales</div>

                            <FieldView
                                label={"filenumber"}
                                value={data?.filenumber}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"purchaseorder"}
                                value={data?.purchaseorder}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"executingunitcode"}
                                value={data?.executingunitcode}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"selectionprocessnumber"}
                                value={data?.selectionprocessnumber}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"contractnumber"}
                                value={data?.contractnumber}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"comments"}
                                value={data?.comments}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            <div>Información del pago</div>
                            <FieldView
                                label={"orderid"}
                                value={data?.orderid}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"orderjson"}
                                value={data?.orderjson}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"paymentstatus"}
                                value={data?.paymentstatus}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"paymentdate"}
                                value={data?.paymentdate}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"paidby"}
                                value={data?.paidby}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"email"}
                                value={data?.email}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"capture"}
                                value={data?.capture}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"paymentnote"}
                                value={data?.paymentnote}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"paymentfile"}
                                value={data?.paymentfile}
                                className={classes.fieldView}
                            />
                        </div>
                        <div className={classes.containerField}>
                            <div>Campos opcionales</div>
                            <FieldView
                                label={"invoicetype"}
                                value={data?.invoicetype}
                                className={classes.fieldView}
                            />
                            <FieldView
                                label={"sunatopecode"}
                                value={data?.sunatopecode}
                                className={classes.fieldView}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const InvoiceGeneration: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [dataInvoice, setDataInvoice] = useState<Dictionary[]>([]);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
    const [filterMonth, setFilterMonth] = useState((new Date().getMonth() + 1).toString())
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);

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
                    return row.invoicedate ? new Date(row.invoicedate).toLocaleString() : ''
                }
            },
            {
                Header: "Fecha de expiración",
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

    const handleCancel = (row: Dictionary) => {

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

const BillingSetup: FC = () => {
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
        </div>
    );
}

export default BillingSetup;