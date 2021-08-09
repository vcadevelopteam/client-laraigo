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

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

interface InputProps {
    label: string;
    className?: any;
    valueDefault?: string;
    disabled?: boolean;
    onChange?: (param: any) => void;
    style?: any;
    error?: string;
}

interface TemplateAutocompleteProps extends InputProps {
    data: Dictionary[],
    optionValue: string;
    optionDesc: string;
}

export const FieldEdit: React.FC<InputProps> = ({ label, className, disabled = false, valueDefault = "", onChange, error }) => {
    const [value, setvalue] = useState(valueDefault);
    return (
        <div className={className}>
            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{label}</Box>
            <TextField
                color="primary"
                fullWidth
                disabled={disabled}
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

export const FieldSelect: React.FC<TemplateAutocompleteProps> = ({ error, label, data, optionValue, optionDesc, valueDefault = "", onChange, disabled = false, className = null, style = null }) => {

    const [value, setValue] = useState<Dictionary | null>(null);
    const [inputValue, setInputValue] = useState('');

    const setHardValue = (dataoptions: Dictionary[], valuetoset: string) => {
        if (valuetoset) {
            const optionfound = dataoptions.find((o: Dictionary) => o[optionValue] === valuetoset);
            if (optionfound) {
                setInputValue(optionfound[optionDesc]);
                setValue(optionfound);

                if (onChange)
                    onChange(optionfound)
            }
        }
    }

    useEffect(() => {
        if (data instanceof Array) {
            setHardValue(data, valueDefault);
        }
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
                    if (onChange)
                        onChange(newValue);
                }}
                onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                getOptionLabel={option => option ? option[optionDesc] : ''}
                options={data}
                // loading={loading}
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
