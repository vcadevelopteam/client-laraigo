import { FC } from "react";
import { Button, makeStyles } from '@material-ui/core';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { exchangeCode } from "store/google/actions";
import { showBackdrop } from 'store/popus/actions';
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

interface GoogleLogInFrameProps {
    setWaitExchange: (value: boolean) => void;
}

export const GoogleLogInFrame: FC<GoogleLogInFrameProps> = ({ setWaitExchange }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles();
    
    const login = useGoogleLogin({
        onSuccess: tokenResponse => onGoogleLoginSucess(tokenResponse),
        onError: error => onGoogleLoginFailure(error),
        flow: 'auth-code',
        scope: 'https://www.googleapis.com/auth/gmail.compose \
        https://www.googleapis.com/auth/youtube.readonly \
        https://www.googleapis.com/auth/youtube.force-ssl \
        https://www.googleapis.com/auth/drive.file \
        https://www.googleapis.com/auth/gmail.readonly \
        https://www.googleapis.com/auth/blogger \
        https://www.googleapis.com/auth/blogger.readonly \
        https://www.googleapis.com/auth/drive.readonly',
    });

    const onGoogleLoginSucess = (event: any) => {
        if (event) {
            if (event.code) {
                dispatch(exchangeCode({ googlecode: event.code }));
                dispatch(showBackdrop(true));
                setWaitExchange(true);
            }
        }
    }

    const onGoogleLoginFailure = (event: any) => {
        console.log('GOOGLE LOGIN FAILURE: ' + JSON.stringify(event));
    }

    return <Button
        onClick={() => { login() }}
        className={classes.button}
        variant="contained"
        color="primary"
    >
        {t(langKeys.login_with_google)}
    </Button>
};

export default GoogleLogInFrame