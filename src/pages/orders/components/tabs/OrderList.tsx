import React from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { formatNumber } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { CellProps } from 'react-table';

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

interface OrderListProps {  
    row: Dictionary | null;
    dataorders: any;
}

const OrderList: React.FC<OrderListProps> = ({ row, dataorders }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);

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

    return (     
        <>
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
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: 15 }}>
                <div style={{ fontSize: "1.2em" }}></div>
                <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>{t(langKeys.total)}: {row?.currency === "PEN" ? "S/ " : "$ "}{formatNumber(dataorders.reduce((acc, x) => acc + x.amount, 0))}</div>
            </div>          
        </>
    );
}

export default OrderList;