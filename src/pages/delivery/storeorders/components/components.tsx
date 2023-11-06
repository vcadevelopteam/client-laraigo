import React, { useState, useEffect, useRef } from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import { resetUploadFile, uploadFile } from 'store/main/actions';
import { IFile } from '@types';
import { langKeys } from 'lang/keys';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import { ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { showSnackbar } from 'store/popus/actions';

interface TemplateIconsProps {
    delivered?: (param: any) => void;
    undelivered?: (param: any) => void;    
}

export const ExtrasMenu: React.FC<TemplateIconsProps> = ({ delivered, undelivered}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = (e: any) => {
        e.stopPropagation();
        setAnchorEl(null);
    }

    return (
        <div style={{ whiteSpace: 'nowrap', display: 'flex' }}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    e.stopPropagation();
                }}
                style={{ display: 'block' }}
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
                {delivered &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        delivered?.(e)
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        <Trans i18nKey={langKeys.delivered} />
                    </MenuItem>
                }
                {undelivered &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        undelivered?.(e)
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        <Trans i18nKey={langKeys.undelivered} />
                    </MenuItem>
                }              
            </Menu>
        </div>
    )
}


