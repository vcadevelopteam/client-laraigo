import 'emoji-mart/css/emoji-mart.css'

import { AndroidColor, AppStoreColor, BloggerColor, ChannelBlogger, ChatWebColor, EmojiICon, FacebookColor, FormColor, GifIcon, InstagramColor, IosColor, LineColor, LinkedInColor, MailColor, MessengerColor, MyBusinessColor, PlayStoreColor, SmsColor, TeamsColor, TelegramColor, TikTokColor, TwitterColor, VoiceColor, WhatsAppColor, WorkplaceColor, YouTubeColor } from 'icons';
import { ChannelAndroid, ChannelAppStore, ChannelChat01, ChannelChat02, ChannelFacebook, ChannelForm, ChannelGeneric, ChannelInstagram01, ChannelInstagram02, ChannelIos, ChannelLine, ChannelLinkedIn, ChannelMail, ChannelMessenger, ChannelMyBusiness, ChannelPhone, ChannelPlayStore, ChannelSms, ChannelTeams, ChannelTelegram, ChannelTikTok, ChannelTwitter01, ChannelTwitter02, ChannelWhatsApp01, ChannelWhatsApp02, ChannelWhatsApp03, ChannelWhatsApp04, ChannelWorkplace, ChannelYouTube } from 'icons';
import { Dictionary } from '@types';
import { FormControlLabel, FormHelperText, OutlinedInputProps, Radio, RadioGroup, RadioGroupProps, useTheme, TypographyVariant, Divider, Grid, ListItem, ListItemText, styled, ListItemIcon } from '@material-ui/core';
import { langKeys } from 'lang/keys';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Picker } from 'emoji-mart';
import { SearchField } from 'components';
import { Skeleton } from '@material-ui/lab';
import { Trans, useTranslation } from 'react-i18next';
import { VariableSizeList, FixedSizeList, ListChildComponentProps } from 'react-window';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import IOSSwitch from './IOSSwitch';
import Link from '@material-ui/core/Link';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MuiPhoneNumber, { MaterialUiPhoneNumberProps } from 'material-ui-phone-number';
import QuickReactions from "react-quick-reactions";
import React, { CSSProperties, FC, ReactNode, useEffect, useState, useRef } from 'react';
import Tab, { TabProps } from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { FieldError } from 'react-hook-form';
import DragHandleIcon from '@material-ui/icons/DragHandle';

interface TemplateIconsProps {
    viewFunction?: (param: any) => void;
    deleteFunction?: (param: any) => void;
    editFunction?: (param: any) => void;
    extraOption?: string;
    ExtraICon?: () => JSX.Element;
    extraFunction?: (param: any) => void;
}

