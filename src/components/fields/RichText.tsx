/* eslint-disable react-hooks/exhaustive-deps */
import { Box, BoxProps, IconButton, IconButtonProps, Menu, TextField, Toolbar, makeStyles, Button, InputAdornment, Tabs, FormHelperText, CircularProgress, Tooltip, SelectProps, FormControl, Select, MenuItem, ClickAwayListener, Divider, Popper, Fade } from '@material-ui/core';
import {
    FormatBold as FormatBoldIcon,
    FormatItalic as FormatItalicIcon,
    FormatUnderlined as FormatUnderlinedIcon,
    Code as FormatCodeIcon,
    LooksOne as FormatLooksOneIcon,
    LooksTwo as FormatLooksTwoIcon,
    FormatQuote as FormatQuoteIcon,
    FormatListNumbered as FormatListNumberedIcon,
    FormatListBulleted as FormatListBulletedIcon,
    InsertPhoto as InsertPhotoIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    FormatSize as FormatSizeIcon,
    Check as CheckIcon,
    FormatColorText as FormatColorTextIcon,
    FormatAlignRight as FormatAlignRightIcon,
    FormatAlignCenter as FormatAlignCenterIcon,
    EmojiEmotions as EmojiEmotionsIcon,
    FormatAlignLeft as FormatAlignLeftIcon,
    FormatColorText,
    Undo as UndoIcon,
    Redo as RedoIcon,
} from '@material-ui/icons';
import { emojis } from "common/constants/emojis";
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, BaseEditor, Descendant, Transforms, Editor, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, ReactEditor, useSlate, useSlateStatic, useSelected, useFocused } from 'slate-react';
import { HistoryEditor, withHistory } from 'slate-history';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import ReactDomServer from 'react-dom/server';
import { AntTab } from 'components';
import clsx from 'clsx';
import { useSelector } from 'hooks';
import { resetUploadFile, uploadFile } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'store/popus/actions';
import { ArrowDropDownIcon, QuickresponseIcon, SearchIcon } from 'icons';
import Picker from '@emoji-mart/react'
import { Dictionary, IFile } from '@types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const EMOJISINDEXED = emojis.reduce((acc: any, item: any) => ({ ...acc, [item.emojihex]: item }), {});

export const renderToString = (element: React.ReactElement) => {
    return ReactDomServer.renderToString(element);
}

export const toElement = (value: Descendant[], root: FC = ({ children }) => <div>{children}</div>): React.ReactElement => {
    let children: React.ReactNode[] = [];
    for (const item of value) {
        if (item.hasOwnProperty('type') && item.hasOwnProperty('children')) {
            const element = item as CustomElement;
            children.push(toElement(
                element.children,
                ({ children }) => renderElement({
                    element,
                    children,
                    isStatic: true,
                    attributes: { key: element },
                }),
            ));
        } else {
            const text = item as CustomText;
            children.push(renderLeaf({
                leaf: text,
                text: text,
                children: text.text,
                attributes: { key: text },
            }));
        }
    }

    return root({ children })!;
}

const LIST_TYPES = ['bulleted-list', 'numbered-list'];
type ElemetType = 'paragraph' | 'block-quote' | 'heading-one' | 'heading-two' | 'list-item' | 'bulleted-list' | 'numbered-list' | 'image-src' | "alignment";
interface CustomElement extends Object {
    type: ElemetType;
    children: CustomElement[] | CustomText[];
    url?: string | null;
    align: "left" | "center" | "right";
}

interface CustomText extends Object {
    text: string;
    bold?: boolean;
    italic?: boolean;
    fontfamily?: string;
    textalign?: string;
    fontsize?: string;
    color?: string;
    backgroundcolor?: string;
    code?: boolean;
    underline?: boolean;
}

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

interface RichTextProps extends Omit<BoxProps, 'onChange'> {
    placeholder?: string;
    spellCheck?: boolean;
    value: Descendant[];
    error?: string;
    onChange: (value: Descendant[]) => void;
    onlyurl?: boolean;
    image?: Boolean;
    children?: React.ReactNode;
    endinput?: React.ReactNode;
    positionEditable?: 'top' | 'bottom';
    refresh?: number;
    emojiNoShow?: any;
    emojiFavorite?: any;
    emoji?: Boolean;
    quickReplies?: any[];
    setFiles?: (param: any) => void;
    collapsed?: boolean
}

interface RenderElementProps {
    attributes?: any;
    children: React.ReactNode;
    element: CustomElement;
    isStatic?: boolean;
}

interface RenderLeafProps {
    attributes?: any;
    children: React.ReactNode;
    leaf: Omit<CustomText, 'text'>;
    text: CustomText;
}

type RenderElement = (props: RenderElementProps) => JSX.Element;
type RenderLeaf = (props: RenderLeafProps) => JSX.Element;
type StaticRenderElement = (props: { element: CustomElement, children: any }) => JSX.Element;

const useRichTextStyles = makeStyles(theme => ({
    toolbar: {
        padding: 0,
        width: "100%"
    },
    editable: {
        height: 200,
        overflowY: "scroll",
        overflowX: "hidden",
        width: "100%",
        direction: "ltr",
    },
    littleboxes: {
        cursor: "pointer",
        marginRight: 1,
        width: 16,
        height: 16
    },
    paper: {
        background: 'white',
        backgroundColor: theme.palette.background.paper,
        zIndex: 10,
        '& .MuiIconButton-root': {
            padding: '5px',
            fontSize: '10px'
        }
     },
    toolbarOptionsIcons: {
        padding: '5px'
    }
}));

