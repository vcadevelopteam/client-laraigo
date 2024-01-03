import React, { ChangeEvent, useState } from 'react'; // we need this to make JSX compile
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel, FieldEdit } from 'components';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Tabs from '@material-ui/core/Tabs';
import History from './tabs/History';
import OrderList from './tabs/OrderList';
import DeliveryInfo from './tabs/DeliveryInfo';
import { formatDate } from 'common/helpers';
import PaymentInfo from './tabs/PaymentInfo';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}

const useStyles = makeStyles(() => ({      
    buttonscontainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginBottom: 10
    },
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
        marginBottom: 12,
        marginTop: 4,
    },
    formcontainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    container: {
        width: '100%',
        color: "#2E2C34",
    },
}));

interface DetailOrdersProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
}

const DetailOrders: React.FC<DetailOrdersProps> = ({ data: { row, edit }, multiData, setViewSelected }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);
    const dataOrders = multiData[0] && multiData[0].success ? multiData[0].data : [];
  
    const handleChangeTab = (event: ChangeEvent<NonNullable<unknown>>, newIndex: number) => {
        setPageSelected(newIndex);
    };

    return (
        <div className={classes.formcontainer}>

            <div style={{ width: '100%' }}>
                <div className={classes.titleandcrumbs}>
                    <div style={{ flexGrow: 1}}>
                        <TemplateBreadcrumbs
                            breadcrumbs={[{ id: "GRID", name: t(langKeys.orders) }, { id: "DETAIL", name: t(langKeys.ordersdetail) }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={`${t(langKeys.ordernumber)}: ${row?.orderid}`}
                        />
                    </div>
                </div>              
                <div className={classes.container}>
                    <div className={classes.buttonscontainer}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("GRID")}
                        >{t(langKeys.back)}</Button>
                    </div>
                </div>
            </div>  

            <div className="row-zyx" style={{paddingTop: 20}}>
                <FieldEdit
                    label={t(langKeys.ordernumber)}
                    className="col-3"
                    valueDefault={row?.orderid || "-"}   
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.dateorder)}
                    className="col-3"
                    valueDefault={formatDate(row?.createdate, { withTime: false }) || "-"}
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.ticket)}
                    className="col-3"
                    valueDefault={row?.ticketnum || "-"}   
                    disabled={true}            
                />
                <FieldEdit
                    label={t(langKeys.channel)}
                    className="col-3"
                    valueDefault={row?.channel || "-"}     
                    disabled={true}            
                />           
            </div>

            <div className="row-zyx" style={{paddingBottom: 20}}>
                <FieldEdit
                    label={t(langKeys.client)}
                    className="col-4"
                    valueDefault={row?.name || "-"}   
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.phone)}
                    className="col-4"
                    valueDefault={row?.phone || "-"}   
                    disabled={true}              
                />
                <FieldEdit
                    label={t(langKeys.email)}
                    className="col-4"
                    valueDefault={row?.email || "@laraigo.com"}   
                    disabled={true}            
                />                       
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
                <OrderList
                    row={row}
                    dataorders={dataOrders}                    
                />
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={pageSelected}>
                <DeliveryInfo
                    row={row}
                    multiData={multiData}                                           
                />
            </AntTabPanel>     

            <AntTabPanel index={2} currentIndex={pageSelected}>
                <PaymentInfo
                    row={row}
                    multiData={multiData}                                           
                />
            </AntTabPanel>   
              
            <AntTabPanel index={3} currentIndex={pageSelected}>
                <History
                    multiData={multiData}                        
                />
            </AntTabPanel>                      
        </div>
    );
}

export default DetailOrders;