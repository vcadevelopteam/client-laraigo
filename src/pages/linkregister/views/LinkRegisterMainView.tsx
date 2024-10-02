import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TemplateBreadcrumbs, TemplateIcons } from "components";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { useDispatch } from "react-redux";
import { execute } from "store/main/actions";
import {
	showSnackbar,
	showBackdrop,
	manageConfirmation,
} from "store/popus/actions";
import { exportExcel, partnerIns, registeredLinksIns } from "common/helpers";
import { useSelector } from "hooks";
import { CellProps } from "react-table";
import { Button, makeStyles } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import TableZyx from "components/fields/table-paginated";

const useStyles = makeStyles(() => ({
	main: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		flex: 1,
	}
}));
const selectionKey = 'linkregisterid';
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
	fetchData,
}) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const classes = useStyles();
	const executeResult = useSelector((state) => state.main.execute);
	const [waitSave, setWaitSave] = useState(false);
	const main = useSelector((state) => state.main.mainData);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);

	useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected(p => Object.keys(selectedRows).map(x => main?.data.find(y => y.linkregisterid === parseInt(x)) || p.find((y) => y.linkregisterid === parseInt(x)) || {}))
        }
    }, [selectedRows])

	const handleRegister = () => {
		setViewSelected("detail-view");
		setRowSelected({ row: null, edit: false });
	};

	const handleEdit = (row: Dictionary) => {
		setViewSelected("detail-view");
		setRowSelected({ row, edit: true });
	};

	const handleDeleteSelection = async (dataSelected: Dictionary[]) => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            dataSelected.map(async (row) => {          
                dispatch(execute(registeredLinksIns({
					...row,
					linkregisterid: row.linkregisterid,
					operation: "DELETE",
					status: "ELIMINADO",
				})));
            });
            setWaitSave(true);
        }
        dispatch(
            manageConfirmation({
              visible: true,
              question: t(langKeys.confirmation_delete_all),
              callback,
            })
        );
    };

	useEffect(() => {
		if (waitSave) {
			if (!executeResult.loading && !executeResult.error) {
				dispatch(showSnackbar({show: true, severity: "success", message: t(langKeys.successful_delete)}));
				fetchData();
				dispatch(showBackdrop(false));
				setWaitSave(false);
			} else if (executeResult.error) {
				const errormessage = t(executeResult.code || "error_unexpected_error", {module: t(langKeys.domain).toLocaleLowerCase()});
				dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
				dispatch(showBackdrop(false));
				setWaitSave(false);
			}
		}
	}, [executeResult, waitSave]);

	const columns = React.useMemo(
		() => [
			{
				Header: t(langKeys.name),
				accessor: "description",
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
				accessor: "createdate",
				width: "auto",
				Cell: (props: any) => {
                    const { createdate } = props.cell.row.original;
					const dateOnly = createdate.split(' ')[0];
                    return (dateOnly || '');
                },
			},
			{
				Header: t(langKeys.createdBy),
				accessor: "createby",
				width: "auto",
			},
			{
				Header: t(langKeys.modificationDate),
				accessor: "changedate",
				width: "auto",
				Cell: (props: any) => {
                    const { changedate } = props.cell.row.original;
					const dateOnly = changedate.split(' ')[0];
                    return (dateOnly || '');
                },
			},
			{
				Header: t(langKeys.modifiedBy),
				accessor: "changeby",
				width: "auto",
			},
		],
		[]
	);

	const arrayBread = [
        { id: "crm", name: t(langKeys.app_crm) },
        { id: "linkregister", name: t(langKeys.linkregister) },
    ];

	const handleDownload = () => {
        exportExcel('Enlaces Registrados', main.data, columns)
    };

	return (
		<div className={classes.main}>
			<div style={{marginBottom: 5}}>
				<TemplateBreadcrumbs breadcrumbs={arrayBread}/>
			</div>
			<TableZyx
				ButtonsElement={
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
							<Button
								color="primary"
                                disabled={main.loading || Object.keys(selectedRows).length <= 0}
								onClick={() => handleDeleteSelection(rowWithDataSelected)}
								startIcon={<Delete style={{ color: "white" }} />}
								variant="contained"
							>
								{t(langKeys.delete)}
							</Button>
						</div>
					</div>
				}
				useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
				columns={columns}
				data={main.data}
				loading={main.loading}
				download={true}
				exportPersonalized={handleDownload}
				filterGeneral={true}
				handleRegister={handleRegister}
				onClickRow={handleEdit}
				titlemodule={t(langKeys.linkregister)}
				register={true}
			/>
		</div>
	);
};

export default LinkRegisterMainView;