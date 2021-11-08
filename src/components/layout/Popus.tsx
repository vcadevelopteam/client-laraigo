import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Lightbox from 'react-image-lightbox';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { showSnackbar, manageConfirmation, manageLightBox } from 'store/popus/actions';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import Button from '@material-ui/core/Button';

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
    const { t } = useTranslation();

    const popus = useSelector(state => state.popus);
    const lightbox = useSelector(state => state.popus.lightbox);

    const handleCloseSnackbar = () => dispatch(showSnackbar({ ...popus.snackbar, show: false }));

    const manageConfirmationTmp = () => dispatch(manageConfirmation({ ...popus.question, visible: false }));

    const manageLightBoxTmp = (lightboxtmp: any) => dispatch(manageLightBox(lightboxtmp));
    
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

            <Dialog
                open={popus.question.visible}
                fullWidth
                maxWidth="sm"
                style={{ zIndex: 99999 }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{t(langKeys.confirmation)}</DialogTitle>
                <DialogContent>
                    <DialogContentText color="textPrimary">
                        {popus.question.question}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => {
                            popus.question.callbackcancel && popus.question.callbackcancel()
                            manageConfirmationTmp()
                        }}>
                        {t(langKeys.cancel)}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#55BD84" }}
                        onClick={() => {
                            popus.question.callback && popus.question.callback()
                            manageConfirmationTmp()
                        }}
                        color="primary">
                        {t(langKeys.continue)}
                    </Button>
                </DialogActions>
            </Dialog>

            {lightbox.visible && (
                <Lightbox
                    reactModalStyle={{ overlay: { zIndex: 2000 } }}
                    mainSrc={lightbox.images[lightbox.index]}
                    nextSrc={lightbox.images[(lightbox.index + 1) % lightbox.images.length]}
                    prevSrc={lightbox.images[(lightbox.index + lightbox.images.length - 1) % lightbox.images.length]}
                    onCloseRequest={() => manageLightBoxTmp({ open: false, index: 0 })}
                    onMovePrevRequest={() => manageLightBoxTmp({ ...lightbox, index: (lightbox.index + lightbox.images.length - 1) % lightbox.images.length })}
                    onMoveNextRequest={() => manageLightBoxTmp({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length })}
                />
            )}

        </>
    );
}

export default Popus;