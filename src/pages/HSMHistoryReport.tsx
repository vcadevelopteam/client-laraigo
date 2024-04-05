/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DateRangePicker} from 'components';
import { getDateCleaned, getHSMHistoryList, getHSMHistoryReport, getHSMHistoryReportExport } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
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
interface DetailHSMHistoryReportProps {
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

const DetailHSMHistoryReport: React.FC<DetailHSMHistoryReportProps> = ({ data: { row }, setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getMultiCollectionAux2([
            getHSMHistoryReport({
                campaign: row?.campaign || "",
                date: row?.date || "",
            })
        ]))
    }
    useEffect(() => {
        if (!multiDataAux2.loading){
            dispatch(showBackdrop(false))
        }
    }, [multiDataAux2])

    useEffect(() => {
        search()
    }, [])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.firstname),
                accessor: 'firstname',
            },
            {
                Header: t(langKeys.lastname),
                accessor: 'lastname',
            },
            {
                Header: t(langKeys.ticket_number),
                accessor: 'ticketnum',
            },
            {
                Header: t(langKeys.rundate),
                accessor: 'rundate',
            },
            {
                Header: t(langKeys.runtime),
                accessor: 'runtime',
            },
            {
                Header: t(langKeys.finishconversationdate),
                accessor: 'finishdate',
            },
            {
                Header: t(langKeys.firstreplydate),
                accessor: 'firstreplydate',
            },
            {
                Header: t(langKeys.firstreplytime),
                accessor: 'firstreplytime',
            },
            {
                Header: `${t(langKeys.contact)}`,
                accessor: 'contact',
            },
            {
                Header: t(langKeys.channel),
                accessor: 'channel',
            },
            {
                Header: t(langKeys.origin),
                accessor: 'origin',
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                prefixTranslation: 'status_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { status } = props.cell.row.original || {};
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: `N° ${t(langKeys.transaction)}`,
                accessor: 'transactionid',
            },
            {
                Header: t(langKeys.group),
                accessor: 'group',
            },
            {
                Header: t(langKeys.agent),
                accessor: 'agent',
            },
            {
                Header: t(langKeys.success),
                accessor: 'success',
                type: 'boolean',
                sortType: 'basic',
                width: 180,
                maxWidth: 180,
                Cell: (props: any) => {
                    const { success } = props.cell.row.original;
                    return success ? t(langKeys.yes) : "No"
                }
            },
            {
                Header: t(langKeys.realduration),
                accessor: 'realduration',
            },
            {
                Header: t(langKeys.classification),
                accessor: 'classification',
            },
            {
                Header: t(langKeys.log),
                accessor: 'log',
            },
            {
                Header: t(langKeys.body),
                accessor: 'body',
            },
            {
                Header: t(langKeys.parameters),
                accessor: 'parameters',
            },
        ],
        [t]
    );

    return (
        <div style={{width: '100%'}}>
            <div className={classes.containerDetail}>
                <TableZyx
                    titlemodule={`${row?.campaign} (${row?.date})` || `${t(langKeys.recordhsmreport)} ${t(langKeys.detail)}`}
                    ButtonsElement={() => (
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                    )}
                    columns={columns}
                    data={multiDataAux2.data[0]?.data||[]}
                    download={true}
                    loading={multiDataAux2.loading}
                    register={false}
                    filterGeneral={false}
                    // fetchData={fetchData}
                />
            </div>
        </div>
    );
}

const selectionKey = 'id';
const IDHSMHISTORY = 'IDHSMHISTORY';

