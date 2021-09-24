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
import { useForm } from "react-hook-form";

interface ChannelOption {
    icon: React.ReactNode;
    label: React.ReactNode;
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

export const FirstStep: FC<{setStep:(param:any)=>void}> = ({setStep}) => {
    const [viewSelected, setViewSelected] = useState("view1");
    const [mainData, setMainData] = useState<Dictionary>({
        email: ""
    });
    const [error, setError] = useState<Dictionary>({
        email: false
    });

    const [listchannels, setlistchannels] = useState({
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
        let tempfield = mainData;
        let temperror = error;
        tempfield[field] = value;
        temperror[field] = value!!;
        setMainData(tempfield);
        setError(temperror);
    }
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const socialMediaOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Facebook',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.facebook = !partiallist.facebook
                setlistchannels(partiallist)
                console.log(listchannels)
            },
            selected: listchannels.facebook
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.instagram = !partiallist.instagram
                setlistchannels(partiallist)
            },
            selected: listchannels.instagram
        },
        {
            icon: <MessageIcon color="inherit" />,
            label: 'Messenger',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.messenger = !partiallist.messenger
                setlistchannels(partiallist)
            },
            selected: listchannels.messenger
        },
        {
            icon: <WhatsAppIcon color="inherit" />,
            label: 'Whatsapp',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.whatsapp = !partiallist.whatsapp
                setlistchannels(partiallist)
            },
            selected: listchannels.whatsapp
        },
        {
            icon: <TelegramIcon color="inherit" />,
            label: 'Telegram',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.telegram = !partiallist.telegram
                setlistchannels(partiallist)
            },
            selected: listchannels.telegram
        },
        {
            icon: <TwitterIcon color="inherit" />,
            label: 'Twitter',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.twitter = !partiallist.twitter
                setlistchannels(partiallist)
            },
            selected: listchannels.twitter
        },
        {
            icon: <TwitterIcon color="inherit" />,
            label: 'Twitter DM',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.twitterDM = !partiallist.twitterDM
                setlistchannels(partiallist)
            },
            selected: listchannels.twitterDM
        },
    ];
    const businessChannelOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Chat Web',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.chatWeb = !partiallist.chatWeb
                setlistchannels(partiallist)
            },
            selected: listchannels.chatWeb
        },
        {
            icon: <EmailIcon color="inherit" />,
            label: 'Email',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.email = !partiallist.email
                setlistchannels(partiallist)
            },
            selected: listchannels.email
            
        },
        {
            icon: <PhoneIcon color="inherit" />,
            label: 'Phone',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.phone = !partiallist.phone
                setlistchannels(partiallist)
            },
            selected: listchannels.phone
        },
        {
            icon: <SmsIcon color="inherit" />,
            label: 'Sms',
            onClick: () => {
                let partiallist = listchannels;
                partiallist.sms = !partiallist.sms
                setlistchannels(partiallist)
            },
            selected: listchannels.sms
        },
    ];

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getChannelsList(r.accessToken))
            setViewSelected("view2")
            dispatch(showBackdrop(true));
        }
    }
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: any) => event.preventDefault();
    const Option: FC<{ option: ChannelOption }> = ({ option }) => {
        const [color, setColor] = useState('#989898');

        return (
            <Paper
                className={
                    clsx({
                        [classes.optionContainerSelected]: option.selected,
                        [classes.optionContainer]: !option.selected,
                    })
                    //option.selected?classes.optionContainerSelected:classes.optionContainer
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
    if(viewSelected==="view1"){
        return (
            <div style={{ width: '100%' }}>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.signupstep1title)}</div>
    
                        <FacebookLogin
                            appId="474255543421911"
                            callback={processFacebookCallback}
                            autoLoad={false}
                            buttonStyle={{ borderRadius: '3px',width: "50%", marginLeft: "25%", height: '60px', display: 'flex', alignItems: 'center', 'fontSize': '24px', 
                            fontStyle: 'normal', fontWeight: 600, textTransform: 'none', justifyContent: 'center', marginBottom: '20px' }}

                            textButton={t(langKeys.signupfacebookbutton)}
                            icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                        />
                        <div className={classes.buttonGoogle}>
                            <GoogleLogin
                                clientId="792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com"
                                buttonText={t(langKeys.signupgooglebutton)}
                                style={{ borderRadius: '3px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                                //onSuccess={onGoogleLoginSucess}
                                //onFailure={onGoogleLoginFailure}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>    
                </div>
                <div style={{display:"flex",width:"50%",marginLeft: "25%", padding: "30px 0"}}>
                    <div className={classes.separator}></div>
                    <div style={{fontSize: "1.8em",fontWeight:"bold",color:"#989898"}}>Or</div>
                    <div className={classes.separator}></div>
                </div>
                
                <div style={{padding:"20px"}}>
                    <FieldEdit
                        valueDefault={mainData.email}
                        onChange={(value) => maindataChange('email',value)}
                        label={t(langKeys.email)}
                        className="col-12"
                        variant="outlined"
                        error={error.email}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label={t(langKeys.password)}
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        //value={dataAuth.password}
                        //onChange={e => setDataAuth(p => ({ ...p, password: e.target.value.trim() }))}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label={t(langKeys.confirmpassword)}
                        name="confirmpassword"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        //value={dataAuth.password}
                        //onChange={e => setDataAuth(p => ({ ...p, password: e.target.value.trim() }))}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div style={{ textAlign: "center", padding: "20px"}}>{t(langKeys.tos)}</div>
                    <div >
                        <Button
                            onClick={() => { setViewSelected("view2");setStep(2) }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            //disabled={nextbutton}
                        >{t(langKeys.submit)}
                        </Button>
                    </div>

                </div>
            </div>
        )
    }else if(viewSelected==="view2"){
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
                            //value={dataAuth.password}
                            //onChange={e => setDataAuth(p => ({ ...p, password: e.target.value.trim() }))}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label={t(langKeys.companybusinessname)}
                            name="companybusinessname"
                            //value={dataAuth.password}
                            //onChange={e => setDataAuth(p => ({ ...p, password: e.target.value.trim() }))}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            type="number"
                            fullWidth
                            label={t(langKeys.mobilephoneoptional)}
                            name="mobilephone"
                            //value={dataAuth.password}
                            //onChange={e => setDataAuth(p => ({ ...p, password: e.target.value.trim() }))}
                        />
                        <div style={{padding:"20px",fontWeight: "bold", color: "#381052"}}>{t(langKeys.laraigouse)}</div>
                        <FormControl component="fieldset" style={{padding: "0 20px"}}>
                            <FormGroup aria-label="position" row>
                                <FormControlLabel
                                    style={{fontSize:"20px!important"}}
                                    value="sales"
                                    control={<Checkbox />}
                                    label={t(langKeys.sales)}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    style={{fontSize:"20px!important"}}
                                    value="customerservice"
                                    control={<Checkbox />}
                                    label={t(langKeys.customerservice)}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    style={{fontSize:"20px!important"}}
                                    value="marketing"
                                    control={<Checkbox />}
                                    label={t(langKeys.marketing)}
                                    labelPlacement="end"
                                />
                            </FormGroup>
                        </FormControl>

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
                            />
                        )}
                    </div>
                    <Typography className={classes.subtitle}>{t(langKeys.businesschannel)}</Typography>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {businessChannelOptions.map((e, i) => <Option key={`business_channel_option_${i}`} option={e} />)}
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