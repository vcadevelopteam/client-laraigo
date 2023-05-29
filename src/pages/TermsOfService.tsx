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

export const TermsOfService: FC = () => {
    const classes = useStyles();

    const { t } = useTranslation();

    return (
        <div style={{ width: "100%", marginTop: 25 }}>
            <div className={classes.containerHead}>
                <img src="./Laraigo-vertical-logo-name.svg" style={{ height: 200 }} alt="logo" />
            </div>
            <div className={classes.titlecards}>{t(langKeys.termsofservicetitle)}</div>
            <Box className={classes.boxstyles}>
                <p>
                    <b>{t(langKeys.termsandconditions01)}</b>
                </p>
                <p>{t(langKeys.termsandconditions02)}</p>
                <p>
                    <b>{t(langKeys.termsandconditions03)}</b>
                </p>
                <ol style={{ listStyleType: "none" }}>
                    <li>
                        <p><b>{t(langKeys.termsandconditions04)}</b></p>
                        <p>{t(langKeys.termsandconditions05)}</p>
                    </li>
                    <li>
                        <p><b>{t(langKeys.termsandconditions06)}</b></p>
                        <p>{t(langKeys.termsandconditions07)}</p>
                    </li>
                    <li>
                        <p><b>{t(langKeys.termsandconditions08)}</b></p>
                        <p>{t(langKeys.termsandconditions09)}</p>
                        <ul>
                            <li>{t(langKeys.termsandconditions10)}</li>
                            <li>{t(langKeys.termsandconditions11)}</li>
                            <li>{t(langKeys.termsandconditions12)}</li>
                            <li>{t(langKeys.termsandconditions13)}</li>
                            <li>{t(langKeys.termsandconditions14)}</li>
                            <li>{t(langKeys.termsandconditions15)}</li>
                        </ul>
                    </li>
                </ol>
                <p>
                    <b>{t(langKeys.termsandconditions16)}</b>
                </p>
                <ol style={{ listStyleType: "none" }}>
                    <li>
                        <p>{t(langKeys.termsandconditions17)}</p>
                    </li>
                    <li>
                        <p><b>{t(langKeys.termsandconditions18)}</b></p>
                        <p>{t(langKeys.termsandconditions19)}</p>
                    </li>
                </ol>
                <p>
                    <b>{t(langKeys.termsandconditions20)}</b>
                </p>
                <p>{t(langKeys.termsandconditions21)}</p>
                <p>
                    <b>{t(langKeys.termsandconditions22)}</b>
                </p>
                <p>{t(langKeys.termsandconditions23)}</p>
                <p>
                    <b>{t(langKeys.termsandconditions24)}</b>
                </p>
                <p>{t(langKeys.termsandconditions25)}</p>
                <p>
                    <b>{t(langKeys.termsandconditions26)}</b>
                </p>
                <p>{t(langKeys.termsandconditions27)}</p>
                <p>
                    <b>{t(langKeys.termsandconditions28)}</b>
                </p>
                <p>{t(langKeys.termsandconditions29)}</p>
                <p>{t(langKeys.termsandconditions30)}</p>
            </Box>
        </div>
    );
};

export default TermsOfService;