/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { DialogZyx, FieldEditArray, FieldEditMulti, FieldSelect, FieldView, GetIcon } from 'components';
import { getChannelListByPersonBody, getTicketListByPersonBody, getOpportunitiesByPersonBody, editPersonBody, getReferrerByPersonBody, insPersonUpdateLocked, convertLocalDate, unLinkPerson, personInsValidation, getPersonOne, getDomainByDomainNameList } from 'common/helpers';
import { Dictionary, IObjectState, IPerson, IPersonChannel, IPersonConversation, IPersonDomains } from "@types";
import { Avatar, Box, Divider, Grid, Button, makeStyles, AppBar, Tabs, Tab, Collapse, IconButton, BoxProps, Breadcrumbs, Link, TextField, Paper, InputBase, Tooltip, styled, InputAdornment } from '@material-ui/core';
import clsx from 'clsx';
import { BuildingIcon, DocNumberIcon, DocTypeIcon, EMailInboxIcon, GenderIcon, TelephoneIcon, SearchIcon, CallRecordIcon } from 'icons';
import PhoneIcon from '@material-ui/icons/Phone';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import paths from 'common/constants/paths';
import { ArrowDropDown } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { getChannelListByPerson, resetGetChannelListByPerson, getTicketListByPerson, resetGetTicketListByPerson, getLeadsByPerson, resetGetLeadsByPerson, getDomainsByTypename, resetGetDomainsByTypename, resetEditPerson, editPerson, getReferrerListByPerson, resetGetReferrerListByPerson } from 'store/person/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { useFieldArray, useForm, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { execute, getCollectionAux2 } from 'store/main/actions';
import Rating from '@material-ui/lab/Rating';
import TableZyx from '../components/fields/table-simple';
import { setModalCall, setPhoneNumber } from 'store/voximplant/actions';
import { VoximplantService } from 'network';
import DialogInteractions from 'components/inbox/DialogInteractions';
import DialogLinkPerson from 'components/inbox/PersonLinked';
import { WhatsappIcon } from 'icons';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { sendHSM } from 'store/inbox/actions';

import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import { Controller } from "react-hook-form";
import MuiPhoneNumber from 'material-ui-phone-number';
import MailIcon from '@material-ui/icons/Mail';
import SmsIcon from '@material-ui/icons/Sms';
import CustomTableZyxEditable from 'components/fields/customtable-editable';
const urgencyLevels = [null, 'LOW', 'MEDIUM', 'HIGH']
const variables = ['firstname', 'lastname', 'displayname', 'email', 'phone', 'documenttype', 'documentnumber', 'dateactivity', 'leadactivity', 'datenote', 'note', 'custom'].map(x => ({ key: x }))

const usePhotoClasses = makeStyles(theme => ({
    accountPhoto: {
        height: 40,
        width: 40,
    },
}));

interface PhotoProps {
    src?: string;
    radius?: number;
}

