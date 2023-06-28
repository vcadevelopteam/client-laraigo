/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
import { getOrderSel, updateOrderStatus } from 'common/helpers';
import { Dictionary } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { execute, getCollection, getCollectionAux2 } from 'store/main/actions';
import { makeStyles } from '@material-ui/core/styles';
import { FieldSelect } from "components";
import { Button } from "@material-ui/core";
import { Search as SearchIcon } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { DraggableOrderCardContent, DraggableOrderColumn, DroppableOrderColumnList } from './auxComponents';
import NaturalDragAnimation from 'pages/crm/prueba';

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

const DraggablesCategories: FC<{ column: any, index: number, onClick: (row: Dictionary) => void }> = ({ column,
	index, onClick }) => {

	return (
		<Draggable draggableId={column.column_uuid} index={index + 1} key={column.column_uuid}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					ref={provided.innerRef}
				>
					<DraggableOrderColumn
						key={index + 1}
						snapshot={null}
						provided={provided}
						// titleOnChange={(val) =>{handleEdit(column.column_uuid,val,dataColumn, setDataColumn)}}
						columnid={column.column_uuid}
					// onAddCard={() => history.push(paths.CRM_ADD_LEAD.resolve(column.columnid, column.column_uuid))}
					>
						<Droppable droppableId={column.column_uuid} type="task">
							{(provided, snapshot) => {
								return (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										style={{ overflow: 'hidden', width: '100%' }}
									>
										<DroppableOrderColumnList snapshot={snapshot} itemCount={column.items?.length || 0}>
											{column.cards?.map((item: any, index: any) => {
												return (
													<Draggable
														key={item.orderid}
														draggableId={item.orderid.toString()}
														index={index}
													>
														{(provided, snapshot) => {
															return (
																<NaturalDragAnimation
																	style={provided.draggableProps.style}
																	snapshot={snapshot}
																>
																	{(style: any) => (
																		<div
																			ref={provided.innerRef}
																			{...provided.draggableProps}
																			{...provided.dragHandleProps}
																			style={{ width: '100%', ...style }}
																		>
																			<DraggableOrderCardContent
																				order={item}
																				onClick={onClick}
																				snapshot={snapshot}
																			/>
																		</div>
																	)}
																</NaturalDragAnimation>
															)
														}}
													</Draggable>
												);
											})}
										</DroppableOrderColumnList>
										{provided.placeholder}
									</div>
								);
							}}
						</Droppable>
					</DraggableOrderColumn>
				</div>
			)}
		</Draggable>
	)
}

