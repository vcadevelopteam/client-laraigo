/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { FieldView, FieldEdit, IOSSwitch } from 'components';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { Box, FormControlLabel } from '@material-ui/core';
import { Refresh as RefreshIcon, CompareArrows } from '@material-ui/icons';
import { formatNumber } from 'common/helpers';
import { getMaximumConsumption, transferAccountBalance, getAccountBalance, updateScenario } from "store/voximplant/actions";

interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface TabVoxChannelProps {
    row:any;
    getValues:any;
    setValue:any;
    errors:any;
    multiData: MultiData[];
}
const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    icon: {
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
        }
    },
    section: {
        fontWeight: "bold"
    }
}));

const TabVoxChannel: React.FC<TabVoxChannelProps> = ({row, getValues, setValue, errors, multiData}) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const defaultRecharge = multiData[6] && multiData[6].success ? multiData[6]?.data : [];
    const getConsumptionResult = useSelector(state => state.voximplant.requestGetMaximumConsumption);
    const transferBalanceResult = useSelector(state => state.voximplant.requestTransferAccountBalance);
    const getBalanceResult = useSelector(state => state.voximplant.requestGetAccountBalance);
    const updateScenarioResult = useSelector(state => state.voximplant.requestUpdateScenario);
    const [waitGetConsumption, setWaitGetConsumption] = useState(false);
    const [waitGetBalance, setWaitGetBalance] = useState(false);
    const [costMaximum, setCostMaximum] = useState(0.00);
    const [costLimit, setCostLimit] = useState(0.00);
    const [fixedAmount, setFixedAmount] = useState(row?.voximplantrechargefixed || 0.00);
    const [percentageAmount, setPercentageAmount] = useState(row?.voximplantrechargepercentage || 0.00);
    const [balanceChild, setBalanceChild] = useState(0.00);
    const [balanceParent, setBalanceParent] = useState(0.00);
    const [rangeAmount, setRangeAmount] = useState(row?.voximplantrechargerange || 0.00);
    const [waitTransferBalance, setWaitTransferBalance] = useState(false);
    const [chargeAmount, setChargeAmount] = useState(0.00);
    const [waitUpdateScenario, setWaitUpdateScenario] = useState(false);
    const [checkedAutomaticRecharge, setCheckedAutomaticRecharge] = useState(row ? (row?.voximplantautomaticrecharge || false) : (defaultRecharge[0]?.propertyvalue === '1' ? true : false));

    const handleGetConsumption = (orgid: any, daterange: any, timezoneoffset: any) => {
        dispatch(getMaximumConsumption({ orgid: orgid, daterange: daterange, timezoneoffset: timezoneoffset }));
        setWaitGetConsumption(true);
        dispatch(showBackdrop(true));
    }

    const handleGetBalance = (orgid: any) => {
        dispatch(getAccountBalance({ orgid: orgid }));
        setWaitGetBalance(true);
        dispatch(showBackdrop(true));
    }

    const handleTransferBalance = (orgid: any, transferamount: any, toparent: boolean) => {
        dispatch(transferAccountBalance({ orgid: orgid, transferamount: (toparent ? transferamount * -1 : transferamount) }));
        setWaitTransferBalance(true);
        dispatch(showBackdrop(true));
        setChargeAmount(0.00);
    }

    const handleUpdateScenario = () => {
        dispatch(updateScenario({}));
        setWaitUpdateScenario(true);
        dispatch(showBackdrop(true));
    }

    useEffect(() => {
        if (waitUpdateScenario) {
            if (!updateScenarioResult.loading) {
                if (!updateScenarioResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((updateScenarioResult.msg || updateScenarioResult.message) || updateScenarioResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitUpdateScenario(false);
            }
        }
    }, [updateScenarioResult, waitUpdateScenario])

    useEffect(() => {
        if (waitTransferBalance) {
            if (!transferBalanceResult.loading) {
                if (!transferBalanceResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((transferBalanceResult.msg || transferBalanceResult.message) || transferBalanceResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitTransferBalance(false);
            }
        }
    }, [transferBalanceResult, waitTransferBalance])

    useEffect(() => {
        if (waitGetConsumption) {
            if (!getConsumptionResult.loading) {
                if (!getConsumptionResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }))
                    if (getConsumptionResult.data) {
                        setCostMaximum(getConsumptionResult.data.maximumconsumption || 0);
                        setCostLimit((parseFloat(fixedAmount) || 0) + ((parseFloat(getConsumptionResult.data.maximumconsumption) || 0) * ((parseFloat(percentageAmount) || 0) + 1)));
                    }
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((getConsumptionResult.msg || getConsumptionResult.message) || getConsumptionResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitGetConsumption(false);
            }
        }
    }, [getConsumptionResult, waitGetConsumption])

    useEffect(() => {
        if (waitGetBalance) {
            if (!getBalanceResult.loading) {
                if (!getBalanceResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (getBalanceResult.data) {
                        setBalanceChild(getBalanceResult.data.balancechild || 0);
                        setBalanceParent(getBalanceResult.data.balanceparent || 0);
                    }
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((getBalanceResult.msg || getBalanceResult.message) || getBalanceResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitGetBalance(false);
            }
        }
    }, [getBalanceResult, waitGetBalance])

    useEffect(() => {
        if (row) {
            if (row?.orgid && row?.voximplantrechargerange) {
                handleGetConsumption(row?.orgid, row?.voximplantrechargerange, row?.timezoneoffset);
                handleGetBalance(row?.orgid);
            }
        }
    }, [row])

    return <>
        <div className={classes.containerDetail}>
            {row?.orgid && <div>
                <div style={{ marginLeft: "auto", marginRight: "0px", float: "right" }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<RefreshIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                        onClick={() => handleGetConsumption(row?.orgid, (getValues('voximplantrechargerange') || 0), (getValues('timezoneoffset') || 0))}
                        disabled={((rangeAmount || 0) <= 0)}
                    >{t(langKeys.calculate)}</Button>
                </div>
            </div>}
            <div className="row-zyx">
                <FieldView
                    className={classes.section}
                    label={''}
                    value={t(langKeys.voximplant_organizationchannelrecharge)}
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.voximplant_organizationchanneladditional)}
                    className="col-6"
                    valueDefault={getValues('voximplantadditionalperchannel')}
                    onChange={(value) => setValue('voximplantadditionalperchannel', value)}
                    error={errors?.voximplantadditionalperchannel?.message}
                    type="number"
                    inputProps={{ step: "any" }}
                />
                <div className={"col-6"} style={{ paddingBottom: '3px' }}>
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.voximplant_organizationenabledrecharge)}</Box>
                    <FormControlLabel
                        style={{ paddingLeft: 10 }}
                        control={<IOSSwitch checked={checkedAutomaticRecharge} onChange={(e) => { setCheckedAutomaticRecharge(e.target.checked); setValue('voximplantautomaticrecharge', e.target.checked) }} />}
                        label={""}
                    />
                </div>
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.voximplant_organizationchannelrange)}
                    className="col-6"
                    valueDefault={getValues('voximplantrechargerange')}
                    onChange={(value) => { setValue('voximplantrechargerange', value); setRangeAmount(value || 0); }}
                    error={errors?.voximplantrechargerange?.message}
                    type="number"
                />
                <FieldEdit
                    label={t(langKeys.voximplant_organizationchannelpercentage)}
                    className="col-6"
                    valueDefault={getValues('voximplantrechargepercentage')}
                    onChange={(value) => { setValue('voximplantrechargepercentage', value); setPercentageAmount(value || 0); }}
                    error={errors?.voximplantrechargepercentage?.message}
                    type="number"
                    inputProps={{ step: "any" }}
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.voximplant_organizationchannelfixed)}
                    className="col-6"
                    valueDefault={getValues('voximplantrechargefixed')}
                    onChange={(value) => { setValue('voximplantrechargefixed', value); setFixedAmount(value || 0); }}
                    error={errors?.voximplantrechargefixed?.message}
                    type="number"
                    inputProps={{ step: "any" }}
                />
            </div>
            <div className="row-zyx">
                <FieldView
                    label={t(langKeys.voximplant_organizationcostmaximum)}
                    value={formatNumber(row?.orgid ? costMaximum : 0)}
                    className="col-6"
                />
                <FieldView
                    label={t(langKeys.voximplant_organizationcostlimit)}
                    value={formatNumber(row?.orgid ? costLimit : 0)}
                    className="col-6"
                />
            </div>
        </div>
        <div className={classes.containerDetail}>
            {row?.orgid && <div>
                <div style={{ marginLeft: "auto", marginRight: "0px", float: "right" }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<CompareArrows color="secondary" />}
                        style={{ backgroundColor: "#55BD84", marginRight: "10px" }}
                        onClick={() => handleTransferBalance(row?.orgid, (chargeAmount || 0), false)}
                        disabled={((chargeAmount || 0) <= 0)}
                    >{t(langKeys.voximplant_organizationchannelcharge)}</Button>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<CompareArrows color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => handleTransferBalance(row?.orgid, (chargeAmount || 0), true)}
                        disabled={((chargeAmount || 0) <= 0)}
                    >{t(langKeys.voximplant_organizationchannelreturn)}</Button>
                </div>
            </div>}
            {row?.orgid && <>
                <div className="row-zyx">
                    <FieldView
                        className={classes.section}
                        label={''}
                        value={t(langKeys.voximplant_organizationmanualrecharge)}
                    />
                </div>
                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.voximplant_organizationchannelamount)}
                        className="col-12"
                        valueDefault={chargeAmount}
                        onChange={(value) => setChargeAmount(value || 0)}
                        type="number"
                        inputProps={{ step: "any" }}
                    />
                </div>
            </>}
        </div>
        <div className={classes.containerDetail}>
            {row?.orgid && <div>
                <div style={{ marginLeft: "auto", marginRight: "0px", float: "right" }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<RefreshIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                        onClick={() => handleGetBalance(row?.orgid)}
                    >{t(langKeys.voximplant_organizationgetcredit)}</Button>
                </div>
            </div>}
            {row?.orgid && <div className="row-zyx">
                <FieldView
                    className={classes.section}
                    label={''}
                    value={t(langKeys.voximplant_organizationchannelcredit)}
                />
            </div>}
            {row?.orgid && <div className="row-zyx">
                <FieldView
                    label={t(langKeys.voximplant_organizationchildcredit)}
                    value={formatNumber(balanceChild || 0)}
                    className="col-6"
                />
                <FieldView
                    label={t(langKeys.voximplant_organizationfathercredit)}
                    value={formatNumber(balanceParent || 0)}
                    className="col-6"
                />
            </div>}
        </div>
        <div className={classes.containerDetail}>
            {row?.orgid && <div>
                <div style={{ marginLeft: "auto", marginRight: "0px", float: "right" }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<RefreshIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                        onClick={() => handleUpdateScenario()}
                    >{t(langKeys.voximplant_organizationupdatescenario)}</Button>
                </div>
            </div>}
            {row?.orgid && <div className="row-zyx">
                <FieldView
                    className={classes.section}
                    label={''}
                    value={t(langKeys.scenario)}
                />
            </div>}
            {row?.orgid && <div className="row-zyx">
                <FieldView
                    label={''}
                    value={t(langKeys.voximplant_organizationupdatescenarioalert)}
                    className="col-12"
                />
            </div>}
            </div>
    </>
}

export default TabVoxChannel;