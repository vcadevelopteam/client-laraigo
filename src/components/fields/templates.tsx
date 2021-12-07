import React, { FC, useEffect, useState } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Dictionary } from '@types';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IOSSwitch from './IOSSwitch';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tab, { TabProps } from '@material-ui/core/Tab';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FormControlLabel, FormHelperText, OutlinedInputProps, Radio, RadioGroup, RadioGroupProps, useTheme, TypographyVariant } from '@material-ui/core';
import { Divider, Grid, ListItem, ListItemText, styled } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { EmojiICon, GifIcon } from 'icons';
import { Picker } from 'emoji-mart'
import { SearchField } from 'components';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import {
    WebMessengerIcon,
    ZyxmeMessengerIcon,
    AndroidIcon,
    AppleIcon,
    FacebookMessengerIcon,
    FacebookWallIcon,
    InstagramIcon,
    LineIcon,
    SmsIcon,
    TwitterIcon,
    YoutubeIcon,
    WhatsappIcon,
    EmailIcon,
    TelegramIcon
} from 'icons';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import MuiPhoneNumber, { MaterialUiPhoneNumberProps } from 'material-ui-phone-number';

interface TemplateIconsProps {
    viewFunction?: (param: any) => void;
    deleteFunction?: (param: any) => void;
    editFunction?: (param: any) => void;
    extraOption?: string;
}

export const TemplateIcons: React.FC<TemplateIconsProps> = ({ extraOption, viewFunction, deleteFunction, editFunction }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);

    return (
        <div style={{ whiteSpace: 'nowrap', display: 'flex' }}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={editFunction}
            >
                <VisibilityIcon style={{ color: '#B6B4BA' }} />
            </IconButton>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                style={{ display: deleteFunction ? 'block' : 'none' }}
            >
                <MoreVertIcon style={{ color: '#B6B4BA' }} />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                    deleteFunction && deleteFunction(e)
                }}><Trans i18nKey={langKeys.delete} /></MenuItem>
                {extraOption && 
                    <MenuItem onClick={(e) => {
                        setAnchorEl(null)
                        viewFunction && viewFunction(e)
                        }}>{extraOption}</MenuItem>
                }
            </Menu>
        </div>
    )
}

interface TemplateBreadcrumbsProps {
    breadcrumbs: Array<{ id: string, name: string }>;
    handleClick?: (id: string) => void;
}

export const TemplateBreadcrumbs: React.FC<TemplateBreadcrumbsProps> = ({ breadcrumbs, handleClick }) => {

    const handleClickBreadcrumb = (event: any, id: string) => {
        event.preventDefault();
        handleClick?.(id)
    }

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((x, i) => (breadcrumbs.length - 1 === i) ?
                <Typography key={x.id} color="textPrimary">{x.name}</Typography>
                :
                <Link color="textSecondary" key={x.id} href="/" onClick={e => handleClickBreadcrumb(e, x.id)}>
                    {x.name}
                </Link>
            )}
        </Breadcrumbs>
    );
}

interface TitleDetailProps {
    title: React.ReactNode;
    variant?: TypographyVariant;
}

export const TitleDetail: React.FC<TitleDetailProps> = ({ title, variant }) => (
    <Typography variant={variant} style={{ fontSize: 32 }} color="textPrimary">{title}</Typography>
)

export const Title: React.FC = ({ children }) => {
    const theme = useTheme();
    const style: React.CSSProperties = {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    };
    return <label style={style}>{children}</label>;
}

export const FieldView: React.FC<{ label: string, value?: string, className?: any }> = ({ label, value, className }) => (
    <div className={className}>
        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
        <Box lineHeight="20px" fontSize={15} color="textPrimary">{value || ""}</Box>
    </div>
)

interface TemplateDialogProps {
    open: boolean;
    buttonText2?: string;
    buttonText1?: string;
    buttonText3?: string;
    handleClickButton2?: (param: any) => void;
    handleClickButton1?: (param: any) => void;
    handleClickButton3?: (param: any) => void;
    title: string;
    button2Type?: "button" | "submit" | "reset";
    button1Type?: "button" | "submit" | "reset";
    button3Type?: "button" | "submit" | "reset";
    maxWidth?: false | "sm" | "xs" | "md" | "lg" | "xl" | undefined;
}

