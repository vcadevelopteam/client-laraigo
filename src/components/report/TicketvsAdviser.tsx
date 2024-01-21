import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getasesorvsticketsSel, getTicketvsAdviserExport } from 'common/helpers';
import { IFetchData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanViewChange, exportData, getCollectionPaginated, resetMultiMain, setViewChange } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import TablePaginated from 'components/fields/table-paginated';


const TicketvsAdviser: FC = () => {
    // const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiData);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
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
            },
            {
                Header: t(langKeys.channel),
                accessor: 'canal',
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
            },
            {
                Header: t(langKeys.ticket_tipocierre),
                accessor: 'tipocierre',
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
            },
            {
                Header: t(langKeys.operador),
                accessor: 'operador',
            },
            {
                Header: "Plan",
                accessor: 'plan',
            },
            {
                Header: t(langKeys.purchasemode),
                accessor: 'modalidad_compra',
            },
            {
                Header: t(langKeys.province),
                accessor: 'provincia',
            },
            {
                Header: t(langKeys.district),
                accessor: 'distrito',
            },
            {
                Header: t(langKeys.phone),
                accessor: 'telefono',
            },
            {
                Header: t(langKeys.document),
                accessor: 'documento',
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

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(getasesorvsticketsSel({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: {
                ...filters,
            },
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
        const columnsExport = columns.map(x => ({
            key: x.accessor,
            alias: x.Header,
        }));
        dispatch(exportData(getTicketvsAdviserExport(
            {
                startdate: daterange.startDate!,
                enddate: daterange.endDate!,
                sorts,
                filters: filters,
            }), "", "excel", false, columnsExport));
        dispatch(showBackdrop(true));
        setWaitExport(true);
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


    return (
        <React.Fragment>
            <div style={{ height: 10 }}></div>
            <TablePaginated    
                columns={columns}
                data={mainPaginated.data}
                totalrow={totalrow}
                loading={mainPaginated.loading}
                pageCount={pageCount}
                FiltersElement={<></>}
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
