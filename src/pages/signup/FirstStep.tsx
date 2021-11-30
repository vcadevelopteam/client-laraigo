/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { makeStyles, Button, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import FacebookLogin from 'react-facebook-login';
import { useDispatch } from "react-redux";
import GoogleLogin from 'react-google-login';
import { Facebook as FacebookIcon } from "@material-ui/icons";
import { Dictionary } from "@types";
import { useSelector } from 'hooks';
import { apiUrls } from 'common/constants';

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
            width: 400,
            height: 50,
            color: '#FFF',
        }
    },
    separator: {
        width: 82,
        borderBottom: "2px solid #D1CBCB",
        marginLeft: 32,
        marginRight: 32,
        height: "0",
    },
}));

export const FirstStep: FC<{ setMainData: (param: any) => void, mainData: any, setStep: (param: any) => void, setSnackbar: (param: any) => void }> = ({ setMainData, mainData, setStep, setSnackbar }) => {
    const [errors, setErrors] = useState<Dictionary>({
        email: "",
        password: "",
        confirmpassword: "",
    });
    const rescheckuser = useSelector(state => state.signup);
    const [waitSave, setwaitSave] = useState(false);
    const [disablebutton, setdisablebutton] = useState(true);
    useEffect(() => {
        setdisablebutton(!(mainData.email !== "" && mainData.email.includes('@') && mainData.email.includes('.') && mainData.password !== "" && mainData.confirmpassword !== "" && mainData.confirmpassword === mainData.password))
    }, [mainData])

    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const classes = useChannelAddStyles();

    useEffect(() => {
        if(waitSave){
            if (!rescheckuser.loading) {
                if (rescheckuser.isvalid) {
                    setStep(2)
                    setwaitSave(false)
                } else {
                    setSnackbar({ state: true, success: false, message: t(langKeys.useralreadyregistered) })
                    setwaitSave(false)
                }
            }    
        }
    }, [rescheckuser])

    const onGoogleLoginSucess = (r: any) => {
        if (r && r.googleId) {
            const content = {
                "method": "UFN_USERIDBYUSER",
                "parameters": {
                    "usr": null,
                    "facebookid": null,
                    "googleid": String(r.googleId)
                }
            }
            setwaitSave(true)
            setMainData((p: any) => ({ ...p, password: "" }))
            setMainData((p: any) => ({ ...p, email: "" }))
            setMainData((p: any) => ({ ...p, googleid: r.googleId }))
            dispatch(executeCheckNewUser(content))
        }
    }


    const onAuthWithFacebook = (r: any) => {
        if (r && r.id) {
            const content = {
                "method": "UFN_USERIDBYUSER",
                "parameters": {
                    "usr": r.email,
                    "facebookid": String(r.id),
                    "googleid": null
                }
            }
            setwaitSave(true)
            setMainData((p: any) => ({ ...p, password: "" }))
            setMainData((p: any) => ({ ...p, email: "" }))
            setMainData((p: any) => ({ ...p, facebookid: r.id }))
            dispatch(executeCheckNewUser(content))
        }
    }
    function handlesubmit() {
        const content = {
            "method": "UFN_USERIDBYUSER",
            "parameters": {
                "usr": mainData.email,
                "facebookid": null,
                "googleid": null
            }
        }
        setwaitSave(true)
        dispatch(executeCheckNewUser(content))

    }

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: any) => event.preventDefault();
    return (
        <>
            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", marginBottom: 32 }}>{t(langKeys.signupstep1title)}</div>
            <FacebookLogin
                appId={apiUrls.FACEBOOKAPP}
                callback={onAuthWithFacebook}
                fields="name,email,picture"
                buttonStyle={{
                    borderRadius: '3px', width: "400px", height: 50, display: 'flex', alignItems: 'center', 'fontSize': '24px', fontStyle: 'normal', fontWeight: 400, textTransform: 'none', justifyContent: 'center', marginBottom: 16
                }}
                textButton={t(langKeys.signup_with_facebook)}
                icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
            />
            <div className={classes.buttonGoogle}>
                <GoogleLogin
                    clientId="792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com"
                    buttonText={t(langKeys.signupgooglebutton)}
                    style={{ borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    cookiePolicy={'single_host_origin'}
                    onSuccess={onGoogleLoginSucess}
                />
            </div>

            <div style={{ display: "flex", alignItems: 'center', marginTop: 40, marginBottom: 32 }}>
                <div className={classes.separator}></div>
                <div style={{ fontSize: 24, fontWeight: 500, color: "#989898" }}>Or</div>
                <div className={classes.separator}></div>
            </div>

            <div>
                <TextField
                    variant="outlined"
                    size="small"
                    margin="normal"
                    fullWidth
                    type="email"
                    label={t(langKeys.email)}
                    name="email"
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={(e) => {
                        setMainData((p: any) => ({ ...p, email: e.target.value }))
                        setErrors(p => ({ ...p, email: !e.target.value ? t(langKeys.field_required) : "" }))
                        setErrors(p => ({ ...p, email: e.target.value.includes('@') && e.target.value.includes('.') ? "" : t(langKeys.emailverification) }))
                    }}
                />
                <TextField
                    variant="outlined"
                    size="small"
                    margin="normal"
                    fullWidth
                    label={t(langKeys.password)}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password}
                    onChange={(e) => {
                        setMainData((p: any) => ({ ...p, password: e.target.value }))
                        setErrors(p => ({ ...p, password: !e.target.value ? t(langKeys.field_required) : "" }))
                        setErrors(p => ({ ...p, confirmpassword: !mainData.confirmpassword ? t(langKeys.field_required) : "" }))
                        setErrors(p => ({ ...p, confirmpassword: mainData.confirmpassword === e.target.value ? p.confirmpassword : t(langKeys.passwordsmustbeequal) }))
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
                <TextField
                    variant="outlined"
                    size="small"
                    margin="normal"
                    fullWidth
                    label={t(langKeys.confirmpassword)}
                    name="confirmpassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={!!errors.confirmpassword}
                    helperText={errors.confirmpassword}
                    onChange={(e) => {
                        setMainData((p: any) => ({ ...p, confirmpassword: e.target.value }))
                        setErrors(p => ({ ...p, confirmpassword: !e.target.value ? t(langKeys.field_required) : "" }))
                        setErrors(p => ({ ...p, confirmpassword: mainData.password === e.target.value ? p.confirmpassword : t(langKeys.passwordsmustbeequal) }))
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
                <div style={{ textAlign: "center", padding: "20px" }}>{t(langKeys.tos)}<a href="https://app.laraigo.com/privacy" target="_blank" rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>
                <Button
                    onClick={() => { handlesubmit() }}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={disablebutton}
                >{t(langKeys.submit)}
                </Button>

            </div>
        </>
    )
}
export default FirstStep