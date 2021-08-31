import { createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import { BellNotificationIcon } from "icons";
import { FC } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        rootIcon: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
        },
        counterGlobe: {
            position: 'absolute',
            top: -1,
            right: -1,
            height: 16,
            width: 16,
            backgroundColor: '#FF7301',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-around',
        },
        counterText: {
            fontWeight: 700,
            fontSize: 8,
            display: 'flex',
            alignItems: 'center',
            color: '#F1F1F1',
        },
    }),
);

const NotificationMenu: FC = () => {
    const classes = useStyles();

    return (
        <IconButton>
            <div className={classes.rootIcon}>
                <BellNotificationIcon />
                <div className={classes.counterGlobe}>
                    <label className={classes.counterText}>1</label>
                </div>
            </div>
        </IconButton>
    );
};

export default NotificationMenu;
