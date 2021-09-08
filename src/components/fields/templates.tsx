import React, { useEffect, useState } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Trans } from 'react-i18next';
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
import { FormHelperText, useTheme } from '@material-ui/core';
import { Divider, Grid, ListItem } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

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
} from 'icons';


interface TemplateIconsProps {
    viewFunction?: (param: any) => void;
    deleteFunction?: (param: any) => void;
    editFunction?: (param: any) => void;
}

export const TemplateIcons: React.FC<TemplateIconsProps> = ({ viewFunction, deleteFunction, editFunction }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
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
            >
                <MoreVertIcon style={{ color: '#B6B4BA' }} />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
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
                {/* <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                    editFunction && editFunction(e)
                    }}><Trans i18nKey={langKeys.edit} /></MenuItem> */}
                <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                    deleteFunction && deleteFunction(e)
                }}><Trans i18nKey={langKeys.delete} /></MenuItem>
            </Menu>
        </>
    )
}

interface TemplateBreadcrumbsProps {
    breadcrumbs: Array<{ id: string, name: string }>;
    handleClick?: (param: any) => void;
}

export const TemplateBreadcrumbs: React.FC<TemplateBreadcrumbsProps> = ({ breadcrumbs, handleClick }) => {

    const handleClickBreadcrumb = (event: any, id: string) => {
        event.preventDefault();
        handleClick && handleClick(id)
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

export const TitleDetail: React.FC<{ title: string }> = ({ title }) => (
    <Typography style={{ fontSize: 32 }} color="textPrimary">{title}</Typography>
)

export const Title: React.FC = ({ children }) => {
    const theme = useTheme();
    const style: React.CSSProperties = {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
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
    handleClickButton2?: (param: any) => void;
    handleClickButton1?: (param: any) => void;
    title: string;
    button2Type?: "button" | "submit" | "reset";
    button1Type?: "button" | "submit" | "reset";
    maxWidth?: false | "sm" | "xs" | "md" | "lg" | "xl" | undefined;
}

export const DialogZyx: React.FC<TemplateDialogProps> = ({ children, open, buttonText1, buttonText2, handleClickButton2, handleClickButton1, title, maxWidth = "sm", button2Type = "button", button1Type = "button" }) => (
    <Dialog
        open={open}
        keepMounted
        fullWidth
        maxWidth={maxWidth}
        style={{ zIndex: 1300 }}>
        <form onSubmit={(button1Type === "submit" ? handleClickButton1 : (button2Type === "submit" ? handleClickButton2 : () => { }))}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {!!buttonText1 &&
                    <Button type={button1Type} onClick={(button1Type !== "submit" ? handleClickButton1 : () => { })} color="primary"
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

interface InputProps {
    label: string;
    className?: any;
    valueDefault?: string;
    disabled?: boolean;
    onChange?: (param: any, param2?: any | null) => void;
    onBlur?: (param: any, param2?: any | null) => void;
    style?: any;
    error?: string;
    type?: string;
    rows?: number;
    maxLength?: number;
    fregister?: Dictionary;
}

interface TemplateAutocompleteProps extends InputProps {
    data: Dictionary[],
    optionValue: string;
    optionDesc: string;
    loading?: boolean;
    triggerOnChangeOnFirst?: boolean;
}

export const FieldEdit: React.FC<InputProps> = ({ label, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 1, fregister = {} }) => {
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
                value={value}
                error={!!error}
                helperText={error || null}
                rows={rows}
                onChange={(e) => {
                    setvalue(e.target.value);
                    onChange && onChange(e.target.value);
                }}
                onBlur={(e) => {
                    onBlur && onBlur(e.target.value);
                }}
            />
        </div>
    )
}
export const FieldEditMulti: React.FC<InputProps> = ({ label, className, disabled = false, valueDefault = "", onChange, onBlur, error, type = "text", rows = 4, maxLength = 0, fregister = {} }) => {
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
    if (channelType === "WHAP") return <WhatsappIcon color={color} width={width} fill={color} stroke={color} height={height} />
    if (channelType === "WHAC") return <WhatsappIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBMS") return <FacebookMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBDM") return <FacebookMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "FBWA") return <FacebookWallIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "WEBM") return <WebMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TELE") return <WhatsappIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "INST") return <InstagramIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "ANDR") return <AndroidIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "APPL") return <AppleIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "CHATZ") return <ZyxmeMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "CHAZ") return <ZyxmeMessengerIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "MAIL") return <WhatsappIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "YOUT") return <YoutubeIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "LINE") return <LineIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "SMS") return <SmsIcon width={width} fill={color} stroke={color} height={height} color={color} />
    if (channelType === "TWIT") return <TwitterIcon width={width} fill={color} stroke={color} height={height} color={color} />

    return <WhatsappIcon color={color} width={width} fill={color} stroke={color} height={height} />
}

export const FieldSelect: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, className = null, style = null, triggerOnChangeOnFirst = false, loading = false, fregister = {} }) => {

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
    }, [valueDefault, data]);

    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <Autocomplete
                filterSelectedOptions
                style={style}
                disabled={disabled}
                value={data.length > 0 ? value : null}
                onChange={(_, newValue) => {
                    setValue(newValue);
                    onChange && onChange(newValue);
                }}
                // onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                getOptionLabel={option => option ? option[optionDesc] : ''}
                options={data}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...fregister}
                        {...params}
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
                        }}
                    />
                )}
            />
        </div>
    )
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FieldMultiSelect: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, loading, className = null, style = null }) => {

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
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
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
                getOptionLabel={option => option ? option[optionDesc] : ''}
                options={data}
                renderInput={(params) => (
                    <TextField
                        {...params}
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
interface TemplateSwitchProps extends InputProps {
    className?: any;
    label: string;
}

export const TemplateSwitch: React.FC<TemplateSwitchProps> = ({ className, onChange, valueDefault, label }) => {
    const [checkedaux, setChecked] = useState(false);

    useEffect(() => {
        setChecked(!!valueDefault)
    }, [valueDefault])

    return (
        <div className={className} style={{ paddingBottom: '3px' }}>
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
    },
  });

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

export const ListItemSkeleton: React.FC = () => (
    <ListItem style={{ display: 'flex', paddingLeft: 0, paddingRight: 0, paddingBottom: 8 }}>
        <Box style={{ padding: 20, backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexGrow: 1, }}>
            <Grid container direction="column">
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