const Photo: FC<PhotoProps> = ({ src, radius }) => {
    const classes = usePhotoClasses();
    const width = radius && radius * 2;
    const height = radius && radius * 2;

    if (!src || src === "") {
        return <AccountCircle className={classes.accountPhoto} style={{ width, height }} />;
    }
    return <Avatar alt={src} src={src} className={classes.accountPhoto} style={{ width, height }} />;
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

const usePropertyStyles = makeStyles(theme => ({
    propertyRoot: {
        display: 'flex',
        flexDirection: 'row',
        stroke: '#8F92A1',
        alignItems: 'center',
        overflowWrap: 'anywhere',
    },
    propTitle: {
        fontWeight: 400,
        fontSize: 14,
        color: '#8F92A1',
    },
    propSubtitle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
    },
    leadingContainer: {
        height: 24,
        width: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        stroke: '#8F92A1',
        fill: '#8F92A1',
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexGrow: 1,
    },
    propSubtitleTicket: {
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));

interface PropertyProps extends Omit<BoxProps, 'title'> {
    icon?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    isLink?: Boolean;
}

const Property: FC<PropertyProps> = ({ icon, title, subtitle, isLink = false, ...boxProps }) => {
    const classes = usePropertyStyles();

    return (
        <Box className={classes.propertyRoot} {...boxProps}>
            {icon && <div className={classes.leadingContainer}>{icon}</div>}
            {icon && <div style={{ width: 8, minWidth: 8 }} />}
            <div className={classes.contentContainer}>
                <label className={classes.propTitle}>{title}</label>
                <div style={{ height: 4 }} />
                <div className={isLink ? classes.propSubtitleTicket : classes.propSubtitle}>{subtitle || "-"}</div>
            </div>
        </Box>
    );
}

interface TabPanelProps {
    value: string;
    index: string;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${value}`}
            aria-labelledby={`wrapped-tab-${value}`}
            style={{ display: value === index ? 'block' : 'none', overflowY: 'auto' }}
        >
            <Box p={3}>
                {children}
            </Box>
        </div>
    );
}

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

const GeneralInformationTab: FC<GeneralInformationTabProps> = ({ person, getValues, trigger, setValue, domains, errors, control, extraTriggers, setExtraTriggers }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const userConnected = useSelector(state => state.inbox.userConnected);
    // const referrerList = useSelector(state => state.person.personReferrerList);
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
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.corporation} />}
                                subtitle={person.corpdesc}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.organization} />}
                                subtitle={person.orgdesc}
                                m={1}
                            />
                        </Grid>

                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.firstname} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.firstname)}
                                        defaultValue={getValues("firstname")}
                                        value={getValues("firstname")}
                                        onChange={e => {
                                            setValue('firstname', e.target.value)
                                            trigger("firstname")
                                        }}
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
                                        placeholder={t(langKeys.lastname)}
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

                        {/*{!person.personid &&
                            <>
                                <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                                    <Property
                                        title={<Trans i18nKey={langKeys.personIdentifier} />}
                                        subtitle={
                                            channel.includes('WHA')||channel.includes('VOX')?(
                                                <Controller
                                                    name="personcommunicationchannel"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <CssPhonemui
                                                            {...field}
                                                            fullWidth
                                                            defaultCountry={"pe"}
                                                            placeholder={t(langKeys.personIdentifier)}
                                                            error={errors?.personcommunicationchannel?.message ? true : false}
                                                            helperText={errors?.personcommunicationchannel?.message || null}
                                                        />
                                                    )}
                                                />
                                            ):(
                                            <TextField
                                                fullWidth
                                                placeholder={t(langKeys.personIdentifier)}
                                                onChange={e => setValue('personcommunicationchannel', e.target.value)}
                                                error={errors?.personcommunicationchannel?.message ? true : false}
                                                helperText={errors?.personcommunicationchannel?.message || null}
                                            />
                                        )}
                                        m={1}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Property
                                        title={<Trans i18nKey={langKeys.internalIdentifier} />}
                                        subtitle={
                                            channel.includes('WHA')||channel.includes('VOX')?(
                                                <Controller
                                                    name="personcommunicationchannelowner"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <CssPhonemui
                                                            {...field}
                                                            fullWidth
                                                            defaultCountry={"pe"}
                                                            placeholder={t(langKeys.personIdentifier)}
                                                            error={errors?.personcommunicationchannelowner?.message ? true : false}
                                                            helperText={errors?.personcommunicationchannelowner?.message || null}
                                                        />
                                                    )}
                                                />
                                            ):(
                                            <TextField
                                                fullWidth
                                                placeholder={t(langKeys.internalIdentifier)}
                                                onChange={e => setValue('personcommunicationchannel', e.target.value)}
                                                error={errors?.personcommunicationchannelowner?.message ? true : false}
                                                helperText={errors?.personcommunicationchannelowner?.message || null}
                                            />
                                        )}
                                        m={1}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Property
                                        title={<Trans i18nKey={langKeys.communicationchannel} />}
                                        subtitle={(
                                            <FieldSelect
                                                onChange={(value) => {
                                                    setValue('channeltype', value?.domainvalue);
                                                    setchannel(value?.domainvalue||"")
                                                }}
                                                loading={domains.loading}
                                                data={domains.value?.channelTypes || []}
                                                optionValue="domainvalue"
                                                optionDesc="domaindesc"
                                                error={errors?.channeltype?.message}
                                            />
                                        )}
                                        m={1}
                                    />
                                </Grid>
                            </>
                        }*/}

                        {/*<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.fullname} />}
                                subtitle={person.name}
                                m={1}
                            />
                        </Grid>*/}
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
            {/* <div style={{ height: 12 }} />
            <label>{t(langKeys.referredBy)}</label>
            {referrerList.data.map((e, i) => <ReferrerItem referrer={e} key={`referrer_item_${i}`} />)} */}
        </div>
    );
}

const useChannelItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexGrow: 1,
    },
    propTitle: {
        fontWeight: 400,
        fontSize: 14,
        color: '#8F92A1',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemLabel: {
        color: '#8F92A1',
        fontSize: 14,
        fontWeight: 400,
        margin: 0,
    },
    itemText: {
        color: theme.palette.text.primary,
        fontSize: 15,
        fontWeight: 400,
        margin: '6px 0',
    },
    subtitle: {
        display: 'flex',
        flexDirection: 'row',
        gap: '0.5em',
        alignItems: 'center',
    },
    propSubtitle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
    },
    buttonphone: {
        padding: 0,
        '&:hover': {
            color: "#7721ad",
        },
    }
}));

interface ChannelItemProps {
    channel: IPersonChannel;
}

const nameschannel: { [x: string]: string } = {
    "ANDR": "T_ANDROID",
    "APPL": "T_IOS",
    "APPS": "T_APP_STORE",
    "CHATZ": "T_CHAT_WEB",
    "CHAZ": "T_CHAT_WEB",
    "FACEBOOKWORPLACE": "T_WORKPLACE_MESSENGER",
    "FBDM": "T_FACEBOOK_MESSENGER",
    "FBMS": "T_FACEBOOK_MESSENGER",
    "FBWA": "T_FACEBOOK_WALL",
    "FBWM": "T_WORKPLACE_WALL",
    "FBWP": "T_WORKPLACE_MESSENGER",
    "FORM": "T_WEB_FORM",
    "GOBU": "T_MY_BUSINESS",
    "INDM": "T_INSTAGRAM_DIRECT",
    "INMS": "T_INSTAGRAM_DIRECT",
    "INST": "T_INSTAGRAM_WALL",
    "LINE": "T_LINE",
    "LNKD": "T_LINKEDIN",
    "MAII": "T_MAIL",
    "MAIL": "T_MAIL",
    "PLAY": "T_PLAY_STORE",
    "SMS": "T_SMS",
    "SMSI": "T_SMS",
    "TEAM": "T_TEAMS",
    "TELE": "T_TELEGRAM",
    "TKTA": "T_TIKTOK",
    "TKTK": "T_TIKTOK",
    "TKTT": "T_TIKTOK",
    "TWDM": "T_TWITTER_MESSENGER",
    "TWIT": "T_TWITTER_WALL",
    "TWMS": "T_TWITTER_MESSENGER",
    "VOXI": "T_VOICE",
    "WEBM": "T_CHAT_WEB",
    "WHAC": "T_WHATSAPP",
    "WHAD": "T_WHATSAPP",
    "WHAG": "T_WHATSAPP",
    "WHAM": "T_WHATSAPP",
    "WHAP": "T_WHATSAPP",
    "WHAT": "T_WHATSAPP",
    "YOUA": "T_YOUTUBE",
    "YOUT": "T_YOUTUBE",
};

const ChannelItem: FC<ChannelItemProps> = ({ channel }) => {
    const { t } = useTranslation();
    const classes = useChannelItemStyles();
    const dispatch = useDispatch();
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const callOnLine = useSelector(state => state.voximplant.callOnLine);
    const userConnected = useSelector(state => state.inbox.userConnected);
    const [waitUnLink, setWaitUnLink] = useState(false);
    const unLinkRes = useSelector(state => state.main.execute);

    const personIdentifier = useMemo(() => {
        if (!channel) return '';
        const index = channel.personcommunicationchannel.lastIndexOf('_');
        return channel.personcommunicationchannel.substring(0, index);
    }, [channel]);

    useEffect(() => {
        if (waitUnLink) {
            if (!unLinkRes.loading && !unLinkRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: "Vinculación correcta" }))
                setWaitUnLink(false);
                dispatch(getChannelListByPerson(getChannelListByPersonBody(channel.personid)));
            } else if (unLinkRes.error) {
                const message = t(unLinkRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message }))
                dispatch(showBackdrop(false));
                setWaitUnLink(false);
            }
        }
    }, [unLinkRes, waitUnLink])

    // dispatch(getChannelListByPerson(getChannelListByPersonBody(person.personid)));
    return (
        <div className={classes.root}>
            {channel.originpersonid && (
                <div style={{ textAlign: "right" }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        disabled={unLinkRes.loading}
                        startIcon={<LinkOffIcon color="secondary" />}
                        onClick={() => {
                            dispatch(execute(unLinkPerson({
                                personid: channel.personid,
                                personcommunicationchannel: channel.personcommunicationchannel
                            })))
                            setWaitUnLink(true)
                        }}
                    >
                        {"Desvincular"}
                    </Button>
                </div>
            )}
            <Grid container direction="row">
                <Grid item xs={11} sm={11} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.communicationchannel} />}
                        subtitle={(
                            <div className={classes.subtitle}>
                                <span>{
                                    (nameschannel[channel.type] || '').includes("T_")
                                        ? t((langKeys as any)[nameschannel[channel.type]])
                                        : nameschannel[channel.type]}</span>
                                <GetIcon channelType={channel.type} color='black' />
                            </div>
                        )}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.displayname} />}
                        subtitle={channel.displayname}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ paddingLeft: 8 }}>
                    <Box>
                        <div className={classes.contentContainer}>
                            <label className={classes.propTitle}>{<Trans i18nKey={langKeys.personIdentifier} />}</label>
                            <div style={{ height: 4 }} />
                            <div style={{ display: "flex" }}>
                                {(!voxiConnection.error && !voxiConnection.loading && userConnected && !callOnLine && (channel.type.includes("WHA") || channel.type.includes("VOXI"))) &&
                                    <IconButton
                                        className={classes.buttonphone}
                                        onClick={() => { dispatch(setPhoneNumber(channel.personcommunicationchannelowner.replaceAll('+', ''))); dispatch(setModalCall(true)) }}
                                    >
                                        <PhoneIcon style={{ width: "20px", height: "20px" }} />
                                    </IconButton>
                                }
                                <div className={classes.propSubtitle}>{channel.personcommunicationchannelowner || "-"}</div>
                            </div>
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.internalIdentifier} />}
                        subtitle={personIdentifier}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.firstConnection} />}
                        subtitle={(channel.conversations || 0) > 0 ? channel.firstcontact : ""}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.lastConnection} />}
                        subtitle={channel.lastcontact}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.conversation} count={2} />}
                        subtitle={channel.conversations || '0'}
                        m={1}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

interface ChannelTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: UseFormSetValue<IPerson>;
    domains: IObjectState<IPersonDomains>;
}

const CommunicationChannelsTab: FC<ChannelTabProps> = ({ person }) => {
    const dispatch = useDispatch();
    const channelList = useSelector(state => state.person.personChannelList);

    useEffect(() => {
        if (person.personid && person.personid !== 0) {
            dispatch(getChannelListByPerson(getChannelListByPersonBody(person.personid)));
            return () => {
                dispatch(resetGetChannelListByPerson());
            };
        }
    }, [dispatch, person]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 12 }} />
            {channelList.data.map((e, i) => <ChannelItem channel={e} key={`channel_item_${i}`} />)}
        </div>
    );
}

interface AuditTabProps {
    person: IPerson;
}

const AuditTab: FC<AuditTabProps> = ({ person }) => {
    return (
        <Grid container direction="row">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.communicationchannel} />}
                            subtitle={`${person.communicationchannelname || ''}`}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.createdBy} />}
                            subtitle={person.createby}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.creationDate} />}
                            subtitle={new Date(person.createdate).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.firstContactDate} />}
                            subtitle={person.firstcontact ? new Date(person.firstcontact).toLocaleString() : ''}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.lastContactDate} />}
                            subtitle={person.lastcontact ? new Date(person.lastcontact).toLocaleString() : ''}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.modifiedBy} />}
                            subtitle={person.changeby}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.modificationDate} />}
                            subtitle={new Date(person.changedate).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

interface CustomVariableTabProps {
    setTableData: (x: Dictionary[]) => void;
    tableData: Dictionary[];
}

const CustomVariableTab: FC<CustomVariableTabProps> = ({ tableData, setTableData }) => {
    const dispatch = useDispatch();
    const domains = useSelector(state => state.person.editableDomains);
    const { t } = useTranslation();
    const [skipAutoReset, setSkipAutoReset] = useState(false)
    const [updatingDataTable, setUpdatingDataTable] = useState(false);
    const domainsCustomTable = useSelector((state) => state.main.mainAux2);

    const updateCell = (rowIndex: number, columnId: string, value: string) => {
        setSkipAutoReset(true);
        const auxTableData = tableData
        auxTableData[rowIndex][columnId] = value
        setTableData(auxTableData)
        setUpdatingDataTable(!updatingDataTable);
    }
    useEffect(() => {
        if (!domains.loading && !domains.error && domains.value?.customVariables) {
            dispatch(getCollectionAux2(getDomainByDomainNameList(domains.value?.customVariables?.filter(item => item.domainname !== "").map(item => item.domainname).join(","))));
        }
    }, [domains]);

    useEffect(() => {
        setSkipAutoReset(false)
    }, [updatingDataTable])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.variable),
                accessor: 'variablename',
                NoFilter: true,
                sortType: 'string'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
                sortType: 'string',
            },
            {
                Header: t(langKeys.datatype),
                accessor: 'variabletype',
                NoFilter: true,
                sortType: 'string',
                prefixTranslation: 'datatype_',
                Cell: (props: any) => {
                    const { variabletype } = props.cell.row.original || {};
                    return (t(`datatype_${variabletype}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.value),
                accessor: 'value',
                NoFilter: true,
                type: 'string',
                editable: true,
                width: 250,
                maxWidth: 250
            },
        ],
        []
    )
    return (
        <CustomTableZyxEditable
            columns={columns}
            data={(tableData).map(x => ({
                ...x,
                domainvalues: (domainsCustomTable?.data || []).filter(y => y.domainname === x?.domainname)
            }))}
            download={false}
            loading={domainsCustomTable.loading && domains.loading}
            register={false}
            filterGeneral={false}
            updateCell={updateCell}
            skipAutoReset={skipAutoReset}
        />
    );
}