export const TemplateIcons: React.FC<TemplateIconsProps> = ({ extraOption, viewFunction, deleteFunction, editFunction, extraFunction, ExtraICon }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = (e: any) => {
        e.stopPropagation();
        setAnchorEl(null);
    }

    return (
        <div style={{ whiteSpace: 'nowrap', display: 'flex' }}>
            {/* <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={editFunction}
            >
                <VisibilityIcon style={{ color: '#B6B4BA' }} />
            </IconButton> */}
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    e.stopPropagation();
                }}
                style={{ display: (deleteFunction || extraFunction) ? 'block' : 'none' }}
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
                {extraOption &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null)
                        extraFunction?.(e)
                    }}>
                        {ExtraICon &&
                            <ListItemIcon color="inherit">
                                <ExtraICon />
                            </ListItemIcon>
                        }
                        {extraOption}
                    </MenuItem>
                }
                {deleteFunction &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        deleteFunction?.(e)
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        <Trans i18nKey={langKeys.delete} />
                    </MenuItem>
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

export const FieldView: React.FC<{ label: string, value?: string | number, className?: any, styles?: CSSProperties, tooltip?: string, tooltipcontent?: string, onclick?: (param: any) => void }> = ({ label, value, className, styles, tooltip, onclick, tooltipcontent }) => (
    <div className={className}>
        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
            {label}
            {!!tooltip && <Tooltip title={tooltip} placement="top-start">
                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
            </Tooltip>}
        </Box>
        {Boolean(tooltipcontent) ?
            <Tooltip title={tooltipcontent} placement="top-start">
                <Box onClick={onclick} lineHeight="20px" fontSize={15} color="textPrimary" style={styles}>{value || ""}</Box>
            </Tooltip> :
            <Box onClick={onclick} lineHeight="20px" fontSize={15} color="textPrimary" style={styles}>{value || ""}</Box>
        }
    </div>
)

interface TemplateDialogProps {
    showClose?: boolean;
    open: boolean;
    buttonText0?: string;
    buttonText1?: string;
    buttonText2?: string;
    buttonText3?: string;
    zIndex?: number;
    handleClickButton0?: (param: any) => void;
    handleClickButton1?: (param: any) => void;
    handleClickButton2?: (param: any) => void;
    handleClickButton3?: (param: any) => void;
    title: string;
    button0Type?: "button" | "submit" | "reset";
    button1Type?: "button" | "submit" | "reset";
    button2Type?: "button" | "submit" | "reset";
    button3Type?: "button" | "submit" | "reset";
    maxWidth?: false | "sm" | "xs" | "md" | "lg" | "xl" | undefined;
    height?: string;
    buttonStyle1?: CSSProperties;
    buttonStyle2?: CSSProperties;
    buttonStyle3?: CSSProperties;
    button1Props?: ButtonProps;
}

export const DialogZyx: React.FC<TemplateDialogProps> = ({ children, open, buttonText0, buttonText1, buttonText2, buttonText3, handleClickButton0, handleClickButton1, handleClickButton2, handleClickButton3, title, maxWidth = "sm", button1Type = "button", button2Type = "button", zIndex = 1300, showClose = false, height = "auto", buttonStyle1, buttonStyle2, buttonStyle3, button1Props }) => (
    <Dialog
        open={open}
        fullWidth
        maxWidth={maxWidth}
        style={{ zIndex, height }}>
        <form onSubmit={(button1Type === "submit" ? handleClickButton1 : (button2Type === "submit" ? handleClickButton2 : undefined))}>
            {title && (
                <DialogTitle>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', overflow: 'hidden', wordBreak: 'break-word', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 120 }}>
                            {title}
                        </div>
                        {showClose && <div onClick={(button1Type !== "submit" ? handleClickButton1 : undefined)} style={{ display: 'flex', overflow: 'hidden', wordBreak: 'break-word', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                            <b>X</b>
                        </div>}
                    </div>
                </DialogTitle>
            )}
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {!!buttonText0 &&
                    <Button onClick={(handleClickButton0)}
                    >
                        {buttonText0}
                    </Button>}
                {!!buttonText1 &&
                    <Button type={button1Type} onClick={(button1Type !== "submit" ? handleClickButton1 : undefined)}
                        style={buttonStyle1 || {}}
                        {...button1Props}
                    >
                        {buttonText1}
                    </Button>}
                {!!buttonText2 &&
                    <Button style={buttonStyle2 || {}} type={button2Type} onClick={(button2Type !== "submit" ? handleClickButton2 : undefined)} color="primary">
                        {buttonText2}
                    </Button>}
                {!!buttonText3 &&
                    <Button onClick={(handleClickButton3)}>
                        <p style={{ color: "red" }}>{buttonText3}</p>
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
    emoji?: boolean;
    hashtag?: boolean;
    onChange?: (param: any, param2?: any | null) => void;
    onBlur?: (param: any, param2?: any | null) => void;
    style?: any;
    error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<unknown>>;
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
    width?: number | "string";
    helperText?: "string";
    helperText2?: "string";
    placeholder?: string;
    resize?: string;
    onInput?: any;
    onPaste?: any;
    id?: string;
    inputRef?: React.Ref<HTMLInputElement>;
}

interface TemplateAutocompleteProps extends InputProps {
    data: Dictionary[],
    optionValue: string;
    optionDesc: string;
    loading?: boolean;
    triggerOnChangeOnFirst?: boolean;
    readOnly?: boolean;
    limitTags?: number;
    multiline?: boolean;
    orderbylabel?: boolean;
}

interface TemplateAutocompletePropsDisabled extends InputProps {
    data: Dictionary[],
    optionValue: string;
    optionDesc: string;
    loading?: boolean;
    triggerOnChangeOnFirst?: boolean;
    readOnly?: boolean;
    limitTags?: number;
    multiline?: boolean;
    orderbylabel?: boolean;
    getOptionDisabled?: Dictionary;
}

export const FieldEdit: React.FC<InputProps> = ({ width = "100%", label, size, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 1, fregister = {}, inputProps = {}, InputProps = {}, variant = "standard", maxLength = 0, helperText = "", placeholder = "", inputRef = null, helperText2 = "" }) => {
    const [value, setvalue] = useState("");

    useEffect(() => {
        setvalue(valueDefault);
    }, [valueDefault])

    return (
        <div className={className}>
            {!!helperText2 &&
                <>
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                        {label}
                        {!!helperText &&
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Tooltip title={<div style={{ fontSize: 12 }}>{helperText}</div>} arrow placement="top" >
                                    <InfoRoundedIcon color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                                </Tooltip>
                            </div>
                        }
                    </Box>
                    <Box lineHeight="18px" fontSize={12} mb={.5} style={{ display: "flex", color: "#aaaaaa" }}>
                        {helperText2}
                    </Box>
                </>
            }
            {(variant === "standard" && !!label && !helperText2) &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                    {label}
                    {!!helperText &&
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={<div style={{ fontSize: 12 }}>{helperText}</div>} arrow placement="top" >
                                <InfoRoundedIcon color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                            </Tooltip>
                        </div>
                    }
                </Box>
            }
            <TextField
                {...fregister}
                color="primary"
                fullWidth={width === "100%"}
                label={(variant !== "standard" && !helperText2) && label}
                disabled={disabled}
                type={type}
                style={{ width: width }}
                value={value}
                variant={variant}
                placeholder={placeholder}
                error={!!error}
                helperText={error || null}
                minRows={rows}
                size={size}
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
                InputProps={InputProps}
                inputRef={inputRef}
            />
        </div>
    )
}

export const FieldEditMulti: React.FC<InputProps> = ({ label, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 4, maxLength = 0, fregister = {}, inputProps = {}, variant = "standard" }) => {
    const [value, setvalue] = useState("");

    useEffect(() => {
        setvalue(valueDefault || "");
    }, [valueDefault])

    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <TextField
                {...fregister}
                color="primary"
                fullWidth
                disabled={disabled}
                variant={variant}
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
                style={{ border: '1px solid #762AA9' }}
            />
            {maxLength !== 0 && <FormHelperText style={{ textAlign: 'right' }}>{maxLength - value.length}/{maxLength}</FormHelperText>}
        </div>
    )
}

export const FieldEditMultiAux: React.FC<InputProps> = ({
    label,
    className,
    disabled = false,
    valueDefault = "",
    onChange,
    onBlur,
    error,
    type = "text",
    rows = 4,
    maxLength = 0,
    fregister = {},
    inputProps = {},
    variant = "standard"
}) => {
    const [value, setValue] = useState("");
    const [height, setHeight] = useState(100);
    const resizerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setValue(valueDefault || "");
    }, [valueDefault]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = `${height}px`;
        }
    }, [height]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (textareaRef.current) {
            const newHeight = e.clientY - textareaRef.current.getBoundingClientRect().top;
            setHeight(newHeight);
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className={className} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <TextField
                {...fregister}
                color="primary"
                fullWidth
                disabled={disabled}
                variant={variant}
                type={type}
                error={!!error}
                value={value}
                multiline
                minRows={rows}
                helperText={error || null}
                onChange={(e) => {
                    if (maxLength === 0 || e.target.value.length <= maxLength) {
                        setValue(e.target.value);
                        onChange && onChange(e.target.value);
                    }
                }}
                onBlur={(e) => {
                    onBlur && onBlur(e.target.value);
                }}
                inputProps={inputProps}
                style={{ border: '1px solid #762AA9', resize: 'none' }}
                inputRef={textareaRef}
            />
            {maxLength !== 0 && <FormHelperText style={{ textAlign: 'right' }}>{maxLength - value.length}/{maxLength}</FormHelperText>}
            <div
                ref={resizerRef}
                onMouseDown={handleMouseDown}
                style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    cursor: 'row-resize',
                    width: '15px',
                    height: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F9F9FA',
                    borderTopRightRadius: '4px',
                    borderBottomLeftRadius: '4px',
                    margin: 4
                }}
            >
                <DragHandleIcon style={{ transform: 'rotate(135deg)', color: '#783BA5', height: '17px' }} />
            </div>
        </div>
    );
};


