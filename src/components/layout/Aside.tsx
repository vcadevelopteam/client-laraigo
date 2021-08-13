import React, {  useEffect, useState } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'hooks';

import Collapse from '@material-ui/core/Collapse';
import {
    ChevronLeft,
    ChevronRight,
    ExpandLess,
    ExpandMore,
} from '@material-ui/icons/';
import { RouteConfig } from '@types';
import { Typography } from '@material-ui/core';
import { FC } from 'react';

// const listbuy = ['/purchase-order/load', '/purchase-order/list', '/purchase-order/[id]'];
// const listsend = ['/bill/load', '/bill/list', '/bill/[id]'];

type IProps = {
    open: boolean;
    setOpen: any;
    classes: any;
    theme: any;
    routes: RouteConfig[];
}

type IProps2 = {
    itemName: any;
    listRoutes: any;
    children: any;
    IconLink: any;
}

const whiteIconTheme = createTheme({overrides: {MuiSvgIcon: {
    root: { color: "#FFF", width: 24, height: 24, minWidth: 0 },
},},},);

const LinkList: FC<{ config: RouteConfig, classes: any, open: boolean }> = ({ config, classes, open }) => {
    const history = useHistory();
    const theme = useTheme();

    if (!config.path) {
        return <Typography className={open ? classes.drawerLabel : classes.drawerCloseLabel}>{config.description}</Typography>;
    }

    const isSelected = config.path === history.location.pathname;
    let className = null;
    if (isSelected) {
        className = open ? classes.drawerItemActive : classes.drawerCloseItemActive;
    } else {
        className = open ? classes.drawerItemInactive : classes.drawerCloseItemInactive;
    }
    
    return (
        <ListItem
            button
            key={config.path}
            onClick={() => history.push(config.path!)}
            className={clsx(className)}
        >
            <ListItemIcon>{config.icon?.(className)}</ListItemIcon>
            <ListItemText primary={config.description} style={{ visibility: open ? 'visible' : 'hidden' }} />
        </ListItem>
    );
};

const Aside = ({ open, setOpen, classes, theme, routes }: IProps) => {
    const history = useHistory();
    const dataRes = useSelector(state => state.login);

    const ChevronIcon: FC = () => {
        if (!open) {
            return (
                <ThemeProvider theme={whiteIconTheme}>
                    {theme.direction === 'rtl' ?  <ChevronLeft /> : <ChevronRight />}
                </ThemeProvider>
            );
        } else {
            return theme.direction === 'rtl' ? <ChevronRight color="primary" /> : <ChevronLeft color="primary" />;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ListItemCollapse = ({ itemName, listRoutes, children, IconLink }: IProps2) => {

        const [isCollapse, setIsCollapse] = useState(false);

        useEffect(() => {
            if (history && !isCollapse) {
                if (listRoutes.includes(history.location.pathname))
                    setIsCollapse(true)
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [history]);

        if (!dataRes.user)
            return null;

        return (
            <>
                <ListItem style={{ paddingBottom: '5px', paddingTop: '5px' }} button onClick={() => setIsCollapse(!isCollapse)}>
                    <ListItemIcon style={{ minWidth: '45px' }}><IconLink /></ListItemIcon>
                    <ListItemText primary={itemName} />
                    {isCollapse ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
                </ListItem>
                <Collapse in={isCollapse} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {children}
                    </List>
                </Collapse>
            </>
        )
    }

    return (
        <Drawer
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            variant="permanent"
            anchor="left"
            open={open}
            classes={{
                paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                }),
            }}
        >
            <div className={classes.toolbar}>
                <img src={open ? "./Laraigo-logo-name.svg" : "./Laraigo-logo_white.svg"} style={{ height: 37 }} alt="logo" />
            </div>
            <Divider />
            <div style={{ height: 18 }} />
            {routes.map((ele) => <LinkList classes={classes} config={ele} key={ele.key} open={open} />)}
            <div style={{ flexGrow: 1 }} />
            <div className={classes.toolbar}>
                <IconButton onClick={() => setOpen(!open)}>
                    {/* {theme.direction === 'rtl' ? <ThemeProvider theme={whiteIconTheme}><ChevronRight/></ThemeProvider> : <ChevronLeft color="primary" />} */}
                    <ChevronIcon />
                </IconButton>
            </div>
        </Drawer>
    );
};

export default Aside;