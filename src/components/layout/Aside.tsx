import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'hooks';

import {
    Menu,
} from '@material-ui/icons/';
import { RouteConfig } from '@types';
import { Tooltip, Typography } from '@material-ui/core';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { setOpenDrawer } from 'store/popus/actions';

type IProps = {
    classes: any;
    theme: any;
    routes: RouteConfig[];
}

const LinkList: FC<{ config: RouteConfig, classes: any, open: boolean }> = ({ config, classes, open }) => {
    const history = useHistory();

    if (!config.path) {
        return <Typography className={open ? classes.drawerLabel : classes.drawerCloseLabel}>{config.description}</Typography>;
    }

    const isSelected = !config.subroute ? config.path === history.location.pathname : history.location.pathname.includes(config.path);
    let className = "";
    if (isSelected) {
        className = open ? classes.drawerItemActive : classes.drawerCloseItemActive;
    } else {
        className = open ? classes.drawerItemInactive : classes.drawerCloseItemInactive;
    }

    const onClick = () => {
        if (!config.subroute) {
            history.push(config.path!)
        } else {
            if (config.initialSubroute) {
                history.push(config.initialSubroute);
            } else {
                const message = `initialSubroute debe tener valor para la subruta key:${config.key} path:${config.path}`;
                console.assert(config.initialSubroute != null || config.initialSubroute !== undefined, message);
            }
        }
    }

    return (
        <ListItem
            button
            key={config.path}
            onClick={onClick}
            className={clsx(className)}

        >
            <Tooltip title={config.tooltip}>
                <ListItemIcon>{config.icon?.(className)}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={config.description} style={{ visibility: open ? 'visible' : 'hidden' }} />
        </ListItem>
    );
};

const Aside = ({ classes, theme, routes }: IProps) => {
    const dispatch = useDispatch();
    const openDrawer = useSelector(state => state.popus.openDrawer);
    const applications = useSelector(state => state.login?.validateToken?.user?.menu);

    return (
        <Drawer
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: openDrawer,
                [classes.drawerClose]: !openDrawer,
            })}
            variant="permanent"
            anchor="left"
            open={openDrawer}
            classes={{
                paper: clsx("scroll-style-go", {
                    [classes.drawerOpen]: openDrawer,
                    [classes.drawerClose]: !openDrawer,
                }),
            }}
        >
            <div className={classes.toolbar}>
                {/* <IconButton onClick={() => dispatch(setOpenDrawer(!openDrawer))}>
                    <Menu />
                </IconButton>
                <img
                    src="/Laraigo-logo-name.svg"
                    style={{ height: 37 }}
                    alt="logo"
                /> */}
            </div>
            <Divider />
            <div style={{ height: 18 }} />
            <div style={{ overflowX: 'hidden' }}>
            {routes.map((ele) => (applications && applications[ele.key] && applications[ele.key][0]) ? <LinkList classes={classes} config={ele} key={ele.key} open={openDrawer} /> : null)}
            </div>
            <div style={{ flexGrow: 1 }} />
        </Drawer>
    );
};

export default Aside;