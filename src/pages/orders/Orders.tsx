/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getOrderLineSel, productOrderList } from 'common/helpers';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory } from 'react-router-dom';
import { getCollectionAux, getMultiCollection, resetMainAux } from 'store/main/actions';
import paths from 'common/constants/paths';
import { IconButton, Tooltip } from '@material-ui/core';
import OrderTable from './components/OrderTable';
import { ViewColumn as ViewColumnIcon, ViewList as ViewListIcon } from '@material-ui/icons';
import DetailOrders from './components/DetailOrders';
import OrderKanban from './components/OrderKanban';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

const Orders: FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const mainAux = useSelector(state => state.main.mainAux);
    const [viewSelected, setViewSelected] = useState("GRID");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });

    useEffect(() => {
        dispatch(resetMainAux());
        dispatch(getCollectionAux(productOrderList()));
    }, []);

    const handleEdit = (row: Dictionary) => {
        dispatch(getMultiCollection([
            getOrderLineSel(row.orderid),
        ]));
        setViewSelected("DETAIL");
        setRowSelected({ row, edit: true });
    }

    function redirectFunc(view: string) {
        if (view === "view-0") {
            history.push(paths.CONFIGURATION)
            return;
        }
        setViewSelected(view)
    }
    console.log(mainAux)

    if(viewSelected === "DETAIL"){        
        return (<DetailOrders
            data={rowSelected}
            setViewSelected={redirectFunc}
            multiData={mainResult.multiData.data}
        />)
    }
    else return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
      <div style={{ marginBottom: '34px' }}>
        <div style={{ position: 'fixed', right: '20px' }}>
          <Tooltip title={t(langKeys.listview) + ""} arrow placement="top">
            <IconButton
              color="default"
              disabled={viewSelected === 'GRID'}
              onClick={() => setViewSelected('GRID')}
              style={{ padding: '5px' }}
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t(langKeys.kanbanview) + ""} arrow placement="top">
            <IconButton
              color="default"
              disabled={viewSelected === 'KANBAN'}
              onClick={() => setViewSelected('KANBAN')}
              style={{ padding: '5px' }}
            >
              <ViewColumnIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {viewSelected === "GRID" &&
        <OrderTable
            mainResult={mainResult}
            handleEdit={handleEdit}
        />}
      {viewSelected === "KANBAN" &&
        <OrderKanban
            mainResult={mainResult}
            mainAux={mainAux}
            handleEdit={handleEdit}
        />}
    </div>
    )

}

export default Orders;