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
    changeStatus?: (param: any) => void;
    statusHistory?: (param: any) => void;
    addToWarehouse?: (param: any) => void;
    extraOption?: string;
    ExtraICon?: () => JSX.Element;
    extraFunction?: (param: any) => void;
}

export const ExtrasMenu: React.FC<TemplateIconsProps> = ({ changeStatus, statusHistory, addToWarehouse, extraFunction, ExtraICon }) => {
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
                {changeStatus &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        changeStatus?.(e)
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        <Trans i18nKey={langKeys.change_status} />
                    </MenuItem>
                }
                {statusHistory &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        statusHistory?.(e)
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        <Trans i18nKey={langKeys.status_history} />
                    </MenuItem>
                }
                {addToWarehouse &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        addToWarehouse?.(e)
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        <Trans i18nKey={langKeys.add_product_to_warehouse} />
                    </MenuItem>
                }
            </Menu>
        </div>
    )
}

interface InventoryIconsProps {
    currentbalance?: (param: any) => void;
    pyshicalcount?: (param: any) => void;
    standardcost?: (param: any) => void;
    averagecost?: (param: any) => void;
    reconcilebalance?: (param: any) => void;
    seeproductavailability?: (param: any) => void;
    seeinventorytransactions?: (param: any) => void;
    managereservations?: (param: any) => void;
}

export const ExtrasMenuInventory: React.FC<InventoryIconsProps> = ({
    currentbalance,
    pyshicalcount,
    standardcost,
    averagecost,
    reconcilebalance,
    seeproductavailability,
    seeinventorytransactions,
    managereservations
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const menuItemRef = useRef(null);

    const handleClose = (e: any) => {
        e.stopPropagation();
        setAnchorEl(null);
    }

    const handleMouseEnter = () => {
        setShowSubMenu(true);
    };

    const handleCloseSubMenu = () => {
        setShowSubMenu(false);
    };

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
                <MenuItem ref={menuItemRef} onMouseEnter={handleMouseEnter}>
                    <ListItemIcon color="inherit">
                        <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                    </ListItemIcon>
                    <Trans i18nKey={langKeys.inventorysettings} />
                </MenuItem>
                <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(null);
                    seeproductavailability?.(e)
                }}>
                    <ListItemIcon color="inherit">
                        <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                    </ListItemIcon>
                    <Trans i18nKey={langKeys.seeproductavailability} />
                </MenuItem>
                <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(null);
                    managereservations?.(e)
                }}>
                    <ListItemIcon color="inherit">
                        <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                    </ListItemIcon>
                    <Trans i18nKey={langKeys.managereservations} />
                </MenuItem>
                <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(null);
                    seeinventorytransactions?.(e)
                }}>
                    <ListItemIcon color="inherit">
                        <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                    </ListItemIcon>
                    <Trans i18nKey={langKeys.seeinventorytransactions} />
                </MenuItem>
            </Menu>
            {showSubMenu && (
                    <Menu
                        id="submenu-appbar"
                        anchorEl={menuItemRef.current}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={showSubMenu}
                        onClose={handleCloseSubMenu}
                    >
                        <MenuItem onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(null);
                            currentbalance?.(e)
                            setShowSubMenu(false);
                        }}>
                            <ListItemIcon color="inherit">
                                <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                            </ListItemIcon>
                            <Trans i18nKey={langKeys.current_balance} />
                        </MenuItem>
                        <MenuItem onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(null);
                            pyshicalcount?.(e)
                            setShowSubMenu(false);
                        }}>
                            <ListItemIcon color="inherit">
                                <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                            </ListItemIcon>
                            <Trans i18nKey={langKeys.currentcount} />
                        </MenuItem>
                        <MenuItem onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(null);
                            standardcost?.(e)
                            setShowSubMenu(false);
                        }}>
                            <ListItemIcon color="inherit">
                                <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                            </ListItemIcon>
                            <Trans i18nKey={langKeys.standard_cost} />
                        </MenuItem>
                        <MenuItem onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(null);
                            averagecost?.(e)
                            setShowSubMenu(false);
                        }}>
                            <ListItemIcon color="inherit">
                                <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                            </ListItemIcon>
                            <Trans i18nKey={langKeys.average_cost} />
                        </MenuItem>
                        <MenuItem onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(null);
                            reconcilebalance?.(e)
                            setShowSubMenu(false);
                        }}>
                            <ListItemIcon color="inherit">
                                <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                            </ListItemIcon>
                            <Trans i18nKey={langKeys.reconcilebalancesheets} />
                        </MenuItem>
                    </Menu>
                )}
        </div>
    )
}

