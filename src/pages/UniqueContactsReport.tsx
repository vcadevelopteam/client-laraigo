/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { AntTab, DialogZyx, FieldMultiSelect, FieldSelect} from 'components';
import { convertLocalDate, dateToLocalDate, getUniqueContactsConversationExport, getUniqueContactsExport, getUniqueContactsSel, getValuesFromDomain, selOrgSimpleList, selUniqueContactsConversation, selUniqueContactsPcc } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { resetMultiMain, getMultiCollectionAux, resetMainAux, resetMultiMainAux, resetMultiMainAux2, getCollection, getCollectionAux, getCollectionPaginated, exportData } from 'store/main/actions';
import { XAxis, YAxis, ResponsiveContainer, Tooltip as ChartTooltip, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, LabelList } from 'recharts';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { dataYears } from 'common/helpers';
import ListIcon from '@material-ui/icons/List';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ClearIcon from '@material-ui/icons/Clear';
import {
    Search as SearchIcon, Settings,
} from '@material-ui/icons';
import { Box, CircularProgress, Tabs } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { StreetViewPanorama } from '@react-google-maps/api';
import TablePaginated from 'components/fields/table-paginated';
import DialogInteractions from 'components/inbox/DialogInteractions';

const COLORS = ["#0f8fe5", "#067713", "#296680", "#fc3617", "#e8187a", "#7cfa57", "#cfbace", "#4cd45f", "#fd5055", "#7e1be4", "#bf1490", "#66c6cf", "#011c3d", "#1a9595", "#4ae2c7", "#515496", "#a2aa65", "#df909c", "#3aa343", "#e0606e"];
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
    numericCell:{
        textAlign: 'end',
        paddingRight: '40px'
    },
    containerHeaderItem: {
        backgroundColor: '#FFF',
        padding: 8,
        display: 'block',
        flexWrap: 'wrap',
        gap: 8,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    setGraphicType: (value: string) => void;
    columns: any[];
    columnsprefix?: string;
}

interface DetailUniqueContactProps {
    row: any;
    setViewSelected: (view: string) => void;
}

const TableResume: FC<{ graphicType: string; data: Dictionary[] }> = ({ data, graphicType }) => {
    const { t } = useTranslation();

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.month),
                accessor: 'name',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;

                    if (graphicType === "BAR")
                        return row?.name;
                    return (
                        <div style={{ display: 'flex', gap: 4 }}>
                            <div style={{ width: 15, height: 15, backgroundColor: row.color }}></div>
                            {row?.name}
                        </div>
                    )
                }
            },
            {
                Header: t(langKeys.quantity),
                accessor: 'value',
                NoFilter: true,
                type: 'number'
            },
            {
                Header: t(langKeys.percentage),
                accessor: 'percentage',
                NoFilter: true,
                type: 'number',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.percentage.toFixed(2) + "%";
                }
            },
        ],
        []
    );

    return (
        <div>
            <TableZyx
                columns={columns}
                data={data}
                download={false}
                filterGeneral={false}
                toolsFooter={false}
            />
        </div>
    )
}



const SummaryGraphic: React.FC<SummaryGraphicProps> = ({ openModal,setView, setOpenModal, columns, setGraphicType }) => {
    const { t } = useTranslation();

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<any>({
        defaultValues: {
            graphictype: 'BAR',
            column: 'month'
        }
    });

    useEffect(() => {
        register('graphictype', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('column', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    const handleCancelModal = () => {
        setOpenModal(false);
    }

    const handleAcceptModal = handleSubmit((data:any) => {
        setOpenModal(false);
        setGraphicType(data.graphictype)
        setView(data.graphictype)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.graphic_configuration)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.accept)}
            handleClickButton2={handleAcceptModal}
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_type)}
                    className="col-12"
                    valueDefault={getValues('graphictype')}
                    error={errors?.graphictype?.message}
                    onChange={(value) => setValue('graphictype', value?.key)}
                    data={[{ key: 'BAR', value: 'BAR' }, { key: 'PIE', value: 'PIE' }]}
                    uset={true}
                    prefixTranslation="graphic_"
                    optionDesc="value"
                    optionValue="key"
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_view_by)}
                    className="col-12"
                    valueDefault={getValues('column')}
                    error={errors?.column?.message}
                    onChange={(value) => setValue('column', value?.key)}
                    data={columns}
                    optionDesc="value"
                    optionValue="key"
                    uset={true}
                    prefixTranslation=""
                />
            </div>
        </DialogZyx>
    )
}

