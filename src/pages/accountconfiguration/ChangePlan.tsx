import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Radio, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { cancelSuscription as cancelSuscriptionFunction } from 'common/helpers';
import { showSnackbar, manageConfirmation } from 'store/popus/actions';
import clsx from 'clsx';
import { execute } from 'store/main/actions';
import { changePlan as changePlanFunction } from 'common/helpers';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        marginRight: theme.spacing(2),
    },
    seccionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        paddingBottom: 10
    },
    table: {
        minWidth: 650,
    },
    nameplan: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    planSelected: {
        backgroundColor: '#e1e1e1'
    },
    hyperlinkstyle: {
        color: "-webkit-link",
        cursor: "pointer",
        textDecoration: "underline"
    }, 
}));

interface DetailProps {
    setViewSelected: (view: string) => void;  
}

const ChangePlan: React.FC<DetailProps> = ({ setViewSelected }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const user = useSelector(state => state.login.validateToken.user);
    const executeResult = useSelector(state => state.main.execute);
    const [plan, setPlan] = useState(user?.plan || "");
    const tableRef = useRef<HTMLDivElement>(null);
    const thirdColRef = useRef<HTMLTableCellElement>(null);
    const [calculatedWidth, setCalculatedWidth] = useState<number | null>(null);

    console.log('user', user?.plan)

    const calculateWidth = () => {
        if (tableRef.current && thirdColRef.current) {
            const tableRect = tableRef.current.getBoundingClientRect();
            const thirdColRect = thirdColRef.current.getBoundingClientRect();
            setCalculatedWidth((thirdColRect.left - tableRect.left)-85);
        }
    };

    useEffect(() => {
        calculateWidth();
        window.addEventListener('resize', calculateWidth);
        return () => window.removeEventListener('resize', calculateWidth);
    }, []);

 
    function changePlan(nameplan: "BASICO" | "PROFESIONAL" | "AVANZADO" | "ENTERPRISE") {
        if (nameplan !== user?.plan)
            setPlan(nameplan)
    }

    const handlerSave = () => {
        const callback = () => {
            setWaitSave(true)
            dispatch(execute(changePlanFunction(plan)));
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmchangeplan),
            callback
        }))
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSave(false)
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_change_plan) }));
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error")
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
            }
        }
    }, [executeResult])

    function cancelSuscription() {
        if ((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(v))) {
            const callback = () => {
                setWaitSave(true);
                dispatch(execute(cancelSuscriptionFunction()));
            }
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.cancelsuscriptionconfirmation),
                textCancel: t(langKeys.back),
                callback
            }))
        } else {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.notpermisionforaction) }));
        }
    }

    return (
        <div style={{ width: "100%" }}>           

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom:'2rem' }}>                
                <div className={classes.seccionTitle}>{t(langKeys.changeplan)}</div>
                <div style={{ display: 'flex', gap: '10px'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={plan === user?.plan || executeResult.loading}
                        onClick={handlerSave}
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}>
                        {t(langKeys.changeplan)}
                    </Button>
                </div>
            </div>

            <div className={classes.containerDetail} ref={tableRef}>
                <div className="row-zyx">
                    <TableContainer>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableBody>
                                <TableRow style={{ cursor: 'pointer' }} onClick={() => changePlan("BASICO")} className={clsx({
                                    [classes.planSelected]: user?.plan === "BASICO"
                                })}>
                                    <TableCell component="th" scope="row">
                                        <Radio
                                            color="primary"
                                            checked={plan === "BASICO"}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" className={classes.nameplan}>BASICO</TableCell>
                                    <TableCell component="th" scope="row" ref={thirdColRef}>
                                        <b>{t(langKeys.basicdesc1)}</b>
                                        <div>{t(langKeys.basicdesc2)}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">$24</TableCell>
                                </TableRow>
                                <TableRow style={{ cursor: 'pointer' }} onClick={() => changePlan("PROFESIONAL")} className={clsx({
                                    [classes.planSelected]: user?.plan === "PROFESIONAL"
                                })}>
                                    <TableCell component="th" scope="row">
                                        <Radio
                                            color="primary"
                                            checked={plan === "PROFESIONAL"}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" className={classes.nameplan}>PROFESIONAL</TableCell>
                                    <TableCell component="th" scope="row">
                                        <b>{t(langKeys.prodesc1)}</b>
                                        <div>{t(langKeys.prodesc2)}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">$59</TableCell>
                                </TableRow>
                                <TableRow style={{ cursor: 'pointer' }} onClick={() => changePlan("AVANZADO")} className={clsx({
                                    [classes.planSelected]: user?.plan === "AVANZADO"
                                })}>
                                    <TableCell component="th" scope="row">
                                        <Radio
                                            color="primary"
                                            checked={plan === "AVANZADO"}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" className={classes.nameplan}>AVANZADO</TableCell>
                                    <TableCell component="th" scope="row">
                                        <b>{t(langKeys.advanceddesc1)}</b>
                                        <div>{t(langKeys.advanceddesc2)}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">$139</TableCell>
                                </TableRow>
                                <TableRow style={{ cursor: 'pointer' }} onClick={() => changePlan("ENTERPRISE")} className={clsx({
                                    [classes.planSelected]: user?.plan === "ENTERPRISE"
                                })}>
                                    <TableCell component="th" scope="row">
                                        <Radio
                                            color="primary"
                                            checked={plan === "ENTERPRISE"}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" className={classes.nameplan}>ENTERPRISE</TableCell>
                                    <TableCell component="th" scope="row">
                                        <b>{t(langKeys.premiumdesc1)}</b>
                                        <div>{t(langKeys.premiumdesc2)}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">$399</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ textAlign: "center", fontWeight: 500, fontSize: 12, color: "grey", marginLeft: "15px", marginTop: "15px" }}>{t(langKeys.detailchangeplan1)}</div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: calculatedWidth ? `${calculatedWidth}px` : '2rem' }}>
                <div className={classes.seccionTitle}>{t(langKeys.suscription)}</div>              
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => cancelSuscription()}
                    style={{width:'15rem'}}
                >
                    {t(langKeys.cancelsuscription)}
                </Button>
              
            </div>
        </div>
    )
}

export default ChangePlan;