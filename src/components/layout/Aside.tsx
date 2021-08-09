import React, {  useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useHistory } from 'react-router-dom';

// import authContext from 'context/auth/authContext';
import { useSelector } from 'hooks';

// import Link from 'next/link';
// import { useRouter } from 'next/router';
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

const LinkList: FC<{ config: RouteConfig, classes: any }> = ({ config, classes }) => {
    const history = useHistory();
    const theme = useTheme();

    if (!config.path) {
        return <Typography className={classes.drawerLabel}>{config.description}</Typography>;
    }

    const isSelected = config.path === history.location.pathname;
    return (
        <ListItem
            button
            key={config.path}
            onClick={() => history.push(config.path!)}
            className={clsx(isSelected && classes.drawerItemActive)}
        >
            <ListItemIcon>{config.icon?.(isSelected ? theme.palette.primary.main : "#8F92A1")}</ListItemIcon>
            <ListItemText primary={config.description} />
        </ListItem>
    );
};

const Aside = ({ open, setOpen, classes, theme, routes }: IProps) => {
    const history = useHistory();
    const dataRes = useSelector(state => state.login);

    const handleDrawerClose = () => setOpen(false);

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
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.toolbar}>
                <img src="./Laraigo-logo-name.svg" style={{ height: 37 }} alt="logo" />
            </div>
            <Divider />
            <div style={{ height: 18 }} />
            {routes.map((ele) => <LinkList classes={classes} config={ele} key={ele.key} />)}
            <div style={{ flexGrow: 1 }} />
            <div className={classes.toolbar}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRight color="primary" /> : <ChevronLeft color="primary" />}
                </IconButton>
            </div>
        </Drawer>
    );
};

export default Aside;