const RADIAN = Math.PI / 180;
export const RenderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, ...rest }: Dictionary) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {value||""}
        </text>
    );
};

const DetailUniqueContact: React.FC<DetailUniqueContactProps> = ({ row, setViewSelected }) => {
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const [allParameters, setAllParameters] = useState<Dictionary>({});
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const [totalrow, settotalrow] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector(state => state.main.exportData);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(selUniqueContactsPcc({
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            orgid:row.row.orgid,
            corpid:row.row.corpid,
            month:row.month,
            year:row.year,
            channeltype:row.channeltype,
            filters: {
                ...filters,
            },
            ...allParameters
        })))
    };
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: 'name',
                width: 'auto',
            },
            {
                Header: t(langKeys.communicationchannel),
                accessor: 'channels',
                width: 'auto',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <div>{row?.channels?.substring(0,30)}...</div>
                }
            },
            {
                Header: t(langKeys.firstContactDate),
                accessor: 'firstcontact',
                width: 'auto',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.firstcontact ? convertLocalDate(row.firstcontact).toLocaleString() : ""
                }
            },
            {
                Header: t(langKeys.lastContactDate),
                accessor: 'lastcontact',
                width: 'auto',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.lastcontact ? convertLocalDate(row.lastcontact).toLocaleString() : ""
                }
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone',
                width: 'auto',
            },
            {
                Header: t(langKeys.email),
                accessor: 'email',
                width: 'auto',
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                width: 'auto',
            },
        ],
        [t]
    );
    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated])
    
    const triggerExportData = ({ filters, sorts }: IFetchData) => {
        const columnsExport = columns.map(x => ({
            key: x.accessor,
            alias: x.Header
        }))
        dispatch(exportData(getUniqueContactsExport({
            filters: {
                ...filters,
            },
            sorts,
            year: row.year,
            month:row.month,
            channeltype:row.channeltype,
            ...allParameters
        }), "", "excel", false, columnsExport));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    return (
        <TablePaginated
            columns={columns}
            data={mainPaginated.data}
            totalrow={totalrow}
            loading={mainPaginated.loading}
            pageCount={pageCount}
            autotrigger={true}
            download={true}
            ButtonsElement={() => (
                <>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}>
                        {t(langKeys.back)}
                    </Button>
                </>
            )}
            fetchData={fetchData}
            exportPersonalized={triggerExportData}
        />
    )
    
}


