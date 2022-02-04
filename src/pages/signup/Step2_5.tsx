/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Button, TextField, Breadcrumbs} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { Dictionary } from "@types"
import { useSelector } from "hooks";
import MuiPhoneNumber from 'material-ui-phone-number';
import { styled } from '@material-ui/core/styles';
import { FieldSelect, FieldView} from "components";
import { SubscriptionContext } from "./context";


const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: "bold",
        fontSize: '40px',
        //textTransform: 'initial',
        width: "100%"
    },
    fieldview:{
        paddingTop: 10,
    }
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


export const Step2_5: FC<{ setOpenWarning: (param: any) => void}> = ({ setOpenWarning }) => {
    const { mainData, setMainData, setStep } = useContext(SubscriptionContext);
    const { t } = useTranslation();
    const URL="https://ipapi.co/json/";
    const [errors, setErrors] = useState<Dictionary>({
        doctype: "",
        docnumber: "",
        businessname: "",
        fiscaladdress: "",
        billingcontact: "",
        billingcontactmail: ""
    });
    const databilling=[
        {id:1, desc:t(langKeys.billingfield_billingdni)},
        {id:2, desc:t(langKeys.billingfield_billingextra)},
        {id:3, desc:t(langKeys.billingfield_billingruc)},
    ]
    const [disablebutton, setdisablebutton] = useState(true);
    const mainResult = useSelector(state => state.main);
    useEffect(() => {
        if (mainData.billingcontactmail.includes('@') && mainData.billingcontactmail.includes('.')) {
            setdisablebutton(
                isNaN(mainData.doctype) ||
                docTypeValidate(mainData.docnumber, mainData.doctype).length > 0 ||
                isNaN(parseInt(mainData.docnumber)) ||
                mainData.businessname === "" ||
                mainData.fiscaladdress === "" ||
                mainData.billingcontact === "" ||
                mainData.billingcontactmail === ""
            );
        } else {
            setdisablebutton(true);
        }
    }, [mainData])

    const docTypeValidate = (docnum: string, docType: number): string => {
        if (!docnum) {
            return t(langKeys.field_required);
        }

        let msg = "";
        switch (docType) {
            case 1: // DNI
                msg = t(langKeys.doctype_dni_error);
                return docnum.length !== 8 ? msg : "";
            case 2: // CARNET DE EXTRANJERIA
                msg = t(langKeys.doctype_foreigners_card);
                return docnum.length > 12 ? msg : "";
            case 3: // REG. UNICO DE CONTRIBUYENTES
                msg = t(langKeys.doctype_ruc_error);
                return docnum.length !== 11 ? msg : "";
            default: return t(langKeys.doctype_unknown_error);
        }
    }

    const setDoctype = (value: any) => {
        console.log('setDoctype')
        setErrors(p => ({
            ...p,
            doctype: !(value?.id) ? t(langKeys.field_required) : "",
            docnumber: docTypeValidate(mainData.docnumber, value?.id || 0),
        }))
        setMainData((p:any) => ({ ...p, doctype: value?.id}))
    }

    function maindataChange(field: string, value: any) {
        setMainData((p: any) => ({ ...p, [field]: value }))
        setErrors(p => {
            let error = "";
            if (field === "docnumber" && value) {
                error = docTypeValidate(value, mainData.doctype);
            } else if (!value) {
                error = t(langKeys.field_required);
            }

            return {
                ...p,
                [field]: error,
            };
        })
    }

    /*useEffect(() => {
        setMainData((p:any) => ({ ...p, country: countrycode, countryname: countryname, currency: currency }))
    }, [countrycode, countryname, currency]);*/
    
    const classes = useChannelAddStyles();
    return (
        <div style={{marginTop: "auto",marginBottom: "auto",maxHeight: "100%"}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad" , marginTop: 15}}>{t(langKeys.signupstep1title25)}</div>
            <div >             
                {mainData.doctype === 0 ?
                    <FieldView
                        className={classes.fieldview}
                        label={t(langKeys.docType)}
                        value={t(langKeys.billingfield_billingno)}
                    />:
                    <FieldSelect
                        onChange={setDoctype}
                        data={databilling}
                        variant="outlined"
                        className="col-6"
                        style={{margin:"15px 0"}}
                        label={t(langKeys.docType)}
                        valueDefault={mainData.doctype}
                        error={errors.doctype}
                        optionDesc="desc"
                        optionValue="id"
                    />}
                {mainData.doctype !== 0 &&
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type="number"
                        size="small"
                        defaultValue={mainData.docnumber}
                        label={t(langKeys.docNumber)}
                        name="docnumber"
                        error={errors.docnumber !== ""}
                        helperText={errors.docnumber}
                        onChange={(e) => maindataChange('docnumber', e.target.value)}
                    /> 
                }
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    size="small"
                    defaultValue={mainData.businessname}
                    label={t(langKeys.businessname)}
                    name="businessname"
                    error={!!errors.businessname}
                    helperText={errors.businessname}
                    onChange={(e) => maindataChange('businessname', e.target.value)}
                /> 
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    size="small"
                    defaultValue={mainData.fiscaladdress}
                    label={t(langKeys.fiscaladdress)}
                    name="fiscaladdress"
                    error={!!errors.fiscaladdress}
                    helperText={errors.fiscaladdress}
                    onChange={(e) => maindataChange('fiscaladdress', e.target.value)}
                /> 
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    size="small"
                    defaultValue={mainData.billingcontact}
                    label={t(langKeys.billingcontact)}
                    name="billingcontact"
                    error={!!errors.billingcontact}
                    helperText={errors.billingcontact}
                    onChange={(e) => maindataChange('billingcontact', e.target.value)}
                /> 
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    size="small"
                    defaultValue={mainData.billingcontactmail}
                    label={t(langKeys.billingcontactmail)}
                    name="billingcontactmail"
                    error={!!errors.billingcontactmail}
                    helperText={errors.billingcontactmail}
                    onChange={(e) => {
                        maindataChange('billingcontactmail', e.target.value);
                        setErrors(p => ({ ...p, billingcontactmail: e.target.value.includes('@') && e.target.value.includes('.') ? "" : t(langKeys.emailverification) }));
                    }}
                /> 
                <Button
                    onClick={() => setStep(2.6)}
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
export default Step2_5