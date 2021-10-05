import React, { FC } from 'react';
import { BoxProps, makeStyles, Box, Grid, IconButton } from '@material-ui/core';
import { Title } from 'components';
import { langKeys } from 'lang/keys';
import { Trans } from 'react-i18next';
import { Facebook } from '@material-ui/icons';
import { EditPencilIcon, InfoRoundedIcon } from 'icons';

interface ItemTileProps extends Omit<BoxProps, 'title'> {
    title: React.ReactNode;
    subtitle: React.ReactNode;
    icon: React.ReactNode;
    helpText: React.ReactNode;
}

const useItemTileStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: 'inherit',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    headerLeading: {
        minWidth: 250,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        fill: 'white',
        stroke: 'white',
        border: `1px solid ${theme.palette.primary.dark}`,
        borderRadius: 4,
        fontSize: 18,
        fontWeight: 700,
    },
    headerIcon: {
        width: 25,
        height: 25,
    },
    headerHelpText: {
        fontSize: 14,
        fontWeight: 400,
        color: theme.palette.primary.main,
        cursor: 'pointer',
        alignSelf: 'center',

        '-webkit-touch-callout': 'none', /* iOS Safari */
        '-webkit-user-select': 'none', /* Safari */
        '-khtml-user-select': 'none', /* Konqueror HTML */
        '-moz-user-select': 'none', /* Old versions of Firefox */
        '-ms-user-select': 'none', /* Internet Explorer/Edge */
        'user-select': 'none',

        '&:hover': {
            textDecoration: 'underline',
        }
    },
    body: {
        border: `1px solid #A59F9F`,
        borderRadius: 6,
        padding: 20,
        width: '100%',
        fontSize: 16,
        fontWeight: 400,
    }
}));

const ItemTile: FC<ItemTileProps> = ({ title, subtitle, icon, helpText, ...boxProps }) => {
    const classes = useItemTileStyles();

    return (
        <Box {...boxProps}>
            <div className={classes.root}>
                <div className={classes.header}>
                    <div className={classes.headerLeading}>
                        <span>{title}</span>
                        <span className={classes.headerIcon}>{icon}</span>
                    </div>
                    <span className={classes.headerHelpText}>{helpText}</span>
                </div>
                <div className={classes.body}><Box ml={1} mr={1}>{subtitle}</Box></div>
            </div>
        </Box>
    );
}

interface PropertyItemProps extends Omit<BoxProps, 'title'> {
    title: React.ReactNode;
    subtitle: React.ReactNode;
}

const usePropertyItemStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: 'inherit',
        fontSize: 16,
        fontWeight: 400,
    },
    subtitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '4px 0',
    },
    divider: {
        height: 1,
        backgroundColor: '#A59F9F',
        width: 'inherit',
    },
    editIcon: {
        width: 18,
        height: 18,
        fill: '#7721AD',
    },
    infoIcon: {
        width: 17,
        height: 17,
        fill: '#381052',
    },
}));

const PropertyItem: FC<PropertyItemProps> = ({ title, subtitle, ...boxProps }) => {
    const classes = usePropertyItemStyles();

    return (
        <Box className={classes.root} {...boxProps}>
            <span>
                {title} <InfoRoundedIcon className={classes.infoIcon} />
            </span>
            <div className={classes.subtitle}>
                <span>{subtitle}</span>
                <IconButton color="primary" size="small">
                    <EditPencilIcon className={classes.editIcon} />
                </IconButton>
            </div>
            <div className={classes.divider} />
        </Box>
    );
}

const PropertiesTileBody: FC = () => {
    return (
        <Grid container direction="row">
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title="Maximum number of tickets per advisor"
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title="Maximum number of tickets per advisor"
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title="Maximum number of tickets per advisor"
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title="Maximum number of tickets per advisor"
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title="Maximum number of tickets per advisor"
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title="Maximum number of tickets per advisor"
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title="Maximum number of tickets per advisor"
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title="Maximum number of tickets per advisor"
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title="Maximum number of tickets per advisor"
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

const useSettingsStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
}));

const Settings: FC = () => {
    const classes = useSettingsStyles();

    return (
        <div className={classes.root}>
            <Box ml={2}>
                <Title>
                    <Trans i18nKey={langKeys.configuration} count={2} />
                </Title>
            </Box>
            <div style={{ height: 23 }} />
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title="Organizations"
                                subtitle="1 Active Organizations"
                                icon={<Facebook />}
                                helpText="> Manage Organizations"
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title="Organizations"
                                subtitle="1 Active Organizations"
                                icon={<Facebook />}
                                helpText="> Manage Organizations"
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title="Organizations"
                                subtitle="1 Active Organizations"
                                icon={<Facebook />}
                                helpText="> Manage Organizations"
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title="Organizations"
                                subtitle="1 Active Organizations"
                                icon={<Facebook />}
                                helpText="> Manage Organizations"
                                m={2}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title="Organizations"
                                subtitle="1 Active Organizations"
                                icon={<Facebook />}
                                helpText="> Manage Organizations"
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title="Organizations"
                                subtitle="1 Active Organizations"
                                icon={<Facebook />}
                                helpText="> Manage Organizations"
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title="Organizations"
                                subtitle="1 Active Organizations"
                                icon={<Facebook />}
                                helpText="> Manage Organizations"
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title="Organizations"
                                subtitle="1 Active Organizations"
                                icon={<Facebook />}
                                helpText="> Manage Organizations"
                                m={2}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <ItemTile
                title="Properties"
                subtitle={<PropertiesTileBody />}
                icon={<Facebook />}
                helpText="> Manage Properties"
                m={2}
            />
        </div>
    );
}

export default Settings;
