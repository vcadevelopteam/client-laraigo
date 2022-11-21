/* eslint-disable react-hooks/exhaustive-deps */
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

import { FC, useState } from 'react';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core/styles';
import { TemplateBreadcrumbs } from 'components';
import { useTranslation } from 'react-i18next';
import { PostCreatorPublish } from 'pages/postcreator/index';
import PostCreatorHistory from './postcreator/PostCreatorHistory';

const getArrayBread = (temporalName: string, viewName: string) => ([
    { id: "view-1", name: viewName || "Post Creator" },
    { id: "view-2", name: temporalName }
]);

const useStyles = makeStyles((theme) => ({
    button: {
        fontSize: '14px',
        fontWeight: 500,
        padding: 12,
        textTransform: 'initial',
    },
    container: {
        width: '100%',
    },
    containerDetails: {
        marginTop: theme.spacing(3),
    },
    containerFilter: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: theme.spacing(2),
        width: '100%',
    },
    containerFilterGeneral: {
        backgroundColor: '#FFF',
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(1),
    },
    containerHeader: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
        display: 'block',
        marginBottom: 0,
    },
    containerSearch: {
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
        alignItems: 'center',
        display: 'flex',
        gap: theme.spacing(1),
        width: '100%',
    },
    filterComponent: {
        maxWidth: '260px',
        minWidth: '220px',
    },
    itemDate: {
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)',
        height: 40,
        minHeight: 40,
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    media: {
        objectFit: "contain",
    },
    title: {
        color: theme.palette.text.primary,
        fontSize: '22px',
        fontWeight: 'bold',
    },
}));

const PostCreator: FC = () => {
    const { t } = useTranslation();

    const classes = useStyles();

    const [viewSelected, setViewSelected] = useState("view-1");

    const handleSelectedString = (key: string) => {
        setViewSelected(key);
    }

    if (viewSelected === "view-1") {
        return (
            <div className={classes.container}>
                <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
                    <span className={classes.title}>
                        {t(langKeys.postcreator_title)}
                    </span>
                </Box>
                <div className={classes.containerDetails}>
                    <Grid container spacing={3}>
                        <Grid item key={"postcreator_publish"} xs={12} md={4} lg={2} style={{ minWidth: 330 }}>
                            <Card >
                                <CardActionArea onClick={() => handleSelectedString("postcreator_publish")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        className={classes.media}
                                        image={'/postcreator-publish.svg'}
                                        title={t(langKeys.postcreator_publish)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div" style={{ fontSize: "130%" }}>
                                            {t(langKeys.postcreator_publish)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        {/*<Grid item key={"postcreator_story"} xs={12} md={4} lg={2} style={{ minWidth: 330 }}>
                            <Card >
                                <CardActionArea onClick={() => handleSelectedString("postcreator_story")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        className={classes.media}
                                        image={'/postcreator-story.svg'}
                                        title={t(langKeys.postcreator_story)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div" style={{ fontSize: "130%" }}>
                                            {t(langKeys.postcreator_story)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>*/}
                        <Grid item key={"postcreator_calendar"} xs={12} md={4} lg={2} style={{ minWidth: 330 }}>
                            <Card >
                                <CardActionArea onClick={() => handleSelectedString("postcreator_calendar")}>
                                    <CardMedia
                                        component="img"
                                        height="130"
                                        className={classes.media}
                                        image={'/postcreator-calendar.svg'}
                                        title={t(langKeys.postcreator_calendar)}
                                        style={{ marginTop: '10px' }}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div" style={{ fontSize: "130%" }}>
                                            {t(langKeys.postcreator_calendar)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item key={"postcreator_posthistory"} xs={12} md={4} lg={2} style={{ minWidth: 330 }}>
                            <Card >
                                <CardActionArea onClick={() => handleSelectedString("postcreator_posthistory")}>
                                    <CardMedia
                                        component="img"
                                        height="130"
                                        className={classes.media}
                                        image={'/postcreator-posthistory.svg'}
                                        title={t(langKeys.postcreator_posthistory)}
                                        style={{ marginTop: '10px' }}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div" style={{ fontSize: "130%" }}>
                                            {t(langKeys.postcreator_posthistory)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    } else if (viewSelected === "postcreator_publish") {
        return (
            <>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={getArrayBread(t('postcreator_publish'), t(langKeys.postcreator_title))}
                        handleClick={handleSelectedString}
                    />
                    <PostCreatorPublish setViewSelected={setViewSelected} />
                </div>
            </>
        )
    } else if (viewSelected === "postcreator_story") {
        return (
            <>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={getArrayBread(t('postcreator_story'), t(langKeys.postcreator_title))}
                        handleClick={handleSelectedString}
                    />
                    <PostCreatorPublish setViewSelected={setViewSelected} />
                </div>
            </>
        )
    } else if (viewSelected === "postcreator_calendar") {
        return (
            <>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={getArrayBread(t('postcreator_calendar'), t(langKeys.postcreator_title))}
                        handleClick={handleSelectedString}
                    />
                    <PostCreatorPublish setViewSelected={setViewSelected} />
                </div>
            </>
        )
    } else if (viewSelected === "postcreator_posthistory") {
        return (
            <>
                <div style={{ width: '100%' }}>
                    <PostCreatorHistory setViewSelected={setViewSelected}  />
                </div>
            </>
        )
    } else {
        return (
            <>{t(langKeys.notavailable)}</>
        )
    }
}

export default PostCreator;