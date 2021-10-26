/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, CircularProgress } from '@material-ui/core';
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
    const { token }: any = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const activationRes = useSelector(state => state.activationuser.activation);
    const [valid, setValid] = useState<boolean | null>(null);

    useEffect(() => {
        dispatch(sendActivation(token));
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const x = Math.random();
            if (x > 0.5)
                setValid(true);
            else
                setValid(false);
            // if (!activationRes.loading && !activationRes.error) {
            //     setValid(true);
            // } else if (activationRes.error) {
            //     setValid(false);
            // }
        }, 10000)
    }, [activationRes])

    const classes = useStyles();
    const { t } = useTranslation();

    switch (valid) {
        case null:
            return (
                <div style={{ width: "100%",marginTop:25}}>
                    <div className={classes.titlecards}>We are validating your account...</div>
                    <div className={clsx("la-ball-beat la-2x", classes.spinnerContainer)}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            );
        case true:
            return (
                <div style={{ width: "100%",marginTop:25}}>
                    <div className={classes.titlecards}>Your account has been createad!</div>
                    <Box className={classes.boxstyles}>
                        <p>Thanks for registering to our platform!</p>
                        <p>To continue to login click continue</p>
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
                    <div className={classes.titlecards}>Your account has been already created!</div>
                    <Box className={classes.boxstyles}>
                        <p>To continue to login click continue</p>
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