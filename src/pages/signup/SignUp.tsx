/* eslint-disable react-hooks/exhaustive-deps */
import { FC, Fragment, useState } from 'react';
import { Dictionary } from '@types';
import { makeStyles } from '@material-ui/styles';
import {FirstStep} from './FirstStep';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
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
    }
}));

export const SignUp: FC = () => {
    const classes = useSignUpStyles();
    const [step, setStep] = useState(1);
    
    return (
        <Fragment>
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
                    <FirstStep
                        setStep={setStep}
                    />
                </div>
            </div>
        </Fragment>
    );
};


