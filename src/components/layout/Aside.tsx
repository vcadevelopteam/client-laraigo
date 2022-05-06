import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'hooks';

import { RouteConfig } from '@types';
import { Tooltip, Typography } from '@material-ui/core';
import { FC } from 'react';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';

type IProps = {
    classes: any;
    theme: any;
    routes: RouteConfig[];
    headerHeight: number;
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

    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
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
            component="a"
            href={config.path}
        >
            <Tooltip title={config.tooltip}>
                <ListItemIcon>{config.icon?.(className)}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={config.description} style={{ visibility: open ? 'visible' : 'hidden' }} />
        </ListItem>
    );
};

const Aside = ({ classes, theme, routes, headerHeight }: IProps) => {
    const openDrawer = useSelector(state => state.popus.openDrawer);
    const applications = useSelector(state => state.login?.validateToken?.user?.menu);

    const voxiConnection = useSelector(state => state.voximplant.connection);

    return (
        <Drawer
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: openDrawer,
                [classes.drawerClose]: !openDrawer,
            })}
            variant="permanent"
            anchor="left"
            open={openDrawer}
            style={{}}
            classes={{
                paper: clsx("scroll-style-go", {
                    [classes.drawerOpen]: openDrawer,
                    [classes.drawerClose]: !openDrawer,
                }),
            }}
        >
            <div style={{ overflowX: 'hidden', borderRight: '1px solid #EBEAED', marginTop: headerHeight }}>
                {routes.map((ele) => (applications && applications[ele.key] && applications[ele.key][0]) ? <LinkList classes={classes} config={ele} key={ele.key} open={openDrawer} /> : null)}
                {(!voxiConnection.error && !voxiConnection.loading && !openDrawer) && (
                    <div>
                        <ListItem
                            button
                            key={"phone-agent"}
                            onClick={() => {
                                console.log("click en el boton")
                            }}
                            className={clsx(true ? classes.drawerItemActive : classes.drawerItemInactive)}
                            component="div"
                        >
                            <Tooltip title={"Teléfono"}>
                                <ListItemIcon>
                                    <PhoneInTalkIcon style={{ width: 22, height: 22, stroke: 'none' }} className={false ? classes.drawerCloseItemActive : classes.drawerCloseItemInactive} />
                                </ListItemIcon>
                            </Tooltip>
                        </ListItem>
                    </div>
                )}
            </div>
            {(!voxiConnection.error && !voxiConnection.loading && openDrawer) && (
                <div>
                    holaa!
                </div>
            )}

            <Divider />
            <div style={{ flexGrow: 1, borderRight: '1px solid #EBEAED' }} />
        </Drawer>
    );
};

export default Aside;