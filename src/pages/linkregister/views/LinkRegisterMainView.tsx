import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TemplateBreadcrumbs, TemplateIcons } from "components";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { useDispatch } from "react-redux";
import { execute } from "store/main/actions";
import TablePaginated from "components/fields/table-paginated";
import {
	showSnackbar,
	showBackdrop,
	manageConfirmation,
} from "store/popus/actions";
import { partnerIns } from "common/helpers";
import { useSelector } from "hooks";
import { CellProps } from "react-table";
import { Button, makeStyles } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";

const useStyles = makeStyles(() => ({
	main: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		flex: 1,
	}
}));

interface RowSelected {
	row: Dictionary | null;
	edit: boolean;
}
interface LinkRegisterMainViewProps {
	setViewSelected: (view: string) => void;
	setRowSelected: (rowdata: RowSelected) => void;
	fetchData: () => void;
}

const LinkRegisterMainView: FC<LinkRegisterMainViewProps> = ({
	setViewSelected,
	setRowSelected,
	//fetchData,
}) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const classes = useStyles();
	const executeResult = useSelector((state) => state.main.execute);
	const [waitSave, setWaitSave] = useState(false);
	const main = useSelector((state) => state.main.mainData);

	const handleRegister = () => {
		setViewSelected("detail-view");
		setRowSelected({ row: null, edit: false });
	};

	const handleEdit = (row: Dictionary) => {
		setViewSelected("detail-view");
		setRowSelected({ row, edit: true });
	};

	const handleDelete = (row: Dictionary) => {
		const callback = () => {
			dispatch(
				execute(partnerIns({ ...row, operation: "DELETE", status: "ELIMINADO", id: row.partnerid, type: "NINGUNO", signaturedate: new Date(row.signaturedate) }))
			);
			dispatch(showBackdrop(true));
			setWaitSave(true);
		};

		dispatch(
			manageConfirmation({
				visible: true,
				question: t(langKeys.confirmation_delete),
				callback,
			})
		);
	};

	useEffect(() => {
		if (waitSave) {
			if (!executeResult.loading && !executeResult.error) {
				dispatch(
					showSnackbar({
						show: true,
						severity: "success",
						message: t(langKeys.successful_delete),
					})
				);
				//fetchData();
				dispatch(showBackdrop(false));
				setWaitSave(false);
			} else if (executeResult.error) {
				const errormessage = t(executeResult.code || "error_unexpected_error", {
					module: t(langKeys.domain).toLocaleLowerCase(),
				});
				dispatch(
					showSnackbar({ show: true, severity: "error", message: errormessage })
				);
				dispatch(showBackdrop(false));
				setWaitSave(false);
			}
		}
	}, [executeResult, waitSave]);

	const columns = React.useMemo(
		() => [
			{
				accessor: "linkid",
				NoFilter: true,
				isComponent: true,
				minWidth: 60,
				width: "1%",
				Cell: (props: CellProps<Dictionary>) => {
					const row = props.cell.row.original || {};
					return (
						<TemplateIcons
							deleteFunction={() => handleDelete(row)}
							editFunction={() => handleEdit(row)}
						/>
					);
				},
			},
			{
				Header: t(langKeys.name),
				accessor: "name",
				width: "auto",
			},
			{
				Header: t(langKeys.messagetemplate_url),
				accessor: "url",
				width: "auto",
			},
			{
				Header: t(langKeys.startdate),
				accessor: "startdate",
				width: "auto",
			},
			{
				Header: t(langKeys.enddate),
				accessor: "enddate",
				width: "auto",
			},
			{
				Header: t(langKeys.creationDate),
				accessor: "creationDate",
				width: "auto",
			},
			{
				Header: t(langKeys.createdBy),
				accessor: "createdBy",
				width: "auto",
			},
			{
				Header: t(langKeys.modificationDate),
				accessor: "modificationDate",
				width: "auto",
			},
			{
				Header: t(langKeys.modifiedBy),
				accessor: "modifiedBy",
				width: "auto",
			},
			{
				Header: t(langKeys.validity),
				accessor: "validity",
				width: "auto",
			},
		],
		[]
	);

	const arrayBread = [
        { id: "crm", name: t(langKeys.app_crm) },
        { id: "linkregister", name: t(langKeys.linkregister) },
    ];

	return (
		<div className={classes.main}>
			<div style={{marginBottom: 5}}>
				<TemplateBreadcrumbs breadcrumbs={arrayBread}/>
			</div>
			<TablePaginated
				ButtonsElement={
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
							<Button
								color="primary"
								startIcon={<Delete style={{ color: "white" }} />}
								variant="contained"
							>
								{t(langKeys.delete)}
							</Button>
						</div>
					</div>
				}
				columns={columns}
				data={[]}
				download={true}
				filterGeneral={true}
				handleRegister={handleRegister}
				onClickRow={handleEdit}
				titlemodule={t(langKeys.linkregister)}
				register={true}
				useSelection={true}
			/>
		</div>
	);
};

export default LinkRegisterMainView;