export const DialogZyx: React.FC<TemplateDialogProps> = ({ children, open, buttonText1, buttonText2, handleClickButton2, handleClickButton1, title, maxWidth = "sm", button2Type = "button", button1Type = "button" }) => (
    <Dialog
        open={open}
        fullWidth
        maxWidth={maxWidth}
        style={{ zIndex: 1300 }}>
        <form onSubmit={(button1Type === "submit" ? handleClickButton1 : (button2Type === "submit" ? handleClickButton2 : () => { }))}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {!!buttonText1 &&
                    <Button type={button1Type} onClick={(button1Type !== "submit" ? handleClickButton1 : () => { })}
                    >
                        {buttonText1}
                    </Button>}
                {!!buttonText2 &&
                    <Button type={button2Type} onClick={(button2Type !== "submit" ? handleClickButton2 : () => { })} color="primary">
                        {buttonText2}
                    </Button>}
            </DialogActions>
        </form>
    </Dialog >
)

export const DialogZyx3Opt: React.FC<TemplateDialogProps> = ({ children, open, buttonText1, buttonText2, buttonText3, handleClickButton1, handleClickButton2, handleClickButton3, title, maxWidth = "sm", button1Type = "button", button2Type = "button", button3Type = "button" }) => (
    <Dialog
        open={open}
        fullWidth
        maxWidth={maxWidth}
        style={{ zIndex: 1300 }}>
        <form onSubmit={(button1Type === "submit" ? handleClickButton1 : (button2Type === "submit" ? handleClickButton2 : () => { }))}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {!!buttonText1 &&
                    <Button type={button1Type} onClick={(button1Type !== "submit" ? handleClickButton1 : () => { })}
                    >
                        {buttonText1}
                    </Button>}
                {!!buttonText2 &&
                    <Button type={button2Type} onClick={(button2Type !== "submit" ? handleClickButton2 : () => { })} color="primary">
                        {buttonText2}
                    </Button>}
                {!!buttonText3 &&
                    <Button type={button3Type} onClick={(button3Type !== "submit" ? handleClickButton3 : () => { })} color="primary">
                        {buttonText3}
                    </Button>}
            </DialogActions>
        </form>
    </Dialog >
)

export const DialogZyxDiv: React.FC<TemplateDialogProps> = ({ children, open, buttonText1, buttonText2, handleClickButton2, handleClickButton1, title, maxWidth = "sm", button2Type = "button", button1Type = "button" }) => (
    <Dialog
        open={open}
        fullWidth
        maxWidth={maxWidth}
        style={{ zIndex: 1300 }}>
        <div onSubmit={(button1Type === "submit" ? handleClickButton1 : (button2Type === "submit" ? handleClickButton2 : () => { }))}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {!!buttonText1 &&
                    <Button type={button1Type} onClick={(button1Type !== "submit" ? handleClickButton1 : () => { })}
                    >
                        {buttonText1}
                    </Button>}
                {!!buttonText2 &&
                    <Button type={button2Type} onClick={(button2Type !== "submit" ? handleClickButton2 : () => { })} color="primary">
                        {buttonText2}
                    </Button>}
            </DialogActions>
        </div>
    </Dialog >
)

interface InputProps {
    label?: string;
    className?: any;
    valueDefault?: any;
    disabled?: boolean;
    onChange?: (param: any, param2?: any | null) => void;
    onBlur?: (param: any, param2?: any | null) => void;
    style?: any;
    error?: string;
    type?: string;
    rows?: number;
    maxLength?: number;
    fregister?: Dictionary;
    uset?: boolean;
    prefixTranslation?: string;
    variant?: "standard" | "outlined" | "filled" | undefined;
    inputProps?: any;
    InputProps?: Partial<OutlinedInputProps>;
    size?: "small" | "medium" | undefined;
}

interface TemplateAutocompleteProps extends InputProps {
    data: Dictionary[],
    optionValue: string;
    optionDesc: string;
    loading?: boolean;
    triggerOnChangeOnFirst?: boolean;
    readOnly?: boolean;
}

