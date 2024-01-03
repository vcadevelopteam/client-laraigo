import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
import { TemplateIcons } from 'components';
import { formatDate, getOrderSel } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection } from 'store/main/actions';
import { CellProps } from 'react-table';

const OrderTable: FC<{mainResult: any,handleEdit:(row: Dictionary)=>void}> = ({mainResult,handleEdit}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [mainData, setMainData] = useState<any>([]);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'ordernumber',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            extraFunction={() => handleEdit(row)}
                            extraOption={t(langKeys.view)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.ordernumber),
                accessor: 'orderid',
                NoFilter: true,          
            },
            {
                Header: t(langKeys.dateorder),
                accessor: 'createdate',
                NoFilter: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original.createdate;
                    const formatteddate = formatDate(row, {withTime: false})
                    return formatteddate
                }
            },
            {
                Header: t(langKeys.client),
                accessor: 'name',
                NoFilter: true
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone',
                NoFilter: true
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                NoFilter: true
            },
            {
                Header: t(langKeys.totalamount),
                accessor: 'amount',
                NoFilter: true
            },
            {
                Header: t(langKeys.orderstatus),
                accessor: 'orderstatus',
                NoFilter: true
            },
            {
                Header: t(langKeys.deliverytype),
                accessor: 'var_tipoentrega',
                NoFilter: true
            },
            {
                Header: t(langKeys.billingtype),
                accessor: 'var_tipocomprobante',
                NoFilter: true
            },
            {
                Header: t(langKeys.deliverydate),
                accessor: 'var_horaentrega',
                NoFilter: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { var_fechaentrega, var_horaentrega } = props.cell.row.original;
                    return `${var_fechaentrega} ${var_horaentrega}`
                }
            }         
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getOrderSel()));

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setMainData(mainResult.data.map((x:any) => ({
            ...x,
            typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
            statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
        })))
    }, [mainResult.data])

    return (
        <div style={{ width: "100%" }}>
            <TableZyx
                columns={columns}
                titlemodule={""}
                onClickRow={handleEdit}
                data={mainData}
                download={true}
                loading={mainResult.loading}
            />
        </div>)
}

export default OrderTable;