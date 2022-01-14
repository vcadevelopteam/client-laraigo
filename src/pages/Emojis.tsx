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
                        return emoji?.categorydesc === category && !emojiResult.find(x => x.emojidec === emoji?.emojidec && (x?.favorite === true || x?.restricted === true));
                    }
                }
            } else {
                return String(emoji?.description).toLowerCase().includes(searchValue.toLowerCase()) && emoji?.categorydesc === category;
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
                                setEmojiSelected={setEmojiSelected}
                                fetchData={fetchData}
                                category={category}
                            />
                        )
                    }
                </div>
            </div>

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

const Emoji: FC<{ emoji: Dictionary, setEmojiSelected: (emojiSelected: Dictionary) => void, fetchData: () => void, category:string }> = React.memo(({ emoji, setEmojiSelected, fetchData,category }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    //RESTRICTED
    //FAVORITES

    const handleExecution = (favorite: boolean,restricted: boolean) => {
        setAnchorEl(null);

        const callback = () => {
            dispatch(execute(insEmoji({
                ...emoji,
                communicationchannel: "",
                favorite,
                restricted,
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
                <MenuItem key={"menu_item_x_" + emoji?.emojidec} style={{textAlign: "center"}}>{emoji?.description}</MenuItem>
                {category==="FAVORITES" &&
                <>
                    <MenuItem key={"menu_item_1_" + emoji?.emojidec} onClick={() => handleExecution(false,false)}>{t(langKeys.emoji_removefavorites)}</MenuItem>
                    <MenuItem key={"menu_item_2_" + emoji?.emojidec} onClick={() => handleExecution(false,true)}>{t(langKeys.emoji_restricted)}</MenuItem>
                </>
                }
                {category==="RESTRICTED"&&
                 <>
                    <MenuItem key={"menu_item_2_" + emoji?.emojidec} onClick={() => handleExecution(false,false)}>{t(langKeys.emoji_removerestricted)}</MenuItem>
                    <MenuItem key={"menu_item_1_" + emoji?.emojidec} onClick={() => handleExecution(true,false)}>{t(langKeys.emoji_favorites)}</MenuItem>
                 </>
                }
                {(category!=="RESTRICTED" && category!=="FAVORITES") &&
                <>
                    <MenuItem key={"menu_item_1_" + emoji?.emojidec} onClick={() => handleExecution(true,false)}>{t(langKeys.emoji_favorites)}</MenuItem>
                    <MenuItem key={"menu_item_2_" + emoji?.emojidec} onClick={() => handleExecution(false,true)}>{t(langKeys.emoji_restricted)}</MenuItem>
                </>
                    
                }
            </Menu>
        </>
    )
})

export default Emojis;