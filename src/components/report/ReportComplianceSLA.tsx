/* eslint-disable react-hooks/exhaustive-deps */
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


const ReportComplianceSLA: FC = () => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const columns = React.useMemo(
        () => [
            {
                Header: "#",
                accessor: 'numeroticket',
            },
            {
                Header: t(langKeys.sdrequestcode),
                accessor: 'fechainicio',
            },
            {
                Header: t(langKeys.type),
                accessor: 'horainicio',
            },
            {
                Header: t(langKeys.billingsetup_service),
                accessor: 'asesor',
            },
            {
                Header: t(langKeys.applicant),
                accessor: 'canal',
            },
            {
                Header: t(langKeys.business),
                accessor: 'tipo',
            },
            {
                Header: t(langKeys.resume),
                accessor: 'submotivo',
            },
            {
                Header: t(langKeys.urgency),
                accessor: 'valoracion',
            },
            {
                Header: t(langKeys.impact),
                accessor: 'cerradopor',
            },
            {
                Header: t(langKeys.priority),
                accessor: 'tipocierre',
            },
            {
                Header: t(langKeys.registrationdate),
                accessor: 'fechaprimerarespuesta',
            },
            {
                Header: t(langKeys.firstContactDate),
                accessor: 'horaprimerarespuesta',
            },
            {
                Header: t(langKeys.firstcontactcompliance),
                accessor: 'fechaultimarespuesta',
            },
            {
                Header: t(langKeys.firstContactDatedeadline),
                accessor: 'horaultimarespuesta',
            },
            {
                Header: t(langKeys.dateofresolution),
                accessor: 'fechacierre',
            },
            {
                Header: t(langKeys.dateofresolutiondeadline),
                accessor: 'horacierre',
            },
            {
                Header: t(langKeys.complianceresolution),
                accessor: 'tipo_operacion',
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
                filterrange={true}
                download={true}
                fetchData={fetchData}
                filterGeneral={false}
                exportPersonalized={triggerExportData}
                register={false}
            // fetchData={fetchData}
            />
            
        </React.Fragment>
    )

}

export default ReportComplianceSLA;
