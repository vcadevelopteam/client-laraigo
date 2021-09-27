/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
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

























    const columns = React.useMemo(
        () => [
            {
                Header: 'N° Ticket',
                accessor: 'numeroticket'
            },
            {
                Header: 'Fecha',
                accessor: 'fecha'
            },
            {
                Header: 'G. inicial del ticket',
                accessor: 'firstusergroup'
            },
            {
                Header: 'Grupo del ticket',
                accessor: 'ticketgroup'
            },
            {
                Header: 'Canal',
                accessor: 'communicationchanneldescription'
            },
            {
                Header: 'Cliente',
                accessor: 'name'
            },
            {
                Header: 'ID persona canal',
                accessor: 'canalpersonareferencia'
            },
            {
                Header: 'Apertura',
                accessor: 'fechainicio'
            },
            {
                Header: 'Cierre',
                accessor: 'fechafin'
            },
            {
                Header: 'Primera comunicación',
                accessor: 'fechaprimeraconversacion'
            },
            {
                Header: 'Última conversación',
                accessor: 'fechaultimaconversacion'
            },
            {
                Header: 'Derivación',
                accessor: 'fechahandoff'
            },
            {
                Header: 'Asesor inicial',
                accessor: 'asesorinicial'
            },
            {
                Header: 'Asesor final',
                accessor: 'asesorfinal'
            },
            {
                Header: 'Supervisor',
                accessor: 'supervisor'
            },
            {
                Header: 'Empresa',
                accessor: 'empresa'
            },
            {
                Header: 'Grupos del asesor',
                accessor: 'attentiongroup'
            },
            {
                Header: 'Servicio',
                accessor: 'classification'
            },
            {
                Header: 'ART',
                accessor: 'tiempopromediorespuesta'
            },
            {
                Header: 'FRT',
                accessor: 'tiempoprimerarespuestaasesor'
            },
            {
                Header: 'ART Asesor',
                accessor: 'tiempopromediorespuestaasesor'
            },
            {
                Header: 'ART Cliente',
                accessor: 'tiempopromediorespuestapersona'
            },
            {
                Header: 'Duración total',
                accessor: 'duraciontotal'
            },
            {
                Header: 'Duración real',
                accessor: 'duracionreal'
            },
            {
                Header: 'Tiempo pausado',
                accessor: 'duracionpausa'
            },
            {
                Header: 'TMO Asesor',
                accessor: 'tmoasesor'
            },
            {
                Header: 'Primera asignación',
                accessor: 'tiempoprimeraasignacion'
            },
            {
                Header: 'Estado',
                accessor: 'estadoconversacion'
            },
            {
                Header: 'Tipo de cierre',
                accessor: 'tipocierre'
            },
            {
                Header: 'Tipificación',
                accessor: 'tipification'
            },
            {
                Header: 'Nombre o razón social',
                accessor: 'firstname'
            },
            {
                Header: 'Persona quien contacta',
                accessor: 'contact'
            },
            {
                Header: 'Apellidos',
                accessor: 'lastname'
            },
            {
                Header: 'Correo',
                accessor: 'email'
            },
            {
                Header: 'Teléfono',
                accessor: 'phone'
            },
            {
                Header: 'N° Balanceos',
                accessor: 'balancetimes'
            },
            {
                Header: 'Tipo de documento',
                accessor: 'documenttype'
            }
            ,
            {
                Header: 'N° Documento',
                accessor: 'dni'
            },
            {
                Header: 'Abandono',
                accessor: 'abandoned'
            },
            {
                Header: 'Consultas',
                accessor: 'enquiries'
            },
            {
                Header: 'Labels',
                accessor: 'labels'
            },
            {
                Header: 'TDA',
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
        
        console.log('allParameters', allParameters);
        console.log('fetchDataAux', fetchDataAux);

        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(getPaginatedTicket({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex,
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

        </div >
    )
}

export default Tickets;