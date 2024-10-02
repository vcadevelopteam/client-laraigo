import React, { useEffect, useState } from "react";
import TablePaginated from "components/fields/table-paginated";
import { makeStyles } from "@material-ui/core/styles";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from "hooks";
import { Dictionary, IFetchData } from "@types";
import { getPaginatedForReports, getReportExport, convertLocalDate, getChatFlowCardId } from "common/helpers";
import { getCollectionPaginated, resetCollectionPaginated, exportData, resetMultiMain, getCollectionAux } from "store/main/actions";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { CellProps } from 'react-table';
import { Divider, Grid, ListItemIcon, MenuItem, Typography } from "@material-ui/core";
import { TemplateBreadcrumbs} from "components";
import TrafficIcon from '@material-ui/icons/Traffic';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import TableZyx from "components/fields/table-simple";
interface ItemProps {
    setViewSelected: (view: string) => void;
    setSearchValue: (searchValue: string) => void;
    row: Dictionary | null;
}

const getArrayBread = (nametmp: string, nameView1: string) => [
    { id: "view-1", name: nameView1 || "Reports" },
    { id: "view-2", name: nametmp },
];

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },  
    title: {
        fontSize: "22px",
        fontWeight: "bold",
        color: theme.palette.text.primary,
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },   
    textFieldCursor: {
        cursor: 'pointer',
        '&:hover': {
            cursor: 'pointer', 
        },
    }
}));