export const FieldEditAdvanced: React.FC<InputProps> = ({ label, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 4, maxLength = 0, fregister = {}, inputProps = {}, style = {}, emoji = false, hashtag = false }) => {
    const [value, setvalue] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setvalue(valueDefault || "");
    }, [valueDefault])

    return (
        <div className={className}>
            {label && <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>}
            {(emoji || hashtag) && <div style={{ display: 'flex', width: '100%', alignItems: 'right', alignContent: 'right', justifyContent: 'flex-end', marginLeft: '6px' }}>
                {emoji && <QuickReactions
                    reactionsArray={[
                        {
                            id: "laughing",
                            name: "Laughing",
                            content: "😂",
                        },
                        {
                            id: "crying",
                            name: "Crying",
                            content: "😢",
                        },
                        {
                            id: "thinking",
                            name: "Thinking",
                            content: "🤔",
                        },
                        {
                            id: "screaming",
                            name: "Screaming",
                            content: "😱",
                        },
                    ]}
                    isVisible={isVisible}
                    onClose={() => setIsVisible(false)}
                    onClickReaction={(reaction) => {
                        if (maxLength === 0 || `${value}${reaction.content}`.length <= maxLength) {
                            setvalue(`${value}${reaction.content}`);
                            onChange && onChange(`${value}${reaction.content}`);
                        }
                    }}
                    trigger={
                        <button
                            type='button'
                            onClick={() => {
                                setIsVisible(!isVisible);
                            }}
                            style={{ border: 'none', width: '28px', height: '28px', backgroundImage: 'url(https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/d710976d-8894-4f37-935b-f4dc102bc294/Emoji.png)', backgroundSize: '28px 28px', cursor: 'pointer' }}
                        >
                        </button>
                    }
                    placement={'left'}
                    header={'Emojis'}
                />}
                {hashtag && <button
                    type='button'
                    onClick={() => {
                        if (maxLength === 0 || `${value}#`.length <= maxLength) {
                            setvalue(`${value}#`);
                            onChange && onChange(`${value}#`);
                        }
                    }}
                    style={{ border: 'none', width: '28px', height: '28px', backgroundImage: 'url(https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/ccbdbce8-db2e-4437-b28f-53fa371334a7/Hashtag.png)', backgroundSize: '28px 28px', cursor: 'pointer' }}
                >
                </button>}
            </div>}
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
                style={style}
            />
            {maxLength !== 0 && <FormHelperText style={{ textAlign: 'right' }}> {value.length}/{maxLength}</FormHelperText>}
        </div>
    )
}

