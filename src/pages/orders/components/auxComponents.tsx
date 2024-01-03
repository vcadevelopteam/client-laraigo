import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { Box, BoxProps, Button, makeStyles, Popover } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { DraggableProvided, DraggableStateSnapshot, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { langKeys } from 'lang/keys';
import { Trans, useTranslation } from 'react-i18next';
import { Dictionary } from '@types';
import { FieldEdit, FieldSelect } from 'components';
import { useSelector } from 'hooks';

const columnWidth = 275;
const columnMinHeight = 500;
const cardBorderRadius = 12;
const inputTitleHeight = 50;

interface OrderCardContentProps extends Omit<BoxProps, 'onClick'> {
    order: Dictionary;
    snapshot: DraggableStateSnapshot;
    onClick: (order: Dictionary) => void;
}

const useLeadCardStyles = makeStyles(theme => ({
    root: {
        padding: 16,
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
    tagBox: {
        width: 8,
        height: 8,
        borderRadius: 1,
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

export const DraggableOrderCardContent: FC<OrderCardContentProps> = ({ order, snapshot, onClick, ...boxProps }) => {
    const classes = useLeadCardStyles();
    const { t } = useTranslation();
    return (
        <Box {...boxProps} style={{ position: 'relative' }} pb={1}>
            <div className={clsx(classes.root, snapshot.isDragging && classes.rootDragging)} onClick={() => onClick(order)}>
                <span className={classes.title}>ID: {order.orderid}</span>
                <span className={classes.info}>{t(langKeys.amount)}: {order.currency} {Number(order.amount).toLocaleString('en-US')}</span>
                <span className={classes.info}>{t(langKeys.client)}: {order.name}</span>
                <span className={classes.info}>{t(langKeys.phone)}: {order.phone}</span>
                <span className={classes.info}>Items: {order.num_items}</span>
                <span className={classes.info} style={{ color: "#7ca772" }}>Tipo entrega: {order.var_tipoentrega}</span>
                <span className={classes.info}>Fecha programada entrega: {order.var_fechaentrega} {order.var_horaentrega}</span>
            </div>
        </Box>
    );
}


interface OrderColumnProps extends Omit<BoxProps, 'title'> {
    /**default title value */
    snapshot: DraggableStateSnapshot | null;
    titleOnChange?: (value: string) => void;
    onAddCard?: () => void;
    provided?: DraggableProvided;
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
        fontWeight: 'bold',
    },
}));

export const DraggableOrderColumn: FC<OrderColumnProps> = ({
    children,
    provided,
    total_revenue,
    ...boxProps
}) => {
    const classes = useLeadColumnStyles();
    const user = useSelector(state => state.login.validateToken.user);

    return (
        <Box {...boxProps}>
            <div className={classes.root} {...(provided?.dragHandleProps || {})}>
                <div style={{display:"flex", justifyContent: "space-between", width: "100%"}}>
                    <span className={classes.currency}>{user?.currencysymbol||"S/."} {total_revenue?.toLocaleString('en-US') || 0}</span>
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

const useLeadColumnListStyles = makeStyles(({
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

export const DroppableOrderColumnList: FC<LeadColumnListProps> = ({ children, snapshot, itemCount, ...boxProps }) => {
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
    onSubmit: (data: any) => void;
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
    const { t } = useTranslation();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'crm-add-new-column-popover' : undefined;

    const handleSubmit = (data: any) => {
        onSubmit(data);
        handleClose();
    };

    return (
        <Box>
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
                    <span>{t(langKeys.addacolumn)}</span>
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
                >
                    <ColumnTemplate onSubmit={handleSubmit} />
                </Popover>
            </div>
        </Box>
    );
}

interface ColumnTemplateProps {
    onSubmit: (title: any) => void;
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
        width: 'inherit',
    },
    btn: {
        width: "100%"
    },
}));

const ColumnTemplate: FC<ColumnTemplateProps> = ({ onSubmit }) => {
    const classes = useColumnTemplateStyles();
    const [title, setTitle] = useState("");
    const [type, settype] = useState("");
    const [disabled, setdisabled] = useState(true);
    const { t } = useTranslation();

    return (
        <div className={classes.root}>
            <div className={classes.titleSection}>
                <div style={{ padding: "10px 0" }}>
                    <FieldEdit
                        label={t(langKeys.columntitle)}
                        valueDefault={title}
                        onChange={value => { setdisabled(value.trim().length === 0 || !type); setTitle(value) }}
                    />
                </div>

                <div style={{ padding: "10px 0" }}>
                    <FieldSelect
                        label={`${t(langKeys.type)}`}
                        size="small"
                        valueDefault={type}
                        onChange={e => { setdisabled(!(e?.type) || title.trim().length === 0); settype(e?.type || "") }}
                        data={[
                            { type: "QUALIFIED", desc: t(langKeys.qualified) },
                            { type: "PROPOSITION", desc: t(langKeys.proposition) },
                            { type: "WON", desc: t(langKeys.won) },
                        ]}
                        optionDesc="desc"
                        optionValue="type"
                    />
                </div>

                <div style={{ padding: "10px 0", width: "100%" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.btn}
                        onClick={() => onSubmit({ title: title, type: type })}
                        disabled={disabled}
                    >
                        <Trans i18nKey={langKeys.add} />
                    </Button>
                </div>
            </div>
        </div>
    );
}


const useTabPanelStyles = makeStyles(({
    root: {
        border: '#A59F9F 1px solid',
        borderRadius: 6,
    },
}));

interface TabPanelProps {
    value: string;
    index: string;
}

export const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    const classes = useTabPanelStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            className={classes.root}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            style={{ display: value === index ? 'block' : 'none' }}
        >
            <Box p={3}>
                {children}
            </Box>
        </div>
    );
}