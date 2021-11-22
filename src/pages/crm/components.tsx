import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Avatar, Box, BoxProps, Button, IconButton, makeStyles, Popover, TextField } from '@material-ui/core';
import { Add, MoreVert as MoreVertIcon } from '@material-ui/icons';
import { DraggableProvided, DraggableStateSnapshot, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { langKeys } from 'lang/keys';
import { Trans } from 'react-i18next';
import { Rating, Skeleton } from '@material-ui/lab';
import { useHistory } from 'react-router';
import paths from 'common/constants/paths';

const columnWidth = 275;
const columnMinHeight = 500;
const cardBorderRadius = 12;
const inputTitleHeight = 50;

interface LeadCardContentProps extends BoxProps {
    lead: any;
    snapshot: DraggableStateSnapshot;
    onDelete?: (value: string) => void;
    onClick?: (lead: any) => void;
    onCloseLead?: (lead: any) => void;
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
        minHeight: 16.67,
    },
    tagCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    tagtext: {
        fontSize: 12,
        fontWeight: 400,
        textTransform: 'capitalize'
    },
    popoverPaper: {
        maxWidth: 150,
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
}));

export const DraggableLeadCardContent: FC<LeadCardContentProps> = ({ lead, snapshot, onDelete, onClick, onCloseLead, ...boxProps }) => {
    const classes = useLeadCardStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const tags = (lead.tags) ? lead.tags.split(',') : []
    const urgencyLevels = [null,'LOW','MEDIUM','HIGH']
    const colors = ['', 'cyan', 'red', 'violet', 'blue', 'blueviolet']
    const history = useHistory();

    const handleMoreVertClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = useCallback(() => {
        history.push({
            pathname: paths.CRM_EDIT_LEAD.resolve(lead.leadid),
        });
    }, [lead, history]);

    const handleDelete = () => {
        setAnchorEl(null);
        onDelete?.(lead);
    };

    const handleCloseLead = () => {
        setAnchorEl(null);
        onCloseLead?.(lead);
    }

    const open = Boolean(anchorEl);
    const id = open ? `lead-card-popover-${String(lead)}` : undefined;

    return (
        <Box {...boxProps} style={{ position: 'relative' }} pb={1}>
            <div className={clsx(classes.root, snapshot.isDragging && classes.rootDragging)} onClick={handleClick}>
                <span className={classes.title}>{lead.description}</span>
                <span className={classes.info}>S/ {lead.expected_revenue}</span>
                <span className={classes.info}>{lead.displayname}</span>
                <div className={classes.tagsRow}>
                    {tags.map((tag: String, index:number) =>
                        <div className={classes.tag} key={index}>
                            <div className={classes.tagCircle} style={{ backgroundColor: colors[1] }} />
                            <div style={{ width: 6 }} />
                            <div className={classes.tagtext}>{tag}</div>
                        </div>
                    )}
                </div>
                <div className={classes.footer}>
                    <Rating
                        name="hover-feedback"
                        defaultValue={urgencyLevels.findIndex(x => x === lead.priority)}
                        max={3}
                        readOnly
                    />
                    <div style={{ flexGrow: 1 }} />
                    <Avatar style={{ height: 22, width: 22 }} src="" />
                </div>
            </div>
            <div className={classes.floatingMenuIcon}>
                <IconButton size="small" aria-describedby={id} onClick={handleMoreVertClick}>
                    <MoreVertIcon style={{ height: 'inherit', width: 'inherit' }} />
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
                        type="button"
                        onClick={handleCloseLead}
                        style={{ fontWeight: "normal", textTransform: "uppercase" }}
                    >
                        <Trans i18nKey={langKeys.close} />
                    </Button>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        type="button"
                        onClick={handleDelete}
                        style={{ fontWeight: "normal", textTransform: "uppercase" }}
                    >
                        <Trans i18nKey={langKeys.delete} />
                    </Button>
                </Popover>
            </div>
        </Box>
    );
}


interface InputTitleProps {
    defaultValue: string;
    edit: boolean;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
    className?: string;
    inputClasses?: string;
}

const useInputTitleStyles = makeStyles(theme => ({
    root: {
        maxHeight: inputTitleHeight,
        height: inputTitleHeight,
        width: 'inherit',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
    title: {
        fontSize: '1.5em',
        fontWeight: 500,
        width: 'inherit',
    },
    titleInput: {
        fontSize: '1.35em',
        fontWeight: 500,
    },
}));

const InputTitle : FC<InputTitleProps> = ({ defaultValue, edit: enableEdit, onChange, onBlur, className, inputClasses }) => {
    const classes = useInputTitleStyles();
    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setEdit(enableEdit);
    }, [enableEdit]);

    const handleValueChange = useCallback((newValue: string) => {
        setValue(newValue);
        onChange?.(newValue);
    }, [onChange]);

    const handleOnBlur = useCallback(() => {
        setEdit(false);
        onBlur?.(value);
    }, [value, onBlur]);
    
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
    onDelete?: (value: string) => void;
    onAddCard?: () => void;
    provided: DraggableProvided;
    columnid: string;
    total_revenue: number;
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
    popoverPaper: {
        maxWidth: 150,
    },
    currency: {
        marginBottom: '0.63em',
    },
}));

