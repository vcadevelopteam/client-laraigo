/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TemplateIcons, TitleDetail } from 'components';
import { formatNumber, getOrderLineSel, getOrderSel, insCorp } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory } from 'react-router-dom';
import { getCollection, execute, getMultiCollection } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import paths from 'common/constants/paths';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import { Avatar } from '@material-ui/core';

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

const Orders: FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [mainData, setMainData] = useState<any>([]);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'orderid',
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
                accessor: 'ordernumber',
                NoFilter: true,                
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.orderid
                }
            },
            {
                Header: t(langKeys.date),
                accessor: 'createdate',
                NoFilter: true,
                // Cell: (props: any) => {
                //     const { type } = props.cell.row.original;
                //     return (t(`type_corp_${type}`.toLowerCase()) || "").toUpperCase()
                // }
            },
            {
                Header: t(langKeys.channel),
                accessor: 'channel',
                NoFilter: true
            },
            {
                Header: t(langKeys.ticket_numeroticket),
                accessor: 'ticketnum',
                NoFilter: true,
                // prefixTranslation: 'status_',
                // Cell: (props: any) => {
                //     const { status } = props.cell.row.original;
                //     return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                // }
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
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        setMainData(mainResult.mainData.data.map(x => ({
            ...x,
            typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
            statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
        })))
    }, [mainResult.mainData.data])

    const handleEdit = (row: Dictionary) => {
        dispatch(getMultiCollection([
            getOrderLineSel(row.orderid),
        ]));
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    function redirectFunc(view: string) {
        if (view === "view-0") {
            history.push(paths.CONFIGURATION)
            return;
        }
        setViewSelected(view)
    }

    if (viewSelected === "view-1") {
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
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailOrders
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

interface DetailOrdersProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
}

const DetailOrders: React.FC<DetailOrdersProps> = ({ data: { row, edit }, multiData, fetchData, setViewSelected }) => {
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
                    console.log(row)
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
                        breadcrumbs={[{ id: "view-1", name: t(langKeys.orders) }, { id: "view-2", name: t(langKeys.ordersdetail) }]}
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
                        onClick={() => setViewSelected("view-1")}
                    >{t(langKeys.back)}</Button>
                </div>
            </div>
            
            <div style={{width: "100%", display: "flex", justifyContent: "space-between", padding: 10}}>
                <div style={{fontSize: "1.2em"}}>{t(langKeys.client)}: {row?.name}</div>
                <div style={{fontSize: "1.2em"}}>{t(langKeys.phone)}: {row?.phone}</div>
                <div style={{fontSize: "1.2em"}}>{t(langKeys.channel)}: {row?.channel}</div>
                <div style={{fontSize: "1.2em"}}>{t(langKeys.ticket_numeroticket)}: {row?.ticketnum}</div>
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
                <div style={{fontSize: "1.2em", fontWeight: "bold"}}>{t(langKeys.total)}: {row?.currency === "PEN"? "S/.": "$"}{formatNumber(dataorders.reduce((acc,x)=>acc + x.amount,0))}</div>
            </div>
        </div>
    );
}

export default Orders;