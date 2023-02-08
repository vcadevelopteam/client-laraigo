import React, { FC, useEffect, useRef, useState } from 'react';
import { AppBar, Box, Button, makeStyles, Link, Tab, Tabs, Typography, TextField, Grid, Select, IconButton, FormControl, MenuItem, Divider, Breadcrumbs, Checkbox, FormControlLabel } from '@material-ui/core';
import { ColorInput, FieldEdit, IOSSwitch } from 'components';
import { Trans, useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { langKeys } from 'lang/keys';
import { ColorChangeHandler } from 'react-color';
import { Close } from '@material-ui/icons';
import { useHistory, useLocation } from 'react-router';
import { useForm, UseFormReturn } from 'react-hook-form';
import { IChannel, IFormWebAdd, IChatWebAddFormField } from '@types';
import { useDispatch } from 'react-redux';
import { editChannel as getEditChannel, insertChannel2, resetInsertChannel, resetEditChannel } from 'store/channel/actions';
import { useSelector } from 'hooks';
import { showSnackbar } from 'store/popus/actions';
import { getEditChatWebChannel, getInsertChatwebChannel } from 'common/helpers';
import paths from 'common/constants/paths';

interface TabPanelProps {
    value: string;
    index: string;
}

interface FieldTemplate {
    text: React.ReactNode;
    node: (onClose: (key: string) => void, data: IChatWebAddFormField, form: UseFormReturn<IFormWebAdd>, index: number) => React.ReactNode;
    data: IChatWebAddFormField;
}

const isEmpty = (str?: string) => {
    return !str || str.length === 0;
}

const useTabPanelStyles = makeStyles(theme => ({
    root: {
        border: '#A59F9F 1px solid',
        borderRadius: 6,
    },
}));

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    const classes = useTabPanelStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            className={classes.root}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            style={{ display: value === index ? 'block' : 'none' }}
        >
            <Box p={3}>
                {children}
            </Box>
        </div>
    );
}

const useTabInterfacetyles = makeStyles(theme => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    icon: {
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
        }
    },
    imgContainer: {
        borderRadius: 20,
        backgroundColor: 'white',
        width: 157,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        height: '80%',
        width: 'auto',
    },
}));

const TabPanelInterface: FC<{ form: UseFormReturn<IFormWebAdd> }> = ({ form }) => {
    const { setValue, getValues, formState: { errors } } = form;
    const classes = useTabInterfacetyles();
    const { t } = useTranslation();

    return (
        <Grid container direction="column">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.title} />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder={t(langKeys.formHeaderTitle)} // "Título de la cabecera del chat"
                                name="titulo"
                                size="small"
                                defaultValue={getValues('extra.titleform')}
                                onChange={(e) => setValue('extra.titleform', e.target.value)}
                                error={!isEmpty(errors?.extra?.titleform?.message)}
                                helperText={errors?.extra?.titleform?.message}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.formFooter} />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder={t(langKeys.formFooterText)}
                                name="footer"
                                size="small"
                                defaultValue={getValues('extra.footerform')}
                                onChange={(e) => setValue('extra.footerform', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.submitButtom} />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder={t(langKeys.submitButtomText)}
                                name="subtitulo"
                                size="small"
                                defaultValue={getValues('extra.textButtonSend')}
                                onChange={(e) => setValue('extra.textButtonSend', e.target.value)}
                                error={!isEmpty(errors?.extra?.textButtonSend?.message)}
                                helperText={errors?.extra?.textButtonSend?.message}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.thankyoupage} />
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder={t(langKeys.thankyoupagetext)}
                                name="subtitulo"
                                size="small"
                                defaultValue={getValues('extra.urlThanks')}
                                onChange={(e) => setValue('extra.urlThanks', e.target.value)}
                                error={!isEmpty(errors?.extra?.urlThanks?.message)}
                                helperText={errors?.extra?.urlThanks?.message}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>
                                reCAPTCHA
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <FormControlLabel
                                value={getValues('extra.recaptcha')}
                                control={<Checkbox 
                                    onChange={(e) => setValue('extra.recaptcha', e.target.checked)}
                                    color="primary" />}
                                //onChange={(e) => {setValue('extra.recaptcha', e.target.value === "true")}}
                                label={t(langKeys.recaptchaCheckbox)}
                                labelPlacement="top"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

