import React, { ChangeEvent, useEffect, useState } from 'react'; 
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel, FieldEdit } from 'components';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tabs from '@material-ui/core/Tabs';
import History from './tabs/History';
import OrderList from './tabs/OrderList';
import DeliveryInfo from './tabs/DeliveryInfo';
import { formatDate, getOrderSel } from 'common/helpers';
import PaymentInfo from './tabs/PaymentInfo';
import { useSelector } from 'hooks';
import { getOrderDetail } from 'store/orders/actions';
import { useDispatch } from 'react-redux';
import { getCollection } from 'store/main/actions';
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
    data: RowSelected;
    setViewSelected: (view: string) => void;
}

const DetailOrders: React.FC<DetailOrdersProps> = ({ data: { row }, setViewSelected }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);
    const [row2, setRow] = useState(row);
    const dispatch = useDispatch();
	const mainResult = useSelector(state => state.main.mainData);
    const orderDetail = useSelector(state => state.orders.orderDetail);
	const params = new URLSearchParams(window.location.search);
	const id = params.get('id');
    const history = useHistory();
  
    const handleChangeTab = (event: ChangeEvent<NonNullable<unknown>>, newIndex: number) => {
        setPageSelected(newIndex);
    };
    

    useEffect(() => {
        id && dispatch(getCollection(getOrderSel("", "", "")));
        dispatch(getOrderDetail(row2?.orderid))
    }, [])
    

    useEffect(() => {
        if(id){
            if(!mainResult.loading && !mainResult.error){
                setRow(mainResult.data.filter(x=>Number(id) === x.orderid)?.[0]||{})
                dispatch(getOrderDetail(mainResult.data.filter(x=>Number(id) === x.orderid)?.[0]?.orderid||0))
            }
        }
    }, [mainResult])

    return (
        <div className={classes.formcontainer}>
            <div style={{ width: '100%' }}>
                <div className={classes.titleandcrumbs}>
                    <div style={{ flexGrow: 1}}>
                        <TemplateBreadcrumbs
                            breadcrumbs={[{ id: "GRID", name: t(langKeys.orders) }, { id: "DETAIL", name: t(langKeys.ordersdetail) }]}
                            handleClick={()=>{}}
                        />
                        <TitleDetail
                            title={`${t(langKeys.ordernumber)}: ${row2?.orderid}`}
                        />
                    </div>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ArrowBackIcon color="secondary" />}
                        onClick={() => {
                            if (id) history.goBack();
                            setViewSelected("GRID")
                        }}
                    >
                        {t(langKeys.back)}
                    </Button>
                </div>
            </div>
            <div className={classes.inputsContainer}>
                <div className="row-zyx" style={{marginBottom: 0}}>
                    <FieldEdit
                        label={t(langKeys.ordernumber)}
                        className="col-3"
                        valueDefault={row2?.orderid}   
                        disabled={true}              
                    />
                    <FieldEdit
                        label={t(langKeys.dateorder)}
                        className="col-3"
                        valueDefault={formatDate(row2?.createdate, { withTime: false })}
                        disabled={true}              
                    />
                    <FieldEdit
                        label={t(langKeys.ticket)}
                        className="col-3"
                        valueDefault={row2?.ticketnum}   
                        disabled={true}            
                    />
                    <FieldEdit
                        label={t(langKeys.channel)}
                        className="col-3"
                        valueDefault={row2?.channel}     
                        disabled={true}            
                    />
                    <FieldEdit
                        label={t(langKeys.client)}
                        className="col-4"
                        valueDefault={row2?.name}   
                        disabled={true}              
                    />
                    <FieldEdit
                        label={t(langKeys.phone)}
                        className="col-4"
                        valueDefault={row2?.phone}   
                        disabled={true}              
                    />
                    <FieldEdit
                        label={t(langKeys.email)}
                        className="col-4"
                        valueDefault={row2?.email}   
                        disabled={true}            
                    />
                </div>
            </div>
            <Tabs
                value={pageSelected}
                onChange={handleChangeTab}
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
                <AntTab
                    label={(
                        <div className={classes.tab}>
                            <Trans i18nKey={langKeys.deliveryinfo}/>
                        </div>
                    )}
                />
                    <AntTab
                    label={(
                        <div className={classes.tab}>
                            <Trans i18nKey={langKeys.payment_information} />
                        </div>
                    )}
                />
                <AntTab
                    label={(
                        <div className={classes.tab}>
                            <Trans i18nKey={langKeys.history}/>
                        </div>
                    )}
                />
            </Tabs>
            <AntTabPanel index={0} currentIndex={pageSelected}>
                <OrderList row={row2} multiData={orderDetail} />
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={pageSelected}>
                <DeliveryInfo row={row2} />
            </AntTabPanel>
            <AntTabPanel index={2} currentIndex={pageSelected}>
                <PaymentInfo row={row2} />
            </AntTabPanel>   
            <AntTabPanel index={3} currentIndex={pageSelected}>
                <History multiData={orderDetail} />
            </AntTabPanel>                      
        </div>
    );
}

export default DetailOrders;