/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";

const useStyles = makeStyles((theme) => ({
    titlecards: {
        fontWeight: "bold",
        fontSize: "1.5em",
        color: "#883db7",
        width: "100%",
        textAlign: "center",
    },
    containerHead: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    containerLogo: {
        flex: 1,
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    boxstyles: {
        textAlign: "justify",
        margin: "25px 10%",
        border: "grey 1px solid",
        padding: 25,
    },
    separator: {
        borderBottom: "1px solid #D1CBCB",
        width: "15%",
        height: 0,
        marginLeft: 4,
        marginRight: 4,
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
}));

export const Privacy: FC = () => {
    const classes = useStyles();

    const { t } = useTranslation();

    return (
        <div style={{ width: "100%", marginTop: 25 }}>
            <div className={classes.containerHead}>
                <img src="./Laraigo-vertical-logo-name.svg" style={{ height: 200 }} alt="logo" />
            </div>
            <div className={classes.titlecards}>{t(langKeys.privacypoliciestitle)}</div>
            <Box className={classes.boxstyles}>
                <p>
                    <b>{t(langKeys.privacypolicy01)}</b>
                </p>
                <p>{t(langKeys.privacypolicy02)}</p>
                <p>{t(langKeys.privacypolicy03)}</p>
                <p>
                    <b>{t(langKeys.privacypolicy04)}</b>
                </p>
                <ol style={{ listStyleType: "none" }}>
                    <li>
                        <p>
                            <b>{t(langKeys.privacypolicy05)}</b> {t(langKeys.privacypolicy06)}
                        </p>
                        <p>{t(langKeys.privacypolicy07)}</p>
                    </li>
                    <li>
                        <p>
                            <b>{t(langKeys.privacypolicy08)}</b> {t(langKeys.privacypolicy09)}
                        </p>
                        <p>{t(langKeys.privacypolicy10)}</p>
                    </li>
                    <li>
                        <p>
                            <b>{t(langKeys.privacypolicy11)}</b> {t(langKeys.privacypolicy12)}
                        </p>
                        <ul style={{ listStyleType: "none" }}>
                            <li>
                                <p>
                                    <b>{t(langKeys.privacypolicy13)}</b> {t(langKeys.privacypolicy14)}
                                </p>
                                <p>{t(langKeys.privacypolicy15)}</p>
                            </li>
                            <li>
                                <p>
                                    <b>{t(langKeys.privacypolicy16)}</b> {t(langKeys.privacypolicy17)}
                                </p>
                                <ul>
                                    <li>{t(langKeys.privacypolicy18)}</li>
                                    <li>{t(langKeys.privacypolicy19)}</li>
                                    <li>{t(langKeys.privacypolicy20)}</li>
                                    <li>{t(langKeys.privacypolicy21)}</li>
                                </ul>
                                <p>{t(langKeys.privacypolicy22)}</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p>
                            <b>{t(langKeys.privacypolicy23)}</b> {t(langKeys.privacypolicy24)}
                        </p>
                        <ul style={{ listStyleType: "none" }}>
                            <li>
                                <p>
                                    <b>{t(langKeys.privacypolicy25)}</b> {t(langKeys.privacypolicy26)}
                                </p>
                                <ul>
                                    <li>{t(langKeys.privacypolicy27)}</li>
                                    <li>{t(langKeys.privacypolicy28)}</li>
                                    <li>{t(langKeys.privacypolicy29)}</li>
                                </ul>
                                <p>{t(langKeys.privacypolicy30)}</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p>
                            <b>{t(langKeys.privacypolicy31)}</b> {t(langKeys.privacypolicy32)}
                        </p>
                        <ul style={{ listStyleType: "none" }}>
                            <li>
                                <p>
                                    <b>{t(langKeys.privacypolicy33)}</b> {t(langKeys.privacypolicy34)}
                                </p>
                                <p>{t(langKeys.privacypolicy35)}</p>
                            </li>
                            <li>
                                <p>
                                    <b>{t(langKeys.privacypolicy36)}</b> {t(langKeys.privacypolicy37)}
                                </p>
                                <ul>
                                    <li>
                                        <b>{t(langKeys.privacypolicy38)}</b> {t(langKeys.privacypolicy39)}
                                    </li>
                                    <li>
                                        <b>{t(langKeys.privacypolicy40)}</b> {t(langKeys.privacypolicy41)}
                                    </li>
                                    <li>
                                        <b>{t(langKeys.privacypolicy42)}</b> {t(langKeys.privacypolicy43)}
                                    </li>
                                </ul>
                                <p>{t(langKeys.privacypolicy44)}</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p>
                            <b>{t(langKeys.privacypolicy45)}</b> {t(langKeys.privacypolicy46)}
                        </p>
                        <ul style={{ listStyleType: "none" }}>
                            <li>
                                <ul>
                                    <li>{t(langKeys.privacypolicy47)}</li>
                                    <li>{t(langKeys.privacypolicy48)}</li>
                                    <li>{t(langKeys.privacypolicy49)}</li>
                                </ul>
                                <p>{t(langKeys.privacypolicy50)}</p>
                            </li>
                            <li>
                                <p>{t(langKeys.privacypolicy51)}</p>
                                <ul>
                                    <li>{t(langKeys.privacypolicy52)}</li>
                                    <li>{t(langKeys.privacypolicy53)}</li>
                                </ul>
                                <p>{t(langKeys.privacypolicy54)}</p>
                            </li>
                        </ul>
                    </li>
                </ol>
                <p>
                    <b>{t(langKeys.privacypolicy55)}</b>
                </p>
                <p>{t(langKeys.privacypolicy56)}</p>
                <p>
                    <b>{t(langKeys.privacypolicy57)}</b>
                </p>
                <p>{t(langKeys.privacypolicy58)}</p>
                <ul>
                    <li>{t(langKeys.privacypolicy59)}</li>
                    <li>{t(langKeys.privacypolicy60)}</li>
                    <li>{t(langKeys.privacypolicy61)}</li>
                    <li>{t(langKeys.privacypolicy62)}</li>
                    <li>{t(langKeys.privacypolicy63)}</li>
                </ul>
                <p>{t(langKeys.privacypolicy64)}</p>
                <p>
                    <b>{t(langKeys.privacypolicy65)}</b>
                </p>
                <p>{t(langKeys.privacypolicy66)}</p>
                <p>
                    <b>{t(langKeys.privacypolicy67)}</b>
                </p>
                <p>{t(langKeys.privacypolicy68)}</p>
                <p>
                    <b>{t(langKeys.privacypolicy69)}</b>
                </p>
                <p>{t(langKeys.privacypolicy70)}</p>
                <ul>
                    <li>{t(langKeys.privacypolicy71)}</li>
                    <li>{t(langKeys.privacypolicy72)}</li>
                    <li>{t(langKeys.privacypolicy73)}</li>
                    <li>{t(langKeys.privacypolicy74)}</li>
                    <li>{t(langKeys.privacypolicy75)}</li>
                </ul>
                <p>{t(langKeys.privacypolicy76)}</p>
                <p>
                    <b>{t(langKeys.privacypolicy77)}</b>
                </p>
                <p>{t(langKeys.privacypolicy78)}</p>
                <p>
                    <b>{t(langKeys.privacypolicy79)}</b>
                </p>
                <p>{t(langKeys.privacypolicy80)}</p>
                <p>{t(langKeys.privacypolicy81)}</p>
                <p>
                    <b>{t(langKeys.privacypolicy82)}</b>
                </p>
                <p>{t(langKeys.privacypolicy83)}</p>
                <p>{t(langKeys.privacypolicy84)}</p>
            </Box>
        </div>
    );
};

export default Privacy;