const useTabColorStyles = makeStyles(theme => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    colorOption: {
        width: 28,
        height: 28,
        padding: 0,
        minWidth: 28,
        minHeight: 28,
    },
}));

const TabPanelStyles: FC<{ form: UseFormReturn<IFormWebAdd> }> = ({ form }) => {
    const { t } = useTranslation();
    const { setValue, getValues } = form;
    const classes = useTabColorStyles();
    const [colotBackgroundButton, setcolotBackgroundButton] = useState(getValues('extra.colotBackgroundButton'));
    const [colorButtonLabel, setcolorButtonLabel] = useState(getValues('extra.colorButtonLabel'));
    const [colorBackgroundForm, setColorBackgroundForm] = useState(getValues('extra.colorBackgroundForm'));
    const [colorLabel, setColorLabel] = useState(getValues('extra.colorLabel'));

    const handlecolotBackgroundButtonChange: ColorChangeHandler = (e) => {
        setcolotBackgroundButton(e.hex);
        setValue('extra.colotBackgroundButton', e.hex);
    }

    const handleColorLabelChange: ColorChangeHandler = (e) => {
        setColorLabel(e.hex);
        setValue('extra.colorLabel', e.hex);
    }
    const handleColorBackgroundFormChange: ColorChangeHandler = (e) => {
        setColorBackgroundForm(e.hex);
        setValue('extra.colorBackgroundForm', e.hex);
    }
    const handleColorButtonLabelChange: ColorChangeHandler = (e) => {
        setcolorButtonLabel(e.hex);
        setValue('extra.colorButtonLabel', e.hex);
    }


    return (
        <Grid container direction="row">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.buttonColor} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={colotBackgroundButton} onChange={handlecolotBackgroundButtonChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.buttonTextColor} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={colorButtonLabel} onChange={handleColorButtonLabelChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>            
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.labelcolor} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={colorLabel} onChange={handleColorLabelChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.formbackgroundcolor} />
                                </label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={colorBackgroundForm} onChange={handleColorBackgroundFormChange} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">
                    {t(langKeys.inputstyles)}
                </Box>
                <TextField
                    variant="outlined"
                    multiline
                    minRows={5}
                    maxRows={10}
                    fullWidth
                    defaultValue={getValues('extra.stylesCSSInput')}
                    onChange={e => setValue('extra.stylesCSSInput', e.target.value)}
                />
            </Grid>
            <div style={{ height: 20 }} />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">
                    {t(langKeys.buttonstyles)}
                </Box>
                <TextField
                    variant="outlined"
                    multiline
                    minRows={5}
                    maxRows={10}
                    fullWidth
                    defaultValue={getValues('extra.stylesCSSButton')}
                    onChange={e => setValue('extra.stylesCSSButton', e.target.value)}
                />
            </Grid>
        </Grid>
    );
}