export const FieldEdit: React.FC<InputProps> = ({ label, size, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 1, fregister = {}, inputProps = {}, InputProps = {}, variant = "standard" }) => {
    const [value, setvalue] = useState("");

    useEffect(() => {
        setvalue(valueDefault);
    }, [valueDefault])

    return (
        <div className={className}>
            {variant === "standard" &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            }
            <TextField
                {...fregister}
                color="primary"
                fullWidth
                label={variant !== "standard" && label}
                disabled={disabled}
                type={type}
                value={value}
                variant={variant}
                error={!!error}
                helperText={error || null}
                rows={rows}
                size={size}
                onChange={(e) => {
                    setvalue(e.target.value);
                    onChange && onChange(e.target.value);
                }}
                onBlur={(e) => {
                    onBlur && onBlur(e.target.value);
                }}
                InputProps={InputProps}
            />
        </div>
    )
}
export const FieldEditMulti: React.FC<InputProps> = ({ label, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 4, maxLength = 0, fregister = {}, inputProps = {} }) => {
    const [value, setvalue] = useState("");

    useEffect(() => {
        setvalue(valueDefault);
    }, [valueDefault])

    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <TextField
                {...fregister}
                color="primary"
                fullWidth
                disabled={disabled}
                type={type}
                error={!!error}
                value={value}
                multiline
                minRows={rows}
                helperText={error || null}
                onChange={(e) => {
                    if (maxLength === 0 || e.target.value.length <= maxLength) {
                        setvalue(e.target.value);
                        onChange && onChange(e.target.value);
                    }
                }}
                onBlur={(e) => {
                    onBlur && onBlur(e.target.value);
                }}
                inputProps={inputProps}
            />
            {maxLength !== 0 && <FormHelperText style={{ textAlign: 'right' }}>{maxLength - value.length}/{maxLength}</FormHelperText>}
        </div>
    )
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
    channelType: string
}

export const GetIcon: React.FC<IconProps> = ({ channelType, width = 15, height = 15, color = "#7721AD" }) => {

    if (channelType === "WHAT") return <WhatsappIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WHAD") return <WhatsappIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WHAP") return <WhatsappIcon color={color} width={width} fill={color} stroke={color} height={height} />
    if (channelType === "WHAC") return <WhatsappIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBMS") return <FacebookMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBDM") return <FacebookMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBWA") return <FacebookWallIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WEBM") return <WebMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TELE") return <TelegramIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "INST") return <InstagramIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "INMS") return <InstagramIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "INDM") return <InstagramIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "ANDR") return <AndroidIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "APPL") return <AppleIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "CHATZ") return <ZyxmeMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "CHAZ") return <ZyxmeMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "MAIL") return <EmailIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "YOUT") return <YoutubeIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "LINE") return <LineIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "SMS") return <SmsIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "SMSI") return <SmsIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TWIT") return <TwitterIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TWMS") return <TwitterIcon width={width} fill={color} stroke={color} height={height} color={color} />

    return <TelegramIcon style={{ color, width, height }} />
}

