/* eslint-disable react-hooks/exhaustive-deps */
import { FC, Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {RightSideMenu} from './RightSideMenu';
import Backdrop from '@material-ui/core/Backdrop';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { CircularProgress } from '@material-ui/core';

const useSignUpStyles = makeStyles(theme => ({
    purplecircle: {
        padding: "1vh",
        marginTop: "1vh",
        background: "#7721ad",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        fontSize: "2vh",
        fontWeight: "bold"
    },
    notthisstep: {
        padding: "1vh",
        marginTop: "1vh",
        background: "#e5e5e5",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        alignItems: "center",
        textAlign: "center",
        color: "#a59f9f",
        fontSize: "2vh",
        fontWeight: "bold"
    },
    separator:{
        borderBottom: "grey solid 1px",
        width: "10vh",
        height: "3.3vh",
    },
    cookieAlert: {
        "& svg": {
            color: 'white'
        }
    }
}));

export const SignUp: FC = () => {
    const classes = useSignUpStyles();
    const [step, setStep] = useState(1);
    const [snackbar, setSnackbar] = useState({
        state:false,
        success: true,
        message: ""
    });
    const [backdrop, setBackdrop] = useState(false);
    
    return (
        <Fragment>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                color="white"
                open={snackbar.state}
                key={'topright'}
            >
                <MuiAlert className={classes.cookieAlert} elevation={6} variant="filled" onClick={()=>setSnackbar((p:any)=>({...p,state:false}))} severity={snackbar.success ? "success" : "error"}>
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>

            <Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <div className="col-12 row-zyx" style={{display:"flex",height: "7vh", borderBottom: "grey solid 1px", boxShadow: "0px 3px 1px lightgrey"}}>
                <div className="col-6"></div>
                <div className="col-6" style={{display:"flex", transform: "translate(15%, 0%)"}}>
                    <div className={step===1?classes.purplecircle:classes.notthisstep}> 1 </div>
                    <div className={classes.separator}> </div>
                    <div className={step===2?classes.purplecircle:classes.notthisstep}> 2 </div>
                    <div className={classes.separator}> </div>
                    <div className={step===3?classes.purplecircle:classes.notthisstep}> 3 </div>
                    <div className={classes.separator}> </div>
                    <div className={step===4?classes.purplecircle:classes.notthisstep}> 4 </div>
                </div>
            </div>
            <div style={{display:"flex"}} className="row-zyx">
                <div className="col-6" style={{display:"flex", height: "90vh", alignItems: "center", justifyContent: "center"}}>
                    <img src="./Laraigo-vertical-logo-name.svg" alt="logo" />
                </div>
                <div className="col-6">
                    <RightSideMenu
                        setSnackbar={setSnackbar}
                        setBackdrop={setBackdrop}
                        setStep={setStep}
                        step={step}
                    />
                </div>
            </div>
        </Fragment>
    );
};


