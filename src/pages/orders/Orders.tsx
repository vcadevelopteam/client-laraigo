import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { productOrderList, getOrderSel } from 'common/helpers';
import { Dictionary } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory } from 'react-router-dom';
import { getCollectionAux,  resetMainAux, getCollection } from 'store/main/actions';
import paths from 'common/constants/paths';
import { IconButton, Tooltip, Button } from '@material-ui/core';
import OrderTable from './components/OrderTable';
import { ViewColumn as ViewColumnIcon, ViewList as ViewListIcon, Search as SearchIcon } from '@material-ui/icons';
import OrderKanban from './components/OrderKanban';
import { FieldSelect } from "components";
import { makeStyles } from '@material-ui/core/styles';
import { googleCategory } from 'common/constants/googleCategory';
import DetailOrders from './components/DetailOrders';
const dataTypes = [
	{ key: "Recojo en tienda" },
	{ key: "Delivery Inmediato" },
	{ key: "Delivery Programado" },
]
interface RowSelected {
	row: Dictionary | null,
	edit: boolean
}

const useStyles = makeStyles((theme) => ({
	canvasFiltersHeader: {
		margin: theme.spacing(1),
		display: 'flex',
		flexDirection: 'row',
		gap: '1em',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	filterComponent: {
		width: '220px'
	},
	columnStyle: {
		minWidth: 280,
		maxWidth: 280,
		backgroundColor: "#aa53e0",
		padding: "10px 0",
		margin: "0 5px",
		display: "flex",
		overflow: "hidden",
		maxHeight: "100%",
		textAlign: "center",
		flexDirection: "column",
	},
}));

const Orders: FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const params = new URLSearchParams(window.location.search);
	const id = params.get('id');
	const mainResult = useSelector(state => state.main.mainData);
	const mainAux = useSelector(state => state.main.mainAux);
	const [viewSelected, setViewSelected] = useState(id?"DETAIL":"GRID");
	const [viewaux, setviewaux] = useState("GRID");
	const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
	const classes = useStyles();
	const [productFilter, setProductFilter] = useState("");
	const [categoryFilter, setcategoryFilter] = useState("");
	const [type, settype] = useState("");

	const fetchData = () => dispatch(getCollection(getOrderSel(productFilter, categoryFilter, type)));

	useEffect(() => {
		dispatch(resetMainAux());
		dispatch(getCollectionAux(productOrderList()));
	}, []);

	const handleEdit = (row: Dictionary) => {
		setViewSelected("DETAIL");
		setRowSelected({ row, edit: true });
	}

	function redirectFunc(view: string) {
		if (view === "view-0") {
			history.push(paths.CONFIGURATION)
			return;
		}
		fetchData()
		setViewSelected(view === "GRID" ? viewaux : view)
	}

	if (viewSelected === "DETAIL") {
		return (<DetailOrders
			data={rowSelected}
			setViewSelected={redirectFunc}
		/>)
	}
	else return (
		<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
			<div style={{ fontSize: '22px', fontWeight: 'bold' }}>{t(langKeys.orders, { count: 2 })}</div>
			<div style={{ position: 'fixed', right: '20px' }}>
				<Tooltip title={t(langKeys.listview) + ""} arrow placement="top">
					<IconButton
						color="default"
						disabled={viewSelected === 'GRID'}
						onClick={() => {
							setViewSelected('GRID')
							setviewaux("GRID")
						}}
						style={{ padding: '5px' }}
					>
						<ViewListIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title={t(langKeys.kanbanview) + ""} arrow placement="top">
					<IconButton
						color="default"
						disabled={viewSelected === 'KANBAN'}
						onClick={() => {
							setViewSelected('KANBAN');
							setviewaux("KANBAN")
						}}
						style={{ padding: '5px' }}
					>
						<ViewColumnIcon />
					</IconButton>
				</Tooltip>
			</div>
			<div className={classes.canvasFiltersHeader}>
				<FieldSelect
					variant="outlined"
					label={t(langKeys.product)}
					className={classes.filterComponent}
					valueDefault={productFilter}
					onChange={(v) => setProductFilter(v?.product || "")}
					data={mainAux.data}
					loading={mainAux.loading}
					optionDesc="product"
					optionValue="product"
				/>
				<FieldSelect
					variant="outlined"
					label={t(langKeys.category)}
					className={classes.filterComponent}
					data={googleCategory || []}
					valueDefault={categoryFilter}
					onChange={(v) => setcategoryFilter(v?.categoryname || "")}
					optionDesc="categoryname"
					optionValue="categoryname"
				/>
				<FieldSelect
					variant="outlined"
					label={t(langKeys.deliverytype)}
					className={classes.filterComponent}
					data={dataTypes}
					valueDefault={type}
					onChange={(v) => settype(v?.key || "")}
					optionDesc="key"
					optionValue="key"
				/>
				<Button
					variant="contained"
					color="primary"
					startIcon={<SearchIcon style={{ color: 'white' }} />}
					style={{ backgroundColor: '#55BD84', width: 120 }}
					onClick={fetchData}
					disabled={mainResult.loading}
				>
					<Trans i18nKey={langKeys.search} />
				</Button>
			</div>

			{viewSelected === "GRID" &&
				<OrderTable
					mainResult={mainResult}
					handleEdit={handleEdit}
				/>}
			{viewSelected === "KANBAN" &&
				<OrderKanban
					mainAux={mainAux}
					handleEdit={handleEdit}
				/>}
		</div>
	)

}

export default Orders;