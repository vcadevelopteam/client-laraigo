/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState } from "react";
import { makeStyles, Button, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { showBackdrop } from 'store/popus/actions';
import { Visibility, VisibilityOff} from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import FacebookLogin from 'react-facebook-login';
import { useDispatch } from "react-redux";
import { getChannelsList } from "store/channel/actions";
import GoogleLogin from 'react-google-login';
import { Facebook as FacebookIcon, Instagram as InstagramIcon, WhatsApp as WhatsAppIcon, Message as MessageIcon } from "@material-ui/icons";
import { Dictionary } from "@types";

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

export const FirstStep2: FC<{setMainData:(param:any)=>void,mainData:any,setStep:(param:any)=>void}> = ({setMainData,mainData,setStep}) => {
    const [errors, setErrors] = useState<Dictionary>({
        email: "",
        password: "",
        confirmpassword:"",
    });

    function maindataChange(field:string,value:any){
        setMainData((p:any) =>({...p,[field]:value}))
        setErrors(p=>({...p,[field]: !value?t(langKeys.field_required):""}))
    }
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const classes = useChannelAddStyles();

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getChannelsList(r.accessToken))
            dispatch(showBackdrop(true));
        }
    }
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: any) => event.preventDefault();
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
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="email"
                    label={t(langKeys.email)}
                    name="email"
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={(e) => maindataChange('email',e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={t(langKeys.password)}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password}
                    onChange={(e) => maindataChange('password',e.target.value)}
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
                    error={!!errors.confirmpassword}
                    helperText={errors.confirmpassword}
                    onChange={(e) => {
                        setErrors(p=>({...p,confirmpassword: !e.target.value?t(langKeys.field_required):""}))
                        setErrors(p=>({...p,confirmpassword: mainData.password===e.target.value?p.confirmpassword:t(langKeys.passwordsmustbeequal)}))
                    }}
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
                        onClick={() => {setStep(2) }}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                    >{t(langKeys.submit)}
                    </Button>
                </div>

            </div>
        </div>
    )
}
export default FirstStep2