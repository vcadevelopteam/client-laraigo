/* eslint-disable react-hooks/exhaustive-deps */
import { FC ,useContext,useEffect,useState} from "react";
import { makeStyles, Button, Breadcrumbs, Link} from '@material-ui/core';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";

import { useSelector } from 'hooks';
import { useDispatch } from "react-redux";

import { getMultiCollectionPublic } from "store/main/actions";
import {  FieldSelect } from "components";
import { SubscriptionContext } from "./context";

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

interface LastStepProps {
    setOpenWarning:(param:any)=>void;
}

const Step2_6: FC<LastStepProps> = ({ setOpenWarning }) => {
    const { setStep } = useContext(SubscriptionContext);
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const dispatch = useDispatch();
    const [industryList, setindustryList] = useState<any>([]);
    const [companySizeList, setcompanySizeList] = useState<any>([]);
    const [roleList, setroleList] = useState<any>([]);
    const multiResult = useSelector(state => state.main.multiData.data);
    const executeResult = useSelector(state => state.signup.insertChannel);
    const [isSpecial, setIsSpecial] = useState(false);
    
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

    return (
        <div style={{marginTop: "auto",marginBottom: "auto",maxHeight: "100%"}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="textSecondary"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        setOpenWarning(true);
                    }}
                >
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            <div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.laststepsignup)}</div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.laststepsignup2)}</div>
            </div>
            
            <div style={{padding:"20px"}}>
                {/* <FieldSelect    
                    uset={true} 
                    style={{marginBottom: "20px"}}
                    variant="outlined" 
                    label={t(langKeys.industry)}
                    className="col-12"
                    valueDefault={mainData.industry}
                    onChange={(e) => setMainData(prev => ({
                        ...prev,
                        industry: e?.domainvalue || "",
                    }))}
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
                    valueDefault={mainData.companysize}
                    onChange={(e) => setMainData(prev => ({
                        ...prev,
                        companysize: e?.domainvalue || "",
                    }))}
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
                    valueDefault={mainData.rolecompany}
                    onChange={(e) => setMainData(prev => ({
                        ...prev,
                        rolecompany: e?.domainvalue || "",
                    }))}
                    data={roleList}
                    prefixTranslation="companyrole_"
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                /> */}
                <div>
                    <Button
                        onClick={() => setStep(3)}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={executeResult.loading}
                    >{t(langKeys.next)}
                    </Button>
                </div>

            </div>
        </div>
    )
}
export default Step2_6