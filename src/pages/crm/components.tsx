import React, { FC } from 'react';
import clsx from 'clsx';
import { Box, BoxProps, IconButton, makeStyles } from '@material-ui/core';
import { Add, Menu } from '@material-ui/icons';
import { DraggableProvided, DraggableStateSnapshot, DroppableStateSnapshot } from 'react-beautiful-dnd';

interface LeadCardContentProps extends BoxProps {
    lead: any;
    snapshot: DraggableStateSnapshot;
}

const useLeadCardStyles = makeStyles(theme => ({
    root: {
        userSelect: 'contain',
        padding: 16,
        // margin: '0 0 8px 0',
        minHeight: '50px',
        backgroundColor: 'white',
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
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
}));

export const DraggableLeadCardContent: FC<LeadCardContentProps> = ({ lead, snapshot, ...boxProps }) => {
    const classes = useLeadCardStyles();

    return (
        <Box {...boxProps} pb={1}>
            <div className={clsx(classes.root, snapshot.isDragging && classes.rootDragging)}>
                <div className={classes.floatingMenuIcon}>
                    <IconButton color="primary" size="small">
                        <Menu style={{ height: 'inherit', width: 'inherit' }} />
                    </IconButton>
                </div>
                <label className={classes.title}>{lead.description}</label>
                <label className={classes.info}>S/ {lead.expected_revenue}</label>
                <label className={classes.info}>Gemini Furniture</label>
                <div className={classes.tagsRow}>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'cyan' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Information</div>
                    </div>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'blueviolet' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Other</div>
                    </div>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'blueviolet' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Other</div>
                    </div>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'blueviolet' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Other</div>
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

interface LeadColumnProps extends Omit<BoxProps, 'title'> {
    title: React.ReactNode;
    snapshot: DraggableStateSnapshot | null;
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
        overflowY: 'hidden',
        // width: '100%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontWeight: 500,
    },
    subHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 400,
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    backgroundProgressbar: {
        backgroundColor: 'lightgrey',
        height: 14,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderRadius: 7,
    },
    progressbar: {
        backgroundColor: 'red',
        height: 'inherit',
        borderTopLeftRadius: 'inherit',
        borderBottomLeftRadius: 'inherit',
    },
}));

export const DraggableLeadColumn: FC<LeadColumnProps> = ({ children, title, provided, ...boxProps }) => {
    const classes = useLeadColumnStyles();

    return (
        <Box {...boxProps}>
            <div className={classes.root}>
                <div className={classes.header} {...provided.dragHandleProps}>
                    <h2 className={classes.title}>{title}</h2>
                    <IconButton color="primary" size="small">
                        <Add style={{ height: 22, width: 22 }} />
                    </IconButton>
                </div>
                <div className={classes.subHeader}>
                    <div className={classes.backgroundProgressbar}>
                        <div className={classes.progressbar} style={{ width: '30%' }} />
                    </div>
                    <div style={{ width: 8 }} />
                    <span>S/ 80,000</span>
                </div>
                {children}
            </div>
        </Box>
    );
}

interface LeadColumnListProps extends BoxProps {
    snapshot: DroppableStateSnapshot;
}

const useLeadColumnListStyles = makeStyles(theme => ({
    root: {
        width: 250,
        // backgroundColor: 'red',
        minHeight: 500,
    },
    // draggOver: {
    //     background: "lightblue",
    // },
}));

export const DroppableLeadColumnList: FC<LeadColumnListProps> = ({ children, title, snapshot, ...boxProps }) => {
    const classes = useLeadColumnListStyles();

    return (
        <Box {...boxProps}>
            <div className={clsx(classes.root/*, snapshot.isDraggingOver && classes.draggOver*/)}>
                {children}
            </div>
        </Box>
    );
}