export const FieldEditAdvancedAux: React.FC<InputProps> = ({ label, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 4, maxLength = 0, fregister = {}, inputProps = {}, style = {}, emoji = false, hashtag = false, onInput = {}, onPaste = {}, id }) => {
    const [value, setvalue] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setvalue(valueDefault || "");
    }, [valueDefault])

    return (
        <div className={className}>
            {label && <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>}
            {(emoji || hashtag) && <div style={{ display: 'flex', width: '100%', alignItems: 'right', alignContent: 'right', justifyContent: 'flex-end', marginLeft: '6px' }}>
                {emoji && <QuickReactions
                    reactionsArray={[
                        {
                            id: "laughing",
                            name: "Laughing",
                            content: "😂",
                        },
                        {
                            id: "crying",
                            name: "Crying",
                            content: "😢",
                        },
                        {
                            id: "thinking",
                            name: "Thinking",
                            content: "🤔",
                        },
                        {
                            id: "screaming",
                            name: "Screaming",
                            content: "😱",
                        },
                    ]}
                    isVisible={isVisible}
                    onClose={() => setIsVisible(false)}
                    onClickReaction={(reaction) => {
                        if (maxLength === 0 || `${value}${reaction.content}`.length <= maxLength) {
                            setvalue(`${value}${reaction.content}`);
                            onChange && onChange(`${value}${reaction.content}`);
                        }
                    }}
                    trigger={
                        <button
                            type='button'
                            onClick={() => {
                                setIsVisible(!isVisible);
                            }}
                            style={{ border: 'none', width: '28px', height: '28px', backgroundImage: 'url(https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/d710976d-8894-4f37-935b-f4dc102bc294/Emoji.png)', backgroundSize: '28px 28px', cursor: 'pointer' }}
                        >
                        </button>
                    }
                    placement={'left'}
                    header={'Emojis'}
                />}
                {hashtag && <button
                    type='button'
                    onClick={() => {
                        if (maxLength === 0 || `${value}#`.length <= maxLength) {
                            setvalue(`${value}#`);
                            onChange && onChange(`${value}#`);
                        }
                    }}
                    style={{ border: 'none', width: '28px', height: '28px', backgroundImage: 'url(https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/ccbdbce8-db2e-4437-b28f-53fa371334a7/Hashtag.png)', backgroundSize: '28px 28px', cursor: 'pointer' }}
                >
                </button>}
            </div>}
            <TextField
                {...fregister}
                id={id}
                color="primary"
                fullWidth
                disabled={disabled}
                type={type}
                error={!!error}
                value={value}
                multiline
                minRows={rows}
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
                onInput={onInput}
                onPaste={onPaste}
                style={style}
            />
            {maxLength !== 0 && <FormHelperText style={{ textAlign: 'right' }}> {value.length}/{maxLength}</FormHelperText>}
        </div>
    )
}

export const SingleLineInput: React.FC<InputProps> = ({ label, className, disabled = false, valueDefault = "", onChange, onBlur, error, maxLength = 0, fregister = {}, inputProps = {}, style = {}, onInput = {}, onPaste = {} }) => {
    const [value, setValue] = useState(valueDefault || "");

    useEffect(() => {
        setValue(valueDefault || "");
    }, [valueDefault]);

    return (
        <div className={className}>
            {label && <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>}
            <TextField
                {...fregister}
                color="primary"
                fullWidth
                disabled={disabled}
                type="text"
                error={!!error}
                value={value}
                onChange={(e) => {
                    if (maxLength === 0 || e.target.value.length <= maxLength) {
                        setValue(e.target.value);
                        onChange && onChange(e.target.value);
                    }
                }}
                onBlur={(e) => {
                    onBlur && onBlur(e.target.value);
                }}
                inputProps={{ ...inputProps, maxLength }}
                onInput={onInput}
                onPaste={onPaste}
                style={style}
            />
            {maxLength !== 0 && <FormHelperText style={{ textAlign: 'right' }}> {value.length}/{maxLength}</FormHelperText>}
        </div>
    );
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
    channelType: string
}

export const GetIcon: React.FC<IconProps> = ({ channelType, width = 15, height = 15, color = "#7721AD" }) => {
    if (channelType === "ANDR") return <ChannelAndroid width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "APPL") return <ChannelIos width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "APPS") return <ChannelAppStore width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "BLOG") return <ChannelBlogger width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "CHATZ") return <ChannelChat01 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "CHAZ") return <ChannelChat01 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FACEBOOKWORPLACE") return <ChannelWorkplace width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBDM") return <ChannelMessenger width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBMS") return <ChannelMessenger width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBWA") return <ChannelFacebook width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBWM") return <ChannelWorkplace width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBWP") return <ChannelWorkplace width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FORM") return <ChannelForm width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "GOBU") return <ChannelMyBusiness width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "INDM") return <ChannelInstagram01 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "INMS") return <ChannelInstagram01 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "INST") return <ChannelInstagram02 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "LINE") return <ChannelLine width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "LNKD") return <ChannelLinkedIn width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "MAII") return <ChannelMail width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "MAIL") return <ChannelMail width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "PLAY") return <ChannelPlayStore width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "SMS") return <ChannelSms width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "SMSI") return <ChannelSms width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TEAM") return <ChannelTeams width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TELE") return <ChannelTelegram width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TKTA") return <ChannelTikTok width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TKTK") return <ChannelTikTok width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TKTT") return <ChannelTikTok width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TWDM") return <ChannelTwitter01 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TWIT") return <ChannelTwitter01 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TWMS") return <ChannelTwitter02 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "VOXI") return <ChannelPhone width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WEBM") return <ChannelChat02 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WHAC") return <ChannelWhatsApp01 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WHAD") return <ChannelWhatsApp01 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WHAG") return <ChannelWhatsApp02 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WHAM") return <ChannelWhatsApp02 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WHAP") return <ChannelWhatsApp03 color={color} width={width} fill={color} stroke={color} height={height} />
    if (channelType === "WHAT") return <ChannelWhatsApp04 width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "YOUA") return <ChannelYouTube width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "YOUT") return <ChannelYouTube width={width} fill={color} stroke={color} height={height} color={color} />

    return <ChannelGeneric width={width} fill={color} stroke={color} height={height} color={color} />
}

