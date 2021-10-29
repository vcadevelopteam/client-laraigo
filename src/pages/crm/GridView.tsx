import React, { FC } from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';

interface ExampleITem {
    title: string;
}

const items: ExampleITem[] = [
    { title: "Product Backlog" }
]

interface ListTileProps extends BoxProps {
    lead: any;
}

const useLeadTileStyles = makeStyles(theme => ({
    root: {
        width: 'inherit',
    },
    text: {
        fontSize: 14,
        fontWeight: 400,
    },
    description: {
        fontSize: 14,
        fontWeight: 500,
    },
}));

const LeadTile: FC<ListTileProps> = ({ lead, ...boxProps }) => {
    const classes = useLeadTileStyles();

    return (
        <Box {...boxProps} width="100%">
            <div className={classes.root}>
                <span className={classes.description}>
                    RLA018. Re-configuración de rutas en base a las vistas dentro de la vista "settings"
                </span>
            </div>    
        </Box>
    );
}

const GridView: FC = () => {
    return (
        <div>
            <LeadTile lead={null} />
        </div>
    );
}

export default GridView;
