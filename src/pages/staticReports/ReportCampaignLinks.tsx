import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { dictToArrayKV, getCampaignReportExport, getCampaignReportProactiveExport, getCommChannelLst, getDateCleaned, reportCampaignLinksSel } from 'common/helpers';
import { Dictionary } from "@types";
import { exportData, getCollection, getCollectionAux } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { FieldSelect, DateRangePicker, TemplateBreadcrumbs } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { DownloadIcon } from 'icons';
import { Button} from '@material-ui/core';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import { Search as SearchIcon } from '@material-ui/icons';
import TableZyx from 'components/fields/table-paginated';

interface DetailProps {
    setViewSelected?: (view: string) => void;
}

const useStyles = makeStyles(() => ({
    select: {
        width: '200px'
    },   
    itemDate: {        
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)',
        alignItems:'left'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    filterComponent: {
        width: '180px'
    },
    main: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    header: {
        display: 'flex',
        background: 'white',
        padding: '16px 16px 0px 16px'
    },
    leftHeader: {
        textAlign: 'left',
        display: 'flex',
        gap: '0.5rem',
        marginRight: 'auto'
    },
    rightHeader: {
        textAlign: 'right',
        display:'flex',
        marginRight:'0.5rem',
        gap:'0.5rem'
    },
}));

const dataReportType = {
    default: 'default',
    proactive: 'proactive'
}

const selectionKey = 'campaignid';

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

