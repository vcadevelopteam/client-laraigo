import React, { FC, useContext, useState, useEffect } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { LogoSuscription } from "icons";
import { makeStyles } from "@material-ui/core/styles";
import { RouteParams, SubscriptionContext, SubscriptionProvider, usePlanData } from './context';
import { Trans } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { loadScripts } from 'common/helpers';
import { useRouteMatch } from 'react-router-dom';

import Popus from "components/layout/Popus";
import RightSideMenu from "./RightSideMenu";
import ThirdStep from "./ThirdStep";

const useSignUpStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#F7F7F7",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
    },
    purplecircle: {
        alignItems: "center",
        background: "#7721ad",
        borderRadius: "50%",
        color: "white",
        display: "flex",
        fontSize: 20,
        fontWeight: 700,
        height: 35,
        justifyContent: "center",
        minWidth: 35,
        textAlign: "center",
        width: 35,
    },
    containerHead: {
        backgroundColor: "#FFF",
        border: "1px solid #D1CBCB",
        display: "flex",
        flex: "0 0 1",
        paddingBottom: 16,
        paddingTop: 16,
    },
    containerLogo: {
        alignItems: "center",
        backgroundColor: "white",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    notthisstep: {
        alignItems: "center",
        background: "#e5e5e5",
        borderRadius: "50%",
        color: "#a59f9f",
        display: "flex",
        fontSize: 20,
        fontWeight: 700,
        height: 35,
        justifyContent: "center",
        minWidth: 35,
        textAlign: "center",
        width: 35,
    },
    separator: {
        borderBottom: "1px solid #D1CBCB",
        height: 0,
        marginLeft: 4,
        marginRight: 4,
        width: "15%",
    },
    cookieAlert: {
        "& svg": {
            color: "white",
        },
    },
    emptyspacenumber: {
        flex: 1,
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    containerLeft: {
        flex: 1,
        overflowY: "auto",
        padding: 24,
        [theme.breakpoints.down("xs")]: {
            height: "100vh",
            minWidth: "100vw",
        },
    },
}));

export const SignUp: FC = () => {
    return (
        <SubscriptionProvider>
            <SignUpFunc />
            <Popus />
        </SubscriptionProvider>
    );
};

const SignUpFunc: FC = () => {
    const classes = useSignUpStyles();
    const { step, setStep } = useContext(SubscriptionContext);
    const { getValues, reset } = useFormContext();
    const { loading: planDataLoading } = usePlanData();

    const [openWarning, setOpenWarning] = useState(false);
    const match = useRouteMatch<RouteParams>();


    function setDefaultMainData() {
        reset({
            ...getValues(),
            autosendinvoice: true,
            billingcontact: "",
            billingcontactmail: "",
            businessname: "",
            companybusinessname: "",
            confirmpassword: "",
            country: "",
            creditcard: "",
            docnumber: "",
            doctype: 0,
            email: "",
            facebookid: "",
            firstandlastname: "",
            firstnamecard: "",
            fiscaladdress: "",
            googleid: "",
            join_reason: "",
            lastnamecard: "",
            mm: 0,
            mobilephone: "",
            password: "",
            pmemail: "",
            pmphone: "",
            securitycode: "",
            yyyy: "",
        });
    }

    function setDefaultMainDataAlternate() {
        reset({
            ...getValues(),
            billingcontact: "",
            billingcontactmail: "",
            businessname: "",
            docnumber: "",
            doctype: 0,
            fiscaladdress: "",
        });
    }

    const handleClose = () => {
        setOpenWarning(false);
    };

    const handleStepClose = () => {
        if (step === 4) {
            setStep(step - 1);
        } else if (step === 3) {
            setStep(2.5);
        } else if (step === 2.5) {
            setDefaultMainDataAlternate();
            setStep(2);
        } else if (step === 2.6) {
            setStep(2.5);
        } else if (step === 2) {
            setDefaultMainData();
            setStep(step - 1);
        } else {
            setStep(step - 1);
        }
        setOpenWarning(false);
    };

    useEffect(() => {
        if (["BUSINESS START", "BUSINESS BASIC", "BUSINESS PRO", "BUSINESS PRO+"].includes(match.params.token)) {
            const scriptsToLoad = ["gtm"];
            const { scriptRecaptcha, scriptPlatform, clarityScript } = loadScripts(scriptsToLoad);
    
            return () => {
                scriptRecaptcha && document.body.removeChild(scriptRecaptcha);
                scriptPlatform && document.body.removeChild(scriptPlatform);
                if (clarityScript?.parentNode) {
                    clarityScript.parentNode.removeChild(clarityScript);
                }
            };
        }
    }, [])

    return (
        <div className={classes.root}>
            <Dialog
                aria-describedby="alert-dialog-description"
                aria-labelledby="alert-dialog-title"
                onClose={handleClose}
                open={openWarning}
            >
                <DialogTitle id="alert-dialog-title">
                    <Trans i18nKey={langKeys.goback} />
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        <Trans i18nKey={langKeys.no} />
                    </Button>
                    <Button onClick={handleStepClose} color="primary" autoFocus>
                        <Trans i18nKey={langKeys.yes} />
                    </Button>
                </DialogActions>
            </Dialog>
            <div className={classes.containerHead}>
                <div className={classes.emptyspacenumber}></div>
                <div
                    style={{
                        alignItems: "center",
                        display: "flex",
                        flex: 1,
                        justifyContent: "center",
                        marginLeft: 10,
                        marginRight: 10,
                    }}
                >
                    <div className={step === 1 ? classes.purplecircle : classes.notthisstep}> 1 </div>
                    <div className={classes.separator}> </div>
                    <div className={step === 2 ? classes.purplecircle : classes.notthisstep}> 2 </div>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    height: "100%",
                    overflow: "overlay",
                }}
            >
                {step === 1 && <div className={classes.containerLeft}>{!planDataLoading && <ThirdStep />}</div>}
                {step !== 1 && (
                    <div className={classes.containerLogo}>
                        <LogoSuscription style={{ width: "50%" }} />
                    </div>
                )}
                <div className={classes.containerLeft} style={{ backgroundColor: "white" }}>
                    {!planDataLoading ? <RightSideMenu setOpenWarning={setOpenWarning} /> : <CircularProgress />}
                </div>
            </div>
        </div>
    );
};

export default SignUp;