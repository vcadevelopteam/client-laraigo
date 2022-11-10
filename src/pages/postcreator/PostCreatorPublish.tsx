/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from "react";
import TableZyx from "components/fields/table-simple";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { Button, Tabs, TextField } from "@material-ui/core";
import { getCollection, getMultiCollection, resetMultiMain } from "store/main/actions";
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { useTranslation } from "react-i18next";
import { AntTab, FieldView, FieldEditAdvanced } from 'components';
import { FacebookColor, InstagramColor, TwitterColor, YouTubeColor, LinkedInColor, TikTokColor } from "icons";

const useStyles = makeStyles((theme) => ({
    containerLeft: {
        [theme.breakpoints.down('xs')]: {
            minWidth: '100vw',
            height: '100vh',
        },
        flex: 1,
        overflowY: 'auto',
        margin: 4,
        border: '1px solid #762AA9',
        borderRadius: '4px',
    },
    root: {
        backgroundColor: 'white',
        flex: 1,
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: 16,
        width: '100%',
    },
}));

export const PostCreatorPublish: FC = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main.mainData);
    const multiResult = useSelector(state => state.main.multiData);

    const [pageSelected, setPageSelected] = useState(0);

    return (
        <React.Fragment>
            <div style={{ width: '100%' }}>
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ border: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.postcreator_publish_text)} />
                    <AntTab label={t(langKeys.postcreator_publish_textimage)} />
                    <AntTab label={t(langKeys.postcreator_publish_textvideo)} />
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishText dataChannel={null} publishType={'TEXT'} />
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishText dataChannel={null} publishType={'IMAGE'} />
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishText dataChannel={null} publishType={'VIDEO'} />
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

const PublishText: React.FC<{ dataChannel: any, publishType: string }> = ({ dataChannel, publishType }) => {
    const classes = useStyles();

    const { t } = useTranslation();

    const [filterCheckBox, setFilterCheckBox] = useState({
        ASIGNADO: false,
        CERRADO: false,
        SUSPENDIDO: false
    })

    return (
        <Fragment>
            <div style={{ display: "flex", flexDirection: 'row', height: '100%', overflow: 'overlay', flexWrap: 'wrap' }}>
                <div className={classes.containerLeft}>
                    <div className={classes.root}>
                        <div className="row-zyx" style={{ marginBottom: '0px' }}>
                            <FieldView
                                className="col-12"
                                label={''}
                                value={t(langKeys.postcreator_publish_pages)}
                                styles={{ fontWeight: 'bold', color: '#762AA9' }}
                            />
                        </div>
                        <div className="row-zyx">
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div style={{ width: '100%', flex: '50%' }}>
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                checked={true}
                                                color="primary"
                                                onChange={(e) => setFilterCheckBox({ ...filterCheckBox, ASIGNADO: e.target.checked })}
                                                name="Facebook" />
                                        )}
                                        label={
                                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <FacebookColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                <span>Facebook</span>
                                            </div>
                                        }
                                    />
                                </div>
                                <div style={{ width: '100%', flex: '50%' }}>
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                checked={true}
                                                color="primary"
                                                onChange={(e) => setFilterCheckBox({ ...filterCheckBox, ASIGNADO: e.target.checked })}
                                                name="Intagram" />
                                        )}
                                        label={
                                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <InstagramColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                <span>Intagram</span>
                                            </div>
                                        }
                                    />
                                </div>
                                <div style={{ width: '100%', flex: '50%' }}>
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                checked={true}
                                                color="primary"
                                                onChange={(e) => setFilterCheckBox({ ...filterCheckBox, ASIGNADO: e.target.checked })}
                                                name="LinkedIn" />
                                        )}
                                        label={
                                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <LinkedInColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                <span>LinkedIn</span>
                                            </div>
                                        }
                                    />
                                </div>
                                <div style={{ width: '100%', flex: '50%' }}>
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                checked={true}
                                                color="primary"
                                                onChange={(e) => setFilterCheckBox({ ...filterCheckBox, ASIGNADO: e.target.checked })}
                                                name="TikTok" />
                                        )}
                                        label={
                                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <TikTokColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                <span>TikTok</span>
                                            </div>
                                        }
                                    />
                                </div>
                                <div style={{ width: '100%', flex: '50%' }}>
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                checked={true}
                                                color="primary"
                                                onChange={(e) => setFilterCheckBox({ ...filterCheckBox, ASIGNADO: e.target.checked })}
                                                name="Twitter" />
                                        )}
                                        label={
                                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <TwitterColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                <span>Twitter</span>
                                            </div>
                                        }
                                    />
                                </div>
                                <div style={{ width: '100%', flex: '50%' }}>
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                checked={true}
                                                color="primary"
                                                onChange={(e) => setFilterCheckBox({ ...filterCheckBox, ASIGNADO: e.target.checked })}
                                                name="YouTube" />
                                        )}
                                        label={
                                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <YouTubeColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                                <span>YouTube</span>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row-zyx" style={{ marginBottom: '0px', height: '10px' }}>
                            <FieldView
                                className="col-12"
                                label={''}
                                value={t(langKeys.text)}
                                styles={{ fontWeight: 'bold', color: '#762AA9' }}
                            />
                        </div>
                        <div className="row-zyx" style={{ marginBottom: '0px' }}>
                            <FieldEditAdvanced
                                className="col-12"
                                error={''}
                                label={''}
                                maxLength={125}
                                onChange={(value) => { }}
                                rows={(publishType === 'TEXT' ? 12 : 6)}
                                valueDefault={''}
                                disabled={false}
                                style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                emoji={true}
                                hashtag={true}
                            />
                        </div>
                        <div className="row-zyx" style={{ marginTop: '0px', marginLeft: '6px' }}>
                            <span>
                                {t(langKeys.postcreator_publish_textrecommendation)}
                            </span>
                            <span>
                                {t(langKeys.postcreator_publish_textrecommendation01)}
                            </span>
                        </div>
                        {publishType === 'IMAGE' && <>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    value={t(langKeys.postcreator_publish_image)}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                />
                            </div>
                        </>}
                        {publishType === 'VIDEO' && <>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    value={t(langKeys.postcreator_publish_video)}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                />
                            </div>
                        </>}
                    </div>
                </div>
                <div className={classes.containerLeft}>
                    <div className={classes.root}>
                        AYY LMAO
                    </div>
                </div>
                <div className={classes.containerLeft}>
                    <div className={classes.root}>
                        AYY LMAO
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default PostCreatorPublish;