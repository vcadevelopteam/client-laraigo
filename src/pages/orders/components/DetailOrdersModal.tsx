import React, { useEffect } from 'react'; 
import { TitleDetail, AntTab, AntTabPanel, FieldEdit, DialogZyx } from 'components';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Tabs from '@material-ui/core/Tabs';
import OrderList from './tabs/OrderList';
import { formatDate } from 'common/helpers';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { getOrderDetail } from 'store/orders/actions';
import paths from 'common/constants/paths';
import { useHistory } from 'react-router-dom';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}

const useStyles = makeStyles((theme) => ({
    tab: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    titleandcrumbs: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    formcontainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        paddingTop: 8
    },
    inputsContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
}));

interface DetailOrdersProps {
    row: Dictionary;
    openModal: boolean;
    setOpenModal: (x:boolean)=>void
}

const DetailOrdersModal: React.FC<DetailOrdersProps> = ({ row, openModal,setOpenModal }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const orderDetail = useSelector(state => state.orders.orderDetail);
    const history = useHistory();

    useEffect(() => {
        dispatch(getOrderDetail(row?.orderid))
    }, [row])


    return (
        
        <DialogZyx
            open={openModal}
			title={""}
			maxWidth={"xl"}
        >
            <div className={classes.formcontainer}>
                <div style={{ width: '100%' }}>
                    <div className={classes.titleandcrumbs}>
                        <div style={{ flexGrow: 1}}>
                            <TitleDetail
                                title={`${t(langKeys.ordernumber)}: ${row?.orderid}`}
                            />
                        </div>
                    </div>
                </div>
                <div className={classes.inputsContainer}>
                    <div className="row-zyx" style={{marginBottom: 0}}>
                        <FieldEdit
                            label={t(langKeys.ordernumber)}
                            className="col-3"
                            valueDefault={row?.orderid}   
                            disabled={true}              
                        />
                        <FieldEdit
                            label={t(langKeys.dateorder)}
                            className="col-3"
                            valueDefault={formatDate(row?.createdate, { withTime: false })}
                            disabled={true}              
                        />
                        <FieldEdit
                            label={t(langKeys.ticket)}
                            className="col-3"
                            valueDefault={row?.ticketnum}   
                            disabled={true}            
                        />
                        <FieldEdit
                            label={t(langKeys.channel)}
                            className="col-3"
                            valueDefault={row?.channel}     
                            disabled={true}            
                        />
                        <FieldEdit
                            label={t(langKeys.client)}
                            className="col-4"
                            valueDefault={row?.name}   
                            disabled={true}              
                        />
                        <FieldEdit
                            label={t(langKeys.phone)}
                            className="col-4"
                            valueDefault={row?.phone}   
                            disabled={true}              
                        />
                        <FieldEdit
                            label={t(langKeys.email)}
                            className="col-4"
                            valueDefault={row?.email}   
                            disabled={true}            
                        />
                    </div>
                </div>
                <Tabs
                    value={0}
                    className={classes.tabs}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <AntTab
                        label={(
                            <div className={classes.tab}>
                                <Trans i18nKey={langKeys.orderlists} />
                            </div>
                        )}
                    />
                </Tabs>
                <AntTabPanel index={0} currentIndex={0}>
                    <OrderList row={row} multiData={orderDetail}  hideamount={true}/>
                </AntTabPanel>
                <div style={{gap:10, display: "flex",justifyContent: "end"}}>                
                    <Button
                        variant="contained"
                        type="button"
                        color="secondary"
                        onClick={() => setOpenModal(false)}
                    >
                        {t(langKeys.cancel)}
                    </Button>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        endIcon={<ArrowForwardIcon color="secondary" />}
                        onClick={() => {history.push(paths.ORDERS + "?id=" + row?.orderid)}}
                    >
                        {t(langKeys.gotoorder)}
                    </Button>
                </div>                 
            </div>
        </DialogZyx>
    );
}

export default DetailOrdersModal;