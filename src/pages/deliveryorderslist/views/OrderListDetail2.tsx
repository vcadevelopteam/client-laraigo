import React, { ChangeEvent, useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel } from "components";
import { Dictionary } from "@types";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { getCollectionAux2 } from "store/main/actions";
import { Tabs } from "@material-ui/core";
import InformationTabDetail from "./detailTabs/InformationTabDetail";
import OrderStatusTabDetail from "./detailTabs/OrderStatusTabDetail";
import { orderLineSel } from "common/helpers";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData?: (flag: boolean) => void;
    setRowSelected: (rowdata: RowSelected) => void;
    fetchMulti: (id: number) => void;
}

const useStyles = makeStyles(() => ({
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    },
    tabs: {
        color: "#989898",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "inherit",
    },
    formcontainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    titleandbuttons: {
        display: "flex",
        justifyContent: "space-between",
    },
}));

const OrderListDetail2: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData, setRowSelected, fetchMulti }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [tabIndex, setTabIndex] = useState(0);

    const arrayBread = [
        { id: "main-view", name: t(langKeys.orderlist) },
        { id: "detail-view", name: t(langKeys.orderdetail) },
    ];

    const fetchOrderLine = (orderid: number) => dispatch(getCollectionAux2(orderLineSel(orderid)));

    useEffect(() => {
        if(row) {
            fetchOrderLine(row.orderid)
            fetchMulti(row.orderid)
        }
    },[row])

	const handleChangeTab = (event: ChangeEvent<NonNullable<unknown>>, newIndex: number) => {
        setTabIndex(newIndex);
    };

    return (
        <>
            <form className={classes.formcontainer}>
                <div className={classes.titleandbuttons}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                        <div>
                            <TitleDetail title={`${t(langKeys.ordernum)}: ${row?.ordernumber}`} />
                        </div>
                    </div>
                    <div className={classes.button}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => {
                                setViewSelected("main-view");
                                setRowSelected({ row: null, edit: false });
                            }}
                        >
                            {t(langKeys.back)}
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <Tabs
                    value={tabIndex}
                    onChange={handleChangeTab}
                    className={classes.tabs}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <AntTab
                        label={
                            <div>
                                <Trans i18nKey={langKeys.information} />
                            </div>
                        }
                    />
                    <AntTab
                        label={
                            <div>
                                <Trans i18nKey={langKeys.orderstatus} />
                            </div>
                        }
                    />
                </Tabs>
                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <InformationTabDetail row={row} />
                </AntTabPanel>
                <AntTabPanel index={1} currentIndex={tabIndex}>
                    <OrderStatusTabDetail row={row} />
                </AntTabPanel>
            </form>
        </>
    );
};

export default OrderListDetail2;
