import { Grid, IconButton, InputAdornment, makeStyles, styled, TextField } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { Property } from "./Property";
import { FieldEdit, FieldSelect } from "components";
import PhoneIcon from '@material-ui/icons/Phone';
import { IObjectState, IPerson, IPersonDomains } from "@types";
import { Controller, UseFormGetValues } from "react-hook-form";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showSnackbar } from "store/popus/actions";
import { setModalCall, setPhoneNumber } from "store/voximplant/actions";
import MuiPhoneNumber from 'material-ui-phone-number';


interface ExtraDataTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: any;
    trigger: any;
    domains: IObjectState<IPersonDomains>;
    errors: any;
    control: any;
    extraTriggers: any;
    setExtraTriggers: (trig: any) => void;
}
const useStyles = makeStyles(theme => ({
    fieldStyle: {
        margin: 12
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

export const ExtraDataTab: FC<ExtraDataTabProps> = ({ person, getValues, trigger, setValue, domains, errors, control, extraTriggers, setExtraTriggers }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles()
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const userConnected = useSelector(state => state.inbox.userConnected);
    const ocupationProperty = domains?.value?.ocupationProperty?.[0]?.propertyvalue || "DOMINIO"

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto', }}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.referringpersonname)}
                                valueDefault={getValues("referringpersonname")}
                                helperText2="enable"
                                onChange={value => {
                                    setValue('referringpersonname', value)
                                    trigger("referringpersonname")
                                }}
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.personid)}
                                valueDefault={getValues("personid")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.termsandconditions)}
                                valueDefault={getValues("termsandconditions")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.dashboard_managerial_interaction_clientnumber)}
                                valueDefault={getValues("clientnumber")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={`${t(langKeys.observation)} ${t(langKeys.person).toLocaleLowerCase()}`}
                                valueDefault={getValues("observation")}
                                helperText2="enable"
                                onChange={value => {
                                    setValue('observation', value)
                                    trigger("observation")
                                }}
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.healthprofessional)}
                                valueDefault={getValues("healthprofessional")}
                                helperText2="enable"
                                onChange={value => {
                                    setValue('healthprofessional', value)
                                    trigger("healthprofessional")
                                }}
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.blacklist)}
                                valueDefault={getValues("blacklist")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.eventnameperson)}
                                valueDefault={getValues("eventname")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.eventdate)}
                                valueDefault={getValues("eventdate")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.eventtime)}
                                valueDefault={getValues("eventtime")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.eventcode)}
                                valueDefault={getValues("eventcode")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.eventlink)}
                                valueDefault={getValues("eventlink")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.eventlinkcode)}
                                valueDefault={getValues("eventlinkcode")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.contactbussiness)}
                                valueDefault={getValues("contact")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.referralchannel)}
                                valueDefault={getValues("referralchannel")}
                                helperText2="enable"
                                disabled
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}