import React, { FC, useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { Box, BoxProps, Button, IconButton, makeStyles, Popover, TextField } from '@material-ui/core';
import { Add, Menu } from '@material-ui/icons';
import { DraggableProvided, DraggableStateSnapshot, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { langKeys } from 'lang/keys';
import { Trans } from 'react-i18next';

const columnWidth = 275;
const cardBorderRadius = 12;

interface LeadCardContentProps extends BoxProps {
    lead: any;
    snapshot: DraggableStateSnapshot;
}

const useLeadCardStyles = makeStyles(theme => ({
    root: {
        padding: 16,
        // margin: '0 0 8px 0',
        minHeight: '50px',
        backgroundColor: 'white',
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: cardBorderRadius,

        '-webkit-touch-callout': 'none', /* iOS Safari */
        '-webkit-user-select': 'none', /* Safari */
        '-khtml-user-select': 'none', /* Konqueror HTML */
        '-moz-user-select': 'none', /* Old versions of Firefox */
        '-ms-user-select': 'none', /* Internet Explorer/Edge */
        userSelect: 'none',
    },
    rootDragging: {
        opacity: .9,
    },
    floatingMenuIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 22,
        height: 22,
        maxHeight: 22,
        maxWidth: 22,
    },
    title: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },
    info: {
        fontSize: 14,
        fontWeight: 400,
        marginBottom: theme.spacing(.5),
    },
    tagsRow: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    tag: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme.spacing(1),
        marginBottom: 4,
    },
    tagCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    tagtext: {
        fontSize: 12,
        fontWeight: 400,
    },
    popoverPaper: {
        maxWidth: 150,
    }
}));

export const DraggableLeadCardContent: FC<LeadCardContentProps> = ({ lead, snapshot, ...boxProps }) => {
    const classes = useLeadCardStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? `lead-card-popover-${String(lead)}` : undefined;

    return (
        <Box {...boxProps} pb={1}>
            <div className={clsx(classes.root, snapshot.isDragging && classes.rootDragging)}>
                <div className={classes.floatingMenuIcon}>
                    <IconButton color="primary" size="small" aria-describedby={id} onClick={handleClick}>
                        <Menu style={{ height: 'inherit', width: 'inherit' }} />
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        PaperProps={{
                            className: classes.popoverPaper,
                        }}
                    >
                        <Button
                            variant="text"
                            color="inherit"
                            fullWidth
                            style={{ fontWeight: "normal", textTransform: "uppercase" }}
                        >
                            <Trans i18nKey={langKeys.delete} />
                        </Button>
                    </Popover>
                </div>
                <span className={classes.title}>{lead.description}</span>
                <span className={classes.info}>S/ {lead.expected_revenue}</span>
                <span className={classes.info}>Gemini Furniture</span>
                <div className={classes.tagsRow}>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'cyan' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Information</div>
                    </div>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'red' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Design</div>
                    </div>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'violet' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Music</div>
                    </div>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'blue' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Style</div>
                    </div>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'blueviolet' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Other</div>
                    </div>
                </div>
            </div>
        </Box>
    );
}


interface InputTitleProps {
    defaultValue: string;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
    className?: string;
    inputClasses?: string;
}

const useInputTitleStyles = makeStyles(theme => ({
    root: {
        maxHeight: 70.6,
        height: 70.6,
        width: 'inherit',
    },
    title: {
        margin: '0.83em 0',
        fontSize: '1.5em',
        fontWeight: 500,
        width: 'inherit',
    },
    titleInput: {
        fontSize: '1.35em',
        fontWeight: 500,
    },
}));

const InputTitle : FC<InputTitleProps> = ({ defaultValue, onChange, onBlur, className, inputClasses }) => {
    const classes = useInputTitleStyles();
    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState(defaultValue);

    const handleValueChange = useCallback((newValue: string) => {
        setValue(newValue);
        onChange?.(newValue);
    }, []);

    const handleOnBlur = useCallback(() => {
        setEdit(false);
        onBlur?.(value);
    }, [value]);
    
    if (!edit) {
        return (
            <div className={classes.root}>
                <h2
                    className={classes.title}
                    onClick={() => setEdit(true)}
                >
                    {value}
                </h2>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <TextField
                autoFocus
                value={value}
                size="small"
                className={clsx(classes.title, className)}
                onBlur={handleOnBlur}
                InputProps={{
                    classes: {
                        input: clsx(classes.titleInput, inputClasses),
                    },
                    disableUnderline: false,
                }}
                onChange={e => handleValueChange(e.target.value)}
            />
        </div>
    );
}

interface LeadColumnProps extends Omit<BoxProps, 'title'> {
    /**default title value */
    title: string;
    snapshot: DraggableStateSnapshot | null;
    titleOnChange?: (value: string) => void;
    provided: DraggableProvided;
}

const useLeadColumnStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: `0 ${theme.spacing(1)}px`,
        maxHeight: '100%',
        overflow: 'hidden', // overflowY
        width: columnWidth,
        maxWidth: columnWidth,

        '-webkit-touch-callout': 'none', /* iOS Safari */
        '-webkit-user-select': 'none', /* Safari */
        '-khtml-user-select': 'none', /* Konqueror HTML */
        '-moz-user-select': 'none', /* Old versions of Firefox */
        '-ms-user-select': 'none', /* Internet Explorer/Edge */
        userSelect: 'none',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    textField: {
        '&:hover': {
            cursor: 'grab',
        }
    },
}));

export const DraggableLeadColumn: FC<LeadColumnProps> = ({ children, title, provided, titleOnChange, ...boxProps }) => {
    const classes = useLeadColumnStyles();

    return (
        <Box {...boxProps}>
            <div className={classes.root}>
                <div className={classes.header} {...provided.dragHandleProps}>
                    <InputTitle defaultValue={title} onChange={titleOnChange} />
                    <IconButton color="primary" size="small">
                        <Add style={{ height: 22, width: 22 }} />
                    </IconButton>
                </div>
                {children}
            </div>
        </Box>
    );
}

interface LeadColumnListProps extends BoxProps {
    snapshot: DroppableStateSnapshot;
    itemCount: number;
}

const useLeadColumnListStyles = makeStyles(theme => ({
    root: {
        width: 275,
        maxWidth: 275,
        minHeight: 500,
        borderRadius: cardBorderRadius,
    },
    draggOver: {
        background: 'rgb(211,211,211, 0.2)', // "lightgrey",
    },
}));

export const DroppableLeadColumnList: FC<LeadColumnListProps> = ({ children, snapshot, itemCount, ...boxProps }) => {
    const classes = useLeadColumnListStyles();

    return (
        <Box {...boxProps}>
            <div className={clsx(classes.root, (snapshot.isDraggingOver && itemCount === 0) && classes.draggOver)}>
                {children}
            </div>
        </Box>
    );
}
