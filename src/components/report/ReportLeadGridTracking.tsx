/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getreportleadgridtracking, getleadgridtrackingExport } from 'common/helpers';
import { IFetchData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanViewChange, exportData, getCollectionPaginated, resetMultiMain, setViewChange } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import TablePaginated from 'components/fields/table-paginated';


const ReportRequestSD: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiDataAux);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    useEffect(() => {
        dispatch(setViewChange("leadgridtracking"))
        return () => {
            dispatch(cleanViewChange());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.registrationdate),
                accessor: 'createdate',
                Cell: (props: any) => {
                    const { createdate } = props.cell.row.original;
                    return new Date(createdate).toLocaleString()
                }
            },
            {
                Header: t(langKeys.commercialagent),
                accessor: 'agent',
            },
            {
                Header: t(langKeys.description),
                accessor: 'leaddescription',
            },
            {
                Header: t(langKeys.statusdate),
                accessor: 'changedate',
                Cell: (props: any) => {
                    const { changedate } = props.cell.row.original;
                    return new Date(changedate).toLocaleString()
                }
            },
            {
                Header: t(langKeys.changedby),
                accessor: 'changeby',
            },
            {
                Header: t(langKeys.currentphase),
                accessor: 'phase',
            },
            {
                Header: t(langKeys.expectedRevenue),
                accessor: 'expected_revenue',
            },
            {
                Header: t(langKeys.tags),  
                accessor: 'tags',
            },
            {
                Header: t(langKeys.productcatalognotes),  
                accessor: 'notes',
            },
            {
                Header: t(langKeys.estimatedimplementationdate),
                accessor: 'estimatedimplementationdate',
                Cell: (props: any) => {
                    const { estimatedimplementationdate } = props.cell.row.original;
                    return new Date(estimatedimplementationdate).toLocaleString()
                }
            },
            {
                Header: t(langKeys.estimatedbillingdate),
                accessor: 'estimatedbillingdate',
                Cell: (props: any) => {
                    const { estimatedbillingdate } = props.cell.row.original;
                    return new Date(estimatedbillingdate).toLocaleString()
                }
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
        dispatch(getCollectionPaginated(getreportleadgridtracking({
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
                const errormessage = t(resExportData.code ?? "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
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
        dispatch(exportData(getleadgridtrackingExport(
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
                const errormessage = t(resExportData.code ?? "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
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
                autotrigger
                FiltersElement={useMemo(() => (
                    <div>
                    </div>
                ), [])}
                fetchData={fetchData}
                filterGeneral={false}
                exportPersonalized={triggerExportData}
                register={false}
            // fetchData={fetchData}
            />
            
        </React.Fragment>
    )

}

export default ReportRequestSD;
