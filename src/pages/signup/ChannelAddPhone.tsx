/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import { Button, IconButton, InputAdornment, makeStyles, Typography, FormControlLabel } from "@material-ui/core";
import { FieldEdit, FieldSelect, IOSSwitchPurple } from "components";
import { FC, useEffect, useState, useContext } from "react";
import { getCategories, getCountryStates, getRegions } from "store/voximplant/actions";
import { getName } from "country-list";
import { langKeys } from "lang/keys";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useSelector } from "hooks";
import { Trans, useTranslation } from "react-i18next";
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@material-ui/icons';
import { MainData, SubscriptionContext, usePlanData } from "./context";
import { useFormContext } from "react-hook-form";
import { formatNumber } from "common/helpers";

import InfoIcon from "@material-ui/icons/Info";
import paths from "common/constants/paths";
import PhoneIcon from "@material-ui/icons/Phone";
import Tooltip from "@material-ui/core/Tooltip";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "180px",
    },
    containerDetail: {
        background: "#fff",
        borderRadius: "6px",
        boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
        marginBottom: "40px",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        width: "80%",
    },
    containerCapacities: {
        background: "#EFEFF4",
        borderRadius: "6px",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "20px",
        paddingLeft: "10px",
        paddingRight: "10px",
        padding: theme.spacing(2),
        width: "100%",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    containerItem: {
        display: "flex",
        marginLeft: 0,
        paddingLeft: 50,
        marginRight: 20,
        alignItems: "center",
        justifyContent: "center",
        width: 120,
    },
}));

