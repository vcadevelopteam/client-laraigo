/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { makeStyles, Button, TextField, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { Dictionary } from "@types"
import MuiPhoneNumber from 'material-ui-phone-number';
import { styled } from '@material-ui/core/styles';


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
                <FormControl component="fieldset" style={{ padding: '16px 0' }}>
                    <FormGroup aria-label="position" row>
                        <FormControlLabel
                            style={{ fontSize: "20px!important" }}
                            value="sales"
                            control={<Checkbox
                                checked={mainData.sales}
                                onChange={e => setMainData((p: any) => ({ ...p, sales: !p.sales }))}
                            />}
                            label={t(langKeys.sales)}
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            style={{ fontSize: "20px!important" }}
                            value="customerservice"
                            control={<Checkbox
                                checked={mainData.customerservice}
                                onChange={e => setMainData((p: any) => ({ ...p, customerservice: !p.customerservice }))}
                            />}
                            label={t(langKeys.customerservice)}
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            style={{ fontSize: "20px!important" }}
                            value="marketing"
                            control={<Checkbox
                                checked={mainData.marketing}
                                onChange={e => setMainData((p: any) => ({ ...p, marketing: !p.marketing }))}
                            />}
                            label={t(langKeys.marketing)}
                            labelPlacement="end"
                        />
                    </FormGroup>
                </FormControl>
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