export const GetIconColor: React.FC<IconProps> = ({ channelType }) => {
    if (channelType === 'ANDR') return <AndroidColor />
    if (channelType === 'APPL') return <IosColor />
    if (channelType === 'APPS') return <AppStoreColor />
    if (channelType === 'BLOG') return <BloggerColor />
    if (channelType === 'CHATZ') return <ChatWebColor />
    if (channelType === 'CHAZ') return <ChatWebColor />
    if (channelType === 'FACEBOOKWORPLACE') return <WorkplaceColor />
    if (channelType === 'FBDM') return <MessengerColor />
    if (channelType === 'FBMS') return <MessengerColor />
    if (channelType === 'FBWA') return <FacebookColor />
    if (channelType === 'FBWM') return <WorkplaceColor />
    if (channelType === 'FBWP') return <WorkplaceColor />
    if (channelType === 'FORM') return <FormColor />
    if (channelType === 'GOBU') return <MyBusinessColor />
    if (channelType === 'INDM') return <InstagramColor />
    if (channelType === 'INMS') return <InstagramColor />
    if (channelType === 'INST') return <InstagramColor />
    if (channelType === 'LINE') return <LineColor />
    if (channelType === 'LNKD') return <LinkedInColor />
    if (channelType === 'MAII') return <MailColor />
    if (channelType === 'MAIL') return <MailColor />
    if (channelType === 'PLAY') return <PlayStoreColor />
    if (channelType === 'SMS') return <SmsColor />
    if (channelType === 'SMSI') return <SmsColor />
    if (channelType === 'TEAM') return <TeamsColor />
    if (channelType === 'TELE') return <TelegramColor />
    if (channelType === 'TKTA') return <TikTokColor />
    if (channelType === 'TKTK') return <TikTokColor />
    if (channelType === 'TKTT') return <TikTokColor />
    if (channelType === 'TWDM') return <TwitterColor />
    if (channelType === 'TWIT') return <TwitterColor />
    if (channelType === 'TWMS') return <TwitterColor />
    if (channelType === 'VOXI') return <VoiceColor />
    if (channelType === 'WEBM') return <ChatWebColor />
    if (channelType === 'WHAC') return <WhatsAppColor />
    if (channelType === 'WHAD') return <WhatsAppColor />
    if (channelType === 'WHAG') return <WhatsAppColor />
    if (channelType === 'WHAM') return <WhatsAppColor />
    if (channelType === 'WHAP') return <WhatsAppColor />
    if (channelType === 'WHAT') return <WhatsAppColor />
    if (channelType === 'YOUA') return <YouTubeColor />
    if (channelType === 'YOUT') return <YouTubeColor />

    return <TelegramColor />
}

