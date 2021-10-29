/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box, FormControlLabel, FormGroup, TextField } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { FieldEdit, ColorInput, IOSSwitch } from "components";
import MuiPhoneNumber from 'material-ui-phone-number';
import { styled } from '@material-ui/core/styles';
import { WhatsappIcon } from "icons";
import { useSelector } from "hooks";
import { Dictionary } from "@types"

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

export const ChannelAddWhatsapp: FC<{setrequestchannels:(param:any)=>void,setlistchannels:(param:any)=>void}> = ({setrequestchannels,setlistchannels}) => {
    const [viewSelected, setViewSelected] = useState("view1");
    const planData = useSelector(state => state.signup.verifyPlan)
    const provider = planData.data[0].providerwhatsapp
    const [nextbutton, setNextbutton] = useState(true);
    const [enable, setenable] = useState(false);
    const [enablebutton, setenablebutton] = useState(false);
    const [coloricon, setcoloricon] = useState("#4AC959");
    const [channelreg, setChannelreg] = useState(true);
    const { t } = useTranslation();
    const [errors, setErrors] = useState<Dictionary>({
        accesstoken: "",
        brandName: "",
        brandAddress: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const classes = useChannelAddStyles();
    const [fields, setFields] = useState({
        "method": "UFN_COMMUNICATIONCHANNEL_INS",
        "parameters": {
            "id": 0,
            "description": "",
            "type": "",
            "communicationchannelsite": "",
            "communicationchannelowner": "",
            "chatflowenabled": false,
            "integrationid": "",
            "color": "",
            "icons": "",
            "other": "",
            "form": "",
            "apikey": "",
            "coloricon": "#4AC959",
        },
        "type": provider==="DIALOG"?"WHATSAPP":"WHATSAPPSMOOCH",
        "service": {
            "accesstoken": "",
            "brandname": "",
            "brandaddress": "",
            "firstname": "",
            "lastname": "",
            "email": "",
            "phone": "",
        }
    })
    function checkissues(){
        /*setErrors(p => ({ ...p, brandname: !(fields.service.brandname) ? t(langKeys.field_required) : "" }))
        setErrors(p => ({ ...p, brandaddress: !(fields.service.brandaddress) ? t(langKeys.field_required) : "" }))
        setErrors(p => ({ ...p, firstname: !(fields.service.firstname) ? t(langKeys.field_required) : "" }))
        setErrors(p => ({ ...p, lastname: !(fields.service.lastname) ? t(langKeys.field_required) : "" }))
        setErrors(p => ({ ...p, email: !(fields.service.email) ? t(langKeys.field_required) : "" }))
        setErrors(p => ({ ...p, phone: !(fields.service.phone) ? t(langKeys.field_required) : "" }))*/
        setViewSelected("viewfinishreg")
    }

    async function finishreg() {
        setrequestchannels((p:any)=>([...p,fields]))
        setlistchannels((p:any)=>({...p,whatsapp:false}))
    }

    function setnameField(value: any) {
        setChannelreg(value==="")
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }
    function setvalField(value: any) {
        let partialf = fields;
        partialf.parameters.chatflowenabled = value
        setFields(partialf)
    }
    function setService(value: string, field: string) {
        setNextbutton(value==="")
        let partialf = fields;
        partialf.service.accesstoken = value;
        partialf.parameters.communicationchannelowner = "";
        setFields(partialf)
    }
    if(viewSelected==="view1"){
        if(provider==="DIALOG"){
            return (
                <div style={{ width: '100%' }}>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.whatsapptitle)}</div>
    
                        <Button
                            className={classes.centerbutton}
                            variant="contained"
                            color="primary"
                            disabled={nextbutton}
                            onClick={() => { setViewSelected("viewfinishreg") }}
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
                </div>
            )
        }else{
            return (
                <div style={{ width: '100%' }}>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.whatsapptitle)}</div>
    
                        <div >
                            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad"}}>{t(langKeys.signupstep1title2)}</div>
                            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display:"flex"}}>
                                <TextField
                                    className={classes.fields1}
                                    variant="outlined"
                                    margin="normal"
                                    size="small"
                                    //defaultValue={mainData.firstandlastname}
                                    label={t(langKeys.brandname)}
                                    name="brandname"
                                    error={!!errors.brandname}
                                    helperText={errors.brandname}
                                    onChange={(e) => {
                                        let partialf = fields;
                                        partialf.service.brandname = e.target.value;
                                        setFields(partialf)
                                    }}
                                />
                                <TextField
                                    className={classes.fields2}
                                    variant="outlined"
                                    margin="normal"
                                    size="small"
                                    //defaultValue={mainData.firstandlastname}
                                    label={t(langKeys.brandaddress)}
                                    name="brandaddress"
                                    error={!!errors.brandaddress}
                                    helperText={errors.brandaddress}
                                    onChange={(e) => {
                                        let partialf = fields;
                                        partialf.service.brandaddress = e.target.value;
                                        setFields(partialf)
                                    }}
                                />
                            </div>
                            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display:"flex"}}>
                                <TextField
                                    className={classes.fields1}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    size="small"
                                    //defaultValue={mainData.firstandlastname}
                                    label={t(langKeys.firstname)}
                                    name="firstname"
                                    error={!!errors.firstname}
                                    helperText={errors.firstname}
                                    onChange={(e) => {
                                        let partialf = fields;
                                        partialf.service.firstname = e.target.value;
                                        setFields(partialf)
                                    }}
                                />
                                <TextField
                                    className={classes.fields2}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    size="small"
                                    //defaultValue={mainData.firstandlastname}
                                    label={t(langKeys.lastname)}
                                    name="lastname"
                                    error={!!errors.lastname}
                                    helperText={errors.lastname}
                                    onChange={(e) => {
                                        let partialf = fields;
                                        partialf.service.lastname = e.target.value;
                                        setFields(partialf)
                                    }}
                                />
                            </div>
                            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display:"flex"}}>
                                <TextField
                                    className={classes.fields1}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    size="small"
                                    label={t(langKeys.email)}
                                    name="email"
                                    //defaultValue={mainData.companybusinessname}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    onChange={(e) => {
                                        let partialf = fields;
                                        partialf.service.email = e.target.value;
                                        setFields(partialf)
                                    }}
                                />
                                <CssPhonemui
                                    className={classes.fields2}
                                    variant="outlined"
                                    margin="normal"
                                    size="small"
                                    disableAreaCodes={true}
                                    //value={mainData.mobilephone}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    label={t(langKeys.phone)}
                                    name="phone"
                                    fullWidth
                                    defaultCountry={'pe'}                                    
                                    onChange={(e) => {
                                        let partialf = fields;
                                        partialf.service.phone = e;
                                        setFields(partialf)
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%", margin: "0px 15px"}}>
                                <Button
                                    onClick={() => { checkissues() }}
                                    className={classes.button2}
                                    variant="contained"
                                    color="primary"
                                >{t(langKeys.next)}
                                </Button>
                            </div>

                        </div>
    
                    </div>
                </div>
            )
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
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <div className="col-6" style={{ paddingBottom: '3px' }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.enablechatflow)}</Box>
                            <FormGroup>
                                <FormControlLabel control={<IOSSwitch onChange={(e) => {setvalField(e.target.checked);setenable(e.target.checked)}}/>} label={enable?t(langKeys.enable):t(langKeys.disabled)} />
                            </FormGroup>
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