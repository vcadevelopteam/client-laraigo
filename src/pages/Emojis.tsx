/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from "react";
import Box from "@material-ui/core/Box/Box";
import { langKeys } from "lang/keys";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import SearchField from "components/fields/SearchField";
import { emojis } from "common/constants/emojis";
import { LaraigoAnimalIcon, LaraigoBanderaIcon, LaraigoCaraIcon, LaraigoCarroIcon, LaraigoComidaIcon, LaraigoDeporteIcon, LaraigoFocoIcon, LaraigoHashtagIcon, LaraigoRecienteIcon, LaraigoBlockedIcon } from "icons";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import { useDispatch } from "react-redux";
import { execute, getCollection, getMultiCollection, resetAllMain } from "store/main/actions";
import { getEmojiAllSel, getOrgsByCorp, insEmoji } from "common/helpers";
import { useSelector } from 'hooks';
import { Dictionary } from "@types";
import { Button, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { manageConfirmation, showBackdrop } from "store/popus/actions";

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
        width: "100%",
        height: '48px',
        color: theme.palette.text.primary,
    },
    root: {
        flexGrow: 1,
        width: '100%',
        paddingTop: theme.spacing(2),
    }
}));

function validateText(X: string, Y: string) {
    const regex = new RegExp(`^(?:${Y}|.* ${Y})`, 'i');
    return regex.test(X);
}

