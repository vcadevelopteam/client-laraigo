import { Grid, IconButton, InputAdornment } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, FieldMultiSelect, FieldSelect, PhoneFieldEdit } from "components";
import PhoneIcon from '@material-ui/icons/Phone';
import { FC } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showSnackbar } from "store/popus/actions";
import { setModalCall, setPhoneNumber } from "store/voximplant/actions";
import { PersonalDataTabProps } from "pages/person/model";
import { useExtraDataTabStyles } from "pages/person/styles";

const PersonalDataTab: FC<PersonalDataTabProps> = ({ getValues, trigger, setValue, domains, errors, control, extraTriggers, setExtraTriggers }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useExtraDataTabStyles()
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
                                label={t(langKeys.firstname)}
                                valueDefault={getValues("firstname")}
                                helperText2="enable"
                                onChange={value => {
                                    setValue('firstname', value)
                                }}
                                size="small"
                                variant="outlined"
                                error={errors?.firstname?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.lastname)}
                                valueDefault={getValues("lastname")}
                                helperText2="enable"
                                onChange={value => {
                                    setValue('lastname', value)
                                }}
                                size="small"
                                variant="outlined"
                                error={errors?.lastname?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={"Nickname"}
                                valueDefault={getValues("nickname")}
                                helperText2="enable"
                                onChange={value => {
                                    setValue('nickname', value)
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
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldSelect
                                uset={true}
                                className={classes.fieldStyle}
                                label={t(langKeys.documenttype)}
                                size="small"
                                variant="outlined"
                                valueDefault={getValues("documenttype")}
                                onChange={(value) => {
                                    setValue('documenttype', value?.domainvalue || "");
                                }}
                                helperText2="enable"
                                loading={domains.loading}
                                data={domains.value?.docTypes || []}
                                prefixTranslation="type_documenttype_"
                                optionValue="domainvalue"
                                optionDesc="domainvalue"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.docNumber)}
                                valueDefault={getValues("documentnumber")}
                                helperText2="enable"
                                onChange={value => {
                                    setValue('documentnumber', value)
                                    trigger("documentnumber")
                                }}
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div style={{ margin: 12 }}>
                                <PhoneFieldEdit
                                    size="small"
                                    variant="outlined"
                                    label={<Trans style={{ fontSize: 16, marginLeft: 10 }} i18nKey={langKeys.cellphone} />}
                                    onChange={(value: any) => {
                                        setValue('personcommunicationchannel', value || "")
                                        setValue('personcommunicationchannelowner', value || "")
                                        setValue('channeltype', value?.domainvalue);
                                        setValue('phone', value || "");
                                        setExtraTriggers({ ...extraTriggers, phone: value?.replace("+", '') || "" })
                                    }}
                                    defaultCountry={"pe"}
                                    value={getValues("phone")}
                                    enableLongNumbers={true}
                                    countryCodeEditable={false}
                                    placeholder={t(langKeys.phone)}
                                    error={errors?.phone?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {(!voxiConnection.error && userConnected) &&
                                                    <IconButton size="small" onClick={() => {
                                                        if (voxiConnection.error) {
                                                            dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.nochannelvoiceassociated) }))
                                                        } else {
                                                            dispatch(setModalCall(true))
                                                            dispatch(setPhoneNumber(getValues("phone")))
                                                        }
                                                    }}>
                                                        <PhoneIcon />
                                                    </IconButton>
                                                }
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div style={{ margin: 12 }}>
                                <PhoneFieldEdit
                                    size="small"
                                    variant="outlined"
                                    label={<Trans style={{ fontSize: 16, marginLeft: 10 }} i18nKey={langKeys.alternativeCellphone} />}
                                    onChange={(value: any) => {
                                        setValue('alternativephone', value || "");
                                    }}
                                    defaultCountry={"pe"}
                                    value={getValues("alternativephone")}
                                    enableLongNumbers={true}
                                    countryCodeEditable={false}
                                    placeholder={t(langKeys.alternativephone)}
                                    error={errors?.alternativephone?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {(!voxiConnection.error && userConnected) &&
                                                    <IconButton size="small" onClick={() => {
                                                        if (voxiConnection.error) {
                                                            dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.nochannelvoiceassociated) }))
                                                        } else {
                                                            dispatch(setModalCall(true))
                                                            dispatch(setPhoneNumber(getValues("alternativephone")))
                                                        }
                                                    }}>
                                                        <PhoneIcon />
                                                    </IconButton>
                                                }
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.email)}
                                valueDefault={getValues("email")}
                                helperText2="enable"
                                onChange={value => {
                                    setValue('email', value)
                                    setExtraTriggers({ ...extraTriggers, email: value || "" })
                                }}
                                size="small"
                                variant="outlined"
                                error={errors?.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.alternativeEmail)}
                                valueDefault={getValues("alternativeemail")}
                                helperText2="enable"
                                onChange={value => {
                                    setValue('alternativeemail', value)
                                }}
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldSelect
                                className={classes.fieldStyle}
                                label={"Sexo"}
                                size="small"
                                variant="outlined"
                                valueDefault={getValues("sex")}
                                onChange={(value) => {
                                    setValue('sex', value?.val || "");
                                }}
                                helperText2="enable"
                                data={[{ val: "Hombre", }, { val: "Mujer" }]}
                                optionValue="val"
                                optionDesc="val"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldSelect
                                className={classes.fieldStyle}
                                label={t(langKeys.gender)}
                                size="small"
                                variant="outlined"
                                valueDefault={getValues("gender")}
                                onChange={(value) => {
                                    setValue('gender', value?.val || "");
                                    setValue('genderdesc', value?.val || "")
                                }}
                                helperText2="enable"
                                data={[{ val: "Cisgénero" }, { val: "Transgénero" }, { val: "Intersexual" }, { val: "Queer" }, { val: "Género fluido" }]}
                                optionValue="val"
                                optionDesc="val"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={t(langKeys.birthdate)}
                                valueDefault={getValues("birthday")}
                                helperText2="enable"
                                type="date"
                                onChange={value => {
                                    const age = Math.floor((Number(new Date()) - new Date(value).getTime()) / 3.15576e+10)
                                    setValue('age', age)
                                    setValue('birthday', value)
                                    trigger("age")
                                }}
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={"Edad"}
                                valueDefault={getValues("age")}
                                helperText2="enable"
                                type="number"
                                onChange={value => {
                                    setValue('age', value)
                                    setValue('birthday', "")
                                    trigger("birthday")
                                }}
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldSelect
                                label={t(langKeys.educationLevel)}
                                helperText2="enable"
                                className={classes.fieldStyle}
                                uset={true}
                                valueDefault={getValues("educationlevel")}
                                onChange={(value) => {
                                    setValue('educationlevel', value?.domainvalue || "");
                                    setValue('educationleveldesc', value?.domaindesc || "")
                                }}
                                size="small"
                                variant="outlined"
                                loading={domains.loading}
                                data={domains.value?.educationLevels || []}
                                prefixTranslation="type_educationlevel_"
                                optionValue="domainvalue"
                                optionDesc="domainvalue"
                            />
                        </Grid>
                        {ocupationProperty === "DOMINIO" ? <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldSelect
                                label={t(langKeys.occupation)}
                                helperText2="enable"
                                className={classes.fieldStyle}
                                uset={true}
                                valueDefault={getValues("occupation")}
                                onChange={(value) => {
                                    setValue('occupation', value?.domainvalue || "");
                                    setValue('occupationdesc', value?.domaindesc || "")
                                }}
                                size="small"
                                variant="outlined"
                                loading={domains.loading}
                                data={domains.value?.occupations || []}
                                prefixTranslation="type_ocupation_"
                                optionValue="domainvalue"
                                optionDesc="domainvalue"
                            />
                        </Grid> :
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <FieldEdit
                                    className={classes.fieldStyle}
                                    label={t(langKeys.occupation)}
                                    valueDefault={getValues("occupation")}
                                    helperText2="enable"
                                    type="number"
                                    onChange={value => {
                                        setValue('occupation', value)
                                        setValue('occupationdesc', value)
                                    }}
                                    size="small"
                                    variant="outlined"
                                />
                            </Grid>}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldSelect
                                label={t(langKeys.personType)}
                                helperText2="enable"
                                className={classes.fieldStyle}
                                uset={true}
                                size="small"
                                variant="outlined"
                                valueDefault={getValues("persontype")}
                                onChange={(value) => {
                                    setValue('persontype', value?.domainvalue || "");
                                }}
                                loading={domains.loading}
                                data={domains.value?.personTypes || []}
                                prefixTranslation="type_persontype_"
                                optionValue="domainvalue"
                                optionDesc="domainvalue"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldSelect
                                label={t(langKeys.type)}
                                helperText2="enable"
                                className={classes.fieldStyle}
                                uset={true}
                                valueDefault={getValues("type")}
                                size="small"
                                variant="outlined"
                                onChange={(value) => {
                                    setValue('type', value?.val || "");
                                }}
                                data={[{ val: "Natural" }, { val: "Jurídica" }]}
                                optionValue="val"
                                optionDesc="val"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldEdit
                                className={classes.fieldStyle}
                                label={"Salario"}
                                valueDefault={getValues("salary")}
                                helperText2="enable"
                                type="number"
                                onChange={value => {
                                    setValue('salary', value)
                                }}
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FieldMultiSelect
                                label={t(langKeys.persongroup)}
                                helperText2="enable"
                                className={classes.fieldStyle}
                                uset={true}
                                valueDefault={getValues("groups")}
                                size="small"
                                variant="outlined"
                                onChange={(value) => {
                                    setValue('groups', value.map((o: any) => o.domainvalue).join() );
                                }}
                                data={domains.value?.groups || []}
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

export default PersonalDataTab;