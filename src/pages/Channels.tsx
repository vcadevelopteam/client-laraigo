import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-paginated";
import { useHistory } from "react-router";
import paths from "common/constants/paths";
import { Box, makeStyles, Typography, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { Facebook as FacebookIcon, Instagram as InstagramIcon } from "@material-ui/icons";
import { useState } from "react";

interface StepHeaderProps {
    step: number;
    count: number;
}

interface ChannelOption {
    icon: React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
}

const useChannelAddStyles = makeStyles(theme => ({
    root: {
        maxWidth: 815,
        width: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flexGrow: 1,
        backgroundColor: 'inherit',
        textAlign: 'start',
        padding: '35px 74px',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontWeight: 500,
        fontSize: 32,
        color: theme.palette.primary.main,
        margin: '0 32px',
        textAlign: 'center',
    },
    subtitle: {
        margin: '8px 0 8px 4px',
        fontSize: 20,
        fontWeight: 500,
    },
    optionContainer: {
        margin: 4,
        display: 'flex',
        flexDirection: 'column',
        width: 124,
        height: 110,
        backgroundColor: 'white',
        fontSize: 16,
        fontWeight: 400,
        color: '#A59F9F',
        '&:hover': {
            color: 'white',
            backgroundColor: '#7721AD',
            cursor: 'pointer',
            fontWeight: 700,
        },
    },
}));

const useStepHeaderStyles = makeStyles(theme => ({
    root: {
        width: 'inherit',
        height: 99,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        flexWrap: 'wrap',
    },
    stepContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: 0,
        alignItems: 'center',
    },
    stepSeparatorLine: {
        height: 1,
        width: '100%',
    },
    stepCountGlobe: {
        margin: '0 7px',
        height: 43,
        width: 43,
        borderRadius: 43 / 2,
        backgroundColor: '#E5E5E5',
        color: '#A59F9F',
        textAlign: 'center',
        display: 'flex',
        verticalAlign: 'middle',
    },
    currentStep: {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
    },
    stepCountText: {
       fontWeight: 700, 
       fontSize: 24,
       margin: 'auto',
    },
}));

/**Step counting from 0 */
const StepHeader: FC<StepHeaderProps> = ({ count, step: currentStep }) => {
    const classes = useStepHeaderStyles();

    const StepGlobe: FC<{ step: number }> = ({ step }) => {
        const whiteOrGrey = (statement: boolean) => statement ? 'white' : '#D1CBCB';

        return (
            <div className={classes.stepContainer} style={{ width: `calc(100% / ${count})` }}>
                <div style={{ flexGrow: 1 }}>
                    <div className={classes.stepSeparatorLine} style={{ backgroundColor: whiteOrGrey(step == 0) }} />
                </div>
                <div className={clsx(classes.stepCountGlobe, step == currentStep && classes.currentStep, {  })}>
                    <label className={classes.stepCountText}>{step + 1}</label>
                </div>
                <div style={{ flexGrow: 1 }}>
                    <div className={classes.stepSeparatorLine} style={{ backgroundColor: whiteOrGrey(step == count - 1) }} />
                </div>
            </div>
        );
    };

    return (
        <Box className={classes.root}>
            {Array.apply(null, Array(count)).map((_, i) => <StepGlobe key={`step_globe_${i}`} step={i} />)}
        </Box>
    );
};

export const ChannelAddStep1: FC = () => {
    const classes = useChannelAddStyles();

    const socialMediaOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Facebook',
            onClick: () => {},
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            onClick: () => {},
        },
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Facebook',
            onClick: () => {},
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            onClick: () => {},
        },
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Facebook',
            onClick: () => {},
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            onClick: () => {},
        },
    ];

    const businessChannelOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Facebook',
            onClick: () => {},
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            onClick: () => {},
        },
    ];

    const Option: FC<{ option: ChannelOption }> = ({ option }) => {
        const [color, setColor] = useState('#989898');

        return (
            <Paper
                className={classes.optionContainer}
                elevation={0}
                onClick={option.onClick}
                onMouseOver={() => setColor('white')}
                onMouseLeave={() => setColor('#989898')}
            >
                <div style={{ flexGrow: 2, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    {option.icon}
                </div>
                <div style={{ height: 1, backgroundColor: color }} />
                <div style={{ flexGrow: 1, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    {option.label}
                </div>
            </Paper>
        );
    };

    return (
        <Box className={classes.root}>
            <StepHeader count={4} step={1} />
            <div className={classes.content}>
                <h2 className={classes.title}>We want to know how you communicate</h2>
                <div style={{ height: 29 }} />
                <Typography className={classes.subtitle}>Social Media Channel</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {socialMediaOptions.map((e, i) => <Option key={`social_media_option_${i}`} option={e} />)}
                </div>
                <Typography className={classes.subtitle}>Business Channel</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {businessChannelOptions.map((e, i) => <Option key={`business_channel_option_${i}`} option={e} />)}
                </div>
            </div>
        </Box>
    );
};


export const Channels: FC = () => {
    const { t } = useTranslation();
    const history = useHistory();

    return (
        <div>
            <button onClick={() => history.push(paths.CHANNELS_ADD.resolve(1))}>Agregar</button>
            <TableZyx
                columns={[]}
                titlemodule={t(langKeys.user, { count: 2 })}
                data={[]}
                download={true}
                loading={false}
                register={true}
                hoverShadow={true}
                handleRegister={() => history.push(paths.CHANNELS_ADD.path)}
            />
        </div>
    );
};
