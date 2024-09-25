import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons } from 'components';
import { documentLibraryIns, documentLibraryInsArray, exportExcel, templateMaker, uploadExcel } from 'common/helpers';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import TableZyx from 'components/fields/table-simple';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ModalDocPreview from '../modal/ModalDocPreview';
import { Button, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import ListAltIcon from "@material-ui/icons/ListAlt";

interface RowSelected {
	row: Dictionary | null;
	edit: boolean;
}

interface DocumentLibraryData {
	title: string;
	description: string;
	groups: string;
	linkfile: string;
	category: string;
}

interface DocumentLibraryMainViewProps {
	setViewSelected: (a: string) => void;
	setRowSelected: (a: RowSelected) => void;
	fetchData: () => void;
}

const selectionKey = 'documentlibraryid';
const IDDOCUMENTLIBRARY = "IDDOCUMENTLIBRARY";

const DocumentLibraryMainView: FC<DocumentLibraryMainViewProps> = ({ setViewSelected, setRowSelected, fetchData }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const mainResult = useSelector(state => state.main.mainData);
	const multiResult = useSelector(state => state.main.multiData);
	const executeResult = useSelector(state => state.main.execute);
	const [waitSave, setWaitSave] = useState(false);
	const [openModalPreview, setOpenModalPreview] = useState<any>(null);
	const user = useSelector(state => state.login.validateToken.user);
	const [selectedRows, setSelectedRows] = useState<any>({});
	const [wrongImportData, setWrongImportData] = useState<any>([]);
    const [cleanImport, setCleanImport] = useState(false);
	const [waitUpload, setWaitUpload] = useState(false);
	const [waitDelete, setWaitDelete] = useState(false);
    const memoryTable = useSelector(state => state.main.memoryTable);
	const [globalFilter, setGlobalFilter] = useState("");
	const [documentLibraryData, setDocumentLibraryData] = useState<any>([]);
	const superadmin = (user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(v));
	const importRes = useSelector((state) => state.main.execute);

	const columns = React.useMemo(
		() => [
			{
				accessor: 'documentlibraryid',
				NoFilter: true,
				isComponent: true,
				minWidth: 60,
				width: '1%',
				Cell: (props: any) => {
					const row = props.cell.row.original;
					return (
						<TemplateIcons
							deleteFunction={() => handleDelete(row)}
						/>
					)
				}
			},
			{
				Header: t(langKeys.title),
				accessor: 'title',
				NoFilter: true,
			},
			{
				Header: t(langKeys.description),
				accessor: 'description',
				NoFilter: true,
			},
			{
				Header: t(langKeys.category),
				accessor: 'category',
				NoFilter: true,
			},
			{
				Header: t(langKeys.group_plural),
				accessor: 'groups',
				NoFilter: true,
			},
			{
				Header: t(langKeys.registrationdate),
				accessor: 'createdate',
				NoFilter: true,
				minWidth: 250,
			},
			{
				Header: t(langKeys.change_date),
				accessor: 'changedate',
				NoFilter: true,
				minWidth: 250,
			},
			{
				Header: t(langKeys.uploadedby),
				accessor: 'createby',
				NoFilter: true,
				minWidth: 350,
			},
			{
				Header: t(langKeys.change_by),
				accessor: 'changeby',
				NoFilter: true,
				minWidth: 350,
			},
			{
				Header: "",
				accessor: 'link',
				NoFilter: true,
				isComponent: true,
				minWidth: 60,
				width: '1%',
				Cell: (props: any) => {
					const row = props.cell.row.original;
					return (
						<div style={{ whiteSpace: 'nowrap', display: 'flex' }}>

							<IconButton
								aria-label="more"
								aria-controls="long-menu"
								aria-haspopup="true"
								size="small"
								onClick={(e) => {
									e.stopPropagation();
									if (row?.link?.endsWith("pdf")) {
										setOpenModalPreview({
											link: row?.link || "",
											title: row?.title || "",
										})
									} else {
										window.open(row?.link, "_blank");
									}
								}}
								style={{ display: 'block' }}
							>
								<VisibilityIcon style={{ color: '#B6B4BA' }} />
							</IconButton>

						</div>)


				}
			},
		],
		[]
	);

	useEffect(() => {
		if (waitSave) {
			if (!executeResult.loading && !executeResult.error) {
				dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
				fetchData();
				dispatch(showBackdrop(false));
				setWaitSave(false);
			} else if (executeResult.error) {
				const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
				dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
				dispatch(showBackdrop(false));
				setWaitSave(false);
			}
		}
	}, [executeResult, waitSave])

	useEffect(() => {
		if (!mainResult.loading && !mainResult.error) {
			setDocumentLibraryData(mainResult.data.map(x=>({...x, changedate: x.changedate.slice(0, -2), createdate: x.createdate.slice(0, -2) })))
		}
	}, [mainResult])

	const handleRegister = () => {
		setViewSelected("view-2");
		setRowSelected({ row: null, edit: true });
	}

	const handleEdit = (row: Dictionary) => {
		setViewSelected("view-2");
		setRowSelected({ row, edit: true });
	}

	const handleDelete = (row: Dictionary) => {
		const callback = () => {
			dispatch(execute(documentLibraryIns({ ...row, id: row?.documentlibraryid || "", operation: 'DELETE', status: 'ELIMINADO' })));
			dispatch(showBackdrop(true));
			setWaitSave(true);
		}

		dispatch(manageConfirmation({
			visible: true,
			question: t(langKeys.confirmation_delete),
			callback
		}))
	}

	const handleTemplate = () => {
		const data = [
			{ "# Obligatorio |Titulo del registro del archivo.": "# Obligatorio |Titulo del registro del archivo." },
			{ "# Opcional |Descripcion del registro del archivo.": "# Opcional |Descripcion del registro del archivo." },
			{ "# Obligatorio |Grupos que tendran permiso al acceso del archivo. Se puede indicar varios grupos colocando ',' entre cada uno de ellos. Ejemplo: GR01,GR02": "# Obligatorio |Grupos que tendran permiso al acceso del archivo. Se puede indicar varios grupos colocando ',' entre cada uno de ellos. Ejemplo: GR01,GR02" },
			{ "# Obligatorio |Link donde se encuentra almacenado el archivo que se requiere subir. Ejemplo: https://laraigo.com/wp-content/uploads/2023/11/Laraigo.svg": "# Obligatorio |Link donde se encuentra almacenado el archivo que se requiere subir. Ejemplo: https://laraigo.com/wp-content/uploads/2023/11/Laraigo.svg" },
			{ "# Obligatorio |Categoría del registro del archivo. Puedes asignarle cualquier categoría. Ejemplo: Saludo": "# Obligatorio |Categoría del registro del archivo. Puedes asignarle cualquier categoría. Ejemplo: Saludo" },
			{ "# Opcional | Si el documento sera favorito o no, Valores: TRUE o FALSE": "# Opcional | Si el documento sera favorito o no, Valores: TRUE o FALSE" },
		];
		const header = [
			"title",
			"description",
			"groups",
			"linkfile",
			"category",
			'favorite'
		];
		exportExcel(`${t(langKeys.template)} ${t(langKeys.import)}`, templateMaker(data, header));
	};
	useEffect(() => {
		if (waitUpload) {
			if (!importRes.loading && !importRes.error) {
				setCleanImport(!cleanImport)
				if (importRes?.data?.[0]?.p_messagetype === "ERROR") {
					dispatch(
						showSnackbar({
							show: true,
							severity: "error",
							message: t(langKeys.error_already_exists_record, { module: t(langKeys.documentlibrary) }),
						})
					);

				} else {
					if(wrongImportData.length){
						dispatch(
							showSnackbar({ show: true, severity: "error", message: t(langKeys.errorimportdocuments, {docs: wrongImportData.join(", ")}) })
						);
						setWrongImportData([])

					}else{
						dispatch(
							showSnackbar({
								show: true,
								severity: "success",
								message: t(langKeys.successful_import),
							})
						);
					}
				}
				dispatch(showBackdrop(false));
				setWaitUpload(false);
				fetchData();
			} else if (importRes.error) {
				dispatch(
					showSnackbar({
						show: true,
						severity: "error",
						message: t(importRes.code || "error_unexpected_error"),
					})
				);
				dispatch(showBackdrop(false));
				setWaitUpload(false);
				setCleanImport(!cleanImport)
			}
		}
	}, [importRes, waitUpload]);

	useEffect(() => {
		if (waitDelete) {
			if (!importRes.loading && !importRes.error) {
				if (importRes?.data?.[0]?.p_messagetype === "ERROR") {
					dispatch(
						showSnackbar({
							show: true,
							severity: "error",
							message: t(langKeys.error_already_exists_record, { module: t(langKeys.documentlibrary) }),
						})
					);

				} else {
					dispatch(
						showSnackbar({
							show: true,
							severity: "success",
							message: t(langKeys.successful_delete),
						})
					);
				}
				dispatch(showBackdrop(false));
				setWaitDelete(false);
				fetchData();
			} else if (importRes.error) {
				dispatch(
					showSnackbar({
						show: true,
						severity: "error",
						message: t(importRes.code || "error_unexpected_error"),
					})
				);
				dispatch(showBackdrop(false));
				setWaitDelete(false);
			}
		}
	}, [importRes, waitDelete]);

	const isValidData = (element: DocumentLibraryData) => {
		const groupList = (multiResult?.data?.[0]?.data || []).map(x=>x.domainvalue)
		const groups = element.groups.split(",") || []
		return (
			typeof element.title === 'string' && element.title.length > 0 &&
			(!element.description || (typeof element.description === 'string' && element.description.length <= 256)) &&
			typeof element.groups === 'string' && element.groups.length > 0 && groups.every(e => groupList.includes(e)) &&
			typeof element.linkfile === 'string' && element.linkfile.length > 0 &&
			typeof element.category === 'string' && element.category.length > 0
		);
	};

	const handleUpload = async (files: any) => {
		const file = files?.item(0);
		if (file) {
			const datainit: DocumentLibraryData[] = (await uploadExcel(file, undefined)) as DocumentLibraryData[];
            const data = datainit.map(item => ({
                ...item,
                groups: String(item.groups).replace(/\s+/g, '').replace(/;/g, ','),
            }));
			
			if (data.length > 0) {
				const badData = data.filter(element => !isValidData(element)).map(element => element.title);
				if (badData.length<data.length) {
					setWrongImportData(badData)
					const dataToSend = data.filter(element => isValidData(element)).map((x: any) => ({
						...x,
						id: 0,
						link: x.linkfile,
						favorite: x?.favorite?(String(x.favorite).toLocaleLowerCase() === "true"):false,
						operation: "INSERT",
						type: "NINGUNO",
						status: "ACTIVO",
					}));
					dispatch(showBackdrop(true));
					dispatch(execute(documentLibraryInsArray(JSON.stringify(dataToSend))));
					setWaitUpload(true);
					
				} else {
					dispatch(
						showSnackbar({ show: true, severity: "error", message: t(langKeys.errorimportdocuments, {docs: badData.join(", ")}) })
					);
					setCleanImport(!cleanImport)
				}
			}
		}
	};
	const deletefiles = async () => {
		const selectedRows2 = mainResult.data.filter(x => Object.keys(selectedRows).includes(String(x.documentlibraryid)))
		const dataToSend = selectedRows2.map((x: any) => ({
			...x,
			id: x.documentlibraryid,
			operation: "DELETE",
			status: "ELIMINADO",
		}));
		dispatch(showBackdrop(true));
		dispatch(execute(documentLibraryInsArray(JSON.stringify(dataToSend))));
		setWaitDelete(true);
	};

	return (
		<div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
			<TableZyx
				columns={columns}
				titlemodule={t(langKeys.documentlibrary)}
				helperText={t(langKeys.documentlibraryhelperText)}
				data={documentLibraryData}
				download={true}
				useSelection={true}
				selectionKey={selectionKey}
				onClickRow={handleEdit}
				setSelectedRows={setSelectedRows}
				loading={mainResult.loading}
				register={superadmin}
				handleRegister={handleRegister}
				importCSV={handleUpload}
				defaultGlobalFilter={globalFilter}
				setOutsideGeneralFilter={setGlobalFilter}
				cleanImport={cleanImport}
				pageSizeDefault={IDDOCUMENTLIBRARY === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
				initialPageIndex={IDDOCUMENTLIBRARY === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
				initialStateFilter={IDDOCUMENTLIBRARY === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
				ButtonsElement={() => (
					<>
						<Button
							color="primary"
							disabled={mainResult.loading || Object.keys(selectedRows).length === 0}
							onClick={() => {
								deletefiles()
							}}
							startIcon={<ClearIcon style={{ color: 'white' }} />}
							variant="contained"
							style={{ backgroundColor: !(mainResult.loading || Object.keys(selectedRows).length === 0) ? "#FB5F5F" : "#dbdbdc" }}
						>{t(langKeys.delete)}
						</Button>
						<Button
							variant="contained"
							color="primary"
							disabled={mainResult.loading}
							startIcon={<ListAltIcon color="secondary" />}
							onClick={handleTemplate}
							style={{ backgroundColor: "#55BD84" }}
						>
							{`${t(langKeys.template)}  ${t(langKeys.import)}`}
						</Button>
					</>
				)}
			/>
			<ModalDocPreview
				openModal={openModalPreview}
				setOpenModal={setOpenModalPreview}
			/>
		</div>
	)
}

export default DocumentLibraryMainView;