const UniqueContactsReportDetail: FC<{year:any; channelType:any}> = ({year,channelType}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiDataAux);
    const mainResult = useSelector(state => state.main.mainAux);    
    const [viewSelected, setViewSelected] = useState("view-1");
    const [view, setView] = useState('GRID');
    const classes = useStyles()
    const [gridData, setGridData] = useState<any[]>([]);
    const [dataGraph, setdataGraph] = useState<any>([]);
    const [rowSelected, setRowSelected] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false);
    const [graphicType, setGraphicType] = useState('BAR');

    const cell = (props: any) => {
        const column = props.cell.column;
        const row = props.cell.row.original;
        if(row.client === "Total"){
            return <div><b>{row[column.id]}</b></div>
        }else if(column.id.includes('_')){
            return <div onClick={()=>handleView(row,column.id.split('_')[1])}>{row[column.id]}</div>
        }else{
            return <div>{row[column.id]}</div>
        }
    }
    
    const handleView = (row: Dictionary, month:number) => {
        setRowSelected({
            row,
            month,
            year,
            channeltype: channelType
        })
        setViewSelected("view-2");
    }
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.client),
                accessor: 'client',
                width: 'auto',
                Cell: (props: any) => {
                    const column = props.cell.column;
                    const row = props.cell.row.original;
                    if(row.client === "Total"){
                        return <div><b>{row[column.id]}</b></div>
                    }else{
                        return <div>{row[column.id]}</div>
                    }
                }
            },
            {
                Header: t(langKeys.month_01),
                accessor: 'month_1',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_02),
                accessor: 'month_2',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_03),
                accessor: 'month_3',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_04),
                accessor: 'month_4',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_05),
                accessor: 'month_5',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_06),
                accessor: 'month_6',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_07),
                accessor: 'month_7',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_08),
                accessor: 'month_8',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_09),
                accessor: 'month_9',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_10),
                accessor: 'month_10',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_11),
                accessor: 'month_11',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_12),
                accessor: 'month_12',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.total),
                accessor: 'total',
                width: 'auto',
                type: 'number',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <b>{row.total}</b>
                }
            },
        ],
        [t]
    );
    
    useEffect(() => {
        if (!mainResult.loading && mainResult?.key?.includes("UFN_REPORT_UNIQUECONTACTS_SEL")){
            let mainTotal:any = {
                client: "Total",
                month_1: 0, month_2: 0, month_3: 0, month_4: 0, month_5: 0, month_6: 0, month_7: 0, month_8: 0, month_9: 0, month_10: 0, month_11: 0, month_12: 0, total: 0
            }
            let rawdata: any[] = [];
            multiData.data[1].data.map((x)=>{
                rawdata.push({
                    client: `${x.corpdesc} - ${x.orgdesc}`,
                    corpid: x.corpid,
                    orgid: x.orgid,
                    month_1: 0,
                    month_2: 0,
                    month_3: 0,
                    month_4: 0,
                    month_5: 0,
                    month_6: 0,
                    month_7: 0,
                    month_8: 0,
                    month_9: 0,
                    month_10: 0,
                    month_11: 0,
                    month_12: 0,
                    total: 0
                })
            })
            mainResult.data.map(x=>{
                let clientdata = multiData.data[1].data.filter(y=>(x.corpid === y.corpid && x.orgid===y.orgid))[0]
                let indexField = rawdata?.findIndex((y:any)=>(y).client===`${clientdata?.corpdesc} - ${clientdata?.orgdesc}`)   
                if(!(indexField<0)){
                    mainTotal[`month_${x.month}`] += x.pcc
                    mainTotal.total += x.pcc
                    rawdata[indexField][`month_${x.month}`] = x.pcc
                    rawdata[indexField].total += x.pcc
                }
            })
            setGridData([...rawdata,mainTotal]||[]);
            setdataGraph(Object.keys(mainTotal).filter(x=>x.includes('_')).reduce((acc:any,x:string, i:number)=>[...acc,{name:t(x),value:mainTotal[x], percentage: mainTotal[x]*100/mainTotal.total, color:COLORS[i]}],[]))
            dispatch(showBackdrop(false));
        }
    }, [mainResult])


    if (viewSelected === "view-1") {

        return (
            <div>
                {view === "GRID" ? (
                <React.Fragment>
                    <div style={{ height: 10 }}></div>
                        <TableZyx   
                            columns={columns}
                            data={gridData}
                            ButtonsElement={() => (
                                <Box width={1} style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        disabled={mainResult.loading || !(gridData.length > 0)}
                                        onClick={() => setOpenModal(true)}
                                        startIcon={<AssessmentIcon />}
                                    >
                                        {t(langKeys.graphic_view)}
                                    </Button>
                                </Box>
                            )}
                            download={true}
                            filterGeneral={false}
                            loading={mainResult.loading}
                            register={false}
                        />
                </React.Fragment>):
                (<div>
                    <Box style={{ display: "flex", justifyContent: "flex-end", gap: 8 }} className={classes.containerHeaderItem}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={mainResult.loading || !(gridData.length > 0)}
                            onClick={() => setOpenModal(true)}
                            startIcon={<Settings />}
                        >
                            {t(langKeys.configuration)}
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => setView('GRID')}
                            startIcon={<ListIcon />}
                        >
                            {t(langKeys.grid_view)}
                        </Button>
                        <>
                        {(mainResult.loading) ? (
                            <div style={{ flex: 1, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress />
                            </div>
                        ) :(graphicType === "BAR" ? (
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: '0 0 70%', height: 500 }}>
                                    <ResponsiveContainer aspect={4.0 / 2}>
                                        <BarChart
                                            data={dataGraph}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" style={{ fontSize: "0.8em" }} angle={315} interval={0} textAnchor="end" height={160} dy={5} dx={-5} />
            
                                            <YAxis />
                                            <ChartTooltip formatter={(value:any, name:any)=> [value,t(name)]} />
                                            <Bar dataKey="value" fill="#8884d8" textAnchor="end" stackId="a" type="monotone" ></Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <TableResume
                                        graphicType={graphicType}
                                        data={dataGraph}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: '0 0 65%', height: 500 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <ChartTooltip />
                                            <Pie
                                                data={dataGraph}
                                                dataKey="value"
                                                labelLine={false}
                                                label={RenderCustomizedLabel}
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                fill="#8884d8"
                                            >
                                                {dataGraph.map((item:any, i:number) => (
                                                    <Cell
                                                        key={item.name}
                                                        fill={item.color}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <TableResume
                                        graphicType={graphicType}
                                        data={dataGraph}
                                    />
                                </div>
                            </div>
                        ))}
                        </>
                    </Box>
                </div>
                )}

                <SummaryGraphic
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    setGraphicType={setGraphicType}
                    setView={setView}
                    columns={[{
                        value: t(langKeys.month),
                        key: 'month',
                    }]}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
            return <DetailUniqueContact
                row={rowSelected}
                setViewSelected={setViewSelected}
            />
    } 
    else
        return null;

}


const DetailConversationQuantity: React.FC<DetailUniqueContactProps> = ({ row, setViewSelected }) => {
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const [allParameters, setAllParameters] = useState<Dictionary>({});
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const mainResult = useSelector(state => state.main.mainAux2);
    const [totalrow, settotalrow] = useState(0);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector(state => state.main.exportData);
    const [openModal, setOpenModal] = useState(false);
    const classes = useStyles()
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const openDialogInteractions = useCallback((row: any) => {
        setOpenModal(true);
        setRowSelected({ ...row, displayname: row?.name||"" })
    }, [mainResult]);
    
    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(selUniqueContactsConversation({
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            orgid:row.row.orgid,
            corpid:row.row.corpid,
            month:row.month,
            year:row.year,
            channeltype:row.channeltype,
            filters: {
                ...filters,
            },
            ...allParameters
        })))
    };
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.ticket_number),
                accessor: 'ticketnum',
                width: 'auto',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => openDialogInteractions(row)}
                        >
                            {row.ticketnum}
                        </label>
                    )
                }
            },
            {
                Header: t(langKeys.startdate),
                accessor: 'startdate',
                width: 'auto',
                type: 'date',
                sortType: 'date',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.startdate ? dateToLocalDate(row.startdate) : ""
                }
            },
            {
                Header: t(langKeys.starttime),
                accessor: 'starttime',
                width: 'auto',
            },
            {
                Header: t(langKeys.enddate),
                accessor: 'finishdate',
                width: 'auto',
                type: 'date',
                sortType: 'date',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.finishdate ? dateToLocalDate(row.finishdate) : ""
                }
            },
            {
                Header: t(langKeys.finishtime),
                accessor: 'finishtime',
                width: 'auto',
            },
            {
                Header: t(langKeys.communicationchannel),
                accessor: 'channel',
                width: 'auto',
            },
            {
                Header: t(langKeys.origin),
                accessor: 'origin',
                width: 'auto',
            },
            {
                Header: t(langKeys.person),
                accessor: 'name',
                width: 'auto',
            },
            {
                Header: t(langKeys.email),
                accessor: 'email',
                width: 'auto',
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone',
                width: 'auto',
            },
            {
                Header: t(langKeys.closedby),
                accessor: 'usertype',//preguntar a nano cual es el campo real
                width: 'auto',
            },
            {
                Header: t(langKeys.advisor),
                accessor: 'asesor',
                width: 'auto',
            },
            {
                Header: t(langKeys.group),
                accessor: 'usergroup',
                width: 'auto',
            },
            {
                Header: t(langKeys.closetype),
                accessor: 'closetype',
                width: 'auto',
            },
            {
                Header: t(langKeys.ticket_fechahandoff),
                accessor: 'handoffdate',
                width: 'auto',
                type: 'date',
                sortType: 'date',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.handoffdate ? dateToLocalDate(row.handoffdate) : ""
                }
            },
            {
                Header: t(langKeys.report_productivity_derivationtime),
                accessor: 'handofftime',
                width: 'auto',
            },
            {
                Header: t(langKeys.tmo),
                accessor: 'tmo',
                width: 'auto',
                helpText: t(langKeys.tmotooltip) 
            },
            {
                Header: t(langKeys.tmeAgent),
                accessor: 'tmeasesor',
                width: 'auto',
            },
            {
                Header: t(langKeys.report_productivity_holdingholdtime),
                accessor: 'tdatime',
                width: 'auto',
            },
            {
                Header: t(langKeys.report_productivity_suspensiontime),
                accessor: 'pauseduration', //preguntar por el campo
                width: 'auto',
            },
            {
                Header: t(langKeys.tmr),
                accessor: 'tmrasesor',
                width: 'auto',
                helpText: t(langKeys.tmrtooltip)
            },
            {
                Header: t(langKeys.ticket_balancetimes),
                accessor: 'balancetimes',
                type: 'number',
                width: 'auto',
            },
        ],
        [t]
    );
    
    const triggerExportData = ({ filters, sorts }: IFetchData) => {
        const columnsExport = columns.map(x => ({
            key: x.accessor,
            alias: x.Header
        }))
        dispatch(exportData(getUniqueContactsConversationExport({
            filters: {
                ...filters,
            },
            sorts,
            year: row.year,
            month:row.month,
            channeltype:row.channeltype,
            ...allParameters
        }), "", "excel", false, columnsExport));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };
    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated])

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    return (
        <>
            <TablePaginated
                columns={columns}
                data={mainPaginated.data}
                totalrow={totalrow}
                loading={mainPaginated.loading}
                pageCount={pageCount}
                autotrigger={true}
                download={true}
                ButtonsElement={() => (
                    <>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}>
                            {t(langKeys.back)}
                        </Button>
                    </>
                )}
                fetchData={fetchData}
                exportPersonalized={triggerExportData}
            />            
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
        </>
    )
    
}

