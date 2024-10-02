import { Avatar, makeStyles } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { FC } from "react";


const usePhotoClasses = makeStyles(theme => ({
    accountPhoto: {
        height: 60,
        width: 60,
        color: "#7721ad"
    },
}));

interface PhotoProps {
    src?: string;
    radius?: number;
}

export const Photo: FC<PhotoProps> = ({ src, radius }) => {
    const classes = usePhotoClasses();
    const width = radius && radius * 2;
    const height = radius && radius * 2;

    if (!src || src === "") {
        return <AccountCircle className={classes.accountPhoto} style={{ width, height }} />;
    }
    return <Avatar alt={src} src={src} className={classes.accountPhoto} style={{ width, height }} />;
}