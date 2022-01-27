import { makeStyles } from "@material-ui/core";
import { FC } from "react";

const useLeftSideStyles = makeStyles(theme => ({
    root: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 40,
        // overflowY: 'auto',
    },
}));

interface LeftSideProps {
    listchannels: { [key: string]: boolean };
    setlistchannels: React.Dispatch<React.SetStateAction<any>>;
}

export const LeftSide: FC<LeftSideProps> = ({ listchannels, setlistchannels }) => {
    const classes = useLeftSideStyles();

    return (
        <div className={classes.root}>
            A
        </div>
    );
}