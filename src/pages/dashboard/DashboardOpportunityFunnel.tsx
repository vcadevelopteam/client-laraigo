import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Paper } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { CalendarIcon, DownloadIcon } from "../../icons";
import {
    exportExcel, getAdviserFilteredUserRol, getColumnsSel, getCommChannelLst,
    getDashboardFunnelDataSel, getDateCleaned, getLeadsSel, getValuesFromDomain
} from "common/helpers";
import { DateRangePicker, FieldMultiSelect } from "../../components";
import { Range } from "react-date-range";
import { Dictionary, IChannel, IDomain } from "../../@types";
import { useSelector } from "../../hooks";
import { langKeys } from "../../lang/keys";
import { getCollectionAux, getMultiCollection } from "../../store/main/actions";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { Funnel3D } from "components/fields/Funnel3D";
import { RectangularTrapezoid } from "../../components/fields/RectangularTrapezoid";

const useStyles = makeStyles((theme) => ({
    filterContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
    },
    filterControls: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(2),
    },
    filterComponent: {
        minWidth: "200px",
        maxWidth: "425px",

    },
    chartContainer: {
        marginTop: theme.spacing(1),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: theme.spacing(2),
        backgroundColor: "#fff",
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        minHeight: "500px",
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
    button: {
        padding: 12,
        fontWeight: 5,
        fontSize: "14px",
        textTransform: "initial",
    },
    filterField: {
        minWidth: "200px",
    },
    tableContainer: {
        width: "20%",
        maxHeight: 400,
        fontSize: "0.8rem",
        "& th, & td": {
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
        position: "relative",
        width: "100%",
        height: "400px",
    },
    overlapped: {
        position: "absolute",
        top: "0",
        right: "275px",
        width: "100%",
    },
    overlappedFunnel: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
    },
    title: {
        fontSize: "25px",
        fontWeight: "bold",
        margin: theme.spacing(0.5, 0),
    }
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

    const total = Object.values(fillCounts).reduce((acc, count) => acc + count, 0);

    const colors = ["#d13a41", "#fe813e", "#ffaf12", "#4ec5a7"];
    const defaultProportion = total > 0 ? 1 / total : 0;

    return colors.map((color) => ({
        proportion: fillCounts[color] ? fillCounts[color] / total : defaultProportion,
    }));
};


const DashboardOpportunityFunnel: FC = () => {
    const user = useSelector((state) => state.login.validateToken.user);
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const query = useMemo(() => new URLSearchParams(location.search), [location]);
    const mainMulti = useSelector((state) => state.main.multiData);
    const mainData = useSelector((state) => state.main.mainAux);
    const [funnelData, setFunnelData] = useState([]);
    const [trapezoidData, setTrapezoidData] = useState([]);
    const otherParams = useMemo(
        () => ({
            asesorid: query.get("asesorid"),
            channels: query.get("channels") || "",
            contact: query.get("contact") || "",
            products: query.get("products") || "",
            persontype: query.get("persontype") || "",
            tags: query.get("tags") || "",
            campaign: Number(query.get("campaign")),
        }),
        [query]
    );

    const [boardFilter, setBoardFilterPrivate] = useState<IBoardFilter>({
        campaign: otherParams.campaign,
        channel: otherParams.channels || "",
        customer: otherParams.contact || "",
        products: otherParams.products || "",
        tags: otherParams.tags || "",
        asesorid: otherParams.asesorid?.toString() || "",
        persontype: otherParams.persontype || "",
    });

    const [temporaryFilter, setTemporaryFilter] = useState<IBoardFilter>(boardFilter);

    const [sortParams, setSortParams] = useState({
        type: "",
        order: "",
    });
    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection",
    });

    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);

    const multiData = useSelector((state) => state.main.multiData);
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


    const fetchData = useCallback(async () => {
        const dashboardParams = {
            startdate: dateRange.startDate,
            enddate: dateRange.endDate,
            channel: temporaryFilter.channel || "",
            userid: temporaryFilter.asesorid || "",
            leadproduct: temporaryFilter.products || "",
        };
        await dispatch(getCollectionAux(getDashboardFunnelDataSel(dashboardParams)));

    }, [temporaryFilter, boardFilter, dateRange, dispatch, sortParams, user?.userid]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
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
        const valuesFromDomain = getValuesFromDomain("OPORTUNIDADPRODUCTOS");

        dispatch(getMultiCollection([columnsSel, leadsSel, commChannelLst, adviserFilteredUserRol, valuesFromDomain]));
    }, [])

    useEffect(() => {
        if (!mainData.loading && !mainData.error) {
            const funnelDataResult = mainData.data;
            if (funnelDataResult.length) {
                const order = ["NEW", "QUALIFIED", "PROPOSITION", "WON"];
                const phases = [
                    t(langKeys.opportunity_funnel_new),
                    t(langKeys.opportunity_funnel_qualified),
                    t(langKeys.opportunity_funnel_proposition),
                    t(langKeys.opportunity_funnel_won),
                ];

                const sortedFunnelData = funnelDataResult
                    .map((item) => ({
                        name: item.description,
                        type: item.type,
                        fill: item.type === "NEW" ? "#d13a41" : item.type === "QUALIFIED" ? "#fe813e" : item.type === "PROPOSITION" ? "#ffaf12" : "#4ec5a7",
                        count: item.count,
                        value: 0,
                    }))
                    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

                const totalItems = sortedFunnelData.length;
                sortedFunnelData.forEach((item, index) => {
                    item.value = ((totalItems - index) / totalItems) * 100;
                });

                const groupedData = order.map((type) => {
                    const items = sortedFunnelData.filter((item) => item.type === type);
                    const totalCount = items.reduce((acc, item) => acc + item.count, 0);
                    return {
                        type,
                        totalCount,
                    };
                });

                const limitedTrapezoidData = groupedData
                    .map((group, index) => {
                        const item = sortedFunnelData.find((dataItem) => dataItem.type === group.type);
                        return {
                            name: phases[index],
                            value: item ? item.value : 0,
                            fill: item ? item.fill : "#ffffff",
                            count: group.totalCount,
                        };
                    })
                    .filter((item) => item.count > 0);

                setFunnelData(sortedFunnelData);
                setTrapezoidData(limitedTrapezoidData);
            } else {
                setFunnelData([]);
                setTrapezoidData([]);
            }
        }
    }, [mainData]);

    const proportionData = generateProportionData(funnelData);
    const setValue = (parameterName: any, value: any) => {
        setTemporaryFilter({ ...temporaryFilter, [parameterName]: value });
    };
    const handleExportClick = () => {
        const dataForExport = funnelData.map(row => ({
            Fases: t(row.name),
            Cantidad: row.count,
        }));
        exportExcel("reporte_funnel", dataForExport);
    };


    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div>
                <p className={classes.title}>{t(langKeys.opportunity_funnel)}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexGrow: 1 }}>
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
                                    minWidth: "200px",
                                }}
                                startIcon={<CalendarIcon />}
                                onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                            >
                                {getDateCleaned(dateRange.startDate!) + " - " + getDateCleaned(dateRange.endDate!)}
                            </Button>
                        </DateRangePicker>

                        <FieldMultiSelect
                            label={t(langKeys.opportunity_funnel_channels)}
                            className={classes.filterComponent}
                            valueDefault={channels.filter((channel) =>
                                temporaryFilter.channel.split(",").includes(String(channel.communicationchannelid))
                            )}
                            onChange={(value) => setValue("channel", value?.map((v) => v.communicationchannelid).join(",") || "")}
                            variant="outlined"
                            data={channels}
                            loading={multiData.loading}
                            optionDesc={"communicationchanneldesc"}
                            optionValue={"communicationchannelid"}
                        />

                        {user && !user.roledesc?.includes("ASESOR") && (
                            <FieldMultiSelect
                                label={t(langKeys.agent)}
                                className={classes.filterComponent}
                                valueDefault={asesores.filter((asesor) =>
                                    temporaryFilter.asesorid.split(",").includes(String(asesor.userid))
                                )}
                                onChange={(value) => { setValue("asesorid", value?.map((v) => v.userid).join(",") || "")}}
                                variant="outlined"
                                data={asesores}
                                loading={multiData.loading}
                                optionDesc={"fullname"}
                                optionValue={"userid"}
                                disabled={Boolean(user?.roledesc?.includes("ASESOR")) || false}
                            />
                        )}

                        <FieldMultiSelect
                            label={t(langKeys.product, { count: 2 })}
                            className={classes.filterComponent}
                            valueDefault={products.filter((product) =>
                                temporaryFilter.products.split(",").includes(String(product.domainvalue))
                            )}
                            onChange={(value) => {
                                const productsValue = value?.map((v) => v.domainvalue).join(",") || "";
                                setValue("products", productsValue);
                            }}
                            variant="outlined"
                            data={Array.isArray(products) ? products : []}
                            loading={multiData.loading}
                            optionDesc={"domaindesc"}
                            optionValue={"domainvalue"}
                        />



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
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={detailCustomReport.loading}
                        onClick={handleExportClick}
                        startIcon={<DownloadIcon />}
                    >
                        {t(langKeys.download)}
                    </Button>
                </div>
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
                                        <TableCell className={classes.tableCell}>{t(row.name)}</TableCell>
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
