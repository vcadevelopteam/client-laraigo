import { Box, Breadcrumbs, Button, makeStyles, FormControlLabel } from "@material-ui/core";
import { ChannelPhone } from "icons";
import { ColorInput, FieldEdit, FieldSelect, FieldView, IOSSwitchPurple } from "components";
import { formatNumber, getPhoneTax } from "common/helpers";
import { getCategories, getCountryStates, getRegions } from "store/voximplant/actions";
import { getMultiCollection } from "store/main/actions";
import { getName } from "country-list";
import { insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import { Dictionary, IChannel } from "@types";

import InfoIcon from "@material-ui/icons/Info";
import Link from "@material-ui/core/Link";
import paths from "common/constants/paths";
import Tooltip from "@material-ui/core/Tooltip";
import ChannelEnableVirtualAssistant from "./ChannelEnableVirtualAssistant";
import React, { FC, useEffect, useState } from "react";

interface WhatsAppData {
    row?: unknown;
    typeWhatsApp?: string;
    onboarding?: boolean;
}

const useChannelAddStyles = makeStyles((theme) => ({
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
        width: "50%",
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

export const ChannelAddPhone: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const categoriesResult = useSelector((state) => state.voximplant.requestGetCategories);
    const classes = useChannelAddStyles();
    const countryStatesResult = useSelector((state) => state.voximplant.requestGetCountryStates);
    const executeResult = useSelector((state) => state.channel.successinsert);
    const multiResult = useSelector((state) => state.main.multiData);
    const history = useHistory();
    const location = useLocation<WhatsAppData>();
    const regionsResult = useSelector((state) => state.voximplant.requestGetRegions);
    const mainResult = useSelector((state) => state.channel.channelList);
    const whatsAppData = location.state as WhatsAppData | null;

    const channel = whatsAppData?.row as IChannel | null;

    const dataRecordingStorage = [
        { value: "month3", text: t(langKeys.voicechannel_recordingmonth3) },
        { value: "month6", text: t(langKeys.voicechannel_recordingmonth6) },
        { value: "year1", text: t(langKeys.voicechannel_recordingyear1) },
        { value: "year2", text: t(langKeys.voicechannel_recordingyear2) },
        { value: "year3", text: t(langKeys.voicechannel_recordingyear3) },
    ];

    const dataRecordingQuality = [
        { value: "default", text: t(langKeys.voicechannel_recordingdefault) },
        { value: "hd", text: t(langKeys.voicechannel_recordinghd) },
        { value: "lossless", text: t(langKeys.voicechannel_recordinglossless) },
    ];

    const [checkedRecording, setCheckedRecording] = useState(false);
    const [checkedSms, setCheckedSms] = useState(false);
    const [checkedOutbound, setCheckedOutbound] = useState(false);
    const [checkedCallSupervision, setCheckedCallSupervision] = useState(false);
    const [dataPaymentPlan, setDataPaymentPlan] = useState<Dictionary[]>([]);
    const [categoryList, setCategoryList] = useState<Dictionary[]>([]);
    const [countryList, setCountryList] = useState<Dictionary[]>([]);
    const [channelreg, setChannelreg] = useState(true);
    const [coloricon, setColoricon] = useState("#1A0E40");
    const [hasStates, setHasStates] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasRegions, setHasRegions] = useState(false);
    const [nextButton, setNextButton] = useState(true);
    const [phoneBackup, setPhoneBackup] = useState(0.0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phonePrice, setPhonePrice] = useState(0.0);
    const [phoneInstallation, setPhoneInstallation] = useState(0.0);
    const [phoneInstallationBackup, setPhoneInstallationBackup] = useState(0.0);
    const [phoneTax, setPhoneTax] = useState(0.0);
    const [regionList, setRegionList] = useState<Dictionary[]>([]);
    const [setInsert, setSetInsert] = useState(false);
    const [stateList, setStateList] = useState<Dictionary[]>([]);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitCategories, setWaitCategories] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitPlan, setWaitPlan] = useState(false);
    const [waitRegions, setWaitRegions] = useState(false);
    const [waitStates, setWaitStates] = useState(false);

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        type: "VOXIMPLANTPHONE",
        parameters: {
            apikey: "",
            chatflowenabled: true,
            color: "",
            coloricon: "#1A0E40",
            communicationchannelowner: "",
            communicationchannelsite: "",
            description: "",
            form: "",
            icons: "",
            id: edit && channel ? channel.communicationchannelid : 0,
            integrationid: "",
            other: "",
            type: "",
            voximplantcallsupervision: false,
        },
        service: {
            category: "",
            categoryname: "",
            country: "",
            countryname: "",
            region: "",
            regionname: "",
            state: "",
            statename: "",
            cost: "",
            costvca: "",
            costinstallation: "",
            recording: false,
            sms: false,
            outbound: false,
            callsupervision: false,
            recordingstorage: "",
            recordingquality: "",
        },
    });

    useEffect(() => {
        dispatch(getCategories({}));
        dispatch(getMultiCollection([getPhoneTax()]));
        setWaitCategories(true);
        setWaitPlan(true);
    }, []);

    const openPricingPage = () => {
        window.open("https://laraigo.com/en/pricing/", "_blank");
    };

    useEffect(() => {
        if (!multiResult.loading && waitPlan) {
            setWaitPlan(false);
            setDataPaymentPlan(multiResult?.data[0]?.success ? multiResult.data[0].data : []);
        }
    }, [multiResult]);

    useEffect(() => {
        setPhoneTax(0.0);
        if (dataPaymentPlan) {
            if (dataPaymentPlan.length > 0) {
                setPhoneTax(dataPaymentPlan[0].vcacomissionpervoicechannel || 0);
            }
        }
    }, [dataPaymentPlan]);

    useEffect(() => {
        if (phonePrice) {
            const partialFields = fields;
            partialFields.service.cost = (phonePrice || 0).toString();
            partialFields.service.costinstallation = (phoneInstallation || 0).toString();
            partialFields.service.costvca = formatNumber((phonePrice || 0) * (1 + (phoneTax || 0))).toString();
            setFields(partialFields);
        } else {
            const partialFields = fields;
            partialFields.service.cost = "0";
            partialFields.service.costinstallation = "0";
            partialFields.service.costvca = "0";
            setFields(partialFields);
        }
    }, [phonePrice, phoneInstallation]);

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult]);

    useEffect(() => {
        if (!mainResult.loading && setInsert) {
            if (executeResult) {
                setSetInsert(false);
                setWaitSave(false);

                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));

                if (mainResult.data) {
                    if (mainResult.data[0]) {
                        setHasNumber(true);
                        setPhoneNumber(mainResult.data[0].integrationId);
                    }
                }
            } else if (!executeResult) {
                setWaitSave(false);

                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(mainResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.property).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
            }
        }
    }, [mainResult]);

    useEffect(() => {
        disableNextButton();
    }, [regionList]);

    useEffect(() => {
        if (waitCategories) {
            if (!categoriesResult.loading) {
                if (categoriesResult.data) {
                    const temporalData = categoriesResult.data;
                    temporalData.forEach(function (element: {
                        country_name: string | undefined;
                        country_code: string;
                    }) {
                        element.country_name = getName(element.country_code);
                    });
                    setCountryList(temporalData);
                }
                setWaitCategories(false);
            }
        }
    }, [categoriesResult, waitCategories]);

    useEffect(() => {
        if (waitStates) {
            if (!countryStatesResult.loading) {
                if (countryStatesResult.data) {
                    setStateList(countryStatesResult.data);
                }
                setWaitStates(false);
            }
        }
    }, [countryStatesResult, waitStates]);

    useEffect(() => {
        if (waitRegions) {
            if (!regionsResult.loading) {
                if (regionsResult.data) {
                    setRegionList(
                        regionsResult.data.filter(
                            (data: { phone_count: number; regulation_address_type: string }) =>
                                data.phone_count > 0 && !data.regulation_address_type
                        )
                    );
                }
                setWaitRegions(false);
            }
        }
    }, [regionsResult, waitRegions]);

    function disableNextButton() {
        setNextButton(true);
        if (fields) {
            if (fields.service) {
                if (fields.service.category && fields.service.country) {
                    if (fields.service.region) {
                        if (hasStates) {
                            if (fields.service.state) {
                                if (fields.service.recording) {
                                    if (fields.service.recordingquality && fields.service.recordingstorage) {
                                        setNextButton(false);
                                    }
                                } else {
                                    setNextButton(false);
                                }
                            }
                        } else if (fields.service.recording) {
                            if (fields.service.recordingquality && fields.service.recordingstorage) {
                                setNextButton(false);
                            }
                        } else {
                            setNextButton(false);
                        }
                    }
                }
            }
        }
    }

    const handleSwitchRecordingQuality = (value: string) => {
        const partialFields = fields;
        partialFields.service.recordingquality = value;
        setFields(partialFields);

        disableNextButton();
    };

    const handleSwitchRecordingStorage = (value: string) => {
        const partialFields = fields;
        partialFields.service.recordingstorage = value;
        setFields(partialFields);

        disableNextButton();
    };

    const handleSwitchRecording = (value: boolean) => {
        const partialFields = fields;
        partialFields.service.recording = value;

        if (!value) {
            partialFields.service.recordingquality = "";
            partialFields.service.recordingstorage = "";
        }

        setFields(partialFields);

        disableNextButton();
    };

    const handleSwitchSms = (value: boolean) => {
        const partialFields = fields;
        partialFields.service.sms = value;
        setFields(partialFields);

        disableNextButton();
    };

    const handleSwitchOutbound = (value: boolean) => {
        const partialFields = fields;
        partialFields.service.outbound = value;
        setFields(partialFields);

        disableNextButton();
    };

    const handleSwitchCallSupervison = (value: boolean) => {
        const partialFields = fields;
        partialFields.parameters.voximplantcallsupervision = value;
        setFields(partialFields);

        disableNextButton();
    };

    const handleCountry = (value: { phone_categories: Dictionary[]; country_code: string; country_name: string }) => {
        if (value) {
            setCategoryList(value.phone_categories || []);

            const partialFields = fields;
            partialFields.service.category = "";
            partialFields.service.country = value.country_code;
            partialFields.service.region = "";
            partialFields.service.state = "";

            partialFields.service.categoryname = "";
            partialFields.service.countryname = value.country_name;
            partialFields.service.regionname = "";
            partialFields.service.statename = "";

            setFields(partialFields);
        } else {
            setHasRegions(false);
            setHasStates(false);
            setPhoneBackup(0.0);
            setPhonePrice(0.0);
            setPhoneInstallation(0.0);
            setPhoneInstallationBackup(0.0);
            setCategoryList([]);
            setRegionList([]);
            setStateList([]);

            const partialFields = fields;

            partialFields.service.category = "";
            partialFields.service.country = "";
            partialFields.service.region = "";
            partialFields.service.state = "";

            partialFields.service.categoryname = "";
            partialFields.service.countryname = "";
            partialFields.service.regionname = "";
            partialFields.service.statename = "";

            setFields(partialFields);
        }

        disableNextButton();
    };

    const handleCategory = (value: {
        country_has_states: boolean;
        phone_price: number;
        phone_installation_price: number;
        phone_category_name: string;
    }) => {
        if (value) {
            setHasStates(value.country_has_states || false);
            setPhoneBackup(value.phone_price || 0.0);
            setPhonePrice(value.phone_price || 0.0);
            setPhoneInstallation(value.phone_installation_price || 0.0);
            setPhoneInstallationBackup(value.phone_installation_price || 0.0);

            if (value.country_has_states) {
                dispatch(
                    getCountryStates({
                        country_code: fields.service.country,
                        phone_category_name: value.phone_category_name,
                    })
                );

                setHasRegions(false);
                setRegionList([]);
                setWaitStates(true);
            } else {
                setHasRegions(true);
                setStateList([]);

                dispatch(
                    getRegions({ country_code: fields.service.country, phone_category_name: value.phone_category_name })
                );
                setWaitRegions(true);
            }

            const partialFields = fields;

            partialFields.service.category = value.phone_category_name;
            partialFields.service.region = "";
            partialFields.service.state = "";

            partialFields.service.categoryname = value.phone_category_name;
            partialFields.service.regionname = "";
            partialFields.service.statename = "";

            setFields(partialFields);
        } else {
            setHasRegions(false);
            setHasStates(false);
            setPhoneBackup(0.0);
            setPhonePrice(0.0);
            setPhoneInstallation(0.0);
            setPhoneInstallationBackup(0.0);
            setRegionList([]);
            setStateList([]);

            const partialFields = fields;

            partialFields.service.category = "";
            partialFields.service.region = "";
            partialFields.service.state = "";

            partialFields.service.categoryname = "";
            partialFields.service.regionname = "";
            partialFields.service.statename = "";

            setFields(partialFields);
        }

        disableNextButton();
    };

    const handleState = (value: { country_state: string; country_state_name: string }) => {
        if (value) {
            const partialFields = fields;
            partialFields.service.region = "";
            partialFields.service.state = value.country_state;

            partialFields.service.regionname = "";
            partialFields.service.statename = value.country_state_name;
            setFields(partialFields);

            setHasRegions(true);

            dispatch(
                getRegions({
                    country_code: fields.service.country,
                    phone_category_name: fields.service.category,
                    country_state: value.country_state,
                })
            );
            setWaitRegions(true);
        } else {
            setHasRegions(false);
            setRegionList([]);

            const partialFields = fields;
            partialFields.service.region = "";
            partialFields.service.state = "";

            partialFields.service.regionname = "";
            partialFields.service.statename = "";
            setFields(partialFields);
        }

        disableNextButton();
    };

    const handleRegion = (value: {
        phone_price: number;
        phone_installation_price: number;
        phone_region_id: string;
        phone_region_name: string;
    }) => {
        if (value) {
            setPhonePrice(value.phone_price || phoneBackup || 0.0);
            setPhoneInstallation(value.phone_installation_price || phoneInstallationBackup || 0.0);

            const partialFields = fields;
            partialFields.service.region = value.phone_region_id;
            partialFields.service.regionname = value.phone_region_name;
            setFields(partialFields);
        } else {
            setPhonePrice(phoneBackup || 0.0);
            setPhoneInstallation(phoneInstallationBackup || 0.0);

            const partialFields = fields;
            partialFields.service.region = "";
            partialFields.service.regionname = "";
            setFields(partialFields);
        }

        disableNextButton();
    };

    async function finishRegister() {
        dispatch(insertChannel(fields));

        setSetInsert(true);
        setWaitSave(true);
    }

    function setNameField(value: string) {
        setChannelreg(value === "");
        const partialFields = fields;
        partialFields.parameters.description = value;
        setFields(partialFields);
    }

    if (viewSelected === "view1") {
        return (
            <div style={{ width: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        color="textSecondary"
                        key={"mainview"}
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();

                            if (whatsAppData?.onboarding) {
                                history.push(paths.METACHANNELS, whatsAppData);
                            } else {
                                channel?.status === "INACTIVO"
                                    ? history.push(paths.CHANNELS, whatsAppData)
                                    : history.push(paths.CHANNELS_ADD, whatsAppData);
                            }
                        }}
                    >
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div className={classes.containerDetail}>
                        <div
                            style={{
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: "2em",
                                color: "#7721ad",
                                padding: "20px",
                            }}
                        >
                            {t(langKeys.voximplant_buynumber)}
                        </div>
                        <div className={classes.containerCapacities}>
                            <div style={{ verticalAlign: "middle", marginRight: "30px" }}>
                                <b>{t(langKeys.voicechannel_capacities)}</b>
                            </div>
                            <div className={classes.containerItem}>
                                <FormControlLabel
                                    control={
                                        <IOSSwitchPurple
                                            checked={checkedRecording}
                                            onChange={(e) => {
                                                setCheckedRecording(e.target.checked);
                                                handleSwitchRecording(e.target.checked);
                                            }}
                                        />
                                    }
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
                                    control={
                                        <IOSSwitchPurple
                                            checked={checkedSms}
                                            onChange={(e) => {
                                                setCheckedSms(e.target.checked);
                                                handleSwitchSms(e.target.checked);
                                            }}
                                        />
                                    }
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
                                    control={
                                        <IOSSwitchPurple
                                            checked={checkedOutbound}
                                            onChange={(e) => {
                                                setCheckedOutbound(e.target.checked);
                                                handleSwitchOutbound(e.target.checked);
                                            }}
                                        />
                                    }
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
                                    control={
                                        <IOSSwitchPurple
                                            checked={checkedCallSupervision}
                                            onChange={(e) => {
                                                setCheckedCallSupervision(e.target.checked);
                                                handleSwitchCallSupervison(e.target.checked);
                                            }}
                                        />
                                    }
                                    label={""}
                                    style={{ marginRight: "4px" }}
                                />
                                {t(langKeys.voicechannel_callsupervisor)}
                                <Tooltip
                                    title={`${t(langKeys.voicechannel_callsupervisortooltip)}`}
                                    placement="top-start"
                                >
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
                                onChange={(value) => {
                                    handleCountry(value);
                                }}
                                optionDesc="country_name"
                                optionValue="country_code"
                                orderbylabel={true}
                                variant="outlined"
                                valueDefault={fields?.service?.country || ""}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-12"
                                data={categoryList}
                                label={t(langKeys.category)}
                                loading={categoriesResult.loading}
                                onChange={(value) => {
                                    handleCategory(value);
                                }}
                                optionDesc="phone_category_name"
                                optionValue="phone_category_name"
                                orderbylabel={true}
                                variant="outlined"
                                valueDefault={fields?.service?.category || ""}
                                uset={true}
                                prefixTranslation="voximplantcategory_"
                            />
                        </div>
                        {hasStates && (
                            <div className="row-zyx">
                                <FieldSelect
                                    className="col-12"
                                    data={stateList}
                                    label={t(langKeys.voximplant_state)}
                                    loading={countryStatesResult.loading}
                                    onChange={(value) => {
                                        handleState(value);
                                    }}
                                    optionDesc="country_state_name"
                                    optionValue="country_state"
                                    orderbylabel={true}
                                    variant="outlined"
                                    valueDefault={fields?.service?.state || ""}
                                />
                            </div>
                        )}
                        {hasRegions && (
                            <div className="row-zyx">
                                <FieldSelect
                                    className="col-12"
                                    data={regionList}
                                    label={t(langKeys.voximplant_region)}
                                    loading={regionsResult.loading}
                                    onChange={(value) => {
                                        handleRegion(value);
                                    }}
                                    optionDesc="phone_region_name"
                                    optionValue="phone_region_id"
                                    orderbylabel={true}
                                    variant="outlined"
                                    valueDefault={fields?.service?.region || ""}
                                />
                            </div>
                        )}
                        {checkedRecording && (
                            <div className="row-zyx">
                                <FieldSelect
                                    className="col-12"
                                    data={dataRecordingStorage}
                                    label={t(langKeys.voicechannel_recording)}
                                    onChange={(value) => {
                                        handleSwitchRecordingStorage(value);
                                    }}
                                    optionDesc="text"
                                    optionValue="value"
                                    variant="outlined"
                                    valueDefault={fields?.service?.recordingstorage || ""}
                                />
                            </div>
                        )}
                        {checkedRecording && (
                            <div className="row-zyx">
                                <FieldSelect
                                    className="col-12"
                                    data={dataRecordingQuality}
                                    label={t(langKeys.voicechannel_recordingquality)}
                                    onChange={(value) => {
                                        handleSwitchRecordingQuality(value);
                                    }}
                                    optionDesc="text"
                                    optionValue="value"
                                    variant="outlined"
                                    valueDefault={fields?.service?.recordingquality || ""}
                                />
                            </div>
                        )}
                        <div className="row-zyx">
                            <div style={{ display: "inline-block" }}>
                                <div>
                                    <b style={{ paddingLeft: "6px" }}>{t(langKeys.voximplant_pricealert)}</b>
                                    <Tooltip title={`${t(langKeys.voximplant_tooltip)}`} placement="top-start">
                                        <InfoIcon style={{ color: "rgb(119, 33, 173)", paddingLeft: "4px" }} />
                                    </Tooltip>
                                    <b
                                        style={{
                                            paddingRight: "20px",
                                            textAlign: "right",
                                            alignContent: "right",
                                            float: "right",
                                        }}
                                    >{`$${formatNumber(phonePrice * (1 + (phoneTax || 0)))}`}</b>
                                </div>
                            </div>
                        </div>
                        {(checkedRecording || checkedSms || checkedOutbound) && (
                            <div className="row-zyx">
                                <div style={{ display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                                    <p>
                                        <b style={{ color: "#762AA9" }}>{t(langKeys.voicechannel_recordingalert)}</b>
                                        <a
                                            style={{ fontWeight: "bold", cursor: "pointer" }}
                                            onMouseDown={openPricingPage}
                                            rel="noopener noreferrer"
                                        >
                                            https://laraigo.com/en/pricing/
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ paddingLeft: "64%" }}>
                        <Button
                            disabled={nextButton || regionsResult.loading}
                            onClick={() => {
                                setViewSelected("view2");
                            }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >
                            {t(langKeys.next)}
                        </Button>
                    </div>
                </div>
            </div>
        )
    } else if (viewSelected === "enable-virtual-assistant") {
        return <ChannelEnableVirtualAssistant
            communicationchannelid={mainResult?.data?.[0]?.communicantionchannelid || null}
        />
    } else {
        return (
            <div style={{ width: "100%" }}>
                {hasNumber === false && (
                    <>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                color="textSecondary"
                                key={"mainview"}
                                href="/"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setViewSelected("view1");
                                }}
                            >
                                {t(langKeys.previoustext)}
                            </Link>
                        </Breadcrumbs>
                        <div>
                            <div
                                style={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: "2em",
                                    color: "#7721ad",
                                    padding: "20px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    maxWidth: "800px",
                                }}
                            >
                                {t(langKeys.commchannelfinishreg)}
                            </div>
                            <div className="row-zyx">
                                <div className="col-3"></div>
                                <FieldEdit
                                    onChange={(value) => setNameField(value)}
                                    label={t(langKeys.givechannelname)}
                                    className="col-6"
                                />
                            </div>
                            <div className="row-zyx">
                                <div className="col-3"></div>
                                <div className="col-6">
                                    <Box color="textPrimary" fontSize={14} fontWeight={500} lineHeight="18px" mb={1}>
                                        {t(langKeys.givechannelcolor)}
                                    </Box>
                                    <div
                                        style={{
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "space-around",
                                            marginTop: "20px",
                                        }}
                                    >
                                        <ChannelPhone
                                            style={{ fill: `${coloricon}`, height: "100px", width: "100px" }}
                                        />
                                        <ColorInput
                                            hex={fields.parameters.coloricon}
                                            onChange={(e) => {
                                                setFields((prev) => ({
                                                    ...prev,
                                                    parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                                }));
                                                setColoricon(e.hex);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingLeft: "80%" }}>
                                <Button
                                    onClick={() => {
                                        finishRegister();
                                    }}
                                    className={classes.button}
                                    disabled={channelreg || mainResult.loading}
                                    variant="contained"
                                    color="primary"
                                >
                                    {t(langKeys.finishreg)}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                {hasNumber === true && (
                    <>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                color="textSecondary"
                                key={"mainview"}
                                href="/"
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (whatsAppData?.onboarding) {
                                        history.push(paths.METACHANNELS, whatsAppData);
                                    } else {
                                        history.push(paths.CHANNELS);
                                    }
                                }}
                            >
                                {t(langKeys.previoustext)}
                            </Link>
                        </Breadcrumbs>
                        <div>
                            <div
                                style={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: "2em",
                                    color: "#7721ad",
                                    padding: "20px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    maxWidth: "800px",
                                }}
                            >
                                {t(langKeys.commchannelfinishreg)}
                            </div>
                            <div className="row-zyx">
                                <div className="col-3"></div>
                                <FieldView
                                    label={t(langKeys.givechannelname)}
                                    value={fields?.parameters?.description}
                                    className="col-6"
                                />
                            </div>
                            <div className="row-zyx">
                                <div className="col-3"></div>
                                <div className="col-6">
                                    <Box color="textPrimary" fontSize={14} fontWeight={500} lineHeight="18px" mb={1}>
                                        {t(langKeys.givechannelcolor)}
                                    </Box>
                                    <div
                                        style={{
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "space-around",
                                            marginTop: "20px",
                                        }}
                                    >
                                        <ChannelPhone
                                            style={{ fill: `${coloricon}`, height: "100px", width: "100px" }}
                                        />
                                        <ColorInput
                                            hex={fields.parameters.coloricon}
                                            onChange={(e) => {
                                                setFields((prev) => ({
                                                    ...prev,
                                                    parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                                }));
                                                setColoricon(e.hex);
                                            }}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: 200,
                                    marginRight: 200,
                                    marginBottom: 20,
                                }}
                            >
                                <pre
                                    style={{
                                        background: "#f4f4f4",
                                        border: "1px solid #ddd",
                                        color: "#666",
                                        pageBreakInside: "avoid",
                                        fontFamily: "monospace",
                                        lineHeight: 1.6,
                                        maxWidth: "100%",
                                        overflow: "auto",
                                        padding: "1em 1.5em",
                                        display: "block",
                                        wordWrap: "break-word",
                                    }}
                                >
                                    <code>{`${t(langKeys.voximplant_numberbought)}${phoneNumber}`}</code>
                                </pre>
                            </div>
                            <div style={{ paddingLeft: "80%" }}>
                                <Button
                                    onClick={() => {
                                        setViewSelected("enable-virtual-assistant")
                                    }}
                                    className={classes.button}
                                    disabled={channelreg}
                                    variant="contained"
                                    color="primary"
                                >
                                    {t(langKeys.close)}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
};

export default ChannelAddPhone;