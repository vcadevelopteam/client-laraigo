
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, MenuItem } from '@material-ui/core';
import { SmsIcon, WhatsappIcon } from 'icons';
import { langKeys } from 'lang/keys';
import MailIcon from '@material-ui/icons/Mail';

export const TemplateIcons: FC<{
    sendHSM?: (data: any) => void;
    sendSMS: (data: any) => void;
    sendMAIL: (data: any) => void;
}> = ({ sendHSM, sendSMS, sendMAIL }) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose = (e: any) => {
        e.stopPropagation();
        setAnchorEl(null);
    };
    const { t } = useTranslation();

    return (
        <div style={{ whiteSpace: 'nowrap', display: 'flex' }}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"

                onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                }}
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
                {sendHSM &&
                    <MenuItem onClick={(e) => {
                        sendHSM(e);
                        handleClose(e)
                    }}>
                        <ListItemIcon color="inherit">
                            <WhatsappIcon width={22} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.send_hsm)}
                    </MenuItem>
                }
                <MenuItem onClick={(e) => {
                    sendSMS(e);
                    handleClose(e)
                }}>
                    <ListItemIcon color="inherit">
                        <SmsIcon width={18} style={{ fill: '#7721AD' }} />
                    </ListItemIcon>
                    {t(langKeys.send_sms)}
                </MenuItem>
                <MenuItem onClick={(e) => {
                    sendMAIL(e);
                    handleClose(e)
                }}>
                    <ListItemIcon color="inherit">
                        <MailIcon width={18} style={{ fill: '#7721AD' }} />
                    </ListItemIcon>
                    {t(langKeys.send_mail)}
                </MenuItem>
            </Menu>
        </div>
    )
}