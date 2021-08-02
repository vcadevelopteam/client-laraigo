import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useHistory, Link, useLocation } from 'react-router-dom';

// import authContext from 'context/auth/authContext';
import { useSelector } from 'hooks';

// import Link from 'next/link';
// import { useRouter } from 'next/router';
import Collapse from '@material-ui/core/Collapse';
import {
    ChevronLeft,
    ChevronRight,
    VpnKey,
    List as ListIcon,
    AccountCircle,
    ExpandLess,
    ExpandMore,
    LockOpen,
    ShoppingCart,
    Business,
    MonetizationOn,
    Store as StoreIcon,
    ViewComfy,
    BusinessCenter,
    Tune as TuneIcon,
    Label as LabelIcon,
    EmojiTransportation,
    LocalShipping,
} from '@material-ui/icons/';
import { RouteConfig } from '@types';
import { styled, TextField, Typography } from '@material-ui/core';
import { FC } from 'react';
import { useTheme } from '@material-ui/core';

const listbuy = ['/purchase-order/load', '/purchase-order/list', '/purchase-order/[id]'];
const listsend = ['/bill/load', '/bill/list', '/bill/[id]'];

type IProps = {
    // children: any;
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

const LinkList: FC<{config: RouteConfig, classes: any}> = ({ config, classes }) => {
    const history = useHistory();

    if (!config.path) {
        return <Typography className={classes.drawerLabel}>{config.description}</Typography>;
    }

    console.log(config.path, history.location.pathname);
    const isSelected = config.path === history.location.pathname;
    return (
        <ListItem button key={config.path} onClick={() => history.push(config.path!)} className={clsx(isSelected && classes.drawerItemActive)}>
            <ListItemIcon>{config.icon?.(clsx(isSelected && classes.drawerItemActive))}</ListItemIcon>
            <ListItemText primary={config.description} />
        </ListItem>
    );
};

const Aside = ({ open, setOpen, classes, theme, routes } : IProps) => {
    console.log("aaaa");
    const history = useHistory();
    const dataRes = useSelector(state => state.login);

    const handleDrawerClose = () => setOpen(false);

    const ListItemCollapse = ({ itemName, listRoutes, children, IconLink } : IProps2) => {

        const [isCollapse, setIsCollapse] = useState(false);

        useEffect(() => {
            if (history && !isCollapse) {
                if (listRoutes.includes(history.location.pathname))
                    setIsCollapse(true)
            }
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
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.toolbar}>
                <img src="./Laraigo-final-02.svg" style={{ height: 37 }} />
            </div>
            <Divider />

            {routes.map((ele) => <LinkList classes={classes} config={ele} key={ele.path} />)}

            <div className={classes.toolbar}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRight color="primary" /> : <ChevronLeft color="primary" />}
                </IconButton>
            </div>
        </Drawer >
    );
};

export default Aside;