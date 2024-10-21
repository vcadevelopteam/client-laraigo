import CircularProgress from "@material-ui/core/CircularProgress";
import React, { FC, useEffect } from "react";

import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router";

const useStyles = makeStyles(() => ({
    back: {
        backgroundColor: "#fbfcfd",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

export const PhoneRedirect: FC = () => {
    const classes = useStyles();

    const { phone }: any = useParams();

    useEffect(() => {
        window.open(`tel:${phone}`, "_blank");
        window.open(`tel:${phone}`, "_self");
        window.close();
    }, [])

    return (
        <div className={classes.back}>
            <CircularProgress />
        </div>
    );
};

export default PhoneRedirect;