interface EmojiPickerZyxProps {
    emojisIndexed?: Dictionary[];
    emojisNoShow?: string[];
    emojiFavorite?: string[];
    onSelect: (e: any) => void;
    style?: React.CSSProperties;
    icon?: (onClick: () => void) => React.ReactNode;
}
const QuickResponseStyles = makeStyles((theme) => ({
    iconResponse: {
        //cursor: 'pointer',
        //poisition: 'relative',
        color: '#2E2C34',
        //'&:hover': {
        //    // color: theme.palette.primary.main,
        //    backgroundColor: '#EBEAED',
        //    borderRadius: 4
        //}
    },
    containerQuickReply: {
        boxShadow: '0px 3px 6px rgb(0 0 0 / 10%)',
        backgroundColor: '#FFF',
        width: 250,
    },
    headerQuickReply: {
        fontSize: 14,
        fontWeight: 500,
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(1.5),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
}));

interface QuickReplyProps {
    quickReplies: any[];
    editor: BaseEditor & ReactEditor;
    setFiles?: (param: any) => void
}

export const QuickReply: React.FC<QuickReplyProps> = ({ quickReplies, editor, setFiles}) => {
    const classes = QuickResponseStyles();
    const [open, setOpen] = React.useState(false);
    const [quickRepliesToShow, setquickRepliesToShow] = useState<Dictionary[]>([])
    const handleClick = () => setOpen((prev) => !prev);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const { t } = useTranslation();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const user = useSelector(state => state.login.validateToken.user);

    const handleClickAway = () => setOpen(false);

    useEffect(() => {
        if (search === "") {
            setquickRepliesToShow(quickReplies.filter(x => !!x.favorite))
        } else {
            setquickRepliesToShow(quickReplies.filter(x => x.description.toLowerCase().includes(search.toLowerCase())))
        }
    }, [search, quickReplies])

    const handlerClickItem = (item: Dictionary) => {
        if (item.quickreply_type === 'CORREO ELECTRONICO') {
            editor.insertFragment(item.bodyobject)
        } else {
            editor.insertText(item.quickreply
                .replace("{{numticket}}", ticketSelected?.ticketnum)
                .replace("{{client_name}}", ticketSelected?.displayname)
                .replace("{{agent_name}}", user?.firstname + " " + user?.lastname)
            );
        }
        if (item.attachment && setFiles) {
            const attachments = item.attachment.split(',')
            attachments.forEach((element: string, index: number) => {
                const uid = new Date().toISOString() + '_' + index;
                setFiles((x: IFile[]) => [...x, { id: uid, url: element, type: 'file' }]);
            });
        }
        setOpen(false);
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <span>
                <Tooltip title={t(langKeys.send_quickreply) + ""} arrow placement="top">
                    <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                        <QuickresponseIcon className={classes.iconResponse}/>
                    </IconButton>
                </Tooltip>
                {open && (
                    <div style={{
                        position: 'absolute',
                        bottom: 60,
                        zIndex: 1201
                    }}>
                        <div className={classes.containerQuickReply}>
                            <div>
                                {!showSearch ?
                                    <div className={classes.headerQuickReply}>
                                        <div >User Quick Response</div>
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowSearch(true)} edge="end"
                                        >
                                            <SearchIcon />
                                        </IconButton>

                                    </div>
                                    :
                                    <TextField
                                        color="primary"
                                        fullWidth
                                        autoFocus
                                        placeholder="Search quickreplies"
                                        style={{ padding: '6px 6px 6px 12px' }}
                                        onBlur={() => !search && setShowSearch(false)}
                                        onChange={e => setSearch(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small">
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                }
                            </div>
                            <Divider />
                            <List component="nav" disablePadding style={{ maxHeight: 200, overflowY: 'overlay' as any }}>
                                {quickRepliesToShow.map((item) => (
                                    <ListItem
                                        button
                                        key={item.quickreplyid}
                                        onClick={() => handlerClickItem(item)}
                                    >
                                        <Tooltip title={item.quickreply} arrow placement="top">
                                            <ListItemText primary={item.description} />
                                        </Tooltip>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </div>
                )}
            </span>
        </ClickAwayListener>
    )
}
export const EmojiPickerZyx: React.FC<EmojiPickerZyxProps> = ({ emojisIndexed, emojisNoShow = [], emojiFavorite = [], onSelect, icon }) => {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => setOpen((prev) => !prev);
    const { t } = useTranslation();
    const handleClickAway = () => setOpen(false);
    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <span >
                {icon?.(handleClick) || (
                    <Tooltip title={t(langKeys.send_emoji) + ""} arrow placement="top">
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <EmojiEmotionsIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {open && (
                    <div style={{
                        position: 'absolute',
                        bottom: 100,
                        zIndex: 1200
                    }}>
                        <Picker
                            onEmojiSelect={(e) => { setOpen(false); onSelect(e) }}
                            previewPosition="none"
                            theme="light"
                            locale="custom"
                            skinTonePosition="none"
                            emojiVersion={12}
                            i18n={{
                                search: t(langKeys.search),
                                categories: {
                                    search: t(langKeys.search_result),
                                    recent: t(langKeys.favorites),
                                    smileys: t(langKeys.emoticons),
                                    people: t(langKeys.emoticons),
                                    animals: t(langKeys.animals),
                                    nature: t(langKeys.animals),
                                    food: t(langKeys.food),
                                    activities: t(langKeys.activities),
                                    places: t(langKeys.travel),
                                    objects: t(langKeys.objects),
                                    symbols: t(langKeys.symbols),
                                    flags: t(langKeys.flags),
                                    // Agrega más categorías si es necesario
                                },
                                "skins": {
                                    "choose": "Elige el tono de piel predeterminado",
                                    "1": "Sin tono",
                                    "2": "Claro",
                                    "3": "Medio-Claro",
                                    "4": "Medio",
                                    "5": "Medio-Oscuro",
                                    "6": "Oscuro"
                                }
                            }}
                            recent={emojiFavorite.length > 0 ? emojiFavorite?.map(x => (emojisIndexed as Dictionary)?.[x || ""]?.id || '') : undefined}
                            emojisToShowFilter={emojisNoShow && emojisNoShow.length > 0 ? (emoji: any) => emojisNoShow.map(x => x.toUpperCase()).indexOf(emoji.unified.toUpperCase()) === -1 : undefined}
                        />
                    </div>
                )}
            </span>
        </ClickAwayListener>
    )
}

const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

/**TODO: Validar que la URL de la imagen sea valida en el boton de insertar imagen */
export const RichText: FC<RichTextProps> = ({
    value,
    refresh = 0,
    onChange,
    placeholder,
    image = true,
    spellCheck,
    error,
    positionEditable = "bottom",
    children,
    onlyurl = false,
    endinput,
    emojiNoShow,
    emojiFavorite,
    emoji = false,
    quickReplies = [],
    setFiles,
    collapsed = false,
    ...boxProps
}) => {
    const classes = useRichTextStyles();
    const editor: BaseEditor & ReactEditor = useMemo(
        () => withImages(withHistory(withReact(createEditor()))),
        []
    );
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'transitions-popper' : undefined;
    

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    useEffect(() => {
        //evitar q en cada cmbio re-renderice, solo en casos q el componente q llama lo requiera (ejemplo replypanel)
        if (editor?.children) {
            editor.selection = {
                anchor: { path: [0, 0], offset: 0 },
                focus: { path: [0, 0], offset: 0 },
            };
            editor.children = value;
        }
    }, [refresh]);

    return (
        <Box {...boxProps}>
            <Slate editor={editor} value={value} onChange={onChange}>
                {positionEditable === "top" && (
                    <div className={classes.editable}>
                        <Editable
                            placeholder={placeholder}
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            spellCheck={spellCheck}
                        />
                    </div>
                )}
                <Toolbar className={classes.toolbar}>
                    <div>
                        {collapsed && (
                            <>
                                <IconButton onClick={handleClick}>
                                    <FormatColorText />
                                </IconButton>
                                <Popper id={id} className={classes.paper} open={open} anchorEl={anchorEl} placement={'top-start'} transition>
                                    {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={350}>
                                        <div
                                        style={{
                                            padding: collapsed ? "8px 8px" : "0px",
                                            display: "flex",
                                            alignItems: "center",
                                            boxShadow: '0px 4px 5px 0px rgba(0,0,0,.14),0px 1px 10px 0px rgba(0,0,0,.12),0px 2px 4px -1px rgba(0,0,0,.2)'
                                        }}
                                    >
                                        <ToolBarOptions
                                            value={value}
                                            onChange={onChange}
                                            emoji={emoji}
                                            quickReplies={quickReplies}
                                            editor={editor as BaseEditor & ReactEditor & HistoryEditor}
                                            image={image}
                                            onlyurl={onlyurl}
                                            emojiNoShow={emojiNoShow}
                                            emojiFavorite={emojiFavorite}
                                            collapsed={collapsed}
                                        />
                                    </div>
                                    </Fade>
                                    )}
                                </Popper>
                            </>
                        )}
                        <div style={{ display: "inline-block" }}>{children}</div>
                        {quickReplies.length > 0 && (
                            <QuickReply quickReplies={quickReplies} editor={editor} setFiles={setFiles}></QuickReply>
                        )}
                        {emoji && (
                            <EmojiPickerZyx
                                emojisIndexed={EMOJISINDEXED}
                                onSelect={(e) => editor.insertText(e.native)}
                                emojisNoShow={emojiNoShow}
                                emojiFavorite={emojiFavorite}
                            />
                        )}

                        {!collapsed && (
                            <ToolBarOptions
                                value={value}
                                onChange={onChange}
                                emoji={emoji}
                                quickReplies={quickReplies}
                                editor={editor as BaseEditor & ReactEditor & HistoryEditor}
                                image={image}
                                onlyurl={onlyurl}
                                emojiNoShow={emojiNoShow}
                                emojiFavorite={emojiFavorite}
                                collapsed={collapsed}
                            />
                        )}
                    </div>
                    <div style={{ marginLeft: "auto", marginRight: 0 }}>{endinput}</div>
                </Toolbar>
                {positionEditable !== "top" && (
                    <Editable
                        placeholder={placeholder}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        spellCheck={spellCheck}
                        style={{ borderTop: "1.5px dotted #949494" }}
                    />
                )}
            </Slate>
            {error && error !== "" && <FormHelperText error>{error}</FormHelperText>}
        </Box>
    );
};

const ToolBarOptions: React.FC<
    RichTextProps & { editor: BaseEditor & ReactEditor & HistoryEditor; collapsed: boolean }
> = ({ image, onlyurl }) => {
    const upload = useSelector((state) => state.main.uploadFile);
    const editor = useSlate()
    const { t } = useTranslation();

    const handleUndo = () => {
        if (editor.history.undos.length > 0) {
            editor.undo();
            ReactEditor.focus(editor);
        }
    };

    const handleRedo = () => {
        if (editor.history.redos.length > 0) {
            editor.redo();
            ReactEditor.focus(editor);
        }
    };

    return (
        <>
            <IconButton onClick={handleUndo}>
                <Tooltip title={String(t(langKeys.undo))} arrow placement="top">
                    <UndoIcon />
                </Tooltip>
            </IconButton>
            <IconButton onClick={handleRedo}>
                <Tooltip title={String(t(langKeys.redo))} arrow placement="top">
                    <RedoIcon />
                </Tooltip>
            </IconButton>
            <FontFamily tooltip="font"></FontFamily>
            <FormatSizeMenu tooltip="size"></FormatSizeMenu>
            <MarkButton format="bold" tooltip="bold">
                <FormatBoldIcon />
            </MarkButton>
            <MarkButton format="italic" tooltip="italic">
                <FormatItalicIcon />
            </MarkButton>
            <MarkButton format="underline" tooltip="underline">
                <FormatUnderlinedIcon />
            </MarkButton>
            <TextColor tooltip="size"></TextColor>
            <Alignment tooltip="alignment"></Alignment>
            <BlockButton format="numbered-list" tooltip="numbered_list">
                <FormatListNumberedIcon />
            </BlockButton>
            <BlockButton format="bulleted-list" tooltip="bulleted_list">
                <FormatListBulletedIcon />
            </BlockButton>
            <MarkButton format="code" tooltip="code">
                <FormatCodeIcon />
            </MarkButton>
            <BlockButton format="heading-one" tooltip="heading_one">
                <FormatLooksOneIcon />
            </BlockButton>
            <BlockButton format="heading-two" tooltip="heading_two">
                <FormatLooksTwoIcon />
            </BlockButton>
            <BlockButton format="block-quote" tooltip="block_quote">
                <FormatQuoteIcon />
            </BlockButton>
            {image && onlyurl && (
                <OnlyURLInsertImageButton>
                    <InsertPhotoIcon />
                </OnlyURLInsertImageButton>
            )}
            {upload.loading && (
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <CircularProgress size={24} />
                    <span>
                        <strong>
                            <Trans i18nKey={langKeys.loadingImage} />
                            ...
                        </strong>
                    </span>
                </div>
            )}
        </>
    );
};


/**Renderiza el texto seleccionado con cierto estilo */
const renderElement: RenderElement = ({ attributes = {}, children, element, isStatic = false }) => {
    const style = { textAlign: element.align }
    switch (element.type) {
        case 'block-quote':
            return <blockquote style={style} {...attributes}>{children}</blockquote>;
        case 'bulleted-list':
            return <ul style={style} {...attributes}>{children}</ul>;
        case 'heading-one':
            return <h1 style={style} {...attributes}>{children}</h1>;
        case 'heading-two':
            return <h2 style={style} {...attributes}>{children}</h2>;
        case 'list-item':
            return <li style={style} {...attributes}>{children}</li>;
        case 'numbered-list':
            return <ol style={style} {...attributes}>{children}</ol>;
        case 'image-src':
            if (isStatic === true) return <StaticImage element={element} children={children} />;
            return <Image element={element} attributes={attributes} children={children} />;
        default:
            // element.type: paragraph
            return <p style={style} {...attributes}>{children}</p>;
    }
}

/**Renderiza el texto seleccionado con cierto formato */
const renderLeaf: RenderLeaf = ({ attributes = {}, children, leaf }) => {

    if (leaf.bold === true) {
        children = <strong>{children}</strong>;
    }
    if (leaf.code === true) {
        children = <code>{children}</code>;
    }
    if (leaf.italic === true) {
        children = <em>{children}</em>;
    }
    if (leaf.underline === true) {
        children = <u>{children}</u>;
    }
    if (leaf.fontfamily) {
        children = <span style={{ fontFamily: leaf.fontfamily }}>{children}</span>;
    }
    if (leaf.fontsize) {
        children = <span style={{ fontSize: leaf.fontsize }}>{children}</span>;
    }
    if (leaf.color) {
        children = <span style={{ color: leaf.color }}>{children}</span>;
    }
    if (leaf.backgroundcolor) {
        children = <span style={{ backgroundColor: leaf.backgroundcolor }}>{children}</span>;
    }

    return <span {...attributes}>{children}</span>;
}

/**Aplicar formato en bloque */
const toggleBlock = (editor: BaseEditor & ReactEditor, format: ElemetType) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type),
        split: true,
    });
    const newProperties: Partial<SlateElement> = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
        const block: CustomElement = { type: format, children: [], align: 'left' };
        Transforms.wrapNodes(editor, block);
    }
}
/**Aplicar fuente al texto seleccionado */
const toggleFontFamily = (editor: BaseEditor & ReactEditor, value: string) => {
    if (value === "inherit") {
        Editor.removeMark(editor, 'fontfamily');
    } else {
        Editor.addMark(editor, 'fontfamily', value);
    }
}

