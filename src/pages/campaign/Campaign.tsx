import React, { FC, useEffect, useMemo, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { getCampaignLst, delCampaign, getCampaignStatus, getCampaignStart, dateToLocalDate, todayDate, capitalize, stopCampaign, exportExcel, exportExcelCustom } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import TableZyx from '../../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, execute, getCollectionAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { CampaignDetail } from './CampaignDetail';
import { Blacklist } from './Blacklist';
import { CampaignReport } from '../staticReports/ReportCampaign';
import { Box,  Divider, IconButton, ListItemIcon, Paper, Popper, Typography } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import StopIcon from '@material-ui/icons/Stop';
import { formatDate} from 'common/helpers';
import { CellProps } from 'react-table';
import AddIcon from '@material-ui/icons/Add';
import { DateRangePicker, TemplateBreadcrumbs } from 'components';
import { CalendarIcon } from 'icons';
import { Range } from "react-date-range";
import { Search as SearchIcon } from '@material-ui/icons';
import { ViewColumn as ViewColumnIcon, ViewList as ViewListIcon, AccessTime as AccessTimeIcon, Note as NoteIcon, Sms as SmsIcon, Mail as MailIcon} from '@material-ui/icons';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import BlockIcon from '@material-ui/icons/Block';
import { getDateCleaned } from 'common/helpers';
import CommentIcon from '@material-ui/icons/Comment';
import { DownloadIcon } from 'icons';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

  interface ColumnTmp {
    Header: string;
    accessor: string;
    prefixTranslation?: string;
    type?: string;
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
    buttonProgrammed: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        backgroundColor: '#efe4b0'
    },
    containerHeader: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    titleandcrumbs: {
        marginBottom: 4,
        marginTop: 4,
    },
}));

const IconOptions: React.FC<{
    disabled?: boolean,
    onHandlerDelete?: (e?: any) => void;
}> = ({ disabled, onHandlerDelete }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { t } = useTranslation();

    const handleClose = (e: any) => {
        e.stopPropagation()
        setAnchorEl(null)
    };
    return (
        <>
           
            <Menu
                id="menu-appbar"
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
                {onHandlerDelete &&
                    <MenuItem onClick={(e: any) => {
                        e.stopPropagation()
                        setAnchorEl(null);
                        onHandlerDelete();
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.delete)}
                    </MenuItem>
                }
            </Menu>
        </>
    )
}

type BreadCrumb = {
    id: string,
    name: string
}
interface CampaignProps {
    arrayBread: BreadCrumb[];
    setAuxViewSelected: (view: string) => void;  
}

