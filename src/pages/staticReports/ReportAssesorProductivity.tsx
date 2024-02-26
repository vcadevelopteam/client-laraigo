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
    const user = useSelector((state) => state.login.validateToken.user);
    const groups = user?.groups?.split(",").filter((x) => !!x) || [];
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
    const [openSeButtons, setOpenSeButtons] = useState(false);
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
            getReportFilterSel("UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC","UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC",""),
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
                accessor: "usr",
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_fullname),
                accessor: "fullname",
                showColumn: true,
                fixed: true,
            },
            ...(isday
                ? [
                      {
                          Header: t(langKeys.report_userproductivity_hourfirstlogin),
                          accessor: "hourfirstlogin",
                          showColumn: true,
                      },
                  ]
                : []),
            {
                Header: t(langKeys.report_userproductivity_totaltickets),
                accessor: "totaltickets",
                type: "number",
                sortType: "number",
                helpText: t(langKeys.report_userproductivity_totaltickets_help),
                showColumn: true,
                fixed: true,
            },
            {
                Header: t(langKeys.report_userproductivity_closedtickets),
                accessor: "closedtickets",
                type: "number",
                sortType: "number",
                helpText: t(langKeys.report_userproductivity_closedtickets_help),
                showColumn: true,
                fixed: true,
            },
            {
                Header: t(langKeys.report_userproductivity_asignedtickets),
                accessor: "asignedtickets",
                type: "number",
                sortType: "number",
                helpText: t(langKeys.report_userproductivity_asignedtickets_help),
                showColumn: true,
                fixed: true,
            },
            {
                Header: t(langKeys.report_userproductivity_suspendedtickets),
                accessor: "suspendedtickets",
                type: "number",
                sortType: "number",
                helpText: t(langKeys.report_userproductivity_suspendedtickets_help),
                showColumn: true,
                fixed: true,
            },
            {
                Header: t(langKeys.report_userproductivity_avgfirstreplytime),
                accessor: "avgfirstreplytime",
                helpText: t(langKeys.report_userproductivity_avgfirstreplytime_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_maxfirstreplytime),
                accessor: "maxfirstreplytime",
                helpText: t(langKeys.report_userproductivity_maxfirstreplytime_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_minfirstreplytime),
                accessor: "minfirstreplytime",
                helpText: t(langKeys.report_userproductivity_minfirstreplytime_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_avgtotalduration),
                accessor: "avgtotalduration",
                NoFilter: false,
                helpText: t(langKeys.report_userproductivity_avgtotalduration_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_maxtotalduration),
                accessor: "maxtotalduration",
                helpText: t(langKeys.report_userproductivity_maxtotalduration_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_mintotalduration),
                accessor: "mintotalduration",
                helpText: t(langKeys.report_userproductivity_mintotalduration_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_avgtotalasesorduration),
                accessor: "avgtotalasesorduration",
                helpText: t(langKeys.report_userproductivity_avgtotalasesorduration_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_maxtotalasesorduration),
                accessor: "maxtotalasesorduration",
                helpText: t(langKeys.report_userproductivity_maxtotalasesorduration_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_mintotalasesorduration),
                accessor: "mintotalasesorduration",
                helpText: t(langKeys.report_userproductivity_mintotalasesorduration_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_tmravg),
                accessor: "tmravg",
                helpText: t(langKeys.report_userproductivity_tmravg_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_tmradviseravg),
                accessor: "tmradviseravg",
                helpText: t(langKeys.report_userproductivity_tmradviseravg_help),
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_userconnectedduration),
                accessor: "userconnectedduration",
                type: "number",
                sortType: "number",
                showColumn: true,
            },
            {
                Header: t(langKeys.report_userproductivity_userstatus),
                accessor: "userstatus",
                showColumn: true,
                fixed: true,
            },
            {
                Header: t(langKeys.report_userproductivity_groups),
                accessor: "groups",
                showColumn: true,
            },
            ...(mainAux.data.length > 0
                ? [
                      ...desconectedmotives.map((d: any) => ({
                          Header: d,
                          accessor: d,
                          showColumn: true,
                      })),
                  ]
                : []),
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
                    setgroupsdata(
                        groups.length > 0
                            ? arraygroups.data.filter((x) => groups.includes(x.domainvalue))
                            : arraygroups.data
                    );
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
        let stardate = dateRange.startDate
            ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10)
            : null;
        let enddate = dateRange.endDate
            ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10)
            : null;
        setisday(stardate === enddate);
        dispatch(resetMainAux());
        dispatch(getCollectionAux(getUserProductivitySel({ ...allParameters })));

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
            {view === "GRID" ? (
                <TableZyx
                    columns={columns}
                    filterGeneral={false}
                    data={dataGrid}
                    download={false}
                    showHideColumns={true}
                    loading={detailCustomReport.loading}
                    register={false}
                    ButtonsElement={
                        <div className={classes.containerFilter}>
                            <div style={{ display: "flex", gap: 8 }}>
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
                                                    valueDefault={allParameters?.channel || ""}
                                                    onChange={(value) =>
                                                        setValue("channel", value?.typedesc || "")
                                                    }
                                                    variant="outlined"
                                                    data={
                                                        multiData?.data?.find(x=>x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC")?.data||[]
                                                    }
                                                    loading={multiData.loading}
                                                    optionDesc={"type"}
                                                    optionValue={"typedesc"}
                                                />
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
                                                    {t(langKeys.search)}
                                                </Button>
                                            </div>
                                        </Box>
                                    </Box>
                                </div>
                            </div>
                            <div>
                                <Box width={1} style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                    {view === "GRID" && (
                                        <>
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                disabled={
                                                    detailCustomReport.loading || !(detailCustomReport.data.length > 0)
                                                }
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
                                                onClick={() =>
                                                    exportExcel(
                                                        "report" + new Date().toISOString(),
                                                        dataGrid,
                                                        columns.filter((x: any) => !x.isComponent && !x.activeOnHover)
                                                    )
                                                }
                                                startIcon={<DownloadIcon />}
                                            >
                                                {t(langKeys.download)}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </div>
                        </div>
                    }
                    ExtraMenuOptions={
                        <MenuItem
                            style={{ padding: "0.7rem 1rem", fontSize: "0.96rem" }}
                            onClick={() => setOpenFilterModal(true)}
                        >
                            <ListItemIcon>
                                <CategoryIcon fontSize="small" style={{ fill: "grey", height: "25px" }} />
                            </ListItemIcon>
                            <Typography variant="inherit">{t(langKeys.filters) + " - " + t(langKeys.report_userproductivity)}</Typography>
                        </MenuItem>
                    }
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
            <DialogZyx
                open={openFilterModal}
                title={t(langKeys.filters)}
                buttonText1={t(langKeys.close)}
                buttonText2={t(langKeys.apply)}
                handleClickButton1={() => setOpenFilterModal(false)}
                handleClickButton2={() => {
                    setOpenFilterModal(false);
                    fetchData();
                }}
                maxWidth="sm"
                buttonStyle1={{ marginBottom: "0.3rem" }}
                buttonStyle2={{ marginRight: "1rem", marginBottom: "0.3rem" }}
            >
                <div className="row-zyx" style={{marginBottom: 0, paddingBottom: 0}}>                    
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

                    <div style={{ alignItems: "center" }} className="col-6">
                        <div>
                            <Box fontWeight={500} lineHeight="18px" fontSize={16} color="textPrimary" padding="10px 0 8px 2px">
                                {t(langKeys.report_userproductivity_filter_includebot)}
                            </Box>
                            <FormControlLabel
                                style={{ paddingLeft: 10, paddingBottom: 0 }}
                                control={<IOSSwitch checked={checkedA} onChange={handleChange} />}
                                label={checkedA ? t(langKeys.yes) : "No"}
                            />
                        </div>
                    </div>

                </div>

            </DialogZyx>
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
            column: "",
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