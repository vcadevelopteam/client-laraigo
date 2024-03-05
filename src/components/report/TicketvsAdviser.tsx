import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getasesorvsticketsSel, getReportExport, getTicketvsAdviserExport } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanViewChange, exportData, getCollectionPaginated, resetMultiMain, setViewChange } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import TablePaginated from 'components/fields/table-paginated';
import { makeStyles } from '@material-ui/core/styles';
import { FieldSelect } from 'components';

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
    filterComponent: {
        minWidth: "220px",
        maxWidth: "260px",
    },  
}));

const TicketvsAdviser: FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiData);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [allParameters, setAllParameters] = useState<any>({});
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, distinct: {}, daterange: null })
    useEffect(() => {
        dispatch(setViewChange("report_ticketvsasesor"))
        return () => {
            dispatch(cleanViewChange());
        }
    }, [])
    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.ticket_number),
                accessor: 'numeroticket',               
            },
            {
                Header: t(langKeys.startDate),
                accessor: 'fechainicio',
            },
            {
                Header: t(langKeys.starttime),
                accessor: 'horainicio',
            },
            {
                Header: t(langKeys.advisor),
                accessor: 'asesor',              
                helpText: t(`report_loginhistory_advisor`),

            },
            {
                Header: t(langKeys.channel),
                accessor: 'canal',
                helpText: t(`report_loginhistory_channel`),
            },
            {
                Header: t(langKeys.type),
                accessor: 'tipo',
            },
            {
                Header: t(langKeys.submotive),
                accessor: 'submotivo',
            },
            {
                Header: t(langKeys.assessment),
                accessor: 'valoracion',
            },
            {
                Header: t(langKeys.closedby),
                accessor: 'cerradopor',
                helpText: t(`report_loginhistory_closedby`),               
            },
            {
                Header: t(langKeys.ticket_tipocierre),
                accessor: 'tipocierre',
                helpText: t(`report_loginhistory_closetype`),                
            },
            {
                Header: t(langKeys.dateoffirstreplytoadviser),
                accessor: 'fechaprimerarespuesta',
            },
            {
                Header: t(langKeys.timeoffirstreplytoadviser),
                accessor: 'horaprimerarespuesta',
            },
            {
                Header: t(langKeys.dateoflastreplytoadviser),
                accessor: 'fechaultimarespuesta',
            },
            {
                Header: t(langKeys.timeoflastreplytoadviser),
                accessor: 'horaultimarespuesta',
            },
            {
                Header: t(langKeys.closing_date),
                accessor: 'fechacierre',
            },
            {
                Header: t(langKeys.closing_time),
                accessor: 'horacierre',
            },
            {
                Header: t(langKeys.transactionoperationtype),
                accessor: 'tipo_operacion',
                showColumn: true,   
            },
            {
                Header: t(langKeys.operador),
                accessor: 'operador',
                showColumn: true,   
            },
            {
                Header: "Plan",
                accessor: 'plan',
                showColumn: true,   
            },
            {
                Header: t(langKeys.purchasemode),
                accessor: 'modalidad_compra',
                showColumn: true,   
            },
            {
                Header: t(langKeys.province),
                accessor: 'provincia',
                showColumn: true,   
            },
            {
                Header: t(langKeys.district),
                accessor: 'distrito',
                showColumn: true,   
            },
            {
                Header: t(langKeys.phone),
                accessor: 'telefono',
                showColumn: true,   
            },
            {
                Header: t(langKeys.document),
                accessor: 'documento',
                showColumn: true,   
            },
            
        ],
        [t]
    );
     
    useEffect(() => {
        return () => {
            dispatch(resetMultiMain());
        }
    }, [])
    useEffect(() => {
        if (!multiData.loading){
            dispatch(showBackdrop(false));
        }
    }, [multiData])

    const fetchData = ({ pageSize, pageIndex, filters, sorts, distinct, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, distinct, daterange })
        dispatch(getCollectionPaginated(getasesorvsticketsSel({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: {
                ...filters,
            },
            ...allParameters
        })))
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
    
    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated])

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = columns.map((x: Dictionary) => ({
            key: x.accessor,
            alias: x.Header,
        }));
        dispatch(
            exportData(
                getReportExport("UFN_REPORT_ASESOR_VS_TICKET_EXPORT", "ticketvsadviser", {
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

    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave])

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };

    return (
        <React.Fragment>
            <div style={{ height: 10 }}></div>
            <TablePaginated    
                columns={columns}
                data={mainPaginated.data}
                totalrow={totalrow}
                loading={mainPaginated.loading}
                pageCount={pageCount}
                showHideColumns={true}
                FiltersElement={                            
                    <FieldSelect                              
                        valueDefault={allParameters["channel"]}
                        label={t("report_reportvoicecall_filter_channels")}
                        className={classes.filterComponent}
                        key={"UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"}
                        variant="outlined"
                        loading={multiData.loading}
                        onChange={(value: any) => setValue("channel", value ? value["typedesc"] : "")}                                
                        data={
                            // multiData?.data[
                            //     multiData?.data?.findIndex(
                            //         (x) => x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"
                            //     )
                            // ]?.data
                            []
                        }
                        optionDesc={"type"}
                        optionValue={"typedesc"}
                    />                    
                }
                filterrange={true}
                download={true}
                fetchData={fetchData}
                filterGeneral={false}
                exportPersonalized={triggerExportData}
                register={false}         
            />            
        </React.Fragment>
    )
}

export default TicketvsAdviser;