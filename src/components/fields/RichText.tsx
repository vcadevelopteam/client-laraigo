import { Box, BoxProps, IconButton, IconButtonProps, Menu, TextField, Toolbar, makeStyles, Button, InputAdornment } from '@material-ui/core';
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
} from '@material-ui/icons';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { createEditor, BaseEditor, Descendant, Transforms, Editor, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, ReactEditor, RenderElementProps, RenderLeafProps, useSlate, useSlateStatic, useSelected, useFocused } from 'slate-react';
import { withHistory } from 'slate-history';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

const LIST_TYPES = ['bulleted-list', 'numbered-list'];
type ElemetType = 'paragraph' | 'block-quote' | 'heading-one' | 'heading-two' | 'list-item' | 'bulleted-list' | 'numbered-list' | 'image-src';
type CustomElement = {
    type: ElemetType;
    children: CustomText[];
    url?: string | null;
}

type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
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
    onChange: (value: Descendant[]) => void;
}

type RenderElement = (props: RenderElementProps) => JSX.Element;
type RenderLeaf = (props: RenderLeafProps) => JSX.Element;

const useRichTextStyles = makeStyles(theme => ({
    toolbar: {
        overflow: 'auto',
        padding: 0,
    },
}));

const RichText: FC<RichTextProps> = ({ value, onChange, placeholder, spellCheck, ...boxProps })=> {
    const classes = useRichTextStyles();
    // Create a Slate editor object that won't change across renders.
    const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);

    return (
        <Box {...boxProps}>
            <Slate editor={editor} value={value} onChange={onChange}>
                <Toolbar className={classes.toolbar}>
                    <MarkButton format="bold">
                        <FormatBoldIcon />
                    </MarkButton>
                    <MarkButton format="italic">
                        <FormatItalicIcon />
                    </MarkButton>
                    <MarkButton format="underline">
                        <FormatUnderlinedIcon />
                    </MarkButton>
                    <MarkButton format="code">
                        <FormatCodeIcon />
                    </MarkButton>
                    <BlockButton format="heading-one">
                        <FormatLooksOneIcon />
                    </BlockButton>
                    <BlockButton format="heading-two">
                        <FormatLooksTwoIcon />
                    </BlockButton>
                    <BlockButton format="block-quote">
                        <FormatQuoteIcon />
                    </BlockButton>
                    <BlockButton format="numbered-list">
                        <FormatListNumberedIcon />
                    </BlockButton>
                    <BlockButton format="bulleted-list">
                        <FormatListBulletedIcon />
                    </BlockButton>
                    <InsertImageButton>
                        <InsertPhotoIcon />
                    </InsertImageButton>
                </Toolbar>
                <Editable
                    placeholder={placeholder}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    spellCheck={spellCheck}
                />
            </Slate>
        </Box>
    );
}

/**Renderiza el texto seleccionado con cierto estilo */
const renderElement: RenderElement = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>;
        case 'image-src':
            return <Image element={element} attributes={attributes} children={children} />;
        default:
            // element.type: paragraph
            return <p {...attributes}>{children}</p>;
    }
}

/**Renderiza el texto seleccionado con cierto formato */
const renderLeaf: RenderLeaf = ({ attributes, children, leaf }) => {
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
  
    return <span {...attributes}>{children}</span>;
}

/**Aplicar formato en bloque */
const toggleBlock = (editor: BaseEditor & ReactEditor, format: ElemetType) => {
    const isActive = isBlockActive(editor, format);
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
        const block: CustomElement = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
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

const isBlockActive = (editor: BaseEditor & ReactEditor, format: ElemetType) => {
    const { selection } = editor;
    if (!selection) return false;

    const iterator = Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>!Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });

    const [match] = Array.from(iterator);
    return !!match;
}

const isMarkActive = (editor: BaseEditor & ReactEditor, format: keyof Omit<CustomText, 'text'>) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
}

interface MarkButtonProps extends IconButtonProps {
    format: keyof Omit<CustomText, 'text'>;
}

const MarkButton: FC<MarkButtonProps> = ({ format, children, onClick, ...props }) => {
    const editor = useSlate();
    const active = isMarkActive(editor, format);

    return (
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
    );
}

interface BlockButtonProps extends IconButtonProps {
    format: ElemetType;
}

const BlockButton: FC<BlockButtonProps> = ({ format, children, onClick, ...props }) => {
    const editor = useSlate();
    const active = isBlockActive(editor, format);

    return (
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
    );
}

const useInsertImageButtonStyles = makeStyles(theme => ({
    rootPopup: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        justifyContent: 'stretch',
    },
}));

const InsertImageButton: FC = ({ children }) => {
    const editor = useSlateStatic();
    const { t } = useTranslation();
    const classes = useInsertImageButtonStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [url, setUrl] = useState('');
    const open = Boolean(anchorEl);

    const clearUrl = useCallback(() => setUrl(''), []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
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
                    <TextField
                        placeholder={t(langKeys.enterTheUrl)}
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        autoFocus
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
                        onClick={e => {
                            const currentUrl = url;
                            if (currentUrl.length > 0 && isUrl(currentUrl)) {
                                insertImage(editor, currentUrl);
                                clearUrl();
                            }
                        }}
                    >
                        <Trans i18nKey={langKeys.accept} />
                    </Button>
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
    const image: CustomElement = { type: 'image-src', url, children: [text] };
    Transforms.insertNodes(editor, image);

    const nextNode = Editor.next(editor);
    if (nextNode) return;

    const endDummyText: CustomText = { text: '' };
    const endDummyElement: CustomElement = { type: 'paragraph', url: undefined, children: [endDummyText] };
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
        } else if (isUrl(text)) {
            insertImage(editor, text);
        } else {
            insertData(data);
        }
    }
  
    return editor;
}

export default RichText;
