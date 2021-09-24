/* eslint-disable react-hooks/exhaustive-deps */
import { FC, Fragment, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, TextField, InputAdornment, IconButton, FormControl, FormGroup, FormControlLabel, Checkbox, Typography, Paper } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { CompareArrowsOutlined, Visibility, VisibilityOff} from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import paths from "common/constants/paths";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { getChannelsList } from "store/channel/actions";
import GoogleLogin from 'react-google-login';
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import { Facebook as FacebookIcon, Instagram as InstagramIcon, WhatsApp as WhatsAppIcon, Message as MessageIcon } from "@material-ui/icons";
import SmsIcon from '@material-ui/icons/Sms';
import { AnyRecord } from "dns";
import { Dictionary } from "@types";
import { FieldEdit } from "components/fields/templates";
import {FirstStep2} from './FirstStep2';
import { useForm } from "react-hook-form";

interface ChannelOption {
    icon: React.ReactNode;
    label: React.ReactNode;
    key: string;
    selected: Boolean;
    onClick: () => void;
}
const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: "bold",
        fontSize: '40px',
        //textTransform: 'initial',
        width: "100%"
    },
    buttonGoogle: {
        '& button': {
            fontSize: '24px!important',
            justifyContent: 'center',
            fontFamily: "Helvetica,sans-serif!important",
            width: "50%", 
            marginLeft: "25%", 
            marginBottom: '20px'
        }
    },
    separator:{
        borderBottom: "grey solid 1px",
        width: "10vh",
        height: "1.6vh",
        margin: "0 40px"
    },
    root: {
        // maxWidth: 815,
        width: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flexGrow: 1,
        backgroundColor: 'inherit',
        textAlign: 'start',
        padding: '0 34px',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: "20px"
    },
    title: {
        fontWeight: 500,
        fontSize: 32,
        margin: '20px 0',
        color: theme.palette.primary.main,
    },
    subtitle: {
        margin: '8px 0 8px 4px',
        fontSize: 20,
        fontWeight: 500,
    },
    optionContainer: {
        margin: 4,
        display: 'flex',
        flexDirection: 'column',
        width: 124,
        height: 110,
        backgroundColor: 'white',
        fontSize: 16,
        fontWeight: 400,
        color: '#A59F9F',
        '&:hover': {
            color: 'white',
            backgroundColor: 'lightgrey',
            //backgroundColor: '#7721AD',
            cursor: 'pointer',
            fontWeight: 700,
        },
    },
    optionContainerSelected: {
        margin: 4,
        display: 'flex',
        flexDirection: 'column',
        width: 124,
        height: 110,
        backgroundColor: '#7721AD',
        fontSize: 16,
        fontWeight: 700,
        color: 'white',
    },
}));