const toggleFontSize = (editor: BaseEditor & ReactEditor, value: string) => {
    if (value === "small") {
        Editor.removeMark(editor, 'fontsize');
    } else {
        Editor.addMark(editor, 'fontsize', value);
    }
}
const toggleAlignment = (editor: BaseEditor & ReactEditor, value: "left" | "center" | "right") => {
    const isActive = isBlockActive(
        editor,
        "paragraph",
        'align'
    )
    let newProperties: Partial<SlateElement>
    newProperties = {
        align: isActive ? undefined : value,
    }
    Transforms.setNodes<SlateElement>(editor, newProperties)
    if (value === "left") {
        Editor.removeMark(editor, 'textalign');
    } else {
        Editor.addMark(editor, 'textalign', value);
    }
}
const toggleColor = (editor: BaseEditor & ReactEditor, value: string) => {
    if (value === "black") {
        Editor.removeMark(editor, 'color');
    } else {
        Editor.addMark(editor, 'color', value);
    }
}
const toggleBackgroundColor = (editor: BaseEditor & ReactEditor, value: string) => {
    if (value === "transparent") {
        Editor.removeMark(editor, 'backgroundcolor');
    } else {
        Editor.addMark(editor, 'backgroundcolor', value);
    }
}

interface FontFamilyProps extends SelectProps {
    tooltip: string;
    other?: () => void;
}

