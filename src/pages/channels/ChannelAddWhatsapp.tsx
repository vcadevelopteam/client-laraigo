/* eslint-disable react-hooks/exhaustive-deps */
import { activateChannel, insertChannel } from "store/channel/actions";
import { Box, Breadcrumbs, Button, FormControlLabel, makeStyles, TextField } from "@material-ui/core";
import { ChannelWhatsApp01 } from "icons";
import { ColorInput, FieldEdit, IOSSwitch } from "components";
import { Dictionary } from "@types";
import { FC, Fragment, useEffect, useState } from "react";
import { langKeys } from "lang/keys";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { styled } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import Link from "@material-ui/core/Link";
import MuiPhoneNumber from "material-ui-phone-number";
import paths from "common/constants/paths";

const useChannelAddStyles = makeStyles((theme) => ({
    centerbutton: {
        marginBottom: "20px",
        marginLeft: "calc(50% - 96px)",
        marginTop: "30px",
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "180px",
    },
    button2: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "100%",
    },
    fields1: {
        flex: 1,
        margin: "15px",
    },
    fields2: {
        flex: 1,
    },
    fields3: {
        flex: 1,
        marginLeft: "15px",
    },
}));

const CssPhonemui = styled(MuiPhoneNumber)({
    "& label.Mui-focused": {
        color: "#7721ad",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#7721ad",
    },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: "#7721ad",
        },
    },
});

interface whatsAppData {
    row?: any;
    typeWhatsApp?: string;
}

