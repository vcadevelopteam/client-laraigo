/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { TemplateBreadcrumbs, TitleDetail } from 'components';
import { formatNumber } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import { Avatar } from '@material-ui/core';
import MapFixedLocation from 'pages/MapFixedLocation';

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
    const dataorders = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.picture),
                accessor: 'imagelink',
                NoFilter: true,                
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <Avatar alt={row.title} src={row.imagelink} variant="square" style={{margin: "6px 24px 6px 16px"}}/>

                }
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                type: 'text',
                sortType: 'text',
                Cell: (props: any) => {
                    const { description } = props.cell.row.original;
                    return <div style={{paddingLeft: 16}}>{description}</div>
                }
            },
            {
                Header: t(langKeys.quantity),
                accessor: 'quantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { quantity } = props.cell.row.original;
                    return <div style={{paddingRight: 24}}>{quantity}</div>
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                type: 'text',
                sortType: 'text',
                Cell: (props: any) => {
                    const { currency } = props.cell.row.original;
                    return <div style={{paddingLeft: 16}}>{currency}</div>
                }
            },
            {
                Header: t(langKeys.unitaryprice),
                accessor: 'unitprice',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { unitprice } = props.cell.row.original;
                    return <div style={{paddingRight: 24}}>{formatNumber(unitprice || 0)}</div>
                }
            },
            {
                Header: t(langKeys.subtotal),
                accessor: 'amount',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { amount } = props.cell.row.original;
                    return <div style={{paddingRight: 24}}>{formatNumber(amount || 0)}</div>
                }
            },
        ],
        []
    );

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={[{ id: "GRID", name: t(langKeys.orders) }, { id: "DETAIL", name: t(langKeys.ordersdetail) }]}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={`${t(langKeys.ordernumber)}: ${row?.orderid}`}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
            
            <div style={{width: "100%", display: "flex", justifyContent: "space-between", padding: 10}}>
                <div style={{fontSize: "1.2em"}}>{t(langKeys.client)}: {row?.name}</div>
                <div style={{fontSize: "1.2em"}}>{t(langKeys.phone)}: {row?.phone}</div>
                <div style={{fontSize: "1.2em"}}>{t(langKeys.channel)}: {row?.channel}</div>
                <div style={{fontSize: "1.2em"}}>{t(langKeys.ticket_numeroticket)}: {row?.ticketnum}</div>
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "space-between", padding: 10}}>
                <div style={{fontSize: "1.2em"}}>{t(langKeys.address)}: {row?.address}</div>
            </div>
            <div className="row-zyx">
                <div>
                    <div style={{ width: "100%" }}>
                        <MapFixedLocation height={"200px"} longitude={parseFloat(row?.longitude||0)} latitude={parseFloat(row?.latitude||0)}/>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            </div>
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <TableZyx
                        columns={columns}
                        titlemodule={t(langKeys.orderlist)}
                        data={dataorders}
                        download={true}
                        loading={mainResult.multiData.loading}
                        toolsFooter={false}
                        filterGeneral={false}
                    />
                </div>
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "space-between", padding: 15}}>
                <div style={{fontSize: "1.2em"}}></div>
                <div style={{fontSize: "1.2em", fontWeight: "bold"}}>{t(langKeys.total)}: {row?.currency === "PEN"? "S/ ": "$ "}{formatNumber(dataorders.reduce((acc,x)=>acc + x.amount,0))}</div>
            </div>
            
        </div>
    );
}

export default DetailOrders;