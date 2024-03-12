import React, { useEffect } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { TemplateBreadcrumbs, TitleDetail } from 'components';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import NewAttentionOrdersTabDetail from './detailTabs/NewAttentionOrdersTabDetail';
import { useDispatch } from 'react-redux';
import { getCollectionAux } from 'store/main/actions';
import { orderLineSel } from 'common/helpers';

const useStyles = makeStyles(() => ({   
    formcontainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    titleandbuttons: {
        display: "flex",
        justifyContent: "space-between",
    },
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    },
}));

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    setRowSelected: (rowdata: RowSelected) => void;
}

const AttentionOrdersDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, setRowSelected }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles();

    const arrayBread = [
        { id: "main-view", name: t(langKeys.attentionorders) },
        { id: "detail-view", name: t(langKeys.orderdetail) },
    ];

    const fetchOrderLine = (orderid: number) => dispatch(getCollectionAux(orderLineSel(orderid)));

    useEffect(() => {
        if(row) fetchOrderLine(row.orderid)
    },[row])

    return (
        <div className={classes.formcontainer}>
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
                            setViewSelected("main-view")
                            setRowSelected({ row: null, edit: false });
                        }}
                    >
                        {t(langKeys.back)}
                    </Button>
                    <Button                            
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
            <NewAttentionOrdersTabDetail row={row}/>
        </div>
    );
}

export default AttentionOrdersDetail;