const Campaign: React.FC<CampaignProps> = ({ 
    setAuxViewSelected,
    arrayBread,
}) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const auxResult = useSelector(state => state.main.mainAux);
    const executeResult = useSelector(state => state.main.execute);
    const newArrayBread = [
        ...arrayBread,
        { id: "campaigns", name: t(langKeys.app_campaign) },
    ];

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [waitStart, setWaitStart] = useState(false);
    const [waitStatus, setWaitStatus] = useState(false);
    const [waitStop, setWaitStop] = useState(false);
    const selectionKey = "id";    
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected((p) =>
                Object.keys(selectedRows).map(
                    (x) =>
                        mainResult.mainData?.data.find((y) => y.id === parseInt(x)) ??
                        p.find((y) => y.id === parseInt(x)) ??
                        {}
                )
            );
        }
    }, [selectedRows]);

    const handleDeleteSelection = async (dataSelected: Dictionary[]) => {
        const callback = async () => {
            dispatch(showBackdrop(true));       
            dataSelected.map(async (row) => {     
                dispatch(execute(delCampaign({ ...row, operation: 'DELETE', status: 'ELIMINADO', type: "NINGUNO", id: row.id })));
            });
            setWaitSave(true);
        }
        
        dispatch(
            manageConfirmation({
              visible: true,
              question: t(langKeys.confirmation_delete_all),
              callback,
            })
        );
    };


    const columns = React.useMemo(
        () => [
            {
                accessor: 'id',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <IconOptions
                            onHandlerDelete={() => {
                                handleDelete(row)
                            }}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.campaign),
                accessor: 'title',
                width: '200px',               
                
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: '200px',               
            },
            {
                Header: t(langKeys.channel),
                accessor: 'communicationchannel',
                width: '250px',               
            },
            {
                Header: t(langKeys.startdate),
                accessor: 'startdate',              
                width: '200px',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <div>{row && row.startdate ? dateToLocalDate(row.startdate) : ''}</div>
                    );
                }
                
            },
            {
                Header: t(langKeys.enddate),
                accessor: 'enddate',             
                width: '200px',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <div>{row && row.enddate ? dateToLocalDate(row.enddate) : ''}</div>
                    );
                }                
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',              
                prefixTranslation: 'status_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const status = row && row.original && row.original.status;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase();
                }
                
            },
            {
                Header: 'Fecha de Ejecución',
                accessor: 'datestart',             
                width: '200px',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <div>{row && row.datestart ? dateToLocalDate(row.datestart) : ''}</div>
                    );
                }                
            },
            {
                Header: 'Hora de Ejecución',
                accessor: 'hourstart',             
                width: 'auto'                         
            },
            {
                Header: t(langKeys.executiontype_campaign),
                accessor: 'executiontype',              
                prefixTranslation: 'executiontype',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const executiontype = row && row.original && row.original.executiontype;
                    return executiontype ? t(`${executiontype}`).toUpperCase() : '';
                }                
            },
            {
               
                accessor: 'stop',
                isComponent: true,
                maxWidth: '80px',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    if (row?.status === 'EJECUTANDO') {
                        return <StopIcon
                            titleAccess={t(langKeys.stop)}
                            fontSize='large'
                            style={{ width:35, height:35, fill: '#ea2e49' }}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleStop(row)
                            }}
                        />
                    }
                    else {
                        return null
                    }
                }
            },
            {
                Header: t(langKeys.action),
                accessor: 'execute',
                isComponent: true,
                width:'150px',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    if (!row || !row.original) {
                        return null;
                    }
                
                    const { id, status, startdate, enddate,executiontype, datestart, hourstart, communicationchannel  } = row.original;
                
                    if (
                        communicationchannel &&
                        dateToLocalDate(startdate, 'date') <= todayDate() &&
                        todayDate() <= dateToLocalDate(enddate, 'date') && executiontype ==="MANUAL"
                    ) {
                        if (status === 'EJECUTANDO') {
                            return (
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatus(id);
                                    }}
                                    style={{ backgroundColor: "#55bd84" }}
                                >
                                    <Trans i18nKey={langKeys.status} />
                                </Button>
                            );
                        } else if (status === 'ACTIVO') {
                            return (
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStart(id);
                                    }}
                                    style={{ backgroundColor: "#55bd84" }}
                                >
                                    <Trans i18nKey={langKeys.execute} />
                                </Button>
                            );
                        } else {
                            return null;
                        }
                    } else if ((status === "EJECUTANDO")) {
                        return (
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(showSnackbar({ show: true, severity: "success", message: `Campaña ya programada el ${datestart}, a las ${hourstart}`}));
                                }}
                                style={{ backgroundColor: "#EFE4B0" }}
                            >
                                <Trans i18nKey={langKeys.programmed} />
                            </Button>
                        );
                    } else{
                        return null
                    }
                }
                
            },
        ],
        []
    )

    const columnsExcel : ColumnTmp[] = [
        { Header: 'Campaña', accessor: 'title' },
        { Header: 'Descripción', accessor: 'description' },
        { Header: 'Canal', accessor: 'communicationchannel' },
        { Header: 'Fecha de Inicio', accessor: 'startdate' },
        { Header: 'Fecha de Fin', accessor: 'enddate' },
        { Header: 'Estado', accessor: 'status' },
        { Header: 'Fecha y hora de ejecución', accessor: 'datetimestart' },
        { Header: 'Tipo de ejecución', accessor: 'executiontype' },
    ];

    const fetchData = () => dispatch(getCollection(getCampaignLst(
        dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : "",
        dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : "",
    )));
    
    const handleStatus = (id: number) => {
        if (!waitStatus) {
            dispatch(getCollectionAux(getCampaignStatus(id)));
            setWaitStatus(true);
        }
    }

    const handleStart = (id: number) => {
        if (!waitStart) {
            dispatch(getCollectionAux(getCampaignStart(id)));
            setWaitStart(true);
        }
    }  

    useEffect(() => {
        fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
        if (waitStop) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitStop(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitStop(false);
            }
        }
    }, [executeResult, waitSave, waitStop]);

    useEffect(() => {
        if (waitStatus) {
            if (!auxResult.loading && !auxResult.error) {
                const { status, enviado, total } = auxResult.data[0];
                if (status === 'EJECUTANDO') {
                    dispatch(showSnackbar({ show: true, severity: "success", message: `${(t(`status_${status}`.toLowerCase()) || "").toUpperCase()}: ${t(langKeys.sent)} ${enviado}/${total}` }))
                    setWaitStatus(false);
                }
                else if (status === 'ACTIVO') {
                    dispatch(showSnackbar({ show: true, severity: "success", message: `${capitalize(t(langKeys.sent))}` }))
                    fetchData();
                    setWaitStatus(false);
                }
            } else if (auxResult.error) {
                const errormessage = t(auxResult.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitStatus(false);
            }
        }
        if (waitStart) {
            if (!auxResult.loading && !auxResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                fetchData();
                setWaitStart(false);
            } else if (auxResult.error) {
                const errormessage = t(auxResult.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitStart(false);
            }
        }
    }, [auxResult, waitStatus, waitStart])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleEdit = (row: Dictionary) => {
        if (row.status === 'EJECUTANDO') {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.campaign_in_execution) }));
        }
        else {
            setViewSelected("view-2");
            setRowSelected({ row, edit: true });
        }
    }

    const handleDelete = (row: Dictionary) => {
        if (row.status === 'EJECUTANDO') {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.campaign_in_execution) }));
        }
        else {
            const callback = () => {
                dispatch(execute(delCampaign({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
                dispatch(showBackdrop(true));
                setWaitSave(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_delete),
                callback
            }))
        }
    }

    const handleStop = (row: Dictionary) => {
        if (row.status === 'EJECUTANDO') {
            const callback = () => {
                dispatch(execute(stopCampaign({ campaignid: row.id })));
                dispatch(showBackdrop(true));
                setWaitStop(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_stop),
                callback
            }))
        }
    }




    const [anchorElSeButtons, setAnchorElSeButtons] = React.useState<null | HTMLElement>(null);
    const [openSeButtons, setOpenSeButtons] = useState(false);
    const open = Boolean(anchorElSeButtons);


    const handleClickSeButtons = (event: any) => {
        setAnchorElSeButtons(event.currentTarget);      
    };

    const handleCloseSeButtons = () => {
        setAnchorElSeButtons(null);     
    };
    
    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (anchorElSeButtons && !anchorElSeButtons.contains(event.target as Node)) {
            handleCloseSeButtons();
        }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside);};}, [anchorElSeButtons]);    

    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const format = (date: Date) => date.toISOString().split("T")[0];

    const [detailCustomReport, setDetailCustomReport] = useState<{
        loading: boolean;
        data: Dictionary[];
    }>({
        loading: false,
        data: [],
    });

    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection",
    });

    const handleDownload = () => {
        if (mainResult && mainResult.mainData && mainResult.mainData.data) {
            const csvData = mainResult.mainData.data.map((item: Dictionary) => {
                const formattedItem: Dictionary = {
                    title: item.title,
                    description: item.description,
                    communicationchannel: item.communicationchannel,
                    startdate: item.startdate ? dateToLocalDate(item.startdate) : '',
                    enddate: item.enddate ? dateToLocalDate(item.enddate) : '',
                    status: item.status,
                    datetimestart: item.datetimestart ? formatDate(item.datetimestart, { withTime: true }) : '',
                    executiontype: item.executiontype,
                };
                return formattedItem;
            });

            exportExcelCustom('CampañasReport', csvData, columnsExcel);
        }
    };

    const gotoReport = () => {
        if (viewSelected === "report") {
            return (
                <CampaignReport
                    setViewSelected={setViewSelected}
                />
            )
        }
    };


    const modifiedData = useMemo(() => {
        return mainResult.mainData.data.map((item: any) => ({
          ...item,
          executiontype: item.executiontype === "SCHEDULED" ? "PROGRAMADO" : item.executiontype
        }));
      }, [mainResult.mainData.data]);
    

    const AdditionalButtons = () => {
        return (
            <React.Fragment>        
                <div style={{ display: "flex", backgroundColor: 'white', padding: '0.5rem 0' }}>
                    <Box width={1}>
                        <Box
                            className={classes.containerHeader}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <DateRangePicker
                                        open={openDateRangeModal}
                                        setOpen={setOpenDateRangeModal}
                                        range={dateRange}
                                        onSelect={setdateRange}
                                    >
                                        <Button
                                            disabled={detailCustomReport.loading}
                                            style={{ border: "1px solid #bfbfc0", borderRadius: 4, color: "rgb(143, 146, 161)" }}
                                            startIcon={<CalendarIcon />}
                                            onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                                        >
                                            {getDateCleaned(dateRange.startDate!) + " - " + getDateCleaned(dateRange.endDate!)}
                                        </Button>
                                    </DateRangePicker>

                                    <Button
                                        disabled={mainResult.mainData.loading}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                                        style={{ width: 120, backgroundColor: "#55BD84" }}
                                        onClick={fetchData}
                                    >
                                        {t(langKeys.search)}
                                    </Button>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type='button'
                                        disabled={mainResult.mainData.loading || Object.keys(selectedRows).length === 0}
                                        startIcon={<DeleteIcon color="secondary" />}
                                        onClick={() => {
                                            handleDeleteSelection(rowWithDataSelected);
                                        }}
                                        style={{
                                            backgroundColor: mainResult.mainData.loading || Object.keys(selectedRows).length === 0 ? undefined : "#FB5F5F"
                                        }}
                                    >
                                        <Trans i18nKey={langKeys.delete} />
                                    </Button>

                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        disabled={mainResult.mainData.loading}
                                        startIcon={<AddIcon color="secondary" />}
                                        onClick={() => handleRegister()}
                                        style={{ backgroundColor: "#22b66e" }}
                                    >
                                        <Trans i18nKey={langKeys.register} />
                                    </Button>

                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"  
                                        disabled={mainResult.mainData.loading}                            
                                        startIcon={<DownloadIcon />}
                                        onClick={handleDownload}                                       
                                    >
                                        <Trans i18nKey={langKeys.download} />
                                    </Button>

                                    <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        onClick={handleClickSeButtons}
                                        style={{ backgroundColor: openSeButtons ? '#F6E9FF' : undefined, color: openSeButtons ? '#7721AD' : undefined }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>

                                    <Menu
                                        id="long-menu"
                                        anchorEl={anchorElSeButtons}
                                        open={open}
                                        onClose={handleCloseSeButtons}
                                        PaperProps={{
                                            style: {
                                                maxHeight: 48 * 4.5,
                                                width: '16ch',
                                                marginTop: '3.5rem'
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            disabled={mainResult.mainData.loading}
                                            style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                            onClick={(e) => { setViewSelected("blacklist"); e.stopPropagation(); }}
                                        >
                                            <ListItemIcon>
                                                <BlockIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                            </ListItemIcon>
                                            <Typography variant="inherit">{t(langKeys.blacklist)}</Typography>
                                        </MenuItem>

                                        <Divider />
                                       
                                        <Divider />
                                        <a style={{ textDecoration: 'none', color: 'inherit' }}  onClick={() => setViewSelected("report")}>
                                            <MenuItem
                                                disabled={mainResult.mainData.loading}
                                                style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                            >
                                                <ListItemIcon>
                                                    <CommentIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                                </ListItemIcon>
                                                <Typography variant="inherit">Reporte</Typography>
                                            </MenuItem>
                                        </a>
                                    </Menu>
                                </div>
                            </div>
                        </Box>
                    </Box>
                </div>  
            </React.Fragment>
        )
    }

    const functionChange = (change:string) => {
        if(change === "campaigns") {
            setViewSelected("view-1")
        }else{
            setAuxViewSelected(change);
        }
    }

    if (viewSelected === "view-1") {
        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }
        return (
           <div style={{display:'block', width:'100%'}}>
                <div className={classes.titleandcrumbs}>
                    <div style={{ flexGrow: 1}}>
                        <TemplateBreadcrumbs
                            breadcrumbs={newArrayBread}
                            handleClick={functionChange}
                        />
                    </div>
                    <div style={{fontWeight: 'bold', fontSize: 22}}>{t(langKeys.campaign_plural)}</div>
                </div>
                <TableZyx      
                    columns={columns}
                    data={modifiedData}             
                    useSelection={true}
                    setSelectedRows={setSelectedRows}
                    selectionKey={selectionKey}
                    heightWithCheck={51}
                    onClickRow={handleEdit}
                    loading={mainResult.mainData.loading}                
                    ButtonsElement={AdditionalButtons}     
                    filterGeneral={false}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <CampaignDetail
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                handleStart={handleStart}
            />
        )
    }
    else if (viewSelected === "blacklist") {
        return (
            <Blacklist
                setViewSelected={setViewSelected}
            />
        )
    }
    else if (viewSelected === "report") {
        return (
            <CampaignReport
                setViewSelected={setViewSelected}
            />
        )
    }
    else {
        return null
    }
}

export default Campaign