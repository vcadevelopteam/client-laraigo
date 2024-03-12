import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { convertLocalDate, dictToArrayKV, getCampaignReportExport, getCampaignReportPaginated, getCampaignReportProactiveExport, getCommChannelLst, getDateCleaned } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import { exportData, getCollectionAux, getCollectionPaginated, resetCollectionPaginated, resetMainAux } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { TemplateBreadcrumbs, TitleDetail, DialogZyx, FieldSelect, DateRangePicker } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { DownloadIcon } from 'icons';
import { Button, Checkbox, Divider, FormControlLabel, Grid, IconButton, ListItemIcon, MenuItem, Paper, Popper, Typography } from '@material-ui/core';
import TablePaginated from 'components/fields/table-paginated';
import TableZyx from 'components/fields/table-simple';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import { Search as SearchIcon } from '@material-ui/icons';
import { CellProps } from 'react-table';
import { FieldErrors } from "react-hook-form";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import AllInboxIcon from '@material-ui/icons/AllInbox';

interface DetailProps {
    setViewSelected?: (view: string) => void;
    externalUse?: boolean;
    setValue: Dictionary
    getValues: Dictionary,
    errors: FieldErrors
}

const arrayBread = [
    { id: "view-1", name: "Campaign" },
    { id: "view-2", name: "Campaign report" }
];

const useStyles = makeStyles(() => ({
      select: {
        width: '200px'
    },   
    itemDate: {        
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)',
        alignItems:'left'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    filterComponent: {
        width: '180px'
      },
}));

const dataReportType = {
    default: 'default',
    proactive: 'proactive'
}

const selectionKey = 'id';

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

