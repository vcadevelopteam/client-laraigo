import { Button, makeStyles, Tabs } from "@material-ui/core";
import { DialogZyx, AntTab, AntTabPanel } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useSelector } from "hooks";
import { Trans, useTranslation } from "react-i18next";
import TableZyx from "components/fields/table-simple";
import { Dictionary } from "@types";

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(2),
    },
    tabs: {
        color: "#989898",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "inherit",
    },
}));

const SeeTransactionsDialog: React.FC<{
    openModal: any;
    row: any;
    setOpenModal: (dat: any) => void;
    dataDetail: Dictionary;
}> = ({ openModal, setOpenModal, dataDetail, row }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [tabIndex, setTabIndex] = useState(0);
    const data = useSelector((state) => state.main.multiDataAux);
    const [mainData, setMainData] = useState<Dictionary[]>([]);

    useEffect(() => {
        if (openModal) {
			setMainData(dataDetail.map(x=>({...x, originwarehouse: row?.warehousename, 
				destinationwarehouse: row?.transactiontype === "TRANSFERENCIA"? data.data[1].data.filter(y=>x.warehouseto===y.warehouseid)[0].description : ""})))
        }
    }, [openModal]);

    const dispatchcolumns = React.useMemo(
        () => [
            {
                Header: t(langKeys.inventoryconsumptionnumber),
                accessor: "inventoryconsumptionid",
                width: "auto",
            },
            {
                Header: t(langKeys.transactiontype),
                accessor: "transactiontype",
                width: "auto",
            },
            {
                Header: t(langKeys.realdate),
                accessor: "realdate",
                width: "auto",
            },
            {
                Header: t(langKeys.transactiondate),
                accessor: "createdate",
                width: "auto",
            },
            {
                Header: t(langKeys.quantity),
                accessor: "quantity",
                width: "auto",
            },
            {
                Header: t(langKeys.unitcost),
                accessor: "unitcost",
                width: "auto",
            },
            {
                Header: t(langKeys.linecost),
                accessor: "onlinecost",
                width: "auto",
            },
            {
                Header: t(langKeys.createdBy),
                accessor: "createby",
                width: "auto",
            },
            {
                Header: t(langKeys.dispatchedto),
                accessor: "dispatchto",
                width: "auto",
            },
        ],
        []
    );

    const transferscolumns = React.useMemo(
        () => [
            {
                Header: t(langKeys.inventoryconsumptionnumber),
                accessor: "inventoryconsumptionid",
                width: "auto",
            },
            {
                Header: t(langKeys.transactiontype),
                accessor: "transactiontype",
                width: "auto",
            },
            {
                Header: t(langKeys.realdate),
                accessor: "realdate",
                width: "auto",
            },
            {
                Header: t(langKeys.transactiondate),
                accessor: "createdate",
                width: "auto",
            },
            {
                Header: t(langKeys.quantity),
                accessor: "quantity",
                width: "auto",
            },
            {
                Header: t(langKeys.unitcost),
                accessor: "unitcost",
                width: "auto",
            },
            {
                Header: t(langKeys.linecost),
                accessor: "onlinecost",
                width: "auto",
            },
            {
                Header: t(langKeys.originwarehouse),
                accessor: "originwarehouse",
                width: "auto",
            },
            {
                Header: t(langKeys.originshelf),
                accessor: "fromshelf",
                width: "auto",
            },
            {
                Header: t(langKeys.originbatch),
                accessor: "fromlote",
                width: "auto",
            },
            {
                Header: t(langKeys.destinationwarehouse),
                accessor: "destinationwarehouse",
                width: "auto",
            },
            {
                Header: t(langKeys.destinationshelf),
                accessor: "rackcodeto",
                width: "auto",
            },
            {
                Header: t(langKeys.destinationbatch),
                accessor: "lotecodeto",
                width: "auto",
            },
        ],
        []
    );

    return (
        <DialogZyx open={openModal} title={t(langKeys.seetransactions)} maxWidth="xl">
            <Tabs
                value={tabIndex}
                onChange={(_: any, i: any) => setTabIndex(i)}
                className={classes.tabs}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
            >
                <AntTab
                    label={
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Trans i18nKey={langKeys.dispatchesandreturns} />
                        </div>
                    }
                />
                <AntTab
                    label={
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Trans i18nKey={langKeys.transfers} />
                        </div>
                    }
                />
            </Tabs>
            <AntTabPanel index={0} currentIndex={tabIndex}>
                <TableZyx
                    columns={dispatchcolumns}
                    data={row?.transactiontype !== "TRANSFERENCIA" ? mainData : []}
                    download={false}
                    filterGeneral={false}
                    register={false}
                />
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={tabIndex}>
                <TableZyx
                    columns={transferscolumns}
                    data={row?.transactiontype === "TRANSFERENCIA" ? mainData : []}
                    download={false}
                    filterGeneral={false}
                    register={false}
                />
            </AntTabPanel>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={() => {
                        setOpenModal(false);
                    }}
                >
                    {t(langKeys.back)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default SeeTransactionsDialog;
