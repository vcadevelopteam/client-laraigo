/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import Box from "@material-ui/core/Box/Box";
import { langKeys } from "lang/keys";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import SearchField from "components/fields/SearchField";
import { EmojiICon } from "icons";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import { DialogZyx, FieldEdit, FieldMultiSelect, FieldSelect } from "components/fields/templates";
import { useDispatch } from "react-redux";
import { execute, getCollection, getCollectionAux, getMultiCollection, resetMain, resetMainAux, resetMultiMain } from "store/main/actions";
import { getDomainValueSel, getEmojiAllSel, getEmojiGroupSel, getEmojiSel, getOrgsByCorp, updateEmojiOrganization } from "common/helpers";
import { useSelector } from 'hooks';
import { Dictionary, MultiData } from "@types";
import { useForm } from "react-hook-form";
import { Button, Grid, Tooltip } from "@material-ui/core";
import { manageConfirmation } from "store/popus/actions";

interface ModalProps {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    multiData: MultiData[];
    fetchData: () => void;
    emoji: Dictionary;
}

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%'
    },
    containerHeader: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
    root: {
        flexGrow: 1,
        width: '100%',
        paddingTop: theme.spacing(2),
    },
}));

const DetailValue: React.FC<ModalProps> = ({ openModal, setOpenModal, multiData, fetchData, emoji }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const mainAuxResult = useSelector(state => state.main.mainAux);
    const dataOrganization = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const datachannels = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const { handleSubmit, setValue, reset, getValues } = useForm();
    const [allParameters, setAllParameters] = useState({});
    const [channelsOrganization, setChannelsOrganization] = useState<Dictionary[]>([]);
    const [waitSave, setWaitSave] = useState(false);

    const onSubmit = handleSubmit((data) => {
        if (waitSave) {
            const callback = () => {
                dispatch(execute(updateEmojiOrganization({ ...allParameters, emojidec: emoji?.emojidec })));
                dispatch(resetMainAux());
                fetchData();
                setOpenModal(false);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        } else {
            dispatch(resetMainAux());
            setOpenModal(false);
        }
    });

    useEffect(() => {
        if (openModal) {
            reset({
                organization: '',
                favorites: '',
                restricted: ''
            })
        }

        setChannelsOrganization([]);
        setAllParameters({});
        setWaitSave(false);

    }, [openModal]);

    const setValueChannel = (orgid: number) => {
        setChannelsOrganization(mainAuxResult.data.filter(x => x.orgid === orgid));
        setAllParameters({ ...allParameters, ['orgid']: getValues('organization') });
        setWaitSave(false);
    }

    const setFavoritesChange = () => {
        setAllParameters({ ...allParameters, ['favoritechannels']: getValues('favorites') });
        setWaitSave(true);
    }

    const setRestrictedChange = () => {
        setAllParameters({ ...allParameters, ['restrictedchannels']: getValues('restricted') });
        setWaitSave(true);
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.emoji)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <Grid container spacing={1} style={{ paddingBottom: 40 }}>
                <Grid item xs={12} md={6} lg={6}>
                    <h1 style={{ fontSize: 120, margin: 0, textAlign: 'center' }}>{emoji?.emojichar}</h1>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Grid item xs={12} md={12} lg={12} style={{ paddingTop: 20, paddingBottom: 25 }}>
                        <FieldEdit
                            label={t(langKeys.emoji_name)}
                            disabled={true}
                            className="col-6"
                            valueDefault={emoji?.emojidec}
                        />
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <FieldEdit
                            label={t(langKeys.emoji_category_name)}
                            disabled={true}
                            className="col-6"
                            valueDefault={emoji?.categorydesc}
                        />
                    </Grid>

                </Grid>
            </Grid>

            <div className="row-zyx">
                {
                    <FieldEdit
                        label={t(langKeys.corporation)}
                        disabled={true}
                        className="col-6"
                        valueDefault={user?.corpdesc}
                    />
                }
                {
                    <FieldSelect
                        label={t(langKeys.organization)}
                        className="col-6"
                        valueDefault={getValues('organization')}
                        onChange={(value) => {
                            setValue('organization', value.orgid)
                            setValueChannel(value.orgid)
                        }}
                        data={dataOrganization}
                        optionDesc="orgdesc"
                        optionValue="orgid"
                    />
                }
            </div>
            <div className="row-zyx">
                {
                    <FieldMultiSelect
                        label={t(langKeys.emoji_favorites)}
                        className="col-12"
                        onChange={(value) => {
                            setValue('favorites', value.map((o: Dictionary) => o.domainvalue).join())
                            setFavoritesChange();
                        }}
                        valueDefault={channelsOrganization[0]?.favoritechannels}
                        data={datachannels}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                }
                {
                    <FieldMultiSelect
                        label={t(langKeys.emoji_restricted)}
                        className="col-12"
                        onChange={(value) => {
                            setValue('restricted', value.map((o: Dictionary) => o.domainvalue).join())
                            setRestrictedChange();
                        }}
                        valueDefault={channelsOrganization[0]?.restrictedchannels}
                        data={datachannels}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                }
            </div>
        </DialogZyx>
    );
}