export const FieldSelect: React.FC<TemplateAutocompleteProps> = ({ multiline = false, error, label, data = [], optionValue, optionDesc, valueDefault = "", onChange, disabled = false, className = null, style = null, triggerOnChangeOnFirst = false, loading = false, fregister = {}, uset = false, prefixTranslation = "", variant = "standard", readOnly = false, orderbylabel = false, helperText = "", size = 'small', onBlur, helperText2="" }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState<Dictionary | null>(null);
    const [dataG, setDataG] = useState<Dictionary[]>([])

    useEffect(() => {
        if (orderbylabel) {
            if (data.length > 0) {
                if (uset) {
                    const datatmp = data.sort((a, b) => t(prefixTranslation + a[optionDesc]?.toLowerCase()).toUpperCase().localeCompare(t(prefixTranslation + b[optionDesc]?.toLowerCase()).toUpperCase()));
                    setDataG(datatmp);
                    return;
                }
                else {
                    const datatmp = data.sort((a, b) => (a[optionDesc] || '').localeCompare(b[optionDesc] || ''));
                    setDataG(datatmp);
                    return;
                }
            }
        }
        setDataG(data);
    }, [data]);

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
    }, [data, valueDefault]);


    return (
        <div className={className}>
            {!!helperText2 &&
                <>
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                        {label}
                        {!!helperText &&
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Tooltip title={<div style={{ fontSize: 12 }}>{helperText}</div>} arrow placement="top" >
                                    <InfoRoundedIcon color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                                </Tooltip>
                            </div>
                        }
                    </Box>
                    <Box lineHeight="18px" fontSize={12} mb={.5} style={{ display: "flex", color: "#aaaaaa" }}>
                        {helperText2}
                    </Box>
                </>
            }
            {(variant === "standard" && !!label && !helperText2) &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                    {label}
                    {!!helperText &&
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={<div style={{ fontSize: 12 }}>{helperText}</div>} arrow placement="top" >
                                <InfoRoundedIcon color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                            </Tooltip>
                        </div>
                    }
                </Box>
            }
            <Autocomplete
                filterSelectedOptions
                style={style}
                fullWidth
                {...fregister}
                disabled={disabled}
                value={data?.length > 0 ? value : null}
                onChange={(_, newValue) => {
                    if (readOnly) return;
                    setValue(newValue);
                    onChange && onChange(newValue);
                }}
                getOptionSelected={(option, value) => option[optionValue] === value[optionValue]}
                onBlur={onBlur}
                getOptionLabel={option => option ? (uset && Object.keys(langKeys).includes(prefixTranslation + option[optionDesc]?.toLowerCase()) ? t(prefixTranslation + option[optionDesc]?.toLowerCase()).toUpperCase() : (option[optionDesc] || '')) : ''}
                options={dataG}
                loading={loading}
                size={size}
                renderInput={(params) => (
                    <TextField

                        {...params}
                        label={variant !== "standard" && !helperText2 && label}
                        variant={variant}
                        multiline={multiline}
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

export const FieldSelectDisabled: React.FC<TemplateAutocompletePropsDisabled> = ({ multiline = false, error, label, data = [], optionValue, optionDesc, valueDefault = "", onChange, disabled = false, className = null, style = null, triggerOnChangeOnFirst = false, loading = false, fregister = {}, uset = false, prefixTranslation = "", variant = "standard", readOnly = false, orderbylabel = false, helperText = "", size = 'small', getOptionDisabled }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState<Dictionary | null>(null);
    const [dataG, setDataG] = useState<Dictionary[]>([]);

    useEffect(() => {
        if (orderbylabel) {
            if (data.length > 0) {
                if (uset) {
                    const datatmp = data.sort((a, b) => t(prefixTranslation + a[optionDesc]?.toLowerCase()).toUpperCase().localeCompare(t(prefixTranslation + b[optionDesc]?.toLowerCase()).toUpperCase()));
                    setDataG(datatmp);
                    return;
                }
                else {
                    const datatmp = data.sort((a, b) => (a[optionDesc] || '').localeCompare(b[optionDesc] || ''));
                    setDataG(datatmp);
                    return;
                }
            }
        }
        setDataG(data);
    }, [data]);

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
    }, [data, valueDefault]);

    return (
        <div className={className}>
            {(variant === "standard" && !!label) &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                    {label}
                    {!!helperText &&
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={<div style={{ fontSize: 12 }}>{helperText}</div>} arrow placement="top" >
                                <InfoRoundedIcon color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                            </Tooltip>
                        </div>
                    }
                </Box>
            }
            <Autocomplete
                filterSelectedOptions
                style={style}
                fullWidth
                {...fregister}
                disabled={disabled}
                value={data?.length > 0 ? value : null}
                onChange={(_, newValue) => {
                    if (readOnly) return;
                    setValue(newValue);
                    onChange && onChange(newValue);
                }}
                getOptionSelected={(option, value) => option[optionValue] === value[optionValue]}
                getOptionLabel={option => option ? (uset && Object.keys(langKeys).includes(prefixTranslation + option[optionDesc]?.toLowerCase()) ? t(prefixTranslation + option[optionDesc]?.toLowerCase()).toUpperCase() : (option[optionDesc] || '')) : ''}
                options={dataG}
                loading={loading}
                size={size}
                getOptionDisabled={getOptionDisabled}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={variant !== "standard" && label}
                        variant={variant}
                        multiline={multiline}
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
    );
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FieldMultiSelect: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, loading, className = null, style = null, variant = "standard", uset = false, prefixTranslation = "", limitTags = -1, size = 'small',helperText2="", helperText="" }) => {
    const { t } = useTranslation();
    const [optionsSelected, setOptionsSelected] = useState<Dictionary[]>([]);

    useEffect(() => {
        if (valueDefault && data.length > 0) {
            const optionsSelected = data.filter(o => `${valueDefault}`.split(",").indexOf(o[optionValue].toString()) > -1)
            setOptionsSelected(optionsSelected);
        } else {
            setOptionsSelected([]);
        }
    }, [data]);

    return (
        <div className={className}>
            {!!helperText2 &&
                <>
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                        {label}
                    </Box>
                    <Box lineHeight="18px" fontSize={12} mb={.5} style={{ display: "flex", color: "#aaaaaa" }}>
                        {helperText2}
                    </Box>
                </>
            }
            {(variant === "standard" && !helperText2) &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            }
            <Autocomplete
                multiple
                limitTags={limitTags}
                filterSelectedOptions
                style={style}
                disabled={disabled}
                disableCloseOnSelect
                loading={loading}
                value={optionsSelected}
                renderOption={(option, { selected }: any) => (
                    <React.Fragment>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option ? (uset ? t(prefixTranslation + option[optionDesc]?.toLowerCase()).toUpperCase() : (option[optionDesc] || '')) : ''}
                    </React.Fragment>
                )}
                onChange={(_, values, action, option) => {
                    setOptionsSelected(values);
                    onChange && onChange(values, { action, option });
                }}
                size={size}
                getOptionLabel={option => option ? (uset ? t(prefixTranslation + option[optionDesc]?.toLowerCase()).toUpperCase() : (option[optionDesc] || '')) : ''}
                options={data}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={variant !== "standard" && !helperText2 && label}
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

// FieldMultiSelectVirtualized

const LISTBOX_PADDING_MultiSelect = 8;

const renderRowMultiSelect = (props: ListChildComponentProps) => {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: (style.top as number) + LISTBOX_PADDING_MultiSelect,
        },
    });
}

const OuterElementContextMultiSelect = React.createContext({});

const OuterElementTypeMultiSelect = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContextMultiSelect);
    return <div ref={ref} {...props} {...outerProps} />;
});

const useResetCacheMultiSelect = (data: any) => {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
interface ListboxComponentProps {
    children: ReactNode;
}

const ListboxComponentMultiSelect = React.forwardRef<HTMLDivElement, ListboxComponentProps>(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const itemCount = itemData.length;
    const itemSize = 48;

    const getChildSize = (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCacheMultiSelect(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContextMultiSelect.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight()}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementTypeMultiSelect}
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRowMultiSelect}
                </VariableSizeList>
            </OuterElementContextMultiSelect.Provider>
        </div>
    );
});