export const FieldSelect: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, className = null, style = null, triggerOnChangeOnFirst = false, loading = false, fregister = {}, uset = false, prefixTranslation = "", variant = "standard", readOnly = false }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState<Dictionary | null>(null);

    useEffect(() => {
        if (valueDefault && data.length > 0) {
            const optionfound = data.find((o: Dictionary) => o[optionValue] === valueDefault);
            if (optionfound) {
                setValue(optionfound);
                if (triggerOnChangeOnFirst)
                    onChange && onChange(optionfound);
            }
        } else {
            setValue(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <div className={className}>
            {variant === "standard" &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            }
            <Autocomplete
                filterSelectedOptions
                style={style}
                fullWidth
                disabled={disabled}
                value={data?.length > 0 ? value : null}
                onChange={(_, newValue) => {
                    if (readOnly) return;
                    setValue(newValue);
                    onChange && onChange(newValue);
                }}
                getOptionLabel={option => option ? (uset ? t(prefixTranslation + option[optionDesc]?.toLowerCase()).toUpperCase() : (option[optionDesc] || '')) : ''}
                options={data}
                loading={loading}
                size="small"
                renderInput={(params) => (
                    <TextField
                        {...fregister}
                        {...params}
                        label={variant !== "standard" && label}
                        variant={variant}
                        helperText={error || null}
                        error={!!error}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                            readOnly,
                        }}
                    />
                )}
            />
        </div>
    )
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FieldMultiSelect: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, loading, className = null, style = null, variant = "standard" }) => {

    const [optionsSelected, setOptionsSelected] = useState<Dictionary[]>([]);

    useEffect(() => {
        if (valueDefault && data.length > 0) {
            const optionsSelected = data.filter(o => valueDefault.split(",").indexOf(o[optionValue].toString()) > -1)
            setOptionsSelected(optionsSelected);
        } else {
            setOptionsSelected([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueDefault, data]);

    return (
        <div className={className}>
            {variant === "standard" &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            }
            <Autocomplete
                multiple
                filterSelectedOptions
                style={style}
                disabled={disabled}
                loading={loading}
                value={optionsSelected}
                renderOption={(item, { selected }: any) => (
                    <React.Fragment>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {item[optionDesc]}
                    </React.Fragment>
                )}
                onChange={(_, values, action, option) => {
                    setOptionsSelected(values);
                    onChange && onChange(values, { action, option });
                }}
                size="small"
                getOptionLabel={option => option ? option[optionDesc] : ''}
                options={data}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={variant !== "standard" && label}
                        variant={variant}
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                        error={!!error}
                        helperText={error || null}

                    />
                )}
            />
        </div>
    )
}

export const FieldMultiSelectFreeSolo: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, loading, className = null, style = null, variant = "standard", readOnly = false }) => {

    const [optionsSelected, setOptionsSelected] = useState<any[]>([]);

    useEffect(() => {
        if (valueDefault && data.length > 0) {
            const optionsSelected = data.filter(o => valueDefault.split(",").indexOf(o[optionValue].toString()) > -1)
            setOptionsSelected(optionsSelected);
        } else {
            setOptionsSelected([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueDefault, data]);

    return (
        <div className={className}>
            {variant === "standard" &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            }
            <Autocomplete
                multiple
                freeSolo
                filterSelectedOptions
                style={style}
                disabled={disabled}
                loading={loading}
                value={optionsSelected}
                renderOption={(item, { selected }: any) => (
                    <React.Fragment>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            readOnly={readOnly}
                        />
                        {item[optionDesc]}
                    </React.Fragment>
                )}
                onChange={(_, values, action, option) => {
                    if (readOnly) return;
                    setOptionsSelected(values);
                    onChange && onChange(values, { action, option });
                }}
                size="small"
                getOptionLabel={option => String(option ? option[optionDesc] || option : '')}
                options={data}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={variant !== "standard" && label}
                        variant={variant}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                            readOnly,
                        }}
                        error={!!error}
                        helperText={error || null}

                    />
                )}
            />
        </div>
    )
}

interface TemplateSwitchProps extends InputProps {
    className?: any;
    label: string;
}

export const TemplateSwitch: React.FC<TemplateSwitchProps> = ({ className, onChange, valueDefault, label, style }) => {
    const [checkedaux, setChecked] = useState(false);

    useEffect(() => {
        setChecked(!!valueDefault)
    }, [valueDefault])

    return (
        <div className={className} style={{ ...style, paddingBottom: '3px' }}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{label}</Box>
            <IOSSwitch checked={checkedaux} onChange={(e) => {
                setChecked(e.target.checked);
                onChange && onChange(e.target.checked)
            }} />
        </div>
    );
}

const useCheckboxStyles = makeStyles({
    root: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    icon: {
        borderRadius: 3,
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(119,33,173,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: 'rgba(119, 33, 173, 0.9)',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#7721AD',
        },
    }
});

export const OnlyCheckbox: React.FC<InputProps> = ({ className, style, onChange, valueDefault, label, disabled = false }) => {
    const classes = useCheckboxStyles();
    const [checkedaux, setChecked] = useState(false);

    useEffect(() => {
        setChecked(!!valueDefault)
    }, [valueDefault])

    return (
        <Box className={className} style={style}>
            <Checkbox
                checked={checkedaux}
                checkedIcon={<span className={`${classes.icon} ${classes.checkedIcon}`} />}
                icon={<span className={classes.icon} />}
                disabled={disabled}
                onChange={(e) => {
                    setChecked(e.target.checked);
                    onChange && onChange(e.target.checked)
                }}
            />
        </Box>
    );
}

