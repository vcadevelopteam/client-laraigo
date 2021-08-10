import Snackbar from '@material-ui/core/Snackbar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useSelector } from 'hooks';

import { useDispatch } from 'react-redux';

import { showSnackbar } from 'store/popus/actions';

const useStyles = makeStyles({
    cookieAlert: {
      "& svg": {
        color: 'white'
      }
    }
  });

const Popus: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const popus = useSelector(state => state.popus);

    const handleCloseSnackbar = () => dispatch(showSnackbar({ ...popus.snackbar, show: false }))

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                color="white"
                open={popus.snackbar.show}
                onClose={handleCloseSnackbar}
                key={'topright'}
            >
                <MuiAlert className={classes.cookieAlert} elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={popus.snackbar.success ? "success" : "error"}>
                    {popus.snackbar.message}
                </MuiAlert>
            </Snackbar>
            <Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={popus.showBackDrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

        </>
    );
}

export default Popus;