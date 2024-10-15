import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { convertLocalDate, dictToArrayKV, getCampaignReportExport, getCampaignReportPaginated, getCampaignReportProactiveExport, getCommChannelLst, getDateCleaned } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import { exportData, getCollectionAux, getCollectionPaginated, resetCollectionPaginated } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { TemplateBreadcrumbs, TitleDetail, FieldSelect, DateRangePicker } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { DownloadIcon } from 'icons';
import { Button} from '@material-ui/core';
import TablePaginated from 'components/fields/table-paginated';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import { Search as SearchIcon } from '@material-ui/icons';
import { DetailPropsReportCampaign, ReportCampaignStyles, RowReportCampaign, SelectedRows } from 'pages/campaign';
import { CellProps } from 'react-table';
import { ModalReportCampaign } from './ModalReportCampaign';

export const ReportCampaign: React.FC<DetailPropsReportCampaign> = ({ setViewSelected, externalUse }) => {
    const dataReportType = {
        default: 'default',
        proactive: 'proactive'
    }    
    const initialRange = {
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: 'selection'
    }    
    const classes = ReportCampaignStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null, distinct: "" })
    const [waitExport, setWaitExport] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, ] = React.useState<RowReportCampaign | null>(null);    
    const [selectedRows, setSelectedRows] = useState<SelectedRows>({});
    const [reportType, setReportType] = useState<string>('default');
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const filterChannel = useSelector ((state)=> state.main.mainAux)
    const [, setColumnOrder] = React.useState<string[]>([]);
    const selectionKey = 'id';
    const channelTypeList = filterChannel.data || [];
    const channelTypeFilteredList = new Set();
    const [selectedChannel, setSelectedChannel] = useState("");

    const arrayBread = [
        { id: "view-1", name: t(langKeys.campaign_plural) },
        { id: "view-2", name: t(langKeys.campaignsreport) }
    ];

    const columns = React.useMemo(
        () => [                    
            {
                Header: t(langKeys.campaign),
                accessor: 'title',
                showGroupedBy: true,                 
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                showGroupedBy: true,             
            },
            {
                Header: t(langKeys.templatetype),
                accessor: 'templatetype',
                showGroupedBy: true,                            
            },
            {
                Header: t(langKeys.templatename),
                accessor: 'templatename',
                showGroupedBy: true,                 
            },
            {
                Header: t(langKeys.channel),
                accessor: 'channel',
                showGroupedBy: true,                 
            },
            {
                Header: t(langKeys.rundate),
                accessor: 'rundate',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;                
                    if (row && row.rundate) {
                        return convertLocalDate(row.rundate).toLocaleString();
                    } else {
                        return "";
                    }
                },
            },
            {
                Header: t(langKeys.executiontype_campaign),
                accessor: 'executiontype',
                NoFilter: false,
                showGroupedBy: true, 
                showColumn: true,     
                prefixTranslation: 'executiontype',
            },                
            {
                Header: t(langKeys.executingUser),
                accessor: 'executionuser',
                NoFilter: false,
                showGroupedBy: true, 
                showColumn: true,   
                prefixTranslation: 'executionuser',
            },
            {
                Header: t(langKeys.executingUserProfile),
                accessor: 'executionuserprofile',
                NoFilter: false,
                showGroupedBy: true, 
                showColumn: true,   
                prefixTranslation: 'executionuserprofile',
            },
            {
                Header: t(langKeys.total),
                accessor: 'total',
                type: 'number',
                sortType: 'number',
                showColumn: true,
            },
            {
                Header: t(langKeys.success),
                accessor: 'success',
                type: 'number',
                sortType: 'number',
                showColumn: true,
            },
            {
                Header: t(langKeys.success_percent),
                accessor: 'successp',
                type: 'number',
                sortType: 'number',
                showColumn: true,
            },
            {
                Header: t(langKeys.failed),
                accessor: 'fail',
                type: 'number',
                sortType: 'number',
                showColumn: true,
            },
            {
                Header: t(langKeys.failed_percent),
                accessor: 'failp',
                type: 'number',
                sortType: 'number',
                showColumn: true,
            },
            {
                Header: t(langKeys.attended),
                accessor: 'attended',
                type: 'number',
                sortType: 'number',
                showColumn: true,
            },
            {
                Header: t(langKeys.locked),
                accessor: 'locked',
                type: 'number',
                sortType: 'number',
                showColumn: true,
            },
            {
                Header: t(langKeys.blacklisted),
                accessor: 'blacklisted',
                type: 'number',
                sortType: 'number',  
                showColumn: true,            
            },
        ],
        []
    );

    React.useEffect(() => {
        setColumnOrder(columns.map(column => column.accessor));
    }, [columns]);

    const fetchData = ({ pageSize, pageIndex, filters, sorts, distinct }: IFetchData) => {
        dispatch(showBackdrop(true))
        setfetchDataAux({...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts, distinct }});
        dispatch(getCollectionPaginated(getCampaignReportPaginated(
            {
                startdate: dateRangeCreateDate.startDate,
                enddate: dateRangeCreateDate.endDate,
                channeltype: selectedChannel,
                sorts: sorts,
                distinct: distinct,
                filters: filters,
                take: pageSize,
                skip: pageIndex * pageSize,
            }
        )));
    };

    const triggerExportData = () => {
        if (Object.keys(selectedRows).length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_record_selected)}));
            return null;
        }
        if (!reportType) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_type_selected)}));
            return null;
        }
        
        
        if (reportType === dataReportType.default) {
            dispatch(exportData(getCampaignReportExport(
                Object.keys(selectedRows).reduce((ad: { campaignid: string; rundate: string }[], d: string) => {
                    ad.push({
                        campaignid: d.split('_')[0],
                        rundate: d.split('_')[1]
                    })
                    return ad;
                }, [])),
                `${t(langKeys.report)}`,
                'excel',
                true,
                [
                    {key: 'templatetype', alias: t(langKeys.templatetype)},
                    {key: 'date', alias: t(langKeys.date)},
                    {key: 'campaign', alias: t(langKeys.campaign)},
                    {key: 'description', alias: t(langKeys.description)},
                    {key: 'ticketnum', alias: t(langKeys.ticket)},
                    {key: 'group', alias: t(langKeys.group)},
                    {key: 'userid', alias: t(langKeys.userid)},
                    {key: 'agent', alias: t(langKeys.agent)},
                    {key: 'contact', alias: t(langKeys.contact)},
                    {key: 'template', alias: t(langKeys.templatename)},
                    {key: 'rundate', alias: t(langKeys.rundate)},
                    {key: 'runtime', alias: t(langKeys.runtime)},
                    {key: 'executionuser', alias: t(langKeys.executingUser)},
                    {key: 'executionuserprofile', alias: t(langKeys.executingUserProfile)},   
                    {key: 'firstreplydate', alias: t(langKeys.firstreplydate)},
                    {key: 'firstreplytime', alias: t(langKeys.firstreplytime)},                   
                    {key: 'classification', alias: t(langKeys.classification)},
                    {key: 'conversationid', alias: t(langKeys.conversationid)},
                    {key: 'status', alias: t(langKeys.status)},
                    {key: 'log', alias: t(langKeys.log)},
                ]
            ));
            dispatch(showBackdrop(true));
            setWaitExport(true);
        }
        else if (reportType === dataReportType.proactive) {
            dispatch(exportData(getCampaignReportProactiveExport(
                Object.keys(selectedRows).reduce((ad: { campaignid: string; rundate: string }[], d: string) => {
                    ad.push({
                        campaignid: d.split('_')[0],
                        rundate: d.split('_')[1]
                    })
                    return ad;
                }, [])),
                `${t(langKeys.report)}`,
                'excel',
                true,
                [
                    {key: 'templatetype', alias: t(langKeys.templatetype)},
                    {key: 'date', alias: t(langKeys.date)},
                    {key: 'campaign', alias: t(langKeys.campaign)},
                    {key: 'description', alias: t(langKeys.description)},
                    {key: 'ticketnum', alias: t(langKeys.ticket)},
                    {key: 'group', alias: t(langKeys.group)},
                    {key: 'userid', alias: t(langKeys.userid)},
                    {key: 'agent', alias: t(langKeys.agent)},
                    {key: 'contact', alias: t(langKeys.contact)},
                    {key: 'template', alias: t(langKeys.templatename)},
                    {key: 'rundate', alias: t(langKeys.rundate)},
                    {key: 'runtime', alias: t(langKeys.runtime)},
                    {key: 'executionuser', alias: t(langKeys.executingUser)},
                    {key: 'executionuserprofile', alias: t(langKeys.executingUserProfile)},   
                    {key: 'firstreplydate', alias: t(langKeys.firstreplydate)},
                    {key: 'firstreplytime', alias: t(langKeys.firstreplytime)},                   
                    {key: 'classification', alias: t(langKeys.classification)},
                    {key: 'conversationid', alias: t(langKeys.conversationid)},
                    {key: 'status', alias: t(langKeys.status)},
                    {key: 'log', alias: t(langKeys.log)},
                ]
            ));
            dispatch(showBackdrop(true));
            setWaitExport(true);
        }
    };

    useEffect(() => {
        dispatch(resetCollectionPaginated());
        fetchData(fetchDataAux);
        fetchFiltersChannels();
        return () => {
            dispatch(resetCollectionPaginated());
        };
    }, []);

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

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
            dispatch(showBackdrop(false));
        }
    }, [mainPaginated]);  

    const uniqueTypdescList = channelTypeList.filter(item => {
        if (channelTypeFilteredList.has(item.type)) {
            return false; 
        }
        channelTypeFilteredList.add(item.type);
        return true;
    });
   
    const fetchFiltersChannels = () => dispatch(getCollectionAux(getCommChannelLst()))

    return (
        <div style={{ width: '100%' }}>
            {!externalUse && 
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={t(langKeys.campaignsreport)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected && setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                    </div>
                </div>
            }
            {externalUse && <div style={{ height: 10 }}></div>}

            <div style={{position: 'relative', height:'100%'}}>    
                <div style={{ width: 'calc(100% - 60px)', display: 'flex', background:'white', padding:'1rem 0 0 1rem', position: 'absolute', top: 0, right: 50 }}>                 
                    <div style={{textAlign: 'left', display: 'flex', gap: '0.5rem', marginRight: 'auto'   }}>
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
                            {dateRangeCreateDate.startDate && dateRangeCreateDate.endDate 
                                ? `${getDateCleaned(dateRangeCreateDate.startDate)} - ${getDateCleaned(dateRangeCreateDate.endDate)}`
                                : t(langKeys.nodateselected)}                            
                            </Button>
                        </DateRangePicker>
                        <FieldSelect
                            label={t(langKeys.channel)}
                            variant="outlined"                       
                            className={classes.filterComponent}                        
                            data={uniqueTypdescList || []}        
                            valueDefault={uniqueTypdescList}
                            onChange={(value) => setSelectedChannel(value?.type||"")}           
                            optionDesc="typedesc"
                            optionValue="typedesc"
                        />                    
                        <Button
                            disabled={mainPaginated.loading}
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon style={{ color: 'white' }} />}
                            style={{ width: 120, backgroundColor: "#55BD84" }}
                            onClick={() => fetchData(fetchDataAux)}
                        >
                            {t(langKeys.search)}
                        </Button>
                    </div>
                    <div style={{textAlign: 'right', display:'flex', marginRight:'0.5rem', gap:'0.5rem'}}>
                        <FieldSelect
                            uset={true}
                            variant="outlined"
                            label={t(langKeys.reporttype)}
                            className={classes.select}
                            valueDefault={reportType}
                            onChange={(value) => setReportType(value?.key)}
                            data={dictToArrayKV(dataReportType)}
                            optionDesc="value"
                            optionValue="key"
                        />
                        <Button
                                className={classes.button}
                                color="primary"
                                disabled={mainPaginated.loading}
                                onClick={() => triggerExportData()}                         
                                startIcon={<DownloadIcon />}
                                variant="contained"
                            >
                                {`${t(langKeys.download)}`}
                            </Button>                        
                    </div>                                                                                                   
                </div> 
                <TablePaginated
                    columns={columns}
                    data={mainPaginated.data}
                    totalrow={totalrow}
                    loading={mainPaginated.loading}
                    pageCount={pageCount}                    
                    fetchData={fetchData}               
                    showHideColumns={true}
                    groupedBy={true}
                    download={false}
                    hoverShadow={false}
                    exportPersonalized={triggerExportData}
                    useSelection={true}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}             
                />
            </div>            
            {openModal && <ModalReportCampaign
                openModal={openModal}
                setOpenModal={setOpenModal}
                row={selectedRow}
            />}
        </div>
    )
}