const Emojis: FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const emojiResult = useSelector(state => state.main.mainData.data);
    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = useState(0);
    const [emojisFilter, setEmojisFilter] = useState<Dictionary[]>([]);
    const [emojiSelected, setEmojiSelected] = useState<Dictionary>([]);
    const [category, setCategory] = useState('FAVORITES');
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        fetchData();

        dispatch(getMultiCollection([
            getOrgsByCorp(0),
            getDomainValueSel("TIPOCANAL"),
            getEmojiGroupSel(true)
        ]));

        return () => {
            dispatch(resetMainAux());
            dispatch(resetMultiMain());
            dispatch(resetMain());
        };
    }, []);

    useEffect(() => {
        setEmojisFilter(getEmojis());

    }, [category, searchValue]);

    const fetchData = () => dispatch(getCollection(getEmojiAllSel()));

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    const handleDoubleClick = (emoji: Dictionary) => {
        dispatch(getCollectionAux(getEmojiSel(emoji?.emojidec)));
        setEmojiSelected(emoji);
        setOpenDialog(true);
    };

    const handleTabClick = (categorydesc: string) => {
        setCategory(categorydesc);
        setSearchValue('');
    };

    const handleFiend = (searchValue: string) => {
        setSearchValue(searchValue);
    };

    const getEmojis = () => {
        const filteredEmojis = emojiResult.filter(emoji => {
            if (searchValue === null || searchValue.trim().length === 0) {
                switch (category) {
                    case 'FAVORITES': {
                        return emoji?.favorite === true;
                    }
                    case 'RESTRICTED': {
                        return emoji?.restricted === true;
                    }
                    default: {
                        return emoji?.categorydesc === category;
                    }
                }
            } else {
                return emoji?.emojidec.includes(searchValue);
            }
        });

        return filteredEmojis;
    }

    return (
        <div className={classes.container}>

            <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                <span className={classes.title}>
                    {t(langKeys.emoji_plural)}
                </span>
            </Box>

            <div className={classes.root}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="scrollable force tabs example"
                    style={{ paddingBottom: 12 }}
                >
                    {mainResult?.multiData?.data[2]?.data &&
                        mainResult?.multiData?.data[2]?.data?.map(group =>
                            <Tab
                                key={'tab_' + (group?.categoryorder)}
                                label={group?.categorydesc} icon={<EmojiICon />}
                                onClick={() => handleTabClick(group?.categorydesc)}
                            />
                        )
                    }
                </Tabs>

                <SearchField
                    colorPlaceHolder='#EAE9E9'
                    handleChangeOther={handleFiend}
                    lazy
                />

                <Box>
                    <div
                        key='tabPanel_emoji'
                        style={{ padding: 12, backgroundColor: '#fff', marginTop: '12px' }}>
                        {
                            (emojisFilter.length > 0 ? emojisFilter : getEmojis()).map((emoji: Dictionary) =>
                                <Tooltip key={'tooltip_' + emoji?.emojidec} title={emoji?.emojidec} arrow>
                                    <Button
                                        key={'button_' + emoji?.emojidec}
                                        onDoubleClick={() => handleDoubleClick(emoji)}
                                        style={{ padding: 0, fontSize: '30px' }}>
                                        <label
                                            key={'label_' + emoji?.emojidec}
                                            style={{ fontSize: 30 }}>{emoji?.emojichar}</label>
                                    </Button>
                                </Tooltip>
                            )
                        }
                    </div>
                </Box>
            </div>

            <DetailValue
                openModal={openDialog}
                setOpenModal={setOpenDialog}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                emoji={emojiSelected}
            />

        </div>
    )
}

export default Emojis;