/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getreportrequestSD, getRequestSDExport } from 'common/helpers';
import { IFetchData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanViewChange, exportData, getCollectionPaginated, resetMultiMain, setViewChange } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import TablePaginated from 'components/fields/table-paginated';
import { FieldSelect } from 'components/fields/templates';


const ReportRequestSD: FC = () => {
    // const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiDataAux);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [company, setCompany] = useState("");
    const [totalrow, settotalrow] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    useEffect(() => {
        dispatch(setViewChange("reportrequestsd"))
        return () => {
            dispatch(cleanViewChange());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.sdrequestcode),
                accessor: 'sd_request',
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
            },
            {
                Header: t(langKeys.channel),
                accessor: 'channel',
            },
            {
                Header: t(langKeys.applicant),
                accessor: 'display_name',
            },
            {
                Header: t(langKeys.business),
                accessor: 'company',
            },
            {
                Header: t(langKeys.resume),
                accessor: 'description',
            },
            {
                Header: t(langKeys.priority),
                accessor: 'priority',
            },
            {
                Header: t(langKeys.status),
                accessor: 'phase',
            },
            {
                Header: t(langKeys.resolution),
                NoFilter: true,        
                accessor: 'resolution',
            },
            {
                Header: t(langKeys.reportdate),
                accessor: 'report_date',
                Cell: (props: any) => {
                    const { report_date } = props.cell.row.original;
                    return new Date(report_date).toLocaleString()
                }
            },
            {
                Header: t(langKeys.dateofresolution),
                accessor: 'resolution_date',
                Cell: (props: any) => {
                    const { resolution_date } = props.cell.row.original;
                    return new Date(resolution_date).toLocaleString()
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
        console.log(multiData)
    }, [multiData])

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(getreportrequestSD({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            company: company,
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
        dispatch(exportData(getRequestSDExport(
            {
                startdate: daterange.startDate!,
                enddate: daterange.endDate!,
                sorts,
                filters: filters,
                company: company,
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
                autotrigger
                FiltersElement={useMemo(() => (
                    <div style={{width:200}}>
                        <FieldSelect
                            label={t(langKeys.business)}
                            valueDefault={company}
                            variant="outlined"
                            onChange={(value) => {
                                setCompany(value.domainvalue||"");
                            }}
                            data={multiData.data[2].data}
                            loading={multiData.loading}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    </div>
                ), [company, multiData, t])}
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