const FontFamily: FC<FontFamilyProps> = ({ tooltip = '', children, onClick, ...props }) => {
    const editor = useSlate();
    const marks = Editor.marks(editor);
    const fontfamily = marks?.fontfamily || 'inherit';
    const { t } = useTranslation();

    return (
        <FormControl>
            <Tooltip title={t(langKeys.font) || "font"} aria-label="add">
            <Select
                labelId="font-family-select-label"
                value={fontfamily}
                style={{ width: 150, marginLeft: 10 }}
                onChange={e => {
                    e.preventDefault();
                    toggleFontFamily(editor, e.target.value as string);
                }}
            >
                <MenuItem style={{ fontFamily: "inherit" }} value="inherit">{t(langKeys.default)}</MenuItem>
                <MenuItem style={{ fontFamily: "serif" }} value="serif">Serif</MenuItem>
                <MenuItem style={{ fontFamily: "sans-serif" }} value="sans-serif">Sans-serif</MenuItem>
                <MenuItem style={{ fontFamily: "monospace" }} value="monospace">Monospace</MenuItem>
                <MenuItem style={{ fontFamily: "cursive" }} value="cursive">Cursive</MenuItem>
                <MenuItem style={{ fontFamily: "fantasy" }} value="fantasy">Fantasy</MenuItem>
            </Select>
            </Tooltip>
        </FormControl>
    );
}
const FormatSizeMenu: FC<FontFamilyProps> = ({ tooltip = '', children, onClick, ...props }) => {
    const editor = useSlate();
    const marks = Editor.marks(editor);
    const fontsize = marks?.fontsize || 'small';
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value: string) => {
        toggleFontSize(editor, value);
        setAnchorEl(null);
    };

    return (
        <FormControl>
            <>
                <Tooltip title={t(langKeys.size) || "size"} aria-label="add">
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <FormatSizeIcon />
                        <ArrowDropDownIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <MenuItem onClick={() => handleClose("x-small")} style={{ paddingLeft: 0, fontSize: "x-small" }} value="x-small">
                        {fontsize === "x-small" && <CheckIcon style={{ marginRight: 10, marginLeft: 10, width: 20, height: 20 }} />}
                        <div style={{ marginLeft: (fontsize !== "x-small" ? 40 : 0) }}>{t(langKeys.small)} </div>
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("small")} style={{ paddingLeft: 0, fontSize: "small" }} value="small">
                        {fontsize === "small" && <CheckIcon style={{ marginRight: 10, marginLeft: 10, width: 20, height: 20 }} />}
                        <div style={{ marginLeft: (fontsize !== "small" ? 40 : 0) }}>{t(langKeys.normal)} </div>
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("large")} style={{ paddingLeft: 0, fontSize: "large" }} value="large">
                        {fontsize === "large" && <CheckIcon style={{ marginRight: 10, marginLeft: 10, width: 20, height: 20 }} />}
                        <div style={{ marginLeft: (fontsize !== "large" ? 40 : 0) }}>{t(langKeys.large)} </div>
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("xx-large")} style={{ paddingLeft: 0, fontSize: "xx-large" }} value="xx-large">
                        {fontsize === "xx-large" && <CheckIcon style={{ marginRight: 10, marginLeft: 10, width: 20, height: 20 }} />}
                        <div style={{ marginLeft: (fontsize !== "xx-large" ? 40 : 0) }}>{t(langKeys.huge)} </div>
                    </MenuItem>
                </Menu>
            </>
        </FormControl>
    );
}
const Alignment: FC<FontFamilyProps> = ({ tooltip = '', children, onClick, ...props }) => {
    const editor = useSlate();
    const marks = Editor.marks(editor);
    const textalign = marks?.textalign || 'left';
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value: "left" | "center" | "right") => {
        toggleAlignment(editor, value);
        setAnchorEl(null);
    };

    return (
        <FormControl>
            <>
                <Tooltip title={t(langKeys.align) || "align"} aria-label="add">
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        {(textalign !== "right" && textalign !== "center") && <FormatAlignLeftIcon />}
                        {textalign === "right" && <FormatAlignRightIcon />}
                        {textalign === "center" && <FormatAlignCenterIcon />}
                        <ArrowDropDownIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <MenuItem onClick={() => handleClose("left")} value="left">
                        <div><FormatAlignLeftIcon /></div>
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("center")} value="center">
                        <div><FormatAlignCenterIcon /></div>
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("right")} value="right">
                        <div><FormatAlignRightIcon /></div>
                    </MenuItem>
                </Menu>
            </>
        </FormControl>
    );
}