export const ChannelAddWhatsapp: FC<{ edit: boolean }> = ({ edit }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useChannelAddStyles();
    const executeActivationResult = useSelector((state) => state.channel.activateChannel);
    const executeResult = useSelector((state) => state.channel.successinsert);
    const history = useHistory();
    const location = useLocation<whatsAppData>();
    const mainResult = useSelector((state) => state.channel.channelList);
    const user = useSelector((state) => state.login.validateToken.user);
    const roledesc = user?.roledesc ?? "";
    const whatsAppData = location.state as whatsAppData | null;

    const [channelreg, setChannelreg] = useState(true);
    const [checkedCloud, setCheckedCloud] = useState(false);
    const [coloricon, setcoloricon] = useState("#4AC959");
    const [disablebutton, setdisablebutton] = useState(true);
    const [disablebutton2, setdisablebutton2] = useState(true);
    const [disablebutton3, setdisablebutton3] = useState(true);
    const [nextbutton, setNextbutton] = useState(true);
    const [set360, setset360] = useState(false);
    const [setins, setsetins] = useState(false);
    const [setParameters, setSetParameters] = useState(true);
    const [setRegister360, setSetRegister360] = useState(false);
    const [setRegisterGupshup, setSetRegisterGupshup] = useState(false);
    const [setRegisterMeta, setSetRegisterMeta] = useState(false);
    const [setRegisterSmooch, setSetRegisterSmooch] = useState(false);
    const [setsmooch, setsetsmooch] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);

    useEffect(() => {
        if (edit && !whatsAppData?.row) {
            history.push(paths.CHANNELS);
        } else if (edit && whatsAppData?.row && whatsAppData?.row.servicecredentials.length === 0) {
            history.push(paths.CHANNELS);
        }
    }, [history]);

    const [errors] = useState<Dictionary>({
        accesstoken: "",
        brandAddress: "",
        brandName: "",
        customerfacebookid: "",
        email: "",
        firstName: "",
        lastName: "",
        nameassociatednumber: "",
        phone: "",
        phonenumberwhatsappbusiness: "",
    });

    const [fields, setFields] = useState({
        method: "UFN_COMMUNICATIONCHANNEL_INS",
        parameters: {
            apikey: "",
            chatflowenabled: true,
            color: "",
            coloricon: "#4AC959",
            communicationchannelowner: "",
            communicationchannelsite: "",
            description: "",
            form: "",
            icons: "",
            id: 0,
            integrationid: "",
            other: "",
            type: "",
            voximplantcallsupervision: false,
        },
        service: {
            accesstoken: "",
            apikey: "",
            apikeyid: "",
            apikeysecret: "",
            appid: "",
            appname: "",
            appnumber: "",
            brandaddress: "",
            brandname: "",
            customerfacebookid: "",
            email: "",
            firstname: "",
            iscloud: false,
            lastname: "",
            nameassociatednumber: "",
            phone: "",
            phonenumberwhatsappbusiness: "",
        },
        type: whatsAppData?.typeWhatsApp === "DIALOG" ? "WHATSAPP" : "WHATSAPPSMOOCH",
    });

    if (typeof location?.state === "undefined" || !location?.state) {
        history.push(paths.CHANNELS);
    }

    async function finishreg() {
        setsetins(true);
        dispatch(insertChannel(fields));
        setWaitSave(true);
        setViewSelected("main");
    }

    useEffect(() => {
        if (roledesc !== "SUPERADMIN" && !edit && whatsAppData?.typeWhatsApp === "DIALOG") {
            setSetRegister360(true);
            setSetRegisterGupshup(false);
            setSetRegisterMeta(false);
            setSetRegisterSmooch(false);

            let partialField = fields;
            partialField.type = "DIALOG";

            setFields(partialField);
        }

        if (roledesc !== "SUPERADMIN" && !edit && whatsAppData?.typeWhatsApp === "SMOOCH") {
            setSetRegister360(false);
            setSetRegisterGupshup(false);
            setSetRegisterMeta(false);
            setSetRegisterSmooch(true);

            let partialField = fields;
            partialField.type = "WHATSAPPSMOOCHINSERT";

            setFields(partialField);
        }

        if (roledesc !== "SUPERADMIN" && !edit && whatsAppData?.typeWhatsApp === "GUPSHUP") {
            setSetRegister360(false);
            setSetRegisterGupshup(true);
            setSetRegisterMeta(false);
            setSetRegisterSmooch(false);

            let partialField = fields;
            partialField.type = "WHATSAPPGUPSHUP";

            setFields(partialField);
        }

        if (roledesc !== "SUPERADMIN" && !edit && whatsAppData?.typeWhatsApp === "META") {
            setSetRegister360(false);
            setSetRegisterGupshup(false);
            setSetRegisterMeta(true);
            setSetRegisterSmooch(false);

            let partialField = fields;
            partialField.type = "WHATSAPPMETA";

            setFields(partialField);
        }
    }, [whatsAppData]);

    useEffect(() => {
        if (edit) {
            if (setParameters) {
                setSetParameters(false);
                if (whatsAppData?.row) {
                    if (whatsAppData && whatsAppData?.row.servicecredentials.length > 0) {
                        let serviceField = JSON.parse(whatsAppData.row.servicecredentials);

                        setFields({
                            method: "UFN_COMMUNICATIONCHANNEL_INS",
                            parameters: {
                                apikey: whatsAppData.row.apikey,
                                chatflowenabled: whatsAppData.row.chatflowenabled,
                                color: whatsAppData.row.color,
                                coloricon: whatsAppData.row.coloricon,
                                communicationchannelowner: whatsAppData.row.communicationchannelowner,
                                communicationchannelsite: whatsAppData.row.communicationchannelsite,
                                description: whatsAppData.row.communicationchanneldesc,
                                form: whatsAppData.row.form,
                                icons: whatsAppData.row.icons,
                                id: whatsAppData.row.communicationchannelid,
                                integrationid: whatsAppData.row.integrationid,
                                other: whatsAppData.row.other,
                                type: whatsAppData.row.type,
                                voximplantcallsupervision: false,
                            },
                            service: {
                                accesstoken: serviceField.accesstoken,
                                apikey: "",
                                apikeyid: "",
                                apikeysecret: "",
                                appid: "",
                                appname: "",
                                appnumber: "",
                                brandaddress: serviceField.brandaddress,
                                brandname: serviceField.brandname,
                                customerfacebookid: serviceField.customerfacebookid,
                                email: serviceField.email,
                                firstname: serviceField.firstname,
                                iscloud: serviceField.iscloud,
                                lastname: serviceField.lastname,
                                nameassociatednumber: serviceField.nameassociatednumber,
                                phone: serviceField.phone,
                                phonenumberwhatsappbusiness: serviceField.phonenumberwhatsappbusiness,
                            },
                            type: "WHATSAPPSMOOCH",
                        });

                        setdisablebutton(false);
                    }
                }
            }
        }
    }, [setParameters]);

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setsetins(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
                history.push(paths.CHANNELS);
            } else if (!executeResult) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(mainResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.channel).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [mainResult]);

    function checkissues() {
        setViewSelected("viewfinishreg");
    }

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult]);

    function setnameField(value: any) {
        setChannelreg(value === "");
        let partialf = fields;
        partialf.parameters.description = value;
        setFields(partialf);
    }

    function setChecked(value: any) {
        let partialf = fields;
        partialf.service.iscloud = value ?? false;
        setFields(partialf);
    }

    function setApiKeyId(value: string) {
        setNextbutton(value === "");
        let partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.apikeyid = value;
        setFields(partialf);
    }

    function setApiKeySecret(value: string) {
        setNextbutton(value === "");
        let partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.apikeysecret = value;
        setFields(partialf);
    }

    function setAppId(value: string) {
        setNextbutton(value === "");
        let partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.appid = value;
        setFields(partialf);
    }

    function setAppName(value: string) {
        setNextbutton(value === "");
        let partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.appname = value;
        setFields(partialf);
    }

    function setApiKey(value: string) {
        setNextbutton(value === "");
        let partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.apikey = value;
        setFields(partialf);
    }

    function setAppNumber(value: string) {
        setNextbutton(value === "");
        let partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.appnumber = value;
        setFields(partialf);
    }

    function setAccessToken(value: string) {
        setNextbutton(value === "");
        let partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.accesstoken = value;
        setFields(partialf);
    }

    function setPhoneNumber(value: string) {
        setNextbutton(value === "");
        let partialf = fields;
        partialf.parameters.communicationchannelowner = "";
        partialf.service.phone = value;
        setFields(partialf);
    }

    async function activateChannelfunc() {
        dispatch(showBackdrop(true));
        dispatch(activateChannel(fields));
    }

    useEffect(() => {
        if (!executeActivationResult.loading && (set360 || setsmooch)) {
            dispatch(showBackdrop(false));
            if (executeActivationResult.error) {
                dispatch(
                    showSnackbar({ show: true, severity: "error", message: String(executeActivationResult.message) })
                );
            } else {
                dispatch(showSnackbar({ show: true, severity: "success", message: "Success" }));
                history.push(paths.CHANNELS);
            }
        }
    }, [executeActivationResult]);

    if (viewSelected === "view1") {
        if (setRegister360) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                setSetRegister360(false);
                                setSetRegisterSmooch(false);
                                setSetRegisterGupshup(false);
                                setSetRegisterMeta(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitledialog)}
                        </div>
                        {edit ? (
                            <Button
                                className={classes.centerbutton}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    history.push(paths.CHANNELS_ADD, whatsAppData);
                                }}
                            >
                                {t(langKeys.close)}
                            </Button>
                        ) : (
                            <Button
                                className={classes.centerbutton}
                                color="primary"
                                disabled={nextbutton}
                                variant="contained"
                                onClick={() => {
                                    setViewSelected("viewfinishreg");
                                }}
                            >
                                {t(langKeys.registerwhats)}
                            </Button>
                        )}
                        <div className="row-zyx">
                            <div className={"col-3"}></div>
                            <FieldEdit
                                className="col-5"
                                label={t(langKeys.enterapikey)}
                                onChange={(value) => setAccessToken(value)}
                            />
                            <div className={"col-1"} style={{ paddingBottom: "3px" }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                    {t(langKeys.dialog_iscloud)}
                                </Box>
                                <FormControlLabel
                                    label={""}
                                    style={{ paddingLeft: 10 }}
                                    control={
                                        <IOSSwitch
                                            checked={checkedCloud}
                                            onChange={(e) => {
                                                setCheckedCloud(e.target.checked);
                                                setChecked(e.target.checked);
                                            }}
                                        />
                                    }
                                />
                            </div>
                            <div className={"col-3"}></div>
                        </div>
                    </div>
                </div>
            );
        } else if (setRegisterSmooch) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                setSetRegister360(false);
                                setSetRegisterGupshup(false);
                                setSetRegisterMeta(false);
                                setSetRegisterSmooch(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitlesmooch)}
                        </div>
                        {edit ? (
                            <Button
                                className={classes.centerbutton}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    history.push(paths.CHANNELS_ADD, whatsAppData);
                                }}
                            >
                                {t(langKeys.close)}
                            </Button>
                        ) : (
                            <Button
                                className={classes.centerbutton}
                                color="primary"
                                disabled={disablebutton2}
                                variant="contained"
                                onClick={() => {
                                    setViewSelected("viewfinishreg");
                                }}
                            >
                                {t(langKeys.registerwhats)}
                            </Button>
                        )}
                        <div className="row-zyx">
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.smooch_apikeyid)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKeyId(e.target.value);
                                        setdisablebutton2(
                                            !e.target.value || !fields.service.apikeysecret || !fields.service.appid
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.smooch_apikeysecret)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKeySecret(e.target.value);
                                        setdisablebutton2(
                                            !e.target.value || !fields.service.apikeyid || !fields.service.appid
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.smooch_appid)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppId(e.target.value);
                                        setdisablebutton2(
                                            !e.target.value || !fields.service.apikeyid || !fields.service.apikeysecret
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (setRegisterGupshup) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                setSetRegister360(false);
                                setSetRegisterGupshup(false);
                                setSetRegisterMeta(false);
                                setSetRegisterSmooch(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitlegupshup)}
                        </div>
                        {edit ? (
                            <Button
                                className={classes.centerbutton}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    history.push(paths.CHANNELS_ADD, whatsAppData);
                                }}
                            >
                                {t(langKeys.close)}
                            </Button>
                        ) : (
                            <Button
                                className={classes.centerbutton}
                                color="primary"
                                disabled={disablebutton3}
                                variant="contained"
                                onClick={() => {
                                    setViewSelected("viewfinishreg");
                                }}
                            >
                                {t(langKeys.registerwhats)}
                            </Button>
                        )}
                        <div className="row-zyx">
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.gupshuppappid)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppId(e.target.value);
                                        setdisablebutton3(
                                            !e.target.value ||
                                            !fields.service.appname ||
                                            !fields.service.apikey ||
                                            !fields.service.appnumber
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.gupshuppappname)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppName(e.target.value);
                                        setdisablebutton3(
                                            !fields.service.appid ||
                                            !e.target.value ||
                                            !fields.service.apikey ||
                                            !fields.service.appnumber
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.gupshuppapikey)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKey(e.target.value);
                                        setdisablebutton3(
                                            !fields.service.appid ||
                                            !fields.service.appname ||
                                            !e.target.value ||
                                            !fields.service.appnumber
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.gupshuppappnumber)}
                                    style={{ width: "100%" }}
                                    type={"number"}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppNumber(e.target.value);
                                        setdisablebutton3(
                                            !fields.service.appid ||
                                            !fields.service.appname ||
                                            !fields.service.apikey ||
                                            !e.target.value
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (setRegisterMeta) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                setSetRegister360(false);
                                setSetRegisterGupshup(false);
                                setSetRegisterMeta(false);
                                setSetRegisterSmooch(false);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitlemeta)}
                        </div>
                        {edit ? (
                            <Button
                                className={classes.centerbutton}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    history.push(paths.CHANNELS_ADD, whatsAppData);
                                }}
                            >
                                {t(langKeys.close)}
                            </Button>
                        ) : (
                            <Button
                                className={classes.centerbutton}
                                color="primary"
                                disabled={disablebutton3}
                                variant="contained"
                                onClick={() => {
                                    setViewSelected("viewfinishreg");
                                }}
                            >
                                {t(langKeys.registerwhats)}
                            </Button>
                        )}
                        <div className="row-zyx">
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.metaaccesstoken)}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAccessToken(e.target.value);
                                        setdisablebutton3(!e.target.value || !fields.service.phone);
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={t(langKeys.metaphonenumber)}
                                    style={{ width: "100%" }}
                                    type={"number"}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        setdisablebutton3(!fields.service.accesstoken || !e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (roledesc === "SUPERADMIN" && !edit) {
            return (
                <div style={{ width: "100%" }}>
                    <div style={{ width: "100%" }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                color="textSecondary"
                                href="/"
                                key={"mainview"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.push(paths.CHANNELS_ADD, whatsAppData);
                                }}
                            >
                                {t(langKeys.previoustext)}
                            </Link>
                        </Breadcrumbs>
                    </div>
                    <div style={{ width: "100%", marginTop: "20px", alignItems: "center", display: "flex" }}>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    setSetRegister360(true);
                                    setSetRegisterGupshup(false);
                                    setSetRegisterMeta(false);
                                    setSetRegisterSmooch(false);

                                    let partialField = fields;
                                    partialField.type = "WHATSAPP";

                                    setFields(partialField);
                                }}
                            >
                                {t(langKeys.register360dialog)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    setSetRegister360(false);
                                    setSetRegisterGupshup(false);
                                    setSetRegisterMeta(false);
                                    setSetRegisterSmooch(true);

                                    let partialField = fields;
                                    partialField.type = "WHATSAPPSMOOCHINSERT";

                                    setFields(partialField);
                                }}
                            >
                                {t(langKeys.registersmooch)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    setSetRegister360(false);
                                    setSetRegisterGupshup(true);
                                    setSetRegisterMeta(false);
                                    setSetRegisterSmooch(false);

                                    let partialField = fields;
                                    partialField.type = "WHATSAPPGUPSHUP";

                                    setFields(partialField);
                                }}
                            >
                                {t(langKeys.registergupshup)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={false}
                                variant="contained"
                                onClick={() => {
                                    setSetRegister360(false);
                                    setSetRegisterGupshup(false);
                                    setSetRegisterMeta(true);
                                    setSetRegisterSmooch(false);

                                    let partialField = fields;
                                    partialField.type = "WHATSAPPMETA";

                                    setFields(partialField);
                                }}
                            >
                                {t(langKeys.registermeta)}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        } else if (set360) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                history.push(paths.CHANNELS_ADD, whatsAppData);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitledialog)}
                        </div>
                        <Button
                            className={classes.centerbutton}
                            color="primary"
                            disabled={nextbutton}
                            onClick={activateChannelfunc}
                            variant="contained"
                        >
                            {t(langKeys.registerwhats)}
                        </Button>
                        <div className="row-zyx">
                            <div className={"col-3"}></div>
                            <FieldEdit
                                className="col-5"
                                label={t(langKeys.enterapikey)}
                                onChange={(value) => setAccessToken(value)}
                            />
                            <div className={"col-1"} style={{ paddingBottom: "3px" }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                    {t(langKeys.dialog_iscloud)}
                                </Box>
                                <FormControlLabel
                                    label={""}
                                    style={{ paddingLeft: 10 }}
                                    control={
                                        <IOSSwitch
                                            checked={checkedCloud}
                                            onChange={(e) => {
                                                setCheckedCloud(e.target.checked);
                                                setChecked(e.target.checked);
                                            }}
                                        />
                                    }
                                />
                            </div>
                            <div className={"col-3"}></div>
                        </div>
                    </div>
                </div>
            );
        } else if (setsmooch) {
            return (
                <div style={{ width: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            key={"mainview"}
                            onClick={(e) => {
                                e.preventDefault();
                                history.push(paths.CHANNELS_ADD, whatsAppData);
                            }}
                        >
                            {t(langKeys.previoustext)}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div
                            style={{
                                color: "#7721ad",
                                fontSize: "2em",
                                fontWeight: "bold",
                                marginLeft: "auto",
                                marginRight: "auto",
                                maxWidth: "800px",
                                padding: "20px",
                                textAlign: "center",
                            }}
                        >
                            {t(langKeys.whatsapptitlesmooch)}
                        </div>
                        <div className="row-zyx">
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={"API Key ID"}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKeyId(e.target.value);
                                        setdisablebutton2(
                                            !e.target.value || !fields.service.apikeysecret || !fields.service.appid
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={"API Key Secret"}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setApiKeySecret(e.target.value);
                                        setdisablebutton2(
                                            !e.target.value || !fields.service.apikeyid || !fields.service.appid
                                        );
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", padding: "10px 25%" }}>
                                <TextField
                                    label={"App ID"}
                                    style={{ width: "100%" }}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAppId(e.target.value);
                                        setdisablebutton2(
                                            !e.target.value || !fields.service.apikeyid || !fields.service.apikeysecret
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ width: "100%", padding: "20px 25%" }}>
                            <Button
                                className={classes.button2}
                                color="primary"
                                disabled={disablebutton2}
                                variant="contained"
                                onClick={() => {
                                    activateChannelfunc();
                                }}
                            >
                                {t(langKeys.finishreg)}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        } else {
            if (whatsAppData?.typeWhatsApp === "DIALOG") {
                return (
                    <div style={{ width: "100%" }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                color="textSecondary"
                                href="/"
                                key={"mainview"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.push(paths.CHANNELS_ADD, whatsAppData);
                                }}
                            >
                                {t(langKeys.previoustext)}
                            </Link>
                        </Breadcrumbs>
                        <div>
                            <div
                                style={{
                                    color: "#7721ad",
                                    fontSize: "2em",
                                    fontWeight: "bold",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    maxWidth: "800px",
                                    padding: "20px",
                                    textAlign: "center",
                                }}
                            >
                                {t(langKeys.whatsapptitledialog)}
                            </div>
                            {edit ? (
                                <Button
                                    className={classes.centerbutton}
                                    color="primary"
                                    disabled={false}
                                    variant="contained"
                                    onClick={() => {
                                        history.push(paths.CHANNELS_ADD, whatsAppData);
                                    }}
                                >
                                    {t(langKeys.close)}
                                </Button>
                            ) : (
                                <Button
                                    className={classes.centerbutton}
                                    color="primary"
                                    disabled={nextbutton}
                                    variant="contained"
                                    onClick={() => {
                                        setViewSelected("viewfinishreg");
                                    }}
                                >
                                    {t(langKeys.registerwhats)}
                                </Button>
                            )}
                            <div className="row-zyx">
                                <div className={"col-3"}></div>
                                <FieldEdit
                                    className="col-5"
                                    label={t(langKeys.enterapikey)}
                                    onChange={(value) => setAccessToken(value)}
                                />
                                <div className={"col-1"} style={{ paddingBottom: "3px" }}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                        {t(langKeys.dialog_iscloud)}
                                    </Box>
                                    <FormControlLabel
                                        label={""}
                                        style={{ paddingLeft: 10 }}
                                        control={
                                            <IOSSwitch
                                                checked={checkedCloud}
                                                onChange={(e) => {
                                                    setCheckedCloud(e.target.checked);
                                                    setChecked(e.target.checked);
                                                }}
                                            />
                                        }
                                    />
                                </div>
                                <div className={"col-3"}></div>
                            </div>
                        </div>
                        {roledesc === "SUPERADMIN" && edit ? (
                            <div style={{ width: "100%", alignItems: "center", display: "flex" }}>
                                <div style={{ flex: "1", margin: "0px 15px" }}>
                                    <Button
                                        className={classes.button2}
                                        color="primary"
                                        disabled={disablebutton}
                                        variant="contained"
                                        onClick={() => {
                                            setset360(true);
                                            let partialf = fields;
                                            partialf.type = "WHATSAPP";
                                            setFields(partialf);
                                        }}
                                    >
                                        {t(langKeys.activate360dialog)}
                                    </Button>
                                </div>
                                <div style={{ flex: "1", margin: "0px 15px" }}>
                                    <Button
                                        className={classes.button2}
                                        color="primary"
                                        disabled={disablebutton}
                                        variant="contained"
                                        onClick={() => {
                                            setsetsmooch(true);
                                        }}
                                    >
                                        {t(langKeys.activatesmooch)}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                );
            } else {
                return (
                    <div style={{ width: "100%" }}>
                        <div>
                            <div>
                                <div
                                    style={{
                                        color: "#7721ad",
                                        fontSize: 32,
                                        fontWeight: 500,
                                        marginBottom: 10,
                                        textAlign: "center",
                                    }}
                                >
                                    {t(langKeys.brandpointcontact)}
                                </div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 16, color: "grey" }}>
                                    {t(langKeys.brandpointcontact2)}
                                </div>
                                <div
                                    style={{
                                        color: "#7721ad",
                                        display: "flex",
                                        fontSize: 32,
                                        fontWeight: 500,
                                        textAlign: "center",
                                    }}
                                >
                                    <TextField
                                        className={classes.fields1}
                                        defaultValue={fields.service.firstname}
                                        disabled={edit}
                                        error={!!errors.firstname}
                                        fullWidth
                                        helperText={errors.firstname}
                                        label={t(langKeys.firstname)}
                                        margin="normal"
                                        name="firstname"
                                        size="small"
                                        value={fields.service.firstname}
                                        variant="outlined"
                                        onChange={(e) => {
                                            let partialf = { ...fields };
                                            partialf.service.firstname = e.target.value;
                                            setFields(partialf);
                                            setdisablebutton(
                                                !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.lastname ||
                                                !fields.service.email ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness ||
                                                !fields.service.nameassociatednumber
                                            );
                                        }}
                                    />
                                    <TextField
                                        className={classes.fields2}
                                        defaultValue={fields.service.lastname}
                                        disabled={edit}
                                        error={!!errors.lastname}
                                        fullWidth
                                        helperText={errors.lastname}
                                        label={t(langKeys.lastname)}
                                        margin="normal"
                                        name="lastname"
                                        size="small"
                                        value={fields.service.lastname}
                                        variant="outlined"
                                        onChange={(e) => {
                                            let partialf = { ...fields };
                                            partialf.service.lastname = e.target.value;
                                            setFields(partialf);
                                            setdisablebutton(
                                                !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.email ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness ||
                                                !fields.service.nameassociatednumber
                                            );
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        color: "#7721ad",
                                        display: "flex",
                                        fontSize: 32,
                                        fontWeight: 500,
                                        textAlign: "center",
                                    }}
                                >
                                    <TextField
                                        className={classes.fields1}
                                        defaultValue={fields.service.email}
                                        disabled={edit}
                                        error={!!errors.email}
                                        fullWidth
                                        helperText={errors.email}
                                        label={t(langKeys.email)}
                                        margin="normal"
                                        name="email"
                                        size="small"
                                        style={{ marginBottom: 0 }}
                                        value={fields.service.email}
                                        variant="outlined"
                                        onChange={(e) => {
                                            let partialf = { ...fields };
                                            partialf.service.email = e.target.value;
                                            setFields(partialf);
                                            setdisablebutton(
                                                !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.lastname ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness ||
                                                !fields.service.nameassociatednumber
                                            );
                                        }}
                                    />
                                    <CssPhonemui
                                        className={classes.fields2}
                                        countryCodeEditable={false}
                                        defaultCountry={"pe"}
                                        disableAreaCodes={true}
                                        disabled={edit}
                                        error={!!errors.phone}
                                        fullWidth
                                        helperText={errors.phone}
                                        label={t(langKeys.phone)}
                                        margin="normal"
                                        name="phone"
                                        size="small"
                                        value={fields.service.phone}
                                        variant="outlined"
                                        onChange={(e) => {
                                            let partialf = { ...fields };
                                            partialf.service.phone = e;
                                            setFields(partialf);
                                            setdisablebutton(
                                                !e ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.lastname ||
                                                !fields.service.email ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness ||
                                                !fields.service.nameassociatednumber
                                            );
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        color: "grey",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        marginBottom: "15px",
                                        marginLeft: "15px",
                                        textAlign: "left",
                                    }}
                                >
                                    {t(langKeys.emailcondition)}
                                </div>
                                <div
                                    style={{
                                        color: "#7721ad",
                                        fontSize: 32,
                                        fontWeight: 500,
                                        marginBottom: 10,
                                        textAlign: "center",
                                    }}
                                >
                                    {t(langKeys.whatsappinformation)}
                                </div>
                                <div
                                    style={{
                                        color: "#7721ad",
                                        display: "flex",
                                        fontSize: 32,
                                        fontWeight: 500,
                                        textAlign: "center",
                                    }}
                                >
                                    <TextField
                                        className={classes.fields3}
                                        defaultValue={fields.service.phonenumberwhatsappbusiness}
                                        disabled={edit}
                                        error={!!errors.phonenumberwhatsappbusiness}
                                        fullWidth
                                        helperText={errors.phonenumberwhatsappbusiness}
                                        label={t(langKeys.desiredphonenumberwhatsappbusiness)}
                                        margin="normal"
                                        name="phonenumberwhatsappbusiness"
                                        size="small"
                                        value={fields.service.phonenumberwhatsappbusiness}
                                        variant="outlined"
                                        onChange={(e) => {
                                            let partialf = { ...fields };
                                            partialf.service.phonenumberwhatsappbusiness = e.target.value;
                                            setFields(partialf);
                                            setdisablebutton(
                                                !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.lastname ||
                                                !fields.service.email ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.nameassociatednumber
                                            );
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        color: "grey",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        marginBottom: "15px",
                                        marginLeft: "15px",
                                        textAlign: "left",
                                    }}
                                >
                                    {t(langKeys.whatsappinformation3) + " "}
                                    <Link href="http://africau.edu/images/default/sample.pdf">
                                        {t(langKeys.whatsappguidedownload)}
                                    </Link>
                                </div>
                                <div
                                    style={{
                                        color: "#7721ad",
                                        display: "flex",
                                        fontSize: 32,
                                        fontWeight: 500,
                                        textAlign: "center",
                                    }}
                                >
                                    <TextField
                                        className={classes.fields3}
                                        defaultValue={fields.service.nameassociatednumber}
                                        disabled={edit}
                                        error={!!errors.nameassociatednumber}
                                        fullWidth
                                        helperText={errors.nameassociatednumber}
                                        label={t(langKeys.nameassociatednumber)}
                                        margin="normal"
                                        name="nameassociatednumber"
                                        size="small"
                                        value={fields.service.nameassociatednumber}
                                        variant="outlined"
                                        onChange={(e) => {
                                            let partialf = { ...fields };
                                            partialf.service.nameassociatednumber = e.target.value;
                                            setFields(partialf);
                                            setdisablebutton(
                                                !e.target.value ||
                                                !fields.service.brandname ||
                                                !fields.service.brandaddress ||
                                                !fields.service.firstname ||
                                                !fields.service.lastname ||
                                                !fields.service.email ||
                                                !fields.service.phone ||
                                                !fields.service.customerfacebookid ||
                                                !fields.service.phonenumberwhatsappbusiness
                                            );
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        color: "grey",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        marginBottom: "15px",
                                        marginLeft: "15px",
                                        textAlign: "left",
                                    }}
                                >
                                    {t(langKeys.whatsappinformation4)}
                                </div>
                                <div
                                    style={{
                                        color: "grey",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        marginBottom: "15px",
                                        marginLeft: "15px",
                                        textAlign: "left",
                                    }}
                                >
                                    <b>*{t(langKeys.whatsappsubtitle1)}</b>
                                </div>
                                <div style={{ width: "100%", alignItems: "center", display: "flex" }}>
                                    <div style={{ flex: "1", margin: "0px 15px" }}>
                                        {edit ? (
                                            <Button
                                                className={classes.button2}
                                                color="primary"
                                                disabled={false}
                                                variant="contained"
                                                onClick={() => {
                                                    history.push(paths.CHANNELS_ADD, whatsAppData);
                                                }}
                                            >
                                                {t(langKeys.close)}
                                            </Button>
                                        ) : (
                                            <Button
                                                className={classes.button2}
                                                color="primary"
                                                disabled={disablebutton}
                                                variant="contained"
                                                onClick={() => {
                                                    checkissues();
                                                }}
                                            >
                                                {t(langKeys.next)}
                                            </Button>
                                        )}
                                    </div>
                                    {roledesc === "SUPERADMIN" && edit ? (
                                        <Fragment>
                                            <div style={{ flex: "1", margin: "0px 15px" }}>
                                                <Button
                                                    className={classes.button2}
                                                    color="primary"
                                                    disabled={disablebutton}
                                                    variant="contained"
                                                    onClick={() => {
                                                        setset360(true);
                                                        let partialf = fields;
                                                        partialf.type = "WHATSAPP";
                                                        setFields(partialf);
                                                    }}
                                                >
                                                    {t(langKeys.activate360dialog)}
                                                </Button>
                                            </div>
                                            <div style={{ flex: "1", margin: "0px 15px" }}>
                                                <Button
                                                    className={classes.button2}
                                                    color="primary"
                                                    disabled={disablebutton}
                                                    variant="contained"
                                                    onClick={() => {
                                                        setsetsmooch(true);
                                                    }}
                                                >
                                                    {t(langKeys.activatesmooch)}
                                                </Button>
                                            </div>
                                        </Fragment>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
    } else {
        return (
            <div style={{ width: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        color="textSecondary"
                        href="/"
                        key={"mainview"}
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
                            color: "#7721ad",
                            fontSize: "2em",
                            fontWeight: "bold",
                            marginLeft: "auto",
                            marginRight: "auto",
                            maxWidth: "800px",
                            padding: "20px",
                            textAlign: "center",
                        }}
                    >
                        {t(langKeys.commchannelfinishreg)}
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            className="col-6"
                            label={t(langKeys.givechannelname)}
                            onChange={(value) => setnameField(value)}
                            valueDefault={fields.parameters.description}
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
                                <ChannelWhatsApp01 style={{ fill: `${coloricon}`, height: "100px", width: "100px" }} />
                                <ColorInput
                                    hex={fields.parameters.coloricon}
                                    onChange={(e) => {
                                        setFields((prev) => ({
                                            ...prev,
                                            parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                        }));
                                        setcoloricon(e.hex);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            className={classes.button}
                            color="primary"
                            disabled={channelreg || mainResult.loading}
                            variant="contained"
                            onClick={() => {
                                finishreg();
                            }}
                        >
                            {t(langKeys.finishreg)}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
};

export default ChannelAddWhatsapp;