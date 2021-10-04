/* eslint-disable react-hooks/exhaustive-deps */
import { FC, Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { RightSideMenu } from './RightSideMenu';
import Backdrop from '@material-ui/core/Backdrop';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { CircularProgress } from '@material-ui/core';

const useSignUpStyles = makeStyles(theme => ({
    purplecircle: {
        background: "#7721ad",
        borderRadius: "50%",
        width: 43,
        height: 43,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        fontSize: 24,
        fontWeight: 700
    },
    containerHead: {
        display: "flex",
        border: '1px solid #D1CBCB',
        flex: '0 0 1',
        paddingTop: 16,
        paddingBottom: 16,
        marginBottom: 4,
        backgroundColor: '#FFF',
        
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
    notthisstep: {
        background: "#e5e5e5",
        borderRadius: "50%",
        width: 43,
        display: "flex",
        justifyContent: "center",
        height: 43,
        alignItems: "center",
        textAlign: "center",
        color: "#a59f9f",
        fontSize: 24,
        fontWeight: 700
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

export const SignUp: FC = () => {
    const classes = useSignUpStyles();
    const [step, setStep] = useState(1);
    const [snackbar, setSnackbar] = useState({
        state: false,
        success: true,
        message: ""
    });
    const [backdrop, setBackdrop] = useState(false);

    return (
        <div style={{ backgroundColor: '#F7F7F7', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                color="white"
                open={snackbar.state}
                key={'topright'}
            >
                <MuiAlert className={classes.cookieAlert} elevation={6} variant="filled" onClick={() => setSnackbar((p: any) => ({ ...p, state: false }))} severity={snackbar.success ? "success" : "error"}>
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>

            <Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <div className={classes.containerHead}>
                <div className={classes.emptyspacenumber}></div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className={step === 1 ? classes.purplecircle : classes.notthisstep}> 1 </div>
                    <div className={classes.separator}> </div>
                    <div className={step === 2 ? classes.purplecircle : classes.notthisstep}> 2 </div>
                    <div className={classes.separator}> </div>
                    <div className={step === 3 ? classes.purplecircle : classes.notthisstep}> 3 </div>
                    <div className={classes.separator}> </div>
                    <div className={step === 4 ? classes.purplecircle : classes.notthisstep}> 4 </div>
                </div>
            </div>
            <div style={{ display: "flex", height: '100%' }}>
                <div className={classes.containerLogo}> 
                    {/* //containerlogo tiene flex 1, para q se divida con el texto */}
                    <img src="./Laraigo-vertical-logo-name.svg" style={{ width: '50%' }} alt="logo" />
                </div>
                <div style={{
                    display: 'flex',
                    flex: 1,
                    margin: 40,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <RightSideMenu //tiene flex 1, para q se ajuste con la imagen
                        setSnackbar={setSnackbar}
                        setBackdrop={setBackdrop}
                        setStep={setStep}
                        step={step}
                    />
                </div>
            </div>
        </div>
    );
};


