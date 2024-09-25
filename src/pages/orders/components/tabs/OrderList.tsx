import React from 'react'; 
import { useSelector } from 'hooks';
import { formatNumber } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { CellProps } from 'react-table';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    amountDiv: {
        width: "100%",
        textAlign: 'right'
    },
    amountText: {
        fontSize: "1.1em",
        fontWeight: "bold",
        paddingRight: 40
    },
}));

interface MultiData {
    data: Dictionary[];
    success: boolean;
}

interface OrderListProps {
    row: Dictionary | null;
    multiData: any;
    hideamount?: Boolean;
}

const OrderList: React.FC<OrderListProps> = ({ row, multiData, hideamount = false }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dataOrders = multiData.data[0] && multiData.data[0].success ? multiData.data[0].data : [];

    const columns = React.useMemo(
        () => [           
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
                Header: t(langKeys.measureunit),
                accessor: 'measureunit',
                type: 'number',
                sortType: 'number',
                Cell: (props: CellProps<Dictionary>) => {
                    const { quantity } = props.cell.row.original;
                    return <div style={{ paddingRight: 24 }}>{quantity}</div>
                }
            },        
            {
                Header: t(langKeys.totalamount),
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

    return (     
        <>
            <div className={classes.containerDetail}>
                <TableZyx
                    columns={columns}
                    data={dataOrders}
                    download={false}
                    loading={multiData.loading}
                    toolsFooter={true}
                    filterGeneral={false}                        
                />
                {!hideamount && <div className={classes.amountDiv}>
                    <div className={classes.amountText}>{t(langKeys.totalamount)}: {row?.currency === "PEN" ? "S/ " : "$ "}{formatNumber(dataOrders.reduce((acc, x) => acc + x.amount, 0))}</div>
                </div>}
            </div>
        </>
    );
}

export default OrderList;