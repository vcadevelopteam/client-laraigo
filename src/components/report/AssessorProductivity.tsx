/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { getCollectionAux, resetMainAux } from "store/main/actions";
import { getUserProductivitySel } from "common/helpers/requestBodies";
import { DateRangePicker, FieldMultiSelect, FieldSelect, IOSSwitch } from "components";
import { makeStyles } from '@material-ui/core/styles';
import Switch from "@material-ui/core/Switch/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Box, Button, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { CalendarIcon, DownloadIcon, SearchIcon } from "icons";
import { Range } from 'react-date-range';
import IndicatorPanel from "./IndicatorPanel";
import clsx from 'clsx';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
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
    containerHeader: {
        paddingBottom: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
    containerDetails: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    BackGrRed: {
        backgroundColor: "#fb5f5f",
    },
    BackGrGreen: {
        backgroundColor: "#55bd84",
    },
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
    const [checkedA, setcheckedA] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_userproductivity_user),
                accessor: 'usr',
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
                NoFilter: false,
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_closedtickets),
                accessor: 'closedtickets',
                NoFilter: false,
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_asignedtickets),
                accessor: 'asignedtickets',
                NoFilter: false,
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_suspendedtickets),
                accessor: 'suspendedtickets',
                NoFilter: false,
                type: "number",
                sortType: 'number',
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
                NoFilter: false,
                type: "number",
                sortType: 'number',
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
        setcheckedA(event.target.checked)
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
                                data={multiData[multiData.findIndex(x => x.key === (filtro.values[0].isListDomains ? filtro.values[0].filter + "_" + filtro.values[0].domainname : filtro.values[0].filter))].data}
                                optionDesc={filtro.values[0].optionDesc}
                                optionValue={filtro.values[0].optionValue}
                            />
                            :
                            <FieldSelect
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
                <div style={{ display: 'flex', alignItems: 'center' }}> 
                    <div style={{ paddingBottom: '3px' }}>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.report_userproductivity_filter_includebot)}</Box>
                        <FormControlLabel
                            style={{paddingLeft:10}}
                            control={<IOSSwitch checked={checkedA} onChange={handleChange} />}
                            label={checkedA?t(langKeys.yes):"No"}
                        />
                    </div>
                </div>
                <Box width={1}>
                    <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
                                style={{ backgroundColor: '#55BD84', width: 120 }}
                                onClick={() => {
                                    fetchData()
                                }}
                            >{t(langKeys.refresh)}
                            </Button>
                        </div>
                    </Box>
                </Box>
            </div>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4}>
                    <div style={{ padding: 8, border: '2px solid #EAE9E9', borderRadius: '8px' }}>
                        <Grid container spacing={1} style={{ paddingTop: 12 }}>
                            <Grid item xs={12} md={12} lg={12}>
                                <Card className={clsx({
                                    [classes.BackGrGreen]: (detailCustomReport.data[0]?.cardavgavgtme <= detailCustomReport.data[0]?.tmeesperadogeneral),
                                    [classes.BackGrRed]: (detailCustomReport.data[0]?.cardavgavgtme > detailCustomReport.data[0]?.tmeesperadogeneral),
                                })} style={{color: "white"}}>
                                    <CardContent style={{paddingBottom: 10}}>
                                        <Typography variant="h5">
                                            {t(langKeys.report_userproductivity_cardtme)}
                                        </Typography>
                                        <Typography variant="h5" component="div" align="center">
                                            {detailCustomReport.data[0]?.cardavgavgtme}
                                        </Typography>
                                        <Typography variant="subtitle2" style={{display: "flex",width: "100%", paddingTop: 5, justifyContent: "space-between"}}>
                                            {`${t(langKeys.tmeexpected)} ${detailCustomReport.data[0]?.tmeesperadogeneral||""}`}
                                            { (detailCustomReport.data[0]?.cardavgavgtme <= detailCustomReport.data[0]?.tmeesperadogeneral) ? (<ThumbUpIcon/>) : (<ThumbDownIcon/>)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmax_tme)}
                                    value={detailCustomReport.data[0]?.cardavgmaxtme}
                                    value2={detailCustomReport.data[0]?.cardavgmaxtmeuser}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardmaxmax_tme)}
                                    value={detailCustomReport.data[0]?.cardmaxmaxtme}
                                    value2={detailCustomReport.data[0]?.cardmaxmaxtmeuser}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmin_tme)}
                                    value={detailCustomReport.data[0]?.cardavgmintme}
                                    value2={detailCustomReport.data[0]?.cardavgmintmeuser}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardminmin_tme)}
                                    value={detailCustomReport.data[0]?.cardminmintme}
                                    value2={detailCustomReport.data[0]?.cardminmintmeuser}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <div style={{ padding: 8, border: '2px solid #EAE9E9', borderRadius: '8px' }}>
                        <Grid container spacing={1} style={{ paddingTop: 12 }}>
                            <Grid item xs={12} md={12} lg={12}>
                                <Card className={clsx({
                                    [classes.BackGrGreen]: (detailCustomReport.data[0]?.cardavgavgtmo <= detailCustomReport.data[0]?.tmoesperadogeneral),
                                    [classes.BackGrRed]: (detailCustomReport.data[0]?.cardavgavgtmo > detailCustomReport.data[0]?.tmoesperadogeneral),
                                })} style={{color: "white"}}>
                                    <CardContent style={{paddingBottom: 10}}>
                                        <Typography variant="h5">
                                            {t(langKeys.report_userproductivity_cardtmo)}
                                        </Typography>
                                        <Typography variant="h5" component="div" align="center">
                                            {detailCustomReport.data[0]?.cardavgavgtmo}
                                        </Typography>
                                        <Typography variant="subtitle2" style={{display: "flex",width: "100%", paddingTop: 5, justifyContent: "space-between"}}>
                                            {`${t(langKeys.tmoexpected)} ${detailCustomReport.data[0]?.tmoesperadogeneral||""}`}
                                            { (detailCustomReport.data[0]?.cardavgavgtmo <= detailCustomReport.data[0]?.tmoesperadogeneral) ? (<ThumbUpIcon/>) : (<ThumbDownIcon/>)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmax_tmo)}
                                    value={detailCustomReport.data[0]?.cardavgmaxtmo}
                                    value2={detailCustomReport.data[0]?.cardavgmaxtmouser}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardmaxmax_tmo)}
                                    value={detailCustomReport.data[0]?.cardmaxmaxtmo}
                                    value2={detailCustomReport.data[0]?.cardmaxmaxtmouser}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmin_tmo)}
                                    value={detailCustomReport.data[0]?.cardavgmintmo}
                                    value2={detailCustomReport.data[0]?.cardavgmintmouser}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardminmin_tmo)}
                                    value={detailCustomReport.data[0]?.cardminmintmo}
                                    value2={detailCustomReport.data[0]?.cardminmintmouser}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <div style={{ padding: 8, border: '2px solid #EAE9E9', borderRadius: '8px' }}>
                        <Grid container spacing={1} style={{ paddingTop: 12 }}>
                            <Grid item xs={12} md={12} lg={12}>
                                <Card className={clsx({
                                    [classes.BackGrGreen]: (detailCustomReport.data[0]?.cardavgavgtmoasesor < detailCustomReport.data[0]?.tmoasesoresperadogeneral),
                                    [classes.BackGrRed]: (detailCustomReport.data[0]?.cardavgavgtmoasesor > detailCustomReport.data[0]?.tmoasesoresperadogeneral),
                                })} style={{color: "white"}}>
                                    <CardContent style={{paddingBottom: 10}}>
                                        <Typography variant="h5">
                                            {t(langKeys.report_userproductivity_cardtmoadviser)}
                                        </Typography>
                                        <Typography variant="h5" component="div" align="center">
                                            {detailCustomReport.data[0]?.cardavgavgtmoasesor}
                                        </Typography>
                                        <Typography variant="subtitle2" style={{display: "flex",width: "100%", paddingTop: 5, justifyContent: "space-between"}}>
                                            {`${t(langKeys.tmoadviserexpected)} ${detailCustomReport.data[0]?.tmoasesoresperadogeneral||""}`}
                                            { (detailCustomReport.data[0]?.cardavgavgtmoasesor <= detailCustomReport.data[0]?.tmoasesoresperadogeneral) ? (<ThumbUpIcon/>) : (<ThumbDownIcon/>)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmax_tmoagent)}
                                    value={detailCustomReport.data[0]?.cardavgmaxtmoasesor}
                                    value2={detailCustomReport.data[0]?.cardavgmaxtmoasesoruser}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardmaxmax_tmoagent)}
                                    value={detailCustomReport.data[0]?.cardmaxmaxtmoasesor}
                                    value2={detailCustomReport.data[0]?.cardmaxmaxtmoasesoruser}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardavgmin_tmoagent)}
                                    value={detailCustomReport.data[0]?.cardavgmintmoasesor}
                                    value2={detailCustomReport.data[0]?.cardavgmintmoasesoruser}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6}>
                                <IndicatorPanel
                                    title={t(langKeys.report_userproductivity_cardminmin_tmoagent)}
                                    value={detailCustomReport.data[0]?.cardminmintmoasesor}
                                    value2={detailCustomReport.data[0]?.cardminmintmoasesoruser}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerDetails}>
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
                        title={`${t(langKeys.report_userproductivity_usersconnected)} ${new Date().toLocaleDateString(undefined, {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", second: "numeric"})}`}
                        value={detailCustomReport.data[0]?.usersconnected}
                    />
                </Grid>
            </Grid>

            <Box width={1} style={{display: "flex", justifyContent: "flex-end"}}>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={detailCustomReport.loading}
                    onClick={() => exportExcel("report" + (new Date().toISOString()), detailCustomReport.data, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                    startIcon={<DownloadIcon />}
                >{t(langKeys.download)}
                </Button>
            </Box>

            <TableZyx
                columns={columns}
                data={detailCustomReport.data}
                download={false}
                loading={detailCustomReport.loading}
                filterGeneral={false}
                register={false}
            />
        </>
    )
};

export default AssessorProductivity;