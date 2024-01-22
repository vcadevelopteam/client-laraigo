import { FC, useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from 'common/helpers';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { execute } from 'store/main/actions';
import { makeStyles } from '@material-ui/core/styles';
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
						columnid={String(column.column_uuid)}
						total_revenue={column.total_revenue!}
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
										<DroppableOrderColumnList snapshot={snapshot} itemCount={column.cards?.length || 0}>
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

const OrderKanban: FC<{ mainAux: any, handleEdit: (row: Dictionary) => void }> = ({ mainAux, handleEdit }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const classes = useStyles();
	const mainResult = useSelector(state => state.main.mainData);
	const [dataColumns, setDataColumns] = useState<any>([
		{ name: "new", cards: [], column_uuid: "8ecfc7b7-6ac8-4d80-ad95-fee0910301fb" },
		{ name: "prepared", cards: [], column_uuid: "a9dbc1e8-f080-47ff-a840-d82be3b8fcd2" },
		{ name: "dispatched", cards: [], column_uuid: "c9b9b27f-5bd5-4e17-88c6-514ed236943f" },
		{ name: "delivered", cards: [], column_uuid: "6ce73933-9e35-433f-8acf-aef53e7a74c3" },
	]);


	useEffect(() => {
		if (!mainResult.loading && !mainResult.error) {
			const data = [...mainResult.data].filter(item => {
				if (item.orderstatus !== "delivered") {
					return true;
				}
				const now = new Date();

				// Crear una fecha que represente hace 24 horas
				const twentyFourHoursAgo = new Date(now);
				twentyFourHoursAgo.setHours(now.getHours() - 24);

				const changedate = new Date(item.changedate);
				return changedate > twentyFourHoursAgo && changedate <= now;
			});
			setDataColumns([
				{
					column_uuid: "8ecfc7b7-6ac8-4d80-ad95-fee0910301fb", name: "new", cards: data.filter((x: any) => !x.orderstatus || x.orderstatus === "new"),
					total_revenue: data.filter((x) => !x.orderstatus || x.orderstatus === "new").reduce((acc,y)=>acc+y.amount,0)
				},
				{
					column_uuid: "a9dbc1e8-f080-47ff-a840-d82be3b8fcd2", name: "prepared", cards: data.filter((x: any) => x.orderstatus === "prepared"),
					total_revenue: data.filter((x) => x.orderstatus === "prepared").reduce((acc,y)=>acc+y.amount,0)
				},
				{
					column_uuid: "c9b9b27f-5bd5-4e17-88c6-514ed236943f", name: "dispatched", cards: data.filter((x: any) => x.orderstatus === "dispatched"),
					total_revenue: data.filter((x) => x.orderstatus === "dispatched").reduce((acc,y)=>acc+y.amount,0)
				},
				{
					column_uuid: "6ce73933-9e35-433f-8acf-aef53e7a74c3", name: "delivered", cards: data.filter((x: any) => x.orderstatus === "delivered"),
					total_revenue: data.filter((x) => x.orderstatus === "delivered").reduce((acc,y)=>acc+y.amount,0)
				},
			])
		}
	}, [mainResult]);


	const onDragEnd = async (result: DropResult, columns: any, setDataColumn: any) => {
		if (!result.destination) return;
		const { source, destination } = result;
		if (source.droppableId === destination.droppableId) {
			// Lógica para el caso en que el elemento se mantenga en la misma columna
		} else {
			const sourceIndex = columns.findIndex((c: any) => c.column_uuid === source.droppableId);
			const destIndex = columns.findIndex((c: any) => c.column_uuid === destination.droppableId);
			if (sourceIndex >= 0 && destIndex >= 0) {
				const updatedColumns = [...columns];
				const [movedItem] = updatedColumns[sourceIndex].cards.splice(source.index, 1);
				updatedColumns[sourceIndex].total_revenue -= movedItem.amount
				updatedColumns[destIndex].total_revenue += movedItem.amount
				updatedColumns[destIndex].cards.splice(destination.index, 0, movedItem);

				setDataColumn(updatedColumns);
				// Actualiza el estado del pedido utilizando draggableId
				dispatch(execute(updateOrderStatus({ orderid: movedItem.orderid, orderstatus: updatedColumns[destIndex].name })));
				return
			}
		}
	};

	return (
		<div style={{ width: "100%" }}>

			<div style={{ display: "flex", flexDirection: 'column', height: "100%" }}>
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
									<DraggablesCategories column={column} index={index} onClick={handleEdit} />
								)}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</div>)

}

export default OrderKanban;