export const FieldMultiSelectVirtualized: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, loading, className = null, style = null, variant = "standard", uset = false, prefixTranslation = "", limitTags = -1 }) => {
    const { t } = useTranslation();
    const [optionsSelected, setOptionsSelected] = useState<Dictionary[]>([]);

    useEffect(() => {
        if (valueDefault && data.length > 0) {
            const optionsSelected = data.filter(o => `${valueDefault}`.split(",").indexOf(o[optionValue].toString()) > -1)
            setOptionsSelected(optionsSelected);
        } else {
            setOptionsSelected([]);
        }
    }, [data]);

    return (
        <div className={className}>
            {variant === "standard" &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            }
            <Autocomplete
                multiple
                disableListWrap
                limitTags={limitTags}
                filterSelectedOptions
                style={style}
                disabled={disabled}
                disableCloseOnSelect
                loading={loading}
                value={optionsSelected}
                ListboxComponent={ListboxComponentMultiSelect as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                renderOption={(option, { selected }: any) => (
                    <React.Fragment>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        <Typography noWrap>{option ? (uset ? t(prefixTranslation + option[optionDesc]?.toLowerCase()).toUpperCase() : (option[optionDesc] || '')) : ''}</Typography>
                    </React.Fragment>
                )}
                onChange={(_, values, action, option) => {
                    setOptionsSelected(values);
                    onChange && onChange(values, { action, option });
                }}
                size="small"
                getOptionLabel={option => option ? (uset ? t(prefixTranslation + option[optionDesc]?.toLowerCase()).toUpperCase() : (option[optionDesc] || '')) : ''}
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

export const FieldMultiSelectFreeSolo: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onBlur, onChange, disabled = false, loading, className = null, style = null, variant = "standard", readOnly = false }) => {

    const [optionsSelected, setOptionsSelected] = useState<any[]>([]);

    useEffect(() => {
        if (valueDefault && data.length > 0) {
            const optionsSelected = data.filter(o => `${valueDefault}`.split(",").indexOf(o[optionValue].toString()) > -1)
            setOptionsSelected(optionsSelected);
        } else {
            setOptionsSelected([]);
        }
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
                        onBlur={(e) => {
                            onBlur && onBlur(e.target.value);
                        }}
                        error={!!error}
                        helperText={error || null}

                    />
                )}
            />
        </div>
    )
}
export const FieldMultiSelectEmails: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onBlur, onChange, disabled = false, loading, className = null, style = null, variant = "standard", readOnly = false }) => {

    const [optionsSelected, setOptionsSelected] = useState<any[]>([]);


    useEffect(() => {
        if (valueDefault && data.length > 0) {
            const optionsSelected = data.filter(o => `${valueDefault}`.split(",").indexOf(o[optionValue].toString()) > -1)
            setOptionsSelected(optionsSelected);
        } else {
            setOptionsSelected([]);
        }
    }, [valueDefault, data]);
    const el = React.useRef<null | HTMLDivElement>(null);
    const ke = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, keyCode: 13 });

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
                ref={el}
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
                onInput={(e: any) => {
                    if (e.target.value.indexOf(",") > -1) {
                        const values = `${e.target.value}`.split(",");
                        e.target.value = values[0]
                        el?.current?.dispatchEvent(ke);
                    }
                }}
                onChange={(_, values, action, option) => {
                    if (readOnly) return;
                    setOptionsSelected(values);
                    onChange && onChange(values, { action, option });
                }}
                size="small"
                getOptionLabel={option => String(option ? option[optionDesc] || option : '')}
                options={data}
                renderInput={(params) => {
                    return (<TextField
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
                        onBlur={(e) => {
                            el?.current?.dispatchEvent(ke);
                        }}
                        error={!!error}
                        helperText={error || null}

                    />)
                }
                }
            />
        </div>
    )
}

interface TemplateSwitchProps extends InputProps {
    className?: any;
    label: string;
}
interface TemplateSwitchPropsYesNo extends InputProps {
    className?: any;
    label?: string;
    textYes?: string;
    textNo?: string;
    labelPlacement?: "start" | "end" | "bottom" | "top" | undefined;
    disabled?: boolean;
}

