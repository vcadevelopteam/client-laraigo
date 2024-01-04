import React, { ChangeEvent, useState } from 'react'; // we need this to make JSX compile
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
    multiData: MultiData[];
}

const DetailOrders: React.FC<DetailOrdersProps> = ({ data: { row, edit }, multiData, setViewSelected }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);
  
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
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ArrowBackIcon color="secondary" />}
                        onClick={() => setViewSelected("GRID")}
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
                <OrderList row={row} multiData={multiData} />
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={pageSelected}>
                <DeliveryInfo row={row} />
            </AntTabPanel>
            <AntTabPanel index={2} currentIndex={pageSelected}>
                <PaymentInfo row={row} />
            </AntTabPanel>   
            <AntTabPanel index={3} currentIndex={pageSelected}>
                <History multiData={multiData} />
            </AntTabPanel>                      
        </div>
    );
}

export default DetailOrders;