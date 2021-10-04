import { FC } from "react";
import clsx from 'clsx';
import { List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import { RouteConfig } from "@types";
import { useHistory } from 'react-router-dom';
import { subroutes } from "routes/routes";
import Layout from "./Layout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "store/popus/actions";
import { useSelector } from "hooks";
import { Trans } from "react-i18next";
import { langKeys } from "lang/keys";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        height: 'inherit',
        flexGrow: 1,
        width: '100%',
        maxHeight: 'calc(100vh - 81px)',
    },
    list: {
        width: 182,
        // width: '100%',
        // maxWidth: 182,
        backgroundColor: theme.palette.background.paper,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
        flexDirection: 'column' 
      },
      nested: {
        paddingLeft: theme.spacing(4),
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 700,
        fontStyle: 'normal',
        padding: '20px 17px 6px 17px',
    },
    listItem: {
        padding: '4px 19px',  
    },
    listItemActive: {
        color: theme.palette.primary.main, 
    },
    listItemText: {
        fontWeight: 400,
        fontSize: 14,
        fontStyle: 'normal',
    },
    content: {
        padding: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(2),
        },
        flexGrow: 1,
        overflowY: 'overlay' as any,
        width: `calc(100% - 182px)`,
        overflowX: 'auto'
    },
}));

const ListLink: FC<{ config: RouteConfig }> = ({ config }) => {
    const history = useHistory();
    const classes = useStyles();

    return (
        <ListItem
            button
            key={config.path}
            onClick={() => history.push(config.path!)}
            className={clsx(classes.listItem, history.location.pathname === config.path && classes.listItemActive)}
        >
            <ListItemText primary={config.description} className={classes.listItemText} />
        </ListItem>
    );
};

const ExtrasLayout: FC = ({children}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const openDrawer = useSelector(state =>  state.popus.openDrawer);
    const applications = useSelector(state => state.login?.validateToken?.user?.menu);

    useEffect(() => {
        if (!openDrawer) return;
        // let drawer finish rendering to show the closing transition
        setTimeout(() => dispatch(setOpenDrawer(false)), 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout>
            <div className={classes.root}>
                <List component="nav" className={classes.list}>
                    <label className={classes.subtitle}><Trans i18nKey={langKeys.extra} count={2} /></label>
                    {subroutes.map((e) => (applications && applications[e.key] && applications[e.key][0]) ? <ListLink config={e} key={e.key} /> : null)}
                    <div style={{flexGrow: 1}} />
                </List>
                <div className={classes.content}>
                    {children}
                </div>
            </div>
        </Layout>
    );
};

export default ExtrasLayout;
