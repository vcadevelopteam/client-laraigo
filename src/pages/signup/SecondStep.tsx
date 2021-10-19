/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { makeStyles, Button, TextField} from '@material-ui/core';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { Dictionary } from "@types"
import MuiPhoneNumber from 'material-ui-phone-number';
import { styled } from '@material-ui/core/styles';
import { FieldMultiSelect } from "components";


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


export const SecondStep: FC<{ setMainData: (param: any) => void, mainData: any, setStep: (param: any) => void }> = ({ setMainData, mainData, setStep }) => {
    
    const [errors, setErrors] = useState<Dictionary>({
        firstandlastname: "",
        companybusinessname: "",
    });
    const [disablebutton, setdisablebutton] = useState(true);
    useEffect(() => {
        setdisablebutton(!(mainData.firstandlastname !== "" && mainData.companybusinessname !== ""))
        console.log(mainData)
    }, [mainData])
    function maindataChange(field: string, value: any) {
        setMainData((p: any) => ({ ...p, [field]: value }))
        setErrors(p => ({ ...p, [field]: !value ? t(langKeys.field_required) : "" }))
    }
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const valuesreasons=[
        {
          name: t(langKeys.sales),
          id: 'sales',
        },
        {
          name: t(langKeys.customerservice),
          id: 'customerservice',
        },
        {
          name: t(langKeys.marketing),
          id: 'marketing',
        },
      ]
    return (
        <div >
            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad" }}>{t(langKeys.signupstep1title2)}</div>
            <div >
                <TextField
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
                <CssPhonemui
                    variant="outlined"
                    margin="normal"
                    size="small"
                    disableAreaCodes={true}
                    value={mainData.mobilephone}
                    label={t(langKeys.mobilephoneoptional)}
                    name="mobilephone"
                    fullWidth
                    defaultCountry={'pe'}
                    onChange={(e) => setMainData((p: any) => ({ ...p, mobilephone: e }))}
                />
                <div style={{ paddingTop: 20, fontWeight: "bold", color: "#381052" }}>{t(langKeys.laraigouse)}</div>
                
                <FieldMultiSelect
                    onChange={(value) => setMainData((p:any) => ({ ...p, join_reason: value.map((o: any) => o.id).join() }))}
                    variant="outlined"
                    className="col-6"
                    style={{margin:"15px 0"}}
                    valueDefault={mainData.join_reason}
                    data={valuesreasons}
                    optionDesc="name"
                    optionValue="id"
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
export default SecondStep