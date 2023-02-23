/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useContext, useEffect, useState } from 'react';
import { AppBar, Box, Button, makeStyles, Link, Tab, Tabs, Typography, TextField, Grid, Select, IconButton, FormControl, MenuItem, Divider, Breadcrumbs, InputAdornment, FormControlLabel, Checkbox } from '@material-ui/core';
import { FieldEdit, IOSSwitch } from 'components';
import { Trans, useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { langKeys } from 'lang/keys';
import { ChromePicker, ColorChangeHandler } from 'react-color';
import { ArrowDropDown, Close, DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@material-ui/icons';
import { useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import { IChatWebAddFormField, IFormWebAdd } from '@types';
import { useDispatch } from 'react-redux';
import { resetInsertChannel } from 'store/channel/actions';
import { useSelector } from 'hooks';
import { showSnackbar } from 'store/popus/actions';
import { getInsertChatwebChannel } from 'common/helpers';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { MainData, SubscriptionContext } from './context';

interface TabPanelProps {
    value: string;
    index: string;
}

interface FieldTemplate {
    text: React.ReactNode;
    node: (onClose: (key: string) => void, data: IChatWebAddFormField, form: UseFormReturn<IFormWebAdd>, index: number) => React.ReactNode;
    data: IChatWebAddFormField;
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
    const { setValue, getValues } = form;
    const classes = useTabInterfacetyles();
    const { t } = useTranslation();
    const [recaptcha, setrecaptcha] = useState(getValues('extra.recaptcha'));


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
                                error={!!form.formState.errors.extra?.titleform}
                                helperText={form.formState.errors.extra?.titleform?.message}
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
                                name="footer"
                                size="small"
                                defaultValue={getValues('extra.textButtonSend')}
                                onChange={(e) => setValue('extra.textButtonSend', e.target.value)}
                                error={!!form.formState.errors.extra?.textButtonSend}
                                helperText={form.formState.errors.extra?.textButtonSend?.message}
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
                                name="footer"
                                size="small"
                                defaultValue={getValues('extra.urlThanks')}
                                onChange={(e) => setValue('extra.urlThanks', e.target.value)}
                                error={!!form.formState.errors.extra?.urlThanks}
                                helperText={form.formState.errors.extra?.urlThanks?.message}
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
                                checked={recaptcha}
                                control={<Checkbox 
                                    onChange={(e) => {setrecaptcha(e.target.checked);setValue('extra.recaptcha', e.target.checked)}}
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

const useColorInputStyles = makeStyles(theme => ({
    colorInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: 60,
        height: 30,
        cursor: 'pointer',
        borderRadius: 2,
        position: 'relative',
    },
    colorInput: {
        position: 'relative',
        flexGrow: 1,
        borderRadius: '0 2px 2px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    colorInputSplash: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        borderRadius: 2,
        '&:hover': {
            backgroundColor: 'black',
            opacity: .15,
        },
    },
    colorInputPreview: {
        flexGrow: 1,
        borderRadius: 2,
    },
    popover: {
        position: 'absolute',
        zIndex: 2,
        top: 36,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
}));

const ColorInput: FC<{ hex: string, onChange: ColorChangeHandler }> = ({ hex, onChange }) => {
    const classes = useColorInputStyles();
    const [open, setOpen] = useState(false);

    const iconStyle = { style: { width: 'unset', height: 'unset' } };
    const Icon: FC = () => open ? <Close {...iconStyle} /> : <ArrowDropDown {...iconStyle} />;

    return (
        <div className={classes.colorInputContainer}>
            <div style={{ backgroundColor: hex }} className={classes.colorInputPreview} />
            <div className={classes.colorInput} onClick={() => setOpen(!open)}>
                <Icon />
                <div className={classes.colorInputSplash} />
            </div>
            {open && (
                <div className={classes.popover}>
                    <ChromePicker color={hex} onChange={onChange} />
                </div>
            )}
        </div>
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
                                                        form.setValue(`form.${index}.label`, e.target.value)
                                                        data.label = e.target.value
                                                    }}
                                                    defaultValue={data.label}
                                                    error={!!errors?.form?.[index]?.label}
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

const NAME_FIELD = "NAME_FIELD";
const LASTNAME_FIELD = "LASTNAME_FIELD";
const PHONE_FIELD = "PHONE_FIELD";
const EMAIL_FIELD = "EMAIL_FIELD";
const DOCUMENT_FIELD = "DOCUMENT_FIELD";
const BUSINESSNAME_FIELD = "BUSINESSNAME_FIELD";
const SUPPLUNUMBER_FIELD = "SUPPLUNUMBER_FIELD";
const CONTACT = "CONTACT";
const OTHER = "OTHER_FIELD";

const templates: { [x: string]: FieldTemplate } = {
    [NAME_FIELD]: {
        text: <Trans i18nKey={langKeys.name} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(NAME_FIELD)}
                    key={NAME_FIELD}
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
    [SUPPLUNUMBER_FIELD]: {
        text: <Trans i18nKey={langKeys.supplynumber} />,
        node: (onClose, data, form, index) => {
            return (
                <NameTemplate
                    form={form}
                    index={index}
                    data={data}
                    onClose={() => onClose(SUPPLUNUMBER_FIELD)}
                    key={SUPPLUNUMBER_FIELD}
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
    const [fieldTemplate, setFieldTemplate] = useState<string>("");
    const [fields, setFields] = useState<FieldTemplate[]>([]);

    useEffect(() => {
        form.setValue('form', fields.map(x => x.data));
    }, [fields]);

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
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    rootextras: {
        [theme.breakpoints.up('xs')]: {
            paddingTop: "80%",
        },
        [theme.breakpoints.up('sm')]: {
            paddingTop: "25%",
        },
        "@media (min-width: 960px)": {
            paddingTop: "70%",
        },
        "@media (min-width: 1000px)": {
            paddingTop: "40%",
        },
        [theme.breakpoints.up('lg')]: {
            paddingTop: "25%",
        },
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

export const ChannelAddWebForm: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const classes = useStyles();
    const { foreground, submitObservable, setForeground } = useContext(SubscriptionContext);
    const { getValues, register, unregister } = useFormContext<MainData>();
    const dispatch = useDispatch();
    const [hasFinished, setHasFinished] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [selectedView, setSelectedView] = useState("view1");
    const [tabIndex, setTabIndes] = useState('0');
    const { t } = useTranslation();
    const insertChannel = useSelector(state => state.channel.insertChannel);

    useEffect(() => {
        return () => {
            dispatch(resetInsertChannel());
        };
    }, [dispatch]);

    useEffect(() => {
        if (foreground !== 'webForm' && selectedView !== "view1") {
            setSelectedView("view1");
        }
    }, [foreground, selectedView]);

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
                message: "El canal se inserto con éxito",
                show: true,
                severity: "success"
            }));
        }
    }, [insertChannel]);

    const nestedForm: UseFormReturn<IFormWebAdd> = useForm<IFormWebAdd>({
        defaultValues: {
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
                stylesCSSInput: "display: block; margin: 10px",
                stylesCSSButton: "display: block; margin: 10px",
            },
        },
    });

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }

        register('channels.chatWeb.description', { validate: strRequired, value: '' });
        register('channels.chatWeb.build', {
            value: values => {
                return getInsertChatwebChannel(
                    getValues('channels.chatWeb.description'),
                    false,
                    "#7721ad",
                    nestedForm.getValues(),
                );
            }
        });

        return () => {
            unregister('channels.chatWeb');
        }
    }, [register, unregister]);

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }

        nestedForm.register('extra.titleform',{ validate: strRequired, value: '' });
        nestedForm.register('extra.textButtonSend',{ validate: strRequired, value: '' });

        const cb = async () => {
            const valid = await nestedForm.trigger();
            setSubmitError(!valid);
        }

        submitObservable.addListener(cb);
        return () => {
            submitObservable.removeListener(cb);
        }
    }, [submitObservable, nestedForm.register, nestedForm.unregister, nestedForm.trigger]);

    const setView = (option: "view1" | "view2") => {
        if (option === "view1") {
            setSelectedView(option);
            setForeground(undefined);
        } else {
            setSelectedView(option);
            setForeground('webForm');
        }
    }

    if (selectedView === "view1") {
        return (
            <ChannelAddEnd
                hasFinished={hasFinished}
                loading={insertChannel.loading}
                integrationId={insertChannel.value?.integrationid}
                onNext={() => {setView("view2")}}
                submitError={submitError}
            />
        );
    }else{
        return (
            <div className={classes.root}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        color="textSecondary"
                        key={"mainview"}
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            setView("view1");
                        }}
                    >
                        {'<< '}<Trans i18nKey={langKeys.previoustext} />
                    </Link>
                </Breadcrumbs>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                    <TabPanel value="0" index={tabIndex}><TabPanelInterface form={nestedForm} /></TabPanel>
                    <TabPanel value="1" index={tabIndex}><TabPanelStyles form={nestedForm} /></TabPanel>
                    <TabPanel value="2" index={tabIndex}><TabPanelForm form={nestedForm} /></TabPanel>
                    <div style={{ height: 20 }} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            if(!!nestedForm.getValues("form").length){
                                const valid = await nestedForm.trigger();
                                if (valid) {
                                    setView("view1");
                                    setHasFinished(true);
                                }
                            }else{
                                dispatch(showSnackbar({
                                    message: t(langKeys.emptyformerror),
                                    show: true,
                                    severity: "warning"
                                }));
                            }
                        }}
                    >
                        <Trans i18nKey={langKeys.next} />
                    </Button>
                </div>
            </div>
        );
    }

};

