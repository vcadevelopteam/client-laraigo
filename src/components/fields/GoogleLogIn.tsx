import { FC, useEffect, useState } from 'react';
import { useSelector } from "hooks";
import { Button, makeStyles } from '@material-ui/core';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { useGoogleLogin } from '@react-oauth/google';

const useStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

interface GoogleLogInProps {
    label?: string;
    scope: string;
    googleDispatch: (param?: any) => void;
    data: {id: number, [key: string]: any};
}

export const GoogleLogIn: FC<GoogleLogInProps> = ({ label, scope, googleDispatch, data }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles();
    const resGoogleLogIn = useSelector(state => state.calendar.requestGoogleLogIn);
    const [waitExchange, setWaitExchange] = useState(false);
    
    const login = useGoogleLogin({
        onSuccess: tokenResponse => onGoogleLoginSucess(tokenResponse),
        onError: error => onGoogleLoginFailure(error),
        flow: 'auth-code',
        scope: scope,
    });

    const onGoogleLoginSucess = (event: any) => {
        if (event) {
            if (event.code) {
                setWaitExchange(true);
                dispatch(showBackdrop(true));
                googleDispatch(event);
            }
        }
    }

    const onGoogleLoginFailure = (event: any) => {
        console.log('GOOGLE LOGIN FAILURE: ' + JSON.stringify(event));
    }

    useEffect(() => {
        if (waitExchange) {
            if (!resGoogleLogIn.loading && !resGoogleLogIn.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                setWaitExchange(false);
                dispatch(showBackdrop(false));
            } else if (resGoogleLogIn.error) {
                const errormessage = t(resGoogleLogIn.code || "error_unexpected_error", { module: t(langKeys.calendar_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitExchange(false);
                dispatch(showBackdrop(false));
            }

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resGoogleLogIn])

    return <Button
        onClick={() => {
            setWaitExchange(true);
            login()
        }}
        className={classes.button}
        variant="contained"
        color="primary"
    >
        {label ? label : t(langKeys.login_with_google)}
    </Button>
};

export default GoogleLogIn