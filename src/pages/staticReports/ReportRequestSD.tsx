import React, { FC, useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getCommChannelLst, getreportrequestSD, getRequestSDExport } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanViewChange, exportData, getCollectionAux2, getCollectionPaginated, resetMultiMain, setViewChange } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import TablePaginated from 'components/fields/table-paginated';
import { DialogZyx, FieldSelect } from 'components/fields/templates';
import { CellProps } from 'react-table';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import CategoryIcon from "@material-ui/icons/Category";

const ReportRequestSD: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiDataAux);
    const filterChannel = useSelector ((state)=> state.main.mainAux2);
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
    }, [])
    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.sdrequestcode),
                accessor: 'sd_request',            
                helpText: t(langKeys.sdrequestcode_help)
            },
            {
                Header: t(langKeys.ticket_number),
                accessor: 'ticketnum',
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                helpText: t(langKeys.report_requestsd_type_help)
            },
            {
                Header: t(langKeys.channel),
                accessor: 'channel',
                showColumn: true,   
            },
            {
                Header: t(langKeys.applicant),
                accessor: 'display_name',
                helpText: t(langKeys.report_requestsd_applicant_help)
            },
            {
                Header: t(langKeys.business),
                accessor: 'company',
                helpText: t(langKeys.report_requestsd_business_help)
            },
            {
                Header: t(langKeys.resume),
                accessor: 'description',
                helpText: t(langKeys.report_requestsd_resume_help)
            },
            {
                Header: t(langKeys.priority),
                accessor: 'priority',
            },
            {
                Header: t(langKeys.status),
                accessor: 'phase',
                helpText: t(langKeys.report_requestsd_status_help)
            },
            {
                Header: t(langKeys.resolution),  
                accessor: 'resolution',
                helpText: t(langKeys.report_requestsd_resolution_help),
                showColumn: true,   
            },
            {
                Header: t(langKeys.reportdate),
                accessor: 'report_date',
                showColumn: true,   
                Cell: (props: CellProps<Dictionary>) => {
                    const { report_date } = props.cell.row.original|| {};
                    return report_date ? new Date(report_date).toLocaleDateString() : null;                   
                }
            },
            {
                Header: t(langKeys.dateofresolution),
                accessor: 'resolution_date',
                showColumn: true,   
                Cell: (props: CellProps<Dictionary>) => {
                    const { resolution_date } = props.cell.row.original|| {};
                    return resolution_date ? new Date(resolution_date).toLocaleDateString() : null;                    
                }
            },            
        ],
        [t]
    );

    useEffect(() => {    
        fetchFiltersChannels(); 
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
        dispatch(getCollectionPaginated(getreportrequestSD({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            channeltype: selectedChannel,
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
                channeltype: selectedChannel,
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

    const [isFilterModalOpen, setFilterModalOpen] = useState(false);   

    const handleOpenFilterModal = () => {
        setFilterModalOpen(true);
    };

    const channelTypeList = filterChannel.data || [];
    const channelTypeFilteredList = new Set();
    const [selectedChannel, setSelectedChannel] = useState("");

    const uniqueTypdescList = channelTypeList.filter(item => {
        if (channelTypeFilteredList.has(item.type)) {
            return false; 
        }
        channelTypeFilteredList.add(item.type);
        return true;
    });
    
    const fetchFiltersChannels = () => dispatch(getCollectionAux2(getCommChannelLst()))

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
                FiltersElement={(
                    <div style={{width:200}}>
                        <FieldSelect
                            label={t(langKeys.channel)}
                            variant="outlined"                           
                            data={uniqueTypdescList || []}                               
                            valueDefault={selectedChannel}
                            onChange={(value) => setSelectedChannel(value?.type||"")}           
                            optionDesc="typedesc"
                            optionValue="typedesc"
                        />
                    </div>
                )}               
                fetchData={fetchData}
                filterGeneral={false}
                exportPersonalized={triggerExportData}
                register={false}
                showHideColumns={true}
                ExtraMenuOptions={
                    <MenuItem
                        style={{ padding: "0.7rem 1rem", fontSize: "0.96rem" }}
                        onClick={handleOpenFilterModal}
                    >
                        <ListItemIcon>
                            <CategoryIcon fontSize="small" style={{ fill: "grey", height: "25px" }} />
                        </ListItemIcon>
                        <Typography variant="inherit">{t(langKeys.filters) + " - " + t(langKeys.report_reportrequestsd)}</Typography>
                    </MenuItem>
                }
           
            />

            <DialogZyx
                open={isFilterModalOpen}
                title={t(langKeys.filters)}
                buttonText1={t(langKeys.close)}         
                buttonText2={t(langKeys.apply)}         
                handleClickButton1={() => setFilterModalOpen(false)}      
                handleClickButton2={() => {
                    setFilterModalOpen(false);
                    fetchData(fetchDataAux)
                }}           
                maxWidth="sm"
                buttonStyle1={{ marginBottom: "0.3rem" }}
                buttonStyle2={{ marginRight: "1rem", marginBottom: "0.3rem" }}
            >
              <div className="row-zyx" style={{marginRight: 10}}>
                    <FieldSelect
                        label={t(langKeys.business)}
                        valueDefault={company}                                     
                        variant="outlined"
                        onChange={(value) => {
                            setCompany(value?.domainvalue||"");
                        }}
                        data={multiData.data[2].data}
                        loading={multiData.loading}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
            </DialogZyx>
            
        </React.Fragment>
    )

}

export default ReportRequestSD;