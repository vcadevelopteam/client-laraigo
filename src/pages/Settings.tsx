import React, { FC, useEffect } from 'react';
import { BoxProps, makeStyles, Box, Grid, IconButton } from '@material-ui/core';
import { Title } from 'components';
import { langKeys } from 'lang/keys';
import { Trans } from 'react-i18next';
import { ChannelsIcon, ClassificationIcon, ConfigPropertiesIcon, DomainsIcon, EditPencilIcon, EmojiSadFaceIcon, ForbiddenWordsIcon, WhitelistIcon, IntegrationIcon, SLAIcon, InfoRoundedIcon, Corporation2Icon, OrganizationsIcon, QuickReplyIcon, UserGroupIcon } from 'icons';
import { useDispatch } from 'react-redux';
import { getPropertySettings, getSetting, resetGetPropertySettings, resetGetSetting } from 'store/setting/actions';
import { getCountConfigurationsBody, getPropertyConfigurationsBody } from 'common/helpers';
import { useSelector } from 'hooks';
import { showSnackbar } from 'store/popus/actions';
import { useHistory } from 'react-router';
import paths from 'common/constants/paths';
import InputIcon from '@material-ui/icons/Input';

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
        maxWidth: '50%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        border: `1px solid ${theme.palette.primary.dark}`,
        borderRadius: 4,
        fontSize: 18,
        fontWeight: 700,
    },
    headerIcon: {
        width: 25,
        height: 25,
        fill: 'white',
        stroke: 'white',
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
                        <div style={{ width: 10 }} />
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
    title: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
            <span className={classes.title}>
                {title}
                <div style={{ width: 4 }} />
                <InfoRoundedIcon className={classes.infoIcon} />
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
                            title={<Trans i18nKey={langKeys.maxNumOfTicketsperAdvisor} count={2} />}
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title={(
                                <>
                                    <Trans i18nKey={langKeys.holdOnHolding} />
                                    {' ('}
                                    <Trans i18nKey={langKeys.message} />
                                    {')'}
                                </>
                            )}
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title={(
                                <>
                                    <Trans i18nKey={langKeys.sessionExpirationTIme} />
                                    {' ('}
                                    <Trans i18nKey={langKeys.advisor} />
                                    {')'}
                                </>
                            )}
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
                            title={<Trans i18nKey={langKeys.automaticClosingTime} />}
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title={(
                                <>
                                    <Trans i18nKey={langKeys.holdOnHolding} />
                                    {' ('}
                                    <Trans i18nKey={langKeys.sendingFrequency} />
                                    {')'}
                                </>
                            )}
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title={(
                                <>
                                    <Trans i18nKey={langKeys.sessionExpirationTIme} />
                                    {' ('}
                                    <Trans i18nKey={langKeys.supervisor} />
                                    {')'}
                                </>
                            )}
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
                            title={<Trans i18nKey={langKeys.outOfHoursAction} />}
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title={<Trans i18nKey={langKeys.surveyExpirationTime} />}
                            subtitle="10"
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <PropertyItem
                            title={(
                                <>
                                    <Trans i18nKey={langKeys.sessionExpirationTIme} />
                                    {' ('}
                                    <Trans i18nKey={langKeys.administrator} />
                                    {')'}
                                </>
                            )}
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

const HelpText: FC<{ i18nKey: string, count?: number, onClick?: () => void }> = ({ count, i18nKey, onClick }) => {
    return (
        <span onClick={onClick}>
            {'> '}<Trans i18nKey={i18nKey} count={count} />
        </span>
    );
}

const SubtitleText: FC<{ i18nKey: string, value?: number | null }> = ({ i18nKey, value }) => {
    return (
        <>
            <span style={{ fontWeight: 700 }}>{`${value || 0} `}</span><Trans i18nKey={i18nKey} count={value || 0} />
        </>
    );
}

const Settings: FC = () => {
    const classes = useSettingsStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const setting = useSelector(state => state.setting.setting);
    const propertySettings = useSelector(state => state.setting.propertySettings);

    useEffect(() => {
        dispatch(getSetting(getCountConfigurationsBody()));
        dispatch(getPropertySettings(getPropertyConfigurationsBody()));

        return () => {
            dispatch(resetGetSetting());
            dispatch(resetGetPropertySettings());
        };
    }, [dispatch]);

    useEffect(() => {
        if (propertySettings.loading) return;
        if (propertySettings.error === true) {
            dispatch(showSnackbar({
                message: propertySettings.message || 'Error',
                show: true,
                success: false,
            }));
        }
    }, [propertySettings, dispatch]);

    useEffect(() => {
        if (setting.loading) return;
        if (setting.error === true) {
            dispatch(showSnackbar({
                message: setting.message || 'Error',
                show: true,
                success: false,
            }));
        }
    }, [setting, dispatch]);

    console.log(setting);
    const { value } = setting;
    return (
        <div className={classes.root}>
            <Box ml={2}>
                <Title>
                    <Trans i18nKey={langKeys.setting} count={2} />
                </Title>
            </Box>
            <div style={{ height: 23 }} />
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        {user?.roledesc === "SUPERADMIN" && (
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <ItemTile
                                    title={<Trans i18nKey={langKeys.corporation} count={2} />}
                                    subtitle={<SubtitleText value={1} i18nKey={langKeys.corporation} />}
                                    icon={<Corporation2Icon />}
                                    helpText={
                                        <HelpText
                                            i18nKey={langKeys.manageCorporation}
                                            count={2}
                                            onClick={() => history.push(paths.CORPORATIONS)}
                                        />
                                    }
                                    m={2}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.organization} count={2} />}
                                subtitle={<SubtitleText value={value?.num_org} i18nKey={langKeys.activeOrganization} />}
                                icon={<OrganizationsIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageOrganization}
                                        count={2}
                                        onClick={() => history.push(paths.ORGANIZATIONS)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.channel} count={2} />}
                                subtitle={<SubtitleText value={value?.num_channels} i18nKey={langKeys.activeChannel} />}
                                icon={<ChannelsIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageChannel}
                                        count={2}
                                        onClick={() => history.push(paths.CHANNELS)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.user} count={2} />}
                                subtitle={<SubtitleText value={value?.num_users} i18nKey={langKeys.activeUser} />}
                                icon={<UserGroupIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageUser}
                                        count={2}
                                        onClick={() => history.push(paths.USERS)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.quickreply} count={2} />}
                                subtitle={<SubtitleText value={value?.num_quickreply} i18nKey={langKeys.quickreply} />}
                                icon={<QuickReplyIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageQuickReply}
                                        count={2}
                                        onClick={() => history.push(paths.QUICKREPLIES)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.classification} count={2} />}
                                subtitle={<SubtitleText value={value?.num_classification} i18nKey={langKeys.classification} />}
                                icon={<ClassificationIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageClassification}
                                        count={2}
                                        onClick={() => history.push(paths.TIPIFICATIONS)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>                        
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.inputvalidation} count={2} />}
                                subtitle={<SubtitleText value={value?.num_inputvalidation} i18nKey={langKeys.inputvalidation} />}
                                icon={<InputIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageInputValidation}
                                        count={2}
                                        onClick={() => history.push(paths.INPUTVALIDATION)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.domain} count={2} />}
                                subtitle={<SubtitleText value={value?.num_domain} i18nKey={langKeys.domain} />}
                                icon={<DomainsIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageDomain}
                                        count={2}
                                        onClick={() => history.push(paths.DOMAINS)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.restrictedEmoji} count={2} />}
                                subtitle={<SubtitleText value={value?.num_restricted_emojis} i18nKey={langKeys.restrictedEmoji} />}
                                icon={<EmojiSadFaceIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageRestrictedEmoji}
                                        count={2}
                                        onClick={() => history.push(paths.EMOJIS)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.forbiddenWord} count={2} />}
                                subtitle={<SubtitleText value={value?.num_forbidden_words} i18nKey={langKeys.forbiddenWord} />}
                                icon={<ForbiddenWordsIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageForbiddenWord}
                                        count={2}
                                        onClick={() => history.push(paths.INAPPROPRIATEWORDS)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.integration} count={2} />}
                                subtitle={<SubtitleText value={value?.num_integrations} i18nKey={langKeys.integration} />}
                                icon={<IntegrationIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageIntegration}
                                        count={2}
                                        onClick={() => history.push(paths.INTEGRATIONMANAGER)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.serviceLevelAgreement} count={2} />}
                                subtitle={<SubtitleText value={value?.num_sla} i18nKey={langKeys.agreement} />}
                                icon={<SLAIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.manageAgreement}
                                        count={2}
                                        onClick={() => history.push(paths.SLA)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ItemTile
                                title={<Trans i18nKey={langKeys.whitelist} />}
                                subtitle={<SubtitleText value={value?.num_whitelist} i18nKey={langKeys.whitelist} />}
                                icon={<WhitelistIcon fill="inherit" stroke="inherit" />}
                                helpText={
                                    <HelpText
                                        i18nKey={langKeys.whitelist}
                                        onClick={() => history.push(paths.WHITELIST)}
                                    />
                                }
                                m={2}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <ItemTile
                title={<Trans i18nKey={langKeys.property} count={2} />}
                subtitle={<PropertiesTileBody />}
                icon={<ConfigPropertiesIcon fill="inherit" stroke="inherit" />}
                helpText={
                    <HelpText
                        i18nKey={langKeys.manageproperty}
                        count={2}
                        onClick={() => history.push(paths.PROPERTIES)}
                    />
                }
                m={2}
            />
        </div>
    );
}

export default Settings;