const HSMHistoryReport: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiData);
    
    const classes = useStyles()
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [gridData, setGridData] = useState<any[]>([]);

    const memoryTable = useSelector(state => state.main.memoryTable);

    const [selectedRows, setSelectedRows] = useState<any>({});
    const [triggerExportPersonalized, setTriggerExportPersonalized] = useState<boolean>(false);
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
                Header: t(langKeys.campaign),
                accessor: 'campaign',
                width: 'auto',
            },
            {
                Header: t(langKeys.date),
                accessor: 'date',
                width: 'auto',
            },
            {
                Header: t(langKeys.total),
                accessor: 'total',
                type: 'number',
                sortType: 'number',
                width: 'auto',
            },
            {
                Header: t(langKeys.success),
                accessor: 'success',
                type: 'number',
                sortType: 'number',
                width: 'auto',
            },
            {
                Header: t(langKeys.failed),
                accessor: 'failed',
                type: 'number',
                sortType: 'number',
                width: 'auto',
            },
            {
                Header: t(langKeys.success_percent),
                accessor: 'successp',
                type: 'number',
                sortType: 'number',
                width: 'auto',
            },
            {
                Header: t(langKeys.failed_percent),
                accessor: 'failedp',
                type: 'number',
                sortType: 'number',
                width: 'auto',
            },
        ],
        [t]
    );

    useEffect(() => {
        dispatch(setMemoryTable({
            id: IDHSMHISTORY
        }))
        return () => {
            dispatch(cleanMemoryTable());
        };
    }, []);

    const triggerExportData = () => {
        if (Object.keys(selectedRows).length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_record_selected)}));
            return null;
        }
        dispatch(exportData(getHSMHistoryReportExport(
            Object.keys(selectedRows).reduce((ad: any[], d: any) => {
                ad.push({
                    ddate: d.split('_')[d.split('_').length - 1],
                    campaignname: d.split(`_${d.split('_')[d.split('_').length - 1]}`)[0],
                })
                return ad;
            }, [])),
            `${t(langKeys.report)}`,
            'excel',
            true,
            [
                {key: 'campaign', alias: t(langKeys.campaign)},
                {key: 'firstname', alias: t(langKeys.firstname)},
                {key: 'lastname', alias: t(langKeys.lastname)},
                {key: 'ticketnum', alias: t(langKeys.ticket)},
                {key: 'rundate', alias: t(langKeys.rundate)},
                {key: 'runtime', alias: t(langKeys.runtime)},
                {key: 'finishdate', alias: t(langKeys.finishconversationdate)},
                {key: 'firstreplydate', alias: t(langKeys.firstreplydate)},
                {key: 'firstreplytime', alias: t(langKeys.firstreplytime)},
                {key: 'contact', alias: t(langKeys.contact)},
                {key: 'channel', alias: t(langKeys.channel)},
                {key: 'origin', alias: t(langKeys.origin)},
                {key: 'status', alias: t(langKeys.status)},
                {key: 'transactionid', alias: t(langKeys.transaction)},
                {key: 'group', alias: t(langKeys.group)},
                {key: 'agent', alias: t(langKeys.agent)},
                {key: 'success', alias: t(langKeys.success)},
                {key: 'realduration', alias: t(langKeys.realduration)},
                {key: 'classification', alias: t(langKeys.classification)},
                {key: 'log', alias: t(langKeys.log)},
                {key: 'body', alias: t(langKeys.body)},
                {key: 'parameters', alias: t(langKeys.parameters)},
            ]
        ));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (Object.keys(selectedRows).length === 0) {
            setTriggerExportPersonalized(false)
        }
        else {
            setTriggerExportPersonalized(true)
        }
    }, [selectedRows])

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
    
    function search(){
        dispatch(showBackdrop(true))
        dispatch(getMultiCollection([
            getHSMHistoryList(
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
        if (!multiData.loading){
            setGridData(multiData.data[0]?.data.map(x => ({
                ...x,
                name_translated: x.name !== x.translationname?(t(`report_sentmessages_${x.name}`.toLowerCase()) || "").toUpperCase():x.name?.toUpperCase(),
            }))||[]);
            dispatch(showBackdrop(false));
        }
    }, [multiData])

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    if (viewSelected === "view-1") {

        return (
            <React.Fragment>
                <div style={{ height: 10 }}></div>
                    <TableZyx
                        onClickRow={handleView}    
                        columns={columns}
                        data={gridData}
                        ButtonsElement={() => (
                            <div className={classes.containerHeader} style={{display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', gap: 8}}>
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
                        triggerExportPersonalized={triggerExportPersonalized}
                        exportPersonalized={triggerExportData}
                        useSelection={true}
                        selectionKey={selectionKey}
                        setSelectedRows={setSelectedRows}
                        pageSizeDefault={IDHSMHISTORY === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                        initialPageIndex={IDHSMHISTORY === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                        initialStateFilter={IDHSMHISTORY === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                    />
            </React.Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailHSMHistoryReport
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        )
    } 
    else
        return null;

}

export default HSMHistoryReport;