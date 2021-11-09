/* eslint-disable react-hooks/exhaustive-deps */
import { FC, Fragment, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box, TextField } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { FieldEdit, ColorInput } from "components";
import { styled } from '@material-ui/core/styles';
import MuiPhoneNumber from 'material-ui-phone-number';
import { useHistory, useLocation } from "react-router";
import paths from "common/constants/paths";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { insertChannel,activateChannel } from "store/channel/actions";
import { WhatsappIcon } from "icons";
import { Dictionary } from "@types";

const useChannelAddStyles = makeStyles(theme => ({
    centerbutton: {
        marginLeft: "calc(50% - 96px)",
        marginTop: "30px",
        marginBottom: "20px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
    button2: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "100%",
    },
    fields1: {
        flex:1,
        margin: "15px"
    },
    fields2: {
        flex:1,
    },
    fields3: {
        flex:1,
        marginLeft: "15px"
    },
}));

const CssPhonemui = styled(MuiPhoneNumber)({
    '& label.Mui-focused': {
        color: '#7721ad',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#7721ad',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#7721ad',
        },
    },
});

interface whatsAppData {
    typeWhatsApp?: string;
    row?: any;
}

export const ChannelAddWhatsapp: FC<{ edit: boolean }> = ({ edit }) => {
    const [channelreg, setChannelreg] = useState(true);
    const [coloricon, setcoloricon] = useState("#4AC959");
    const [viewSelected, setViewSelected] = useState("view1");
    const [nextbutton, setNextbutton] = useState(true);
    const [disablebutton, setdisablebutton] = useState(true);
    const [disablebutton2, setdisablebutton2] = useState(true);
    const [setins, setsetins] = useState(false);
    const [set360, setset360] = useState(false);
    const [setsmooch, setsetsmooch] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [setParameters, setSetParameters] = useState(true);
   
    const user = useSelector(state => state.login.validateToken.user);
    const roledesc = user?.roledesc || "";
    const executeResult = useSelector(state => state.channel.successinsert);
    const executeActivationResult = useSelector(state => state.channel.activateChannel);
    const mainResult = useSelector(state => state.channel.channelList);

    const classes = useChannelAddStyles();
    const history = useHistory();
    const location = useLocation<whatsAppData>();

    const whatsAppData = location.state as whatsAppData | null;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        if (edit && !whatsAppData?.row) {
            history.push(paths.CHANNELS);
        } else if (edit && whatsAppData?.row && whatsAppData?.row.servicecredentials.length === 0) {
            history.push(paths.CHANNELS);
        }
    }, [history]);

    const [errors] = useState<Dictionary>({
        accesstoken: "",
        brandName: "",
        brandAddress: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        customerfacebookid: "",
        phonenumberwhatsappbusiness: "",
        nameassociatednumber: "",
    });

    const [fields, setFields] = useState({
        "method": "UFN_COMMUNICATIONCHANNEL_INS",
        "parameters": {
            "id": 0,
            "description": "",
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
            "coloricon": "#4AC959",
        },
        "type": whatsAppData?.typeWhatsApp==="DIALOG"?"WHATSAPP":"WHATSAPPSMOOCH",
        "service": {
            "accesstoken": "",
            "brandname": "",
            "brandaddress": "",
            "firstname": "",
            "lastname": "",
            "email": "",
            "phone": "",
            "customerfacebookid": "",
            "phonenumberwhatsappbusiness": "",
            "nameassociatednumber": "",
            "apikeyid": "",
            "apikeysecret": "",
            "appid": "",
        }
    })

    if (typeof location?.state === 'undefined' || !location?.state) {
        history.push(paths.CHANNELS);
    }

    async function finishreg() {
        setsetins(true)
        dispatch(insertChannel(fields))
        setWaitSave(true);
        setViewSelected("main")
    }

    useEffect(() => {
        if (edit) {
            if (setParameters) {
                setSetParameters(false);
                if (whatsAppData?.row) {
                    if (whatsAppData && whatsAppData?.row.servicecredentials.length > 0) {
                        var serviceField = JSON.parse(whatsAppData.row.servicecredentials);
                
                        setFields({
                            "method": "UFN_COMMUNICATIONCHANNEL_INS",
                            "parameters": {
                                "id": whatsAppData.row.communicationchannelid,
                                "description": whatsAppData.row.communicationchanneldesc,
                                "type": whatsAppData.row.type,
                                "communicationchannelsite": whatsAppData.row.communicationchannelsite,
                                "communicationchannelowner": whatsAppData.row.communicationchannelowner,
                                "chatflowenabled": whatsAppData.row.chatflowenabled,
                                "integrationid": whatsAppData.row.integrationid,
                                "color": whatsAppData.row.color,
                                "icons": whatsAppData.row.icons,
                                "other": whatsAppData.row.other,
                                "form": whatsAppData.row.form,
                                "apikey": whatsAppData.row.apikey,
                                "coloricon": whatsAppData.row.coloricon,
                            },
                            "type": "WHATSAPPSMOOCH",
                            "service": {
                                "accesstoken": serviceField.accesstoken,
                                "brandname": serviceField.brandname,
                                "brandaddress": serviceField.brandaddress,
                                "firstname": serviceField.firstname,
                                "lastname": serviceField.lastname,
                                "email": serviceField.email,
                                "phone": serviceField.phone,
                                "customerfacebookid": serviceField.customerfacebookid,
                                "phonenumberwhatsappbusiness": serviceField.phonenumberwhatsappbusiness,
                                "nameassociatednumber": serviceField.nameassociatednumber,
                                "apikeyid": "",
                                "apikeysecret": "",
                                "appid": "",
                            }
                        });

                        setdisablebutton(false);
                    }
                }
            }
        }
    }, [setParameters])

    useEffect(() => {
        if (!mainResult.loading && setins){
            if (executeResult) {
                setsetins(false)
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                history.push(paths.CHANNELS)
            } else if (!executeResult) {
                const errormessage = t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [mainResult])

    function checkissues(){
        setViewSelected("viewfinishreg")
    }

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])

    function setnameField(value: any) {
        setChannelreg(value==="")
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }

    function setService(value: string, field: string) {
        setNextbutton(value==="")
        let partialf = fields;
        partialf.service.accesstoken = value;
        partialf.parameters.communicationchannelowner = "";
        setFields(partialf)
    }

    function setApiKeyId(value: string, field: string) {
        setNextbutton(value==="")
        let partialf = fields;
        partialf.service.apikeyid = value;
        partialf.parameters.communicationchannelowner = "";
        setFields(partialf)
    }

    function setApiKeySecret(value: string, field: string) {
        setNextbutton(value==="")
        let partialf = fields;
        partialf.service.apikeysecret = value;
        partialf.parameters.communicationchannelowner = "";
        setFields(partialf)
    }

    function setAppId(value: string, field: string) {
        setNextbutton(value==="")
        let partialf = fields;
        partialf.service.appid = value;
        partialf.parameters.communicationchannelowner = "";
        setFields(partialf)
    }

    async function activateChannelfunc() {
        dispatch(showBackdrop(true));
        dispatch(activateChannel(fields))
    }
    useEffect(() => {
        if(!executeActivationResult.loading && (set360||setsmooch)){
            dispatch(showBackdrop(false));
            if (executeActivationResult.error){
                dispatch(showSnackbar({ show: true, success: false, message: String(executeActivationResult.message) }))
            }else{
                dispatch(showSnackbar({ show: true, success: true, message: "Success" }))
                history.push(paths.CHANNELS);
            }
        }
    }, [executeActivationResult]);

    if(viewSelected==="view1"){
        if(set360){
            return(
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD) }}>
                        {"<< Previous"}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.whatsapptitle)}</div>

                    <Button
                        className={classes.centerbutton}
                        variant="contained"
                        color="primary"
                        disabled={nextbutton}
                        onClick={activateChannelfunc}
                    >{t(langKeys.registerwhats)}
                    </Button>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => setService(value, "accesstoken")}
                            label={t(langKeys.enterapikey)}
                            className="col-6"
                        />
                    </div>

                </div>
            </div>)
        }else if(setsmooch){
            return(
                <div style={{ width: '100%' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD) }}>
                            {"<< Previous"}
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.whatsapptitle)}</div>
    
                        <div className="row-zyx">
                            <div style={{width:"100%",padding: "10px 25%"}}>

                                <TextField
                                    style={{width:"100%"}}
                                    onChange={(e) => {
                                        setApiKeyId(e.target.value, "apikeyid");
                                        setdisablebutton2(!e.target.value || !fields.service.apikeysecret || !fields.service.appid)
                                    }}
                                    variant="outlined"
                                    label={"Apikey Id"}
                                />
                            </div>
                            <div style={{width:"100%",padding: "10px 25%"}}>
                                <TextField
                                    style={{width:"100%"}}
                                    onChange={(e) => {
                                        setApiKeySecret(e.target.value, "apikeysecret");
                                        setdisablebutton2(!e.target.value || !fields.service.apikeyid || !fields.service.appid)
                                    }}
                                    variant="outlined"
                                    label={"Apikey Secret"}
                                />
                            </div>
                            <div style={{width:"100%",padding: "10px 25%"}}>
                                <TextField
                                    style={{width:"100%"}}
                                    onChange={(e) => {
                                        setAppId(e.target.value, "appid");
                                        setdisablebutton2(!e.target.value || !fields.service.apikeyid || !fields.service.apikeysecret)
                                    }}
                                    variant="outlined"
                                    label={"App Id"}
                                />
                            </div>
                        </div>
                        <div style={{width:"100%",padding: "20px 25%"}}>
                            <Button
                                onClick={() => { activateChannelfunc() }}
                                className={classes.button2}
                                disabled={disablebutton2}
                                variant="contained"
                                color="primary"
                            >{t(langKeys.finishreg)}
                            </Button>
                        </div>
    
                    </div>
                </div>)
        }    
        else{
            if(whatsAppData?.typeWhatsApp==="DIALOG"){
                return (
                    <div style={{ width: '100%' }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD) }}>
                                {"<< Previous"}
                            </Link>
                        </Breadcrumbs>
                        <div>
                            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.whatsapptitle)}</div>
        
                            {
                                edit ?
                                <Button
                                    className={classes.centerbutton}
                                    variant="contained"
                                    color="primary"
                                    disabled={false}
                                    onClick={() => { history.push(paths.CHANNELS) }}
                                    >{t(langKeys.close)}
                                </Button>
                                :
                                <Button
                                    className={classes.centerbutton}
                                    variant="contained"
                                    color="primary"
                                    disabled={nextbutton}
                                    onClick={() => { setViewSelected("viewfinishreg") }}
                                    >{t(langKeys.registerwhats)}
                                </Button>
                            }
                            <div className="row-zyx">
                                <div className="col-3"></div>
                                <FieldEdit
                                    onChange={(value) => setService(value, "accesstoken")}
                                    label={t(langKeys.enterapikey)}
                                    className="col-6"
                                />
                            </div>
        
                        </div>
                        {
                            roledesc === "SUPERADMIN"?
                            <div style={{ width: "100%", alignItems: "center", display: "flex"}}>
                            <div style={{ flex: "1", margin: "0px 15px"}}>
                                <Button
                                    onClick={() => { setset360(true);
                                        let partialf = fields;
                                        partialf.type = "WHATSAPP";
                                        setFields(partialf); }}
                                    className={classes.button2}
                                    disabled={disablebutton}
                                    variant="contained"
                                    color="primary"
                                >{t(langKeys.activate360dialog)}
                                </Button>
                            </div>
                            <div style={{ flex: "1", margin: "0px 15px"}}>
                                <Button
                                    onClick={() => { setsetsmooch(true) }}
                                    className={classes.button2}
                                    disabled={disablebutton}
                                    variant="contained"
                                    color="primary"
                                >{t(langKeys.activatesmooch)}
                                </Button>
                            </div>
                            </div>
                            :""
                        }
                    </div>
                )
            }else{
                return (
                    <div style={{ width: '100%' }}>
                        <div>    
                            <div >
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad",marginBottom: 15}}>{t(langKeys.signupstep1title2)}</div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display:"flex"}}>
                                    <TextField
                                        className={classes.fields1}
                                        variant="outlined"
                                        margin="normal"
                                        size="small"
                                        defaultValue={fields.service.brandname}
                                        label={t(langKeys.brandname)}
                                        name="brandname"
                                        error={!!errors.brandname}
                                        helperText={errors.brandname}
                                        onChange={(e) => {
                                            let partialf = {...fields};
                                            partialf.service.brandname = e.target.value;
                                            setFields(partialf)
                                            setdisablebutton(!(e.target.value) || !(fields.service.brandaddress) || !(fields.service.firstname) || !(fields.service.lastname) || !(fields.service.email) 
                                                    || !(fields.service.phone) || !(fields.service.customerfacebookid) || !(fields.service.phonenumberwhatsappbusiness) || !(fields.service.nameassociatednumber) )
                                        }}
                                        value={fields.service.brandname}
                                        disabled={edit}
                                    />
                                    <TextField
                                        className={classes.fields2}
                                        variant="outlined"
                                        margin="normal"
                                        size="small"
                                        defaultValue={fields.service.brandaddress}
                                        label={t(langKeys.brandaddress)}
                                        name="brandaddress"
                                        error={!!errors.brandaddress}
                                        helperText={errors.brandaddress}
                                        onChange={(e) => {
                                            let partialf = {...fields};
                                            partialf.service.brandaddress = e.target.value;
                                            setFields(partialf)
                                            setdisablebutton(!(e.target.value) || !(fields.service.brandname) || !(fields.service.firstname) || !(fields.service.lastname) || !(fields.service.email) 
                                                    || !(fields.service.phone) || !(fields.service.customerfacebookid) || !(fields.service.phonenumberwhatsappbusiness) || !(fields.service.nameassociatednumber) )
                                        }}
                                        value={fields.service.brandaddress}
                                        disabled={edit}
                                    />
                                </div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad",marginBottom: 10}}>{t(langKeys.brandpointcontact)}</div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 16, color: "grey"}}>{t(langKeys.brandpointcontact2)}</div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display:"flex"}}>
                                    <TextField
                                        className={classes.fields1}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        size="small"
                                        defaultValue={fields.service.firstname}
                                        label={t(langKeys.firstname)}
                                        name="firstname"
                                        error={!!errors.firstname}
                                        helperText={errors.firstname}
                                        onChange={(e) => {
                                            let partialf = {...fields};
                                            partialf.service.firstname = e.target.value;
                                            setFields(partialf)
                                            setdisablebutton(!(e.target.value) || !(fields.service.brandname) || !(fields.service.brandaddress) || !(fields.service.lastname) || !(fields.service.email) 
                                                    || !(fields.service.phone) || !(fields.service.customerfacebookid) || !(fields.service.phonenumberwhatsappbusiness) || !(fields.service.nameassociatednumber) )
                                        }}
                                        value={fields.service.firstname}
                                        disabled={edit}
                                    />
                                    <TextField
                                        className={classes.fields2}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        size="small"
                                        defaultValue={fields.service.lastname}
                                        label={t(langKeys.lastname)}
                                        name="lastname"
                                        error={!!errors.lastname}
                                        helperText={errors.lastname}
                                        onChange={(e) => {
                                            let partialf = {...fields};
                                            partialf.service.lastname = e.target.value;
                                            setFields(partialf)
                                            setdisablebutton(!(e.target.value) || !(fields.service.brandname) || !(fields.service.brandaddress) || !(fields.service.firstname) || !(fields.service.email) 
                                                    || !(fields.service.phone) || !(fields.service.customerfacebookid) || !(fields.service.phonenumberwhatsappbusiness) || !(fields.service.nameassociatednumber) )
                                        }}
                                        value={fields.service.lastname}
                                        disabled={edit}
                                    />
                                </div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display:"flex"}}>
                                    <TextField
                                        className={classes.fields1}
                                        style={{ marginBottom: 0 }}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        size="small"
                                        label={t(langKeys.email)}
                                        name="email"
                                        defaultValue={fields.service.email}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        onChange={(e) => {
                                            let partialf = {...fields};
                                            partialf.service.email = e.target.value;
                                            setFields(partialf)
                                            setdisablebutton(!(e.target.value) || !(fields.service.brandname) || !(fields.service.brandaddress) || !(fields.service.firstname) || !(fields.service.lastname) 
                                                    || !(fields.service.phone) || !(fields.service.customerfacebookid) || !(fields.service.phonenumberwhatsappbusiness) || !(fields.service.nameassociatednumber) )
                                        }}
                                        value={fields.service.email}
                                        disabled={edit}
                                    />
                                    <CssPhonemui
                                        className={classes.fields2}
                                        variant="outlined"
                                        margin="normal"
                                        size="small"
                                        disableAreaCodes={true}
                                        value={fields.service.phone}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        label={t(langKeys.phone)}
                                        name="phone"
                                        fullWidth
                                        defaultCountry={'pe'}                                    
                                        onChange={(e) => {
                                            let partialf = {...fields};
                                            partialf.service.phone = e;
                                            setFields(partialf)
                                            setdisablebutton(!(e) || !(fields.service.brandname) || !(fields.service.brandaddress) || !(fields.service.firstname) || !(fields.service.lastname) 
                                                    || !(fields.service.email) || !(fields.service.customerfacebookid) || !(fields.service.phonenumberwhatsappbusiness) || !(fields.service.nameassociatednumber) )
                                        }}
                                        disabled={edit}
                                    />
                                </div>
                                <div style={{ textAlign: "left", fontWeight: 500, fontSize: 12, color: "grey",marginLeft: "15px",marginBottom: "15px"}}>{t(langKeys.emailcondition)}</div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad",marginBottom: 10}}>{t(langKeys.whatsappinformation)}</div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display:"flex"}}>
                                    <TextField
                                        className={classes.fields3}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        size="small"
                                        defaultValue={fields.service.customerfacebookid}
                                        label={t(langKeys.customerfacebookid)}
                                        name="customerfacebookid"
                                        error={!!errors.customerfacebookid}
                                        helperText={errors.customerfacebookid}
                                        onChange={(e) => {
                                            let partialf = {...fields};
                                            partialf.service.customerfacebookid = e.target.value;
                                            setFields(partialf)
                                            setdisablebutton(!(e.target.value) || !(fields.service.brandname) || !(fields.service.brandaddress) || !(fields.service.firstname) || !(fields.service.lastname) 
                                                    || !(fields.service.email) || !(fields.service.phone) || !(fields.service.phonenumberwhatsappbusiness) || !(fields.service.nameassociatednumber) )
                                        }}
                                        value={fields.service.customerfacebookid}
                                        disabled={edit}
                                    />
                                </div>
                                <div style={{ textAlign: "left", fontWeight: 500, fontSize: 12, color: "grey",marginLeft: "15px",marginBottom: "15px"}}>{t(langKeys.whatsappinformation2)}</div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display:"flex"}}>
                                    <TextField
                                        className={classes.fields3}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        size="small"
                                        defaultValue={fields.service.phonenumberwhatsappbusiness}
                                        label={t(langKeys.desiredphonenumberwhatsappbusiness)}
                                        name="phonenumberwhatsappbusiness"
                                        error={!!errors.phonenumberwhatsappbusiness}
                                        helperText={errors.phonenumberwhatsappbusiness}
                                        onChange={(e) => {
                                            let partialf = {...fields};
                                            partialf.service.phonenumberwhatsappbusiness = e.target.value;
                                            setFields(partialf)
                                            setdisablebutton(!(e.target.value) || !(fields.service.brandname) || !(fields.service.brandaddress) || !(fields.service.firstname) || !(fields.service.lastname) 
                                                    || !(fields.service.email) || !(fields.service.phone) || !(fields.service.customerfacebookid) || !(fields.service.nameassociatednumber) )
                                        }}
                                        value={fields.service.phonenumberwhatsappbusiness}
                                        disabled={edit}
                                    />
                                </div>
                                <div style={{ textAlign: "left", fontWeight: 500, fontSize: 12, color: "grey",marginLeft: "15px",marginBottom: "15px"}}>{t(langKeys.whatsappinformation3)}</div>
                                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display:"flex"}}>
                                    <TextField
                                        className={classes.fields3}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        size="small"
                                        defaultValue={fields.service.nameassociatednumber}
                                        label={t(langKeys.nameassociatednumber)}
                                        name="nameassociatednumber"
                                        error={!!errors.nameassociatednumber}
                                        helperText={errors.nameassociatednumber}
                                        onChange={(e) => {
                                            let partialf = {...fields};
                                            partialf.service.nameassociatednumber = e.target.value;
                                            setFields(partialf)
                                            setdisablebutton(!(e.target.value) || !(fields.service.brandname) || !(fields.service.brandaddress) || !(fields.service.firstname) || !(fields.service.lastname) 
                                                    || !(fields.service.email) || !(fields.service.phone) || !(fields.service.customerfacebookid) || !(fields.service.phonenumberwhatsappbusiness) )
                                        }}
                                        value={fields.service.nameassociatednumber}
                                        disabled={edit}
                                    />
                                </div>
                                <div style={{ textAlign: "left", fontWeight: 500, fontSize: 12, color: "grey",marginLeft: "15px",marginBottom: "15px"}}>{t(langKeys.whatsappinformation4)}</div>
                                <div style={{ width: "100%", alignItems: "center", display: "flex"}}>
                                    <div style={{ flex: "1", margin: "0px 15px"}}>
                                        {edit ?
                                        <Button
                                            onClick={() => { history.push(paths.CHANNELS) }}
                                            className={classes.button2}
                                            disabled={false}
                                            variant="contained"
                                            color="primary"
                                        >{t(langKeys.close)}
                                        </Button>
                                        :
                                        <Button
                                            onClick={() => { checkissues() }}
                                            className={classes.button2}
                                            disabled={disablebutton}
                                            variant="contained"
                                            color="primary"
                                        >{t(langKeys.next)}
                                        </Button>
                                        }
                                    </div>
                                    {
                                        roledesc === "SUPERADMIN"?
                                        <Fragment>
                                        <div style={{ flex: "1", margin: "0px 15px"}}>
                                            <Button
                                                onClick={() => { setset360(true);
                                                    let partialf = fields;
                                                    partialf.type = "WHATSAPP";
                                                    setFields(partialf); }}
                                                className={classes.button2}
                                                disabled={disablebutton}
                                                variant="contained"
                                                color="primary"
                                            >{t(langKeys.activate360dialog)}
                                            </Button>
                                        </div>
                                        <div style={{ flex: "1", margin: "0px 15px"}}>
                                            <Button
                                                onClick={() => { setsetsmooch(true) }}
                                                className={classes.button2}
                                                disabled={disablebutton}
                                                variant="contained"
                                                color="primary"
                                            >{t(langKeys.activatesmooch)}
                                            </Button>
                                        </div>
                                        </Fragment>
                                        :""
                                    }
                                </div>
    
                            </div>
        
                        </div>
                    </div>
                )
            }
        }
        
    }else{
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view1") }}>
                        {"<< Previous"}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.commchannelfinishreg)}</div>

                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => setnameField(value)}
                            label={t(langKeys.givechannelname)}
                            className="col-6"
                            valueDefault={fields.parameters.description}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <div className="col-6">
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                            {t(langKeys.givechannelcolor)}
                            </Box>
                            <div style={{display:"flex",justifyContent:"space-around", alignItems: "center"}}>
                                <WhatsappIcon style={{fill: `${coloricon}`, width: "100px" }}/>
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
                            onClick={() => { finishreg() }}
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