/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RightSideMenu from './RightSideMenu';
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import { langKeys } from 'lang/keys';
import { Trans } from 'react-i18next';
import { LaraigoLogo } from 'icons';
import { LeftSide } from './LeftSideMenu';
import { SubscriptionContext, SubscriptionProvider, usePlanData } from './context';
import Popus from 'components/layout/Popus';
import { useFormContext } from 'react-hook-form';

const useSignUpStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#F7F7F7',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    purplecircle: {
        background: "#7721ad",
        borderRadius: "50%",
        width: 43,
        height: 43,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        fontSize: 24,
        fontWeight: 700
    },
    containerHead: {
        display: "flex",
        border: '1px solid #D1CBCB',
        flex: '0 0 1',
        paddingTop: 16,
        paddingBottom: 16,
        // marginBottom: 4,
        backgroundColor: '#FFF',

    },
    containerLogo: {
        flex: 1,
        backgroundColor: 'white',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
    },
    notthisstep: {
        background: "#e5e5e5",
        borderRadius: "50%",
        width: 43,
        display: "flex",
        justifyContent: "center",
        height: 43,
        alignItems: "center",
        textAlign: "center",
        color: "#a59f9f",
        fontSize: 24,
        fontWeight: 700
    },
    separator: {
        borderBottom: "1px solid #D1CBCB",
        width: "15%",
        height: 0,
        marginLeft: 4,
        marginRight: 4
    },
    cookieAlert: {
        "& svg": {
            color: 'white'
        }
    },
    emptyspacenumber: {
        flex: 1,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
    }
}));

export const SignUp: FC = () => {
    return (
        <SubscriptionProvider>
            <SignUpFunc />
            <Popus />
        </SubscriptionProvider>
    );
}

const SignUpFunc: FC = () => {
    const { step, setStep } = useContext(SubscriptionContext);
    const { getValues, reset } = useFormContext();
    const { loading: planDataLoading } = usePlanData();
    const [openWarning, setOpenWarning] = useState(false);

    function setDefaultMainData() {
        reset({
            ...getValues(),
            email: "",
            password: "",
            confirmpassword: "",
            firstandlastname: "",
            companybusinessname: "",
            mobilephone: "",
            facebookid: "",
            googleid: "",
            join_reason: "",
            country: "",
            doctype: 0,
            docnumber: "",
            businessname: "",
            fiscaladdress: "",
            billingcontact: "",
            billingcontactmail: "",
            autosendinvoice: true,
        });
    }
    function setDefaultMainData2() {
        reset({
            ...getValues(),
            doctype: 0,
            docnumber: "",
            businessname: "",
            fiscaladdress: "",
            billingcontact: "",
            billingcontactmail: "",
        })
    }

    const handleClose = () => {
        setOpenWarning(false);
    };
    const handleClose2 = () => {
        if (step === 2) {
            setDefaultMainData()
        } else if (step === 4) {
            // setrequestchannels([])
        } else if (step === 3) {
            setStep(2.5)
        } else if (step === 2.5) {
            setDefaultMainData2()
            setStep(2)
        } else if (step === 2.6) {
            setStep(2.5);
        } else {
            setStep(step - 1)
        }
        setOpenWarning(false);
    };

    const classes = useSignUpStyles();

    return (
        <div className={classes.root}>
            <Dialog
                open={openWarning}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Trans i18nKey={langKeys.goback} />
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button onClick={handleClose2} color="primary" autoFocus>
                        <Trans i18nKey={langKeys.yes} />
                    </Button>
                </DialogActions>
            </Dialog>
            <div className={classes.containerHead}>
                <div className={classes.emptyspacenumber}></div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className={step === 1 ? classes.purplecircle : classes.notthisstep}> 1 </div>
                    <div className={classes.separator}> </div>
                    <div className={step === 2 ? classes.purplecircle : classes.notthisstep}> 2 </div>
                    <div className={classes.separator}> </div>
                    <div className={step === 2.5 ? classes.purplecircle : classes.notthisstep}> 3 </div>
                    <div className={classes.separator}> </div>
                    <div className={step === 2.6 ? classes.purplecircle : classes.notthisstep}> 4 </div>
                    <div className={classes.separator}> </div>
                    <div className={step === 3 ? classes.purplecircle : classes.notthisstep}> 5 </div>
                    <div className={classes.separator}> </div>
                    <div className={step === 4 ? classes.purplecircle : classes.notthisstep}> 6 </div>
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: step === 3 ? 'row-reverse' : 'row',
                height: '100%',
                flexGrow: 1,
                overflow: 'hidden',
            }}>
                {step === 3 ? (
                    <LeftSide setOpenWarning={setOpenWarning} />
                ) : (
                    <div className={classes.containerLogo}>
                        {/* containerlogo tiene flex 1, para q se divida con el texto */}
                        <LaraigoLogo style={{ width: '50%' }} />
                    </div>
                )}
                <div style={{
                    flex: 1,
                    padding: 40,
                    overflowY: 'auto',
                }}>
                    {!planDataLoading
                        ? <RightSideMenu setOpenWarning={setOpenWarning} />
                        : <CircularProgress />
                    }
                </div>
            </div>
        </div>
    );
};
