/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { makeStyles, Button, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff} from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import FacebookLogin from 'react-facebook-login';
import { useDispatch } from "react-redux";
import GoogleLogin from 'react-google-login';
import { Facebook as FacebookIcon } from "@material-ui/icons";
import { Dictionary } from "@types";
import { useSelector } from 'hooks';

import { executeCheckNewUser } from "store/signup/actions";
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
}));

export const FirstStep: FC<{setMainData:(param:any)=>void,mainData:any,setStep:(param:any)=>void,setSnackbar:(param:any)=>void}> = ({setMainData,mainData,setStep,setSnackbar}) => {
    const [errors, setErrors] = useState<Dictionary>({
        email: "",
        password: "",
        confirmpassword:"",
    });
    const resLogin = useSelector(state => state.login.login);
    const rescheckuser = useSelector(state => state.signup);
    const [disablebutton, setdisablebutton] = useState(true);
    const [firstlaunch, setfirstlaunch] = useState(true);
    useEffect(() => {
        setdisablebutton(!(mainData.email !== "" && mainData.password !== "" &&  mainData.confirmpassword !== "" && mainData.confirmpassword===mainData.password))
    }, [mainData])

    function maindataChange(field:string,value:any){
        setMainData((p:any) =>({...p,[field]:value}))
        setErrors(p=>({...p,[field]: !value?t(langKeys.field_required):""}))
    }
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    useEffect(() => {
        console.log(resLogin)
    }, [resLogin])
    useEffect(() => {
        if(!rescheckuser.loading){
            if(rescheckuser.isvalid){
                setStep(2)
            }else{
                if(!firstlaunch){
                    setSnackbar({ state: true, success: false, message: t(langKeys.useralreadyregistered) })
                }else{
                    setfirstlaunch(false)
                }
            }
        }
    }, [rescheckuser])
    
    const onGoogleLoginSucess = (r: any) => {
        if (r && r.googleId) {
            const content={
                "method": "UFN_USERIDBYUSER",
                "parameters": {
                    "usr": null,
                    "facebookid": null,
                    "googleid": String(r.googleId)
                }
            }
            setMainData((p:any) =>({...p,password:""}))
            setMainData((p:any) =>({...p,email:""}))
            setMainData((p:any)=>({...p,googleid:r.googleId}))
            dispatch(executeCheckNewUser(content))
        }
    }
    

    const onAuthWithFacebook = (r: any) => {
        if (r && r.id) {
            const content={
                "method": "UFN_USERIDBYUSER",
                "parameters": {
                    "usr": null,
                    "facebookid": String(r.id),
                    "googleid": null
                }
            }
            setMainData((p:any) =>({...p,password:""}))
            setMainData((p:any) =>({...p,email:""}))
            setMainData((p:any)=>({...p,facebookid:r.id}))
            dispatch(executeCheckNewUser(content))
        }
    }
    function handlesubmit(){
        const content={
            "method": "UFN_USERIDBYUSER",
            "parameters": {
                "usr": mainData.email,
                "facebookid": null,
                "googleid": null
            }
        }
        dispatch(executeCheckNewUser(content))
        
    }

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: any) => event.preventDefault();
    return (
        <div style={{ width: '100%' }}>
            <div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.signupstep1title)}</div>
                    <FacebookLogin
                        appId="1094526090706564"
                        callback={onAuthWithFacebook}
                        buttonStyle={{ borderRadius: '3px',width: "50%", marginLeft: "25%", height: '60px', display: 'flex', alignItems: 'center', 'fontSize': '24px', 
                        fontStyle: 'normal', fontWeight: 600, textTransform: 'none', justifyContent: 'center', marginBottom: '20px' }}
                        textButton={t(langKeys.signup_with_facebook)}
                        icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                    />
                    <div className={classes.buttonGoogle}>
                        <GoogleLogin
                            clientId="792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com"
                            buttonText={t(langKeys.signupgooglebutton)}
                            style={{ borderRadius: '3px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                            cookiePolicy={'single_host_origin'}
                            onSuccess={onGoogleLoginSucess}
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
                        setMainData((p:any) =>({...p,confirmpassword:e.target.value}))
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
                        onClick={() => {handlesubmit() }}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={disablebutton}
                    >{t(langKeys.submit)}
                    </Button>
                </div>

            </div>
        </div>
    )
}
export default FirstStep