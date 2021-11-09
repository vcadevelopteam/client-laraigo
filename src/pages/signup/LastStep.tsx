/* eslint-disable react-hooks/exhaustive-deps */
import { FC ,useEffect,useState} from "react";
import { makeStyles, Button, Breadcrumbs, Link} from '@material-ui/core';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";

import { useSelector } from 'hooks';
import { useDispatch } from "react-redux";

import { executeSubscription } from "store/signup/actions";
import { useHistory } from "react-router-dom";
import { getMultiCollectionPublic } from "store/main/actions";
import {  FieldSelect } from "components";

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

export const LastStep: FC<{mainData:any,requestchannels:any,setSnackbar:(param:any)=>void,setBackdrop:(param:any)=>void,setStep: (param: any) => void,setsendchannels:(param:any)=>void,setOpenWarning:(param:any)=>void }> = 
                                                                                            ({mainData,requestchannels,setSnackbar,setBackdrop,setStep,setsendchannels,setOpenWarning}) => {
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const planData = useSelector(state => state.signup.verifyPlan)
    const [waitSave, setWaitSave] = useState(false);
    const [industryList, setindustryList] = useState<any>([]);
    const [companySizeList, setcompanySizeList] = useState<any>([]);
    const [roleList, setroleList] = useState<any>([]);
    // const [disablebutton, setDisablebutton] = useState(false);
    const multiResult = useSelector(state => state.main.multiData.data);
    const executeResult = useSelector(state => state.signup.insertChannel);
    
    useEffect(() => {
        dispatch(getMultiCollectionPublic(["SignUpIndustry","SignUpCompanySize","SignUpRoles"]));
    }, []);
    useEffect(() => {
        if(multiResult.length){
            setindustryList(multiResult[0].data)
            setcompanySizeList(multiResult[1].data)
            setroleList(multiResult[2].data)
        }
    }, [multiResult]);

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
                phone: mainData.mobilephone,
                join_reason: mainData.join_reason,
                facebookid: mainData.facebookid,
                googleid: mainData.googleid,
                industry: lastfields.industry,
                companysize: lastfields.companysize,
                rolecompany: lastfields.companyrole,
                paymentplanid: planData.data[0].paymentplanid,
                countryname: mainData.countryname,
                country: mainData.country,
                currency: mainData.currency,
                paymentplan: planData.data[0].plan,
            },
            channellist: requestchannels
        }
        // setBackdrop(true)
        setWaitSave(true);
        // setDisablebutton(true);
        dispatch(executeSubscription(majorfield))
    }
    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                setBackdrop(false)
                
                history.push({
                    pathname: '/sign-in',
                    state: { 
                        showSnackbar: true,
                        message: t(langKeys.successful_sign_up)
                    }
                })
                // setSnackbar({ state: true, success: true, message: t(langKeys.successful_sign_up) })
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                setSnackbar({ state: true, success: false, message: errormessage })
                // setBackdrop(false)
                setWaitSave(false);
            }
        }
    }, [executeResult,waitSave])

    return (
        <div style={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                    {"<< Previous"}
                </Link>
            </Breadcrumbs>
            <div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.laststepsignup)}</div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.laststepsignup2)}</div>
            </div>
            
            <div style={{padding:"20px"}}>
                <FieldSelect    
                    uset={true} 
                    style={{marginBottom: "20px"}}
                    variant="outlined" 
                    label={t(langKeys.industry)}
                    className="col-12"
                    valueDefault={lastfields.industry}
                    onChange={(e) => {setLastFields((p:any) =>({...p,industry:e?.domainvalue||""}))}}
                    data={industryList}
                    prefixTranslation="industry_"
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                <FieldSelect     
                    uset={true} 
                    style={{marginBottom: "20px"}}
                    variant="outlined" 
                    label={t(langKeys.companysize)}
                    className="col-12"
                    valueDefault={lastfields.companysize}
                    onChange={(e) => {setLastFields((p:any) =>({...p,companysize:e?.domainvalue||""}))}}
                    data={companySizeList}
                    prefixTranslation="companysize_"
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                <FieldSelect     
                    uset={true} 
                    style={{marginBottom: "20px"}}
                    variant="outlined" 
                    label={t(langKeys.roleincompany)}
                    className="col-12"
                    valueDefault={lastfields.companyrole}
                    onChange={(e) => {setLastFields((p:any) =>({...p,companyrole:e?.domainvalue||""}))}}
                    data={roleList}
                    prefixTranslation="companyrole_"
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                <div >
                    <Button
                        onClick={()=>finishreg()}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={executeResult.loading}
                    >{t(langKeys.finishreg)}
                    </Button>
                </div>

            </div>
        </div>
    )
}
export default LastStep