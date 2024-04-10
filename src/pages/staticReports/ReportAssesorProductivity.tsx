import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { cleanViewChange, getCollectionAux, getMainGraphic, getMultiCollection, resetMainAux, setViewChange } from "store/main/actions";
import { getReportColumnSel, getReportFilterSel, getUserProductivityGraphic, getUserProductivitySel } from "common/helpers/requestBodies";
import { DateRangePicker, DialogZyx, FieldMultiSelect, FieldSelect, IOSSwitch } from "components";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@material-ui/core";
import { CalendarIcon, DownloadIcon } from "icons";
import { Range } from "react-date-range";
import CategoryIcon from "@material-ui/icons/Category";
import TableZyx from "components/fields/table-simple";
import { exportExcel } from "common/helpers";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { useForm } from "react-hook-form";
import Graphic from "components/fields/Graphic";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ListIcon from "@material-ui/icons/List";
import { Settings } from "@material-ui/icons";
import InfoIcon from '@material-ui/icons/Info';
import {  Card, CardContent, Grid, Tooltip } from "@material-ui/core";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import clsx from 'clsx';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { MultiData } from "@types";
import IndicatorPanel from "components/report/IndicatorPanel";

interface Assessor {
    row: Dictionary | null;
    allFilters: Dictionary[];
}

const useStyles = makeStyles((theme) => ({
    containerFilter: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        backgroundColor: "white",
        justifyContent: "space-between",
    },
    filterComponent: {
        minWidth: "220px",
        maxWidth: "260px",
    },
    containerHeader: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    containerDetails: {
        paddingBottom: theme.spacing(2),
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },
    BackGrRed: {
        backgroundColor: "#fb5f5f",
    },
    BackGrGreen: {
        backgroundColor: "#55bd84",
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: "pointer",
    },
    containerHeaderItem: {
        backgroundColor: "#FFF",
        padding: 8,
        display: "block",
        flexWrap: "wrap",
        gap: 8,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
}));

const columnsTemp = [
    "usr",
    "fullname",
    "hourfirstlogin",
    "totaltickets",
    "closedtickets",
    "asignedtickets",
    "suspendedtickets",
    "avgfirstreplytime",
    "maxfirstreplytime",
    "minfirstreplytime",
    "maxtotalduration",
    "mintotalduration",
    "avgtotalasesorduration",
    "maxtotalasesorduration",
    "mintotalasesorduration",
    "userconnectedduration",
    "userstatus",
    "groups",
];

