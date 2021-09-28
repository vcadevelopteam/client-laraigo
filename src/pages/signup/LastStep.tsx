/* eslint-disable react-hooks/exhaustive-deps */
import { FC ,useState} from "react";
import { makeStyles, Button, TextField} from '@material-ui/core';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";

import { useSelector } from 'hooks';
import { useDispatch } from "react-redux";

import { executeSubscription } from "store/signup/actions";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: "bold",
        fontSize: '40px',
        //textTransform: 'initial',
        width: "100%"
    },
    buttonGoogle: {
        '& button': {
            fontSize: '24px!important',
            justifyContent: 'center',
            fontFamily: "Helvetica,sans-serif!important",
            width: "50%", 
            marginLeft: "25%", 
            marginBottom: '20px'
        }
    },
    separator:{
        borderBottom: "grey solid 1px",
        width: "10vh",
        height: "1.6vh",
        margin: "0 40px"
    },
}));

export const LastStep: FC<{setMainData:(param:any)=>void,mainData:any,setStep:(param:any)=>void,requestchannels:any}> = ({setMainData,mainData,setStep,requestchannels}) => {
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector(state => state.signup.successinsert)
    
    const [lastfields, setLastFields] = useState({
        industry: "",
        companysize: "",
        companyrole: "",
    })
    async function finishreg(){
        let majorfield = {
            method: "UFN_CREATEZYXMEACCOUNT_INS",
            parameters: {
                firstname: mainData.firstandlastname,
                lastname: "",
                username: mainData.email,
                password: mainData.password,
                email: mainData.email,
                doctype: "",
                docnumber: "",
                organizationname: mainData.companybusinessname,
                mobilephone: mainData.mobilephone,
                sales: mainData.sales,
                customerservice: mainData.customerservice,
                marketing: mainData.marketing,
                industry: lastfields.industry,
                companysize: lastfields.companysize,
                companyrole: lastfields.companyrole,
            },
            channellist: requestchannels
        }
        dispatch(executeSubscription(majorfield))
        setWaitSave(true);
    }

    return (
        <div style={{ width: '100%' }}>
            <div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.laststepsignup)}</div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.laststepsignup2)}</div>
            </div>
            
            <div style={{padding:"20px"}}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={t(langKeys.industry)}
                    name="industry"
                    onChange={(e) => {setLastFields((p:any) =>({...p,industry:e.target.value}))}}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={t(langKeys.companysize)}
                    name="companysize"
                    onChange={(e) => {setLastFields((p:any) =>({...p,companysize:e.target.value}))}}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={t(langKeys.roleincompany)}
                    name="roleincompany"
                    onChange={(e) => {setLastFields((p:any) =>({...p,roleincompany:e.target.value}))}}
                />
                <div >
                    <Button
                        onClick={()=>finishreg()}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                    >{t(langKeys.finishreg)}
                    </Button>
                </div>

            </div>
        </div>
    )
}
export default LastStep