const useTemplateStyles = makeStyles(theme => ({
    root: {
        border: `${theme.palette.primary.main} 1px solid`,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
        margin: theme.spacing(1),
    },
    title: {
        fontWeight: 700,
        fontSize: 20,
        color: theme.palette.primary.main,
        margin: '0 0 12 0',
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    fieldContainer: {
        margin: theme.spacing(1),
    },
    headertitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    closeBtn: {
        border: `${theme.palette.primary.main} 1px solid`,
    },
}));

interface NameTemplateProps {
    onClose: () => void;
    form: UseFormReturn<IFormWebAdd>;
    title: React.ReactNode;
    data: IChatWebAddFormField;
    index: number;
}

const NameTemplate: FC<NameTemplateProps> = ({ data, onClose, title, form, index }) => {
    const { setValue, register, formState: { errors } } = form;
    const classes = useTemplateStyles();
    const { t } = useTranslation();
    const [required, setRequired] = useState(data.required);

    const handleRequired = (checked: boolean) => {
        setRequired(checked);
        data.required = checked;
    }

    return (
        <div className={classes.root}>
            <div className={classes.headertitle}>
                <label className={clsx(classes.title, classes.fieldContainer)}>
                    {title}
                </label>
                <IconButton color="primary" onClick={onClose} className={classes.closeBtn}>
                    <Close color="primary" className="fa fa-plus-circle" />
                </IconButton>
            </div>
            <div style={{ height: 18 }} />
            <Grid container direction="column">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                            <Grid container direction="column">
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row" style={{ minHeight: 40 }}>
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>
                                                    <Trans i18nKey={langKeys.required} />
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <IOSSwitch checked={required} onChange={(_, v) => { handleRequired(v); form.setValue(`form.${index}.required`, v) }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row">
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>
                                                    <Trans i18nKey={langKeys.label} />
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <TextField
                                                    {...register(`form.${index}.label`, {
                                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                        })
                                                    }
                                                    placeholder={t(langKeys.label)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onChange={e => {
                                                        setValue(`form.${index}.label`, e.target.value)
                                                        data.label = e.target.value
                                                    }}
                                                    defaultValue={data.label}
                                                    error={!isEmpty(errors?.form?.[index]?.label?.message)}
                                                    helperText={errors?.form?.[index]?.label?.message}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                            <Grid container direction="column">
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row">
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>Placeholder</label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <TextField
                                                    placeholder="Placeholder"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onChange={e => {
                                                        form.setValue(`form.${index}.placeholder`, e.target.value)
                                                        data.placeholder = e.target.value
                                                    }}
                                                    defaultValue={data.placeholder}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row">
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>
                                                    <Trans i18nKey={langKeys.errorText} />
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <TextField
                                                    placeholder={t(langKeys.errorText)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onChange={e => {
                                                        form.setValue(`form.${index}.validationtext`, e.target.value)
                                                        data.validationtext = e.target.value
                                                    }}
                                                    defaultValue={data.validationtext}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider style={{ margin: '22px 0' }} />
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Box m={1}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={2}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.inputValidation} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={10}>
                                <TextField
                                    placeholder={t(langKeys.inputValidation)}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={e => {
                                        form.setValue(`form.${index}.inputvalidation`, e.target.value)
                                        data.inputvalidation = e.target.value
                                    }}
                                    defaultValue={data.inputvalidation}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Box m={1}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={2}>
                                <label className={classes.text}>
                                    <Trans i18nKey={langKeys.validationOnKeychange} />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={10}>
                                <TextField
                                    placeholder={t(langKeys.validationOnKeychange)}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={e => {
                                        form.setValue(`form.${index}.keyvalidation`, e.target.value)
                                        data.keyvalidation = e.target.value
                                    }}
                                    defaultValue={data.keyvalidation}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

const useTabFormStyles = makeStyles(theme => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
}));

const FIRSTNAME_FIELD = "FIRSTNAME_FIELD";
const LASTNAME_FIELD = "LASTNAME_FIELD";
const PHONE_FIELD = "PHONE_FIELD";
const EMAIL_FIELD = "EMAIL_FIELD";
const DOCUMENT_FIELD = "DOCUMENT_FIELD";
const BUSINESSNAME_FIELD = "BUSINESSNAME_FIELD";
const SUPPLYNUMBER_FIELD = "SUPPLYNUMBER_FIELD";
const CONTACT = "CONTACT_FIELD";
const OTHER = "OTHER_FIELD";

const templates: { [x: string]: FieldTemplate } = {
    [FIRSTNAME_FIELD]: {
        text: <Trans i18nKey={langKeys.name} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(FIRSTNAME_FIELD)}
                    key={FIRSTNAME_FIELD}
                    title={<Trans i18nKey={langKeys.name} />}
                />
            );
        },
        data: {
            field: "FIRSTNAME",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [LASTNAME_FIELD]: {
        text: <Trans i18nKey={langKeys.lastname} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(LASTNAME_FIELD)}
                    key={LASTNAME_FIELD}
                    title={<Trans i18nKey={langKeys.lastname} />}
                />
            );
        },
        data: {
            field: "LASTNAME",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [PHONE_FIELD]: {
        text: <Trans i18nKey={langKeys.phone} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(PHONE_FIELD)}
                    key={PHONE_FIELD}
                    title={<Trans i18nKey={langKeys.phone} />}
                />
            );
        },
        data: {
            field: "PHONE",
            type: "phone",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [EMAIL_FIELD]: {
        text: <Trans i18nKey={langKeys.email} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(EMAIL_FIELD)}
                    key={EMAIL_FIELD}
                    title={<Trans i18nKey={langKeys.email} />}
                />
            );
        },
        data: {
            field: "EMAIL",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [DOCUMENT_FIELD]: {
        text: <Trans i18nKey={langKeys.document} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(DOCUMENT_FIELD)}
                    key={DOCUMENT_FIELD}
                    title={<Trans i18nKey={langKeys.document} />}
                />
            );
        },
        data: {
            field: "DOCUMENT",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [BUSINESSNAME_FIELD]: {
        text: <Trans i18nKey={langKeys.companybusinessname} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(BUSINESSNAME_FIELD)}
                    key={BUSINESSNAME_FIELD}
                    title={<Trans i18nKey={langKeys.companybusinessname} />}
                />
            );
        },
        data: {
            field: "BUSINESS",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [SUPPLYNUMBER_FIELD]: {
        text: <Trans i18nKey={langKeys.supplynumber} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(SUPPLYNUMBER_FIELD)}
                    key={SUPPLYNUMBER_FIELD}
                    title={<Trans i18nKey={langKeys.supplynumber} />}
                />
            );
        },
        data: {
            field: "SUPPLYNUMBER",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [CONTACT]: {
        text: <Trans i18nKey={langKeys.contact} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(CONTACT)}
                    key={CONTACT}
                    title={<Trans i18nKey={langKeys.contact} />}
                />
            );
        },
        data: {
            field: "CONTACT",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
    [OTHER]: {
        text: <Trans i18nKey={langKeys.posthistory_other} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(OTHER)}
                    key={OTHER}
                    title={<Trans i18nKey={langKeys.posthistory_other} />}
                />
            );
        },
        data: {
            field: "OTHER",
            type: "text",
            required: true,
            label: "",
            placeholder: "",
            validationtext: "",
            inputvalidation: "",
            keyvalidation: "",
        },
    },
};