const ConversationQuantityReportDetail: FC<{year:any; channelType:any}> = ({year,channelType}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiDataAux);
    const mainResult = useSelector(state => state.main.mainAux);    
    const [viewSelected, setViewSelected] = useState("view-1");
    const [view, setView] = useState('GRID');
    const classes = useStyles()
    const [gridData, setGridData] = useState<any[]>([]);
    const [dataGraph, setdataGraph] = useState<any>([]);
    const [rowSelected, setRowSelected] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false);
    const [graphicType, setGraphicType] = useState('BAR');

    const cell = (props: any) => {
        const column = props.cell.column;
        const row = props.cell.row.original;
        if(row.client === "Total"){
            return <div><b>{row[column.id]}</b></div>
        }else if(column.id.includes('_')){
            return <div onClick={()=>handleView(row,column.id.split('_')[1])}>{row[column.id]}</div>
        }else{
            return <div>{row[column.id]}</div>
        }
    }
    
    const handleView = (row: Dictionary, month:number) => {
        setRowSelected({
            row,
            month,
            year,
            channeltype: channelType
        })
        setViewSelected("view-2");
    }
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.client),
                accessor: 'client',
                width: 'auto',
                Cell: (props: any) => {
                    const column = props.cell.column;
                    const row = props.cell.row.original;
                    if(row.client === "Total"){
                        return <div><b>{row[column.id]}</b></div>
                    }else{
                        return <div>{row[column.id]}</div>
                    }
                }
            },
            {
                Header: t(langKeys.month_01),
                accessor: 'month_1',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_02),
                accessor: 'month_2',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_03),
                accessor: 'month_3',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_04),
                accessor: 'month_4',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_05),
                accessor: 'month_5',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_06),
                accessor: 'month_6',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_07),
                accessor: 'month_7',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_08),
                accessor: 'month_8',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_09),
                accessor: 'month_9',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_10),
                accessor: 'month_10',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_11),
                accessor: 'month_11',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.month_12),
                accessor: 'month_12',
                width: 'auto',
                type: 'number',
                Cell:cell
            },
            {
                Header: t(langKeys.total),
                accessor: 'total',
                width: 'auto',
                type: 'number',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <b>{row.total}</b>
                }
            },
        ],
        [t]
    );
    useEffect(() => {
        if (!mainResult.loading && mainResult?.key?.includes("UFN_REPORT_UNIQUECONTACTS_SEL")){
            let mainTotal:any = {
                client: "Total",
                month_1: 0, month_2: 0, month_3: 0, month_4: 0, month_5: 0, month_6: 0, month_7: 0, month_8: 0, month_9: 0, month_10: 0, month_11: 0, month_12: 0, total: 0
            }
            let rawdata: any[] = [];
            multiData.data[1].data.map((x)=>{
                rawdata.push({
                    client: `${x.corpdesc} - ${x.orgdesc}`,
                    corpid: x.corpid,
                    orgid: x.orgid,
                    month_1: 0,
                    month_2: 0,
                    month_3: 0,
                    month_4: 0,
                    month_5: 0,
                    month_6: 0,
                    month_7: 0,
                    month_8: 0,
                    month_9: 0,
                    month_10: 0,
                    month_11: 0,
                    month_12: 0,
                    total: 0
                })
            })
            mainResult.data.map(x=>{
                let clientdata = multiData.data[1].data.filter(y=>(x.corpid === y.corpid && x.orgid===y.orgid))[0]
                let indexField = rawdata?.findIndex((y:any)=>(y).client===`${clientdata?.corpdesc} - ${clientdata?.orgdesc}`)   
                if(!(indexField<0)){
                    mainTotal[`month_${x.month}`] += x.conversation
                    mainTotal.total += x.conversation
                    rawdata[indexField][`month_${x.month}`] = x.conversation
                    rawdata[indexField].total += x.conversation
                }
            })
            setGridData([...rawdata,mainTotal]||[]);
            setdataGraph(Object.keys(mainTotal).filter(x=>x.includes('_')).reduce((acc:any,x:string, i:number)=>[...acc,{name:t(x),value:mainTotal[x], percentage: mainTotal[x]*100/mainTotal.total, color:COLORS[i]}],[]))
            dispatch(showBackdrop(false));
        }
    }, [mainResult])

    if (viewSelected === "view-1") {

        return (
            <div>
                {view === "GRID" ? (
                <React.Fragment>
                    <div style={{ height: 10 }}></div>
                        <TableZyx   
                            columns={columns}
                            data={gridData}
                            ButtonsElement={() => (
                                <Box width={1} style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        disabled={mainResult.loading || !(gridData.length > 0)}
                                        onClick={() => setOpenModal(true)}
                                        startIcon={<AssessmentIcon />}
                                    >
                                        {t(langKeys.graphic_view)}
                                    </Button>
                                </Box>
                            )}
                            download={true}
                            filterGeneral={false}
                            loading={mainResult.loading}
                            register={false}
                        />
                </React.Fragment>):
                (<div>
                    <Box style={{ display: "flex", justifyContent: "flex-end", gap: 8 }} className={classes.containerHeaderItem}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={mainResult.loading || !(gridData.length > 0)}
                            onClick={() => setOpenModal(true)}
                            startIcon={<Settings />}
                        >
                            {t(langKeys.configuration)}
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => setView('GRID')}
                            startIcon={<ListIcon />}
                        >
                            {t(langKeys.grid_view)}
                        </Button>
                        <>
                        {(mainResult.loading) ? (
                            <div style={{ flex: 1, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress />
                            </div>
                        ) :(graphicType === "BAR" ? (
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: '0 0 70%', height: 500 }}>
                                    <ResponsiveContainer aspect={4.0 / 2}>
                                        <BarChart
                                            data={dataGraph}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" style={{ fontSize: "0.8em" }} angle={315} interval={0} textAnchor="end" height={160} dy={5} dx={-5} />
            
                                            <YAxis />
                                            <ChartTooltip formatter={(value:any, name:any)=> [value,t(name)]} />
                                            <Bar dataKey="value" fill="#8884d8" textAnchor="end" stackId="a" type="monotone" ></Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <TableResume
                                        graphicType={graphicType}
                                        data={dataGraph}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: '0 0 65%', height: 500 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <ChartTooltip />
                                            <Pie
                                                data={dataGraph}
                                                dataKey="value"
                                                labelLine={false}
                                                label={RenderCustomizedLabel}
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                fill="#8884d8"
                                            >
                                                {dataGraph.map((item:any, i:number) => (
                                                    <Cell
                                                        key={item.name}
                                                        fill={item.color}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <TableResume
                                        graphicType={graphicType}
                                        data={dataGraph}
                                    />
                                </div>
                            </div>
                        ))}
                        </>
                    </Box>
                </div>
                )}

                <SummaryGraphic
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    setGraphicType={setGraphicType}
                    setView={setView}
                    columns={[{
                        value: t(langKeys.month),
                        key: 'month',
                    }]}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
            return <DetailConversationQuantity
                row={rowSelected}
                setViewSelected={setViewSelected}
            />
    } 
    else
        return null;

}

const UniqueContactsReport: FC = () => {
    const [pageSelected, setPageSelected] = useState(0);   
    const dispatch = useDispatch();
    const classes = useStyles()
    const { t } = useTranslation();
    const [channelType, setChannelType] = useState("");
    const [year, setYear] = useState(`${new Date().getFullYear()}`);
    const multiData = useSelector(state => state.main.multiDataAux);
    useEffect(() => {
        dispatch(getMultiCollectionAux([
            getValuesFromDomain("TIPOCANAL"),
            selOrgSimpleList()
        ]))
        return () => {
            dispatch(resetMainAux());
            dispatch(resetMultiMain());
            dispatch(resetMultiMainAux());
            dispatch(resetMultiMainAux2());
        }
    }, [])
    function search(){
        dispatch(showBackdrop(true))
        dispatch(getCollectionAux(
            getUniqueContactsSel(
                {
                    year: year,
                    channeltype: channelType,
                }
            )
        ))
    }
    return (
        <Fragment>            
            <div className={classes.containerHeader} style={{display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', gap: 8}}>      
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
                    <FieldMultiSelect
                        label={t(langKeys.channeltype)}
                        className={classes.filterComponent}
                        onChange={(value) => {setChannelType(value.map((o: Dictionary) => o.domainvalue).join())}}
                        valueDefault={channelType}
                        variant="outlined"
                        data={multiData?.data?.[0]?.data||[]}
                        loading={multiData.loading}
                        optionDesc={"domaindesc"}
                        optionValue={"domainvalue"}
                    />
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
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={t(langKeys.uniquecontacts).toLocaleUpperCase()} style={{fontWeight: 'bold'}}/>
                <AntTab label={t(langKeys.conversationquantity).toLocaleUpperCase()} style={{fontWeight: 'bold'}}/>
            </Tabs>
            {pageSelected === 0 && <UniqueContactsReportDetail year={year} channelType={channelType}/>}
            {pageSelected === 1 && <ConversationQuantityReportDetail year={year} channelType={channelType}/>}
        </Fragment>
    )
}

export default UniqueContactsReport;