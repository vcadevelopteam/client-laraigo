import { Button, makeStyles } from "@material-ui/core";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { exchangeCode } from "store/google/actions";
import { langKeys } from "lang/keys";
import { showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import React, { FC } from "react";

const useStyles = makeStyles(() => ({
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "180px",
    },
}));

interface GoogleLogInFrameProps {
    setWaitExchange: (value: boolean) => void;
}

export const GoogleLogInFrame: FC<GoogleLogInFrameProps> = ({ setWaitExchange }) => {
    const { t } = useTranslation();

    const classes = useStyles();
    const dispatch = useDispatch();

    const login = useGoogleLogin({
        flow: "auth-code",
        onError: (error) => onGoogleLoginFailure(error),
        onSuccess: (tokenResponse) => onGoogleLoginSucess(tokenResponse),
        scope: "https://www.googleapis.com/auth/blogger \
            https://www.googleapis.com/auth/business.manage \
            https://www.googleapis.com/auth/gmail.readonly \
            https://www.googleapis.com/auth/gmail.send \
            https://www.googleapis.com/auth/youtube.force-ssl \
            https://www.googleapis.com/auth/youtube.readonly",
    });

    const onGoogleLoginSucess = (event: Omit<CodeResponse, "error" | "error_description" | "error_uri">) => {
        if (event) {
            if (event.code) {
                dispatch(exchangeCode({ googlecode: event.code }));
                dispatch(showBackdrop(true));
                setWaitExchange(true);
            }
        }
    };

    const onGoogleLoginFailure = (event: Pick<CodeResponse, "error" | "error_description" | "error_uri">) => {
        console.log("GOOGLE LOGIN FAILURE: " + JSON.stringify(event));
    };

    return (
        <Button
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={() => {
                login();
            }}
        >
            {t(langKeys.login_with_google)}
        </Button>
    );
};

export default GoogleLogInFrame;