interface ConversationsTabProps {
    person: IPerson;
}

const useConversationsTabStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
    root2: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        height: 35,
        border: '1px solid #EBEAED',
        backgroundColor: '#F9F9FA',
    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9fa',
        padding: `${theme.spacing(2)}px`,
    },
    containerSearch: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
    iconButton: {
        padding: 4,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    inputPlaceholder: {
        '&::placeholder': {
            fontSize: 14,
            fontWeight: 500,
            color: '#84818A',
        },
    },
}));

const ConversationsTab: FC<ConversationsTabProps> = ({ person }) => {
    const { t } = useTranslation();
    const classes = useConversationsTabStyles();
    const dispatch = useDispatch();
    const firstCall = useRef(true);
    const [page, setPage] = useState(0);
    const [searchFilter, setsearchFilter] = useState("");
    const [list, setList] = useState<IPersonConversation[]>([]);
    const [filteredlist, setfilteredList] = useState<IPersonConversation[]>([]);
    const conversations = useSelector(state => state.person.personTicketList);

    const fetchTickets = useCallback(() => {
        if (person.personid && person.personid !== 0) {
            const params = {
                filters: {},
                sorts: {},
                take: 20,
                skip: 20 * page,
                offset: 0,
            };
            dispatch(getTicketListByPerson(getTicketListByPersonBody(person.personid, params)))
        }
    }, [page, person, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetGetTicketListByPerson());
        };
    }, [dispatch]);

    useEffect(() => {
        const myDiv = document.getElementById("wrapped-tabpanel-2");
        if (myDiv) {
            myDiv.onscroll = () => {
                if (!firstCall.current && list.length >= conversations.count) return;
                if (conversations.loading) return;
                if (myDiv.offsetHeight + myDiv.scrollTop + 1 >= myDiv.scrollHeight) {
                    setPage(prevPage => prevPage + 1);
                }
            };
        }
    }, [list, conversations, setPage]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    useEffect(() => {
        if (firstCall.current) firstCall.current = false;
        if (conversations.loading) return;
        if (conversations.error === true) {
            dispatch(showSnackbar({
                message: conversations.message || 'Error',
                show: true,
                severity: "error"
            }));
        } else {
            setList(prevList => [...prevList, ...conversations.data]);
            setfilteredList(prevList => [...prevList, ...conversations.data]);
        }
    }, [conversations, setList, dispatch]);

    function filterList(e: any) {
        setsearchFilter(e)
        if (e === "") {
            setfilteredList(list)
        } else {

            var newArray = list.filter(function (el) {
                return el.ticketnum.includes(e) ||
                    el.asesorfinal.toLowerCase().includes(e.toLowerCase()) ||
                    el.channeldesc.toLowerCase().includes(e.toLowerCase()) ||
                    new Date(el.fechainicio).toLocaleString().includes(e) ||
                    new Date(el.fechafin).toLocaleString().includes(e)
            });
            setfilteredList(newArray)
        }
    }
    return (
        <div className={classes.root}>
            {list.length > 0 &&
                <Box className={classes.containerFilterGeneral}>
                    <span></span>
                    <div className={classes.containerSearch}>
                        <Paper component="div" className={classes.root2} elevation={0}>
                            <IconButton type="button" className={classes.iconButton} aria-label="search" disabled>
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                className={classes.input}
                                value={searchFilter}
                                onChange={(e) => filterList(e.target.value)}
                                placeholder={t(langKeys.search)}
                                inputProps={{ className: classes.inputPlaceholder }}
                            />
                        </Paper>
                    </div>
                </Box>
            }
            {filteredlist.map((e, i) => {
                if (filteredlist.length < conversations.count && i === filteredlist.length - 1) {
                    return [
                        <ConversationItem conversation={e} key={`conversation_item_${i}`} person={person} />,
                        <div
                            style={{ width: 'inherit', display: 'flex', justifyContent: 'center' }}
                            key={`conversation_item_${i}_loader`}
                        >
                        </div>
                    ];
                }
                return <ConversationItem conversation={e} key={`conversation_item_${i}`} person={person} />;
            })}
        </div>
    );
}

const useConversationsItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    collapseContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        fontSize: 14,
        fontWeight: 400,
    },
    infoLabel: {
        fontWeight: 500,
        fontSize: 14,
    },
    totalTime: {
        fontWeight: 700,
        fontSize: 16,
    },
    icon: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerstyle: {
        padding: "10px 0"
    }
}));

interface ConversationItemProps {
    conversation: IPersonConversation;
    person: Dictionary;
}