const InputRetryReport: React.FC<ItemProps> = ({ setViewSelected, setSearchValue }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const mainAux = useSelector((state) => state.main.mainAux);
    const resExportData = useSelector((state) => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [totalrow, settotalrow] = useState(0);   
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, distinct: {}, daterange: null });
    const [allParameters, ] = useState({});
    const [view, ] = useState("GRID");
    const [, setSelectedRow] = useState<Dictionary | undefined>({});  
    const [openRowDialog, setOpenRowDialog] = useState(false);
    const [openConfiDialog, setOpenConfigDialog] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [, setFetchDataAfterStateUpdate] = useState<boolean>(false);
    const [maxX, setMaxX] = useState<number>(2);
    const [maxY, setMaxY] = useState<number>(3);
    const [tempMaxX, setTempMaxX] = useState<number>(2);
    const [tempMaxY, setTempMaxY] = useState<number>(3);
    const [initialTempMaxX, setInitialTempMaxX] = useState<number>(2);
    const [initialTempMaxY, setInitialTempMaxY] = useState<number>(3);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');

    const cell = (props: CellProps<Dictionary>) => {// eslint-disable-next-line react/prop-types
        const column = props.cell.column;// eslint-disable-next-line react/prop-types
        const row = props.cell.row.original;
        return (
            <div onClick={() => {
                setSelectedRow(row);               
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
                Header: t(langKeys.flow),
                accessor: 'flow',  
                Cell: cell
            },
            {
                Header: t(langKeys.report_inputretry_question),
                accessor: 'question',   
                helpText: t(langKeys.report_inputretry_question_help),            
                Cell: cell     
            },
            {
                Header: t(langKeys.report_inputretry_maxX_additional, { maxX: maxX}),
                accessor: 'maxxattempts',              
                Cell: cell
            },
            {
                Header: t(langKeys.report_inputretry_maxY_additional, { mayY: maxY}),
                accessor: 'maxyattempts',                              
                Cell: cell
            },
            {
                Header: t(langKeys.report_inputretry_moreX_additional, { mayY: maxY}),
                accessor: 'moreyattempts',
                showGroupedBy: true,                             
                Cell: cell
            },         
        ],
        [maxX, maxY]
    );

    const dialogColumns = React.useMemo(
        () => [   
            {
                Header: t(langKeys.ticket),
                accessor: 'ticketnum',  
                Cell: cell
            },   
            {
                Header: t(langKeys.channel),
                accessor: 'channel',  
                Cell: cell
            }, 
            {
                Header: t(langKeys.person),
                accessor: 'name',  
                Cell: cell
            }, 
            {
                Header: t(langKeys.report_inputretry_datehour),
                accessor: 'createdate',  
                Cell: (props: CellProps<Dictionary>) => {
                    const { createdate } = props.cell.row.original || {};
                    return new Date(createdate).toLocaleString()
                }
            }, 
            {
                Header: t(langKeys.report_inputretry_answer),
                accessor: 'interactiontext', 
                helpText: t(langKeys.report_inputretry_answer_help),   
                Cell: cell
            }, 
            {
                Header: t(langKeys.report_inputretry_validAnswer),
                prefixTranslation: '',
                accessor: 'validinput',  
                Cell: ({ value }) => {
                    return t(value);
                }
            },  
                 
        ],
        []
    );    

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);  

    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code ?? "error_unexpected_error", {
                    module: t(langKeys.property).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave]);

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = columns.map((x: Dictionary) => ({
            key: x.accessor,
            alias: x.Header,
        }));
        dispatch(
            exportData(
                getReportExport("UFN_REPORT_INPUTRETRY_EXPORT", "inputretry", {
                    filters,
                    sorts,
                    startdate: daterange.startDate!,
                    enddate: daterange.endDate!,
                    ...allParameters,
                }),
                "",
                "excel",
                false,
                columnsExport
            )
        );
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };  

    const fetchDataAuxRow = (id: number) => {        
        dispatch (getCollectionAux(getChatFlowCardId({
            startdate: startdate,
            enddate: enddate,
            chatflowcardid: id,      
        })))
    }
     
    const handleMaxXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        if (value === '' || (Number.isInteger(parseInt(value)) && parseInt(value) >= 2)) {
            const newX = parseInt(value);
            setTempMaxX(newX);
            if (tempMaxY > newX) {
                setIsButtonDisabled(false);
            } else {
                setIsButtonDisabled(true);
            }
        }
    };
    
    const handleMaxYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        if (value === '' || (Number.isInteger(parseInt(value)) && parseInt(value) >= 3)) {
            const newY = parseInt(value);
            setTempMaxY(newY);
            if (newY > tempMaxX) {
                setIsButtonDisabled(false);
            } else {
                setIsButtonDisabled(true);
            }
        } 
    };

    const handleApplyButtonClick = () => {
        setMaxX(tempMaxX); setMaxY(tempMaxY);
        localStorage.setItem('maxX', tempMaxX.toString()); localStorage.setItem('maxY', tempMaxY.toString()); 
        setOpenConfigDialog(false); 
        setInitialTempMaxX(tempMaxX); 
        setFetchDataAfterStateUpdate(true);
        fetchData(fetchDataAux);
    };  

    const fetchData = ({ pageSize, pageIndex, filters, sorts, distinct, daterange }: IFetchData) => {
        if (daterange && daterange.startDate && daterange.endDate) {
            setStartDate(daterange.startDate);
            setEndDate(daterange.endDate);
        }    
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, distinct, daterange });    
        dispatch(
            getCollectionPaginated(
                getPaginatedForReports(
                    "UFN_REPORT_INPUTRETRY_SEL",
                    "UFN_REPORT_INPUTRETRY_TOTALRECORDS",
                    "inputretry",
                    {
                        startdate: daterange.startDate!,
                        enddate: daterange.endDate!,
                        take: pageSize,
                        skip: pageIndex * pageSize,
                        sorts,
                        filters: {},
                        maxx: tempMaxX, 
                        maxy: tempMaxY, 
                        ...allParameters,
                    }
                )
            )
        );      
    };
    
    const handleSelected = () => {
        dispatch(resetCollectionPaginated());
        dispatch(resetMultiMain());
        setSearchValue("");
        setViewSelected("view-1");
    };

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", {
                    module: t(langKeys.blacklist).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
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
    
    const handleOpenRowDialog = (question: Dictionary) => {        
        setSelectedQuestion(question.question);
        setOpenRowDialog(true);
        fetchDataAuxRow(question.chatflowcardid);
    };        
    const handleCloseRowDialog = () => {
        setOpenRowDialog(false);
    };    
    const handleOpenConfigDialog = () => {     
        setOpenConfigDialog(true);
    };  
 
    const handleFocus = (event: Dictionary) => {
        event.target.blur();
    };
  
    useEffect(() => {
        const savedMaxX = localStorage.getItem('maxX'); const savedMaxY = localStorage.getItem('maxY');
        if (savedMaxX) {
            setMaxX(parseInt(savedMaxX));
            setTempMaxX(parseInt(savedMaxX));
            setInitialTempMaxX(parseInt(savedMaxX)); 
        }
        if (savedMaxY) {
            setMaxY(parseInt(savedMaxY));
            setTempMaxY(parseInt(savedMaxY));
            setInitialTempMaxY(parseInt(savedMaxY)); 
        }
    }, []); 

    const handleCloseConfigDialog = () => {
        setOpenConfigDialog(false);
        setTempMaxX(initialTempMaxX); setTempMaxY(initialTempMaxY); 
    };  
   
    return (
        <div style={{ width: "100%", display: "flex", flex: 1, flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <TemplateBreadcrumbs
                    breadcrumbs={getArrayBread(t("report_" + "inputretry"), t(langKeys.report_plural))}
                    handleClick={handleSelected}
                />
            </div>

            <>
                {view === "GRID" && (
                    <TablePaginated
                        columns={columns}
                        data={mainPaginated.data}
                        totalrow={totalrow}
                        onClickRow={handleOpenRowDialog}
                        loading={mainPaginated.loading}
                        pageCount={pageCount}
                        filterrange={true}                        
                        FiltersElement={<></>}      
                        ExtraMenuOptions={
                            <MenuItem
                                style={{ padding: "0.7rem 1rem", fontSize: "0.96rem" }}
                                onClick={handleOpenConfigDialog}
                            >
                                <ListItemIcon>
                                    <TrafficIcon fontSize="small" style={{ fill: "grey", height: "25px" }} />
                                </ListItemIcon>
                                <Typography variant="inherit">{t(langKeys.configuration) }</Typography>
                            </MenuItem>
                        }
                        ButtonsElement={<></>}
                        download={true}
                        fetchData={fetchData}
                        exportPersonalized={triggerExportData}
                    />
                )}
                 <Dialog open={openRowDialog} onClose={handleCloseRowDialog} maxWidth="xl">
                    <DialogTitle>
                        <Trans i18nKey={langKeys.report_inputretry_question }/>: {selectedQuestion}
                        
                    </DialogTitle>
                    <DialogContent>                   
                        <TableZyx
                            columns={dialogColumns}
                            filterGeneral={false}
                            download={true}
                            data={mainAux.data}
                            totalrow={totalrow}                         
                            loading={mainAux.loading}    
                                               
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseRowDialog} color="primary" >
                            <Trans i18nKey={langKeys.return} />
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openConfiDialog}
                    fullWidth
                    maxWidth="sm"
                    style={{cursor: 'default'}}                 
                >
                    <DialogTitle>
                        <Trans i18nKey={langKeys.trafficlightconfig} />
                        <Typography variant="subtitle2" style={{marginBottom: '0.8rem'}}>
                            <Trans i18nKey={langKeys.limitsettings} />
                        </Typography>

                    </DialogTitle>
                    <DialogContent>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <div>
                                    <Typography variant="subtitle1">
                                        <Trans i18nKey={langKeys.report_inputretry_maxX} />
                                    </Typography>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1">X = </Typography>
                                        <TextField
                                            type="number"
                                            value={tempMaxX}
                                            onChange={handleMaxXChange}
                                            onFocus={handleFocus}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            style={{cursor: 'default'}}
                                        />
                                        
                                    </div>
                                   
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <Divider orientation="vertical" flexItem />
                                <div>
                                    <Typography variant="subtitle1">
                                        <Trans i18nKey={langKeys.report_inputretry_maxMoreY} />
                                    </Typography>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1">Y = </Typography>
                                        <TextField
                                            type="number"
                                            value={tempMaxY}
                                            onChange={handleMaxYChange}
                                            onFocus={handleFocus}
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            style={{cursor: 'default'}}
                                        />                                        
                                    </div>
                                    {isButtonDisabled && (
                                        <p style={{color: 'red'}}>Y no puede ser menor o igual a X</p>
                                    )}
                                </div>
                            </Grid>
                           
                        </Grid>                       
                    </DialogContent>
                    <DialogActions>                      
                       <div style={{marginTop: '1.2rem', marginRight: '0.5rem'}}>
                        <Button onClick={handleCloseConfigDialog} color="default">
                                <Trans i18nKey={langKeys.close} />
                            </Button>
                            <Button onClick={handleApplyButtonClick} color="primary" disabled={isButtonDisabled}>
                                <Trans i18nKey={langKeys.refresh} />
                            </Button>
                       </div>
                    </DialogActions>
                </Dialog>
            </>  
        </div>
    );
};

export default InputRetryReport;