interface ChannelAddEndProps {
    hasFinished: boolean;
    loading: boolean;
    integrationId?: string;
    submitError: boolean;
    onNext: () => void;
}

const ChannelAddEnd: FC<ChannelAddEndProps> = ({
    hasFinished,
    submitError,
    onNext,
    loading,
    integrationId,
}) => {
    const {
        commonClasses,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const { t } = useTranslation();
    const { getValues, setValue, formState: { errors } } = useFormContext<MainData>();
    const [nextbutton2, setNextbutton2] = useState(true);

    return (
        <div className={clsx(commonClasses.root, submitError && commonClasses.rootError)}>
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.subscription_genericconnect} />
            </Typography>}
            {!hasFinished && <ListAltIcon className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => deleteChannel('chatWeb')}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {hasFinished && <ListAltIcon
                style={{ width: 100, height: 100, alignSelf: 'center', fill: 'gray' }} />
            }
            {hasFinished && (
                <div style={{ alignSelf: 'center' }}>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.5vw', fontWeight: 'bold', textAlign: 'center' }}>
                        {t(langKeys.subscription_congratulations)}
                    </Typography>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.2vw', fontWeight: 500 }}>
                        {t(langKeys.subscription_message1)} {t(langKeys.web_form)} {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            <FieldEdit
                onChange={v => { setValue('channels.chatWeb.description', v); setNextbutton2(!v); }}
                valueDefault={getValues('channels.chatWeb.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                disabled={loading || integrationId != null}
                error={errors.channels?.chatWeb?.description?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {hasFinished ? <LinkIcon color="primary" /> : <LinkOffIcon />}
                        </InputAdornment>
                    )
                }}
            />
            {!hasFinished && (
                <Button
                    onClick={onNext}
                    className={commonClasses.button}
                    variant="contained"
                    color="primary"
                    disabled={loading || integrationId != null || nextbutton2}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            )}
        </div>
    );
}