const ConversationItem: FC<ConversationItemProps> = ({ conversation, person }) => {
    const classes = useConversationsItemStyles();
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const mainResult = useSelector(state => state.main);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const openDialogInteractions = useCallback((row: any) => {
        setOpenModal(true);
        setRowSelected({ ...row, displayname: person.name, ticketnum: row.ticketnum })
    }, [mainResult]);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const downloadCallRecord = async (ticket: Dictionary) => {
        // dispatch(getCallRecord({call_session_history_id: ticket.postexternalid}));
        // setWaitDownloadRecord(true);
        try {
            const axios_result = await VoximplantService.getCallRecord({ call_session_history_id: ticket.postexternalid });
            if (axios_result.status === 200) {
                let buff = Buffer.from(axios_result.data, 'base64');
                const blob = new Blob([buff], { type: axios_result.headers['content-type'].split(';').find((x: string) => x.includes('audio')) });
                const objectUrl = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = objectUrl;
                a.download = ticket.ticketnum;
                a.click();
            }
        }
        catch (error: any) {
            const errormessage = t(error?.response?.data?.code || "error_unexpected_error")
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
        }
    }

    return (
        <div className={classes.root}>
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
            <Grid container direction="row">

                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                    {(conversation.channeltype === "VOXI" && conversation.postexternalid && conversation.callanswereddate) &&
                        <Tooltip title={t(langKeys.download_record) || ""}>
                            <IconButton size="small" onClick={() => downloadCallRecord(conversation)} style={{ paddingTop: 15, paddingLeft: 20 }}
                            >
                                <CallRecordIcon style={{ fill: '#7721AD' }} />
                            </IconButton>
                        </Tooltip>
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                    <Property title="Ticket #" subtitle={conversation.ticketnum} isLink={true} onClick={() => openDialogInteractions(conversation)} />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.agent} />}
                        subtitle={conversation.asesorfinal}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Property
                        title={<Trans i18nKey={langKeys.channel} />}
                        subtitle={(
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                                <span>{conversation.channeldesc}</span>
                                <GetIcon channelType={conversation.channeltype} color='black' />
                            </div>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.startDate} />}
                        subtitle={new Date(conversation.fechainicio).toLocaleString()}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.endDate} />}
                        subtitle={conversation.fechafin && new Date(conversation.fechafin).toLocaleString()}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                    <div className={classes.icon}>
                        <IconButton size="medium" onClick={() => setOpen(!open)}>
                            <ArrowDropDown />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <Collapse in={open}>
                <div className={classes.collapseContainer}>
                    <h3><Trans i18nKey={langKeys.ticketInformation} /></h3>
                    <Grid container direction="column">
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            TMO
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.tmo}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.status} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.status}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.tmeAgent} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.tme}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.closetype} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.closetype}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.tmrAgent} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.tmr}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.initialAgent} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.asesorinicial}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            {/* <Trans i18nKey={langKeys.avgResponseTimeOfClient} /> */}
                                            <Trans i18nKey={langKeys.tmrClient} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.tiempopromediorespuestapersona}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.finalAgent} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.asesorfinal}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Collapse>
        </div>
    );
}

interface OpportunitiesTabProps {
    person: IPerson;
}

const OpportunitiesTab: FC<OpportunitiesTabProps> = ({ person }) => {
    const dispatch = useDispatch();
    const leads = useSelector(state => state.person.personLeadList);
    const { t } = useTranslation();
    // const history = useHistory();

    // const goToLead = (lead: Dictionary) => {
    //     history.push({ pathname: paths.CRM_EDIT_LEAD.resolve(lead.leadid), });
    // }

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.opportunity),
                accessor: 'description',
            },
            {
                Header: t(langKeys.lastUpdate),
                accessor: 'changedate',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.changedate ? convertLocalDate(row.changedate).toLocaleString() : ""
                }
            },
            {
                Header: t(langKeys.phase),
                accessor: 'phase',
            },
            {
                Header: t(langKeys.priority),
                accessor: 'priority',
                type: "select",
                listSelectFilter: [{ key: t(langKeys.priority_low), value: "LOW" }, { key: t(langKeys.priority_medium), value: "MEDIUM" }, { key: t(langKeys.priority_high), value: "HIGH" }],
                Cell: (props: any) => {
                    const { priority } = props.cell.row.original;
                    return (
                        <Rating
                            name="simple-controlled"
                            max={3}
                            value={urgencyLevels.findIndex(x => x === priority)}
                            readOnly={true}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status'
            },
            {
                Header: t(langKeys.product, { count: 2 }),
                accessor: 'leadproduct',
                Cell: (props: any) => {
                    const { leadproduct } = props.cell.row.original;
                    if (!leadproduct) return null;
                    return leadproduct.split(",").map((t: string, i: number) => (
                        <span key={`leadproduct${i}`} style={{
                            backgroundColor: '#7721AD',
                            color: '#fff',
                            borderRadius: '20px',
                            padding: '2px 5px',
                            margin: '2px'
                        }}>{t}</span>
                    ))
                }
            },
            {
                Header: t(langKeys.tags),
                accessor: 'tags',
                Cell: (props: any) => {
                    const { tags } = props.cell.row.original;
                    if (!tags)
                        return null;
                    return tags.split(",").map((t: string, i: number) => (
                        <span key={`lead${i}`} style={{
                            backgroundColor: '#7721AD',
                            color: '#fff',
                            borderRadius: '20px',
                            padding: '2px 5px',
                            margin: '2px'
                        }}>{t}</span>
                    ))
                }
            },
            {
                Header: t(langKeys.comments),
                accessor: 'datenote',
                NoFilter: true,
                NoSort: true,
                Cell: (props: any) => {
                    const { datenote, leadnote, dateactivity, leadactivity } = props.cell.row.original;
                    return (
                        <div>
                            {datenote &&
                                <div>{t(langKeys.lastnote)} ({convertLocalDate(datenote).toLocaleString()}) {leadnote}</div>
                            }
                            {dateactivity &&
                                <div>{t(langKeys.nextprogramedactivity)} ({convertLocalDate(dateactivity).toLocaleString()}) {leadactivity}</div>
                            }
                        </div>
                    )
                }
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        if ((person?.personid || 0) > 0) {
            dispatch(getLeadsByPerson(getOpportunitiesByPersonBody(person.personid)));
        }
        return () => {
            dispatch(resetGetLeadsByPerson());
        };
    }, [dispatch, person]);

    return (
        <TableZyx
            columns={columns}
            filterGeneral={false}
            data={leads.data}
            download={false}
            loading={leads.loading}
            // onClickRow={goToLead}
            register={false}
        />
    );
}

const usePersonDetailStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: "100%",
        width: 'inherit',
        // overflowY: 'hidden',
    },
    rootContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        flexGrow: 1,
        overflowY: 'hidden',
    },
    tabs: {
        backgroundColor: '#EBEAED',
        color: '#989898',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        color: theme.palette.text.primary,
        backgroundColor: '#EBEAED',
        flexGrow: 1,
        maxWidth: 'unset',
    },
    activetab: {
        backgroundColor: 'white',
    },
    label: {
        fontSize: 14,
        fontWeight: 500,
    },
    profile: {
        color: theme.palette.text.primary,
        maxWidth: 343,
        width: 343,
        minWidth: 343,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
}));

interface DialogSendTemplateProps {
    setOpenModal: (param: any) => void;
    openModal: boolean;
    persons: IPerson[];
    type: "HSM" | "MAIL" | "SMS";
}