export const DraggableLeadColumn: FC<LeadColumnProps> = ({
    children,
    title,
    provided,
    columnid,
    total_revenue,
    titleOnChange,
    onDelete,
    onAddCard,
    ...boxProps
}) => {
    const classes = useLeadColumnStyles();
    const edit = useRef(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOnBlur = useCallback((value: string) => {
        edit.current = false;
        titleOnChange?.(value);
    }, [titleOnChange]);

    const handleEdit = useCallback(() => {
        edit.current = true;
        setAnchorEl(null);
    }, []);

    // const handleDelete = useCallback(() => {
    //     setAnchorEl(null);
    //     onDelete?.(columnid);
    // }, []);

    const open = Boolean(anchorEl);
    const id = open ? `lead-column-popover-${title}` : undefined;

    return (
        <Box {...boxProps}>
            <div className={classes.root}>
                <div className={classes.header} {...provided.dragHandleProps}>
                    <InputTitle
                        defaultValue={title}
                        edit={edit.current}
                        onBlur={handleOnBlur}
                    />
                    <IconButton size="small" aria-describedby={id} onClick={handleClick}>
                        <MoreVertIcon style={{ height: 22, width: 22 }} />
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
                            type="button"
                            onClick={handleEdit}
                            style={{ fontWeight: "normal", textTransform: "uppercase" }}
                        >
                            <Trans i18nKey={langKeys.edit} />
                        </Button>
                        {/* <Button
                            variant="text"
                            color="inherit"
                            fullWidth
                            type="button"
                            onClick={handleDelete}
                            style={{ fontWeight: "normal", textTransform: "uppercase" }}
                        >
                            <Trans i18nKey={langKeys.delete} />
                        </Button> */}
                    </Popover>
                    <IconButton size="small" onClick={onAddCard}>
                        <Add style={{ height: 22, width: 22 }} />
                    </IconButton>
                </div>
                <span className={classes.currency}>S/ {total_revenue ? total_revenue : 0}</span>
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
        minHeight: columnMinHeight,
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

interface AddColumnTemplatePops extends Omit<BoxProps, 'onSubmit'> {
    onSubmit: (title: string) => void;
}

const useAddColumnTemplateStyles = makeStyles(theme => ({
    root: {
        width: columnWidth,
        maxWidth: columnWidth,
        display: 'flex',
        flexDirection: 'column',
        fontSize: 14,
        fontWeight: 500,
        color: theme.palette.primary.main,
        padding: `calc(0.83em + ${inputTitleHeight * .1}px) 6px 0 6px`,
    },
    addBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'inherit',
        position: 'relative',
        height: 35,
        width: 'inherit',
    },
    addBtn: {
        width: 35,
        height: 35,
        backgroundColor: theme.palette.primary.light,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
    popoverRoot: {
        width: columnWidth,
        height: columnMinHeight,
    },
}));

export const AddColumnTemplate: FC<AddColumnTemplatePops> = ({ onSubmit, ...boxProps }) => {
    const classes = useAddColumnTemplateStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'crm-add-new-column-popover' : undefined;

    const handleSubmit = (title: string) => {
        onSubmit(title);
        handleClose();
    };

    return (
        <Box {...boxProps}>
            <div className={classes.root}>
                <Button
                    color="primary"
                    aria-describedby={id}
                    className={classes.addBtnContainer}
                    onClick={handleClick}
                >
                    <div className={classes.addBtn}>
                        <Add style={{ height: '75%', width: 'auto' }} color="secondary" />
                    </div>
                    <div style={{ width: 12 }} />
                    <span>Add a column</span>
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        className: classes.popoverRoot,
                    }}
                >
                    <ColumnTemplate onSubmit={handleSubmit} />
                </Popover>
            </div>
        </Box>
    );
}

interface ColumnTemplateProps {
    onSubmit: (title: string) => void;
}

const useColumnTemplateStyles = makeStyles(theme => ({
    root: {
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
    },
    titleSection: {
        display: 'flex',
        flexDirection: 'row',
        width: 'inherit',
    },
    btn: {
        minWidth: 'unset',
    },
    input: {
        flexGrow: 1,
    },
}));

const ColumnTemplate: FC<ColumnTemplateProps> = ({ onSubmit }) => {
    const classes = useColumnTemplateStyles();
    const inputClasses = useInputTitleStyles();
    const [title, setTitle] = useState("");

    return (
        <div className={classes.root}>
            <div className={classes.titleSection}>
                <TextField
                    value={title}
                    size="small"
                    placeholder="Column title"
                    className={classes.input}
                    InputProps={{
                        classes: {
                            input: inputClasses.titleInput,
                        },
                    }}
                    onChange={e => setTitle(e.target.value)}
                />
                <div style={{ width: 12 }} />
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.btn}
                    onClick={() => onSubmit(title)}
                    disabled={title.trim().length === 0}
                >
                    <Trans i18nKey={langKeys.add} />
                </Button>
            </div>
            <div style={{ height: 24 }} />
            <Skeleton variant="rect" width="100%" height={150} />
            <div style={{ height: 12 }} />
            <Skeleton variant="rect" width="100%" height={150} />
            <div style={{ height: 12 }} />
            <Skeleton variant="rect" width="100%" height={150} />
            <div style={{ height: 12 }} />
            <Skeleton variant="rect" width="100%" height={150} />
            <div style={{ height: 12 }} />
            <Skeleton variant="rect" width="100%" height={150} />
        </div>
    );
}