const ColorBoxes: FC<FontFamilyProps> = ({ other, tooltip }) => {
    const editor = useSlate();
    const classes = useRichTextStyles();

    const handleClose = (value: string) => {
        if (tooltip === "background") {
            toggleBackgroundColor(editor, value);
        } else {
            toggleColor(editor, value);
        }
        other?.();
    };


    return (
        <div>
            <div style={{ display: "flex", marginTop: 10 }}>
                <div onClick={() => handleClose("rgb(0,0,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(0,0,0)" }}></div>
                <div onClick={() => handleClose("rgb(68,68,68)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(68,68,68)" }}></div>
                <div onClick={() => handleClose("rgb(102,102,102)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(102,102,102)" }}></div>
                <div onClick={() => handleClose("rgb(153,153,153)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(153,153,153)" }}></div>
                <div onClick={() => handleClose("rgb(204,204,204)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(204,204,204)" }}></div>
                <div onClick={() => handleClose("rgb(238,238,238)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(238,238,238)" }}></div>
                <div onClick={() => handleClose("rgb(243,243,243)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(243,243,243)" }}></div>
                <div onClick={() => handleClose("rgb(255,255,255)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(255,255,255)" }}></div>
            </div>
            <div style={{ display: "flex", marginTop: 5, marginBottom: 5 }}>
                <div onClick={() => handleClose("rgb(255,0,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(255,0,0)" }}></div>
                <div onClick={() => handleClose("rgb(255,153,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(255,153,0)" }}></div>
                <div onClick={() => handleClose("rgb(255,255,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(255,255,0)" }}></div>
                <div onClick={() => handleClose("rgb(0,255,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(0,255,0)" }}></div>
                <div onClick={() => handleClose("rgb(0,255,255)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(0,255,255)" }}></div>
                <div onClick={() => handleClose("rgb(0,0,255)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(0,0,255)" }}></div>
                <div onClick={() => handleClose("rgb(153,0,255)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(153,0,255)" }}></div>
                <div onClick={() => handleClose("rgb(255,0,255)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(255,0,255)" }}></div>
            </div>
            <div style={{ display: "flex", marginBottom: 1 }}>
                <div onClick={() => handleClose("rgb(244,204,204)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(244,204,204)" }}></div>
                <div onClick={() => handleClose("rgb(252,229,205)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(252,229,205)" }}></div>
                <div onClick={() => handleClose("rgb(255,242,204)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(255,242,204)" }}></div>
                <div onClick={() => handleClose("rgb(217,234,211)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(217,234,211)" }}></div>
                <div onClick={() => handleClose("rgb(208,224,227)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(208,224,227)" }}></div>
                <div onClick={() => handleClose("rgb(207,226,243)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(207,226,243)" }}></div>
                <div onClick={() => handleClose("rgb(217,210,233)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(217,210,233)" }}></div>
                <div onClick={() => handleClose("rgb(234,209,220)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(234,209,220)" }}></div>
            </div>
            <div style={{ display: "flex", marginBottom: 1 }}>
                <div onClick={() => handleClose("rgb(234,153,153)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(234,153,153)" }}></div>
                <div onClick={() => handleClose("rgb(249,203,156)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(249,203,156)" }}></div>
                <div onClick={() => handleClose("rgb(255,229,153)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(255,229,153)" }}></div>
                <div onClick={() => handleClose("rgb(182,215,168)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(182,215,168)" }}></div>
                <div onClick={() => handleClose("rgb(162,196,201)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(162,196,201)" }}></div>
                <div onClick={() => handleClose("rgb(159,197,232)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(159,197,232)" }}></div>
                <div onClick={() => handleClose("rgb(180,167,214)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(180,167,214)" }}></div>
                <div onClick={() => handleClose("rgb(213,166,189)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(213,166,189)" }}></div>
            </div>
            <div style={{ display: "flex", marginBottom: 1 }}>
                <div onClick={() => handleClose("rgb(224,102,102)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(224,102,102)" }}></div>
                <div onClick={() => handleClose("rgb(246,178,107)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(246,178,107)" }}></div>
                <div onClick={() => handleClose("rgb(255,217,102)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(255,217,102)" }}></div>
                <div onClick={() => handleClose("rgb(147,196,125)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(147,196,125)" }}></div>
                <div onClick={() => handleClose("rgb(118,165,175)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(118,165,175)" }}></div>
                <div onClick={() => handleClose("rgb(111,168,220)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(111,168,220)" }}></div>
                <div onClick={() => handleClose("rgb(142,124,195)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(142,124,195)" }}></div>
                <div onClick={() => handleClose("rgb(194,123,160)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(194,123,160)" }}></div>
            </div>
            <div style={{ display: "flex", marginBottom: 1 }}>
                <div onClick={() => handleClose("rgb(204,0,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(204,0,0)" }}></div>
                <div onClick={() => handleClose("rgb(230,145,56)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(230,145,56)" }}></div>
                <div onClick={() => handleClose("rgb(241,194,50)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(241,194,50)" }}></div>
                <div onClick={() => handleClose("rgb(106,168,79)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(106,168,79)" }}></div>
                <div onClick={() => handleClose("rgb(69,129,142)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(69,129,142)" }}></div>
                <div onClick={() => handleClose("rgb(61,133,198)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(61,133,198)" }}></div>
                <div onClick={() => handleClose("rgb(103,78,167)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(103,78,167)" }}></div>
                <div onClick={() => handleClose("rgb(166,77,121)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(166,77,121)" }}></div>
            </div>
            <div style={{ display: "flex", marginBottom: 1 }}>
                <div onClick={() => handleClose("rgb(153,0,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(153,0,0)" }}></div>
                <div onClick={() => handleClose("rgb(180,95,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(180,95,0)" }}></div>
                <div onClick={() => handleClose("rgb(191,144,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(191,144,0)" }}></div>
                <div onClick={() => handleClose("rgb(56,118,29)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(56,118,29)" }}></div>
                <div onClick={() => handleClose("rgb(19,79,92)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(19,79,92)" }}></div>
                <div onClick={() => handleClose("rgb(11,83,148)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(11,83,148)" }}></div>
                <div onClick={() => handleClose("rgb(53,28,117)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(53,28,117)" }}></div>
                <div onClick={() => handleClose("rgb(116,27,71)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(116,27,71)" }}></div>
            </div>
            <div style={{ display: "flex", marginBottom: 1 }}>
                <div onClick={() => handleClose("rgb(102,0,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(102,0,0)" }}></div>
                <div onClick={() => handleClose("rgb(120,63,4)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(120,63,4)" }}></div>
                <div onClick={() => handleClose("rgb(127,96,0)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(127,96,0)" }}></div>
                <div onClick={() => handleClose("rgb(39,78,19)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(39,78,19)" }}></div>
                <div onClick={() => handleClose("rgb(12,52,61)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(12,52,61)" }}></div>
                <div onClick={() => handleClose("rgb(7,55,99)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(7,55,99)" }}></div>
                <div onClick={() => handleClose("rgb(32,18,77)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(32,18,77)" }}></div>
                <div onClick={() => handleClose("rgb(76,17,48)")} className={classes.littleboxes} style={{ backgroundColor: "rgb(76,17,48)" }}></div>
            </div>
        </div>
    );
}
const TextColor: FC<FontFamilyProps> = ({ tooltip = '', children, onClick, ...props }) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <FormControl>
            <>
                <Tooltip title={t(langKeys.textcolor) || "textcolor"} aria-label="add">
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <FormatColorTextIcon />
                        <ArrowDropDownIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 120,
                        horizontal: 'center',
                    }}
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                >
                    <div style={{ display: "flex", marginRight: 10 }}>
                        <div style={{ marginLeft: 10, marginRight: 10 }}>
                            <div>{t(langKeys.backgroundColor)}</div>
                            <ColorBoxes tooltip="background" other={() => handleClose()} />
                        </div>
                        <div>
                            <div>{t(langKeys.textcolor)}</div>
                            <ColorBoxes tooltip="textcolor" other={() => handleClose()} />
                        </div>
                    </div>
                </Menu>
            </>
        </FormControl>
    );
}