export const CampaignReport: React.FC<DetailProps> = ({ setViewSelected, externalUse }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const [waitExport, setWaitExport] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Dictionary | undefined>({});
    
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [reportType, setReportType] = useState<string>('default');

    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);

    const filterChannel = useSelector ((state)=> state.main.mainAux)
    
    const cell = (props: CellProps<Dictionary>) => {// eslint-disable-next-line react/prop-types
        const column = props.cell.column;// eslint-disable-next-line react/prop-types
        const row = props.cell.row.original;
        return (
            <div onClick={() => {
                setSelectedRow(row);
                setOpenModal(true);
            }}>             
                {column.sortType === "datetime" && !!row[column.id] 
                ? convertLocalDate(row[column.id]).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                })// eslint-disable-next-line react/prop-types
                : row[column.id]}
            </div>
        )
    }
  
    const columns = React.useMemo(
        () => [                    
            {
                Header: t(langKeys.campaign),
                accessor: 'title',
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { title } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{title}</div>;
                },
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { description } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{description}</div>;
                },
            },
            {
                Header: t(langKeys.templatetype),
                accessor: 'templatetype',
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { templatetype } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{templatetype}</div>;
                },
            },
            {
                Header: t(langKeys.templatename),
                accessor: 'templatename',
                Cell: (props: CellProps<Dictionary>) => {
                    const { templatename } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{templatename}</div>;
                },
            },
            {
                Header: t(langKeys.channel),
                accessor: 'channel',
                groupedBy: false,  
                Cell: (props: CellProps<Dictionary>) => {
                    const { channel } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{channel}</div>;
                },
            },
            {
                Header: t(langKeys.rundate),
                accessor: 'rundate',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: CellProps<Dictionary>) => {
                    const { rundate } = props.cell.row.original || {};
                    return rundate ? new Date(rundate).toLocaleDateString() : null;
                },     
            },
            {
                Header: t(langKeys.executiontype_campaign),
                accessor: 'executiontype',
                NoFilter: false,
                groupedBy: false,  
                showColumn: true,     
                prefixTranslation: 'executiontype',
                Cell: (props: CellProps<Dictionary>) => {
                    const { executiontype } = props.cell.row.original || {};
                    return (
                        <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>
                            {executiontype !== undefined ? t(`executiontype_${executiontype}`).toUpperCase() : ''}
                        </div>
                    );
                },
            },                
            {
                Header: t(langKeys.executingUser),
                accessor: 'executionuser',
                NoFilter: false,
                groupedBy: false,  
                showColumn: true,   
                prefixTranslation: 'executionuser',
                Cell: (props: CellProps<Dictionary>) => {
                    const { executionuser } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{executionuser !== null ? t(`executionuser_${executionuser}`) : ''}</div>;
                },
            },
            {
                Header: t(langKeys.executingUserProfile),
                accessor: 'executionuserprofile',
                NoFilter: false,
                groupedBy: false,  
                showColumn: true,   
                prefixTranslation: 'executionuserprofile',
                Cell: (props: CellProps<Dictionary>) => {
                    const { executionuserprofile } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{executionuserprofile !== null ? t(`executionuserprofile_${executionuserprofile}`) : ''}</div>;
                },
            },
            {
                Header: t(langKeys.total),
                accessor: 'total',
                type: 'number',
                sortType: 'number',
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { total } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{total}</div>;
                },
            },
            {
                Header: t(langKeys.success),
                accessor: 'success',
                type: 'number',
                sortType: 'number',
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { success } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{success}</div>;
                },
            },
            {
                Header: t(langKeys.success_percent),
                accessor: 'successp',
                type: 'number',
                sortType: 'number',
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { successp } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{successp}</div>;
                },
            },
            {
                Header: t(langKeys.failed),
                accessor: 'fail',
                type: 'number',
                sortType: 'number',
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { fail } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{fail}</div>;
                },
            },
            {
                Header: t(langKeys.failed_percent),
                accessor: 'failp',
                type: 'number',
                sortType: 'number',
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { failp } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{failp}</div>;
                },
            },
            {
                Header: t(langKeys.attended),
                accessor: 'attended',
                type: 'number',
                sortType: 'number',
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { attended } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{attended}</div>;
                },
            },
            {
                Header: t(langKeys.locked),
                accessor: 'locked',
                type: 'number',
                sortType: 'number',
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { locked } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{locked}</div>;
                },
            },
            {
                Header: t(langKeys.blacklisted),
                accessor: 'blacklisted',
                type: 'number',
                sortType: 'number',  
                showColumn: true,            
                Cell: (props: CellProps<Dictionary>) => {
                    const { blacklisted } = props.cell.row.original || {};
                    return <div onClick={() => { setSelectedRow(props.cell.row.original); setOpenModal(true); }}>{blacklisted}</div>;
                },
            },
        ],
        []
    );

    const fetchData = ({ pageSize, pageIndex, filters, sorts }: IFetchData) => {
        dispatch(showBackdrop(true))
        setfetchDataAux({...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts }});
        dispatch(getCollectionPaginated(getCampaignReportPaginated(
            {
                startdate: dateRangeCreateDate.startDate,
                enddate: dateRangeCreateDate.endDate,
                channeltype: selectedChannel,
                sorts: sorts,
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
                Object.keys(selectedRows).reduce((ad: any[], d: any) => {
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
                Object.keys(selectedRows).reduce((ad: any[], d: any) => {
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
   
    //channel Filter ----------------------------------------------------------------------------------
    const channelTypeList = filterChannel.data || [];
    const channelTypeFilteredList = new Set();
    const [selectedChannel, setSelectedChannel] = useState("");

    const uniqueTypdescList = channelTypeList.filter(item => {
        if (channelTypeFilteredList.has(item.type)) {
            return false; 
        }
        channelTypeFilteredList.add(item.type);
        return true;
    });
   
    const fetchFiltersChannels = () => dispatch(getCollectionAux(getCommChannelLst()))

    //groupedBy  ----------------------------------------------------------------------------------
    type VisibleColumns2 = Record<string, boolean>;

    const storedVisibleColumns2 = localStorage.getItem('visibleColumns');

    const initialVisibleColumns2: VisibleColumns2 = storedVisibleColumns2
        ? JSON.parse(storedVisibleColumns2)
        : columns.reduce((acc, column) => {// eslint-disable-next-line react/prop-types
            acc[column.accessor] = false;
            return acc;
        }, {} as VisibleColumns2);


    const [visibleColumns2, setVisibleColumns2] = useState(initialVisibleColumns2);
    const [pendingChanges2, setPendingChanges2] = useState(initialVisibleColumns2);

    const handleToggleColumnVisibility2 = (columnName: keyof typeof visibleColumns2) => {
        setPendingChanges2((prevPendingChanges: typeof pendingChanges2) => ({
            ...prevPendingChanges,
            [columnName]: !prevPendingChanges[columnName],
        }));
    };

    const applyPendingChanges2 = () => {
        localStorage.setItem('visibleColumns', JSON.stringify(pendingChanges2));
        setVisibleColumns2(pendingChanges2);
        setShowColumnsModalOpen(false);
    };

    useEffect(() => {
        localStorage.setItem('visibleColumns', JSON.stringify(pendingChanges2));
    }, [pendingChanges2]);



    //showHide ----------------------------------------------------------------------------------
    const storedVisibleColumns = localStorage.getItem('visibleColumns');
    type VisibleColumns = Record<string, boolean>;
    const initialVisibleColumns: VisibleColumns = storedVisibleColumns
        ? JSON.parse(storedVisibleColumns)
        : columns.reduce((acc, column) => {// eslint-disable-next-line react/prop-types
            if (column.showColumn) {// eslint-disable-next-line react/prop-types
                acc[column.accessor] = true;
            }
    return acc;
    }, {} as VisibleColumns);

    const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);

    const handleToggleColumnVisibility = (columnName: keyof typeof visibleColumns) => {
        const updatedVisibleColumns = {
          ...visibleColumns,
          [columnName]: !visibleColumns[columnName],
        };
      
        localStorage.setItem('visibleColumns', JSON.stringify(updatedVisibleColumns));
        setVisibleColumns(updatedVisibleColumns);
    };    // eslint-disable-next-line react/prop-types
    const visibleColumnsList = columns.filter((column) => visibleColumns[column.accessor as keyof typeof visibleColumns]);


    //open close modals dialogs ----------------------------------------------------------------------------------
    const [anchorElSeButtons, setAnchorElSeButtons] = React.useState<null | HTMLElement>(null);
    const [openSeButtons, setOpenSeButtons] = useState(false);
    const [isGroupedByModalOpen, setGroupedByModalOpen] = useState(false);
    const [isShowColumnsModalOpen, setShowColumnsModalOpen] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({});
    const [columnGroupedBy, setColumnGroupedBy] = useState<string[]>([]);
    const [filterApplied, setFilterApplied] = useState(false);  


    const handleClickSeButtons = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElSeButtons(anchorElSeButtons ? null : event.currentTarget);
        setOpenSeButtons((prevOpen) => !prevOpen);
    };     

    const handleOpenGroupedByModal = () => {
        setGroupedByModalOpen(true);
        if (openSeButtons) {
            setAnchorElSeButtons(null);
            setOpenSeButtons(false);
        }
    };

    const handleOpenShowColumnsModal = () => {
        setShowColumnsModalOpen(true);
        if (openSeButtons) {
            setAnchorElSeButtons(null);
            setOpenSeButtons(false);
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!isGroupedByModalOpen && !isShowColumnsModalOpen && anchorElSeButtons && !anchorElSeButtons.contains(target)) {
                setAnchorElSeButtons(null);
                setOpenSeButtons(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isGroupedByModalOpen, isShowColumnsModalOpen, anchorElSeButtons, setOpenSeButtons]);

    

   
    return (
        <div style={{ width: '100%' }}>
            {!externalUse && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={t(langKeys.report)}
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
            </div>}
            {externalUse && <div style={{ height: 10 }}></div>}

            <div style={{ width: '100%', display: 'flex', background:'white', padding:'1rem 0 0 0'  }}>                 
                
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
                            {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
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
                <div>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        onClick={(event) => handleClickSeButtons(event)}
                        style={{ backgroundColor: openSeButtons ? '#F6E9FF' : undefined, color: openSeButtons ? '#7721AD' : undefined }}
                    >
                        <MoreVertIcon />
                    </IconButton>

                    <div style={{ display: 'flex', gap: 8 }}>                               
                        <Popper
                            open={openSeButtons}
                            anchorEl={anchorElSeButtons}
                            placement="bottom"
                            transition
                            style={{marginRight:'1rem'}}
                        >
                            {({ TransitionProps }) => (
                                <Paper {...TransitionProps} elevation={5}>                                   
                                    <MenuItem 
                                        style={{padding:'0.7rem 1rem', fontSize:'0.96rem'}}
                                        onClick={handleOpenShowColumnsModal}                                           
                                    >
                                        <ListItemIcon>
                                            <ViewWeekIcon fontSize="small" style={{ fill: 'grey', height:'25px' }}/>
                                        </ListItemIcon>
                                        <Typography variant="inherit">{t(langKeys.showHideColumns)}</Typography>
                                    </MenuItem>  

                                    <Divider /> 

                                    <MenuItem
                                        style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                        onClick={handleOpenGroupedByModal}
                                    >
                                        <ListItemIcon>
                                            <AllInboxIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                        </ListItemIcon>
                                        <Typography variant="inherit">{t(langKeys.groupedBy)}</Typography>
                                    </MenuItem>
                                  

                                </Paper>
                            )}
                        </Popper>
                    </div>    
                    {isGroupedByModalOpen && (
                        <DialogZyx 
                            open={isGroupedByModalOpen} 
                            title={t(langKeys.groupedBy)} 
                            buttonText1={t(langKeys.close)}
                            buttonText2={t(langKeys.apply) }
                            handleClickButton1={() => setGroupedByModalOpen(false)}                    
                            handleClickButton2={()=> setGroupedByModalOpen(false)}
                            maxWidth="sm"
                            buttonStyle1={{marginBottom:'0.3rem'}}
                            buttonStyle2={{marginRight:'1rem', marginBottom:'0.3rem'}}
                        >                     
                            <Grid container spacing={1} style={{ marginTop: '0.5rem' }}>
                                {columns // eslint-disable-next-line react/prop-types
                                    .filter((column) => column.groupedBy === false)
                                    .map((column) => ( // eslint-disable-next-line react/prop-types
                                    <Grid item xs={4} key={column.accessor}>
                                        <FormControlLabel
                                            style={{ pointerEvents: "none" }}
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    style={{ pointerEvents: "auto" }} // eslint-disable-next-line react/prop-types
                                                    checked={pendingChanges2[column.accessor]} // eslint-disable-next-line react/prop-types
                                                    onChange={() => handleToggleColumnVisibility2(column.accessor)} // eslint-disable-next-line react/prop-types
                                                    name={column.accessor}
                                                />
                                            } // eslint-disable-next-line react/prop-types
                                            label={t(column.Header)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </DialogZyx>
                    )} 
                     {isShowColumnsModalOpen && (
                            <DialogZyx 
                                open={isShowColumnsModalOpen}
                                title={t(langKeys.showHideColumns)}
                                buttonText1={t(langKeys.close)}
                                handleClickButton1={() => setShowColumnsModalOpen(false)}
                                maxWidth="sm"
                                buttonStyle1={{ marginBottom: '0.3rem' }}
                            >  
                                <Grid container spacing={1} style={{ marginTop: '0.5rem' }}>
                                    {columns // eslint-disable-next-line react/prop-types
                                        .filter((column) => column.showColumn === true)
                                        .map((column) => ( // eslint-disable-next-line react/prop-types
                                        <Grid item xs={4} key={column.accessor}>
                                            <FormControlLabel
                                                style={{ pointerEvents: "none" }}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        style={{ pointerEvents: "auto" }} // eslint-disable-next-line react/prop-types
                                                        checked={visibleColumns[column.accessor]} // eslint-disable-next-line react/prop-types
                                                        onChange={() => handleToggleColumnVisibility(column.accessor)} // eslint-disable-next-line react/prop-types
                                                        name={column.accessor}
                                                    />
                                                } // eslint-disable-next-line react/prop-types
                                                label={t(column.Header)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </DialogZyx>               
                        )}
                                        
                </div>                                                                                
            </div>
            
            <div style={{width:'100%', height:'100%'}}>       
                <TablePaginated
                    columns={visibleColumnsList}
                    data={mainPaginated.data}
                    totalrow={totalrow}
                    loading={mainPaginated.loading}
                    pageCount={pageCount}                    
                    fetchData={fetchData}               
                    download={false}
                    hoverShadow={false}
                    exportPersonalized={triggerExportData}
                    useSelection={true}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}             
                />
            </div>
            
            {openModal && <ModalReport
                openModal={openModal}
                setOpenModal={setOpenModal}
                row={selectedRow}
            />}
        </div>
    )
}

interface ModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => any;
    row: any;
}

const ModalReport: React.FC<ModalProps> = ({ openModal, setOpenModal, row }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const mainAux = useSelector(state => state.main.mainAux);
    const [waitView, setWaitView] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.contact),
                accessor: 'contact',
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
            },
            {
                Header: t(langKeys.log),
                accessor: 'log',
            }
        ],
        []
    );

    const handleCancelModal = () => {
        setOpenModal(false);
    }

    useEffect(() => {
        if (row !== null) {
            dispatch(getCollectionAux(getCampaignReportExport(
                [{
                    campaignid: row.id.split('_')[0],
                    rundate: row.id.split('_')[1],
                }]
            )))
            setWaitView(true);
            return () => {
                dispatch(resetMainAux());
            };
        }
    }, []);

    useEffect(() => {
        if (waitView) {
            if (!mainAux.loading && !mainAux.error) {
                setWaitView(false);
            }
        }
    }, [mainAux, waitView]);

    return (
        <DialogZyx
            maxWidth="md"
            open={openModal}
            title={`${row.title} ${convertLocalDate(row.rundate).toLocaleString()}`}
            button1Type="button"
            buttonText1={t(langKeys.close)}
            handleClickButton1={handleCancelModal}
        >
            <div className="row-zyx">
                <TableZyx
                    columns={columns}
                    data={mainAux.data}
                    loading={mainAux.loading}
                    filterGeneral={false}
                    download={false}
                />
            </div>
        </DialogZyx>
    )
}   