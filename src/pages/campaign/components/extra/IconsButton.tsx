import React from 'react'; 
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { ListItemIcon } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import { Dictionary } from "@types";

export const IconOptions: React.FC<{ disabled?: boolean, onHandlerDelete?: (e?: Dictionary) => void }> = ({ onHandlerDelete }) => {
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const { t } = useTranslation()

    const handleClose = (e: Dictionary) => {
        e.stopPropagation()
        setAnchorEl(null)
    }

    return (
        <>           
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
                {onHandlerDelete &&
                    <MenuItem onClick={(e: Dictionary) => {
                        e.stopPropagation()
                        setAnchorEl(null);
                        onHandlerDelete();
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.delete)}
                    </MenuItem>
                }
            </Menu>
        </>
    )
}