const isMarkActive = (editor: BaseEditor & ReactEditor, format: keyof Omit<CustomText, 'text'>) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
}

/**Aplicar estilo al texto seleccionado */
const toggleMark = (editor: BaseEditor & ReactEditor, format: keyof Omit<CustomText, 'text'>) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
}

const isBlockActive = (editor: BaseEditor & ReactEditor, format: ElemetType, blockType: "type" | "align" = 'type') => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n[blockType] === format,
        })
    )

    return !!match
}

interface MarkButtonProps extends IconButtonProps {
    tooltip: string;
    format: keyof Omit<CustomText, 'text'>;
}

const MarkButton: FC<MarkButtonProps> = ({ tooltip = '', format, children, onClick, ...props }) => {
    const editor = useSlate();
    const active = isMarkActive(editor, format);
    const { t } = useTranslation();

    return (
        <Tooltip title={t((langKeys as any)[tooltip]) || ''}>
            <IconButton
                {...props}
                onClick={e => {
                    e.preventDefault();
                    toggleMark(editor, format);
                    onClick?.(e);
                }}
                color={active ? 'primary' : 'default'}
            >
                {children}
            </IconButton>
        </Tooltip>
    );
}

interface BlockButtonProps extends IconButtonProps {
    tooltip: string;
    format: ElemetType;
}

