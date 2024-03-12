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
                accessor: "deliverydate",
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
                            delivered={() => setOpenModalDelivered(true)}
                            undelivered={() => setOpenModalUndelivered(true)}
                        />
                    </div>
                )}
            />
            <DeliveredDialog 
                openModal={openModalDelivered} 
                setOpenModal={setOpenModalDelivered} 
            />
            <UndeliveredDialog 
                openModal={openModalUndelivered} 
                setOpenModal={setOpenModalUndelivered} 
            />
        </div>
    );
};

export default StoreOrdersMainView;
