/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Button, TextField, Breadcrumbs} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { Dictionary } from "@types"
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { resetMain, getCollectionPublic } from 'store/main/actions';
import MuiPhoneNumber from 'material-ui-phone-number';
import { styled } from '@material-ui/core/styles';
import { FieldMultiSelect, FieldSelect } from "components";
import { getValuesFromDomain } from "common/helpers/requestBodies";
import { getCountryList } from "store/signup/actions";
import { SubscriptionContext } from "./context";


const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: "bold",
        fontSize: '40px',
        //textTransform: 'initial',
        width: "100%"
    },
}));

const CssPhonemui = styled(MuiPhoneNumber)({
    '& label.Mui-focused': {
        color: '#7721ad',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#7721ad',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#7721ad',
        },
    },
});


const SecondStep: FC<{ setOpenWarning: (param: any) => void}> = ({ setOpenWarning }) => {
    const { setStep } = useContext(SubscriptionContext);
    const dispatch = useDispatch();
    const ressignup = useSelector(state => state.signup.countryList);    
    const URL="https://ipapi.co/json/";
    const [countryname, setcountryname] = useState("PERU");
    const [countrycode, setcountrycode] = useState("PE");
    const [currency, setcurrency] = useState("PEN");
    const [errors, setErrors] = useState<Dictionary>({
        firstandlastname: "",
        companybusinessname: "",
        country: ""
    });
    const [disablebutton, setdisablebutton] = useState(true);
    const mainResult = useSelector(state => state.main);
    // useEffect(() => {
    //     setdisablebutton(!(mainData.firstandlastname !== "" && mainData.companybusinessname !== "" && mainData.country!== ""))
    // }, [mainData])
    // function maindataChange(field: string, value: any) {
    //     setMainData((p: any) => ({ ...p, [field]: value }))
    //     setErrors(p => ({ ...p, [field]: !value ? t(langKeys.field_required) : "" }))
    // }
    const fetchData = () => dispatch(getCollectionPublic(getValuesFromDomain("REASONSSIGNUP")));
    useEffect(() => {
        dispatch(getCountryList())
        try{
            fetch(URL,{method: "get"})
                .then((response)=>response.json())
                .then((data)=>{
                    setcountryname(data.country_name.toUpperCase());
                    setcountrycode(data.country_code);
                    setcurrency(data.currency);
                })
        }
        catch (error) {
            console.error("error");
        }
        fetchData();
        return () => {
            dispatch(resetMain());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     setMainData((p:any) => ({ ...p, country: countrycode, countryname: countryname, currency: currency, doctype: countrycode==="PE"?1:0 }))
    // }, [countrycode, countryname, currency]);
    
    // useEffect(() => {
    //     if (ressignup.data?.length > 0) {
    //         if (countrycode) {
    //             setMainData((p:any) => ({ ...p, country: countrycode }))
    //         }
    //         if (countryname) {
    //             setMainData((p:any) => ({ ...p, countryname: countryname }))
    //         }
    //         if (currency) {
    //             setMainData((p:any) => ({ ...p, currency: currency }))
    //         }
    //     }
    // }, [ressignup])
    
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    return (
        <div style={{marginTop: "auto",marginBottom: "auto",maxHeight: "100%"}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad" , marginTop: 15}}>{t(langKeys.signupstep1title2)}</div>
            <div >
                {/* <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    size="small"
                    defaultValue={mainData.firstandlastname}
                    label={t(langKeys.firstandlastname)}
                    name="firstandlastname"
                    error={!!errors.firstandlastname}
                    helperText={errors.firstandlastname}
                    onChange={(e) => maindataChange('firstandlastname', e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    size="small"
                    label={t(langKeys.companybusinessname)}
                    name="companybusinessname"
                    defaultValue={mainData.companybusinessname}
                    error={!!errors.companybusinessname}
                    helperText={errors.companybusinessname}
                    onChange={(e) => maindataChange('companybusinessname', e.target.value)}
                />                
                <FieldSelect
                    onChange={(value) => {
                        setErrors(p => ({ ...p, country: !(value?.code) ? t(langKeys.field_required) : "" }));
                        setMainData((p:any) => ({ ...p, doctype: value?.code==="PE"?1:0, country: value?.code || "", currency: value?.currencycode || "", countryname: value?.description }));
                        setcountrycode(value?.code || "");
                    }}
                    variant="outlined"
                    className="col-6"
                    style={{margin:"15px 0"}}
                    label={t(langKeys.country)}
                    valueDefault={mainData.country}
                    error={errors.country}
                    data={ressignup.data}
                    optionDesc="description"
                    optionValue="code"
                />
                <CssPhonemui
                    variant="outlined"
                    margin="normal"
                    size="small"
                    disableAreaCodes={true}
                    value={mainData.mobilephone}
                    label={t(langKeys.mobilephoneoptional)}
                    name="mobilephone"
                    fullWidth
                    defaultCountry={countrycode.toLowerCase()}
                    onChange={(e:any) => setMainData(prev => ({
                        ...prev,
                        mobilephone: e,
                    }))}
                />
                <div style={{ paddingTop: 20, fontWeight: "bold", color: "#381052" }}>
                    <Trans i18nKey={langKeys.laraigouse} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>
                        {` (${t(langKeys.optional).toLowerCase()})`}
                    </span>
                </div>
                
                <FieldMultiSelect
                    uset={true}
                    onChange={(value) => setMainData(prev => ({
                        ...prev,
                        join_reason: value
                            .map((o: any) => o.domainvalue)
                            .join(),
                    }))}
                    variant="outlined"
                    className="col-6"
                    style={{margin:"15px 0"}}
                    valueDefault={mainData.join_reason}
                    prefixTranslation="reason_"
                    data={mainResult.mainData.data}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                /> */}
                <Button
                    onClick={() => { setStep(2.5) }}
                    className={classes.button}
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={disablebutton}
                >{t(langKeys.next)}
                </Button>
            </div>

        </div>
    )
}

export default SecondStep