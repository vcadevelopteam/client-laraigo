/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { makeStyles, Button, TextField, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { Dictionary } from "@types";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: "bold",
        fontSize: '40px',
        //textTransform: 'initial',
        width: "100%"
    },
}));

export const SecondStep: FC<{setMainData:(param:any)=>void,mainData:any,setStep:(param:any)=>void}> = ({setMainData,mainData,setStep}) => {
    const [errors, setErrors] = useState<Dictionary>({
        firstandlastname: "",
        companybusinessname: "",
    });
    const [disablebutton, setdisablebutton] = useState(true);
    useEffect(() => {
        setdisablebutton(!(mainData.firstandlastname!==""&&mainData.companybusinessname!==""))
    }, [mainData])
    function maindataChange(field:string,value:any){
        setMainData((p:any)=>({...p,[field]:value}))
        setErrors(p=>({...p,[field]: !value?t(langKeys.field_required):""}))
    }
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    return (
        <div style={{ width: '100%' }}>
            <div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", width: "50%", marginLeft: "25%" }}>{t(langKeys.signupstep1title2)}</div>
                <div style={{padding:"20px"}}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        defaultValue={mainData.firstandlastname}
                        label={t(langKeys.firstandlastname)}
                        name="firstandlastname"
                        error={!!errors.firstandlastname}
                        helperText={errors.firstandlastname}
                        onChange={(e) => maindataChange('firstandlastname',e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label={t(langKeys.companybusinessname)}
                        name="companybusinessname"
                        defaultValue={mainData.companybusinessname}
                        error={!!errors.companybusinessname}
                        helperText={errors.companybusinessname}
                        onChange={(e) => maindataChange('companybusinessname',e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type="number"
                        fullWidth
                        defaultValue={mainData.mobilephone}
                        label={t(langKeys.mobilephoneoptional)}
                        name="mobilephone"
                        onChange={(e) => setMainData((p:any)=>({...p,mobilephone:e.target.value}))}
                    />
                    <div style={{padding:"20px",fontWeight: "bold", color: "#381052"}}>{t(langKeys.laraigouse)}</div>
                    <FormControl component="fieldset" style={{padding: "0 20px"}}>
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                style={{fontSize:"20px!important"}}
                                value="sales"
                                control={<Checkbox 
                                    checked={mainData.sales}
                                    onChange={e=>setMainData((p:any)=>({...p,sales:!p.sales}))}
                                />}
                                label={t(langKeys.sales)}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                style={{fontSize:"20px!important"}}
                                value="customerservice"
                                control={<Checkbox 
                                    checked={mainData.customerservice}
                                    onChange={e=>setMainData((p:any)=>({...p,customerservice:!p.customerservice}))}
                                />}
                                label={t(langKeys.customerservice)}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                style={{fontSize:"20px!important"}}
                                value="marketing"
                                control={<Checkbox 
                                    checked={mainData.marketing}
                                    onChange={e=>setMainData((p:any)=>({...p,marketing:!p.marketing}))}
                                />}
                                label={t(langKeys.marketing)}
                                labelPlacement="end"
                            />
                        </FormGroup>
                    </FormControl>

                </div>

                <div style={{ width: "100%" }}>
                    <Button
                        onClick={() => {setStep(3)}}
                        className={classes.button}
                        style={{ width: "80%",marginLeft:"10%" }}
                        variant="contained"
                        color="primary"
                        disabled={disablebutton}
                    >{t(langKeys.next)}
                    </Button>

                </div>

            </div>
        </div>
    )
}
export default SecondStep