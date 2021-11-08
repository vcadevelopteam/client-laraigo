/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { sendActivation } from 'store/activationuser/actions';
import { useSelector } from 'hooks';
import paths from 'common/constants/paths';
import clsx from 'clsx';

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
        alignItems: "center",
        marginBottom: "30px"
    },
    boxstyles: {
        textAlign: "justify",
        margin: "25px 10%",
        border: "grey 1px solid",
        padding: 25
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    spinnerContainer: {
        margin: '20px auto',
        color: '#883db7'
    },
    link: {
        color: '#883db7',
        cursor: 'pointer'
    }
}));

export const ActivateUser: FC = () => {
    // const location = useLocation();
    // const query = new URLSearchParams(location.search)
    // const tk = query.get('t');
    const classes = useStyles();
    const { t } = useTranslation();
    const { token }: any = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const activationRes = useSelector(state => state.activationuser.activation);
    const [loading, setLoading] = useState<boolean>(true);
    const [valid, setValid] = useState<boolean | null>(null);

    useEffect(() => {
        if (token) {
            dispatch(sendActivation(token));
        }
    }, []);

    useEffect(() => {
        if (!activationRes.error && activationRes.data) {
            setLoading(false);
            if (activationRes.data?.success) {
                setValid(true);
            }
            else {
                setValid(false);
            }
        }
        else if (activationRes.error) {
            setTimeout(() => {
                setLoading(false);
            }, 3000);
        }
    }, [activationRes])

    switch (valid) {
        case null:
            if (loading) {
                return (
                    <div style={{ width: "100%",marginTop:25}}>
                        <div className={classes.containerHead}>
                            <img src="/Laraigo-vertical-logo-name.svg" style={{ height: 200}} alt="logo" />
                        </div>
                        <div className={classes.titlecards}>{t(langKeys.message_please_wait)}</div>
                        <div className={clsx("la-ball-beat la-2x", classes.spinnerContainer)}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div style={{ width: "100%",marginTop:25}}>
                        <div className={classes.containerHead}>
                            <img src="/Laraigo-vertical-logo-name.svg" style={{ height: 200}} alt="logo" />
                        </div>
                        <div className={classes.titlecards}>{t(langKeys.message_try_later)}</div>
                    </div>
                );
            }
        case true:
            return (
                <div style={{ width: "100%",marginTop:25}}>
                    <div className={classes.containerHead}>
                        <img src="/Laraigo-vertical-logo-name.svg" style={{ height: 200}} alt="logo" />
                    </div>
                    <div className={classes.titlecards}>{t(langKeys.message_account_activated)}</div>
                    <Box className={classes.boxstyles}>
                        <p>{t(langKeys.message_click_to_login)}</p>
                        <div className={classes.buttonContainer}>
                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                style={{ backgroundColor: "#7721AD" }}
                                onClick={() => history.push(paths.SIGNIN)}
                            >{t(langKeys.continue)}</Button>
                        </div>
                    </Box>
                </div>
            );
        case false:
            return (
                <div style={{ width: "100%",marginTop:25}}>
                    <div className={classes.containerHead}>
                        <img src="/Laraigo-vertical-logo-name.svg" style={{ height: 200}} alt="logo" />
                    </div>
                    <div className={classes.titlecards}>{t(langKeys.message_account_already_activated)}</div>
                    <Box className={classes.boxstyles}>
                        <p>{t(langKeys.message_click_to_login)}</p>
                        <div className={classes.buttonContainer}>
                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                style={{ backgroundColor: "#7721AD" }}
                                onClick={() => history.push(paths.SIGNIN)}
                            >{t(langKeys.continue)}</Button>
                        </div>
                    </Box>
                </div>
            );
    }
};

export default ActivateUser;