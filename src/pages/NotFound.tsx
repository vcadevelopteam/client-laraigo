import { Button, makeStyles } from "@material-ui/core";
import paths from "common/constants/paths";
import { FC } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
    home: {
        display: 'flex',
        flexDirection: 'column',
    },
    str404text: {
        fontSize: 84,
        fontWeight: 600,
    },
}));

const NotFound: FC = () => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <img src="/not_found.svg" style={{ height: 320 }} />
            <div style={{ width: 80 }} />
            <div className={classes.home}>
                <label className={classes.str404text}>404</label>
                <div style={{ width: 18 }} />
                <Button color="primary" variant="contained" onClick={() => history.push(paths.USERS)}>
                    Volver al inicio
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
