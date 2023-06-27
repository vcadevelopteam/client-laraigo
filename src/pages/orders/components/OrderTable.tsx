/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TemplateIcons, TitleDetail } from 'components';
import { formatDate, formatNumber, getOrderLineSel, getOrderSel } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory } from 'react-router-dom';
import { getCollection, getMultiCollection } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import paths from 'common/constants/paths';
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
                Cell: (props: any) => {
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
                Header: t(langKeys.date),
                accessor: 'createdate',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original.createdate;
                    let formatteddate = formatDate(row, {withTime: false})
                    return formatteddate
                }
            },
            {
                Header: t(langKeys.channel),
                accessor: 'channel',
                NoFilter: true
            },
            {
                Header: `N° ${t(langKeys.ticket_numeroticket)}`,
                accessor: 'ticketnum',
                NoFilter: true,
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
                Header: t(langKeys.total),
                accessor: 'amount',
                NoFilter: true
            },
            {
                Header: t(langKeys.orderstatus),
                accessor: 'status',
                NoFilter: true
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getOrderSel()));

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setMainData(mainResult.mainData.data.map((x:any) => ({
            ...x,
            typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
            statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
        })))
    }, [mainResult.mainData.data])

    return (
        <div style={{ width: "100%" }}>
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.orders, { count: 2 })}
                onClickRow={handleEdit}
                data={mainData}
                download={true}
                loading={mainResult.mainData.loading}
            />
        </div>)

}

export default OrderTable;