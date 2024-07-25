import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, MenuItem, Paper, TextField } from "@material-ui/core";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import SearchIcon from '@material-ui/icons/Search';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
    exportExcel,
    getAdviserFilteredUserRol,
    getProducts,
    getReportFilterSel
} from "common/helpers";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, Tooltip as ChartTooltip } from 'recharts';
import {CalendarIcon, DownloadIcon} from "../../icons";
import {DateRangePicker, FieldSelect} from "../../components";
import {Range} from "react-date-range";
import {Dictionary} from "../../@types";
import {useSelector} from "../../hooks";
import {langKeys} from "../../lang/keys";
import {cleanViewChange, getMultiCollection, setViewChange} from "../../store/main/actions";

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

    },
    filterComponent: {
        minWidth: "220px",
        maxWidth: "260px",
        marginRight: theme.spacing(0.1),
    },
    chartContainer: {
        marginTop: theme.spacing(2),
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
        minWidth: '150px',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
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
    }
}));

const DashboardOpportunityFunnel: FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [allParameters, setAllParameters] = useState({});
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection",
    });
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

    const format = (date: Date) => date.toISOString().split("T")[0];
    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };

    useEffect(() => {
        dispatch(setViewChange("opportunity_funnel"));
        dispatch(getMultiCollection([
            getReportFilterSel("UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC", "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC", "probando"),
            getAdviserFilteredUserRol(),
            getProducts()
        ]));
        return () => {
            dispatch(cleanViewChange());
        };
    }, []);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div>
                <Box className={classes.filterContainer} component={Paper}>
                    <div className={classes.filterControls}>
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

                                            label={t("opportunity_funnel_channels")}
                                            className={classes.filterComponent}
                                            key={"UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"}
                                            valueDefault={allParameters?.channel || "ayuda"}
                                            onChange={(value) =>
                                                setValue("channel", value?.typedesc || "ayuda2")
                                            }
                                            variant="outlined"
                                            data={
                                                multiData?.data?.find(x => x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC")?.data || []
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
                                        <FieldSelect

                                            label={t("opportunity_funnel_advisor")}
                                            className={classes.filterComponent}
                                            key={"UFN_ADVISERSBYUSERID_SEL"}
                                            valueDefault={allParameters?.advisors || "ayuda"}
                                            onChange={(value) =>
                                                setValue("channel", value?.typedesc || "ayuda2")
                                            }
                                            variant="outlined"
                                            data={
                                                multiData?.data?.find(x => x.key === "UFN_ADVISERSBYUSERID_SEL")?.data || []
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
                                        <FieldSelect

                                            label={t("opportunity_funnel_product")}
                                            className={classes.filterComponent}
                                            key={"UFN_PRODUCT_SEL"}
                                            valueDefault={allParameters?.products || "ayuda"}
                                            onChange={(value) =>
                                                setValue("channel", value?.typedesc || "ayuda2")
                                            }
                                            variant="outlined"
                                            data={
                                                multiData?.data?.find(x => x.key === "UFN_PRODUCT_SEL")?.data || []
                                            }
                                            loading={multiData.loading}
                                            optionDesc={"type"}
                                            optionValue={"typedesc"}
                                        />
                                    </div>
                                </Box>
                            </Box>
                        </div>
                        <Button
                            disabled={detailCustomReport.loading}
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: "#55BD84", width: 120 }}
                            startIcon={<SearchIcon />}
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
                </Box>
                <Paper className={classes.chartContainer}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <ChartTooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </div>
        </MuiPickersUtilsProvider>
    );
};

export default DashboardOpportunityFunnel;
