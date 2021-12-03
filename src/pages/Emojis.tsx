/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from "react";
import Box from "@material-ui/core/Box/Box";
import { langKeys } from "lang/keys";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import SearchField from "components/fields/SearchField";
import { emojis } from "common/constants";
import { LaraigoAnimalIcon, LaraigoBanderaIcon, LaraigoCaraIcon, LaraigoCarroIcon, LaraigoComidaIcon, LaraigoDeporteIcon, LaraigoFocoIcon, LaraigoHashtagIcon, LaraigoRecienteIcon,LaraigoBlockedIcon } from "icons";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import { DialogZyx, FieldEdit, FieldMultiSelect, FieldSelect } from "components/fields/templates";
import { useDispatch } from "react-redux";
import { execute, getCollection, getCollectionAux, getMultiCollection, getMultiCollectionAux, resetAllMain, resetMainAux } from "store/main/actions";
import { getEmojiAllSel, getEmojiSel, getOrgsByCorp, getValuesFromDomain, insEmoji } from "common/helpers";
import { useSelector } from 'hooks';
import { Dictionary, MultiData } from "@types";
import { useForm } from "react-hook-form";
import { Button, Grid, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { manageConfirmation } from "store/popus/actions";

interface ModalProps {
    fetchData: () => void;
    setOpenModal: (open: boolean) => void;
    multiData: MultiData[];
    emoji: Dictionary;
    openModal: boolean;
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
    }
}));