const DialogSendTemplate: React.FC<DialogSendTemplateProps> = ({ setOpenModal, openModal, persons, type }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const sendingRes = useSelector(state => state.inbox.triggerSendHSM);
    const [templatesList, setTemplatesList] = useState<Dictionary[]>([]);
    const [channelList, setChannelList] = useState<Dictionary[]>([]);
    const [bodyMessage, setBodyMessage] = useState('');
    const [personWithData, setPersonWithData] = useState<IPerson[]>([])
    const domains = useSelector(state => state.person.editableDomains);

    const title = useMemo(() => {
        switch (type) {
            case "HSM": return t(langKeys.send_hsm);
            case "SMS": return t(langKeys.send_sms);
            case "MAIL": return t(langKeys.send_mail);
            default: return '-';
        }
    }, [type]);
    const { control, register, handleSubmit, setValue, getValues, trigger, reset, formState: { errors } } = useForm<any>({
        defaultValues: {
            hsmtemplateid: 0,
            observation: '',
            communicationchannelid: type === "HSM" ? (channelList?.length === 1 ? channelList[0].communicationchannelid : 0) : 0,
            communicationchanneltype: type === "HSM" ? (channelList?.length === 1 ? channelList[0].type : "") : '',
            variables: [],
            buttons: [],
            headervariables: []
        }
    });

    const { fields } = useFieldArray({
        control,
        name: 'variables',
    });
    const { fields: buttons } = useFieldArray({
        control,
        name: 'buttons',
    });
    const { fields: fieldsheader } = useFieldArray({
        control,
        name: 'headervariables',
    });

    useEffect(() => {
        if (waitClose) {
            if (!sendingRes.loading && !sendingRes.error) {
                const message = type === "HSM" ? t(langKeys.successful_send_hsm) : (type === "SMS" ? t(langKeys.successful_send_sms) : t(langKeys.successful_send_mail));
                dispatch(showSnackbar({ show: true, severity: "success", message }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitClose(false);
            } else if (sendingRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(sendingRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitClose(false);
            }
        }
    }, [sendingRes, waitClose])
    useEffect(() => {
    }, [channelList])

    useEffect(() => {
        if (!domains.error && !domains.loading) {
            setTemplatesList(domains?.value?.templates?.filter(x => (x.templatetype !== "CAROUSEL" && (type !== "MAIL" ? x.type === type : (x.type === type || x.type === "HTML")))) || []);
            setChannelList(domains?.value?.channels?.filter(x => x.type.includes(type === "HSM" ? "WHA" : type)) || []);
        }
    }, [domains, type])

    useEffect(() => {
        if (openModal) {
            setBodyMessage('')
            reset({
                hsmtemplateid: 0,
                hsmtemplatename: '',
                variables: [],
                buttons: [],
                headervariables: [],
                communicationchannelid: type === "HSM" ? (channelList?.length === 1 ? channelList[0].communicationchannelid : 0) : 0,
                communicationchanneltype: type === "HSM" ? (channelList?.length === 1 ? channelList[0].type : "") : ''
            })
            register('hsmtemplateid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });

            if (type === "HSM") {
                register('communicationchannelid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            } else {
                register('communicationchannelid');
            }

            if (type === "MAIL") {
                setPersonWithData(persons.filter(x => x.email && x.email.length > 0))
            } else if (type === "HSM") {
                setPersonWithData(persons.filter(x => !!x.phonewhatsapp))
            } else {
                setPersonWithData(persons.filter(x => x.phone && x.phone.length > 0))
            }
        } else {
            setWaitClose(false);
        }
    }, [openModal])

    const onSelectTemplate = (value: Dictionary) => {
        if (value) {
            setBodyMessage(value.body);
            setValue('hsmtemplateid', value ? value.id : 0);
            setValue('hsmtemplatename', value ? value.name : '');
            const variablesList = value.body.match(/({{)(.*?)(}})/g) || [];
            const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
            setValue('variables', varaiblesCleaned.map((x: string) => ({ name: x, text: '', type: 'text' })));
            if (value?.header) {
                const variablesListHeader = value?.header?.match(/({{)(.*?)(}})/g) || [];
                const varaiblesCleanedHeader = variablesListHeader.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
                setValue('headervariables', varaiblesCleanedHeader.map((x: string) => ({ name: x, text: '', type: 'header', header: value?.header || "" })));
            } else {
                setValue('headervariables', [])
            }
            if (value?.buttonsgeneric?.length && value?.buttonsgeneric.some(element => element.btn.type === "dynamic")) {
                const buttonsaux = value?.buttonsgeneric
                let buttonsFiltered = []
                buttonsaux.forEach((x, i) => {
                    const variablesListbtn = x?.btn?.url?.match(/({{)(.*?)(}})/g) || [];
                    const varaiblesCleanedbtn = variablesListbtn.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
                    if (varaiblesCleanedbtn.length) {
                        const btns = varaiblesCleanedbtn?.map((y: string) => ({ name: y, text: '', type: 'url', url: x?.btn?.url || "" })) || []
                        buttonsFiltered = [...buttonsFiltered, ...btns]
                    }
                })
                setValue('buttons', buttonsFiltered);
            } else {
                setValue('buttons', []);
            }
        } else {
            setValue('hsmtemplatename', '');
            setValue('variables', []);
            setValue('buttons', []);
            setValue('headervariables', []);
            setBodyMessage('');
            setValue('hsmtemplateid', 0);
        }
    }
    const onSubmit = handleSubmit((data) => {
        if (personWithData.length === 0) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.no_people_to_send) }))
            return
        }
        const messagedata = {
            hsmtemplateid: data.hsmtemplateid,
            hsmtemplatename: data.hsmtemplatename,
            communicationchannelid: data.communicationchannelid,
            communicationchanneltype: data.communicationchanneltype,
            platformtype: data.communicationchanneltype,
            type,
            shippingreason: "PERSON",
            listmembers: personWithData.map(person => ({
                personid: person.personid,
                phone: person.phone?.replace("+", '') || "",
                firstname: person.firstname || "",
                email: person.email || "",
                lastname: person.lastname,
                parameters: [...data.variables, ...data.buttons, ...data.headervariables].map((v: any) => ({
                    type: v?.type || "text",
                    text: v.variable !== 'custom' ? (person as Dictionary)[v.variable] : v.text,
                    name: v.name
                }))
            }))
        }
        dispatch(sendHSM(messagedata))
        dispatch(showBackdrop(true));
        setWaitClose(true)
    });

    useEffect(() => {
        if (channelList.length === 1 && type === "HSM") {
            setValue("communicationchannelid", channelList[0].communicationchannelid || 0)
            setValue('communicationchanneltype', channelList[0].type || "");
            trigger("communicationchannelid")
        }
    }, [channelList])

    return (
        <DialogZyx
            open={openModal}
            title={title}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            {type === "HSM" && (
                <div className="row-zyx">
                    <FieldSelect
                        label={t(langKeys.channel)}
                        className="col-12"
                        valueDefault={getValues('communicationchannelid')}
                        onChange={value => {
                            setValue('communicationchannelid', value?.communicationchannelid || 0);
                            setValue('communicationchanneltype', value?.type || "");
                        }}
                        error={errors?.communicationchannelid?.message}
                        data={channelList}
                        optionDesc="communicationchanneldesc"
                        optionValue="communicationchannelid"
                    />
                </div>
            )}
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.template)}
                    className="col-12"
                    valueDefault={getValues('hsmtemplateid')}
                    onChange={onSelectTemplate}
                    error={errors?.hsmtemplateid?.message}
                    data={templatesList}
                    optionDesc="name"
                    optionValue="id"
                />
            </div>
            {Boolean(fieldsheader.length) &&
                <FieldView
                    label={t(langKeys.header)}
                    value={fieldsheader?.[0]?.header || ""}
                />
            }
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, marginBottom: 16 }}>
                {fieldsheader.map((item: Dictionary, i) => (
                    <div key={item.id}>
                        <FieldSelect
                            key={"var_" + item.id}
                            fregister={{
                                ...register(`headervariables.${i}.variable`, {
                                    validate: (value: any) => (value?.length) || t(langKeys.field_required)
                                })
                            }}
                            label={item.name}
                            valueDefault={getValues(`headervariables.${i}.variable`)}
                            onChange={(value) => {
                                setValue(`headervariables.${i}.variable`, value?.key)
                                trigger(`headervariables.${i}.variable`)
                            }}
                            error={errors?.headervariables?.[i]?.text?.message}
                            data={variables}
                            uset={true}
                            prefixTranslation=""
                            optionDesc="key"
                            optionValue="key"
                        />
                        {getValues(`headervariables.${i}.variable`) === 'custom' &&
                            <FieldEditArray
                                key={"custom_" + item.id}
                                fregister={{
                                    ...register(`headervariables.${i}.text`, {
                                        validate: (value: any) => (value?.length) || t(langKeys.field_required)
                                    })
                                }}
                                valueDefault={item.value}
                                error={errors?.headervariables?.[i]?.text?.message}
                                onChange={(value) => setValue(`headervariables.${i}.text`, "" + value)}
                            />
                        }
                    </div>
                ))}
            </div>
            {type === 'MAIL' &&
                <div style={{ overflow: 'scroll' }}>
                    <React.Fragment>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.message)}</Box>
                        <div dangerouslySetInnerHTML={{ __html: bodyMessage }} />
                    </React.Fragment>
                </div>
            }
            {type !== 'MAIL' &&
                <FieldEditMulti
                    label={t(langKeys.message)}
                    valueDefault={bodyMessage}
                    disabled={true}
                    rows={1}
                />
            }
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {fields.map((item: Dictionary, i) => (
                    <div key={item.id}>
                        <FieldSelect
                            key={"var_" + item.id}
                            fregister={{
                                ...register(`variables.${i}.variable`, {
                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                })
                            }}
                            label={item.name}
                            valueDefault={getValues(`variables.${i}.variable`)}
                            onChange={(value) => {
                                setValue(`variables.${i}.variable`, value.key)
                                trigger(`variables.${i}.variable`)
                            }}
                            error={errors?.variables?.[i]?.text?.message}
                            data={variables}
                            uset={true}
                            prefixTranslation=""
                            optionDesc="key"
                            optionValue="key"
                        />
                        {getValues(`variables.${i}.variable`) === 'custom' &&
                            <FieldEditArray
                                key={"custom_" + item.id}
                                fregister={{
                                    ...register(`variables.${i}.text`, {
                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    })
                                }}
                                valueDefault={item.value}
                                error={errors?.variables?.[i]?.text?.message}
                                onChange={(value) => setValue(`variables.${i}.text`, "" + value)}
                            />
                        }
                    </div>
                ))}

                {Boolean(buttons.length) && <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                    {t(langKeys.buttons)}
                </Box>}
                {buttons.map((item: Dictionary, i) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                        <div key={item.id}>
                            <FieldView
                                label={t(langKeys.button) + ` ${i + 1}`}
                                value={item?.url || ""}
                            />
                            <FieldSelect
                                key={"var_" + item.id}
                                fregister={{
                                    ...register(`buttons.${i}.variable`, {
                                        validate: (value: any) => (value?.length) || t(langKeys.field_required)
                                    })
                                }}
                                label={item.name}
                                valueDefault={getValues(`buttons.${i}.variable`)}
                                onChange={(value) => {
                                    setValue(`buttons.${i}.variable`, value?.key)
                                    trigger(`buttons.${i}.variable`)
                                }}
                                error={errors?.buttons?.[i]?.text?.message}
                                data={variables}
                                uset={true}
                                prefixTranslation=""
                                optionDesc="key"
                                optionValue="key"
                            />
                            {getValues(`buttons.${i}.variable`) === 'custom' &&
                                <FieldEditArray
                                    key={"custom_" + item.id}
                                    fregister={{
                                        ...register(`buttons.${i}.text`, {
                                            validate: (value: any) => (value?.length) || t(langKeys.field_required)
                                        })
                                    }}
                                    valueDefault={item.value}
                                    error={errors?.buttons?.[i]?.text?.message}
                                    onChange={(value) => setValue(`buttons.${i}.text`, "" + value)}
                                />
                            }
                        </div>
                    </div>
                ))}
            </div>
        </DialogZyx>)
}

