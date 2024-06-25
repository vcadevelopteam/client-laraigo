/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { apiUrls } from 'common/constants';

const w = 1154;
const h = 610;

const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width;
const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height;

const systemZoom = width / window.screen.availWidth;
const left = (width - w) / 2 / systemZoom + dualScreenLeft;
const top = (height - h) / 2 / systemZoom + dualScreenTop;

const popupUrl = apiUrls.SAML_LOGIN;

interface ISamLoginProps {
    buttonText?: string;
    onSuccess: (data: any) => void;
    onFailure: (error: any) => void;
}

const SamlLogin: React.FC<ISamLoginProps> = ({ buttonText, onSuccess, onFailure }) => {
    const { t } = useTranslation();

    const handleLogin = () => {
        openSAMLLoginPopup();
    };

    const openSAMLLoginPopup = () => {
        const popup = window.open(
            popupUrl,
            'saml_login_popup',
            `width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left},
            resizable=yes`
        );

        if (popup) {
            popup.focus(); // Focus the popup window
        }
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!popupUrl.includes(event.origin)) {
                return;
            }
            const { success, code, error } = event.data;
            if (success) {
                onSuccess({ code });
            } else {
                onFailure({ error });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <>
            <Button
                fullWidth
                variant="outlined"
                style={{ height: '2.5rem', }}
                color="primary"
                onClick={handleLogin}
            >
                {buttonText || t(langKeys.logIn)}
            </Button>
        </>

    )
};

export default SamlLogin;