export const TemplateSwitch: React.FC<TemplateSwitchProps> = ({ className, onChange, valueDefault, label, style, disabled = false }) => {
    const [checkedaux, setChecked] = useState(false);

    useEffect(() => {
        setChecked(!!valueDefault)
    }, [valueDefault])

    return (
        <div className={className} style={{ ...style, paddingBottom: '3px' }}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{label}</Box>
            <IOSSwitch checked={checkedaux} disabled={disabled} onChange={(e) => {
                setChecked(e.target.checked);
                onChange && onChange(e.target.checked)
            }} />
        </div>
    );
}
export const TemplateSwitchYesNo: React.FC<TemplateSwitchPropsYesNo> = ({ className, onChange, valueDefault, label, style, textYes, textNo, labelPlacement = "end", disabled = false, helperText = "" }) => {
    const [checkedaux, setChecked] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setChecked(!!valueDefault)
    }, [valueDefault])

    return (
        <div className={className} style={{ ...style, paddingBottom: '3px' }}>

            {(!!label) &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary" style={{ display: "flex" }}>
                    {label}
                    {!!helperText &&
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={<div style={{ fontSize: 12 }}>{helperText}</div>} arrow placement="top" >
                                <InfoRoundedIcon color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                            </Tooltip>
                        </div>
                    }
                </Box>
            }
            <FormControlLabel
                labelPlacement={labelPlacement}
                style={{ paddingLeft: 10 }}
                control={<IOSSwitch checked={checkedaux} disabled={disabled} onChange={(e) => {
                    setChecked(e.target.checked);
                    onChange && onChange(e.target.checked)
                }} />}
                label={checkedaux ? (textYes || t(langKeys.yes)) : (textNo || "No")}
            />
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

export const FieldCheckbox: React.FC<FieldCheckboxProps> = ({ className, onChange, valueDefault, label, disabled = false, helperText = "" }) => {
    const classes = useCheckboxStyles();
    const [checkedaux, setChecked] = useState(false);

    useEffect(() => {
        setChecked(!!valueDefault)
    }, [valueDefault])

    return (
        <div className={className} style={{ paddingBottom: '3px' }}>

            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                {label}
                {!!helperText &&
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title={<div style={{ fontSize: 12 }}>{helperText}</div>} arrow placement="top" >
                            <InfoRoundedIcon color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                        </Tooltip>
                    </div>
                }
            </Box>
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

export const AntTab = withStyles((theme: any) => ({
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
    labelIcon: {
        minHeight: 40,
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    selected: {},
}))((props: TabProps) => <Tab disableRipple {...props} />);

interface AntTabPanelProps {
    index: number;
    currentIndex: number;
}

export const AntTabPanel: FC<AntTabPanelProps> = ({ index, currentIndex, children }) => {
    if (index !== currentIndex) {
        return null
    }

    return (
        <div role="tabpanel" >
            {children}
        </div>
    );
}

export const AntTabPanelAux: FC<AntTabPanelProps> = ({ index, currentIndex, children }) => {
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
    emojisIndexed?: Dictionary[];
    emojisNoShow?: string[];
    emojiFavorite?: string[];
    onSelect: (e: any) => void;
    style?: React.CSSProperties;
    icon?: (onClick: () => void) => React.ReactNode;
    bottom?: number;
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


export const EmojiPickerZyx: React.FC<EmojiPickerZyxProps> = ({ emojisIndexed, emojisNoShow = [], emojiFavorite = [], onSelect, style, icon, bottom = 50 }) => {
    const [open, setOpen] = React.useState(false);
    const classes = emojiPickerStyle();
    const handleClick = () => setOpen((prev) => !prev);
    const { t } = useTranslation();
    const handleClickAway = () => setOpen(false);
    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <span style={style}>
                {icon?.(handleClick) || <Tooltip title={String(t(langKeys.send_emoji))} arrow placement="top">
                    <IconButton onClick={handleClick} size='small'>
                        <EmojiICon className={classes.root} />
                    </IconButton>
                </Tooltip>}
                {open && (
                    <div style={{
                        position: 'absolute',
                        bottom: bottom,
                        zIndex: 1201
                    }}>
                        <Picker
                            onSelect={onSelect}
                            native={true}
                            sheetSize={32}
                            i18n={{
                                search: t(langKeys.search),
                                categories: {
                                    search: t(langKeys.search_result),
                                    recent: t(langKeys.favorites),
                                    people: t(langKeys.emoticons),
                                    nature: t(langKeys.animals),
                                    foods: t(langKeys.food),
                                    activity: t(langKeys.activities),
                                    places: t(langKeys.travel),
                                    objects: t(langKeys.objects),
                                    symbols: t(langKeys.symbols),
                                    flags: t(langKeys.flags),
                                }
                            }}
                            recent={emojiFavorite.length > 0 ? emojiFavorite?.map(x => (emojisIndexed as Dictionary)?.[x || ""]?.id || '') : undefined}
                            emojisToShowFilter={emojisNoShow && emojisNoShow.length > 0 ? (emoji: any) => emojisNoShow.map(x => x.toUpperCase()).indexOf(emoji.unified.toUpperCase()) === -1 : undefined}
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
                <Tooltip title={String(t(langKeys.send_gif))} arrow placement="top">
                    <IconButton onClick={handleClick} size='small'>
                        <GifIcon className={classes.root} />
                    </IconButton>
                </Tooltip>
                {open && (
                    <div style={{
                        position: 'absolute',
                        bottom: 50,
                        width: 342,
                        height: 400,
                        zIndex: 1201,
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
    datalabel?: string;
    top?: number;
    left?: number;
    onClickSelection: (e: any, value: string) => any
    onClickAway: (...param: any) => any
}

export const FieldEditWithSelect: React.FC<EditWithSelectProps> = ({ label, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 4, maxLength = 0, fregister = {},
    primitive = false, inputProps = {}, show, data, datakey, datalabel, top = 0, left = 0, onClickSelection, onClickAway }) => {
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
                    <ListItemText primary={data[index][datalabel || datakey]} />
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
                            zIndex: 9999
                        }}>
                            <FixedSizeList
                                className="scroll-style-go"
                                direction="vertical"
                                height={200}
                                width={280}
                                itemSize={28}
                                itemCount={data?.length}
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
                minRows={rows}
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
    defaultValue?: any;
    className?: any;
    label: string;
    tooltip?: Dictionary;
}


export const TemplateSwitchArray: React.FC<TemplateSwitchArrayProps> = ({ className, onChange, defaultValue, label, tooltip = {} }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState([true, '1'].includes(defaultValue) ? true : false);

    return (
        <div className={className} style={{ paddingBottom: '3px' }}>
            {label && <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{label}</Box>}
            <Tooltip title={!!value ? t((langKeys as any)[tooltip?.true]) || '' : t((langKeys as any)[tooltip?.false]) || ''}>
                <IOSSwitch defaultChecked={defaultValue} onChange={(e) => {
                    onChange && onChange(e.target.checked)
                    setValue(e.target.checked)
                }} />
            </Tooltip>
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
                countryCodeEditable={false}
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