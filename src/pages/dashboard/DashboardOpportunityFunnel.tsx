import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Paper, TextField } from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { CalendarIcon, DownloadIcon } from "../../icons";
import {
    exportExcel,
    getAdviserFilteredUserRol, getColumnsSel, getCommChannelLst, getDashboardFunnelDataSel, getDateCleaned, getLeadsSel,
    getProducts,
    getReportFilterSel, getValuesFromDomain
} from "common/helpers";
import { DateRangePicker } from "../../components";
import { Range } from "react-date-range";
import { Dictionary, ICampaignLst, IChannel, IDomain } from "../../@types";
import { useSelector } from "../../hooks";
import { langKeys } from "../../lang/keys";
import { cleanViewChange, getMultiCollection, setViewChange } from "../../store/main/actions";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { Funnel3D } from 'components/fields/Funnel3D';
import { RectangularTrapezoid } from "../../components/fields/RectangularTrapezoid";
import { useQueryParams } from "../../components/fields/table-paginated";

const useStyles = makeStyles((theme) => ({
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
    },
    filterControls: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    filterComponent: {
        minWidth: "200px",
        maxWidth: "200px",
    },
    smallLabel: {
        fontSize: "0.875rem",
    },
    smallChip: {
        height: "24px",
        fontSize: "0.75rem",
    },
    chartContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: theme.spacing(2),
    },
    downloadButton: {
        marginLeft: theme.spacing(1),
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },
    searchButton: {
        marginLeft: theme.spacing(1),
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        },
    },
    filterField: {
        minWidth: '200px',
    },
    dateRangePicker: {
        marginRight: theme.spacing(1),
    },
    containerHeader: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
        marginRight: theme.spacing(2),
    },
    tableContainer: {
        width: '20%',
        maxHeight: 400,
        fontSize: "0.8rem",
        '& th, & td': {
            fontSize: "0.8rem",
            padding: theme.spacing(1),
        },
    },
    tableHeader: {
        backgroundColor: "#a653e0",
        color: "#fff",
    },
    tableCell: {
        fontSize: "0.8rem",
    },
    overlappedContainer: {
        position: 'relative',
        width: '100%',
        height: '400px',
    },
    overlapped: {
        position: 'absolute',
        top: '0',
        right: '275px',
        width: '100%',
    },
    overlappedFunnel: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
    },
    selectMenu: {
        minWidth: '200px',
    },
    option: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));

interface IBoardFilter {
    campaign: number;
    channel: string;
    customer: string;
    products: string;
    tags: string;
    asesorid: string;
    persontype: string;
}

const generateProportionData = (data) => {
    const fillCounts = data.reduce((acc, { fill }) => {
        acc[fill] = (acc[fill] || 0) + 1;
        return acc;
    }, {});

    const total = data.length;

    return [
        { proportion: fillCounts['#d13a41'] / total || 0 },
        { proportion: fillCounts['#fe813e'] / total || 0 },
        { proportion: fillCounts['#ffaf12'] / total || 0 },
        { proportion: fillCounts['#4ec5a7'] / total || 0 },
    ];
};

