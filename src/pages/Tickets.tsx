/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
import { exportExcel, getCommChannelLst, getPaginatedPerson, getPaginatedTicket, getPersonExport, getTicketExport, getValuesFromDomain } from 'common/helpers';
import { getCollectionPaginated, exportData, getMultiCollection, resetMultiMain, resetCollectionPaginated } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import TablePaginated from 'components/fields/table-paginated';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { Dictionary, IFetchData } from '@types'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box/Box';
import { CalendarIcon, DownloadIcon, SearchIcon } from 'icons';
import Button from '@material-ui/core/Button/Button';
import { DateRangePicker, FieldMultiSelect } from 'components';
import { Range } from 'react-date-range';
import Link from '@material-ui/core/Link';
import { DialogInteractions } from 'components';
<<<<<<< HEAD
import { Checkbox } from '@material-ui/core';
=======
>>>>>>> f2939dc7b1c1b9334aa4a1fecc9e29c7d4de3530

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%'
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
    containerHeader: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    containerFilter: {
        width: '100%',
        marginBottom: theme.spacing(2),
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap'
    },
    filterComponent: {
        width: '220px'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    }
}));


const Tickets = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const dispatch = useDispatch();
    //const [dateRange, setdateRange] = useState<Range>({ startDate: new Date(new Date().setDate(0)), endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), key: 'selection' });
    //const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [allParameters, setAllParameters] = useState({});

    //const format = (date: Date) => date.toISOString().split('T')[0];

    
    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    }