const Emojis: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const emojiResult = useSelector(state => state.main.mainData.data);
    const [groups, setGroups] = useState<Dictionary>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [emojiSelected, setEmojiSelected] = useState<Dictionary>([]);
    const [category, setCategory] = useState('FAVORITES');
    const [searchValue, setSearchValue] = useState('');

    const fetchData = () => dispatch(getCollection(getEmojiAllSel()));


    const handleFiend = (searchValue: string) => {
        setSearchValue(searchValue);
    };

    const filteredEmojis = useMemo(() =>
        emojis.filter(emoji => {
            if (searchValue === null || searchValue.trim().length === 0) {
                switch (category) {
                    case 'FAVORITES': {
                        return emojiResult.find(x => x.emojidec === emoji?.emojidec && x?.favorite === true);
                    }
                    case 'RESTRICTED': {
                        return emojiResult.find(x => x.emojidec === emoji?.emojidec && x?.restricted === true);
                    }
                    default: {
                        return emoji?.categorydesc === category;
                    }
                }
            } else {
                return String(emoji?.description).toLowerCase().includes(searchValue.toLowerCase());
            }
        }), [category, searchValue, emojis, emojiResult]);

    useEffect(() => {
        fetchData();

        emojis.sort((a, b) => a.categoryorder - b.categoryorder);
        setGroups(Array.from(new Set(Object.values(emojis.map(a => a.categorydesc)))));

        dispatch(getMultiCollection([
            getOrgsByCorp(0)
        ]));

        return () => {
            dispatch(resetAllMain());
        };
    }, []);
    useEffect(() => {
        console.log(groups)
    }, [groups]);

    return (
        <div className={classes.container}>

            <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                <span className={classes.title}>
                    {t(langKeys.emoji_plural)}
                </span>
            </Box>

            <div className={classes.root}>
                <TabEmoji
                    groups={groups}
                    setCategory={setCategory}
                    setSearchValue={setSearchValue}
                />

                <SearchField
                    colorPlaceHolder='#EAE9E9'
                    handleChangeOther={handleFiend}
                    lazy
                />

                <div
                    key='tabPanel_emoji'
                    style={{ padding: 12, marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {
                        filteredEmojis.map((emoji: Dictionary) =>
                            <Emoji
                                key={"menuEmoji_" + emoji?.emojidec}
                                emoji={emoji}
                                setOpenDialog={setOpenDialog}
                                setEmojiSelected={setEmojiSelected}
                                fetchData={fetchData}
                            />
                        )
                    }
                </div>
            </div>

            <EmojiDetails
                openModal={openDialog}
                setOpenModal={setOpenDialog}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                emoji={emojiSelected}
            />

        </div>
    )
}

const TabEmoji: FC<{ groups: Dictionary, setCategory: (categorydesc: any) => void, setSearchValue: (searchValue: any) => any }> = React.memo(({ groups, setCategory, setSearchValue }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState(0);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    const handleTabClick = (categorydesc: string) => {
        setCategory(categorydesc);
        setSearchValue('');
    };

    return (
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
            <Tab
                label={t(langKeys.favorites)} icon={<LaraigoRecienteIcon style={{width:25}}/>}
                onClick={() => handleTabClick("FAVORITES")}
            />
            <Tab
                label={t(langKeys.restricted)} icon={<LaraigoBlockedIcon style={{width:25}}/>}
                onClick={() => handleTabClick("RESTRICTED")}
            />
            <Tab
                label={t(langKeys.smileys)} icon={<LaraigoCaraIcon style={{width:25}}/>}
                onClick={() => handleTabClick("SMILEYS")}
            />
            <Tab
                label={t(langKeys.animals)} icon={<LaraigoAnimalIcon style={{width:25}}/>}
                onClick={() => handleTabClick("ANIMAL")}
            />
            <Tab
                label={t(langKeys.food)} icon={<LaraigoComidaIcon style={{width:25}}/>}
                onClick={() => handleTabClick("FOOD")}
            />
            <Tab
                label={t(langKeys.activities)} icon={<LaraigoDeporteIcon style={{width:25}}/>}
                onClick={() => handleTabClick("ACTIVITY")}
            />
            <Tab
                label={t(langKeys.travel)} icon={<LaraigoCarroIcon style={{width:25}}/>}
                onClick={() => handleTabClick("TRAVEL")}
            />
            <Tab
                label={t(langKeys.objects)} icon={<LaraigoFocoIcon style={{width:25}}/>}
                onClick={() => handleTabClick("OBJECT")}
            />
            <Tab
                label={t(langKeys.symbols)} icon={<LaraigoHashtagIcon style={{width:25}}/>}
                onClick={() => handleTabClick("SYMBOL")}
            />
            <Tab
                label={t(langKeys.flags)} icon={<LaraigoBanderaIcon style={{width:25}}/>}
                onClick={() => handleTabClick("FLAG")}
            />
        </Tabs>
    )
})

const Emoji: FC<{ emoji: Dictionary, setOpenDialog: (openDialog: boolean) => void, setEmojiSelected: (emojiSelected: Dictionary) => void, fetchData: () => void }> = React.memo(({ emoji, setOpenDialog, setEmojiSelected, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDoubleClick = (emoji: Dictionary) => {
        dispatch(getCollectionAux(getEmojiSel(emoji?.emojidec)));
        setEmojiSelected(emoji);
        setOpenDialog(true);
    };

    const handleClick = (event: any) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleExecution = (favorite: boolean) => {
        setAnchorEl(null);

        const callback = () => {
            dispatch(execute(insEmoji({
                ...emoji,
                communicationchannel: "",
                favorite,
                allchannels: true
            })));

            fetchData();
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(favorite ? langKeys.emoji_message_favorites : langKeys.emoji_message_restricted),
            callback
        }))
    };

    const handleOnClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip key={'tooltip_' + emoji?.emojidec} title={emoji?.description} arrow>
                <Button
                    aria-controls="simple-menu" aria-haspopup="true"
                    onContextMenu={handleClick}
                    key={'button_' + emoji?.emojidec}
                    onDoubleClick={() => handleDoubleClick(emoji)}
                    style={{ padding: 0, minWidth: 50 }}>
                    <label
                        key={'label_' + emoji?.emojidec}
                        style={{ fontSize: 30 }}>{emoji?.emojichar}
                    </label>
                </Button>
            </Tooltip>
            <Menu
                key={"simple-menu_" + emoji?.emojidec}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleOnClose}
            >
                <MenuItem key={"menu_item_1_" + emoji?.emojidec} onClick={() => handleExecution(true)}>{t(langKeys.emoji_favorites)}</MenuItem>
                <MenuItem key={"menu_item_2_" + emoji?.emojidec} onClick={() => handleExecution(false)}>{t(langKeys.emoji_restricted)}</MenuItem>
            </Menu>
        </>
    )
})

