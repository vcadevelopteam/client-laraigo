import React, { ChangeEvent, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel } from 'components';
import { convertLocalDate, formatNumber } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import { Avatar } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import MapLeaflet from 'components/fields/MapLeaflet';
import { CellProps } from 'react-table';
import History from './tabs/History';
import OrderList from './tabs/OrderList';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
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
    const mainResult = useSelector(state => state.main);
    const [pageSelected, setPageSelected] = useState(0);
    const dataOrders = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.picture),
                accessor: 'imagelink',
                NoFilter: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return <Avatar alt={row.title} src={row.imagelink} variant="square" style={{ margin: "6px 24px 6px 16px" }} />

                }
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                type: 'text',
                sortType: 'text',
                Cell: (props: CellProps<Dictionary>) => {
                    const { description } = props.cell.row.original;
                    return <div style={{ paddingLeft: 16 }}>{description}</div>
                }
            },
            {
                Header: t(langKeys.quantity),
                accessor: 'quantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: CellProps<Dictionary>) => {
                    const { quantity } = props.cell.row.original;
                    return <div style={{ paddingRight: 24 }}>{quantity}</div>
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                type: 'text',
                sortType: 'text',
                Cell: (props: CellProps<Dictionary>) => {
                    const { currency } = props.cell.row.original;
                    return <div style={{ paddingLeft: 16 }}>{currency}</div>
                }
            },
            {
                Header: t(langKeys.unitaryprice),
                accessor: 'unitprice',
                type: 'number',
                sortType: 'number',
                Cell: (props: CellProps<Dictionary>) => {
                    const { unitprice } = props.cell.row.original;
                    return <div style={{ paddingRight: 24 }}>{formatNumber(unitprice || 0)}</div>
                }
            },
            {
                Header: t(langKeys.subtotal),
                accessor: 'amount',
                type: 'number',
                sortType: 'number',
                Cell: (props: CellProps<Dictionary>) => {
                    const { amount } = props.cell.row.original;
                    return <div style={{ paddingRight: 24 }}>{formatNumber(amount || 0)}</div>
                }
            },
        ],
        []
    );

    const columnsHistory = React.useMemo(
        () => [
            {
                Header: t(langKeys.description),
                accessor: 'col_description',
                Cell: (props: CellProps<Dictionary>) => {
                    const { description } = props.cell.row.original;
                    return <div style={{ padding: 16 }}>{t(description.toLowerCase())}</div>
                }
            },
            {
                Header: t(langKeys.createdBy),
                accessor: 'createby',
                Cell: (props: CellProps<Dictionary>) => {
                    const { createby } = props.cell.row.original;
                    return <div style={{ padding: 16 }}>{createby}</div>
                }
            },
            {
                Header: t(langKeys.date),
                accessor: 'changedate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.createdate).toLocaleString()
                }
            },
        ],
        []
    );

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
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: 10 }}>
                        <div style={{ fontSize: "1.2em" }}>{t(langKeys.client)}: {row?.name}</div>
                        <div style={{ fontSize: "1.2em" }}>{t(langKeys.phone)}: {row?.phone}</div>
                        <div style={{ fontSize: "1.2em" }}>{t(langKeys.channel)}: {row?.channel}</div>
                        <div style={{ fontSize: "1.2em" }}>{t(langKeys.ticket_numeroticket)}: {row?.ticketnum}</div>
                    </div>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: 10 }}>
                        <div style={{ fontSize: "1.2em" }}>{"Tipo entrega"}: {row?.var_tipoentrega}</div>
                        <div style={{ fontSize: "1.2em" }}>{"Fecha programada entrega"}: {row?.var_fechaentrega} {row?.var_horaentrega}</div>
                        <div></div>
                        <div></div>
                    </div>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: 10 }}>
                        <div style={{ fontSize: "1.2em" }}>{t(langKeys.address)}: {row?.address}</div>
                    </div>
                    <div className="row-zyx">
                        <div>
                            <div style={{ width: "100%" }}>
                                <MapLeaflet
                                    height={200}
                                    marker={row && { lat: parseFloat(row?.longitude || 0), lng: parseFloat(row?.latitude || 0) }}
                                />
                            </div>
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
                                    <Trans i18nKey={langKeys.orderlist} />
                                </div>
                            )}
                        />
                        <AntTab
                            label={(
                                <div className={classes.tab}>
                                    <Trans i18nKey={langKeys.delivered}/>
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
                        <span>b</span>
                    </AntTabPanel>     
                    <AntTabPanel index={2} currentIndex={pageSelected}>
                        <span>c</span>
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