
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { getCollectionAux, resetMainAux } from "store/main/actions";
import { getUserProductivitySel } from "common/helpers/requestBodies";
import { DateRangePicker, FieldMultiSelect, FieldSelect } from "components";
import { makeStyles } from '@material-ui/core/styles';
import Switch from "@material-ui/core/Switch/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Box, Button, Grid } from "@material-ui/core";
import { CalendarIcon, DownloadIcon, SearchIcon } from "icons";
import { Range } from 'react-date-range';
import IndicatorPanel from "./IndicatorPanel";
import TableZyx from "components/fields/table-simple";
import { exportExcel } from 'common/helpers';
import { langKeys } from "lang/keys";
import { Dictionary, MultiData } from "@types";

interface Assessor {
    row: Dictionary | null;
    multiData: MultiData[];
    allFilters: Dictionary[];
}

const useStyles = makeStyles((theme) => ({
    containerFilter: {
        width: '100%',
        marginBottom: theme.spacing(2),
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap'
    },
    filterComponent: {
        width: '220px'
    },
    containerDetails: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2)
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    containerHeader: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    }
}));

const AssessorProductivity: FC<Assessor> = ({ row, multiData, allFilters }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const detailCustomReport = useSelector(state => state.main.mainAux);
    const [allParameters, setAllParameters] = useState({});
    const [dateRange, setdateRange] = useState<Range>({ startDate: new Date(new Date().setDate(0)), endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), key: 'selection' });
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [state, setState] = useState({ checkedA: false, checkedB: false });

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_userproductivity_userid),
                accessor: 'userid',
                NoFilter: false,
            },
            {
                Header: t(langKeys.report_userproductivity_fullname),
                accessor: 'fullname',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_hourfirstlogin),
                accessor: 'hourfirstlogin',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_totaltickets),
                accessor: 'totaltickets',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_closedtickets),
                accessor: 'closedtickets',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_asignedtickets),
                accessor: 'asignedtickets',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_suspendedtickets),
                accessor: 'suspendedtickets',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_avgfirstreplytime),
                accessor: 'avgfirstreplytime',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_maxfirstreplytime),
                accessor: 'maxfirstreplytime',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_minfirstreplytime),
                accessor: 'minfirstreplytime',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_avgtotalduration),
                accessor: 'avgtotalduration',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_maxtotalduration),
                accessor: 'maxtotalduration',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_mintotalduration),
                accessor: 'mintotalduration',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_avgtotalasesorduration),
                accessor: 'avgtotalasesorduration',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_maxtotalasesorduration),
                accessor: 'maxtotalasesorduration',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_mintotalasesorduration),
                accessor: 'mintotalasesorduration',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_userconnectedduration),
                accessor: 'userconnectedduration',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_userstatus),
                accessor: 'userstatus',
                NoFilter: false
            },
            {
                Header: t(langKeys.report_userproductivity_groups),
                accessor: 'groups',
                NoFilter: false
            }
        ],
        []
    );

    useEffect(() => {
        setAllParameters({
            ...allParameters,
            startdate: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
            enddate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null
        });
    }, [dateRange]);

    const fetchData = () => {
        dispatch(resetMainAux());
        dispatch(getCollectionAux(getUserProductivitySel({ ...allParameters })));
    };

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    }

    const handleChange = (event: any) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        setValue("bot", event.target.checked);
    };

    const format = (date: Date) => date.toISOString().split('T')[0];

    return (
        <>
            <div className={classes.containerFilter}>
                {
                    allFilters.map(filtro => (
                        (filtro.values[0].multiselect ?
                            <FieldMultiSelect
                                label={t('report_' + row?.origin + '_filter_' + filtro.values[0].label || '')}
                                className={classes.filterComponent}
                                key={filtro.values[0].isListDomains ? filtro.values[0].filter + "_" + filtro.values[0].domainname : filtro.values[0].filter}
                                onChange={(value) => setValue(filtro.values[0].parameterName, value ? value.map((o: Dictionary) => o[filtro.values[0].optionValue]).join() : '')}
                                variant="outlined"
                                loading={detailCustomReport.loading}
                                data={multiData[multiData.findIndex(x => x.key === (filtro.values[0].isListDomains ? filtro.values[0].filter + "_" + filtro.values[0].domainname : filtro.values[0].filter))].data}
                                optionDesc={filtro.values[0].optionDesc}
                                optionValue={filtro.values[0].optionValue}
                            />
                            :
                            <FieldSelect
                                loading={detailCustomReport.loading}
                                label={t('report_' + row?.origin + '_filter_' + filtro.values[0].label || '')}
                                className={classes.filterComponent}
                                key={filtro.values[0].isListDomains ? filtro.values[0].filter + "_" + filtro.values[0].domainname : filtro.values[0].filter}
                                onChange={(value) => setValue(filtro.values[0].parameterName, value ? value[filtro.values[0].optionValue] : '')}
                                variant="outlined"
                                data={multiData[multiData.findIndex(x => x.key === filtro.values[0].isListDomains ? filtro.values[0].filter + "_" + filtro.values[0].domainname : filtro.values[0].filter)].data}
                                optionDesc={filtro.values[0].optionDesc}
                                optionValue={filtro.values[0].optionValue}
                            />
                        )
                    )
                    )
                }
                <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <FormControlLabel
                        control={<Switch checked={state.checkedA}
                            onChange={handleChange}
                            name="checkedA" />}
                        label={t(langKeys.report_userproductivity_filter_includebot)}
                    />
                </div>
                <Box width={1} style={{ height: '100%' }}>
                    <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                        <div>
                            <DateRangePicker
                                open={openDateRangeModal}
                                setOpen={setOpenDateRangeModal}
                                range={dateRange}
                                onSelect={setdateRange}
                            >
                                <Button
                                    disabled={detailCustomReport.loading}
                                    style={{ border: '2px solid #EBEAED', borderRadius: 4 }}
                                    startIcon={<CalendarIcon />}
                                    onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                                >
                                    {format(dateRange.startDate!) + " - " + format(dateRange.endDate!)}
                                </Button>
                            </DateRangePicker>
                            <Button
                                disabled={detailCustomReport.loading}
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ backgroundColor: '#55BD84', width: 120 }}
                                onClick={() => {
                                    fetchData()
                                }}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={detailCustomReport.loading}
                            onClick={() => exportExcel("Report", detailCustomReport.data, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                            startIcon={<DownloadIcon />}
                        >{t(langKeys.download)}
                        </Button>
                    </Box>
                </Box>
            </div>

            <div>
                <Grid container spacing={3} style={{ paddingTop: 12, }}>
                    <Grid item xs={12} md={4} lg={4}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12} lg={12}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardtme)}
                                    value=''
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmax)}
                                    value={detailCustomReport.data[0]?.cardavgmaxtme}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardmaxmax)}
                                    value={detailCustomReport.data[0]?.cardmaxmaxtme}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmin)}
                                    value={detailCustomReport.data[0]?.cardavgmintme}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardminmin)}
                                    value={detailCustomReport.data[0]?.cardminmintme}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12} lg={12}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardtmo)}
                                    value=""
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmax)}
                                    value={detailCustomReport.data[0]?.cardavgmaxtmo}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardmaxmax)}
                                    value={detailCustomReport.data[0]?.cardmaxmaxtmo}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmin)}
                                    value={detailCustomReport.data[0]?.cardavgmintmo}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardminmin)}
                                    value={detailCustomReport.data[0]?.cardminmintmo}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12} lg={12}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardtmoadviser)}
                                    value=""
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmax)}
                                    value={detailCustomReport.data[0]?.cardavgmaxtmoasesor}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardmaxmax)}
                                    value={detailCustomReport.data[0]?.cardmaxmaxtmoasesor}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmin)}
                                    value={detailCustomReport.data[0]?.cardavgmintmoasesor}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardminmin)}
                                    value={detailCustomReport.data[0]?.cardminmintmoasesor}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>

            <div className={classes.containerDetails}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} lg={3}>
                        <IndicatorPanel
                            title={t(langKeys.report_userproductivity_totalclosedtickets)}
                            value={detailCustomReport.data[0]?.totalclosedtickets}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <IndicatorPanel
                            title={t(langKeys.report_userproductivity_holdingtickets)}
                            value={detailCustomReport.data[0]?.holdingtickets}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <IndicatorPanel
                            title={t(langKeys.report_userproductivity_asesortickets)}
                            value={detailCustomReport.data[0]?.asesortickets}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <IndicatorPanel
                            title={t(langKeys.report_userproductivity_usersconnected)}
                            value={detailCustomReport.data[0]?.usersconnected}
                        />
                    </Grid>
                </Grid>
            </div>

            <div style={{ width: '100%' }}>
                <TableZyx
                    columns={columns}
                    data={detailCustomReport.data}
                    download={false}
                    loading={detailCustomReport.loading}
                    filterGeneral={false}
                    register={false}
                />
            </div>
        </>
    );
};

export default AssessorProductivity;