export const ChannelAddPhone: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const dataRecordingStorage = [{ value: "month3", text: t(langKeys.voicechannel_recordingmonth3) }, { value: "month6", text: t(langKeys.voicechannel_recordingmonth6) }, { value: "year1", text: t(langKeys.voicechannel_recordingyear1) }, { value: "year2", text: t(langKeys.voicechannel_recordingyear2) }, { value: "year3", text: t(langKeys.voicechannel_recordingyear3) }];
    const dataRecordingQuality = [{ value: "default", text: t(langKeys.voicechannel_recordingdefault) }, { value: "hd", text: t(langKeys.voicechannel_recordinghd) }, { value: "lossless", text: t(langKeys.voicechannel_recordinglossless) }];

    const categoriesResult = useSelector(state => state.voximplant.requestGetCategories);
    const classes = useChannelAddStyles();
    const countryStatesResult = useSelector(state => state.voximplant.requestGetCountryStates);
    const executeResult = useSelector(state => state.channel.successinsert);
    const history = useHistory();
    const regionsResult = useSelector(state => state.voximplant.requestGetRegions);
    const mainResult = useSelector(state => state.channel.channelList);
    const { getValues, setValue, register, unregister, formState: { errors } } = useFormContext<MainData>();

    const planData = usePlanData();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [phoneTax, setPhoneTax] = useState(planData?.plan?.phonetax || 0);
    const [checkedRecording, setCheckedRecording] = useState(false);
    const [checkedSms, setCheckedSms] = useState(false);
    const [checkedOutbound, setCheckedOutbound] = useState(false);
    const [checkedCallSupervision, setCheckedCallSupervision] = useState(false);
    const [categoryList, setCategoryList] = useState<any>([]);
    const [countryList, setCountryList] = useState<any>([]);
    const [hasStates, setHasStates] = useState(false);
    const [hasRegions, setHasRegions] = useState(false);
    const [nextButton, setNextButton] = useState(true);
    const [phoneBackup, setPhoneBackup] = useState(0.00);
    const [phonePrice, setPhonePrice] = useState(0.00);
    const [phoneInstallation, setPhoneInstallation] = useState(0.00);
    const [phoneInstallationBackup, setPhoneInstallationBackup] = useState(0.00);
    const [regionList, setRegionList] = useState<any>([]);
    const [setInsert, setSetInsert] = useState(false);
    const [stateList, setStateList] = useState<any>([]);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitCategories, setWaitCategories] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitRegions, setWaitRegions] = useState(false);
    const [waitStates, setWaitStates] = useState(false);
    const [hasFinished, setHasFinished] = useState(false)

    useEffect(() => {
        dispatch(getCategories({}));
        setWaitCategories(true);
    }, [])

    const openPricingPage = () => {
        window.open("https://laraigo.com/en/pricing/", '_blank');
    }

    useEffect(() => {
        if (phonePrice) {
            setValue("channels.voximplantphone.cost", (phonePrice || 0))
            setValue("channels.voximplantphone.costinstallation", (phoneInstallation || 0))
            setValue("channels.voximplantphone.costvca", (formatNumber((phonePrice || 0) * (1 + (phoneTax || 0)))).toString())
        }
        else {
            setValue("channels.voximplantphone.cost", (0))
            setValue("channels.voximplantphone.costinstallation", (0))
            setValue("channels.voximplantphone.costvca", "0")
        }
    }, [phonePrice, phoneInstallation])

    useEffect(() => {
        const strRequired = (value: string, other?: boolean) => {
            if (!other) {
                if (!value) {
                    return t(langKeys.field_required);
                }
            }
        }
        register('channels.voximplantphone.country', { validate: strRequired, value: '' });
        register('channels.voximplantphone.category', { validate: strRequired, value: '' });
        register('channels.voximplantphone.region', { validate: hasRegions ? strRequired : () => { return undefined }, value: '' });
        register('channels.voximplantphone.state', { validate: hasStates ? strRequired : () => { return undefined }, value: '' });
        register('channels.voximplantphone.description', { validate: strRequired, value: '' });
        register('channels.voximplantphone.build', {
            value: values => ({
                "method": "UFN_COMMUNICATIONCHANNEL_INS",
                "parameters": {
                    "id": 0,
                    "description": values.description,
                    "type": "",
                    "communicationchannelsite": "",
                    "communicationchannelowner": "",
                    "chatflowenabled": true,
                    "integrationid": "",
                    "color": "",
                    "icons": "",
                    "other": "",
                    "form": "",
                    "apikey": "",
                    "coloricon": "#90c900",
                },
                "service": {
                    "category": values.category,
                    "country": values.country,
                    "region": values.region,
                    "state": values.state,
                    "categoryname": values.categoryname,
                    "countryname": values.countryname,
                    "regionname": values.regionname,
                    "statename": values.statename,
                    "cost": values.cost,
                    "costvca": values.costvca,
                    "costinstallation": values.costinstallation,
                    "recording": values.recording,
                    "sms": values.sms,
                    "outbound": values.outbound,
                    "recordingstorage": values.recordingstorage,
                    "recordingquality": values.recordingquality,
                },
                "type": "VOXIMPLANTPHONE",
            })
        });

        return () => {
            unregister('channels.voximplantphone')
        }
    }, [register, unregister]);

    useEffect(() => {
        dispatch(getCategories({}));
        setWaitCategories(true);
    }, [])

    useEffect(() => {
        if (phonePrice) {
            setValue('channels.voximplantphone.cost', phonePrice || 0)
        }
        else {
            setValue('channels.voximplantphone.cost', 0)
        }
    }, [phonePrice])

    useEffect(() => {
        if (phoneInstallation) {
            setValue('channels.voximplantphone.costinstallation', phoneInstallation || 0)
        }
        else {
            setValue('channels.voximplantphone.costinstallation', 0)
        }
    }, [phoneInstallation])

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])

    useEffect(() => {
        if (!mainResult.loading && setInsert) {
            if (executeResult) {
                setSetInsert(false);
                setWaitSave(false);

                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));

                history.push(paths.CHANNELS);
            } else if (!executeResult) {
                setWaitSave(false);

                dispatch(showSnackbar({ show: true, severity: "error", message: t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
            }
        }
    }, [mainResult])

    useEffect(() => {
        disableNextButton();
    }, [regionList])

    useEffect(() => {
        if (waitCategories) {
            if (!categoriesResult.loading) {
                if (categoriesResult.data) {
                    var temporalData = categoriesResult.data;
                    temporalData.forEach(function (element: any) {
                        element.country_name = getName(element.country_code);
                    });
                    setCountryList(temporalData);
                }
                setWaitCategories(false);
            }
        }
    }, [categoriesResult, waitCategories])

    useEffect(() => {
        if (waitStates) {
            if (!countryStatesResult.loading) {
                if (countryStatesResult.data) {
                    setStateList(countryStatesResult.data);
                }
                setWaitStates(false);
            }
        }
    }, [countryStatesResult, waitStates])

    useEffect(() => {
        if (waitRegions) {
            if (!regionsResult.loading) {
                if (regionsResult.data) {
                    setRegionList(regionsResult.data.filter((data: { phone_count: number; regulation_address_type: string; }) => data.phone_count > 0 && !data.regulation_address_type));
                }
                setWaitRegions(false);
            }
        }
    }, [regionsResult, waitRegions])

    function disableNextButton() {
        setNextButton(true);
        if (getValues('channels.voximplantphone.category') && getValues('channels.voximplantphone.country')) {
            if (getValues('channels.voximplantphone.region')) {
                if (hasStates) {
                    if (getValues('channels.voximplantphone.state')) {
                        if (getValues('channels.voximplantphone.recording')) {
                            if (getValues('channels.voximplantphone.recordingquality') && getValues('channels.voximplantphone.recordingstorage')) {
                                setNextButton(false);
                            }
                        }
                        else {
                            setNextButton(false);
                        }
                    }
                }
                else {
                    if (getValues('channels.voximplantphone.recording')) {
                        if (getValues('channels.voximplantphone.recordingquality') && getValues('channels.voximplantphone.recordingstorage')) {
                            setNextButton(false);
                        }
                    }
                    else {
                        setNextButton(false);
                    }
                }
            }
        }
    }

    const handleSwitchRecordingQuality = (value: any) => {
        setValue('channels.voximplantphone.recordingquality', value);

        disableNextButton();
    }

    const handleSwitchRecordingStorage = (value: any) => {
        setValue('channels.voximplantphone.recordingstorage', value);

        disableNextButton();
    }

    const handleSwitchRecording = (value: boolean) => {
        setValue('channels.voximplantphone.recording', value);

        if (!value ) {
            setValue('channels.voximplantphone.recordingquality', '');
            setValue('channels.voximplantphone.recordingquality', '');
        }

        disableNextButton();
    }

    const handleSwitchSms = (value: boolean) => {
        setValue('channels.voximplantphone.sms', value);

        disableNextButton();
    }

    const handleSwitchOutbound = (value: boolean) => {
        setValue('channels.voximplantphone.outbound', value);

        disableNextButton();
    }

    const handleSwitchCallSupervison = (value: boolean) => {
        //setValue('channels.voximplantphone.callsupervision', value);

        disableNextButton();
    }

    const handleCountry = (value: any) => {
        if (value) {
            setCategoryList(value.phone_categories || []);
            setValue('channels.voximplantphone.country', value.country_code)
            setValue('channels.voximplantphone.countryname', value.country_name)
        } else {
            setHasRegions(false);
            setHasStates(false);
            setPhoneBackup(0.00);
            setPhonePrice(0.00);
            setPhoneInstallation(0.00);
            setPhoneInstallationBackup(0.00);
            setCategoryList([]);
            setRegionList([]);
            setStateList([]);
            setValue('channels.voximplantphone.country', "")
            setValue('channels.voximplantphone.countryname', "")
        }
        setValue('channels.voximplantphone.category', "")
        setValue('channels.voximplantphone.region', "")
        setValue('channels.voximplantphone.state', "")
        setValue('channels.voximplantphone.categoryname', "")
        setValue('channels.voximplantphone.regionname', "")
        setValue('channels.voximplantphone.statename', "")
        disableNextButton();
    }

    const handleCategory = (value: any) => {
        if (value) {
            setHasStates(value.country_has_states || false);
            setPhoneBackup(value.phone_price || 0.00);
            setPhonePrice(value.phone_price || 0.00);
            setPhoneInstallation(value.phone_installation_price || 0.00);
            setPhoneInstallationBackup(value.phone_installation_price || 0.00);
            if (value.country_has_states) {
                dispatch(getCountryStates({ country_code: getValues('channels.voximplantphone.country'), phone_category_name: value.phone_category_name }));

                setHasRegions(false);
                setRegionList([]);
                setWaitStates(true);
            }
            else {
                setHasRegions(true);
                setStateList([]);

                dispatch(getRegions({ country_code: getValues('channels.voximplantphone.country'), phone_category_name: value.phone_category_name }));
                setWaitRegions(true);
            }
            setValue('channels.voximplantphone.category', value.phone_category_name)
            setValue('channels.voximplantphone.categoryname', value.phone_category_name)
        }
        else {
            setHasRegions(false);
            setHasStates(false);
            setPhoneBackup(0.00);
            setPhonePrice(0.00);
            setPhoneInstallation(0.00);
            setPhoneInstallationBackup(0.00);
            setRegionList([]);
            setStateList([]);
            setValue('channels.voximplantphone.category', "")
            setValue('channels.voximplantphone.categoryname', "")
        }
        setValue('channels.voximplantphone.region', "")
        setValue('channels.voximplantphone.state', "")
        setValue('channels.voximplantphone.regionname', "")
        setValue('channels.voximplantphone.statename', "")
        disableNextButton();
    }

    const handleState = (value: any) => {
        if (value) {
            setValue('channels.voximplantphone.state', value.country_state)
            setValue('channels.voximplantphone.statename', value.country_state_name)
            setHasRegions(true);

            dispatch(getRegions({ country_code: getValues('channels.voximplantphone.country'), phone_category_name: getValues('channels.voximplantphone.category'), country_state: value.country_state }));
            setWaitRegions(true);
        }
        else {
            setHasRegions(false);
            setRegionList([]);
            setValue('channels.voximplantphone.state', "")
            setValue('channels.voximplantphone.statename', "")
        }
        setValue('channels.voximplantphone.region', "")
        setValue('channels.voximplantphone.regionname', "")
        disableNextButton();
    }

    const handleRegion = (value: any) => {
        if (value) {
            setPhonePrice((value.phone_price || phoneBackup) || 0.00);
            setPhoneInstallation((value.phone_installation_price || phoneInstallationBackup) || 0.00);
            setValue('channels.voximplantphone.region', value.phone_region_id)
            setValue('channels.voximplantphone.regionname', value.phone_region_name)
        }
        else {
            setPhonePrice(phoneBackup || 0.00);
            setPhoneInstallation(phoneInstallationBackup || 0.00);
            setValue('channels.voximplantphone.region', "")
            setValue('channels.voximplantphone.regionname', "")
        }
        disableNextButton();
    }

    if (viewSelected === "view1") {
        return (
            <div style={{ width: "100%" }}>
                <div>
                    <div className={classes.containerDetail}>
                        <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.voximplant_buynumber)}</div>
                        <div className={classes.containerCapacities}>
                            <div style={{ verticalAlign: "middle", marginRight: "30px" }}>
                                <b>{t(langKeys.voicechannel_capacities)}</b>
                            </div>
                            <div className={classes.containerItem}>
                                <FormControlLabel
                                    control={<IOSSwitchPurple checked={checkedRecording} onChange={(e) => { setCheckedRecording(e.target.checked); handleSwitchRecording(e.target.checked); }} />}
                                    label={""}
                                    style={{ marginRight: "4px" }}
                                />
                                {t(langKeys.voicechannel_recording)}
                                <Tooltip title={`${t(langKeys.voicechannel_recordingtooltip)}`} placement="top-start">
                                    <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                </Tooltip>
                            </div>
                            <div className={classes.containerItem}>
                                <FormControlLabel
                                    control={<IOSSwitchPurple checked={checkedSms} onChange={(e) => { setCheckedSms(e.target.checked); handleSwitchSms(e.target.checked); }} />}
                                    label={""}
                                    style={{ marginRight: "4px" }}
                                />
                                {t(langKeys.voicechannel_sms)}
                                <Tooltip title={`${t(langKeys.voicechannel_smstooltip)}`} placement="top-start">
                                    <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                </Tooltip>
                            </div>
                            <div className={classes.containerItem}>
                                <FormControlLabel
                                    control={<IOSSwitchPurple checked={checkedOutbound} onChange={(e) => { setCheckedOutbound(e.target.checked); handleSwitchOutbound(e.target.checked); }} />}
                                    label={""}
                                    style={{ marginRight: "4px" }}
                                />
                                {t(langKeys.voicechannel_outbound)}
                                <Tooltip title={`${t(langKeys.voicechannel_outboundtooltip)}`} placement="top-start">
                                    <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                </Tooltip>
                            </div>
                            <div className={classes.containerItem}>
                                <FormControlLabel
                                    control={<IOSSwitchPurple checked={checkedCallSupervision} onChange={(e) => { setCheckedCallSupervision(e.target.checked); handleSwitchCallSupervison(e.target.checked); }} />}
                                    label={""}
                                    style={{ marginRight: "4px" }}
                                />
                                {t(langKeys.voicechannel_callsupervisor)}
                                <Tooltip title={`${t(langKeys.voicechannel_callsupervisortooltip)}`} placement="top-start">
                                    <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-12"
                                data={countryList}
                                label={t(langKeys.country)}
                                loading={categoriesResult.loading}
                                onChange={(value: any) => { handleCountry(value); }}
                                optionDesc="country_name"
                                optionValue="country_code"
                                orderbylabel={true}
                                variant="outlined"
                                valueDefault={getValues('channels.voximplantphone.country')}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-12"
                                data={categoryList}
                                label={t(langKeys.category)}
                                loading={categoriesResult.loading}
                                onChange={(value: any) => { handleCategory(value); }}
                                optionDesc="phone_category_name"
                                optionValue="phone_category_name"
                                orderbylabel={true}
                                variant="outlined"
                                valueDefault={getValues('channels.voximplantphone.category')}
                                uset={true}
                                prefixTranslation="voximplantcategory_"
                            />
                        </div>
                        {hasStates && <div className="row-zyx">
                            <FieldSelect
                                className="col-12"
                                data={stateList}
                                label={t(langKeys.voximplant_state)}
                                loading={countryStatesResult.loading}
                                onChange={(value: any) => { handleState(value); }}
                                optionDesc="country_state_name"
                                optionValue="country_state"
                                orderbylabel={true}
                                variant="outlined"
                                valueDefault={getValues('channels.voximplantphone.state')}
                            />
                        </div>}
                        {hasRegions && <div className="row-zyx">
                            <FieldSelect
                                className="col-12"
                                data={regionList}
                                label={t(langKeys.voximplant_region)}
                                loading={regionsResult.loading}
                                onChange={(value: any) => { handleRegion(value); }}
                                optionDesc="phone_region_name"
                                optionValue="phone_region_id"
                                orderbylabel={true}
                                variant="outlined"
                                valueDefault={getValues('channels.voximplantphone.region')}
                            />
                        </div>}
                        {checkedRecording && <div className="row-zyx">
                            <FieldSelect
                                className="col-12"
                                data={dataRecordingStorage}
                                label={t(langKeys.voicechannel_recording)}
                                onChange={(value: any) => { handleSwitchRecordingStorage(value); }}
                                optionDesc="text"
                                optionValue="value"
                                variant="outlined"
                                valueDefault={getValues('channels.voximplantphone.recordingstorage')}
                            />
                        </div>}
                        {checkedRecording && <div className="row-zyx">
                            <FieldSelect
                                className="col-12"
                                data={dataRecordingQuality}
                                label={t(langKeys.voicechannel_recordingquality)}
                                onChange={(value: any) => { handleSwitchRecordingQuality(value); }}
                                optionDesc="text"
                                optionValue="value"
                                variant="outlined"
                                valueDefault={getValues('channels.voximplantphone.recordingquality')}
                            />
                        </div>}
                        <div className="row-zyx">
                            <div style={{ display: "inline-block" }}>
                                <div>
                                    <b style={{ paddingLeft: "6px" }}>{t(langKeys.voximplant_pricealert)}</b>
                                    <Tooltip title={`${t(langKeys.voximplant_tooltip)}`} placement="top-start">
                                        <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                    </Tooltip>
                                    <b style={{ paddingRight: "20px", textAlign: "right", alignContent: "right", float: "right" }}>{`$${formatNumber(phonePrice * (1 + (phoneTax || 0)))}`}</b>
                                </div>
                            </div>
                        </div>
                        {(checkedRecording || checkedSms || checkedOutbound || checkedCallSupervision) && <div className="row-zyx">
                            <div style={{ display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                                <p><b style={{ color: "#762AA9" }}>{t(langKeys.voicechannel_recordingalert)}</b><a style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={openPricingPage} rel="noopener noreferrer">https://laraigo.com/en/pricing/</a></p>
                            </div>
                        </div>}
                    </div>
                    <div style={{ paddingLeft: "64%" }}>
                        <Button
                            disabled={nextButton || regionsResult.loading}
                            onClick={() => { setViewSelected("view2") }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.next)}
                        </Button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={commonClasses.root}>
                {!hasFinished && <PhoneIcon className={commonClasses.leadingIcon} />}
                {!hasFinished && <IconButton
                    color="primary"
                    className={commonClasses.trailingIcon}
                    onClick={() => {
                        deleteChannel('voximplantphone');
                        // setrequestchannels(prev => prev.filter(x => x.type !== "SMOOCHIOS"));
                    }}
                >
                    <DeleteOutlineIcon />
                </IconButton>}
                {!hasFinished && <Typography>
                    <Trans i18nKey={langKeys.subscription_genericconnect} />
                </Typography>}
                {hasFinished && <PhoneIcon
                    style={{ width: 100, height: 100, alignSelf: 'center' }} />
                }
                {hasFinished && (
                    <div style={{ alignSelf: 'center' }}>
                        <Typography
                            color="primary"
                            style={{ fontSize: '1.5vw', fontWeight: 'bold', textAlign: 'center' }}>
                            {t(langKeys.subscription_congratulations)}
                        </Typography>
                        <Typography
                            color="primary"
                            style={{ fontSize: '1.2vw', fontWeight: 500 }}>
                            {t(langKeys.subscription_message1)} {t(langKeys.channel_phone)} {t(langKeys.subscription_message2)}
                        </Typography>
                    </div>
                )}
                <FieldEdit
                    onChange={(val: string) => {
                        setValue('channels.voximplantphone.description', val);
                        if (val.length > 0 && !hasFinished) {
                            setHasFinished(true);
                        } else if (val.length === 0 && hasFinished) {
                            setHasFinished(false);
                        }
                    }}
                    valueDefault={getValues('channels.voximplantphone.description')}
                    label={t(langKeys.givechannelname)}
                    variant="outlined"
                    size="small"
                    error={errors.channels?.voximplantphone?.description?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {hasFinished ? <LinkIcon color="primary" /> : <LinkOffIcon />}
                            </InputAdornment>
                        )
                    }}
                />
            </div>
        )
    }
}