const EmojiDetails: React.FC<ModalProps> = React.memo(({ fetchData, setOpenModal, multiData, emoji, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const mainAuxResult = useSelector(state => state.main.mainAux);
    const dataOrganization = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const datachannels = useSelector(state => state.main.multiDataAux);
    const [allParameters, setAllParameters] = useState({});
    const [emojiOrganization, setEmojiOrganization] = useState<Dictionary[]>([]);
    const [waitSave, setWaitSave] = useState(false);

    const { handleSubmit, setValue, reset, getValues } = useForm();

    const onSubmit = handleSubmit((data) => {
        if (waitSave) {
            const callback = () => {
                dispatch(execute(insEmoji({
                    ...emoji,
                    ...allParameters,
                    communicationchannel: datachannels?.data[0]?.data.map((o: Dictionary) => o.domainvalue).join(),
                    favorite: false,
                    allchannels: false
                })));

                fetchData();
                dispatch(resetMainAux());
                setOpenModal(false);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    });

    const setValueChannel = (orgid: number) => {
        dispatch(getMultiCollectionAux([getValuesFromDomain(orgid === undefined ? "" : "TIPOCANAL", "", orgid)]));
        setAllParameters({ ...allParameters, orgid: getValues('organization') });
        setWaitSave(false);
        setEmojiOrganization(mainAuxResult.data.filter(x => x.orgid === orgid));
    }

    const setFavoritesChange = () => {
        setAllParameters({ ...allParameters, favoritechannels: getValues('favorites') });
        setWaitSave(true);
    }

    const setRestrictedChange = () => {
        setAllParameters({ ...allParameters, restrictedchannels: getValues('restricted') });
        setWaitSave(true);
    }

    useEffect(() => {
        if (openModal) {
            reset({
                organization: '',
                favorites: '',
                restricted: ''
            })
        }

        dispatch(getMultiCollectionAux([getValuesFromDomain("", "", 0)]));

        setEmojiOrganization([]);
        setAllParameters({});
        setWaitSave(false);

    }, [openModal]);

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
                            valueDefault={emoji?.description}
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
                <FieldEdit
                    label={t(langKeys.corporation)}
                    disabled={true}
                    className="col-6"
                    valueDefault={user?.corpdesc}
                />
                <FieldSelect
                    label={t(langKeys.organization)}
                    className="col-6"
                    valueDefault={getValues('organization')}
                    data={dataOrganization}
                    optionDesc="orgdesc"
                    optionValue="orgid"
                    onChange={(value) => {
                        setValue('organization', value?.orgid)
                        setValueChannel(value?.orgid)
                    }}
                />
            </div>
            <div className="row-zyx">
                <FieldMultiSelect
                    label={t(langKeys.emoji_favorites)}
                    style={{ paddingBottom: 25 }}
                    valueDefault={emojiOrganization[0]?.favoritechannels}
                    data={datachannels?.data[0]?.data}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                    loading={datachannels?.loading}
                    onChange={(value) => {
                        setValue('favorites', value.map((o: Dictionary) => o.domainvalue).join())
                        setFavoritesChange();
                    }}
                />
                <FieldMultiSelect
                    label={t(langKeys.emoji_restricted)}
                    valueDefault={emojiOrganization[0]?.restrictedchannels}
                    data={datachannels?.data[0]?.data}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                    loading={datachannels?.loading}
                    onChange={(value) => {
                        setValue('restricted', value.map((o: Dictionary) => o.domainvalue).join())
                        setRestrictedChange();
                    }}
                />
            </div>
        </DialogZyx>
    );
})

export default Emojis;