const OrderKanban: FC<{ mainResult: any, mainAux: any, handleEdit: (row: Dictionary) => void }> = ({ mainResult, mainAux, handleEdit }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const classes = useStyles();
	const [productFilter, setProductFilter] = useState("");
	const [dataColumns, setDataColumns] = useState<any>([
		{ name: "new", cards: [], column_uuid: "8ecfc7b7-6ac8-4d80-ad95-fee0910301fb" },
		{ name: "prepared", cards: [], column_uuid: "a9dbc1e8-f080-47ff-a840-d82be3b8fcd2" },
		{ name: "dispatched", cards: [], column_uuid: "c9b9b27f-5bd5-4e17-88c6-514ed236943f" },
		{ name: "delivered", cards: [], column_uuid: "6ce73933-9e35-433f-8acf-aef53e7a74c3" },
	]);
	const fetchData = () => dispatch(getCollection(getOrderSel(productFilter)));

	// useEffect(() => {
	//     fetchData();
	// }, []);

	useEffect(() => {
		if (!mainResult.mainData.loading) {
			if (!mainResult.mainData.error) {
				setDataColumns([
					{ column_uuid: "8ecfc7b7-6ac8-4d80-ad95-fee0910301fb", name: "new", cards: mainResult.mainData.data.map((x: Dictionary) => ({
						...x,
						column_uuid: "8ecfc7b7-6ac8-4d80-ad95-fee0910301fb"
					})).filter((x: any) => !x.orderstatus || x.orderstatus === "new") },
					{ column_uuid: "a9dbc1e8-f080-47ff-a840-d82be3b8fcd2", name: "prepared", cards: mainResult.mainData.data.map((x: Dictionary) => ({
						...x,
						column_uuid: "a9dbc1e8-f080-47ff-a840-d82be3b8fcd2"
					})).filter((x: any) => x.orderstatus === "prepared") },
					{ column_uuid: "c9b9b27f-5bd5-4e17-88c6-514ed236943f", name: "dispatched", cards: mainResult.mainData.data.map((x: Dictionary) => ({
						...x,
						column_uuid: "c9b9b27f-5bd5-4e17-88c6-514ed236943f"
					})).filter((x: any) => x.orderstatus === "dispatched") },
					{ column_uuid: "6ce73933-9e35-433f-8acf-aef53e7a74c3", name: "delivered", cards: mainResult.mainData.data.map((x: Dictionary) => ({
						...x,
						column_uuid: "6ce73933-9e35-433f-8acf-aef53e7a74c3"
					})).filter((x: any) => x.orderstatus === "delivered") },
				])
			} else {
				setDataColumns([
					{ column_uuid: "8ecfc7b7-6ac8-4d80-ad95-fee0910301fb", name: "new", cards: [] },
					{ column_uuid: "a9dbc1e8-f080-47ff-a840-d82be3b8fcd2", name: "prepared", cards: [] },
					{ column_uuid: "c9b9b27f-5bd5-4e17-88c6-514ed236943f", name: "dispatched", cards: [] },
					{ column_uuid: "6ce73933-9e35-433f-8acf-aef53e7a74c3", name: "delivered", cards: [] },
				])
			}
		}
	}, [mainResult]);

	const onDragEnd = (result: DropResult, columns: any, setDataColumn: any) => {
		if (!result.destination) return;
		const { source, destination, draggableId } = result;
		if (source.droppableId === destination.droppableId) {
			// Lógica para el caso en que el elemento se mantenga en la misma columna
		} else {
			const sourceIndex = columns.findIndex((c: any) => c.name === source.droppableId);
			const destIndex = columns.findIndex((c: any) => c.name === destination.droppableId);
			if (sourceIndex >= 0 && destIndex >= 0) {
				const updatedColumns = [...columns];
				const [movedItem] = updatedColumns[sourceIndex].cards.splice(source.index, 1);
				updatedColumns[destIndex].cards.splice(destination.index, 0, movedItem);
				setDataColumn(updatedColumns);

				// Actualiza el estado del pedido utilizando draggableId
				dispatch(getCollectionAux2(updateOrderStatus({ orderid: draggableId, orderstatus: destination.droppableId })));
				return
			}
		}
	};

	return (
		<div style={{ width: "100%" }}>

			<div style={{ display: "flex", flexDirection: 'column', height: "100%" }}>
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
					<div style={{ flexGrow: 1 }} />
					<Button
						variant="contained"
						color="primary"
						startIcon={<SearchIcon style={{ color: 'white' }} />}
						style={{ backgroundColor: '#55BD84', width: 120 }}
						onClick={fetchData}
						disabled={mainResult.mainData.loading}
					>
						<Trans i18nKey={langKeys.search} />
					</Button>
				</div>
				<div style={{ display: "flex", color: "white", paddingTop: 10, fontSize: "1.6em", fontWeight: "bold" }}>
					<div className={classes.columnStyle}>{t(langKeys.new)}</div>
					<div className={classes.columnStyle}>{t(langKeys.prepared)}</div>
					<div className={classes.columnStyle}>{t(langKeys.dispatched)}</div>
					<div className={classes.columnStyle}>{t(langKeys.delivered)}</div>
				</div>
				<DragDropContext onDragEnd={result => onDragEnd(result, dataColumns, setDataColumns)}>
					<Droppable droppableId="all-columns" direction="horizontal" type="column" >
						{(provided) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								style={{ display: 'flex' }}
							>
								{dataColumns.map((column: any, index: any) =>
									<DraggablesCategories key={column.name} column={column} index={index} onClick={handleEdit} />
								)}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</div>)

}

export default OrderKanban;