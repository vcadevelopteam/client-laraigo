import React, { FC, useContext, useEffect } from 'react';
import { langKeys } from "lang/keys";
import { makeStyles } from "@material-ui/core/styles";
import { RouteParams, SubscriptionContext, SubscriptionProvider, usePlanData } from './context';
import { useTranslation } from "react-i18next";
import { loadScripts } from 'common/helpers';
import { useRouteMatch } from 'react-router-dom';
import { LaraigoLogoWhite } from "icons";

import Popus from "components/layout/Popus";
import RightSideMenu from "./RightSideMenu";

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
        background: "linear-gradient(90deg, #0C0931 0%, #1D1856 50%, #C200DB 100%)",
        height: "100%",
        display: "flex",
        width: "40%",
        margin: 0,
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    container: {
        display: "flex",
        justifyContent: "center",
        margin: 0
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
        [theme.breakpoints.down("xs")]: {
            height: "100vh",
            minWidth: "100vw",
        },
    },
    image: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "1.8rem",
        width: "100%",
        marginBottom: "1.8rem",
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
    const { step } = useContext(SubscriptionContext);
    const { t } = useTranslation();
    const planData = usePlanData();

    const match = useRouteMatch<RouteParams>();

    useEffect(() => {
        if (["BASICO", "PROFESIONAL"].includes(match.params.token)) {
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
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    height: "100%",
                    overflow: "overlay",
                }}
            >
                {step !== 1 && (
                    <div className={classes.containerLogo}>
                        <div className={classes.container} style={{ width: "100%", margin: "0 10px 0 0" }}>
                            <div>
                                <div className={classes.image}>
                                    <LaraigoLogoWhite height={60} />
                                </div>
                                <div style={{ color: "#FFBF00", fontWeight: "bold", fontSize: "2em", textAlign: "center" }}>
                                    {t(langKeys.signupstep2ms1)}
                                </div>
                                <div style={{ color: "white", fontSize: "1.5em", textAlign: "center", margin: "20px 10%" }}>
                                    {t(langKeys.signupstep2ms2, { plan: planData?.plan?.plan })}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <video width="80%" controls>
                                        <source src="http://publico-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/4a78ff62-dc91-49b3-b8d6-84dda5a0420a/Laraigo%20%EF%BD%9C%20CRM%20Omnicanal%20100%25%20Cloud.mp4" type="video/mp4" />
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={classes.containerLeft}>
                    <RightSideMenu />
                </div>
            </div>
        </div>
    );
};

export default SignUp;