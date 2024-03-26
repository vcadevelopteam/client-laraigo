import React, { useEffect, useState } from "react";
import TablePaginated from "components/fields/table-paginated";
import { makeStyles } from "@material-ui/core/styles";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from "hooks";
import { Dictionary, IFetchData } from "@types";
import { getPaginatedForReports, getReportExport, convertLocalDate } from "common/helpers";
import { getCollectionPaginated, resetCollectionPaginated, exportData, resetMultiMain } from "store/main/actions";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { CellProps } from 'react-table';
import { Divider, Grid, ListItemIcon, MenuItem, Typography } from "@material-ui/core";
import { TemplateBreadcrumbs} from "components";
import TrafficIcon from '@material-ui/icons/Traffic';
import { Range } from "react-date-range";
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
}));

const InputRetryReport: React.FC<ItemProps> = ({ setViewSelected, setSearchValue, row }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const resExportData = useSelector((state) => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);   
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({
        pageSize: 0,
        pageIndex: 0,
        filters: {},
        sorts: {},
        distinct: {},
        daterange: null,
    });
    const [allParameters, setAllParameters] = useState({});
    const [view, ] = useState("GRID");
    const [, setSelectedRow] = useState<Dictionary | undefined>({});
    const [state, setState] = useState({ checkedA: false, checkedB: false });
    const [checkedA, setcheckedA] = useState(false);

    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection",
    });

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
                Header: t(langKeys.report_inputretry_maxX),
                accessor: 'maxxattempts',              
                Cell: cell
            },
            {
                Header: t(langKeys.report_inputretry_maxY),
                accessor: 'maxyattempts',                              
                Cell: cell
            },
            {
                Header: t(langKeys.report_inputretry_moreX),
                accessor: 'moreyattempts',
                showGroupedBy: true,                             
                Cell: cell
            },         
        ],
        []
    );

    const dialogColumns = React.useMemo(
        () => [   
            {
                Header: t(langKeys.ticket),
                accessor: 'flow',  
                Cell: cell
            },   
            {
                Header: t(langKeys.channel),
                accessor: 'channel',  
                Cell: cell
            }, 
            {
                Header: t(langKeys.person),
                accessor: 'moreyattempts',  
                Cell: cell
            }, 
            {
                Header: t(langKeys.report_inputretry_datehour),
                accessor: 'maxyattempts ',  
                Cell: cell
            }, 
            {
                Header: t(langKeys.report_inputretry_answer),
                accessor: 'question', 
                helpText: t(langKeys.report_inputretry_answer_help),   
                Cell: cell
            }, 
            {
                Header: t(langKeys.report_inputretry_validAnswer),
                accessor: 'maxxattempts',  
                Cell: cell
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

    const fetchData = ({ pageSize, pageIndex, filters, sorts, distinct, daterange }: IFetchData) => {
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
                        sorts: sorts,
                        filters: { },
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

    const [waitExport, setWaitExport] = useState(false);

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

    const [openRowDialog, setOpenRowDialog] = useState(false);
    const [openConfiDialog, setOpenConfigDialog] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [maxX, setMaxX] = useState<number>(1);
    const [maxY, setMaxY] = useState<number>(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [inputError, setInputError] = useState<string>('');
    
    const handleOpenRowDialog = (question: string) => {
        setSelectedQuestion(question);
        setOpenRowDialog(true);
    };    
    const handleCloseRowDialog = () => {
        setOpenRowDialog(false);
    };    
    const handleOpenConfigDialog = () => {     
        setOpenConfigDialog(true);
    };    
    const handleCloseConfigDialog = () => {
        setOpenConfigDialog(false);
    };
    
    const handleMaxXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        if (value === '' || (Number.isInteger(parseInt(value)) && parseInt(value) >= 1)) {
            setMaxX(parseInt(value));
            localStorage.setItem('maxX', value);
            setInputError('');
            if ((value === '' || !isNaN(parseInt(maxY))) && (maxY === '' || Number.isInteger(parseInt(maxY)))) {
                setIsButtonDisabled(false);
            }
        } else {
            setInputError('Input no válido');
            setIsButtonDisabled(true);
        }
        console.log('Nuevo valor X:', value);
    };
    
    const handleMaxYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        if (value === '' || (Number.isInteger(parseInt(value)) && parseInt(value) >= 1)) {
            setMaxY(parseInt(value));
            localStorage.setItem('maxY', value);
            setInputError('');
            if ((value === '' || !isNaN(parseInt(maxX))) && (maxX === '' || Number.isInteger(parseInt(maxX)))) {
                setIsButtonDisabled(false);
            }
        } else {
            setInputError('Input no válido');
            setIsButtonDisabled(true);
        }
        console.log('Nuevo valor Y:', value);
    };
    
    useEffect(() => {
        const savedMaxX = localStorage.getItem('maxX');
        const savedMaxY = localStorage.getItem('maxX');
        if (savedMaxX) {
            setMaxX(parseInt(savedMaxX));
        }
        if (savedMaxY) {
            setMaxY(parseInt(savedMaxY));
        }
    }, []);
    
    

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
                        <Trans i18nKey={langKeys.report_inputretry_question }/>: {selectedQuestion ? selectedQuestion.question : ''}

                    </DialogTitle>
                    <DialogContent>
                        <TableZyx
                            columns={dialogColumns}
                            filterGeneral={false}
                            download={true}
                            data={mainPaginated.data}
                            totalrow={totalrow}
                            onClickRow={handleOpenRowDialog}
                            loading={mainPaginated.loading}     
                                               
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseRowDialog} color="primary" disabled={isButtonDisabled}>
                            <Trans i18nKey={langKeys.return} />
                        </Button>
                    </DialogActions>

                </Dialog>



                <Dialog
                    open={openConfiDialog}
                    onClose={handleCloseConfigDialog}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        <Trans i18nKey={langKeys.trafficlightconfig} />
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
                                            value={maxX}
                                            onChange={handleMaxXChange}
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
                                            value={maxY}
                                            onChange={handleMaxYChange}
                                        />
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        {inputError && (
                            <Typography variant="body2" color="error" style={{ marginTop: '0.5rem' }}>
                                {inputError}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfigDialog} color="primary">
                            <Trans i18nKey={langKeys.return} />
                        </Button>
                    </DialogActions>
                </Dialog>



            </>


           
               
        </div>
    );
};


export default InputRetryReport;