const AssesorProductivityReport: FC<Assessor> = ({ allFilters }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const mainAux = useSelector((state) => state.main.mainAux);
    const [groupsdata, setgroupsdata] = useState<any>([]);
    const [allParameters, setAllParameters] = useState({});
    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection",
    });
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [state, setState] = useState({ checkedA: false, checkedB: false });
    const [checkedA, setcheckedA] = useState(false);
    const [isday, setisday] = useState(false);
    const [columnGraphic, setColumnGraphic] = useState("");
    const [anchorElSeButtons, setAnchorElSeButtons] = React.useState<null | HTMLElement>(null);
    const [, setOpenSeButtons] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [maxmin, setmaxmin] = useState({
        maxticketsclosed: 0,
        maxticketsclosedasesor: "",
        minticketsclosed: 0,
        minticketsclosedasesor: "",
        maxtimeconnected: "0",
        maxtimeconnectedasesor: "",
        mintimeconnected: "0",
        mintimeconnectedasesor: "",
    });
    const [desconectedmotives, setDesconectedmotives] = useState<any[]>([]);

    const [openModal, setOpenModal] = useState(false);
    const [view, setView] = useState("GRID");

    const [dataGrid, setdataGrid] = useState<any[]>([]);
   
    const [detailCustomReport, setDetailCustomReport] = useState<{
        loading: boolean;
        data: Dictionary[];
    }>({
        loading: false,
        data: [],
    });

    useEffect(() => {        
        dispatch(setViewChange("report_userproductivity"));
        dispatch(getMultiCollection([
            getReportColumnSel("UFN_REPORT_USERPRODUCTIVITY_SEL"),
            getReportFilterSel("UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC","UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC","probando"),
            getReportFilterSel("UFN_DOMAIN_LST_VALORES","UFN_DOMAIN_LST_VALORES_GRUPOS","GRUPOS"),
            getReportFilterSel("UFN_DOMAIN_LST_VALORES","UFN_DOMAIN_LST_VALORES_ESTADOORGUSER","ESTADOORGUSER"),
        ]));
        return () => {
            dispatch(cleanViewChange());
        };
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_userproductivity_user),
                accessor: 'usr',
            },
            {
                Header: t(langKeys.report_userproductivity_fullname),
                accessor: 'fullname',
            },
            ...(isday ? [{
                Header: t(langKeys.report_userproductivity_hourfirstlogin),
                accessor: 'hourfirstlogin',
            }] : []),
            {
                Header: t(langKeys.report_userproductivity_totaltickets),
                accessor: 'totaltickets',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_closedtickets),
                accessor: 'closedtickets',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_asignedtickets),
                accessor: 'asignedtickets',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_suspendedtickets),
                accessor: 'suspendedtickets',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_avgfirstreplytime),
                accessor: 'avgfirstreplytime',
            },
            {
                Header: t(langKeys.report_userproductivity_maxfirstreplytime),
                accessor: 'maxfirstreplytime',
            },
            {
                Header: t(langKeys.report_userproductivity_minfirstreplytime),
                accessor: 'minfirstreplytime',
            },
            // {
            //     Header: t(langKeys.report_userproductivity_avgtotalduration),
            //     accessor: 'avgtotalduration',
            //     NoFilter: false
            // },
            {
                Header: t(langKeys.report_userproductivity_maxtotalduration),
                accessor: 'maxtotalduration',
            },
            {
                Header: t(langKeys.report_userproductivity_mintotalduration),
                accessor: 'mintotalduration',
            },
            {
                Header: t(langKeys.report_userproductivity_avgtotalasesorduration),
                accessor: 'avgtotalasesorduration',
            },
            {
                Header: t(langKeys.report_userproductivity_maxtotalasesorduration),
                accessor: 'maxtotalasesorduration',
            },
            {
                Header: t(langKeys.report_userproductivity_mintotalasesorduration),
                accessor: 'mintotalasesorduration',
            },
            {
                Header: t(langKeys.report_userproductivity_tmravg),
                accessor: 'tmravg',
                helpText: t(langKeys.report_userproductivity_tmravg_help),
            },
            {
                Header: t(langKeys.report_userproductivity_tmradviseravg),
                accessor: 'tmradviseravg',
                helpText: t(langKeys.report_userproductivity_tmradviseravg_help),
            },
            {
                Header: t(langKeys.report_userproductivity_userconnectedduration),
                accessor: 'userconnectedduration',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_userstatus),
                accessor: 'userstatus',
            },
            {
                Header: t(langKeys.report_userproductivity_groups),
                accessor: 'groups',
            },
            ...(mainAux.data.length > 0 ?
                [...desconectedmotives.map((d: any) =>
                ({
                    Header: d,
                    accessor: d,
                })
                )
                ] : []
            )
        ],
        [isday, mainAux, desconectedmotives]
    );
    
    useEffect(() => {
        if (allFilters) {
            if(!multiData.loading && !multiData.error && multiData.data.length){
                const groupitem = allFilters.find((e) => e.values[0].label === "group");
                if (groupitem) {
                    const arraygroups =
                        multiData?.data[
                            multiData?.data?.findIndex(
                                (x) =>
                                    x.key ===
                                    (groupitem?.values[0].isListDomains
                                        ? groupitem?.values[0].filter + "_" + groupitem?.values[0].domainname
                                        : groupitem?.values[0].filter)
                            )
                        ];
                    setgroupsdata(arraygroups.data);
                }
            }
        }
    }, [multiData, allFilters]);
    useEffect(() => {
        if (!mainAux.error && !mainAux.loading && mainAux.key === "UFN_REPORT_USERPRODUCTIVITY_SEL") {
            setDetailCustomReport(mainAux);
            setdataGrid(mainAux.data.map((x) => ({ ...x, ...JSON.parse(x.desconectedtimejson) })));
            let maxminaux = {
                maxticketsclosed: 0,
                maxticketsclosedasesor: "",
                minticketsclosed: 0,
                minticketsclosedasesor: "",
                maxtimeconnected: "0",
                maxtimeconnectedasesor: "",
                mintimeconnected: "0",
                mintimeconnectedasesor: "",
            };
            if (mainAux.data.length > 0) {
                const desconedtedmotives = Array.from(
                    new Set(
                        (mainAux.data as any).reduce(
                            (ac: string[], x: any) =>
                                x.desconectedtimejson ? [...ac, ...Object.keys(JSON.parse(x.desconectedtimejson))] : ac,
                            []
                        )
                    )
                );
                setDesconectedmotives([...desconedtedmotives]);
                mainAux.data
                    .filter((x) => x.usertype !== "HOLDING")
                    .forEach((x, i) => {
                        if (i === 0) {
                            maxminaux = {
                                maxticketsclosed: x.closedtickets,
                                maxticketsclosedasesor: x.fullname,
                                minticketsclosed: x.closedtickets,
                                minticketsclosedasesor: x.fullname,
                                maxtimeconnected: x.userconnectedduration,
                                maxtimeconnectedasesor: x.fullname,
                                mintimeconnected: x.userconnectedduration,
                                mintimeconnectedasesor: x.fullname,
                            };
                        } else {
                            if (maxminaux.maxticketsclosed < x.closedtickets) {
                                maxminaux.maxticketsclosed = x.closedtickets;
                                maxminaux.maxticketsclosedasesor = x.fullname;
                            }
                            if (maxminaux.minticketsclosed > x.closedtickets) {
                                maxminaux.minticketsclosed = x.closedtickets;
                                maxminaux.minticketsclosedasesor = x.fullname;
                            }
                            if (parseInt(maxminaux.maxtimeconnected) < parseInt(x.userconnectedduration)) {
                                maxminaux.maxtimeconnected = x.userconnectedduration;
                                maxminaux.maxtimeconnectedasesor = x.fullname;
                            }
                            if (parseInt(maxminaux.mintimeconnected) > parseInt(x.userconnectedduration)) {
                                maxminaux.mintimeconnected = x.userconnectedduration;
                                maxminaux.mintimeconnectedasesor = x.fullname;
                            }
                        }
                    });
            }
            setmaxmin(maxminaux);
        }
    }, [mainAux]);

    useEffect(() => {
        setAllParameters({
            ...allParameters,
            startdate: dateRange.startDate
                ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10)
                : null,
            enddate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null,
        });
    }, [dateRange]);

    const fetchData = () => {
        const stardate = dateRange.startDate
            ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10)
            : null;
        const enddate = dateRange.endDate
            ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10)
            : null;
        setisday(stardate === enddate);
        
        dispatch(resetMainAux());
        dispatch(getCollectionAux(getUserProductivitySel({
            ...allParameters,
            
        })));

        if (view !== "GRID") {
            dispatch(
                getMainGraphic(
                    getUserProductivityGraphic({
                        ...allParameters,
                        // startdate: daterange?.startDate!,
                        // enddate: daterange?.endDate!,
                        column: columnGraphic,
                        summarization: "COUNT",
                    })
                )
            );
        }
    };

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };

    const handleChange = (event: any) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        setValue("bot", event.target.checked);
        setcheckedA(event.target.checked);
    };

    const format = (date: Date) => date.toISOString().split("T")[0];

    const handlerSearchGraphic = (daterange: any, column: string) => {
        dispatch(
            getMainGraphic(
                getUserProductivityGraphic({
                    ...allParameters,
                    startdate: daterange?.startDate!,
                    enddate: daterange?.endDate!,
                    column,
                    summarization: "COUNT",
                })
            )
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (anchorElSeButtons && !anchorElSeButtons.contains(target)) {
                setAnchorElSeButtons(null);
                setOpenSeButtons(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [anchorElSeButtons, setOpenSeButtons]);
    
    return (
        <>

            <div style={{ display: "flex", gap: 8, marginBottom: '1rem', marginTop: '0.5rem' }}>
                <div style={{ display: "flex" }}>
                    <Box width={1}>
                        <Box
                            className={classes.containerHeader}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
                                        }}
                                        startIcon={<CalendarIcon />}
                                        onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                                    >
                                        {format(dateRange.startDate!) +
                                            " - " +
                                            format(dateRange.endDate!)}
                                    </Button>
                                </DateRangePicker>
                            </div>
                        </Box>
                    </Box>
                </div>
                <div style={{ display: "flex" }}>
                    <Box width={1}>
                        <Box
                            className={classes.containerHeader}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                <FieldSelect                                                    
                                    label={t("report_userproductivity_filter_channels")}
                                    className={classes.filterComponent}
                                    key={"UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"}
                                    valueDefault={allParameters?.channel || "ayuda"}
                                    onChange={(value) =>
                                        setValue("channel", value?.typedesc || "ayuda2")
                                    }
                                    variant="outlined"
                                    data={
                                        multiData?.data?.find(x=>x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC")?.data||[]
                                    }
                                    loading={multiData.loading}
                                    optionDesc={"type"}
                                    optionValue={"typedesc"}
                                />
                                <FieldMultiSelect
                                    limitTags={1}
                                    label={t("report_userproductivity_filter_group")}
                                    className={classes.filterComponent + " col-6"}
                                    valueDefault={allParameters?.usergroup || ""}
                                    key={"UFN_DOMAIN_LST_VALORES_GRUPOS"}
                                    onChange={(value) =>
                                        setValue("usergroup", value ? value.map((o: Dictionary) => o["domainvalue"]).join() : "")
                                    }
                                    variant="outlined"
                                    data={groupsdata}
                                    optionDesc={"domaindesc"}
                                    optionValue={"domainvalue"}
                                />

                                <FieldMultiSelect
                                    limitTags={1}
                                    label={t("report_userproductivity_filter_status")}
                                    className={classes.filterComponent + " col-6"}
                                    key={"UFN_DOMAIN_LST_VALORES_ESTADOORGUSER"}
                                    valueDefault={allParameters?.userstatus || ""}
                                    onChange={(value) =>
                                        setValue("userstatus", value ? value.map((o: Dictionary) => o["domainvalue"]).join() : "")
                                    }
                                    variant="outlined"
                                    data={multiData?.data?.find(x=>x.key === "UFN_DOMAIN_LST_VALORES_ESTADOORGUSER")?.data||[]}
                                    loading={multiData.loading}
                                    optionDesc={"domaindesc"}
                                    optionValue={"domainvalue"}
                                />
                                <div style={{ alignItems: 'center' }}>
                                    <div>
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary">{t(langKeys.report_userproductivity_filter_includebot)}</Box>
                                        <FormControlLabel
                                            style={{ paddingLeft: 10 }}
                                            control={<IOSSwitch checked={checkedA} onChange={handleChange} />}
                                            label={checkedA ? t(langKeys.yes) : "No"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Box>
                </div>
                <div style={{ display: "flex" }}>
                    <Box width={1}>
                        <Box
                            className={classes.containerHeader}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                <Button
                                    disabled={detailCustomReport.loading}
                                    variant="contained"
                                    color="primary"
                                    style={{ backgroundColor: "#55BD84", width: 120 }}
                                    onClick={() => {
                                        setDetailCustomReport({
                                            loading: true,
                                            data: [],
                                        });
                                        fetchData();
                                    }}
                                >
                                    {t(langKeys.refresh)}
                                </Button>
                            </div>
                        </Box>
                    </Box>
                </div>
            </div>


            <Grid container spacing={3}>
                
                <Grid item xs={12} md={6} lg={6}>
                    <div>
                        <Grid container spacing={1} >

                            <Grid item xs={12} md={12} lg={12}>
                                <Card className={clsx({
                                    [classes.BackGrGreen]: (detailCustomReport.data[0]?.cardavgavgtme <= detailCustomReport.data[0]?.tmeesperadogeneral),
                                    [classes.BackGrRed]: (detailCustomReport.data[0]?.cardavgavgtme > detailCustomReport.data[0]?.tmeesperadogeneral),
                                })} style={{ color: "white" }}>
                                    <CardContent style={{ paddingBottom: 10 }}>
                                        <Typography variant="h5">
                                            {t(langKeys.report_userproductivity_cardtme)}
                                            <Tooltip title={`${t(langKeys.tmetooltip)}`} placement="top-start">
                                                <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                            </Tooltip>
                                        </Typography>
                                        <Typography variant="h5" component="div" align="center">
                                            {detailCustomReport.data[0]?.cardavgavgtme}
                                        </Typography>
                                        <Typography variant="subtitle2" style={{ display: "flex", width: "100%", paddingTop: 5, justifyContent: "space-between" }}>
                                            {`${t(langKeys.tmeexpected)} ${detailCustomReport.data[0]?.tmeesperadogeneral || ""}`}
                                            {(detailCustomReport.data[0]?.cardavgavgtme <= detailCustomReport.data[0]?.tmeesperadogeneral) ? (<ThumbUpIcon />) : (<ThumbDownIcon />)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>


                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmax_tme)}
                                    value={detailCustomReport.data[0]?.cardavgmaxtme}
                                    value2={detailCustomReport.data[0]?.cardavgmaxtmeuser || "-"}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardmaxmax_tme)}
                                    value={detailCustomReport.data[0]?.cardmaxmaxtme}
                                    value2={detailCustomReport.data[0]?.cardmaxmaxtmeuser ? `#${detailCustomReport.data[0]?.cardmaxmaxtmeticket} (${detailCustomReport.data[0]?.cardmaxmaxtmeuser})` : "-"}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmin_tme)}
                                    value={detailCustomReport.data[0]?.cardavgmintme}
                                    value2={detailCustomReport.data[0]?.cardavgmintmeuser || "-"}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardminmin_tme)}
                                    value={detailCustomReport.data[0]?.cardminmintme}
                                    value2={detailCustomReport.data[0]?.cardminmintmeuser ? `#${detailCustomReport.data[0]?.cardminmintmeticket} (${detailCustomReport.data[0]?.cardminmintmeuser})` : "-"}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <div>
                        <Grid container spacing={1}>

                            <Grid item xs={12} md={12} lg={12}>
                                <Card className={clsx({
                                    [classes.BackGrGreen]: (detailCustomReport.data[0]?.cardavgavgtmo <= detailCustomReport.data[0]?.tmoesperadogeneral),
                                    [classes.BackGrRed]: (detailCustomReport.data[0]?.cardavgavgtmo > detailCustomReport.data[0]?.tmoesperadogeneral),
                                })} style={{ color: "white" }}>
                                    <CardContent style={{ paddingBottom: 10 }}>
                                        <Typography variant="h5">
                                            {t(langKeys.report_userproductivity_cardtmo)}
                                            <Tooltip title={`${t(langKeys.tmotooltip)}`} placement="top-start">
                                                <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                            </Tooltip>
                                        </Typography>
                                        <Typography variant="h5" component="div" align="center">
                                            {detailCustomReport.data[0]?.cardavgavgtmo}
                                        </Typography>
                                        <Typography variant="subtitle2" style={{ display: "flex", width: "100%", paddingTop: 5, justifyContent: "space-between" }}>
                                            {`${t(langKeys.tmoexpected)} ${detailCustomReport.data[0]?.tmoesperadogeneral || ""}`}
                                            {(detailCustomReport.data[0]?.cardavgavgtmo <= detailCustomReport.data[0]?.tmoesperadogeneral) ? (<ThumbUpIcon />) : (<ThumbDownIcon />)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmax_tmo)}
                                    value={detailCustomReport.data[0]?.cardavgmaxtmo}
                                    value2={detailCustomReport.data[0]?.cardavgmaxtmouser || "-"}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardmaxmax_tmo)}
                                    value={detailCustomReport.data[0]?.cardmaxmaxtmo}
                                    value2={detailCustomReport.data[0]?.cardmaxmaxtmouser ? `#${detailCustomReport.data[0]?.cardmaxmaxtmoticket} (${detailCustomReport.data[0]?.cardmaxmaxtmouser})` : "-"}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmin_tmo)}
                                    value={detailCustomReport.data[0]?.cardavgmintmo}
                                    value2={detailCustomReport.data[0]?.cardavgmintmouser || "-"}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardminmin_tmo)}
                                    value={detailCustomReport.data[0]?.cardminmintmo}
                                    value2={detailCustomReport.data[0]?.cardminmintmouser ? `#${detailCustomReport.data[0]?.cardminmintmoticket} (${detailCustomReport.data[0]?.cardminmintmouser})` : "-"}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
           







            <Grid container spacing={3} className={classes.containerDetails} style={{paddingTop:10}}>
                <Grid item xs={12} md={6} lg={6}>
                    <Card>
                        <CardContent style={{ paddingBottom: 10, display: "flex" }}>
                            <div style={{ flex: 1 }}>
                                <Typography variant="body2">
                                    {t(langKeys.report_userproductivity_totalclosedtickets)}
                                </Typography>
                                <Typography variant="h5" component="div" align="center">
                                    {detailCustomReport.data[0]?.totalclosedtickets}
                                </Typography>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Typography variant="subtitle1" >
                                    {maxmin.maxticketsclosedasesor} ({maxmin.maxticketsclosed})
                                    <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.report_userproductivity_maxticketsclosedasesorhelptext)}</div>} arrow placement="top" >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </Typography>
                                <Typography variant="subtitle1">
                                    {maxmin.minticketsclosedasesor} ({maxmin.minticketsclosed})
                                    <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.report_userproductivity_minticketsclosedasesorhelptext)}</div>} arrow placement="top" >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Card>
                        <CardContent style={{ paddingBottom: 10, display: "flex" }}>
                            <div style={{ flex: 1 }}>
                                <Typography variant="body2">
                                    N° {t(langKeys.report_userproductivity_usersconnected)}
                                </Typography>
                                <Typography variant="h5" component="div" align="center">
                                    {detailCustomReport.data[0]?.usersconnected}
                                </Typography>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Typography variant="subtitle1">
                                    {maxmin.maxtimeconnectedasesor} ({maxmin.maxtimeconnected} m)
                                    <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.report_userproductivity_maxtimeconnectedasesorhelptext)}</div>} arrow placement="top" >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </Typography>
                                <Typography variant="subtitle1">
                                    {maxmin.mintimeconnectedasesor} ({maxmin.mintimeconnected} m)
                                    <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.report_userproductivity_mintimeconnectedasesorhelptext)}</div>} arrow placement="top" >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {view === "GRID" ? (
                <TableZyx
                    columns={columns}
                    filterGeneral={false}
                    data={dataGrid}
                    download={false}
                    loading={detailCustomReport.loading}
                    register={false}
                    ButtonsElement={() => (
                        <Box width={1} style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={detailCustomReport.loading || !(detailCustomReport.data.length > 0)}
                                onClick={() => setOpenModal(true)}
                                startIcon={<AssessmentIcon />}
                            >
                                {t(langKeys.graphic_view)}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={detailCustomReport.loading}
                                onClick={() => exportExcel("report" + (new Date().toISOString()), dataGrid, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                                startIcon={<DownloadIcon />}
                            >{t(langKeys.download)}
                            </Button>
                        </Box>
                    )}
                />
            ) : (
                <div>
                    <Box
                        style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
                        className={classes.containerHeaderItem}
                    >
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={detailCustomReport.loading || !(detailCustomReport.data.length > 0)}
                            onClick={() => setOpenModal(true)}
                            startIcon={<Settings />}
                        >
                            {t(langKeys.configuration)}
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => setView("GRID")}
                            startIcon={<ListIcon />}
                        >
                            {t(langKeys.grid_view)}
                        </Button>
                    </Box>
                    <Graphic
                        graphicType={view.split("-")?.[1] || "BAR"}
                        column={view.split("-")?.[2] || "summary"}
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        daterange={{
                            startDate: dateRange.startDate?.toISOString().substring(0, 10),
                            endDate: dateRange.endDate?.toISOString().substring(0, 10),
                        }}
                        withFilters={false}
                        setView={setView}
                        withButtons={false}
                        row={{ origin: "userproductivity" }}
                        handlerSearchGraphic={handlerSearchGraphic}
                    />
                </div>
            )}

            <SummaryGraphic
                openModal={openModal}
                setOpenModal={setOpenModal}
                setColumnGraphic={setColumnGraphic}
                setView={setView}
                daterange={dateRange}
                filters={allParameters}
                columns={[
                    ...columnsTemp.map((c) => ({
                        key: c,
                        value: `report_userproductivity_${c}`,
                    })),
                    ...desconectedmotives.map((d: any) => ({
                        key: `desconectedtimejson::json->>'${d}'`,
                        value: d,
                    })),
                ]}
            />          
        </>
    );
};

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    setColumnGraphic: (value: string) => void;
    row?: Dictionary | null;
    daterange: any;
    filters?: Dictionary;
    columns: any[];
    columnsprefix?: string;
}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({
    openModal,
    setOpenModal,
    setView,  
    filters,
    columns,
    setColumnGraphic,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            graphictype: "BAR",
            column: "chamare",
        },
    });

    useEffect(() => {
        register("graphictype", { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register("column", { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    const handleCancelModal = () => {
        setOpenModal(false);
    };

    const handleAcceptModal = handleSubmit((data) => {
        triggerGraphic(data);
    });

    const triggerGraphic = (data: any) => {
        setView(`CHART-${data.graphictype}-${data.column?.split("::")[0]}`);
        setOpenModal(false);
        setColumnGraphic(data.column);
        dispatch(
            getMainGraphic(
                getUserProductivityGraphic({
                    ...filters,
                    column: data.column,
                    summarization: "COUNT",
                })
            )
        );
    };
    const excludeUserProductivity = [
        "hourfirstlogin",
        "avgfirstreplytime",
        "maxfirstreplytime",
        "minfirstreplytime",
        "avgtotalasesorduration",
        "groups",
    ];

    const filteredColumns = columns.filter((column) => !excludeUserProductivity.includes(column.key));

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.graphic_configuration)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.accept)}
            handleClickButton2={handleAcceptModal}
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_type)}
                    className="col-12"
                    valueDefault={getValues("graphictype")}
                    error={errors?.graphictype?.message}
                    onChange={(value) => setValue("graphictype", value?.key)}
                    data={[
                        { key: "BAR", value: "BAR" },
                        { key: "PIE", value: "PIE" },
                        { key: "LINE", value: "LINEA" },
                    ]}
                    uset={true}
                    prefixTranslation="graphic_"
                    optionDesc="value"
                    optionValue="key"
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_view_by)}
                    className="col-12"
                    valueDefault={getValues("column")}
                    error={errors?.column?.message}
                    onChange={(value) => setValue("column", value?.key)}
                    data={filteredColumns}
                    optionDesc="value"
                    optionValue="key"
                    uset={true}
                    prefixTranslation=""
                />
            </div>
        </DialogZyx>
    );
};

export default AssesorProductivityReport;