const TabPanelForm: FC<{ form: UseFormReturn<IFormWebAdd> }> = ({ form }) => {
    const classes = useTabFormStyles();
    const defFields = useRef<FieldTemplate[]>((form.getValues('form') || []).map(x => {
        return {
            ...templates[`${x.field}_FIELD`],
            data: x,
        } as FieldTemplate;
    }));
    
    const [fieldTemplate, setFieldTemplate] = useState<string>("");
    const [fields, setFields] = useState<FieldTemplate[]>(defFields.current);

    useEffect(() => {
        form.setValue('form', fields.map(x => x.data));
    }, [fields, form]);

    const handleCloseTemplate = (key: string) => {
        const newFields = fields.filter(e => e.data.field !== templates[key].data.field)
        setFields(newFields);
    };

    const handleAddTemplate = () => {
        if (fieldTemplate === "") return;

        setFields([...fields, templates[fieldTemplate]]);
        setFieldTemplate("");
    }

    const getMenuTemplates = () => {
        const temp: React.ReactNode[] = [];
        for (const key in templates) {
            if (fields.includes(templates[key])) continue;
            temp.push(<MenuItem key={key} value={key}>{templates[key].text}</MenuItem>);
        }
        return temp;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container direction="column">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'block' }}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Typography className={classes.text}>
                                <Trans i18nKey={langKeys.selectField} />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <FormControl style={{ width: 160, marginRight: 20 }}>
                                <Select
                                    variant="outlined"
                                    value={fieldTemplate}
                                    onChange={e => setFieldTemplate(e.target.value as string)}
                                    displayEmpty
                                    style={{ height: 40 }}
                                >
                                    <MenuItem value={""}>
                                        <em><Trans i18nKey={langKeys.select} /> -</em>
                                    </MenuItem>
                                    {getMenuTemplates()}
                                </Select>
                            </FormControl>
                            <Button
                                disabled={fieldTemplate === ""}
                                variant="contained"
                                color="primary"
                                style={{ height: 40, minHeight: 40 }}
                                onClick={handleAddTemplate}
                            >
                                <Trans i18nKey={langKeys.add} /> +
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {fields.map((e, i) => e.node(handleCloseTemplate, e.data, form, i))}
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        width: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontWeight: 500,
        fontSize: 32,
        margin: '20px 0',
        color: theme.palette.primary.main,
    },
    subtitle: {
        margin: '8px 0',
        fontSize: 20,
        fontWeight: 500,
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#A59F9F',
    },
    scriptPreview: {
        width: 'inherit',
        height: 111,
        minHeight: 111,
        backgroundColor: 'white',
        border: '#A59F9F 1px solid',
        margin: '24px 0',
        padding: theme.spacing(2),
        position: 'relative',
        overflowWrap: 'break-word',
        overflow: 'hidden',
    },
    scriptPreviewGradient: {
        backgroundImage: 'linear-gradient(transparent, white)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    scriptPreviewCopyBtn: {
        height: 45,
        width: 123,
        minHeight: 45,
        minWidth: 123,
        top: '50%',
        transform: 'translateY(-50%)',
        right: theme.spacing(2),
        position: 'absolute',
        alignSelf: 'center',
    },
    scriptPreviewFullViewTxt: {
        margin: 0,
        position: 'absolute',
        bottom: theme.spacing(1),
        left: '50%',
        transform: 'translateX(-50%)',
        height: 24,

        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',

        '&:hover': {
            cursor: 'pointer',
        }
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        // width: 130,
        height: 45,
        maxWidth: 'unset',
        border: '#A59F9F 1px solid',
        borderRadius: 6,
        backgroundColor: 'white',
        flexGrow: 1,
    },
    activetab: {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
    }
}));

