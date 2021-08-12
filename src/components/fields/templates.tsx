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

import { Dictionary } from '@types';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IOSSwitch from './IOSSwitch';
import { SwitchProps } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
                onClick={viewFunction}
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
                <MenuItem onClick={editFunction}><Trans i18nKey={langKeys.edit} /></MenuItem>
                <MenuItem onClick={deleteFunction}><Trans i18nKey={langKeys.delete} /></MenuItem>
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
        style={{ zIndex: 1200 }}>
        <form onSubmit={(button1Type === "submit" ? handleClickButton1 : (button2Type === "submit" ? handleClickButton2 : () => {}))}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {!!buttonText1 &&
                    <Button type={button1Type} onClick={(button1Type !== "submit" ? handleClickButton1 : () => {})} color="primary"
                    >
                        {buttonText1}
                    </Button>}
                {!!buttonText2 &&
                    <Button type={button2Type} onClick={(button2Type !== "submit" ? handleClickButton2 : () => {})} color="primary">
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
    style?: any;
    error?: string;
    type?: string;
}

interface TemplateAutocompleteProps extends InputProps {
    data: Dictionary[],
    optionValue: string;
    optionDesc: string;
    loading?: boolean;
    triggerOnChangeOnFirst?: boolean;
}

export const FieldEdit: React.FC<InputProps> = ({ label, className, disabled = false, valueDefault = "", onChange, error, type = "text" }) => {
    const [value, setvalue] = useState(valueDefault);
    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <TextField
                color="primary"
                fullWidth
                disabled={disabled}
                type={type}
                value={value}
                helperText={error || null}
                onChange={(e) => {
                    setvalue(e.target.value);
                    onChange && onChange(e.target.value);
                }}
            />
        </div>
    )
}

export const FieldSelect: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, className = null, style = null, triggerOnChangeOnFirst = false, loading = false }) => {

    const [value, setValue] = useState<Dictionary | null>(null);
    const [inputValue, setInputValue] = useState('');

    const setHardValue = (dataoptions: Dictionary[], valuetoset: string) => {
        if (valuetoset) {
            const optionfound = dataoptions.find((o: Dictionary) => o[optionValue] === valuetoset);
            if (optionfound) {
                setInputValue(optionfound[optionDesc]);
                setValue(optionfound);
                if (triggerOnChangeOnFirst)
                    onChange && onChange(optionfound);
            }
        }
    }

    useEffect(() => {
        if (data instanceof Array) {
            setHardValue(data, valueDefault);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <Autocomplete
                filterSelectedOptions
                style={style}
                disabled={disabled}
                value={value}
                inputValue={inputValue}
                onChange={(_, newValue) => {
                    setValue(newValue);
                    onChange && onChange(newValue);
                }}
                onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                getOptionLabel={option => option ? option[optionDesc] : ''}
                options={data}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={error || null}
                    />
                )}
            />
        </div>
    )
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FieldMultiSelect: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, className = null, style = null }) => {

    const [value, setValue] = useState<Dictionary | null>(null);
    const [optionsSelected, setOptionsSelected] = useState<Dictionary[]>([]);

    const setHardValue = (dataoptions: Dictionary[], valuetoset: string) => {
        if (valuetoset) {
            const optionsSelected = dataoptions.filter(o => valuetoset.split(",").indexOf(o[optionValue].toString()) > -1)
            setOptionsSelected(optionsSelected);
        }
    }

    useEffect(() => {
        if (data instanceof Array) {
            setHardValue(data, valueDefault);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <Autocomplete
                multiple
                filterSelectedOptions
                style={style}
                disabled={disabled}
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
                // onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                getOptionLabel={option => option ? option[optionDesc] : ''}
                options={data}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={error || null}
                    />
                )}
            />
        </div>
    )
}
interface TemplateSwitchProps extends SwitchProps {
    className?: any;
    label: string;
}

export const TemplateSwitch: React.FC<TemplateSwitchProps> = ({ className, label, ...props }) => {
    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <IOSSwitch {...props} />
        </div>
    );
}