export const CampaignLinksReport: React.FC<DetailProps> = ({ setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
	const main = useSelector((state) => state.main.mainData);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitExport, setWaitExport] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [reportType, setReportType] = useState<string>('default');
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const filterChannel = useSelector ((state)=> state.main.mainAux)
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);

	useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected(p => Object.keys(selectedRows).map(x => main?.data.find(y => y.campaignid === parseInt(x)) || p.find((y) => y.campaignid === parseInt(x)) || {}))
        }
    }, [selectedRows])
  
    const columns = React.useMemo(
        () => [                    
            {
                Header: t(langKeys.campaign),
                accessor: 'title',
                width: "auto",
            },
            {
                Header: t(langKeys.description),
                accessor: 'campaigndescription',
                width: "auto",
            },
            {
                Header: t(langKeys.templatetype),
                accessor: 'templatetype',
                width: "auto",
            },
            {
                Header: t(langKeys.templatename),
                accessor: 'template_name',
                width: "auto",
            },
            {
                Header: t(langKeys.bond),
                accessor: 'urlname',
                width: "auto",
            },
            {
                Header: t(langKeys.url),
                accessor: 'url',
                width: "auto",
            },
            {
                Header: t(langKeys.channel),
                accessor: 'channel',
                width: "auto",
            },
            {
                Header: t(langKeys.rundate),
                accessor: 'rundate',
                width: "auto",
				Cell: (props: any) => {
                    const { rundate } = props.cell.row.original;
					const dateOnly = rundate?.split(' ')[0];
                    return (dateOnly || '');
                },
            },
            {
                Header: t(langKeys.executiontype_campaign),
                accessor: 'executiontype',
                width: "auto",
            },                
            {
                Header: t(langKeys.executingUser),
                accessor: 'executed_by',
                width: "auto",
            },
            {
                Header: t(langKeys.total),
                accessor: 'total',
                type: 'number',
                width: "auto",
            },
            {
                Header: t(langKeys.success),
                accessor: 'total_satisfactory',
                type: 'number',
                width: "auto",
            },
            {
                Header: t(langKeys.success_percent),
                accessor: 'percentage_satisfactory',
                type: 'number',
                width: "auto",
            },
            {
                Header: t(langKeys.failed),
                accessor: 'total_failed',
                type: 'number',
                width: "auto",
            },
            {
                Header: t(langKeys.failed_percent),
                accessor: 'percentage_failed',
                type: 'number',
                width: "auto",
            },
            {
                Header: t(langKeys.clicksonlink),
                accessor: 'total_clickurl',
                type: 'number',
                width: "auto",
            },
            {
                Header: t(langKeys.clicksonlinkpercent),
                accessor: 'percentage_clickurl',
                type: 'number',
                width: "auto",
            },
            {
                Header: t(langKeys.attended),
                accessor: 'total_attended',
                type: 'number',
                width: "auto",
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(reportCampaignLinksSel({
        startdate: dateRangeCreateDate.startDate,
        enddate: dateRangeCreateDate.endDate,
        communicationchannelid: selectedChannel,
    })));

    const triggerExportData = () => {
        if (Object.keys(selectedRows).length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_record_selected)}));
            return null;
        }
        if (!reportType) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_type_selected)}));
            return null;
        }
        
        if (reportType === dataReportType.default) {
            dispatch(exportData(getCampaignReportExport(
                Object.keys(selectedRows).reduce((ad: any[], d: any) => {
                    ad.push({
                        campaignid: d.split('_')[0],
                        rundate: d.split('_')[1]
                    })
                    return ad;
                }, [])),
                `${t(langKeys.report)}`,
                'excel',
                true,
                [
                    {key: 'templatetype', alias: t(langKeys.templatetype)},
                    {key: 'date', alias: t(langKeys.date)},
                    {key: 'campaign', alias: t(langKeys.campaign)},
                    {key: 'description', alias: t(langKeys.description)},
                    {key: 'ticketnum', alias: t(langKeys.ticket)},
                    {key: 'group', alias: t(langKeys.group)},
                    {key: 'userid', alias: t(langKeys.userid)},
                    {key: 'agent', alias: t(langKeys.agent)},
                    {key: 'contact', alias: t(langKeys.contact)},
                    {key: 'template', alias: t(langKeys.templatename)},
                    {key: 'rundate', alias: t(langKeys.rundate)},
                    {key: 'runtime', alias: t(langKeys.runtime)},
                    {key: 'executionuser', alias: t(langKeys.executingUser)},
                    {key: 'executionuserprofile', alias: t(langKeys.executingUserProfile)},   
                    {key: 'firstreplydate', alias: t(langKeys.firstreplydate)},
                    {key: 'firstreplytime', alias: t(langKeys.firstreplytime)},                   
                    {key: 'classification', alias: t(langKeys.classification)},
                    {key: 'conversationid', alias: t(langKeys.conversationid)},
                    {key: 'status', alias: t(langKeys.status)},
                    {key: 'log', alias: t(langKeys.log)},
                ]
            ));
            dispatch(showBackdrop(true));
            setWaitExport(true);
        }
        else if (reportType === dataReportType.proactive) {
            dispatch(exportData(getCampaignReportProactiveExport(
                Object.keys(selectedRows).reduce((ad: any[], d: any) => {
                    ad.push({
                        campaignid: d.split('_')[0],
                        rundate: d.split('_')[1]
                    })
                    return ad;
                }, [])),
                `${t(langKeys.report)}`,
                'excel',
                true,
                [
                    {key: 'templatetype', alias: t(langKeys.templatetype)},
                    {key: 'date', alias: t(langKeys.date)},
                    {key: 'campaign', alias: t(langKeys.campaign)},
                    {key: 'description', alias: t(langKeys.description)},
                    {key: 'ticketnum', alias: t(langKeys.ticket)},
                    {key: 'group', alias: t(langKeys.group)},
                    {key: 'userid', alias: t(langKeys.userid)},
                    {key: 'agent', alias: t(langKeys.agent)},
                    {key: 'contact', alias: t(langKeys.contact)},
                    {key: 'template', alias: t(langKeys.templatename)},
                    {key: 'rundate', alias: t(langKeys.rundate)},
                    {key: 'runtime', alias: t(langKeys.runtime)},
                    {key: 'executionuser', alias: t(langKeys.executingUser)},
                    {key: 'executionuserprofile', alias: t(langKeys.executingUserProfile)},   
                    {key: 'firstreplydate', alias: t(langKeys.firstreplydate)},
                    {key: 'firstreplytime', alias: t(langKeys.firstreplytime)},                   
                    {key: 'classification', alias: t(langKeys.classification)},
                    {key: 'conversationid', alias: t(langKeys.conversationid)},
                    {key: 'status', alias: t(langKeys.status)},
                    {key: 'log', alias: t(langKeys.log)},
                ]
            ));
            dispatch(showBackdrop(true));
            setWaitExport(true);
        }
    };

    useEffect(() => {
        fetchData();
        fetchFiltersChannels();
    }, []);

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);  

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
   
    const fetchFiltersChannels = () => dispatch(getCollectionAux(getCommChannelLst()))

    const arrayBread = [
        { id: "view-1", name: t(langKeys.report_plural) },
        { id: "linkregister", name: t(langKeys.campaignwithlinks) },
    ];
    
    return (
        <div className={classes.main}>
            <TemplateBreadcrumbs breadcrumbs={arrayBread} handleClick={setViewSelected}/>
            <div className={classes.header}>
                <div className={classes.leftHeader}>
                    <DateRangePicker
                        open={openDateRangeCreateDateModal}
                        setOpen={setOpenDateRangeCreateDateModal}
                        range={dateRangeCreateDate}
                        onSelect={setDateRangeCreateDate}
                    >
                        <Button
                            className={classes.itemDate}
                            startIcon={<CalendarIcon />}
                            onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                        >
                            {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                        </Button>
                    </DateRangePicker>
                    <FieldSelect
                        label={t(langKeys.channel)}
                        variant="outlined"                       
                        className={classes.filterComponent}                        
                        data={uniqueTypdescList || []}        
                        valueDefault={uniqueTypdescList}
                        onChange={(value) => setSelectedChannel(value?.communicationchannelid||0)}           
                        optionDesc="typedesc"
                        optionValue="typedesc"
                    />
                    <Button
                        disabled={main.loading}
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                        style={{ width: 120, backgroundColor: "#55BD84" }}
                        onClick={() => fetchData()}
                    >
                        {t(langKeys.search)}
                    </Button>
                </div>
                <div className={classes.rightHeader}>
                    <FieldSelect
                        uset={true}
                        variant="outlined"
                        label={t(langKeys.reporttype)}
                        className={classes.select}
                        valueDefault={reportType}
                        onChange={(value) => setReportType(value?.key)}
                        data={dictToArrayKV(dataReportType)}
                        optionDesc="value"
                        optionValue="key"
                    />
                    <Button
                        className={classes.button}
                        color="primary"
                        disabled={main.loading}
                        onClick={() => triggerExportData()}                         
                        startIcon={<DownloadIcon />}
                        variant="contained"
                    >
                        {`${t(langKeys.download)}`}
                    </Button>
                </div>
            </div>
            <TableZyx
                columns={columns}
                filterGeneral={false}
                data={main.data}
				loading={main.loading}
                useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
            />
        </div>
    )
}