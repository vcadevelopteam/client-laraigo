/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { AntTab, DateRangePicker, FieldSelect} from 'components';
import { getDateCleaned, getHSMHistoryList, getHSMHistoryReport, getHSMHistoryReportExport, getUniqueContactsSel, getValuesFromDomain } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanMemoryTable, setMemoryTable, exportData, getMultiCollection, getMultiCollectionAux2, resetMultiMain, getMultiCollectionAux, resetMainAux, resetMultiMainAux, resetMultiMainAux2, getCollection } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { dataYears } from 'common/helpers';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import { Tabs } from '@material-ui/core';

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
    filterComponent: {
        minWidth: '220px',
        maxWidth: '260px'
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
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
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

const UniqueContactsReportDetail: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiDataAux);
    const mainResult = useSelector(state => state.main.mainData);
    
    const classes = useStyles()
    const [viewSelected, setViewSelected] = useState("view-1");
    const [channelType, setChannelType] = useState("");
    const [year, setYear] = useState(`${new Date().getFullYear()}`);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [gridData, setGridData] = useState<any[]>([]);

    const memoryTable = useSelector(state => state.main.memoryTable);

    const [selectedRows, setSelectedRows] = useState<any>({});
    const [triggerExportPersonalized, setTriggerExportPersonalized] = useState<boolean>(false);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector(state => state.main.exportData);
    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.client),
                accessor: 'client',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_01),
                accessor: 'month_01',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_02),
                accessor: 'month_02',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_03),
                accessor: 'month_03',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_04),
                accessor: 'month_04',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_05),
                accessor: 'month_05',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_06),
                accessor: 'month_06',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_07),
                accessor: 'month_07',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_08),
                accessor: 'month_08',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_09),
                accessor: 'month_09',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_10),
                accessor: 'month_10',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_11),
                accessor: 'month_11',
                width: 'auto',
            },
            {
                Header: t(langKeys.month_12),
                accessor: 'month_12',
                width: 'auto',
            },
        ],
        [t]
    );

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
        dispatch(getCollection(
            getUniqueContactsSel(
                {
                    year: year,
                    channeltype: channelType,
                }
            )
        ))
    }
    useEffect(() => {
        return () => {
            dispatch(resetMultiMain());
        }
    }, [])
    useEffect(() => {
        if (!mainResult.loading && mainResult.key === "UFN_REPORT_UNIQUECONTACTS_SEL"){
            let processedData = mainResult.data.reduce((acc:any,x)=>{
                let indexField = acc?.findIndex((y:any)=>(y).client===`${x.corpid}-${x.orgid}`)
                if(indexField<0){
                    return([...acc,{
                        client: `${x.corpid}-${x.orgid}`,
                        month_01: x.month.split('-')[1] === '01'?x.pcc:0,
                        month_02: x.month.split('-')[1] === '02'?x.pcc:0,
                        month_03: x.month.split('-')[1] === '03'?x.pcc:0,
                        month_04: x.month.split('-')[1] === '04'?x.pcc:0,
                        month_05: x.month.split('-')[1] === '05'?x.pcc:0,
                        month_06: x.month.split('-')[1] === '06'?x.pcc:0,
                        month_07: x.month.split('-')[1] === '07'?x.pcc:0,
                        month_08: x.month.split('-')[1] === '08'?x.pcc:0,
                        month_09: x.month.split('-')[1] === '09'?x.pcc:0,
                        month_10: x.month.split('-')[1] === '10'?x.pcc:0,
                        month_11: x.month.split('-')[1] === '11'?x.pcc:0,
                        month_12: x.month.split('-')[1] === '12'?x.pcc:0,
                    }])
                }else{
                    acc[indexField][`month_${x.month.split('-')[1]}`] = x.pcc
                    return acc
                }

            },[])
            setGridData(processedData||[]);
            dispatch(showBackdrop(false));
        }
    }, [mainResult])

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
                                    <FieldSelect
                                        label={t(langKeys.channeltype)}
                                        className={classes.filterComponent}
                                        onChange={(value) => {setChannelType(value?.domainvalue||'')}}
                                        valueDefault={channelType}
                                        variant="outlined"
                                        data={multiData?.data?.[0]?.data||[]}
                                        optionDesc={"domaindesc"}
                                        optionValue={"domainvalue"}
                                    />
                                    <FieldSelect
                                        label={t(langKeys.year)}
                                        style={{ width: 140 }}
                                        variant="outlined"
                                        valueDefault={year}
                                        onChange={(value) => setYear(value?.value)}
                                        data={dataYears}
                                        optionDesc="value"
                                        optionValue="value"
                                    />
                                    <div>
                                        <Button
                                            disabled={mainResult.loading}
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
                        loading={mainResult.loading}
                        register={false}
                        triggerExportPersonalized={triggerExportPersonalized}
                        exportPersonalized={triggerExportData}
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

const UniqueContactsReport: FC = () => {
    const [pageSelected, setPageSelected] = useState(0);    
    const [companydomain, setcompanydomain] = useState<any>([]);
    const [groupsdomain, setgroupsdomain] = useState<any>([]);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const dispatch = useDispatch();
    useEffect(() => {
        if(!multiDataAux.loading){
            setcompanydomain(multiDataAux.data[0]?.data||[]) 
            setgroupsdomain(multiDataAux.data[1]?.data||[])    
        }
    }, [multiDataAux])
    useEffect(() => {
        dispatch(getMultiCollectionAux([
            getValuesFromDomain("TIPOCANAL"),
            //getValuesFromDomain("GRUPOS")
        ]))
        return () => {
            dispatch(resetMainAux());
            dispatch(resetMultiMain());
            dispatch(resetMultiMainAux());
            dispatch(resetMultiMainAux2());
        }
    }, [])
    const { t } = useTranslation();
    return (
        <Fragment>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={t(langKeys.uniquecontacts)}/>
                <AntTab label={t(langKeys.conversationquantity)}/>
            </Tabs>
            {pageSelected === 0 && <UniqueContactsReportDetail />}
        </Fragment>
    )
}

export default UniqueContactsReport;