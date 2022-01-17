/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

const useStyles = makeStyles(theme => ({
    titlecards:{
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
        alignItems: "center"
    },
    containerLogo: {
        flex: 1,
        backgroundColor: 'white',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
    },
    boxstyles: {
        textAlign: "justify",
        margin: "25px 10%",
        border: "grey 1px solid",
        padding: 25
    },
    separator: {
        borderBottom: "1px solid #D1CBCB",
        width: "15%",
        height: 0,
        marginLeft: 4,
        marginRight: 4
    },
    cookieAlert: {
        "& svg": {
            color: 'white'
        }
    },
    emptyspacenumber:{
        flex: 1,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
    }
}));

export const Privacy: FC = () => {
    const classes = useStyles();

    const { t } = useTranslation();

    return (
        <div style={{ width: "100%",marginTop:25}}>
            <div className={classes.containerHead}>
                <img src="./Laraigo-vertical-logo-name.svg" style={{ height: 200}} alt="logo" />
            </div>
            <div className={classes.titlecards}>{t(langKeys.privacypoliciestitle)}</div>
            <Box className={classes.boxstyles}>
                <p><b>{t(langKeys.privacypolicy1)}</b></p>
                <p>{t(langKeys.privacypolicy2)} <a href="https://laraigo.com/">https://laraigo.com/</a>. {t(langKeys.privacypolicy3)}</p>
                <p>{t(langKeys.privacypolicy4)}</p>
                <p><b>{t(langKeys.privacypolicy5)}</b></p>
                <ol style={{listStyleType: 'none'}}>
                    <li>
                        <p><b>{t(langKeys.privacypolicy6)}</b> {t(langKeys.privacypolicy7)}</p>
                        <p>{t(langKeys.privacypolicy8)}</p>
                    </li>
                    <li>
                        <p><b>{t(langKeys.privacypolicy9)}</b> {t(langKeys.privacypolicy10)}</p>
                        <p>{t(langKeys.privacypolicy11)}</p>
                    </li>
                    <li>
                        <p><b>{t(langKeys.privacypolicy12)}</b> {t(langKeys.privacypolicy13)}</p>
                        <ul style={{listStyleType: 'none'}}>
                            <li>
                                <p><b>{t(langKeys.privacypolicy14)}</b> {t(langKeys.privacypolicy15)}</p>
                                <p>{t(langKeys.privacypolicy16)}</p>
                            </li>
                            <li>
                                <p><b>{t(langKeys.privacypolicy17)}</b> {t(langKeys.privacypolicy18)}</p>
                                <ul>
                                    <li>{t(langKeys.privacypolicy19)}</li>
                                    <li>{t(langKeys.privacypolicy20)}</li>
                                    <li>{t(langKeys.privacypolicy21)}</li>
                                    <li>{t(langKeys.privacypolicy22)}</li>
                                </ul>
                                <p>{t(langKeys.privacypolicy23)}</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p><b>{t(langKeys.privacypolicy24)}</b> {t(langKeys.privacypolicy25)}</p>
                        <ul style={{listStyleType: 'none'}}>
                            <li>
                                <p><b>{t(langKeys.privacypolicy26)}</b> {t(langKeys.privacypolicy27)}</p>
                                <ul>
                                    <li>{t(langKeys.privacypolicy28)}</li>
                                    <li>{t(langKeys.privacypolicy29)}</li>
                                    <li>{t(langKeys.privacypolicy30)}</li>
                                </ul>
                                <p>{t(langKeys.privacypolicy31)}</p>
                            </li>
                        </ul>
                    </li>
                </ol>
                <p><b>{t(langKeys.privacypolicy32)}</b></p>
                <p>{t(langKeys.privacypolicy33)}</p>
                <p><b>{t(langKeys.privacypolicy34)}</b></p>
                <p>{t(langKeys.privacypolicy35)}</p>
                <p><b>{t(langKeys.privacypolicy36)}</b></p>
                <p>{t(langKeys.privacypolicy37)}</p>
                <p><b>{t(langKeys.privacypolicy38)}</b></p>
                <p>{t(langKeys.privacypolicy39)}</p>
                <p>{t(langKeys.privacypolicy40)}</p>
                <p>{t(langKeys.privacypolicy41)}</p>
                <p><b>{t(langKeys.privacypolicy42)}</b></p>
                <p>{t(langKeys.privacypolicy43)}</p>
            </Box>
        </div>
    );
};


export default Privacy;