/*
    useEffect(() => {
        setAllParameters({
            ...allParameters,
            startdate: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
            enddate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null
        });
    }, [dateRange]);
*/

    useEffect(() => {
        dispatch(getMultiCollection([
            getCommChannelLst(),
            getValuesFromDomain("GRUPOS")
        ]));

        return () => {
            dispatch(resetCollectionPaginated());
            dispatch(resetMultiMain());
        };
    }, []);






















    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleClickOpen = useCallback((row: any) => {
        setOpenModal(true);
        setRowSelected({ ...row, displayname: row.name, ticketnum: row.numeroticket })
    }, [mainResult]);

    const columns = React.useMemo(
        () => [
            {
                Header: (props: any) => {
                    //const row = props.cell.row.original;
                    return (
                        <Checkbox></Checkbox>
                    )
                },
                accessor: 'select',
                NoFilter: true,
                type: 'boolean',
                editable: true,
                
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <Checkbox></Checkbox>
                    )
                }
            },
            {
                Header: t(langKeys.ticket_numeroticket),
                accessor: 'numeroticket',
                NoFilter: false,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => handleClickOpen(row)}
                        >
                            {row.numeroticket}
                        </label>
                    )
                }
            },
            {
                Header: t(langKeys.ticket_fecha),
                accessor: 'fecha'
            },
            {
                Header: t(langKeys.ticket_firstusergroup),
                accessor: 'firstusergroup'
            },
            {
                Header: t(langKeys.ticket_ticketgroup),
                accessor: 'ticketgroup'
            },
            {
                Header: t(langKeys.ticket_communicationchanneldescription),
                accessor: 'communicationchanneldescription'
            },
            {
                Header: t(langKeys.ticket_name),
                accessor: 'name'
            },
            {
                Header: t(langKeys.ticket_canalpersonareferencia),
                accessor: 'canalpersonareferencia'
            },
            {
                Header: t(langKeys.ticket_fechainicio),
                accessor: 'fechainicio'
            },
            {
                Header: t(langKeys.ticket_fechafin),
                accessor: 'fechafin'
            },
            {
                Header: t(langKeys.ticket_fechaprimeraconversacion),
                accessor: 'fechaprimeraconversacion'
            },
            {
                Header: t(langKeys.ticket_fechaultimaconversacion),
                accessor: 'fechaultimaconversacion'
            },
            {
                Header: t(langKeys.ticket_fechahandoff),
                accessor: 'fechahandoff'
            },
            {
                Header: t(langKeys.ticket_asesorinicial),
                accessor: 'asesorinicial'
            },
            {
                Header: t(langKeys.ticket_asesorfinal),
                accessor: 'asesorfinal'
            },
            {
                Header: t(langKeys.ticket_supervisor),
                accessor: 'supervisor'
            },
            {
                Header: t(langKeys.ticket_empresa),
                accessor: 'empresa'
            },
            {
                Header: t(langKeys.ticket_attentiongroup),
                accessor: 'attentiongroup'
            },
            {
                Header: t(langKeys.ticket_classification),
                accessor: 'classification'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuesta),
                accessor: 'tiempopromediorespuesta'
            },
            {
                Header: t(langKeys.ticket_tiempoprimerarespuestaasesor),
                accessor: 'tiempoprimerarespuestaasesor'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuestaasesor),
                accessor: 'tiempopromediorespuestaasesor'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuestapersona),
                accessor: 'tiempopromediorespuestapersona'
            },
            {
                Header: t(langKeys.ticket_duraciontotal),
                accessor: 'duraciontotal'
            },
            {
                Header: t(langKeys.ticket_duracionreal),
                accessor: 'duracionreal'
            },
            {
                Header: t(langKeys.ticket_duracionpausa),
                accessor: 'duracionpausa'
            },
            {
                Header: t(langKeys.ticket_tmoasesor),
                accessor: 'tmoasesor'
            },
            {
                Header: t(langKeys.ticket_tiempoprimeraasignacion),
                accessor: 'tiempoprimeraasignacion'
            },
            {
                Header: t(langKeys.ticket_estadoconversacion),
                accessor: 'estadoconversacion'
            },
            {
                Header: t(langKeys.ticket_tipocierre),
                accessor: 'tipocierre'
            },
            {
                Header: t(langKeys.ticket_tipification),
                accessor: 'tipification'
            },
            {
                Header: t(langKeys.ticket_firstname),
                accessor: 'firstname'
            },
            {
                Header: t(langKeys.ticket_contact),
                accessor: 'contact'
            },
            {
                Header: t(langKeys.ticket_lastname),
                accessor: 'lastname'
            },
            {
                Header: t(langKeys.ticket_email),
                accessor: 'email'
            },
            {
                Header: t(langKeys.ticket_phone),
                accessor: 'phone'
            },
            {
                Header: t(langKeys.ticket_balancetimes),
                accessor: 'balancetimes'
            },
            {
                Header: t(langKeys.ticket_documenttype),
                accessor: 'documenttype'
            }
            ,
            {
                Header: t(langKeys.ticket_dni),
                accessor: 'dni'
            },
            {
                Header: t(langKeys.ticket_abandoned),
                accessor: 'abandoned'
            },
            {
                Header: t(langKeys.ticket_enquiries),
                accessor: 'enquiries'
            },
            {
                Header: t(langKeys.ticket_labels),
                accessor: 'labels'
            },
            {
                Header: t(langKeys.ticket_tdatime),
                accessor: 'tdatime'
            }
        ],
        []
    );



    /*
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated])


    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                window.open(resExportData.url, '_blank');
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave])

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        dispatch(exportData(getTicketExport({
            filters,
            sorts,
            startdate: daterange.startDate!,
            enddate: daterange.endDate!
        })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        
        console.log('allParameters', allParameters);

        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(getPaginatedTicket({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: filters,
        })))
    };
    */











    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated])

    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                window.open(resExportData.url, '_blank');
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave])

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        dispatch(exportData(getTicketExport({
            filters,
            sorts,
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            ...allParameters
        })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(getPaginatedTicket({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: filters,
            ...allParameters
        })))
    };





    return (
        <div className={classes.container}>

            <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                <span className={classes.title}>
                    {t(langKeys.ticket_plural)}
                </span>
            </Box>
            

            <Box width={1} paddingBottom={2} style={{ display: 'flex', flexWrap: 'wrap', gap: 15, alignItems: "flex-start", justifyContent: "flex-end" }}>
                <Button
                    //className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={mainPaginated.loading}
                    style={{ backgroundColor: 'red', width: 120 }}
                    //onClick={() => exportExcel((new Date().toISOString()), mainPaginated.data, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                    //startIcon={<DownloadIcon />}
                >{t(langKeys.ticket_close)}
                </Button>
                <Button
                    //className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={mainPaginated.loading}
                    style={{ backgroundColor: 'green', width: 120 }}
                    //onClick={() => exportExcel((new Date().toISOString()), mainPaginated.data, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                    //startIcon={<DownloadIcon />}
                >{t(langKeys.ticket_typify)}
                </Button>
                <Button
                    //className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={mainPaginated.loading}
                    style={{ backgroundColor: 'blue', width: 120 }}
                    //onClick={() => exportExcel((new Date().toISOString()), mainPaginated.data, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                    //startIcon={<DownloadIcon />}
                >{t(langKeys.ticket_reasign)}
                </Button>
            </Box>
            <Box width={1}>
                <Box className={classes.containerHeader} justifyContent="space-between" mb={1} alignItems="flex-start">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: "flex-start" }}>
                        {/*<DateRangePicker
                            open={openDateRangeModal}
                            setOpen={setOpenDateRangeModal}
                            range={dateRange}
                            onSelect={setdateRange}
                        >
                            <Button
                                disabled={mainPaginated.loading}
                                style={{ border: '2px solid #EBEAED', borderRadius: 4 }}
                                startIcon={<CalendarIcon />}
                                onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                            >
                                {format(dateRange.startDate!) + " - " + format(dateRange.endDate!)}
                            </Button>
                        </DateRangePicker>
                        */}

                        {mainResult?.multiData?.data[0]?.data &&
                            <FieldMultiSelect
                                label={t(langKeys.channel_plural)}
                                className={classes.filterComponent}
                                key="fieldMultiSelect_channel"
                                onChange={(value) => setValue("channel", value ? value.map((o: Dictionary) => o.communicationchannelid).join() : '')}
                                variant="outlined"
                                data={mainResult?.multiData?.data[0]?.data}
                                optionDesc="communicationchanneldesc"
                                optionValue="communicationchannelid"
                                disabled={mainPaginated.loading}
                            />
                        }

                        {mainResult?.multiData?.data[1]?.data &&
                            <FieldMultiSelect
                                label={t(langKeys.group_plural)}
                                className={classes.filterComponent}
                                key="fieldMultiSelect_group"
                                onChange={(value) => setValue("usergroup", value ? value.map((o: Dictionary) => o.domainvalue).join() : '')}
                                variant="outlined"
                                data={mainResult?.multiData?.data[1]?.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                disabled={mainPaginated.loading}
                            />
                        }
                        {/*
                            <Button
                                disabled={mainPaginated.loading}
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ backgroundColor: '#55BD84', width: 120 }}
                                onClick={() => {
                                    fetchData(fetchDataAux)
                                }}
                            >{t(langKeys.search)}
                            </Button>
                        */}

                    </div>

                    {/*
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={mainPaginated.loading}
                            onClick={() => exportExcel((new Date().toISOString()), mainPaginated.data, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                            startIcon={<DownloadIcon />}
                        >{t(langKeys.download)}
                        </Button>
                    */}

                </Box>
            </Box>




            <TablePaginated
                columns={columns}
                data={mainPaginated.data}
                totalrow={totalrow}
                loading={mainPaginated.loading}
                pageCount={pageCount}
                filterrange={true}
                download={true}
                fetchData={fetchData}
                exportPersonalized={triggerExportData}
            />


            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />

        </div >
    )
}

export default Tickets;