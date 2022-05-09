/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Breadcrumbs, Button, makeStyles } from '@material-ui/core';
import { ColorInput, FieldEdit, FieldSelect, FieldView } from "components";
import { FC, useEffect, useState } from "react";
import { getCategories, getCountryStates, getRegions } from 'store/voximplant/actions';
import { getName } from 'country-list';
import { insertChannel } from "store/channel/actions";
import { langKeys } from "lang/keys";
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import Link from '@material-ui/core/Link';
import paths from "common/constants/paths";
import PhoneIcon from '@material-ui/icons/Phone';

interface whatsAppData {
    row?: any;
    typeWhatsApp?: string;
}

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        fontSize: '14px',
        fontWeight: 500,
        padding: 12,
        textTransform: 'initial',
        width: "180px",
    },
    containerDetail: {
        background: '#fff',
        borderRadius: '6px',
        boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.5)',
        marginBottom: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        width: "40%",
    },
}));

export const ChannelAddPhone: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const categoriesResult = useSelector(state => state.voximplant.requestGetCategories);
    const classes = useChannelAddStyles();
    const countryStatesResult = useSelector(state => state.voximplant.requestGetCountryStates);
    const executeResult = useSelector(state => state.channel.successinsert);
    const history = useHistory();
    const location = useLocation<whatsAppData>();
    const regionsResult = useSelector(state => state.voximplant.requestGetRegions);
    const mainResult = useSelector(state => state.channel.channelList);
    const whatsAppData = location.state as whatsAppData | null;

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
            "country": "",
            "region": "",
            "state": "",
        },
        "type": "VOXIMPLANTPHONE",
    });
    const [hasStates, setHasStates] = useState(false);
    const [hasRegions, setHasRegions] = useState(false);
    const [nextbutton, setNextbutton] = useState(true);
    const [phonePrice, setPhonePrice] = useState(0.00);
    const [regionList, setRegionList] = useState<any>([]);
    const [setInsert, setSetInsert] = useState(false);
    const [stateList, setStateList] = useState<any>([]);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitCategories, setWaitCategories] = useState(true);
    const [waitSave, setWaitSave] = useState(false);
    const [waitRegions, setWaitRegions] = useState(false);
    const [waitStates, setWaitStates] = useState(false);

    useEffect(() => {
        dispatch(getCategories({}));
    }, [])

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

                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));

                history.push(paths.CHANNELS);
            } else if (!executeResult) {
                setWaitSave(false);

                dispatch(showSnackbar({ show: true, success: false, message: t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
            }
        }
    }, [mainResult])

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
                    setRegionList(regionsResult.data);
                }
                setWaitRegions(false);
            }
        }
    }, [regionsResult, waitRegions])

    const handleCountry = (value: any) => {
        if (value) {
            setCategoryList(value.phone_categories || []);

            let partialFields = fields;
            partialFields.service.country = value.country_code;
            setFields(partialFields);
        }
        else {
            setHasRegions(false);
            setHasStates(false);
            setPhonePrice(0.00);
            setCategoryList([]);
            setRegionList([]);
            setStateList([]);
        }
    }

    const handleCategory = (value: any) => {
        if (value) {
            setHasStates(value.country_has_states || false);
            setPhonePrice(value.phone_price || 0.00);

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
            setFields(partialFields);
        }
        else {
            setHasRegions(false);
            setHasStates(false);
            setPhonePrice(0.00);
            setRegionList([]);
            setStateList([]);
        }
    }

    const handleState = (value: any) => {
        if (value) {
            let partialFields = fields;
            partialFields.service.state = value.country_state;
            setFields(partialFields);

            setHasRegions(true);

            dispatch(getRegions({ country_code: fields.service.country, phone_category_name: fields.service.category, country_state: value.country_state }));
            setWaitRegions(true);
        }
        else {
            setHasRegions(false);
            setRegionList([]);
        }
    }

    const handleRegion = (value: any) => {
        if (value) {
            let partialFields = fields;
            partialFields.service.region = value.phone_region_name;
            setFields(partialFields);
        }
    }

    async function finishRegister() {
        dispatch(insertChannel(fields));

        setSetInsert(true);
        setWaitSave(true);
        setViewSelected("main");
    }

    function setNameField(value: any) {
        setChannelreg(value === "");
        let partialFields = fields;
        partialFields.parameters.description = value;
        setFields(partialFields);
    }

    if (viewSelected === "view1") {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD, whatsAppData) }}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <div className={classes.containerDetail}>
                    <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.voximplant_buynumber)}</div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-12"
                            data={countryList}
                            label={t(langKeys.country)}
                            variant="outlined"
                            loading={categoriesResult.loading}
                            onChange={(value: any) => { handleCountry(value) }}
                            optionDesc="country_name"
                            optionValue="country_code"
                            orderbylabel={true}
                            valueDefault={fields?.service?.country || ""}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-12"
                            data={categoryList}
                            label={t(langKeys.category)}
                            variant="outlined"
                            loading={categoriesResult.loading}
                            onChange={(value: any) => { handleCategory(value) }}
                            optionDesc="phone_category_name"
                            optionValue="incoming_calls_resource_id"
                            orderbylabel={true}
                            valueDefault={fields?.service?.category || ""}
                        />
                    </div>
                    {hasStates && <div className="row-zyx">
                        <FieldSelect
                            className="col-12"
                            data={stateList}
                            label={t(langKeys.voximplant_state)}
                            loading={countryStatesResult.loading}
                            onChange={(value: any) => { handleState(value) }}
                            optionDesc="country_state_name"
                            optionValue="country_state"
                            orderbylabel={true}
                            valueDefault={fields?.service?.state || ""}
                            style={{ outline: "1px black solid", padding: "10px 10px 10px 10px", borderradius: "6px" }}
                        />
                    </div>}
                    {hasRegions && <div className="row-zyx">
                        <FieldSelect
                            className="col-12"
                            data={regionList}
                            label={t(langKeys.voximplant_region)}
                            loading={regionsResult.loading}
                            onChange={(value: any) => { handleRegion(value) }}
                            optionDesc="phone_region_name"
                            optionValue="phone_region_id"
                            orderbylabel={true}
                            valueDefault={fields?.service?.region || ""}
                            style={{ outline: "1px black solid", padding: "10px 10px 10px 10px", borderradius: "6px" }}
                        />
                    </div>}
                    <div className="row-zyx">
                        <FieldView
                            className="col-8"
                            label={""}
                            value={t(langKeys.voximplant_pricealert)}
                        />
                        <FieldView
                            className="col-3"
                            label={""}
                            value={""}
                        />
                        <FieldView
                            className="col-1"
                            label={""}
                            value={`$${phonePrice}`}
                        />
                    </div>
                </div>
                <div style={{ paddingLeft: "58%" }}>
                    <Button
                        disabled={nextbutton}
                        onClick={() => { setViewSelected("view2") }}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                    >{t(langKeys.next)}
                    </Button>
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view2") }}>
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
                            disabled={channelreg}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.finishreg)}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}