interface FieldCheckboxProps extends InputProps {
    className?: any;
    label: string;
}

export const FieldCheckbox: React.FC<FieldCheckboxProps> = ({ className, onChange, valueDefault, label, disabled = false }) => {
    const classes = useCheckboxStyles();
    const [checkedaux, setChecked] = useState(false);

    useEffect(() => {
        setChecked(!!valueDefault)
    }, [valueDefault])

    return (
        <div className={className} style={{ paddingBottom: '3px' }}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{label}</Box>
            <Checkbox
                checked={checkedaux}
                checkedIcon={<span className={`${classes.icon} ${classes.checkedIcon}`} />}
                icon={<span className={classes.icon} />}
                disabled={disabled}
                onChange={(e) => {
                    setChecked(e.target.checked);
                    onChange && onChange(e.target.checked)
                }}
            />
        </div>
    );
}

export const AntTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover': {
            color: theme.palette.primary.main,
            opacity: 1,
        },
        '&$selected': {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: theme.palette.primary.main,
        },
    },
    selected: {},
}))((props: TabProps) => <Tab disableRipple {...props} />);

interface AntTabPanelProps {
    index: number;
    currentIndex: number;
}

export const AntTabPanel: FC<AntTabPanelProps> = ({ index, currentIndex, children }) => {
    return (
        <div role="tabpanel" style={{ display: index === currentIndex ? 'block' : 'none' }}>
            {children}
        </div>
    );
}

export const ListItemSkeleton: React.FC = () => (
    <ListItem style={{ display: 'flex', paddingLeft: 0, paddingRight: 0, paddingBottom: 8 }}>
        <Box style={{ padding: 20, backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexGrow: 1, }}>
            <Grid container direction="column">
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton animation="wave" />
                    </Grid>
                </Grid>
                <Divider style={{ margin: '10px 0' }} />
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
                <Divider style={{ margin: '10px 0' }} />
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </ListItem>
)

interface EmojiPickerZyxProps {
    emojisNoShow?: string[];
    onSelect: (e: any) => void;
    style?: React.CSSProperties;
    icon?: (onClick: () => void) => React.ReactNode;
}

const emojiPickerStyle = makeStyles({
    root: {
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
});


export const EmojiPickerZyx: React.FC<EmojiPickerZyxProps> = ({ emojisNoShow, onSelect, style, icon }) => {
    const [open, setOpen] = React.useState(false);
    const classes = emojiPickerStyle();
    const handleClick = () => setOpen((prev) => !prev);
    const { t } = useTranslation();
    const handleClickAway = () => setOpen(false);

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <span style={style}>
                {icon?.(handleClick) || <Tooltip title={t(langKeys.send_emoji) + ""} arrow placement="top">
                    <EmojiICon className={classes.root} onClick={handleClick} />
                </Tooltip>}
                {open && (
                    <div style={{
                        position: 'absolute',
                        bottom: 50
                    }}>
                        <Picker
                            onSelect={onSelect}
                            sheetSize={32}
                            emojisToShowFilter={emojisNoShow && emojisNoShow.length > 0 ? (emoji: any) => emojisNoShow.indexOf(emoji.unified) === -1 : undefined}
                        />
                    </div>
                )}
            </span>
        </ClickAwayListener>
    )
}