const BlockButton: FC<BlockButtonProps> = ({ tooltip = '', format, children, onClick, ...props }) => {
    const editor = useSlate();
    const active = isBlockActive(editor, format);
    const { t } = useTranslation();

    return (
        <Tooltip title={t((langKeys as any)[tooltip]) || ''}>
            <IconButton
                {...props}
                onClick={e => {
                    e.preventDefault();
                    toggleBlock(editor, format);
                    onClick?.(e);
                }}
                color={active ? 'primary' : 'default'}
            >
                {children}
            </IconButton>
        </Tooltip>
    );
}

const useInsertImageButtonStyles = makeStyles(theme => ({
    rootPopup: {
        width: 280,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        justifyContent: 'stretch',
    },
    rootTab: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    hidden: {
        display: 'none',
    },
    attachTab: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
    },
}));

const OnlyURLInsertImageButton: FC = ({ children }) => {
    const editor = useSlateStatic();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useInsertImageButtonStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [url, setUrl] = useState('');
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const upload = useSelector(state => state.main.uploadFile);
    const open = Boolean(anchorEl);

    useEffect(() => {
        return () => {
            dispatch(resetUploadFile());
        };
    }, [dispatch]);

    useEffect(() => {
        if (waitUploadFile) {
            if (upload.loading) return;
            if (upload.error) {
                const message = t(upload.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
                dispatch(showSnackbar({
                    message,
                    show: true,
                    severity: "error"
                }));
                setWaitUploadFile(false);
            } else if (upload.url && upload.url.length > 0) {
                insertImage(editor, upload.url);
                dispatch(resetUploadFile());
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, upload, editor, t, dispatch]);

    const clearUrl = useCallback(() => setUrl(''), []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const addNewUrlImage = useCallback(() => {
        if (url.length > 0 && isUrl(url)) {
            insertImage(editor, url);
            clearUrl();
        }
    }, [url, editor, clearUrl]);

    return (
        <>
            <Tooltip title={t(langKeys.image) || ''}>
                <IconButton
                    aria-controls="insert-image-button-rich-text-popup"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onMouseDown={event => {
                        event.preventDefault();
                        handleClick(event);
                    }}
                >
                    {children}
                </IconButton>
            </Tooltip>
            <Menu
                id="insert-image-button-rich-text-popup"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                variant="menu"
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <div className={classes.rootPopup}>
                    <div role="tabpanel" className={clsx(classes.rootTab)}>
                        <TextField
                            placeholder={t(langKeys.enterTheUrl)}
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            autoFocus
                            disabled={waitUploadFile || upload.loading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={clearUrl}>
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button
                            type="button"
                            color="primary"
                            variant="contained"
                            size="small"
                            disabled={waitUploadFile || upload.loading}
                            onClick={addNewUrlImage}
                        >
                            <Trans i18nKey={langKeys.accept} />
                        </Button>
                    </div>
                </div>
            </Menu>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InsertImageButton: FC = ({ children }) => {
    const editor = useSlateStatic();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useInsertImageButtonStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [url, setUrl] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const upload = useSelector(state => state.main.uploadFile);
    const open = Boolean(anchorEl);

    useEffect(() => {
        return () => {
            dispatch(resetUploadFile());
        };
    }, [dispatch]);

    useEffect(() => {
        if (waitUploadFile) {
            if (upload.loading) return;
            if (upload.error) {
                const message = t(upload.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
                dispatch(showSnackbar({
                    message,
                    show: true,
                    severity: "error"
                }));
                setWaitUploadFile(false);
            } else if (upload.url && upload.url.length > 0) {
                insertImage(editor, upload.url);
                dispatch(resetUploadFile());
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, upload, editor, t, dispatch]);

    const clearUrl = useCallback(() => setUrl(''), []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const addNewUrlImage = useCallback(() => {
        if (url.length > 0 && isUrl(url)) {
            insertImage(editor, url);
            clearUrl();
        }
    }, [url, editor, clearUrl]);

    const handleAttachImage = useCallback(() => {
        const input = document.getElementById('richtextImageBtnInput');
        input!.click();
    }, []);

    const addNewAttachedImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const fd = new FormData();
        fd.append('file', file, file.name);
        dispatch(uploadFile(fd));
        setWaitUploadFile(true);
        setAnchorEl(null);
        clearUrl();
    }, [clearUrl, dispatch]);

    return (
        <div>
            <Tooltip title={t(langKeys.image) || ''}>
                <IconButton
                    aria-controls="insert-image-button-rich-text-popup"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onMouseDown={event => {
                        event.preventDefault();
                        handleClick(event);
                    }}
                >
                    {children}
                </IconButton>
            </Tooltip>
            <Menu
                id="insert-image-button-rich-text-popup"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <div className={classes.rootPopup}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_, i) => setTabIndex(i)}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="fullWidth"
                    >
                        <AntTab
                            disabled={upload.loading}
                            value={0}
                            label="URL"
                        />
                        <AntTab
                            disabled={upload.loading}
                            value={1}
                            label={(
                                <div className={classes.attachTab}>
                                    {waitUploadFile && upload.loading && <CircularProgress size={24} />}
                                    <Trans i18nKey={langKeys.attached} />
                                </div>
                            )}
                        />
                    </Tabs>
                    <div role="tabpanel" className={clsx(classes.rootTab, tabIndex !== 0 && classes.hidden)}>
                        <TextField
                            placeholder={t(langKeys.enterTheUrl)}
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            autoFocus
                            disabled={waitUploadFile || upload.loading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={clearUrl}>
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button
                            type="button"
                            color="primary"
                            variant="contained"
                            size="small"
                            disabled={waitUploadFile || upload.loading}
                            onClick={addNewUrlImage}
                        >
                            <Trans i18nKey={langKeys.accept} />
                        </Button>
                    </div>
                    <div role="tabpanel" className={clsx(classes.rootTab, tabIndex !== 1 && classes.hidden)}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="richtextImageBtnInput"
                            type="file"
                            onChange={addNewAttachedImage}
                        />
                        <Button
                            type="button"
                            color="primary"
                            variant="contained"
                            size="small"
                            disabled={waitUploadFile || upload.loading}
                            onClick={handleAttachImage}
                        >
                            <Trans i18nKey={langKeys.select} />
                        </Button>
                    </div>
                </div>
            </Menu>
        </div>
    );
}

const isUrl = (src: string | undefined | null) => {
    return typeof src === "string" && src.length > 0 && src.includes('http');
}

const insertImage = (editor: BaseEditor & ReactEditor, url: string | null) => {
    const text: CustomText = { text: '' };
    const image: CustomElement = { type: 'image-src', url, children: [text], align: 'left' };
    Transforms.insertNodes(editor, image);

    const nextNode = Editor.next(editor);
    if (nextNode) return;

    const endDummyText: CustomText = { text: '' };
    const endDummyElement: CustomElement = { type: 'paragraph', url: undefined, children: [endDummyText], align: 'left' };
    Transforms.insertNodes(editor, endDummyElement);
}

const useImageStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        // width: 'fit-content',
        // maxWidth: '100%',
        // display: 'inline-block',
    },
    img: {
        display: 'block',
        maxWidth: '100%',
        maxHeight: '20em',
    },
    btn: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
}));

const Image: RenderElement = ({ children, element, attributes }) => {
    const classes = useImageStyles();
    const editor = useSlateStatic();
    const path = ReactEditor.findPath(editor, element);

    const selected = useSelected();
    const focused = useFocused();

    return (
        <div {...attributes} /*style={{ width: 'fit-content', maxWidth: '100%' }}*/>
            {children}
            <div contentEditable={false} className={classes.root}>
                <img
                    src={element.url || ''}
                    alt="Imagen"
                    className={classes.img}
                    style={{ boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none' }}
                />
                <IconButton
                    // onClick={() => Transforms.removeNodes(editor, { at: path })}
                    onClick={() => Transforms.setNodes(editor, { type: 'paragraph', url: undefined }, { at: path })}
                    color="default"
                    className={classes.btn}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
}

const StaticImage: StaticRenderElement = ({ children, element }) => {
    const classes = useImageStyles();

    return (
        <div>
            {children}
            <div contentEditable={false} className={classes.root}>
                <img
                    src={element.url || ''}
                    alt="Imagen"
                    className={classes.img}
                />
            </div>
        </div>
    );
}

const withImages = (editor: BaseEditor & ReactEditor) => {
    const { insertData, isVoid } = editor

    editor.isVoid = (element: CustomElement) => {
        return element.type === 'image-src' ? true : isVoid(element);
    }

    editor.insertData = data => {
        const text = data.getData('text/plain');
        const { files } = data;

        if (files && files.length > 0) {
            for (const file of Array.from(files)) {
                const reader = new FileReader();
                const [mime] = file.type.split('/');

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result;
                        insertImage(editor, url as string);
                    });

                    reader.readAsDataURL(file);
                }
            }
        } else if (isUrl(text) && /(apng|avif|gif|jpg|jpeg|jfif|png|svg)$/i.test(text)) {
            insertImage(editor, text);
        } else {
            insertData(data);
        }
    }

    return editor;
}
