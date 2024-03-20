import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TemplateBreadcrumbs, TitleDetail } from "components";
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { Dictionary } from "@types";
import { useSelector } from "hooks";
import DeliveredDialog from "../dialogs/DeliveredDialog";
import UndeliveredDialog from "../dialogs/UndeliveredDialog";
import { ExtrasMenu } from "../components/components";
import TableZyx from "components/fields/table-simple";
import { showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles(() => ({     
    generalContainer: {       
        width: "100%",
    },
    titlespace: {
        marginBottom: 12,
        marginTop: 4,
    },
}));

interface InventoryMainViewProps {
    fetchData: () => void;
}

const StoreOrdersMainView: FC<InventoryMainViewProps> = ({ fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const main = useSelector((state) => state.main.mainData);    const classes = useStyles();
    const [openModalDelivered, setOpenModalDelivered] = useState(false);
    const [openModalUndelivered, setOpenModalUndelivered] = useState(false);
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);

    const arrayBread = [
        { id: "main-view", name: t(langKeys.delivery) },
        { id: "detail-view", name: t(langKeys.storeorders) },
    ];

    useEffect(() => {
        fetchData()
	},[]);

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            const selectedData = Object.keys(selectedRows).map((key) => main.data[key]);
            setRowWithDataSelected(selectedData);
        }
    }, [selectedRows])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'orderlistid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
            },
            {
                Header: t(langKeys.ordernumber),
                accessor: "ordernumber",
                width: "auto",
            },
            {
                Header: t(langKeys.report_voicecall_ticketnum),
                accessor: "ticketnum",
                width: "auto",
            },
            {
                Header: t(langKeys.clientname),
                accessor: "name",
                width: "auto",
            },
            {
                Header: t(langKeys.phone),
                accessor: "phone",
                width: "auto",
            },
            {
                Header: t(langKeys.ticket_dni),
                accessor: "documentnumber",
                width: "auto",
            },
            {
                Header: t(langKeys.product),
                accessor: "description",
                width: "auto",
            },
            {
                Header: t(langKeys.quantity),
                accessor: "quantity",
                width: "auto",
            },
            {
                Header: t(langKeys.orderstatus),
                accessor: "orderstatus",
                width: "auto",
                Cell: (props: any) => {
                    const { orderstatus } = props.cell.row.original;
                    return (t(`deliverystatus_${orderstatus}`.toLowerCase()) || '');
                }
            },
            {
                Header: t(langKeys.deliverytype),
                accessor: "deliverytype",
                width: "auto",
            },
            {
                Header: t(langKeys.orderdate),
                accessor: "orderdate",
                width: "auto",
            },
            {
                Header: t(langKeys.deliverydate),
                accessor: "scheduledeliverydate",
                width: "auto",
            },
            {
                Header: t(langKeys.deliveryshift),
                accessor: "deliveryshift",
                width: "auto",
            },
        ],
        []
    );

    const handleTipification = (action: string) => {
        const allShipped = rowWithDataSelected.every(row => row.orderstatus === 'shipped');
        const ordernumber = rowWithDataSelected.length > 0 ? rowWithDataSelected[0].ordernumber : null;
        const allAreSameOrder = rowWithDataSelected.every(row => row.ordernumber === ordernumber);

        if(Object.keys(selectedRows).length === 0) {
            dispatch(
                showSnackbar({
                    show: true,
                    severity: "error",
                    message: t(langKeys.mustselectorders),
                })
            );
        } else if(!allShipped) {
            dispatch(
                showSnackbar({
                    show: true,
                    severity: "error",
                    message: t(langKeys.delivererror),
                })
            );
        } else if(!allAreSameOrder) {
            dispatch(
                showSnackbar({
                    show: true,
                    severity: "error",
                    message: t(langKeys.allmustbesameorder),
                })
            );
        } else {
            if(action === 'deliver') setOpenModalDelivered(true)
            else setOpenModalUndelivered(true)
        }
    }

    return (
        <div className={classes.generalContainer}>
            <div className={classes.titlespace}>         
                <div style={{ flexGrow: 1 }}>
                    <TemplateBreadcrumbs breadcrumbs={arrayBread} />
                    <TitleDetail title={t(langKeys.storeorders)} />
                </div>
            </div>
            <TableZyx
                columns={columns}
                data={main.data || []}
                filterGeneral={false}
                loading={main.loading}
                useSelection={true}
                setSelectedRows={setSelectedRows}
                ButtonsElement={() => (
                    <div style={{justifyContent: 'right', display: 'flex'}}>
                        <ExtrasMenu
                            delivered={() => handleTipification('deliver')}
                            undelivered={() => handleTipification('undeliver')}
                        />
                    </div>
                )}
            />
            <DeliveredDialog 
                openModal={openModalDelivered} 
                setOpenModal={setOpenModalDelivered}
                fetchData={fetchData}
                rows={rowWithDataSelected}
            />
            <UndeliveredDialog 
                openModal={openModalUndelivered} 
                setOpenModal={setOpenModalUndelivered}
                fetchData={fetchData}
                rows={rowWithDataSelected}
            />
        </div>
    );
};

export default StoreOrdersMainView;