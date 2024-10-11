import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { dictToArrayKV, exportExcel, getCampaignReportExport, getCampaignReportProactiveExport, getCommChannelLst, getDateCleaned, reportCampaignLinksDetailSel, reportCampaignLinksSel, selCommunicationChannelWhatsApp } from 'common/helpers';
import { Dictionary } from "@types";
import { exportData, getCollection, getCollectionAux, getCollectionAux2 } from 'store/main/actions';
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
}

const selectionKey = 'identifier';

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

function formatDateTime(dateTimeString: any) {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
}

export const CampaignLinksReport: React.FC<DetailProps> = ({ setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
	const main = useSelector((state) => state.main.mainData);
    const mainAux2 = useSelector((state) => state.main.mainAux2);
    const [waitExport, setWaitExport] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [reportType, setReportType] = useState<string>('default');
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const filterChannel = useSelector ((state)=> state.main.mainAux)
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);

	useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected(p => Object.keys(selectedRows).map(x => main?.data.find(y => y.identifier === x) || p.find((y) => y.identifier === x) || {}))
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
					const formatedDate = formatDateTime(rundate)
                    return (formatedDate || '');
                },
            },
            {
                Header: t(langKeys.executiontype),
                accessor: 'executiontype',
                width: "auto",
            },
            {
                Header: t(langKeys.executingUser),
                accessor: 'executed_by',
                width: "auto",
            },
            {
                Header: t(langKeys.executingUserProfile),
                accessor: 'executionuserprofile',
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
            {
                Header: t(langKeys.locked),
                accessor: 'locked',
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

    const columnsToExport = React.useMemo(
        () => [                    
            {
                Header: t(langKeys.campaign),
                accessor: 'campaignname',
                width: "auto",
            },
            {
                Header: t(langKeys.templatename),
                accessor: 'templatename',
                width: "auto",
            },
            {
                Header: t(langKeys.messagetemplate),
                accessor: 'messagetemplateid',
                width: "auto",
            },
            {
                Header: t(langKeys.channel),
                accessor: 'communicationchannel',
                width: "auto",
            },
            {
                Header: t(langKeys.rundate),
                accessor: 'rundate',
                width: "auto",
            },
            {
                Header: t(langKeys.url),
                accessor: 'urlname',
                width: "auto",
            },
            {
                Header: t(langKeys.success),
                accessor: 'succes',
                width: "auto",
            },
            {
                Header: t(langKeys.attended),
                accessor: 'attendedd',
                width: "auto",
            },
            {
                Header: t(langKeys.clickonlink),
                accessor: 'clickurl',
                width: "auto",
            },
            {
                Header: t(langKeys.clickurldate),
                accessor: 'clickurldate',
                width: "auto",
            },
        ],
        []
    );

    const handleDownload = () => {
        if (Object.keys(selectedRows).length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_record_selected)}));
            return null;
        }

        const mappedData = rowWithDataSelected.map(item => ({
            rundate: item.rundate,
            messagetemplateid: item.messagetemplateid,
            campaignname: item.title
        }));

        dispatch(getCollectionAux2(reportCampaignLinksDetailSel({
            startdate: dateRangeCreateDate.startDate,
            enddate: dateRangeCreateDate.endDate,
            communicationchannelid: selectedChannel,
            identifiers: mappedData,
        })))
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (waitExport) {
            if (!mainAux2.loading && !mainAux2.error) {
                const modifiedData = mainAux2?.data?.map((item: Dictionary) => {
                    return {
                        ...item,
                        rundate: item.rundate ? formatDateTime(item.rundate) : '',
                        succes: item.succes ? 'Ok' : 'Fail',
                        attendedd: item.attendedd ? 'Ok' : 'Fail',
                        clickurl: item.clickurl ? 'Ok' : 'Fail',
                        clickurldate: item.clickurldate ? formatDateTime(item?.clickurldate) : '',
                    };
                });
                exportExcel('Reporte campañas con enlaces', modifiedData, columnsToExport)
                dispatch(showBackdrop(false));
                setWaitExport(false);
            } else if (mainAux2.error) {
                const errormessage = t(mainAux2.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [mainAux2, waitExport]);

    useEffect(() => {
        fetchData();
        fetchFiltersChannels();
    }, []);

    const [selectedChannel, setSelectedChannel] = useState(0);
   
    const fetchFiltersChannels = () => dispatch(getCollectionAux(selCommunicationChannelWhatsApp()))

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
                        data={filterChannel.data || []}
                        onChange={(value) => setSelectedChannel(value?.communicationchannelid||0)}           
                        optionDesc="communicationchanneldesc"
                        optionValue="communicationchannelid"
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
                        onClick={() => handleDownload()}                         
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