export const FirstStep: FC<{setStep:(param:any)=>void,step:any}> = ({setStep,step}) => {
    const [viewSelected, setViewSelected] = useState("view1");
    const [mainData, setMainData] = useState<Dictionary>({
        email: "",
        password: "",
        firstandlastname: "",
        companybusinessname: "",
        mobilephone: "",
        sales: false,
        customerservice: false,
        marketing: false,
    });
    const [errors, setErrors] = useState<Dictionary>({
        email: "",
        password: "",
        confirmpassword:"",
        firstandlastname: "",
        companybusinessname: "",
    });

    const [listchannels, setlistchannels] = useState<Dictionary>({
        facebook:false,
        instagram: false,
        messenger: false,
        whatsapp: false,
        telegram: false,
        twitter: false,
        twitterDM: false,
        chatWeb: false,
        email: false,
        phone: false,
        sms: false,
    });

    function maindataChange(field:string,value:any){
        setMainData(p=>({...p,[field]:value}))
        setErrors(p=>({...p,[field]: !value?t(langKeys.field_required):""}))
    }
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const socialMediaOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Facebook',
            key: 'facebook',
            onClick: () => {
                setlistchannels(p=>({...p,facebook:!p.facebook}))
            },
            selected: listchannels.facebook
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            key: 'instagram',
            onClick: () => {
                setlistchannels(p=>({...p,instagram:!p.instagram}))
            },
            selected: listchannels.instagram
        },
        {
            icon: <MessageIcon color="inherit" />,
            label: 'Messenger',
            key: 'messenger',
            onClick: () => {
                setlistchannels(p=>({...p,messenger:!p.messenger}))
            },
            selected: listchannels.messenger
        },
        {
            icon: <WhatsAppIcon color="inherit" />,
            label: 'Whatsapp',
            key: 'whatsapp',
            onClick: () => {
                setlistchannels(p=>({...p,whatsapp:!p.whatsapp}))
            },
            selected: listchannels.whatsapp
        },
        {
            icon: <TelegramIcon color="inherit" />,
            label: 'Telegram',
            key: 'telegram',
            onClick: () => {
                setlistchannels(p=>({...p,telegram:!p.telegram}))
            },
            selected: listchannels.telegram
        },
        {
            icon: <TwitterIcon color="inherit" />,
            label: 'Twitter',
            key: 'twitter',
            onClick: () => {
                setlistchannels(p=>({...p,twitter:!p.twitter}))
            },
            selected: listchannels.twitter
        },
        {
            icon: <TwitterIcon color="inherit" />,
            label: 'Twitter DM',
            key: 'twitterDM',
            onClick: () => {
                setlistchannels(p=>({...p,twitterDM:!p.twitterDM}))
            },
            selected: listchannels.twitterDM
        },
    ];
    const businessChannelOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Chat Web',
            key: 'chatWeb',
            onClick: () => {
                setlistchannels(p=>({...p,chatWeb:!p.chatWeb}))
            },
            selected: listchannels.chatWeb
        },
        {
            icon: <EmailIcon color="inherit" />,
            label: 'Email',
            key: 'email',
            onClick: () => {
                setlistchannels(p=>({...p,email:!p.email}))
            },
            selected: listchannels.email
            
        },
        {
            icon: <PhoneIcon color="inherit" />,
            label: 'Phone',
            key: 'phone',
            onClick: () => {
                setlistchannels(p=>({...p,phone:!p.phone}))
            },
            selected: listchannels.phone
        },
        {
            icon: <SmsIcon color="inherit" />,
            label: 'Sms',
            key: 'sms',
            onClick: () => {
                setlistchannels(p=>({...p,sms:!p.sms}))
            },
            selected: listchannels.sms
        },
    ];

    const Option: FC<{ option: ChannelOption, selected: Boolean }> = ({ option,selected }) => {
        const [color, setColor] = useState('#989898');
        return (
            <Paper
                className={
                    clsx({
                        [classes.optionContainerSelected]: selected,
                        [classes.optionContainer]: !selected,
                    })
                }
                elevation={0}
                onClick={option.onClick}
                onMouseOver={() => setColor('white')}
                onMouseLeave={() => setColor('#989898')}
            >
                <div style={{ flexGrow: 2, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    {option.icon}
                </div>
                <div style={{ height: 1, backgroundColor: color }} />
                <div style={{ flexGrow: 1, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    {option.label}
                </div>
            </Paper>
        );
    };
    if(step===1){
        return(
            <FirstStep2
                setMainData={setMainData}
                mainData={mainData}
                setStep={setStep}
            ></FirstStep2>

        )
    }else if(step===2){
        return (
            <div style={{ width: '100%' }}>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", width: "50%", marginLeft: "25%" }}>{t(langKeys.signupstep1title2)}</div>
                    <div style={{padding:"20px"}}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label={t(langKeys.firstandlastname)}
                            name="firstandlastname"
                            error={!!errors.firstandlastname}
                            helperText={errors.firstandlastname}
                            onChange={(e) => maindataChange('firstandlastname',e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label={t(langKeys.companybusinessname)}
                            name="companybusinessname"
                            error={!!errors.companybusinessname}
                            helperText={errors.companybusinessname}
                            onChange={(e) => maindataChange('companybusinessname',e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            type="number"
                            fullWidth
                            label={t(langKeys.mobilephoneoptional)}
                            name="mobilephone"
                            onChange={(e) => setMainData(p=>({...p,mobilephone:e.target.value}))}
                        />
                        <div style={{padding:"20px",fontWeight: "bold", color: "#381052"}}>{t(langKeys.laraigouse)}</div>
                        <FormControl component="fieldset" style={{padding: "0 20px"}}>
                            <FormGroup aria-label="position" row>
                                <FormControlLabel
                                    style={{fontSize:"20px!important"}}
                                    value="sales"
                                    control={<Checkbox 
                                        onChange={e=>setMainData(p=>({...p,sales:!p.sales}))}
                                    />}
                                    label={t(langKeys.sales)}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    style={{fontSize:"20px!important"}}
                                    value="customerservice"
                                    control={<Checkbox 
                                        onChange={e=>setMainData(p=>({...p,customerservice:!p.customerservice}))}
                                    />}
                                    label={t(langKeys.customerservice)}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    style={{fontSize:"20px!important"}}
                                    value="marketing"
                                    control={<Checkbox 
                                        onChange={e=>setMainData(p=>({...p,marketing:!p.marketing}))}
                                    />}
                                    label={t(langKeys.marketing)}
                                    labelPlacement="end"
                                />
                            </FormGroup>
                        </FormControl>

                    </div>

                    <div style={{ width: "100%" }}>
                        <Button
                            onClick={() => { setViewSelected("viewfinishreg");setStep(3);console.log(mainData)}}
                            className={classes.button}
                            style={{ width: "80%",marginLeft:"10%" }}
                            variant="contained"
                            color="primary"
                            //disabled={nextbutton}
                        >{t(langKeys.next)}
                        </Button>

                    </div>

                </div>
            </div>
        )
    }else{
        return (
            <Fragment>
                <div style={{ width: '100%' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("view2");setStep(2) }}>
                            {"<< Previous"}
                        </Link>
                    </Breadcrumbs>
                </div>
                <div className={classes.content}>
                    <h2 className={classes.title}>{t(langKeys.channeladdtitle)}</h2>
                    <div style={{ height: 29 }} />
                    <Typography className={classes.subtitle}>{t(langKeys.socialmediachannel)}</Typography>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {socialMediaOptions.map((e, i) =>
                            <Option
                                key={`social_media_option_${i}`}
                                option={e}
                                selected={listchannels[e.key]} 
                            />
                        )}
                    </div>
                    <Typography className={classes.subtitle}>{t(langKeys.businesschannel)}</Typography>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {businessChannelOptions.map((e, i) => <Option key={`business_channel_option_${i}`} option={e} selected={listchannels[e.key]} />)}
                    </div>
                </div>
                <div style={{ width: "100%" }}>
                    <Button
                        onClick={() => { setViewSelected("viewfinishreg");setStep(3) }}
                        className={classes.button}
                        style={{ width: "80%",marginLeft:"10%" }}
                        variant="contained"
                        color="primary"
                        //disabled={nextbutton}
                    >{t(langKeys.next)}
                    </Button>

                </div>
            </Fragment>
        )
    }
}
export default FirstStep