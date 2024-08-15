/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DateRangePicker } from 'components';
import { convertLocalDate, getAudit, getDateCleaned } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanMemoryTable, setMemoryTable, exportData, getMultiCollection, getMultiCollectionAux2, resetMultiMain, setViewChange, cleanViewChange } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { CalendarIcon } from 'icons';
import { Range } from 'react-date-range';
import ClearIcon from '@material-ui/icons/Clear';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import { CellProps } from 'react-table';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailReportAuditProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
}

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}
const useStyles = makeStyles((theme) => ({
    containerHeader: {
        padding: theme.spacing(1),
    },
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
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
}));

const cleanfunction = (name: string) => {
    const dd: Dictionary = {
        'UFN_REPORT_PRODUCTIVITY_SEL': "conversation_plural",
        'UFN_REPORT_INTERACTION_SEL': "interaction",
        'UFN_REPORT_TIPIFICATION_SEL': "report_tipification",
        'UFN_REPORT_USERPRODUCTIVITYHOURS_SEL': "report_userproductivityhours",
        'UFN_REPORT_USERPRODUCTIVITY_SEL': "report_userproductivity",
        'UFN_REPORT_INPUTRETRY_SEL': "report_inputretry",
        'UFN_LOGINHISTORY_SEL': "report_loginhistory",
        'UFN_REPORT_ASESOR_VS_TICKET_SEL': "report_ticketvsasesor",
        'UFN_CAMPAIGNREPORT_SEL': "report_campaign",
        'UFN_REPORT_VOICECALL_SEL': "report_voicecall",
        'UFN_REPORT_COMPLIANCESLA_SEL': "report_reportcompliancesla",
        'UFN_LEADGRID_TRACKING_SEL': "report_leadgridtracking",
        'UFN_REPORT_REQUESTSD_SEL': "report_reportrequestsd",
        'UFN_REPORT_SENTMESSAGES_LST': "report_sentmessages",
        'UFN_REPORT_INVOICE_SUMMARY_SEL': "report_invoice",
        'UFN_REPORT_KPI_OPERATIVO_SEL': "report_kpioperativo",
        'UFN_REPORT_UNIQUECONTACTS_SEL': "report_uniquecontactsreport",
        'UFN_REPORT_SENTMESSAGES_BY_TEMPLATE': "report_hsmshipping",
        'UFN_CONVERSATIONGRID_SEL': "ticket_plural",
        'UFN_PERSON_SEL': "person_plural",
        'UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_SEL': "managerial",
        'UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_SEL': "productivity",
        'UFN_DASHBOARD_PUSH_HSMCATEGORYRANK_SEL': "operationalpush",
        'UFN_DASHBOARD_GERENCIAL_TAG_SEL': "tagranking",
        'UFN_DASHBOARD_DICONNECTIONTIMES_SEL': "disconnections",
        'UFN_DASHBOARD_KPI_SUMMARY_SEL': "dashboardkpi",
        'UFN_DASHBOARD_KPI_SUMMARY_BY_MONTH': "dashboardkpimonthly",
    }
    return dd[name]
}

const ReportAudit: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiData);

    const classes = useStyles()
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [gridData, setGridData] = useState<any[]>([]);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector(state => state.main.exportData);

    useEffect(() => {
        dispatch(setViewChange("hsmhistory"))
        return () => {
            dispatch(cleanViewChange());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.corporation),
                accessor: 'corp',
                width: 'auto',
            },
            {
                Header: t(langKeys.organization),
                accessor: 'org',
                width: 'auto',
            },
            {
                Header: t(langKeys.username),
                accessor: 'username',
                width: 'auto',
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                width: 'auto',
                type: "select",
                listSelectFilter: [
                    { key: t(langKeys[langKeys.report]), value: t(langKeys[langKeys.report]) },
                    { key: t(langKeys[langKeys.dashboard]), value: t(langKeys[langKeys.dashboard]) },
                ],
            },
            {
                Header: t(langKeys.column_name_report_dashboard),
                accessor: 'reportname',
                width: 'auto'
            },
            {
                Header: t(langKeys.rundate),
                accessor: 'createdate',
                width: 'auto'
            },
            {
                Header: t(langKeys.parameters),
                accessor: 'parameters',
                width: 'auto'
            },

        ],
        [t]
    );

    const triggerExportData = () => {
    };

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    function search() {
        dispatch(showBackdrop(true))
        dispatch(getMultiCollection([
            getAudit(
                {
                    startdate: dateRangeCreateDate.startDate,
                    enddate: dateRangeCreateDate.endDate,
                }
            )
        ]))
    }
    useEffect(() => {
        return () => {
            dispatch(resetMultiMain());
        }
    }, [])

    useEffect(() => {
        if (!multiData.loading && !multiData.error) {
            setGridData(multiData.data[0]?.data.map(x => ({
                ...x,
                reportname: t(langKeys[cleanfunction(x.reportname)]) || x.reportname,
                type: t(langKeys[x.type]),
                createdate: convertLocalDate(x.createdate).toLocaleString(),
                parameters: (() => {
                    const row = x;
                    if (row.parameters instanceof Array) {
                        return JSON.stringify(row.parameters)
                    }
                    delete row.parameters.corpid
                    delete row.parameters.orgid
                    delete row.parameters.userid
                    delete row.parameters.username
                    delete row.parameters.skip
                    delete row.parameters.take
                    delete row.parameters.take
                    delete row.parameters._requestid
                    delete row.parameters.sorts
                    delete row.parameters.where
                    delete row.parameters.partnerid
                    if (!row.parameters.order)
                        delete row.parameters.order
                    if (!row.parameters.filters || Object.keys(row.parameters.filters).length === 0)
                        delete row.parameters.filters
                    if (!row.parameters.distinct)
                        delete row.parameters.distinct
                    return JSON.stringify(row.parameters)
                })()
            })) || []);
            dispatch(showBackdrop(false));
        }
    }, [multiData])

    return (
        <React.Fragment>
            <div style={{ height: 10 }}></div>
            <TableZyx
                columns={columns}
                data={gridData}
                ButtonsElement={() => (
                    <div className={classes.containerHeader} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <DateRangePicker
                                open={openDateRangeCreateDateModal}
                                setOpen={setOpenDateRangeCreateDateModal}
                                range={dateRangeCreateDate}
                                onSelect={setDateRangeCreateDate}
                            >
                                <Button
                                    className={classes.itemDate}
                                    startIcon={<CalendarIcon />}
                                    onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                                >
                                    {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                                </Button>
                            </DateRangePicker>
                            <div>
                                <Button
                                    disabled={multiData.loading}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SearchIcon style={{ color: 'white' }} />}
                                    style={{ width: 120, backgroundColor: "#55BD84" }}
                                    onClick={() => search()}
                                >{t(langKeys.search)}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                download={true}
                filterGeneral={false}
                loading={multiData.loading}
                register={false}
                exportPersonalized={triggerExportData}
            />
        </React.Fragment>
    )

}

export default ReportAudit;