export const GifPickerZyx: React.FC<{ onSelect?: (e: any) => void, style?: any }> = ({ onSelect, style }) => {
    const [open, setOpen] = React.useState(false);
    const classes = emojiPickerStyle();
    const handleClick = () => setOpen((prev) => !prev);
    const { t } = useTranslation()
    const handleClickAway = () => setOpen(false);
    const [listGif, setListGif] = useState([]);

    const handlerSearch = (text: string) => {
        setListGif([])
        fetch(`https://api.tenor.com/v1/search?tag=${text}&key=WL0G6J5OBD12&locale=pe_EN&media_filter=minimal&limit=30`)
            .then(response => response.json())
            .then(function (res) {
                setListGif(res.results)
            });
    }

    React.useEffect(() => {
        let isSubscribed = true;

        fetch(
            'https://api.tenor.com/v1/trending?key=WL0G6J5OBD12&locale=pe_ES&media_filter=minimal&limit=30')
            .then(response => response.json())
            .then(function (res) {
                if (isSubscribed)
                    setListGif(res.results)
            });

        return () => {
            isSubscribed = false
        }
    }, [])

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <span style={style || undefined}>
                <Tooltip title={t(langKeys.send_gif) + ""} arrow placement="top">
                    <GifIcon className={classes.root} onClick={handleClick} />
                </Tooltip>
                {open && (
                    <div style={{
                        position: 'absolute',
                        bottom: 50,
                        width: 342,
                        height: 400,
                        backgroundColor: 'white',
                        padding: 4,
                        boxShadow: '0 1px 2px 0 rgb(16 35 47 / 15%)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <SearchField
                            colorPlaceHolder='#FFF'
                            handleChangeOther={handlerSearch}
                            lazy
                        />
                        <div style={{
                            display: 'flex',
                            gap: 8,
                            marginTop: 4,
                            flexWrap: 'wrap',
                            height: '100%',
                            width: '100%',
                            overflowY: 'auto',
                        }}>
                            {listGif.map((item: any, index) => {
                                return (
                                    <img
                                        style={{ cursor: 'pointer' }}
                                        alt="gif"
                                        width={100}
                                        height={100}
                                        className="pointer"
                                        onClick={() => {
                                            onSelect && onSelect(item.media[0].tinygif.url)
                                            handleClickAway()
                                        }}
                                        src={item.media[0].tinygif.url} key={index} />
                                )
                            })}
                        </div>
                    </div>
                )}
            </span>
        </ClickAwayListener >
    )
}

interface EditWithSelectProps extends InputProps {
    primitive?: boolean;
    show: boolean;
    data: Dictionary[];
    datakey: string;
    top?: number;
    left?: number;
    onClickSelection: (e: any, value: string) => any
    onClickAway: (...param: any) => any
}

export const FieldEditWithSelect: React.FC<EditWithSelectProps> = ({ label, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 4, maxLength = 0, fregister = {},
    primitive = false, inputProps = {}, show, data, datakey, top = 0, left = 0, onClickSelection, onClickAway }) => {
    const [value, setvalue] = useState("");

    useEffect(() => {
        setvalue(valueDefault);
    }, [valueDefault])

    const renderRow = (props: ListChildComponentProps) => {
        const { index, style } = props;
        return (
            <React.Fragment>
                <ListItem
                    key={index}
                    button
                    style={{ ...style, padding: '8px' }}
                    onClick={(e) => onClickSelection(e, data[index][datakey])}
                    divider={true}
                >
                    <ListItemText primary={data[index][datakey]} />
                </ListItem>
            </React.Fragment>
        );
    }

    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <ClickAwayListener onClickAway={({ ...param }) => onClickAway({ ...param })}>
                <div style={{ position: 'relative' }}>
                    <TextField
                        {...fregister}
                        color="primary"
                        fullWidth
                        disabled={disabled}
                        type={type}
                        error={!!error}
                        value={value}
                        multiline
                        minRows={rows}
                        helperText={error || null}
                        onChange={(e) => {
                            if (maxLength === 0 || e.target.value.length <= maxLength) {
                                setvalue(e.target.value);
                                onChange && onChange(e.target.value);
                            }
                        }}
                        onBlur={(e) => {
                            onBlur && onBlur(e.target.value);
                        }}
                        inputProps={inputProps}
                    />
                    {maxLength !== 0 && <FormHelperText style={{ textAlign: 'right' }}>{maxLength - value.length}/{maxLength}</FormHelperText>}
                    {show ?
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            position: 'absolute',
                            top: top,
                            left: left,
                            borderColor: 'lightgray',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            borderRadius: '5px',
                        }}>
                            <FixedSizeList
                                className="scroll-style-go"
                                direction="vertical"
                                height={200}
                                width={280}
                                itemSize={28}
                                itemCount={data.length}
                            >
                                {renderRow}
                            </FixedSizeList>
                        </div>
                        : null}
                </div>
            </ClickAwayListener>
        </div>
    )
}

