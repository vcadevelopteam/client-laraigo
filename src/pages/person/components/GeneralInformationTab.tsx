import { Grid, IconButton, InputAdornment, styled, TextField } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { Property } from "./Property";
import { FieldEdit, FieldSelect } from "components";
import PhoneIcon from '@material-ui/icons/Phone';
import { IObjectState, IPerson, IPersonDomains } from "@types";
import { Controller, UseFormGetValues } from "react-hook-form";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { getReferrerListByPerson, resetGetReferrerListByPerson } from "store/person/actions";
import { getReferrerByPersonBody } from "common/helpers";
import { showSnackbar } from "store/popus/actions";
import { setModalCall, setPhoneNumber } from "store/voximplant/actions";
import MuiPhoneNumber from 'material-ui-phone-number';


interface GeneralInformationTabProps {
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

export const GeneralInformationTab: FC<GeneralInformationTabProps> = ({ person, getValues, trigger, setValue, domains, errors, control, extraTriggers, setExtraTriggers }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const userConnected = useSelector(state => state.inbox.userConnected);
    const ocupationProperty = domains?.value?.ocupationProperty?.[0]?.propertyvalue || "DOMINIO"

    useEffect(() => {
        if (person.referringpersonid) {
            dispatch(getReferrerListByPerson(getReferrerByPersonBody(person.referringpersonid)));
            return () => {
                dispatch(resetGetReferrerListByPerson());
            };
        }
    }, [dispatch, person]);
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container>
                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <FieldEdit
                                size="small"
                                variant="outlined"
                            />
                            <Property
                                title={<Trans i18nKey={langKeys.firstname} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        defaultValue={getValues("firstname")}
                                        value={getValues("firstname")}
                                        onChange={e => {
                                            setValue('firstname', e.target.value)
                                            trigger("firstname")
                                        }}
                                        style={{backgroundColor: "white"}}
                                        error={errors?.firstname?.message ? true : false}
                                        helperText={errors?.firstname?.message || null}
                                    />
                                )}

                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.lastname} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        defaultValue={getValues("lastname")}
                                        value={getValues("lastname")}
                                        onChange={e => {
                                            setValue('lastname', e.target.value)
                                            trigger("lastname")
                                        }}
                                        error={errors?.lastname?.message ? true : false}
                                        helperText={errors?.lastname?.message || null}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.documenttype} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={getValues("documenttype")}
                                        onChange={(value) => {
                                            setValue('documenttype', value?.domainvalue || "");
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.docTypes || []}
                                        prefixTranslation="type_documenttype_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.docNumber} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        type='number'
                                        placeholder={t(langKeys.docNumber)}
                                        defaultValue={getValues("documentnumber")}
                                        value={getValues("documentnumber")}
                                        onChange={e => {
                                            setValue('documentnumber', e.target.value)
                                            trigger('documentnumber')
                                        }}
                                        error={errors?.documentnumber}
                                        helperText={errors?.documentnumber?.message}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.personType} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
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
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.type} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.type}
                                        onChange={(value) => {
                                            setValue('type', value?.domainvalue || "");
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.personGenTypes || []}
                                        prefixTranslation="type_personlevel_"
                                        optionValue="domainvalue"
                                        optionDesc="domaindesc"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.phone} />}
                                subtitle={(
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <CssPhonemui
                                                {...field}
                                                fullWidth
                                                defaultCountry={"pe"}
                                                enableLongNumbers={true}
                                                countryCodeEditable={false}
                                                placeholder={t(langKeys.phone)}
                                                onChange={(value: any) => {
                                                    setValue('personcommunicationchannel', value || "")
                                                    setValue('personcommunicationchannelowner', value || "")
                                                    setValue('channeltype', value?.domainvalue);
                                                    setValue('phone', value || "");
                                                    setExtraTriggers({ ...extraTriggers, phone: value?.replace("+", '') || "" })
                                                }}
                                                error={!!errors?.phone}
                                                helperText={errors?.phone?.message}
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
                                        )}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.alternativePhone} />}
                                subtitle={(
                                    <Controller
                                        name="alternativephone"
                                        control={control}
                                        render={({ field }) => (
                                            <CssPhonemui
                                                {...field}
                                                fullWidth
                                                defaultCountry={"pe"}
                                                enableLongNumbers={true}
                                                countryCodeEditable={false}
                                                placeholder={t(langKeys.alternativePhone)}
                                                onChange={(value: any) => {
                                                    setValue('alternativephone', value || "");
                                                }}
                                                error={!!errors?.alternativephone}
                                                helperText={errors?.alternativephone?.message}
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
                                        )}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.email} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.email)}
                                        defaultValue={getValues("email")}
                                        value={getValues("email")}
                                        onChange={e => {
                                            setValue('email', e.target.value)
                                            setExtraTriggers({ ...extraTriggers, email: e.target.value || "" })
                                            trigger("email")
                                        }}
                                        error={!!errors?.email}
                                        helperText={errors?.email?.message}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.alternativeEmail} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.alternativeEmail)}
                                        defaultValue={getValues("alternativeemail")}
                                        value={getValues("alternativeemail")}
                                        onChange={e => {
                                            setValue('alternativeemail', e.target.value)
                                            trigger("alternativeemail")
                                        }}
                                        error={!!errors?.alternativeemail}
                                        helperText={errors?.alternativeemail?.message}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.birthday} />}
                                subtitle={(
                                    <TextField
                                        type="date"
                                        fullWidth
                                        placeholder={t(langKeys.birthday)}
                                        defaultValue={getValues("birthday")}
                                        value={getValues("birthday")}
                                        onChange={e => {
                                            setValue('birthday', e?.target?.value || null)
                                            trigger("birthday")
                                        }}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.gender} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={getValues("gender")}
                                        onChange={(value) => {
                                            setValue('gender', value?.domainvalue || "");
                                            setValue('genderdesc', value?.domaindesc || "")
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.genders || []}
                                        prefixTranslation="type_gender_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.educationLevel} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={getValues("educationlevel")}
                                        onChange={(value) => {
                                            setValue('educationlevel', value?.domainvalue || "");
                                            setValue('educationleveldesc', value?.domaindesc || "")
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.educationLevels || []}
                                        prefixTranslation="type_educationlevel_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.civilStatus} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={getValues("civilstatus")}
                                        onChange={(value) => {
                                            setValue('civilstatus', value?.domainvalue || "");
                                            setValue('civilstatusdesc', value?.domaindesc || "")
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.civilStatuses || []}
                                        prefixTranslation="type_civilstatus_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        {ocupationProperty === "DOMINIO" ? <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.occupation} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={getValues("occupation")}
                                        onChange={(value) => {
                                            setValue('occupation', value?.domainvalue || "");
                                            setValue('occupationdesc', value?.domaindesc || "")
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.occupations || []}
                                        prefixTranslation="type_ocupation_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid> :
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Property
                                    title={<Trans i18nKey={langKeys.occupation} />}
                                    subtitle={(
                                        <TextField
                                            fullWidth
                                            placeholder={t(langKeys.occupation)}
                                            defaultValue={getValues("occupation")}
                                            value={getValues("occupation")}
                                            onChange={e => {
                                                setValue('occupation', e.target.value)
                                                setValue('occupationdesc', e.target.value)
                                                trigger("occupation")
                                            }}
                                        />
                                    )}
                                    m={1}
                                />
                            </Grid>}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.group} count={2} />}
                                subtitle={(
                                    <FieldSelect
                                        valueDefault={getValues("groups")}
                                        onChange={(value) => {
                                            setValue('groups', value?.domainvalue || "");
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.groups || []}
                                        optionValue="domainvalue"
                                        optionDesc="domaindesc"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.address} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.address)}
                                        defaultValue={getValues("address")}
                                        value={getValues("address")}
                                        onChange={e => {
                                            setValue('address', e.target.value)
                                            trigger("address")
                                        }}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.district} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.district)}
                                        defaultValue={getValues("district")}
                                        value={getValues("district")}
                                        onChange={e => {
                                            setValue('district', e.target.value)
                                            trigger("district")
                                        }}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.referralchannel} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.referralchannel)}
                                        defaultValue={getValues("referralchannel")}
                                        value={getValues("referralchannel")}
                                        onChange={e => {
                                            setValue('referralchannel', e.target.value)
                                            trigger("referralchannel")
                                        }}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.healthprofessional} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.healthprofessional)}
                                        defaultValue={getValues("healthprofessional")}
                                        value={getValues("healthprofessional")}
                                        onChange={e => {
                                            setValue('healthprofessional', e.target.value)
                                            trigger("healthprofessional")
                                        }}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}