export const ItemFile: React.FC<{ item: IFile, setFiles: (param: any) => void }> = ({ item, setFiles }) => (
    <div style={{ position: 'relative' }}>
        <div key={item.id} style={{ width: 70, height: 70, border: '1px solid #e1e1e1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {item.url ?
                (item.type === 'image' ?
                    <img alt="loaded" src={item.url} style={{ objectFit: 'cover', width: '100%', maxHeight: 70 }} /> :
                    <img width="30" height="30" alt="loaded" src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/1631292621392file-trans.png" />) :
                <CircularProgress color="inherit" />
            }
        </div>
        <IconButton
            onClick={() => setFiles((x: IFile[]) => x.filter(y => y.id !== item.id))}
            size="small"
            style={{ position: 'absolute', top: -16, right: -14 }}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    </div>
)

export const UploaderIcon: React.FC<{ classes: any, setFiles: (param: any) => void, initfile?: any, setfileimage?: (param: any) => void }> = ({ classes, setFiles, initfile, setfileimage }) => {
    const [valuefile, setvaluefile] = useState('')
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const { t } = useTranslation();
    const uploadResult = useSelector(state => state.main.uploadFile);
    const [idUpload, setIdUpload] = useState('');

    useEffect(() => {
        if (initfile) {
            onSelectImage(initfile)
            if (setfileimage) {
                setfileimage(null)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initfile])

    useEffect(() => {
        if (waitSave) {
            if (!uploadResult.loading && !uploadResult.error) {
                setFiles((x: IFile[]) => x.map(item => item.id === idUpload ? { ...item, url: uploadResult.url } : item))
                setWaitSave(false);
                dispatch(resetUploadFile());
            } else if (uploadResult.error) {
                // const errormessage = uploadResult.code || "error_unexpected_error"
                setFiles((x: IFile[]) => x.map(item => item.id === idUpload ? { ...item, url: uploadResult.url, error: true } : item))
                // dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
            }
        }
    }, [waitSave, uploadResult, dispatch, setFiles, idUpload])

    const onSelectImage = (files: any) => {
        const selectedFile = files[0];
        if(selectedFile.size>15 * 1024 * 1024){
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.filletoobigerror)}))
        }else{
            const idd = new Date().toISOString()
            const fd = new FormData();
            fd.append('file', selectedFile, selectedFile.name);
            setvaluefile('')
            setIdUpload(idd);
            setFiles((x: IFile[]) => [...x, { id: idd, url: '', type: "file" }]);
            dispatch(uploadFile(fd));
            setWaitSave(true)

        }
    }

    return (
        <>
            <input
                name="file"
                accept={undefined}
                id={`laraigo-upload-file`}
                type="file"
                value={valuefile}
                style={{ display: 'none' }}
                onChange={(e) => onSelectImage(e.target.files)}
            />
            <label htmlFor={`laraigo-upload-file`}>
                <Tooltip title={t(langKeys.send_file) + ""} arrow placement="top">
                    <AttachFileIcon className={clsx(classes.iconResponse, { [classes.iconSendDisabled]: waitSave })} />
                </Tooltip>
            </label>
        </>
    )
}
