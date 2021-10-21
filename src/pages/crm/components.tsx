import React, { FC } from 'react';
import clsx from 'clsx';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import { DraggableStateSnapshot, DroppableStateSnapshot } from 'react-beautiful-dnd';

interface LeadCardContentProps extends BoxProps {
    lead: any;
    snapshot: DraggableStateSnapshot;
}

const useLeadCardStyles = makeStyles(theme => ({
    root: {
        userSelect: "none",
        padding: 16,
        // margin: "0 0 8px 0",
        minHeight: "50px",
        backgroundColor: "#456C86",
        color: "white",
        display: 'flex',
        flexDirection: 'column',
    },
    dragging: {
        backgroundColor: "#263B4A",
    },
    title: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },
    info: {
        fontSize: 14,
        fontWeight: 400,
        marginBottom: theme.spacing(1),
    },
    tagsRow: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
            <div className={clsx(classes.root, snapshot.isDragging && classes.dragging)}>
                <label className={classes.title}>Distribution</label>
                <label className={classes.info}>S/ 19,800.00</label>
                <label className={classes.info}>Gemini Furniture</label>
                <div className={classes.tagsRow}>
                    <div className={classes.tag}>
                        <div className={classes.tagCircle} style={{ backgroundColor: 'red' }} />
                        <div style={{ width: 8 }} />
                        <div className={classes.tagtext}>Information</div>
                    </div>
                </div>
            </div>
        </Box>
    );
}

interface LeadColumnProps extends Omit<BoxProps, 'title'> {
    title: React.ReactNode;
    snapshot: DraggableStateSnapshot | null;
}

const useLeadColumnStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export const DraggableLeadColumn: FC<LeadColumnProps> = ({ children, title, ...boxProps }) => {
    const classes = useLeadColumnStyles();

    return (
        <Box {...boxProps}>
            <div className={classes.root}>
                <h2>{title}</h2>
                <div style={{ margin: 8 }}>
                    {children}
                </div>
            </div>
        </Box>
    );
}

interface LeadColumnListProps extends BoxProps {
    snapshot: DroppableStateSnapshot;
}

const useLeadColumnListStyles = makeStyles(theme => ({
    root: {
        background: "lightgrey",
        padding: 4,
        width: 250,
        minHeight: 500,
    },
    draggOver: {
        background: "lightblue",
    }
}));

export const DroppableLeadColumnList: FC<LeadColumnListProps> = ({ children, title, snapshot, ...boxProps }) => {
    const classes = useLeadColumnListStyles();

    return (
        <Box {...boxProps}>
            <div className={clsx(classes.root, snapshot.isDraggingOver && classes.draggOver)}>
                {children}
            </div>
        </Box>
    );
}
