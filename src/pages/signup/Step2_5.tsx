/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { makeStyles, Button, TextField, Breadcrumbs} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { Dictionary } from "@types"
import { useSelector } from "hooks";
import MuiPhoneNumber from 'material-ui-phone-number';
import { styled } from '@material-ui/core/styles';
import { FieldSelect, FieldView} from "components";


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


export const Step2_5: FC<{ setMainData: (param: any) => void, mainData: any, setStep: (param: any) => void,setOpenWarning: (param: any) => void}> = ({ setMainData, mainData, setStep,setOpenWarning }) => {
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
        setdisablebutton((!(mainData.doctype) || isNaN(parseInt(mainData.docnumber)) || mainData.businessname === ""|| mainData.fiscaladdress === ""|| mainData.billingcontact === ""|| mainData.billingcontactmail === ""))
    }, [mainData])
    function maindataChange(field: string, value: any) {
        setMainData((p: any) => ({ ...p, [field]: value }))
        setErrors(p => ({ ...p, [field]: !value ? t(langKeys.field_required) : "" }))
    }

    /*useEffect(() => {
        setMainData((p:any) => ({ ...p, country: countrycode, countryname: countryname, currency: currency }))
    }, [countrycode, countryname, currency]);*/
    
    const classes = useChannelAddStyles();
    return (
        <div >
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                    {"<< Previous"}
                </Link>
            </Breadcrumbs>
            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad" }}>{t(langKeys.signupstep1title25)}</div>
            <div >             
                {mainData.doctype === 0 ?
                    <FieldView
                        className={classes.fieldview}
                        label={t(langKeys.docType)}
                        value={t(langKeys.billingfield_billingno)}
                    />:
                    <FieldSelect
                        onChange={(value) => {
                            setErrors(p => ({ ...p, doctype: !(value?.id) ? t(langKeys.field_required) : "" }))
                            setMainData((p:any) => ({ ...p, doctype: value?.id}))
                        }}
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
                        error={!!errors.docnumber}
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
                    onChange={(e) => maindataChange('billingcontactmail', e.target.value)}
                /> 
                <Button
                    onClick={() => { setStep(3) }}
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