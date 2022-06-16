/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Breadcrumbs, Button, makeStyles } from "@material-ui/core";
import { ColorInput, FieldEdit, FieldSelect, FieldView } from "components";
import { FC, useEffect, useState } from "react";
import { formatNumber, getPhoneTax } from 'common/helpers';
import { getCategories, getCountryStates, getRegions } from "store/voximplant/actions";
import { getMultiCollection } from 'store/main/actions';
import { getName } from "country-list";
import { getPaymentPlanSel } from 'common/helpers';
import { insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import InfoIcon from "@material-ui/icons/Info";
import Link from "@material-ui/core/Link";
import paths from "common/constants/paths";
import PhoneIcon from "@material-ui/icons/Phone";
import Tooltip from "@material-ui/core/Tooltip";

interface whatsAppData {
    row?: any;
    typeWhatsApp?: string;
}

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
        width: "50%",
    },
}));

export const ChannelAddPhone: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const categoriesResult = useSelector(state => state.voximplant.requestGetCategories);
    const classes = useChannelAddStyles();
    const countryStatesResult = useSelector(state => state.voximplant.requestGetCountryStates);
    const executeResult = useSelector(state => state.channel.successinsert);
    const insertResult = useSelector(state => state.channel.insertChannel);
    const multiResult = useSelector(state => state.main.multiData);
    const history = useHistory();
    const location = useLocation<whatsAppData>();
    const regionsResult = useSelector(state => state.voximplant.requestGetRegions);
    const mainResult = useSelector(state => state.channel.channelList);
    const user = useSelector(state => state.login.validateToken.user);
    const whatsAppData = location.state as whatsAppData | null;

    const [dataPaymentPlan, setDataPaymentPlan] = useState<any>([]);
    const [categoryList, setCategoryList] = useState<any>([]);
    const [countryList, setCountryList] = useState<any>([]);
    const [channelreg, setChannelreg] = useState(true);
    const [coloricon, setcoloricon] = useState("#1D9BF0");
    const [fields, setFields] = useState({
        "method": "UFN_COMMUNICATIONCHANNEL_INS",
        "parameters": {
            "apikey": "",
            "chatflowenabled": true,
            "color": "",
            "coloricon": "#1D9BF0",
            "communicationchannelowner": "",
            "communicationchannelsite": "",
            "description": "",
            "form": "",
            "icons": "",
            "id": 0,
            "integrationid": "",
            "other": "",
            "type": "",
        },
        "service": {
            "category": "",
            "categoryname": "",
            "country": "",
            "countryname": "",
            "region": "",
            "regionname": "",
            "state": "",
            "statename": "",
            "cost": "",
            "costvca": "",
            "costinstallation": "",
        },
        "type": "VOXIMPLANTPHONE",
    });
    const [hasStates, setHasStates] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasRegions, setHasRegions] = useState(false);
    const [nextButton, setNextButton] = useState(true);
    const [phoneBackup, setPhoneBackup] = useState(0.00);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phonePrice, setPhonePrice] = useState(0.00);
    const [phoneInstallation, setPhoneInstallation] = useState(0.00);
    const [phoneInstallationBackup, setPhoneInstallationBackup] = useState(0.00);
    const [phoneTax, setPhoneTax] = useState(0.00);
    const [regionList, setRegionList] = useState<any>([]);
    const [setInsert, setSetInsert] = useState(false);
    const [stateList, setStateList] = useState<any>([]);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitCategories, setWaitCategories] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitPlan, setWaitPlan] = useState(false);
    const [waitRegions, setWaitRegions] = useState(false);
    const [waitStates, setWaitStates] = useState(false);

    useEffect(() => {
        dispatch(getCategories({}));
        dispatch(getMultiCollection([
            getPhoneTax(),
        ]));
        setWaitCategories(true);
        setWaitPlan(true);
    }, [])

    useEffect(() => {
        if (!multiResult.loading && waitPlan) {
            setWaitPlan(false);
            setDataPaymentPlan(multiResult.data[0] && multiResult.data[0].success ? multiResult.data[0].data : []);
        }
    }, [multiResult])

    useEffect(() => {
        setPhoneTax(0.00);
        if (dataPaymentPlan) {
            if (dataPaymentPlan.length > 0) {
                setPhoneTax(dataPaymentPlan[0].vcacomissionpervoicechannel || 0);
            }
        }
    }, [dataPaymentPlan])

    useEffect(() => {
        if (phonePrice) {
            let partialFields = fields;
            partialFields.service.cost = (phonePrice || 0).toString();
            partialFields.service.costinstallation = (phoneInstallation || 0).toString();
            partialFields.service.costvca = (formatNumber((phonePrice || 0) * (1 + (phoneTax || 0)))).toString();
            setFields(partialFields);
        }
        else {
            let partialFields = fields;
            partialFields.service.cost = "0";
            partialFields.service.costinstallation = "0";
            partialFields.service.costvca = "0";
            setFields(partialFields);
        }
    }, [phonePrice, phoneInstallation])

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

                if (mainResult.data) {
                    if (mainResult.data[0]) {
                        setHasNumber(true);
                        setPhoneNumber(mainResult.data[0].integrationId);
                    }
                }
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
        if (fields) {
            if (fields.service) {
                if (fields.service.category && fields.service.country) {
                    if (fields.service.region) {
                        if (hasStates) {
                            if (fields.service.state) {
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
    }

    const handleCountry = (value: any) => {
        if (value) {
            setCategoryList(value.phone_categories || []);

            let partialFields = fields;
            partialFields.service.category = "";
            partialFields.service.country = value.country_code;
            partialFields.service.region = "";
            partialFields.service.state = "";

            partialFields.service.categoryname = "";
            partialFields.service.countryname = value.country_name;
            partialFields.service.regionname = "";
            partialFields.service.statename = "";
            setFields(partialFields);
        }
        else {
            setHasRegions(false);
            setHasStates(false);
            setPhoneBackup(0.00);
            setPhonePrice(0.00);
            setPhoneInstallation(0.00);
            setPhoneInstallationBackup(0.00);
            setCategoryList([]);
            setRegionList([]);
            setStateList([]);

            let partialFields = fields;
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
    }

    const handleCategory = (value: any) => {
        if (value) {
            setHasStates(value.country_has_states || false);
            setPhoneBackup(value.phone_price || 0.00);
            setPhonePrice(value.phone_price || 0.00);
            setPhoneInstallation(value.phone_installation_price || 0.00);
            setPhoneInstallationBackup(value.phone_installation_price || 0.00);

            if (value.country_has_states) {
                dispatch(getCountryStates({ country_code: fields.service.country, phone_category_name: value.phone_category_name }));

                setHasRegions(false);
                setRegionList([]);
                setWaitStates(true);
            }
            else {
                setHasRegions(true);
                setStateList([]);

                dispatch(getRegions({ country_code: fields.service.country, phone_category_name: value.phone_category_name }));
                setWaitRegions(true);
            }

            let partialFields = fields;
            partialFields.service.category = value.phone_category_name;
            partialFields.service.region = "";
            partialFields.service.state = "";

            partialFields.service.categoryname = value.phone_category_name;
            partialFields.service.regionname = "";
            partialFields.service.statename = "";
            setFields(partialFields);
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

            let partialFields = fields;
            partialFields.service.category = "";
            partialFields.service.region = "";
            partialFields.service.state = "";

            partialFields.service.categoryname = "";
            partialFields.service.regionname = "";
            partialFields.service.statename = "";
            setFields(partialFields);
        }

        disableNextButton();
    }

    const handleState = (value: any) => {
        if (value) {
            let partialFields = fields;
            partialFields.service.region = "";
            partialFields.service.state = value.country_state;

            partialFields.service.regionname = "";
            partialFields.service.statename = value.country_state_name;
            setFields(partialFields);

            setHasRegions(true);

            dispatch(getRegions({ country_code: fields.service.country, phone_category_name: fields.service.category, country_state: value.country_state }));
            setWaitRegions(true);
        }
        else {
            setHasRegions(false);
            setRegionList([]);

            let partialFields = fields;
            partialFields.service.region = "";
            partialFields.service.state = "";

            partialFields.service.regionname = "";
            partialFields.service.statename = "";
            setFields(partialFields);
        }

        disableNextButton();
    }

    const handleRegion = (value: any) => {
        if (value) {
            setPhonePrice((value.phone_price || phoneBackup) || 0.00);
            setPhoneInstallation((value.phone_installation_price || phoneInstallationBackup) || 0.00);

            let partialFields = fields;
            partialFields.service.region = value.phone_region_id;
            partialFields.service.regionname = value.phone_region_name;
            setFields(partialFields);
        }
        else {
            setPhonePrice(phoneBackup || 0.00);
            setPhoneInstallation(phoneInstallationBackup || 0.00);

            let partialFields = fields;
            partialFields.service.region = "";
            partialFields.service.regionname = "";
            setFields(partialFields);
        }

        disableNextButton();
    }

    async function finishRegister() {
        dispatch(insertChannel(fields));

        setSetInsert(true);
        setWaitSave(true);
    }

    function setNameField(value: any) {
        setChannelreg(value === "");
        let partialFields = fields;
        partialFields.parameters.description = value;
        setFields(partialFields);
    }

    if (viewSelected === "view1") {
        return (
            <div style={{ width: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD, whatsAppData) }}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div className={classes.containerDetail}>
                        <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.voximplant_buynumber)}</div>
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
                                valueDefault={fields?.service?.country || ""}
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
                                valueDefault={fields?.service?.category || ""}
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
                                valueDefault={fields?.service?.state || ""}
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
                                valueDefault={fields?.service?.region || ""}
                            />
                        </div>}
                        <div className="row-zyx">
                            <div>
                                <div style={{ display: "inline" }}>
                                    <b style={{ paddingLeft: "6px" }}>{t(langKeys.voximplant_pricealert)}</b>
                                    <Tooltip title={`${t(langKeys.voximplant_tooltip)}`} placement="top-start">
                                        <InfoIcon style={{ padding: "5px 0 0 5px", color: "rgb(119, 33, 173)" }} />
                                    </Tooltip>
                                </div>
                                <div style={{ display: "inline", alignContent: "right", float: "right" }}>
                                    <b style={{ paddingRight: "20px", textAlign: "right" }}>{`$${formatNumber(phonePrice * (1 + (phoneTax || 0)))}`}</b>
                                </div>
                            </div>
                        </div>
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
            <div style={{ width: "100%" }}>
                {hasNumber === false && <>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view1") }}>
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.commchannelfinishreg)}</div>
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
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    {t(langKeys.givechannelcolor)}
                                </Box>
                                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                    <PhoneIcon style={{ fill: `${coloricon}`, width: "100px", height: "100px" }} />
                                    <ColorInput
                                        hex={fields.parameters.coloricon}
                                        onChange={e => {
                                            setFields(prev => ({
                                                ...prev,
                                                parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                            }));
                                            setcoloricon(e.hex)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ paddingLeft: "80%" }}>
                            <Button
                                onClick={() => { finishRegister() }}
                                className={classes.button}
                                disabled={channelreg || mainResult.loading}
                                variant="contained"
                                color="primary"
                            >{t(langKeys.finishreg)}
                            </Button>
                        </div>
                    </div>
                </>}
                {hasNumber === true && <>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS); }}>
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.commchannelfinishreg)}</div>
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
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    {t(langKeys.givechannelcolor)}
                                </Box>
                                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                    <PhoneIcon style={{ fill: `${coloricon}`, width: "100px", height: "100px" }} />
                                    <ColorInput
                                        hex={fields.parameters.coloricon}
                                        onChange={e => {
                                            setFields(prev => ({
                                                ...prev,
                                                parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                            }));
                                            setcoloricon(e.hex)
                                        }}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 200, marginRight: 200, marginBottom: 20 }}>
                            <pre style={{ background: '#f4f4f4', border: '1px solid #ddd', color: '#666', pageBreakInside: 'avoid', fontFamily: 'monospace', lineHeight: 1.6, maxWidth: '100%', overflow: 'auto', padding: '1em 1.5em', display: 'block', wordWrap: 'break-word' }}>
                                <code>
                                    {`${t(langKeys.voximplant_numberbought)}${phoneNumber}`}
                                </code>
                            </pre>
                        </div>
                        <div style={{ paddingLeft: "80%" }}>
                            <Button
                                onClick={() => { history.push(paths.CHANNELS); }}
                                className={classes.button}
                                disabled={channelreg}
                                variant="contained"
                                color="primary"
                            >{t(langKeys.close)}
                            </Button>
                        </div>
                    </div>
                </>}
            </div>
        )
    }
}