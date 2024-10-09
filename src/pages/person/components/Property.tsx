import { Box, BoxProps, makeStyles } from "@material-ui/core";
import { FC } from "react";
import { PropertyProps } from "../model";
import { usePropertyStyles } from "../styles";

const Property: FC<PropertyProps> = ({ icon, title="", subtitle, isLink = false, classesAlt = null,...boxProps }) => {
    const classes = classesAlt || usePropertyStyles();

    return (
        <Box className={classes.propertyRoot} {...boxProps}>
            {icon && <div className={classes.leadingContainer}>{icon}</div>}
            {icon && <div style={{ width: 8, minWidth: 8 }} />}
            <div className={classes.contentContainer}>
                { !!title && <label className={classes.propTitle}>{title}</label>}
                <div style={{ height: 4 }} />
                <div className={isLink ? classes.propSubtitleTicket : classes.propSubtitle}>{subtitle || "-"}</div>
            </div>
        </Box>
    );
}

export default Property;