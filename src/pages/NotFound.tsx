import { Button, makeStyles } from "@material-ui/core";
import { FC } from "react";
import { useHistory } from "react-router-dom";
import Error404 from 'images/error_404.png';

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
            <img src={Error404} style={{ height: '40%', width: 'auto' }} alt="404" />
            <div style={{ width: 80 }} />
            <div className={classes.home}>
                <label className={classes.str404text}>404</label>
                <div style={{ height: 8 }} />
                <Button color="primary" variant="contained" onClick={() => history.push('/')}>
                    Volver al inicio
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
