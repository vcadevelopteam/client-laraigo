import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { delCampaign, getCampaignStatus, getCampaignStart, dateToLocalDate, todayDate, capitalize, stopCampaign, getCampaignOldLst } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, execute, getCollectionAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { CampaignDetail } from './CampaignDetail';
import { Blacklist } from './Blacklist';
import { ReportCampaign } from '../staticReports/reportCampaign/ReportCampaign';
import { IconButton, ListItemIcon } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import StopIcon from '@material-ui/icons/Stop';
import { formatDate} from 'common/helpers';
import { CellProps } from 'react-table';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
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
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                disabled={disabled}
                onClick={(e) => {
                    e.stopPropagation()
                    setAnchorEl(e.currentTarget)
                }}
            >
                <MoreVertIcon />
            </IconButton>
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

export const Campaign: FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const auxResult = useSelector(state => state.main.mainAux);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [waitStart, setWaitStart] = useState(false);
    const [waitStatus, setWaitStatus] = useState(false);
    const [waitStop, setWaitStop] = useState(false);

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
                NoFilter: false,
                width: 'auto',
                maxWidth: '200px'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: false,
                width: 'auto',
                maxWidth: '200px'
            },
            {
                Header: t(langKeys.startdate),
                accessor: 'startdate',
                NoFilter: false,
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
                NoFilter: false,
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
                NoFilter: false,
                prefixTranslation: 'status_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const status = row && row.original && row.original.status;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase();
                }
                
            },
            {
                Header: t(langKeys.datetimestart_campaign),
                accessor: 'datetimestart',
                NoFilter: false,
                prefixTranslation: 'datetimestart',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const datetimestart = row && row.original && row.original.datetimestart;
                    const formattedDate = formatDate(datetimestart, { withTime: true }) || '';
                    return formattedDate;
                }                
            },
            {
                Header: t(langKeys.executiontype_campaign),
                accessor: 'executiontype',
                NoFilter: false,
                prefixTranslation: 'executiontype',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const executiontype = row && row.original && row.original.executiontype;
                    return executiontype ? t(`executiontype_${executiontype}`).toUpperCase() : '';
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
                accessor: 'execute',
                isComponent: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    if (!row || !row.original) {
                        return null;
                    }
                
                    const { id, status, startdate, enddate } = row.original;
                
                    if (
                        dateToLocalDate(startdate, 'date') <= todayDate() &&
                        todayDate() <= dateToLocalDate(enddate, 'date')
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
                    } else {
                        return null;
                    }
                }
                
            },
        ],
        []
    )

    const fetchData = () => dispatch(getCollection(getCampaignOldLst()));

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

    const AdditionalButtons = () => {
        return (
            <React.Fragment>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={mainResult.mainData.loading}
                    // startIcon={<AddIcon color="secondary" />}
                    onClick={() => setViewSelected("blacklist")}
                    style={{ backgroundColor: "#ea2e49" }}
                ><Trans i18nKey={langKeys.blacklist} />
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={mainResult.mainData.loading}
                    // startIcon={<AddIcon color="secondary" />}
                    onClick={() => setViewSelected("report")}
                    style={{ backgroundColor: "#22b66e" }}
                ><Trans i18nKey={langKeys.report} />
                </Button>
            </React.Fragment>
        )
    }

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <TableZyx
                onClickRow={handleEdit}
                columns={columns}
                titlemodule={t(langKeys.campaign_plural, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                ButtonsElement={AdditionalButtons}
                handleRegister={handleRegister}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <CampaignDetail
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
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
            <ReportCampaign
                setViewSelected={setViewSelected}
            />
        )
    }
    else {
        return null
    }
}

export default Campaign