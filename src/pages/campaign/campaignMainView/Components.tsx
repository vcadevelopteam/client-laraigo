import React from 'react'; 
import { makeStyles } from "@material-ui/core";
import { Dictionary } from "@types";
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { ListItemIcon } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';

export type BreadCrumb = {
    id: string,
    name: string
}

export interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

export interface ColumnTmp {
    Header: string;
    accessor: string;
    prefixTranslation?: string;
    type?: string;
}

export interface CampaignProps {
    arrayBread: BreadCrumb[];
    setAuxViewSelected: (view: string) => void;  
}

export const campaignStyles = makeStyles((theme) => ({
    
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    buttonProgrammed: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        backgroundColor: '#efe4b0'
    },
    containerHeader: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    titleandcrumbs: {
        marginBottom: 4,
        marginTop: 4,
    },
}));

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