import React, { FC, useState } from 'react';
import { AppBar, Box, Button, Input, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { IOSSwitch } from 'components';
import clsx from 'clsx';

interface TabPanelProps {
    value: string;
    index: string;
}

const useStyles = makeStyles(theme => ({
    root: {
        width: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontWeight: 500,
        fontSize: 32,
        margin: '20px 0',
        color: theme.palette.primary.main,
    },
    subtitle: {
        margin: '8px 0',
        fontSize: 20,
        fontWeight: 500,
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#A59F9F',
    },
    scriptPreview: {
        width: 'inherit',
        height: 111,
        backgroundColor: 'white',
        border: '#A59F9F 1px solid',
        margin: '24px 0',
        padding: theme.spacing(2),
        position: 'relative',
        overflowWrap: 'break-word',
    },
    scriptPreviewGradient: {
        backgroundImage: 'linear-gradient(transparent, white)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    scriptPreviewCopyBtn: {
        height: 45,
        width: 123,
        top: '50%',
        transform: 'translateY(-50%)',
        right: theme.spacing(2),
        position: 'absolute',
        alignSelf: 'center',
    },
    scriptPreviewFullViewTxt: {
        margin: 0,
        position: 'absolute',
        bottom: theme.spacing(1),
        left: '50%',
        transform: 'translateX(-50%)',
        height: 24,

        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',

        '&:hover': {
            cursor: 'pointer',
        }
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        // width: 130,
        height: 45,
        maxWidth: 'unset',
        border: '#A59F9F 1px solid',
        borderRadius: 6,
        backgroundColor: 'white',
        flexGrow: 1,
    },
    activetab: {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
    }
}));

const useTabPanelStyles = makeStyles(theme => ({
    root: {
        border: '#A59F9F 1px solid',
        borderRadius: 6,
    },
}));

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    const classes = useTabPanelStyles();

    return (
        <div
            role="tabpanel"
            hidden={value != index}
            className={classes.root}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export const ChannelAddChatWeb: FC = () => {
    const classes = useStyles();
    const [tabIndex, setTabIndes] = useState('0');

    return (
        <Box className={classes.root}>
            <h2 className={classes.title}>Activate Laraigo on your website</h2>
            <Typography className={classes.subtitle}>
                Copy and paste this code on your site for the chatbot to start attracting customers.
            </Typography>
            <div style={{ height: 8 }} />
            <Typography className={classes.text}>
                Paste it into the {'<body />'} tag in your web page code or send it to your developer.
            </Typography>
            <div className={classes.scriptPreview}>
                asasasssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                <div className={classes.scriptPreviewGradient} />
                <h5 className={classes.scriptPreviewFullViewTxt} onClick={() => console.log('ss')}>
                    Ver completo
                </h5>
                <Button variant="contained" color="primary" className={classes.scriptPreviewCopyBtn}>
                    Copy
                </Button>
            </div>
            <Typography className={classes.text}>Do you want to add the form to you site? <IOSSwitch /></Typography>
            <div style={{ height: 20 }} />
            <AppBar position="static" elevation={0}>
                <Tabs
                    value={tabIndex}
                    onChange={(_, i: string) => setTabIndes(i)}
                    aria-label="simple tabs example"
                    className={classes.tabs}
                    TabIndicatorProps={{ style: { display: 'none' } }}
                >
                    <Tab className={clsx(classes.tab, tabIndex === "0" && classes.activetab)} label="General" value="0" />
                    <Tab className={clsx(classes.tab, tabIndex === "1" && classes.activetab)} label="Bubble" value="1" />
                    <Tab className={clsx(classes.tab, tabIndex === "2" && classes.activetab)} label="interface" value="2" />
                    <Tab className={clsx(classes.tab, tabIndex === "3" && classes.activetab)} label="Form" value="3" />
                    <Tab className={clsx(classes.tab, tabIndex === "4" && classes.activetab)} label="Extras" value="4" />
                    <Tab className={clsx(classes.tab, tabIndex === "5" && classes.activetab)} label="Terms of service" value="5" />
                </Tabs>
            </AppBar>
            <TabPanel value="0" index={tabIndex}>
                <Input />
                <Input />
                <Button variant="contained">Aplicar</Button>
            </TabPanel>
            <TabPanel value="1" index={tabIndex}>two</TabPanel>
            <TabPanel value="2" index={tabIndex}>Three</TabPanel>
            <TabPanel value="3" index={tabIndex}>Four</TabPanel>
            <TabPanel value="4" index={tabIndex}>Five</TabPanel>
            <TabPanel value="5" index={tabIndex}>Six</TabPanel>
        </Box>
    );
};
