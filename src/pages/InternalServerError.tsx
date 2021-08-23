import { Button, makeStyles } from "@material-ui/core";
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

const InternalServererror: FC = () => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <img src="/server_error.svg" style={{ width: '50%', height: 'auto' }} alt="403"/>
            <div style={{ width: 80 }} />
            <div className={classes.home}>
                <label className={classes.str404text}>500</label>
                <div style={{ height: 8 }} />
                <Button color="primary" variant="contained" onClick={() => history.push('/')}>
                    Volver al inicio
                </Button>
            </div>
        </div>
    );
};

export default InternalServererror;