export const FieldEditArray: React.FC<InputProps> = ({ label, style = {}, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 1, fregister = {}, inputProps = {}, variant = "standard" }) => {
    return (
        <div className={className} style={style}>
            {label && <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>}
            <TextField
                {...fregister}
                color="primary"
                fullWidth
                disabled={disabled}
                type={type}
                defaultValue={valueDefault}
                variant={variant}
                error={!!error}
                helperText={error || null}
                rows={rows}
                onChange={(e) => {
                    onChange && onChange(e.target.value);
                }}
                onBlur={(e) => {
                    onBlur && onBlur(e.target.value);
                }}
                inputProps={inputProps}
            />
        </div>
    )
}

interface TemplateSwitchArrayProps extends InputProps {
    defaultValue?: boolean;
    className?: any;
    label: string;
}


export const TemplateSwitchArray: React.FC<TemplateSwitchArrayProps> = ({ className, onChange, defaultValue, label }) => {
    return (
        <div className={className} style={{ paddingBottom: '3px' }}>
            {label && <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{label}</Box>}
            <IOSSwitch defaultChecked={defaultValue} onChange={(e) => {
                onChange && onChange(e.target.checked)
            }} />
        </div>
    );
}

const sxImageBox = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    border: '1px dashed grey',
    textAlign: 'center',
}

export const FieldUploadImage: React.FC<InputProps> = ({ className, onChange, valueDefault, label }) => {
    const { t } = useTranslation();
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        setUrl(valueDefault || "");
    }, [valueDefault])


    const getUrl = (file: File | any): string => {
        if (!file) return "";
        try {
            const url = URL.createObjectURL(file);
            return url;
        } catch (ex) {
            console.error(ex);
            return "";
        }
    }

    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            {
                url === ""
                    ?
                    <Box
                        component="label"
                        sx={sxImageBox}
                        style={{ cursor: 'pointer' }}
                    >
                        <React.Fragment>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    if ((e.target.files?.length || 0) > 0) {
                                        setUrl(getUrl(e.target?.files?.item(0)));
                                        onChange && onChange(e.target?.files?.item(0));
                                    }
                                }}
                            />
                            <CameraAltIcon />
                            <span>{t(langKeys.uploadImage)}</span>
                        </React.Fragment>
                    </Box>
                    :
                    <React.Fragment>
                        <Box
                            sx={sxImageBox}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setUrl("");
                                onChange && onChange("")
                            }}
                        >
                            <DeleteIcon />
                            <span>{t(langKeys.delete)}</span>
                        </Box>
                        <Box sx={{ ...sxImageBox, borderTop: '0px' }}>
                            <img
                                src={url}
                                alt={url}
                                style={{ maxWidth: '300px' }}
                            />
                        </Box>
                    </React.Fragment>
            }
        </div>
    )
}

const CssPhonemui = styled(MuiPhoneNumber)({
    minHeight: 'unset',
    '& .MuiInput-underline:after': {
        borderBottomColor: '#7721ad',
    },
});

interface PhoneFieldEditProps extends Omit<MaterialUiPhoneNumberProps, 'error'> {
    error?: string;
}

export const PhoneFieldEdit: FC<PhoneFieldEditProps> = ({ label, error, className, ...props }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                {label}
            </Box>
            <CssPhonemui
                variant="standard"
                margin="none"
                disableAreaCodes
                error={!!error}
                helperText={error || null}
                {...props}
            />
        </div>
    );
}

interface RadioGroudFieldEditProps<T = object> extends Omit<RadioGroupProps, 'onChange'> {
    label: React.ReactNode;
    data: T[];
    optionDesc: keyof T;
    optionValue: keyof T;
    error?: string;
    readOnly?: boolean;
    disabled?: boolean;
    onChange?: (value: T) => void;
}

export function RadioGroudFieldEdit<T>({
    className,
    onChange,
    label,
    data,
    optionDesc,
    optionValue,
    error,
    readOnly = false,
    disabled = false,
    ...props
}: RadioGroudFieldEditProps<T>) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }} className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                {label}
            </Box>
            <RadioGroup {...props}>
                {data.map((e, i) => {
                    return (
                        <FormControlLabel
                            key={i}
                            value={e[optionValue]}
                            control={<Radio color="primary" />}
                            label={e[optionDesc]}
                            onChange={() => !readOnly && onChange?.(e)}
                            disabled={disabled}
                        />
                    );
                })}
            </RadioGroup>
            {error && error !== '' && <FormHelperText error>{error}</FormHelperText>}
        </div>
    );
}