const DashboardOpportunityFunnel: FC = () => {
    const user = useSelector(state => state.login.validateToken.user);
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const query = useMemo(() => new URLSearchParams(location.search), [location]);
    const mainMulti = useSelector(state => state.main.multiData);
    const params = useQueryParams(query, {
        ignore: [
            'asesorid', 'channels', 'contact', 'display', 'products', 'tags', 'campaign', 'persontype'
        ],
    });
    const otherParams = useMemo(() => ({
        asesorid: query.get('asesorid'),
        channels: query.get('channels') || '',
        contact: query.get('contact') || '',
        products: query.get('products') || '',
        persontype: query.get('persontype') || '',
        tags: query.get('tags') || '',
        campaign: Number(query.get('campaign')),
    }), [query]);

    const [boardFilter, setBoardFilterPrivate] = useState<IBoardFilter>({
        campaign: otherParams.campaign,
        channel: otherParams.channels || '',
        customer: otherParams.contact || '',
        products: otherParams.products || '',
        tags: otherParams.tags || '',
        asesorid: otherParams.asesorid?.toString() || '',
        persontype: otherParams.persontype || '',
    });

    const [sortParams, setSortParams] = useState({
        type: '',
        order: ''
    });
    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection",
    });
    const initialAsesorId = useMemo(() => {
        if (!user) return "";
        if (user.roledesc?.includes("ASESOR")) return user.userid;
        else return otherParams.asesorid || mainMulti.data[2]?.data?.map(d => d.userid).includes(user?.userid) ? (user?.userid || "") : "";
    }, [otherParams, user]);

    const [allParameters, setAllParametersPrivate] = useState<{ contact: string, channel: string, asesorid: string, persontype: string }>({
        asesorid: String(initialAsesorId),
        channel: otherParams.channels,
        contact: otherParams.contact,
        persontype: otherParams.persontype,
    });

    const [funnelData, setFunnelData] = useState([]);
    const [trapezoidData, setTrapezoidData] = useState([]);

    const fetchData = async () => {
        const dashboardParams = {
            startdate: dateRange.startDate,
            enddate: dateRange.endDate,
            channel: allParameters.channel,
            userid: boardFilter.asesorid,
            leadproduct: boardFilter.products,
        };

        const columnsSel = getColumnsSel(1);
        const leadsSel = getLeadsSel({
            id: 0,
            campaignid: boardFilter.campaign,
            fullname: boardFilter.customer,
            leadproduct: boardFilter.products,
            persontype: boardFilter.persontype,
            tags: boardFilter.tags,
            userid: boardFilter.asesorid,
            supervisorid: user?.userid ? user.userid : 0,
            ordertype: sortParams.type,
            orderby: sortParams.order,
        });
        const commChannelLst = getCommChannelLst();
        const adviserFilteredUserRol = getAdviserFilteredUserRol();
        const valuesFromDomain = getValuesFromDomain('OPORTUNIDADPRODUCTOS');
        const dashboardFunnelDataSel = getDashboardFunnelDataSel(dashboardParams);

        const result = await dispatch(getMultiCollection([
            columnsSel,
            leadsSel,
            commChannelLst,
            adviserFilteredUserRol,
            valuesFromDomain,
            dashboardFunnelDataSel,
        ]));
    };

    useEffect(() => {
        fetchData();
        return () => {
            dispatch(cleanViewChange());
        };
    }, [boardFilter, dispatch, sortParams, user, dateRange, allParameters]);

    const funnelDataResult = useMemo(() => {
        if (!mainMulti.data) return [];
        const data = mainMulti.data.find(d => d.key === "UFN_LEAD_FUNNEL_SEL");
        return data ? data.data : [];
    }, [mainMulti.data]);

    useEffect(() => {
        if (funnelDataResult.length) {

            const order = ['NEW', 'QUALIFIED', 'PROPOSITION', 'WON'];
            const phases = [
                t(langKeys.opportunity_funnel_new),
                t(langKeys.opportunity_funnel_qualified),
                t(langKeys.opportunity_funnel_proposition),
                t(langKeys.opportunity_funnel_won)
            ];

            const sortedFunnelData = funnelDataResult.map(item => ({
                name: item.description,
                type: item.type,
                fill: item.type === 'NEW' ? '#d13a41' : item.type === 'QUALIFIED' ? '#fe813e' : item.type === 'PROPOSITION' ? '#ffaf12' : '#4ec5a7',
                count: item.count,
                value: 0,
            })).sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

            const totalItems = sortedFunnelData.length;
            sortedFunnelData.forEach((item, index) => {
                item.value = ((totalItems - index) / totalItems) * 100;
            });

            const groupedData = order.map(type => {
                const items = sortedFunnelData.filter(item => item.type === type);
                const totalCount = items.reduce((acc, item) => acc + item.count, 0);
                return {
                    type,
                    totalCount,
                };
            });


            const limitedTrapezoidData = groupedData.map((group, index) => {
                const item = sortedFunnelData.find(dataItem => dataItem.type === group.type);
                return {
                    name: phases[index],
                    value: item ? item.value : 0,
                    fill: item ? item.fill : '#ffffff',
                    count: group.totalCount
                };
            }).filter(item => item.count > 0);
            setFunnelData(sortedFunnelData);
            setTrapezoidData(limitedTrapezoidData);
        }
    }, [funnelDataResult]);

    useEffect(() => {
        fetchData();
        return () => {
            dispatch(cleanViewChange());
        };
    }, [boardFilter, dispatch, sortParams, user, dateRange, allParameters]);

    const setBoardFilter = useCallback((prop: React.SetStateAction<typeof boardFilter>) => {
        if (!user) return;
        if (user.roledesc?.includes("ASESOR")) {
            setBoardFilterPrivate({
                ...(typeof prop === "function" ? prop(boardFilter) : prop),
                asesorid: user.userid.toString(),
            });
        } else {
            setBoardFilterPrivate(prop);
        }
    }, [user, boardFilter]);

    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);

    const multiData = useSelector(state => state.main.multiData);
    const [dataGrid, setdataGrid] = useState<any[]>([]);

    const [data, setData] = useState<any[]>([]);

    const [detailCustomReport, setDetailCustomReport] = useState<{
        loading: boolean;
        data: Dictionary[];
    }>({
        loading: false,
        data: [],
    });

    const channels = useMemo(() => {
        if (!mainMulti.data[2]?.data || mainMulti.data[2]?.key !== "UFN_COMMUNICATIONCHANNEL_LST") return [];
        return mainMulti.data[2].data as IChannel[];
    }, [mainMulti.data]);

    const asesores = useMemo(() => {
        if (!mainMulti.data[3]?.data || mainMulti.data[3]?.key !== "UFN_ADVISERSBYUSERID_SEL") return [];
        return mainMulti.data[3].data as Dictionary[];
    }, [mainMulti.data]);

    const products = useMemo(() => {
        if (!mainMulti.data[4]?.data || mainMulti.data[4]?.key !== "UFN_DOMAIN_LST_VALORES") return [];
        return mainMulti.data[4].data as IDomain[];
    }, [mainMulti.data]);

    const proportionData = generateProportionData(funnelData);

    const format = (date: Date) => date.toISOString().split("T")[0];

    const setAllParameters = useCallback((prop: typeof allParameters) => {
        if (!user) return;

        if (user.roledesc?.includes("ASESOR") && prop.asesorid !== String(user.userid || "")) {
            setAllParametersPrivate({ ...prop, asesorid: String(user.userid || "") });
        } else {
            setAllParametersPrivate(prop);
        }
    }, [user]);

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div>
                <Box className={classes.filterContainer} component={Paper}>
                    <div className={classes.filterControls}>
                        <div style={{ textAlign: 'left', display: 'flex', gap: '0.5rem', marginRight: 'auto' }}>
                            <DateRangePicker
                                open={openDateRangeModal}
                                setOpen={setOpenDateRangeModal}
                                range={dateRange}
                                onSelect={setdateRange}
                            >
                                <Button
                                    disabled={detailCustomReport.loading}
                                    style={{
                                        border: "1px solid #bfbfc0",
                                        borderRadius: 4,
                                        color: "rgb(143, 146, 161)",
                                        minWidth: '200px',
                                    }}
                                    startIcon={<CalendarIcon />}
                                    onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                                >
                                    {getDateCleaned(dateRange.startDate!) + " - " + getDateCleaned(dateRange.endDate!)}
                                </Button>
                            </DateRangePicker>
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={channels}
                                getOptionLabel={(option) => option.communicationchanneldesc}
                                renderOption={(option) => (
                                    <React.Fragment>
                                        {option.communicationchanneldesc}
                                    </React.Fragment>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label={t(langKeys.opportunity_funnel_channels)}
                                        className={classes.selectMenu}
                                    />
                                )}
                                onChange={(event, newValue) => {
                                    setAllParameters({ ...allParameters, channel: newValue.map((o: Dictionary) => o['communicationchannelid']).join(',') });
                                }}
                                value={channels.filter(channel => allParameters.channel.split(',').includes(String(channel.communicationchannelid)))}
                            />
                            {(user && !(user.roledesc?.includes("ASESOR"))) &&
                                <Autocomplete
                                    multiple
                                    disableCloseOnSelect
                                    options={asesores}
                                    getOptionLabel={(option) => option.fullname}
                                    renderOption={(option) => (
                                        <React.Fragment>
                                            {option.fullname}
                                        </React.Fragment>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label={t(langKeys.agent)}
                                            className={classes.selectMenu}
                                        />
                                    )}
                                    onChange={(event, newValue) => {
                                        setBoardFilter(prev => {
                                            return ({
                                                ...prev,
                                                asesorid: newValue.map((o: Dictionary) => o['userid']).join(',')
                                            });
                                        });
                                    }}
                                    value={asesores.filter(asesor => boardFilter.asesorid.split(',').includes(String(asesor.userid)))}
                                    disabled={Boolean(user?.roledesc?.includes("ASESOR")) || false}
                                />}
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={products}
                                getOptionLabel={(option) => option.domaindesc}
                                renderOption={(option) => (
                                    <React.Fragment>
                                        {option.domaindesc}
                                    </React.Fragment>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label={t(langKeys.product, { count: 2 })}
                                        className={classes.selectMenu}
                                    />
                                )}
                                onChange={(event, newValue) => {
                                    const products = newValue.map((o: IDomain) => o.domainvalue).join(',') || '';
                                    setBoardFilter(prev => ({ ...prev, products }));
                                }}
                                value={products.filter(product => boardFilter.products.split(',').includes(String(product.domainvalue)))}
                            />
                        </div>
                        <div className={classes.filterField}>
                            <Button
                                disabled={detailCustomReport.loading}
                                variant="contained"
                                color="primary"
                                style={{ backgroundColor: "#55BD84", width: 120 }}
                                startIcon={<SearchIcon />}
                                onClick={fetchData}
                            >
                                {t(langKeys.search)}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={detailCustomReport.loading}
                            onClick={() =>
                                exportExcel(
                                    "report" + new Date().toISOString(),
                                    dataGrid
                                )
                            }
                            startIcon={<DownloadIcon />}
                        >
                            {t(langKeys.download)}
                        </Button>
                    </div>
                </Box>
                <Box className={classes.chartContainer}>
                    <TableContainer component={Paper} className={classes.tableContainer}>
                        <Table stickyHeader size="small">
                            <TableHead className={classes.tableHeader}>
                                <TableRow>
                                    <TableCell className={classes.tableHeader}>{t(langKeys.opportunity_funnel_phase)}</TableCell>
                                    <TableCell className={classes.tableHeader}>{t(langKeys.opportunity_funnel_quantity)}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {funnelData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell className={classes.tableCell}>{row.name}</TableCell>
                                        <TableCell className={classes.tableCell}>{row.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className={classes.overlappedContainer}>
                        <div className={classes.overlapped}>
                            <RectangularTrapezoid data={trapezoidData} proportionData={proportionData} />
                        </div>
                        <div className={classes.overlappedFunnel}>
                            <Funnel3D data={funnelData} />
                        </div>
                    </div>
                </Box>
            </div>
        </MuiPickersUtilsProvider>
    );
};

export default DashboardOpportunityFunnel;