export const ChannelAddWebForm: FC<{ edit: boolean }> = ({ edit }) => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndes] = useState('0');
    const [showFinalStep, setShowFinalStep] = useState(false);

    const insertChannel = useSelector(state => state.channel.insertChannel);
    const editChannel = useSelector(state => state.channel.editChannel);

    const channel = location.state as IChannel | null;

    const service = useRef<IFormWebAdd | null>(null);

    if (channel && !service.current && channel.servicecredentials.length > 0) {
        service.current = JSON.parse(channel.servicecredentials);
    }

    useEffect(() => {
        if (edit && !channel) {
            history.push(paths.CHANNELS);
        } else if (edit && channel && channel.servicecredentials.length === 0) {
            history.push(paths.CHANNELS);
        }

        return () => {
            dispatch(resetInsertChannel());
            dispatch(resetEditChannel());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, dispatch]);

    useEffect(() => {
        if (insertChannel.loading) return;
        if (insertChannel.error === true) {
            dispatch(showSnackbar({
                message: insertChannel.message!,
                show: true,
                severity: "error"
            }));
        } else if (insertChannel.value) {
            dispatch(showSnackbar({
                message: t(langKeys.channelcreatesuccess),
                show: true,
                severity: "success"
            }));
        }
    }, [dispatch, insertChannel, t]);

    useEffect(() => {
        if (editChannel.loading) return;
        if (editChannel.error === true) {
            dispatch(showSnackbar({
                message: editChannel.message!,
                show: true,
                severity: "error"
            }));
        } else if (editChannel.success) {
            dispatch(showSnackbar({
                message: t(langKeys.channeleditsuccess),
                show: true,
                severity: "success"
            }));
            history.push(paths.CHANNELS);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, editChannel]);

    const form: UseFormReturn<IFormWebAdd> = useForm<IFormWebAdd>({
        defaultValues: service.current || {
            interface: {
                chattitle: "",
                chatsubtitle: "",
                iconbutton: null,
                iconheader: null,
                iconbot: null,
            },
            color: {
                header: "#fff",
                background: "#F9F9FA",
                border: "#EBEAED",
                client: "#fff",
                bot: "#aa53e0",
            },
            form: [],
            bubble: {
                active: true,
                messagebubble: "",
                iconbubble: null,
            },
            extra: {
                uploadfile: true,
                uploadaudio: true,
                uploadimage: true,
                uploadlocation: true,
                uploadvideo: true,
                reloadchat: true,
                poweredby: true,

                persistentinput: true,
                abandonevent: true,
                alertsound: true,
                formhistory: true,
                enablemetadata: true,

                customcss: "",
                customjs: "",

                botnameenabled: true,
                botnametext: "",

                recaptcha: false,
                titleform: "",
                footerform: "",
                textButtonSend: "",
                urlThanks: "",
                colotBackgroundButton: "#E1E1E1",
                colorButtonLabel: "#000",
                colorLabel: "#000",
                colorBackgroundForm: "#000",
                stylesCSSInput: "display: block, margin: 10px",
                stylesCSSButton: "display: block, margin: 10px",
            },
        }
    });

    useEffect(() => {
        const mandatoryStrField = (value: string) => {
            return value.length === 0 ? t(langKeys.field_required) : undefined;
        }

        form.register('extra.titleform', { validate: mandatoryStrField });
        form.register('extra.textButtonSend', { validate: mandatoryStrField });
        form.register('extra.urlThanks', { validate: mandatoryStrField });
    }, [form, t]);

    const handleNext = () => {
        if(!!form.getValues("form").length){
            form.handleSubmit((_) => setShowFinalStep(true))();
        }else{
            dispatch(showSnackbar({
                message: t(langKeys.emptyformerror),
                show: true,
                severity: "warning"
            }));
        }
    }

    const handleSubmit = (name: string, auto: boolean) => {
        const values = form.getValues();
        if (!channel) {
            const body = getInsertChatwebChannel(name, auto, "", values, "FORM");
            dispatch(insertChannel2(body));
        } else {
            const id = channel.communicationchannelid;
            const body = getEditChatWebChannel(id, channel, values, name, auto, "", "FORM");
            dispatch(getEditChannel(body, "CHAZ"));
        }

    }

    const handleGoBack: React.MouseEventHandler = (e) => {
        e.preventDefault();
        if (!insertChannel.value?.integrationid) history.push(paths.CHANNELS);
    }

    if (edit && !channel) {
        return <div />;
    }

    return (
        <div className={classes.root}>
            <div style={{ display: showFinalStep ? 'none' : 'flex', flexDirection: 'column' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>
                <h2 className={classes.title}>
                    <Trans i18nKey={langKeys.activeLaraigoOnYourWebsite} />
                </h2>
                <div style={{ height: 20 }} />
                <AppBar position="static" elevation={0}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_, i: string) => setTabIndes(i)}
                        className={classes.tabs}
                        TabIndicatorProps={{ style: { display: 'none' } }}
                    >
                        <Tab className={clsx(classes.tab, tabIndex === "0" && classes.activetab)} label={<Trans i18nKey={langKeys.interface} />} value="0" />
                        <Tab className={clsx(classes.tab, tabIndex === "1" && classes.activetab)} label={<Trans i18nKey={langKeys.styles} count={2} />} value="1" />
                        <Tab className={clsx(classes.tab, tabIndex === "2" && classes.activetab)} label={<Trans i18nKey={langKeys.form} />} value="2" />
                    </Tabs>
                </AppBar>
                <TabPanel value="0" index={tabIndex}><TabPanelInterface form={form} /></TabPanel>
                <TabPanel value="1" index={tabIndex}><TabPanelStyles form={form} /></TabPanel>
                <TabPanel value="2" index={tabIndex}><TabPanelForm form={form} /></TabPanel>
                <div style={{ height: 20 }} />
                <Button variant="contained" color="primary" onClick={handleNext}>
                    <Trans i18nKey={langKeys.next} />
                </Button>
            </div>
            <div style={{ display: showFinalStep ? 'block' : 'none' }}>
                <ChannelAddEnd
                    loading={insertChannel.loading || editChannel.loading}
                    integrationId={insertChannel.value?.integrationid}
                    onSubmit={handleSubmit}
                    onClose={() => setShowFinalStep(false)}
                    channel={channel}
                />
            </div>
        </div>
    );
};

const useFinalStepStyles = makeStyles(theme => ({
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "2em",
        color: "#7721ad",
        padding: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "800px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

interface ChannelAddEndProps {
    loading: boolean;
    integrationId?: string;
    onSubmit: (name: string, auto: boolean) => void;
    onClose?: () => void;
    channel: IChannel | null;
}

const ChannelAddEnd: FC<ChannelAddEndProps> = ({ onClose, onSubmit, loading, integrationId, channel }) => {
    const classes = useFinalStepStyles();
    const { t } = useTranslation();
    const history = useHistory();
    const [name, setName] = useState(channel?.communicationchanneldesc || "");
    const [auto] = useState(true);

    const handleGoBack = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!integrationId) onClose?.();
    }

    const handleSave = () => {
        onSubmit(name, auto);
    }
    const downloadHTML = () => {
        /*var fs = require('fs');
        var htmlContent = `<script src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/test-FormWebClient.min.js" integrationid="${integrationId}" containerid="*reemplazar"></script>`;
        fs.writeFile(`/${name}.html`, htmlContent);
        window.open(fs)*/
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            <div>
                <div className={classes.title}>
                    <Trans i18nKey={langKeys.commchannelfinishreg} />
                </div>
                <div className="row-zyx">
                    <div className="col-3"></div>
                    <FieldEdit
                        onChange={(value) => setName(value)}
                        label={t(langKeys.givechannelname)}
                        className="col-6"
                        disabled={loading || integrationId != null}
                        valueDefault={channel?.communicationchanneldesc}
                    />
                </div>
                <div style={{ paddingLeft: "80%" }}>
                    <Button
                        onClick={handleSave}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={loading || integrationId != null}
                    >
                        <Trans i18nKey={langKeys.finishreg} />
                    </Button>
                </div>
            </div>
            <div style={{ display: integrationId ? 'flex' : 'none', height: 10 }} />
            <div style={{ display: integrationId ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}>
                {t(langKeys.webformstep)}
            </div>
            <div style={{ display: integrationId ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}><pre style={{ background: '#f4f4f4', border: '1px solid #ddd', color: '#666', pageBreakInside: 'avoid', fontFamily: 'monospace', lineHeight: 1.6, maxWidth: '100%', overflow: 'auto', padding: '1em 1.5em', display: 'block', wordWrap: 'break-word' }}><code>
                {`<script src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/test-FormWebClient.min.js" integrationid="${integrationId}" containerid="*reemplazar"></script>`}
            </code></pre><div style={{ height: 20 }} />
            <div style={{ display: integrationId ? 'flex' : 'none', flexDirection: 'column', marginBottom: 20 }}>
                *{t(langKeys.containeridExplained)}
            </div>
            <div style={{width:"100%", gap:"8px",display:"flex"}}>
                <Button variant="contained" style={{width:"50%"}} color="primary" onClick={downloadHTML}>
                    {t(langKeys.downloadhtmlform)}
                </Button>
                <Button variant="contained" style={{width:"50%"}} color="primary" onClick={() => history.push(paths.CHANNELS)}>
                    {t(langKeys.close)}
                </Button>
            </div>
            </div>
        </div>
    );
}


export default ChannelAddWebForm