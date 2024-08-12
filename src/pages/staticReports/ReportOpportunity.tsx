import React, { useMemo, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import {
    convertLocalDate,
    getCommChannelLst,
    getDateCleaned, getLeadsReportSel,
    getLeadsSel,
    getUserMessageOutbound
} from 'common/helpers';
import { Dictionary } from "@types";
import {
    getCollectionAux,
    getMultiCollection,
    getMultiCollectionAux3,
    resetCollectionPaginated
} from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { TemplateBreadcrumbs, FieldSelect, DateRangePicker } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import { Search as SearchIcon } from '@material-ui/icons';
import { CellProps } from 'react-table';

interface DetailProps {
    setViewSelected: (view: string) => void;
}
interface IBoardFilter {
    campaign: number;
    customer: string;
    products: string;
    tags: string;
    asesorid: number;
    persontype: string;
}

const useStyles = makeStyles((theme) => ({
    select: {
        width: '200px'
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)',
        alignItems: 'left'
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
    containerFilters: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'end',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1),
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
    },
}));

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const OpportunityReport: React.FC<DetailProps> = ({ setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.login.validateToken.user);
    const { t } = useTranslation();
    const multiAux3 = useSelector(state => state.main.multiDataAux3);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitExport, setWaitExport] = useState(false);

    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [viewSelected2, setViewSelected2] = useState("view-2");

    const arrayBread = [
        { id: "view-1", name: t(langKeys.report_plural) },
        { id: "view-2", name: t('report_crm') }
    ];

    const filterChannel = useSelector((state) => state.main.mainAux);

    const cell = (props: CellProps<Dictionary>) => {
        const column = props.cell.column;
        const row = props.cell.row.original;
        console.log("Renderizando celda:", row[column.id]);
        return (
            <div>
                {column.sortType === "datetime" && !!row[column.id]
                    ? convertLocalDate(row[column.id]).toLocaleString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric"
                    })
                    : row[column.id]}
            </div>
        );
    };

    const query = useMemo(() => new URLSearchParams(location.search), [location]);

    const otherParams = useMemo(() => ({
        asesorid: Number(query.get('asesorid')),
        channels: query.get('channels') || '',
        contact: query.get('contact') || '',
        products: query.get('products') || '',
        persontype: query.get('persontype') || '',
        tags: query.get('tags') || '',
        campaign: Number(query.get('campaign')),
    }), [query]);

    const [boardFilter, setBoardFilterPrivate] = useState<IBoardFilter>({
        campaign: otherParams.campaign,
        customer: otherParams.contact,
        products: otherParams.products,
        tags: otherParams.tags,
        asesorid: otherParams.asesorid,
        persontype: otherParams.persontype,
    });

    const [sortParams, setSortParams] = useState({
        type: '',
        order: ''
    });

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_opportunity_ticket),
                accessor: 'ticketnum',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_datehour),
                accessor: 'createdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { createdate } = props.cell.row.original || {};
                    return createdate ? new Date(createdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_op),
                accessor: 'description',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_lastupdate),
                accessor: 'lastchangestatusdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { lastchangestatusdate } = props.cell.row.original || {};
                    return lastchangestatusdate ? new Date(lastchangestatusdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_dateinopportunity),
                accessor: 'date_deadline',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { date_deadline } = props.cell.row.original || {};
                    return date_deadline ? new Date(date_deadline).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_customer),
                accessor: 'displayname',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_phone),
                accessor: 'phone',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_email),
                accessor: 'email',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_expectedincome),
                accessor: 'expected_revenue',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_expectedimplementationdate),
                accessor: 'estimatedimplementationdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { estimatedimplementationdate } = props.cell.row.original || {};
                    return estimatedimplementationdate ? new Date(estimatedimplementationdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_expectedbillingdate),
                accessor: 'estimatedbillingdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { estimatedbillingdate } = props.cell.row.original || {};
                    return estimatedbillingdate ? new Date(estimatedbillingdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_tags),
                accessor: 'tags',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_phase),
                accessor: 'phase',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_priority),
                accessor: 'priority',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_assignedadviser),
                accessor: 'fullname',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_products),
                accessor: 'products',
                Cell: cell
            },
        ],
        [t]
    );

    const fetchData = () => {
        console.log("Communication Channel being sent:", selectedChannel);
        dispatch(showBackdrop(true));
        dispatch(getMultiCollectionAux3([getLeadsReportSel(
            {
                communicationchannel: selectedChannel || 0,
                startdate: dateRangeCreateDate.startDate,
                enddate: dateRangeCreateDate.endDate,
            }
        ), getUserMessageOutbound(
            {
                startdate: dateRangeCreateDate.startDate,
                enddate: dateRangeCreateDate.endDate,
                communicationchannelid: selectedChannel || 0,
            }
        )]));
    };

    useEffect(() => {
        dispatch(resetCollectionPaginated());
        fetchData();
        fetchFiltersChannels();
        return () => {
            dispatch(resetCollectionPaginated());
        };
    }, []);

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    useEffect(() => {
        if (!multiAux3.loading && !multiAux3.error) {
            dispatch(showBackdrop(false));
        }
    }, [multiAux3]);

    const [selectedChannel, setSelectedChannel] = useState(0);
    const [selectedUser, setSelectedUser] = useState("");

    const fetchFiltersChannels = () => dispatch(getCollectionAux(getCommChannelLst()));

    const setView = (e: string) => {
        if (e === "view-1") {
            setViewSelected(e);
            setViewSelected2("view-2");
        } else {
            setViewSelected2(e);
        }
    };

    if (viewSelected2 === "view-2") {
        return (
            <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setView}
                        />
                    </div>
                </div>
                <div style={{ position: 'relative', height: '100%' }}>

                    <TableZyx
                        columns={columns}
                        data={multiAux3?.data?.[0]?.data || []}
                        groupedBy={true}
                        showHideColumns={true}
                        loading={multiAux3.loading}
                        download={true}
                        ButtonsElement={() => (
                            <div style={{ textAlign: 'left', display: 'flex', gap: '0.5rem', marginRight: 'auto', marginTop: 5 }}>
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
                                    valueDefault={selectedChannel}
                                    onChange={(value) => setSelectedChannel(value?.communicationchannelid || 0)}
                                    optionDesc="communicationchanneldesc"
                                    optionValue="communicationchannelid"
                                />

                                <Button
                                    disabled={multiAux3.loading}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SearchIcon style={{ color: 'white' }} />}
                                    style={{ width: 120, backgroundColor: "#55BD84" }}
                                    onClick={() => fetchData()}
                                >
                                    {t(langKeys.search)}
                                </Button>

                            </div>
                        )}
                        filterGeneral={false}
                    />
                </div>
            </div>
        );
    } else {
        return <div>error</div>;
    }
};

export default OpportunityReport;
