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
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldSelect
                                uset={true}
                                className={classes.fieldStyle}
                                label={t(langKeys.civilStatus)}
                                valueDefault={getValues("civilstatus")}
                                onChange={(value) => {
                                    setValue('civilstatus', value?.domainvalue || "");
                                    setValue('civilstatusdesc', value?.domaindesc || "")
                                }}
                                size="small"
                                variant="outlined"
                                loading={domains.loading}
                                helperText2="enable"
                                data={domains.value?.civilStatuses || []}
                                prefixTranslation="type_civilstatus_"
                                optionValue="domainvalue"
                                optionDesc="domainvalue"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}