const PersonDetail2: FC<{ person: any; setrefresh: (a: boolean) => void }> = ({ person, setrefresh }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    const location = useLocation<IPerson>();
    const classes = usePersonDetailStyles();
    const [tabIndex, setTabIndex] = useState('0');
    const domains = useSelector(state => state.person.editableDomains);
    const edit = useSelector(state => state.person.editPerson);
    const executeResult = useSelector(state => state.main.execute);
    const [waitLock, setWaitLock] = useState(false);
    const [waitValidation, setWaitValidation] = useState(false);
    const [showLinkPerson, setShowLinkPerson] = useState(false)
    const [payloadTemp, setpayloadTemp] = useState<any>(null)
    const [valuestosend, setvaluestosend] = useState<any>(null)
    const [openDialogTemplate, setOpenDialogTemplate] = useState(false)
    const [tableDataVariables, setTableDataVariables] = useState<Dictionary[]>([]);
    const [typeTemplate, setTypeTemplate] = useState<"HSM" | "SMS" | "MAIL">('MAIL');
    const [extraTriggers, setExtraTriggers] = useState({
        phone: person?.phone || '',
        email: person?.email || '',
    })

    const user = useSelector(state => state.login.validateToken.user);

    useEffect(() => {
        if (domains.value?.customVariables && person) {
            console.log(person)
            setTableDataVariables(domains.value.customVariables.map(x => ({ ...x, value: person?.variablecontext?.[x?.variablename] || "" })))
        }
    }, [person, domains]);

    const { setValue, getValues, trigger, register, control, formState: { errors } } = useForm<any>({
        defaultValues: {
            ...person,
            corpdesc: user?.corpdesc || '',
            orgdesc: user?.orgdesc || '',
            personid: person?.personid || 0,
            groups: person?.groups || '',
            status: person?.status || 'ACTIVO',
            type: person?.type || '',
            persontype: person?.persontype || '',
            personstatus: person?.personstatus || '',
            phone: person?.phone || '',
            email: person?.email || '',
            birthday: person?.birthday || null,
            alternativephone: person?.alternativephone || '',
            alternativeemail: person?.alternativeemail || '',
            documenttype: person?.documenttype || '',
            documentnumber: person?.documentnumber || '',
            firstname: person?.firstname || '',
            lastname: person?.lastname || '',
            sex: person?.sex || '',
            gender: person?.gender || '',
            civilstatus: person?.civilstatus || '',
            occupation: person?.occupation || '',
            educationlevel: person?.educationlevel || '',
            address: person?.address || '',
            district: person?.district || '',
            healthprofessional: person?.healthprofessional || '',
            referralchannel: person?.referralchannel || '',
            referringpersonid: person?.referringpersonid || 0,
        } || {},
    });

    useEffect(() => {
        if (!person) {
            history.push(paths.PERSON);
        } else {
            if (!person.personid) {
                person.corpdesc = user?.corpdesc || '';
                person.orgdesc = user?.orgdesc || '';
                person.personid = 0;
                person.groups = '';
                person.status = 'ACTIVO';
                person.type = '';
                person.persontype = '';
                person.personstatus = '';
                person.phone = '';
                person.email = '';
                person.birthday = null;
                person.alternativephone = '';
                person.alternativeemail = '';
                person.documenttype = '';
                person.documentnumber = '';
                person.firstname = '';
                person.lastname = '';
                person.sex = '';
                person.gender = '';
                person.civilstatus = '';
                person.occupation = '';
                person.educationlevel = '';
                person.address = '';
                person.district = '';
                person.healthprofessional = '';
                person.referralchannel = '';
                person.referringpersonid = 0;

                register('firstname', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('lastname', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('documentnumber', {
                    validate: {
                        validationDNI: (value) => getValues("documenttype") === "DNI" ? (value.length === 8 || t(langKeys.validationDNI) + "") : true,
                        validationRUC: (value) => getValues("documenttype") === "RUC" ? (value.length === 11 || t(langKeys.validationRUC) + "") : true,
                        validationCE: (value) => getValues("documenttype") === "CE" ? (value.length <= 12 || t(langKeys.validationCE) + "") : true,
                    }
                });
                register('email', {
                    validate: {
                        isemail: (value) => ((!value || (/\S+@\S+\.\S+/.test(value))) || t(langKeys.emailverification) + "")
                    }
                });
                register('alternativeemail', {
                    validate: {
                        isemail: (value) => ((!value || (/\S+@\S+\.\S+/.test(value))) || t(langKeys.emailverification) + "")
                    }
                });
                register('phone', {
                    validate: {
                        isperuphone: (value) => (value?.startsWith("+51") ? (value.length === 12 || t(langKeys.validationphone) + "") : true)
                    }
                });
                register('allternativephone', {
                    validate: {
                        isperuphone: (value) => (value?.startsWith("+51") ? (value.length === 12 || t(langKeys.validationphone) + "") : true)
                    }
                });
            }
            dispatch(getDomainsByTypename());
        }

        return () => {
            dispatch(resetGetDomainsByTypename());
            dispatch(resetEditPerson());
        };
    }, [history, person, dispatch]);

    useEffect(() => {
        if (domains.loading) return;
        if (domains.error === true) {
            dispatch(showSnackbar({
                message: domains.message!,
                show: true,
                severity: "error"
            }));
        }
    }, [domains, dispatch]);

    useEffect(() => {
        if (edit.loading) return;

        if (edit.error === true) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({
                message: edit.message!,
                show: true,
                severity: "error"
            }));
        } else if (edit.success) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({
                message: t(langKeys.successful_edit),
                show: true,
                severity: "success"
            }));
            if (!person?.personid) {
                history.push(paths.PERSON);
            }
        }
    }, [edit, dispatch]);

    const editperson = () => {
        dispatch(showBackdrop(true));
        dispatch(editPerson(payloadTemp.parameters.personid ? payloadTemp : {
            header: editPersonBody({
                ...person, ...valuestosend,
                variablecontext: tableDataVariables.filter(x => x.value).reduce((acc, x) => ({ ...acc, [x.variablename]: x.value }), {})
            }),
            detail: []
        }, !payloadTemp.parameters.personid));

        setpayloadTemp(null)
        setvaluestosend(null)
    }

    const handleEditPerson = async () => {
        const allOk = await trigger(); //para q valide el formulario
        if (allOk) {
            const values = getValues();
            const callback = () => {
                const payload = editPersonBody({
                    ...values,
                    variablecontext: tableDataVariables.filter(x => x.value).reduce((acc, x) => ({ ...acc, [x.variablename]: x.value }), {})
                });
                setpayloadTemp(payload)
                setvaluestosend(values)
                dispatch(execute(personInsValidation({
                    id: payload.parameters?.id || 0,
                    phone: payload.parameters?.phone || "",
                    email: payload.parameters?.email || "",
                    alternativephone: payload.parameters?.alternativephone || "",
                    alternativeemail: payload.parameters?.alternativeemail || "",
                    operation: payload.parameters.operation
                })))
                setWaitValidation(true)
                dispatch(showBackdrop(true));
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    }

    const handleLock = () => {
        if (person) {
            const callback = () => {
                setValue('locked', !getValues('locked'));
                trigger('locked');
                dispatch(execute(insPersonUpdateLocked({ ...person, locked: !person.locked })));
                dispatch(showBackdrop(true));
                setWaitLock(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: getValues('locked') ? t(langKeys.confirmation_person_unlock) : t(langKeys.confirmation_person_lock),
                callback
            }))
        }
    }

    useEffect(() => {
        if (waitLock) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                dispatch(showBackdrop(false));
                setWaitLock(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitLock(false);
            }
        }
    }, [executeResult, waitLock]);
    useEffect(() => {
        if (waitValidation) {
            if (!executeResult.loading && !executeResult.error) {
                let errormessage: any[] = []
                if (executeResult?.data[0].phone_exists) errormessage = errormessage.concat(t(langKeys.phone) + " " + payloadTemp.parameters.phone)
                if (executeResult?.data[0].email_exists) errormessage = errormessage.concat(t(langKeys.mail) + " " + payloadTemp.parameters.email)
                if (executeResult?.data[0].alternativephone_exists) errormessage = errormessage.concat(t(langKeys.phone) + " " + payloadTemp.parameters.alternativephone)
                if (executeResult?.data[0].alternativeemail_exists) errormessage = errormessage.concat(t(langKeys.mail) + " " + payloadTemp.parameters.alternativeemail)
                if (errormessage.length === 0) {
                    editperson()
                } else {
                    dispatch(showBackdrop(false));
                    dispatch(manageConfirmation({
                        visible: true,
                        question: `${t(langKeys.personrepeatedwarning1)} ${errormessage.join(" - ")} ${t(langKeys.personrepeatedwarning2)}`,
                        callback: editperson
                    }))
                }
                setWaitValidation(false);
                setrefresh(true)
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: "error" }))
                dispatch(showBackdrop(false));
                setWaitValidation(false);
            }
        }
    }, [executeResult, waitValidation]);

    if (!person) {
        return <div />;
    }

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    color="inherit"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        // history.push(paths.PERSON);
                        history.goBack();
                    }}
                >
                    <Trans i18nKey={langKeys.person} count={2} />
                </Link>
                <Link
                    underline="hover"
                    color="textPrimary"
                    href={location.pathname}
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Trans i18nKey={langKeys.personDetail} />
                </Link>
            </Breadcrumbs>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <h1>{person.name}</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {!!person.personid &&
                        <>
                            {!!extraTriggers.phone &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<WhatsappIcon width={24} style={{ fill: '#FFF' }} />}
                                    onClick={() => {
                                        setOpenDialogTemplate(true);
                                        setTypeTemplate("HSM");
                                    }}
                                >
                                    <Trans i18nKey={langKeys.send_hsm} />
                                </Button>
                            }
                            {(!!extraTriggers.email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(extraTriggers.email)) &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<MailIcon width={24} style={{ fill: '#FFF' }} />}
                                    onClick={() => {
                                        setOpenDialogTemplate(true);
                                        setTypeTemplate("MAIL");
                                    }}
                                >
                                    <Trans i18nKey={langKeys.send_mail} />
                                </Button>
                            }
                            {!!extraTriggers.phone &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SmsIcon width={24} style={{ fill: '#FFF' }} />}
                                    onClick={() => {
                                        setOpenDialogTemplate(true);
                                        setTypeTemplate("SMS");
                                    }}
                                >
                                    <Trans i18nKey={langKeys.send_sms} />
                                </Button>
                            }
                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                startIcon={<LinkIcon color="secondary" />}
                                onClick={() => setShowLinkPerson(true)}
                            >
                                {t(langKeys.link)}
                            </Button>
                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                startIcon={getValues('locked') ? <LockOpenIcon color="secondary" /> : <LockIcon color="secondary" />}
                                onClick={handleLock}
                            >
                                {getValues('locked') ? t(langKeys.unlock) : t(langKeys.lock)}
                            </Button>
                        </>
                    }
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={(e) => {
                            e.preventDefault();
                            // history.push(paths.PERSON);
                            history.goBack();
                        }}
                    >
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditPerson}
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                    >
                        <Trans i18nKey={langKeys.save} />
                    </Button>
                </div>
            </div>
            <div style={{ height: 7 }} />
            <div className={classes.rootContent}>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
                    <AppBar position="static" elevation={0}>
                        <Tabs
                            value={tabIndex}
                            onChange={(_, i: string) => setTabIndex(i)}
                            className={classes.tabs}
                            TabIndicatorProps={{ style: { display: 'none' } }}
                        >
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "0" && classes.activetab)}
                                label={<div><Trans i18nKey={langKeys.generalinformation} /></div>}
                                value="0"
                            />
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "1" && classes.activetab)}
                                    label={<div><Trans i18nKey={langKeys.communicationchannel} /></div>}
                                    value="1"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "2" && classes.activetab)}
                                    label={<Trans i18nKey={langKeys.conversation} count={2} />}
                                    value="2"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "3" && classes.activetab)}
                                    label={<Trans i18nKey={langKeys.opportunity} count={2} />}
                                    value="3"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "4" && classes.activetab)}
                                    label={<Trans i18nKey={langKeys.audit} />}
                                    value="4"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "5" && classes.activetab)}
                                    label={
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <Trans i18nKey={langKeys.customvariables} />
                                            <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.customvariableslist_helper_lead)}</div>} arrow placement="top" >
                                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                            </Tooltip>
                                        </div>}
                                    value="5"
                                />
                            }
                            {/* <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "4" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.claim} count={2} />}
                                value="4"
                            /> */}
                        </Tabs>
                    </AppBar>
                    <TabPanel value="0" index={tabIndex}>
                        <GeneralInformationTab
                            getValues={getValues}
                            setValue={setValue}
                            person={person}
                            trigger={trigger}
                            domains={domains}
                            errors={errors}
                            control={control}
                            extraTriggers={extraTriggers}
                            setExtraTriggers={setExtraTriggers}
                        />
                    </TabPanel>
                    <TabPanel value="1" index={tabIndex}>
                        <CommunicationChannelsTab
                            getValues={getValues}
                            setValue={setValue}
                            person={person}
                            domains={domains}
                        />
                    </TabPanel>
                    <TabPanel value="2" index={tabIndex}>
                        <ConversationsTab person={person} />
                    </TabPanel>
                    <TabPanel value="3" index={tabIndex}>
                        <OpportunitiesTab person={person} />
                    </TabPanel>
                    <TabPanel value="4" index={tabIndex}>
                        <AuditTab person={person} />
                    </TabPanel>
                    <TabPanel value="5" index={tabIndex}>
                        <CustomVariableTab tableData={tableDataVariables} setTableData={setTableDataVariables} />
                    </TabPanel>
                    {/* <TabPanel value="4" index={tabIndex}>qqq</TabPanel> */}
                </div>
                <Divider style={{ backgroundColor: '#EBEAED' }} orientation="vertical" flexItem />
                {!!person.personid &&
                    <div className={classes.profile}>
                        <label className={classes.label}>{t(langKeys.resume)}</label>
                        <div style={{ height: 16 }} />
                        <Photo src={person.imageurldef} radius={50} />
                        <h2>{person.name}</h2>
                        <Property
                            icon={<TelephoneIcon fill="inherit" stroke="inherit" width={20} height={20} />}
                            title={<Trans i18nKey={langKeys.phone} />}
                            // subtitle={(
                            //     <TextField
                            //         fullWidth
                            //         placeholder={t(langKeys.phone)}
                            //         defaultValue={getValues("phone")}
                            //         onChange={e => setValue('phone', e.target.value)}
                            //     />
                            // )}
                            subtitle={person.phone}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<EMailInboxIcon />}
                            title={<Trans i18nKey={langKeys.email} />}
                            // subtitle={(
                            //     <TextField
                            //         fullWidth
                            //         placeholder={t(langKeys.email)}
                            //         defaultValue={getValues("email")}
                            //         onChange={e => setValue('email', e.target.value)}
                            //     />
                            // )}
                            subtitle={person.email}
                            mt={1}
                            mb={1} />
                        <Property
                            icon={<DocTypeIcon fill="inherit" stroke="inherit" width={20} height={20} />}
                            title={<Trans i18nKey={langKeys.documenttype} />}
                            // subtitle={(
                            //     <DomainSelectField
                            //         defaultValue={getValues("documenttype")}
                            //         onChange={(value) => {
                            //             setValue('documenttype', value);
                            //         }}
                            //         loading={domains.loading}
                            //         data={domains.value?.docTypes || []}
                            //     />
                            // )}
                            subtitle={person.documenttype}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<DocNumberIcon fill="inherit" stroke="inherit" width={20} height={20} />}
                            title={<Trans i18nKey={langKeys.docNumber} />}
                            // subtitle={(
                            //     <TextField
                            //         fullWidth
                            //         placeholder={t(langKeys.docNumber)}
                            //         defaultValue={getValues("documentnumber")}
                            //         onChange={e => setValue('documentnumber', e.target.value)}
                            //     />
                            // )}
                            subtitle={person.documentnumber}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<GenderIcon />}
                            title={<Trans i18nKey={langKeys.gender} />}
                            // subtitle={(
                            //     <DomainSelectField
                            //         defaultValue={getValues("gender")}
                            //         onChange={(value, desc) => {
                            //             setValue('gender', value);
                            //             setValue('genderdesc', desc)
                            //         }}
                            //         loading={domains.loading}
                            //         data={domains.value?.genders || []}
                            //     />
                            // )}
                            subtitle={person.gender}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<BuildingIcon />}
                            title={<Trans i18nKey={langKeys.organization} />}
                            subtitle={person.orgdesc}
                            mt={1}
                            mb={1}
                        />
                    </div>
                }
            </div>
            <DialogLinkPerson
                openModal={showLinkPerson}
                setOpenModal={setShowLinkPerson}
                person={person}
                callback={(newPerson) => {
                    setValue("firstname", newPerson.firstname)
                    trigger("firstname")
                    setValue("lastname", newPerson.lastname)
                    trigger("lastname")
                    setValue("documenttype", newPerson.documenttype)
                    trigger("documenttype")
                    setValue("documentnumber", newPerson.documentnumber)
                    trigger("documentnumber")
                    setValue("phone", newPerson.phone)
                    trigger("phone")
                    setValue("alternativephone", newPerson.alternativephone)
                    trigger("alternativephone")
                    setValue("email", newPerson.email)
                    trigger("email")
                    setValue("alternativeemail", newPerson.alternativeemail)
                    trigger("alternativeemail")
                    setValue("birthday", newPerson.birthday)
                    trigger("birthday")
                    setValue("gender", newPerson.gender)
                    trigger("gender")
                    setValue("educationlevel", newPerson.educationlevel)
                    trigger("educationlevel")
                    setValue("civilstatus", newPerson.civilstatus)
                    trigger("civilstatus")
                    setValue("occupation", newPerson.occupation)
                    trigger("occupation")
                    dispatch(getChannelListByPerson(getChannelListByPersonBody(person.personid)));
                }}
            />
            <DialogSendTemplate
                openModal={openDialogTemplate}
                setOpenModal={setOpenDialogTemplate}
                persons={[getValues()]}
                type={typeTemplate}
            />
        </div>
    );
}

const PersonDetail: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation<IPerson>();
    const executeResult = useSelector(state => state.main.execute);
    const [person, setperson] = useState<any>(location.state as IPerson | null);
    const [refresh, setrefresh] = useState<boolean>(false);

    const [waitLoading, setWaitLoading] = useState(false);
    const match = useRouteMatch<{ id: string, columnid?: string, columnuuid?: string }>();

    useEffect(() => {
        if (!person || refresh) {
            dispatch(showBackdrop(true));
            setWaitLoading(true)
            dispatch(execute(getPersonOne({ personid: match.params.id })));
            setrefresh(false)
        }
    }, [person, refresh]);

    useEffect(() => {
        if (waitLoading && !executeResult.loading) {
            if (!executeResult.error && executeResult.data.length) {
                setperson(executeResult.data[0]);
                dispatch(showBackdrop(false));
                setWaitLoading(false);
            } else if (executeResult.error || executeResult.data.length) {
                dispatch(showBackdrop(false));
                setWaitLoading(false);
                history.push(paths.PERSON);
            }
        }
    }, [executeResult, waitLoading]);

    return (
        <>
            {!!person &&
                <PersonDetail2 person={person} setrefresh={setrefresh} />
            }
        </>
    );
}

export default PersonDetail;