const Emojis: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const emojiResult = useSelector(state => state.main.mainData.data);
    const [groups, setGroups] = useState<Dictionary>([]);
    const [cleanfilter, setcleanfilter] = useState(false);
    const [getEmojiList, setGetEmojiList] = useState(false);
    const [category, setCategory] = useState('FAVORITES');
    const [searchValue, setSearchValue] = useState('');

    const fetchData = () => { setGetEmojiList(true); dispatch(getCollection(getEmojiAllSel())) };


    const handleFiend = (searchValue: string) => {
        setSearchValue(searchValue);
    };

    const filteredEmojis = useMemo(() =>
        emojis.filter(emoji => {
            if (searchValue === null || searchValue.trim().length === 0) {
                switch (category) {
                    case 'FAVORITES': {
                        return emojiResult.find(x => x.emojihex === emoji?.emojihex && x?.favorite === true);
                    }
                    case 'RESTRICTED': {
                        return emojiResult.find(x => x.emojihex === emoji?.emojihex && x?.restricted === true);
                    }
                    default: {
                        return emoji?.categorydesc === category;
                    }
                }
            } else {
                switch (category) {
                    case 'FAVORITES': {
                        return emojiResult.find(x => x.emojihex === emoji?.emojihex && x?.favorite === true && x.description.toLowerCase().includes(searchValue.toLowerCase()))
                    }
                    case 'RESTRICTED': {
                        return emojiResult.find(x => x.emojihex === emoji?.emojihex && x?.restricted === true && x.description.toLowerCase().includes(searchValue.toLowerCase()))
                    }
                    default: {
                        let foundonstring = [...emoji.keywords, emoji.description.toLowerCase(), emoji.description].some(str => str.startsWith(searchValue.toLowerCase()))
                        //return String(emoji?.description).toLowerCase().includes(searchValue.toLowerCase()) && emoji?.categorydesc === category;
                        return (foundonstring || validateText(emoji?.description, searchValue)) // && emoji?.categorydesc === category;
                    }
                }
            }
        }), [category, searchValue, emojis, emojiResult]);

    useEffect(() => {
        if (getEmojiList) {
            if (!mainResult.mainData.loading) {
                setGetEmojiList(false)
                dispatch(showBackdrop(false));
            }
        }
    }, [mainResult.mainData]);
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
                    setcleanfilter={setcleanfilter}
                />

                <SearchField
                    colorPlaceHolder='#EAE9E9'
                    handleChangeOther={handleFiend}
                    lazy
                    cleanState={cleanfilter}
                    setCleanState={setcleanfilter}
                />

                <div
                    key='tabPanel_emoji'
                    style={{ padding: 12, marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {
                        filteredEmojis.map((emoji: Dictionary) =>
                            <Emoji
                                key={"menuEmoji_" + emoji?.emojihex}
                                emoji={emoji}
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

const TabEmoji: FC<{ groups: Dictionary, setCategory: (categorydesc: any) => void, setSearchValue: (searchValue: any) => any, setcleanfilter: (cleanfilter: any) => any }> = React.memo(({ groups, setCategory, setSearchValue, setcleanfilter }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState(0);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    const handleTabClick = (categorydesc: string) => {
        setCategory(categorydesc);
        setSearchValue('');
        setcleanfilter(true)
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
                label={t(langKeys.favorites)} icon={<LaraigoRecienteIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("FAVORITES")}
            />
            <Tab
                label={t(langKeys.restricted)} icon={<LaraigoBlockedIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("RESTRICTED")}
            />
            <Tab
                label={t(langKeys.smileys)} icon={<LaraigoCaraIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("SMILEYS")}
            />
            <Tab
                label={t(langKeys.animals)} icon={<LaraigoAnimalIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("ANIMAL")}
            />
            <Tab
                label={t(langKeys.food)} icon={<LaraigoComidaIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("FOOD")}
            />
            <Tab
                label={t(langKeys.activities)} icon={<LaraigoDeporteIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("ACTIVITY")}
            />
            <Tab
                label={t(langKeys.travel)} icon={<LaraigoCarroIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("TRAVEL")}
            />
            <Tab
                label={t(langKeys.objects)} icon={<LaraigoFocoIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("OBJECT")}
            />
            <Tab
                label={t(langKeys.symbols)} icon={<LaraigoHashtagIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("SYMBOL")}
            />
            <Tab
                label={t(langKeys.flags)} icon={<LaraigoBanderaIcon style={{ width: 25 }} />}
                onClick={() => handleTabClick("FLAG")}
            />
        </Tabs>
    )
})

const Emoji: FC<{ emoji: Dictionary, fetchData: () => void, category: string }> = React.memo(({ emoji, fetchData, category }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [sendIns, setSendIns] = useState(false);
    const executeEmoji = useSelector(state => state.main.execute);

    const handleClick = (event: any) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        if (sendIns) {
            if (!executeEmoji.loading) {
                setSendIns(false);
                fetchData();
            }
        }
    }, [executeEmoji]);

    const handleExecution = (favorite: boolean, restricted: boolean) => {
        setAnchorEl(null);

        const callback = () => {
            setSendIns(true)
            dispatch(showBackdrop(true));
            dispatch(execute(insEmoji({
                ...emoji,
                communicationchannel: "",
                favorite,
                restricted,
                allchannels: true
            })));
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
            <Tooltip key={'tooltip_' + emoji?.emojihex} title={emoji?.description} arrow>
                <Button
                    aria-controls="simple-menu" aria-haspopup="true"
                    onContextMenu={handleClick}
                    key={'button_' + emoji?.emojihex}
                    style={{ padding: 0, minWidth: 50 }}>
                    <label
                        key={'label_' + emoji?.emojihex}
                        style={{ fontSize: 30 }}>{emoji?.emojichar}
                    </label>
                </Button>
            </Tooltip>
            <Menu
                key={"simple-menu_" + emoji?.emojihex}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleOnClose}
            >
                <MenuItem key={"menu_item_x_" + emoji?.emojihex} style={{ textAlign: "center" }}>{emoji?.description}</MenuItem>
                <MenuItem
                    key={`menu_item_1_${emoji?.emojihex}`}
                    onClick={() => handleExecution(
                        category === "RESTRICTED",
                        category === "FAVORITES" || category !== "RESTRICTED"
                    )}
                >
                    {category === "RESTRICTED"
                        ? t(langKeys.emoji_favorites)
                        : t(langKeys.emoji_removefavorites)
                    }
                </MenuItem>
                <MenuItem
                    key={`menu_item_2_${emoji?.emojihex}`}
                    onClick={() => handleExecution(
                        category !== "RESTRICTED",
                        category === "RESTRICTED" || category !== "FAVORITES"
                    )}
                >
                    {category === "RESTRICTED"
                        ? t(langKeys.emoji_removerestricted)
                        : t(langKeys.emoji_restricted)
                    }
                </MenuItem>
            </Menu>
        </>
    )
})

export default Emojis;