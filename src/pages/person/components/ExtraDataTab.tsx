import { Grid, makeStyles } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { FieldEdit } from "components";
import { IObjectState, IPerson, IPersonDomains } from "@types";
import { UseFormGetValues } from "react-hook-form";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";


interface ExtraDataTabProps {
    getValues: UseFormGetValues<IPerson>;
    setValue: any;
    trigger: any;
}
const useStyles = makeStyles(theme => ({
    fieldStyle: {
        margin: 12
    },
}));

export const ExtraDataTab: FC<ExtraDataTabProps> = ({ getValues, trigger, setValue }) => {
    const { t } = useTranslation();
    const classes = useStyles()

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