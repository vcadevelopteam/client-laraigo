/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useMemo, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import {
   TemplateIcons,
   TemplateBreadcrumbs,
   TitleDetail,
   FieldView,
   FieldEdit,
   FieldSelect,
   FieldEditMulti,
   FieldCheckbox,
   DialogZyx,
   RadioGroudFieldEdit,
   IOSSwitch,
} from "components";
import {
   getIntegrationManagerSel,
   insIntegrationManager,
   getValuesFromDomain,
   uuidv4,
   extractVariablesFromArray,
   downloadJson,
   uploadExcel,
   insarrayIntegrationManager,
   deldataIntegrationManager,
   getdataIntegrationManager,
   uploadExcelBuffer,
   stringBDTimestampToLocalDate12hr,
} from "common/helpers";
import { Dictionary, MultiData } from "@types";
import TableZyx from "../components/fields/table-simple";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldArrayWithId, UseFormSetValue, useFieldArray, useForm } from "react-hook-form";
import {
   getCollection,
   resetAllMain,
   getMultiCollection,
   execute,
   getCollectionAux,
   resetMainAux,
   triggerRequest,
} from "store/main/actions";
import {
   showSnackbar,
   showBackdrop,
   manageConfirmation,
} from "store/popus/actions";
import ClearIcon from "@material-ui/icons/Clear";
import { apiUrls } from "common/constants";
import { resetRequest } from "store/integrationmanager/actions";
import { dictToArrayKV, extractVariables, isJson } from "common/helpers";
import ListAltIcon from "@material-ui/icons/ListAlt";
import GetAppIcon from '@material-ui/icons/GetApp';
import { TextField, Tooltip, Typography } from "@material-ui/core";
import { CellProps } from "react-table";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogIn from "components/fields/GoogleLogIn";
import useDrivePicker from "react-google-drive-picker";
import { exchangeCode } from "store/google/actions";
import { ExcelFileIcon, GoogleDriveIcon } from "icons";
import { integrationManagerDataSourceIns } from "../common/helpers/requestBodies";
import VinculationTable from "./integrationmanager/VinculationTable";

interface RowSelected {
   row: Dictionary | null;
   edit: boolean;
}

interface DetailProps {
   data: RowSelected;
   setViewSelected: (view: string) => void;
   multiData: MultiData[];
   fetchData: () => void;
   arrayBread: any;
}

const useStyles = makeStyles((theme) => ({
   containerDetail: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      background: "#fff",
   },
   addField: {
      display: 'flex',
      marginTop: theme.spacing(2),
      justifyContent: "end"
   },
   addFieldTracking: {
      display: 'flex',
      marginTop: theme.spacing(4),
      justifyContent: "space-between"
   },
   switchStyle: {
      marginTop: theme.spacing(1),
   },
   switchContainer: {
      display: 'flex',
      gap: theme.spacing(2),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
   },
   containerClaro: {
       display: 'flex',
       flexDirection: 'row',
       gap: theme.spacing(2),
       [theme.breakpoints.down('sm')]: {
         flexWrap: 'wrap',
       },
   },
   containerDetailClaro: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      background: '#fff',
      border: '1px solid #7721ad',
      borderRadius: '10px',
      [theme.breakpoints.up('sm')]: {
          width: '50%', 
      },
      [theme.breakpoints.down('sm')]: {
          width: '100%', 
      },
   },
   button: {
      padding: 12,
      fontWeight: 500,
      fontSize: "14px",
      textTransform: "initial",
   },
   selectInput1: {
      flexGrow: 0,
      flexBasis: "180px",
      marginRight: "10px",
   },
   selectInput2: {
      flexGrow: 1,
      flexBasis: "200px",
   },
   labelButton1: {
      width: "auto",
      marginRight: "0.25rem",
   },
   labelButton2: {
      minWidth: "max-content",
      minHeight: "30px",
      maxHeight: "48px",
      flexBasis: 0,
      flexGrow: 0,
   },
   checkboxRow: {
      flexGrow: 0,
      flexBasis: 0,
      marginRight: "0.5rem",
   },
   fieldRow: {
      flexGrow: 1,
      flexBasis: 0,
      marginRight: "0.5rem",
   },
   fieldButton: {
      flexGrow: 0,
      flexBasis: 0,
   },
   radioGroup: {
      display: "flex",
      flexDirection: "row",
   },
}));

const dataIntegrationType: Dictionary = {
   API_TEMPLATE: "api_template",
   DATA_TABLE: "data_table",
};

const dataIntegrationTypeClaro: Dictionary = {
   API_TEMPLATE: "api_template",
   DATA_TABLE: "data_table",
   CODE_PERSON: "code_binding",
};

const dataMethodType: Dictionary = {
   GET: "GET",
   POST: "POST",
   PUT: "PUT",
   DELETE: "DELETE",
   PATCH: "PATCH",
};

const dataAuthorizationType: Dictionary = {
   NONE: "none",
   BASIC: "basic",
   BEARER: "bearer",
};

const dataBodyType: Dictionary = {
   JSON: "JSON",
   XML: "XML",
   TEXT: "TEXT",
   HTML: "HTML",
   URLENCODED: "URL encoded",
};

const dataLevel: Dictionary = {
   CORPORATION: "corporation",
   ORGANIZATION: "organization",
};

const dataLevelKeys = ["corpid", "orgid"];

const levelFields: Record<string,string> = {
   ORGANIZATION: 'orgid',
   CORPORATION: 'corpid',
}
// let headFields: any[] = []
// let tailFields: any[] = [];

const IntegrationManager: FC = () => {
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const mainResult = useSelector((state) => state.main);
   const executeResult = useSelector((state) => state.main.execute);

   const [viewSelected, setViewSelected] = useState("view-1");
   const [rowSelected, setRowSelected] = useState<RowSelected>({
      row: null,
      edit: false,
   });
   const [waitSave, setWaitSave] = useState(false);
   const [mainData, setMainData] = useState<any>([]);
   const arrayBread = [
      { id: "view-1", name: t(langKeys.integrationmanager_plural) },
   ];
   function redirectFunc(view: string) {
      setViewSelected(view);
   }

   const columns = React.useMemo(
      () => [
         {
            accessor: "id",
            NoFilter: true,
            isComponent: true,
            minWidth: 60,
            width: "1%",
            Cell: (props: any) => {
               const row = props.cell.row.original;
               return (
                  <TemplateIcons
                     viewFunction={() => handleView(row)}
                     deleteFunction={() => handleDelete(row)}
                     editFunction={() => handleEdit(row)}
                  />
               );
            },
         },
         {
            Header: t(langKeys.name),
            accessor: "name",
            NoFilter: true,
         },
         {
            Header: t(langKeys.type),
            accessor: "type_translated",
            NoFilter: true,
         },
         {
            Header: t(langKeys.status),
            accessor: "status",
            NoFilter: true,
            prefixTranslation: "status_",
            Cell: (props: CellProps<Dictionary>) => {
               const { row } = props.cell;               
               if (row && row.original && row.original.status !== undefined && row.original.status !== null) {
                 return (t(`status_${row.original.status}`.toLowerCase()) || "").toUpperCase();
               } else {
                 return "";
               }
             },
             
         },
      ],
      []
   );

   const fetchData = () => dispatch(getCollection(getIntegrationManagerSel(0)));

   useEffect(() => {
      fetchData();
      dispatch(getMultiCollection([getValuesFromDomain("ESTADOGENERICO")]));
      return () => {
         dispatch(resetAllMain());
      };
   }, []);

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
            fetchData();
            dispatch(showBackdrop(false));
            setWaitSave(false);
         } else if (executeResult.error) {
            const errormessage = t(
               executeResult.code || "error_unexpected_error",
               {
                  module: t(langKeys.integrationmanager).toLocaleLowerCase(),
               }
            );
            dispatch(
               showSnackbar({
                  show: true,
                  severity: "error",
                  message: errormessage,
               })
            );
            dispatch(showBackdrop(false));
            setWaitSave(false);
         }
      }
   }, [executeResult, waitSave]);

   const handleRegister = () => {
      setViewSelected("view-2");
      setRowSelected({ row: null, edit: true });
   };

   const handleView = (row: Dictionary) => {
      setViewSelected("view-2");
      setRowSelected({ row, edit: false });
   };

   const handleEdit = (row: Dictionary) => {
      setViewSelected("view-2");
      setRowSelected({ row, edit: true });
   };

   const handleDelete = (row: Dictionary) => {
      const callback = () => {
         dispatch(
            execute(
               insIntegrationManager({
                  ...row,
                  operation: "DELETE",
                  status: "ELIMINADO",
                  id: row.id,
               })
            )
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
      setMainData(
         mainResult.mainData.data.map((x) => ({
            ...x,
            type_translated: (t(`${x.type}`.toLowerCase()) || "").toUpperCase(),
         }))
      );
   }, [mainResult.mainData.data]);

   if (viewSelected === "view-1") {
      if (mainResult.mainData.error) {
         return <h1>ERROR</h1>;
      }

      return (
         <div
            style={{
               width: "100%",
               display: "flex",
               flexDirection: "column",
               flex: 1,
            }}
         >
            <TableZyx
               columns={columns}
               titlemodule={t(langKeys.integrationmanager_plural, {
                  count: 2,
               })}
               data={mainData}
               onClickRow={handleEdit}
               download={true}
               loading={mainResult.mainData.loading}
               register={true}
               handleRegister={handleRegister}
            />
         </div>
      );
   } else
      return (
         <DetailIntegrationManager
            data={rowSelected}
            setViewSelected={redirectFunc}
            multiData={mainResult.multiData.data}
            fetchData={fetchData}
            arrayBread={arrayBread}
         />
      );
};

type AuthorizationType = {
   type: string;
   username?: string;
   password?: string;
   token?: string;
};

type FieldType = {
   id?: string;
   name: string;
   key: boolean;
};

type FormFields = {
   isnew: boolean;
   apikey: string;
   id: number;
   description: string;
   type: string;
   status: string;
   name: string;
   method: string;
   url: string;
   authorization: AuthorizationType;
   headers: Dictionary[];
   bodytype: string;
   body: string;
   url_params: Dictionary[];
   code_params: Dictionary[];
   code_table: any;
   person_table: any;
   person_params: Dictionary[];
   code_params_tracking: Dictionary[];
   person_params_tracking: Dictionary[];
   parameters: Dictionary[];
   variables: string[];
   level: string;
   fields: FieldType[];
   operation: string;
   results: Dictionary[];
   datasource?: string;
};

interface IGoolgeTokenInfo {
   access_token?: string;
   expires_in?: number;
   code?: string;
   id_token?: string;
   refresh_token?: string;
   scope?: string;
   token_type?: string;
}

interface IDataSourceConfig {
   fileid?: string;
   filename?: string;
   datasource_lastsync?: string;
   credentials?: IGoolgeTokenInfo | null
}

const DetailIntegrationManager: React.FC<DetailProps> = ({
   data: { row, edit },
   setViewSelected,
   multiData,
   fetchData,
   arrayBread,
}) => {
   const classes = useStyles();
   const [waitSave, setWaitSave] = useState(false);
   const executeRes = useSelector((state) => state.main.execute);
   const user = useSelector((state) => state.login.validateToken.user);
   const dispatch = useDispatch();
   const { t } = useTranslation();

   const [waitImport, setWaitImport] = useState(false);
   const [waitDelete, setWaitDelete] = useState(false);
   const mainAuxRes = useSelector((state) => state.main.mainAux);
   const [waitView, setWaitView] = useState(false);
   const [openViewTableModal, setOpenViewTableModal] = useState(false);
   const [tableData, setTableData] = useState<any[]>([]);
   const [columnData, setColumnData] = useState<any[]>([]);

   const [contentType, setContentType] = useState("Texto");
   const [openTestModal, setOpenTestModal] = useState(false);
   const [openResponseModal, setOpenResponseModal] = useState(false);
   const [view, setView] = useState("view-1");
   const [responseData, setResponseData] = useState<any>();

   const [openPicker] = useDrivePicker();
   const [waitGoogleTokenExchange, setWaitGoogleTokenExchange] = useState(false);
   const exchangeCodeResult = useSelector((state) => state.google.requestExchangeCode);
   const [importedData, setImportedData] = useState<Dictionary[] | null>(null)
   const [dataSourceConfig, setDataSourceConfig] = useState<IDataSourceConfig | null>(row?.datasource_config ?? null)
   const [dataIntType, setDataIntType] = useState<Dictionary>([]);
   const [codeExpiration, setCodeExpiration] = useState(!!row?.code_table?.columns?.includes("Fecha de caducidad")||false);
   const [personExpiration, setPersonExpiration] = useState(!!row?.person_table?.columns?.includes("Fecha de caducidad")||false);

   const dataKeys = new Set([
      ...dataLevelKeys,
      ...(row?.fields
         ?.filter((r: FieldType) => r.key)
         ?.map((r: FieldType) => r.name) || []),
   ]);

   const {
      control,
      register,
      handleSubmit,
      setValue,
      getValues,
      trigger,
      watch,
      formState: { errors },
      setError
   } = useForm<FormFields>({
      defaultValues: {
         isnew: row ? false : true,
         apikey: row && (row.apikey || "") !== "" ? row.apikey : uuidv4(),
         id: row ? row.id : 0,
         description: row ? row.description || "" : "",
         type: row ? row.type || "API_TEMPLATE" : "API_TEMPLATE",
         status: row ? row.status || "ACTIVO" : "ACTIVO",
         name: row ? row.name || "" : "",
         method: row ? row.method || "GET" : "GET",
         url: row ? row.url || "" : "",
         authorization: row
            ? row.authorization || { type: "NONE" }
            : { type: "NONE" },
         headers: row ? row.headers || [] : [],
         bodytype: row ? row.bodytype || "JSON" : "JSON",
         body: row ? row.body || "" : "",
         url_params: row ? row.url_params || [] : [],
         parameters: row ? row.parameters || [] : [],
         variables: row ? row.variables || [] : [],
         level: row ? row.level || "CORPORATION" : "CORPORATION",
         fields: row
            ? row.fields || [{ name: "corpid", key: true }]
            : [{ name: "corpid", key: true }],
         operation: row ? "EDIT" : "INSERT",
         results: row ? row.results || [] : [],
         datasource: row ? row.datasource || '' : '',
         code_table: {},
         code_params: row?.code_table?.columns?.filter((item) => !['Codigo', 'Fecha de caducidad'].includes(item))?.map((item) => ({ key: item })) ||[],
         person_params: row?.person_table?.columns?.filter((item) => !['Persona', 'Fecha de caducidad'].includes(item))?.map((item) => ({ key: item })) ||[],
         code_params_tracking: row?.code_table?.tracking_columns?.map((item) => ({ key: item })) ||[{key:"Persona"}],
         person_params_tracking: row?.person_table?.tracking_columns?.map((item) => ({ key: item })) ||[{key:"Codigo"}],
      },
   });

   const [isnew] = watch(["isnew"]);

   const {
      fields: headers,
      append: headersAppend,
      remove: headersRemove,
      update: headersUpdate,
   } = useFieldArray({
      control,
      name: "headers",
   });

   const {
      fields: urlParams,
      append: urlParamsAppend,
      remove: urlParamsRemove,
   } = useFieldArray({
      control,
      name: "url_params",
   });
   const {
      fields: codeParams,
      append: codeParamsAppend,
      remove: codeParamsRemove,
   } = useFieldArray({
      control,
      name: "code_params",
   });
   
   const {
      fields: personParams,
      append: personParamsAppend,
      remove: personParamsRemove,
   } = useFieldArray({
      control,
      name: "person_params",
   });
   const {
      fields: codeTrackingParams,
      append: codeTrackingParamsAppend,
      remove: codeTrackingParamsRemove,
   } = useFieldArray({
      control,
      name: "code_params_tracking",
   });

   const {
      fields: personTrackingParams,
      append: personTrackingParamsAppend,
      remove: personTrackingParamsRemove,
   } = useFieldArray({
      control,
      name: "person_params_tracking",
   });

   const {
      fields: parameters,
      append: parametersAppend,
      remove: parametersRemove,
      update: parametersUpdate,
   } = useFieldArray({
      control,
      name: "parameters",
   });

   const {
      fields,
      append: fieldsAppend,
      remove: fieldsRemove,
      update: fieldsUpdate,
   } = useFieldArray({
      control,
      name: "fields",
   });

   const {
      fields: results,
      append: resultsAppend,
      remove: resultsRemove,
      update: resultsUpdate,
   } = useFieldArray({
      control,
      name: "results",
   });

   useEffect(() => {
      if (waitGoogleTokenExchange) {
         if (!exchangeCodeResult.loading) {
            if (!exchangeCodeResult.error) {
               dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
               if (exchangeCodeResult.data) {
                  setDataSourceConfig(pv => ({ ...pv, credentials: exchangeCodeResult.data as IGoolgeTokenInfo}))
                  handleOpenPicker(exchangeCodeResult.data.access_token)
               }
            } else {
               dispatch(
                  showSnackbar({
                     show: true,
                     severity: "error",
                     message: t(
                        exchangeCodeResult.msg ??
                        exchangeCodeResult.message ??
                        exchangeCodeResult.code ??
                        "error_unexpected_error"
                     ),
                  })
               );
            }
            dispatch(showBackdrop(false));
            setWaitGoogleTokenExchange(false);
         }
      }
   }, [exchangeCodeResult, waitGoogleTokenExchange])

   const handleOpenPicker = (token: string) => {
      openPicker({
         clientId: `${apiUrls.GOOGLECLIENTID_CHANNEL}`,
         developerKey: 'AIzaSyB_xsVpmtbD7qrQ2WDXRkaGW9YZTOcn424',
         viewId: "SPREADSHEETS",
         token: token,
         showUploadView: true,
         showUploadFolders: true,
         supportDrives: true,
         multiselect: false,
         callbackFunction: async (data) => {
            if (data.action === 'picked') {
               dispatch(showBackdrop(true));
               const fetchOptions = {
                     headers: {
                        Authorization: `Bearer ${token}`,
                     },
               };

               setDataSourceConfig(prevValue => ({
                  ...prevValue,
                  fileid: String(data.docs[0].id),
                  filename: String(data.docs[0].name)
               }))

               const driveFileUrl = "https://www.googleapis.com/drive/v3/files";
               const fileId = data.docs[0].id
               const fileMimeType = data.docs[0].mimeType
               let exportUrl = ''
               if (fileMimeType === 'application/vnd.google-apps.spreadsheet')
                  exportUrl = `${driveFileUrl}/${fileId}/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`;
               else {
                  exportUrl = `${driveFileUrl}/${fileId}?alt=media`;
               }
               const response = await fetch(exportUrl, fetchOptions);
               const resBuffer = await response.arrayBuffer();
               const dataFromBuffer = new Uint8Array( resBuffer );
               const outputData = await uploadExcelBuffer(dataFromBuffer ) as Dictionary[]
               if (outputData.length) {
                  const validateHeaders = validateHeader(outputData[0])
                  if (validateHeaders) {
                     setValue('datasource', 'GOOGLE DRIVE')
                     resetFields(getValues('level'))
                     Object.keys(outputData[0]).map(i => fieldsAppend({ name: i, key: false}))
                     setImportedData(outputData)
                  }
               }
               dispatch(showBackdrop(false));
            }
         }
      });
   };

   const handleExcelImport = async (files: any) => {
      const file = files?.item(0);
      if (file) {
         const data: any = await uploadExcel(file, undefined);
         if (data.length > 0) {
            const validateHeaders = validateHeader(data[0])
            if (validateHeaders) {
               setDataSourceConfig(null)
               setValue('datasource', 'FILE')
               resetFields(getValues('level'))
               Object.keys(data[0]).map(i => fieldsAppend({ name: i, key: false}))
               setImportedData(data)
            }
         }
      }
   };

   const resetFields = (level: string) => {
      const newFields: FieldType[] = []
      newFields.push({ name: "corpid", key: true, id: 'newCorpid' })
      if (level === "ORGANIZATION") {
         newFields.push({ name: "orgid", key: true })
      }

      setValue('fields', newFields)
   }

   const validateHeader = (data) => {
      const regex = /^[a-z0-9]+$/;
      for (const header of Object.keys(data)) {
         if (!regex.test(header)) {
            dispatch( showSnackbar({ show: true, severity: "error", message: t(langKeys.importfield_basiclatinlowercasenospaces), }));
            return false;
         }
      }
      return true;
   };

   const hasDuplicatesForKey = (array, key) => {
      const valuesSet = new Set();
      for (const obj of array) {
          const value = obj[key];
          if (valuesSet.has(value)) return true;
          valuesSet.add(value);
      }
      return false;
  };

   React.useEffect(() => {
      register("name", {
         validate: {
            value: (value: any) =>
               (value && value.length) || t(langKeys.field_required),
            basiclatin: (value: any) =>
               getValues("type") !== "DATA_TABLE" ||
               validateBasicLatinFieldName(value) ||
               t(langKeys.field_basiclatinlowercase),
         },
      });
      register("type", {
         validate: (value: any) =>
            (value && value.length) || t(langKeys.field_required),
      });
      register("method", {
         validate: (value: any) =>
            (value && value.length) || t(langKeys.field_required),
      });
   }, [edit, register]);

   useEffect(() => {
      setDataIntType(user?.properties.environment === "CLARO"?dataIntegrationTypeClaro: dataIntegrationType)
   }, [user])

   useEffect(() => {
      if (waitSave) {
         if (!executeRes.loading && !executeRes.error) {
            dispatch(
               showSnackbar({
                  show: true,
                  severity: "success",
                  message: t(
                     row
                        ? langKeys.successful_edit
                        : langKeys.successful_register
                  ),
               })
            );
            fetchData();
            dispatch(showBackdrop(false));
            setViewSelected("view-1");
         } else if (executeRes.error) {
            const errormessage = t(
               executeRes.code || "error_unexpected_error",
               {
                  module: t(langKeys.integrationmanager).toLocaleLowerCase(),
               }
            );
            dispatch(
               showSnackbar({
                  show: true,
                  severity: "error",
                  message: errormessage,
               })
            );
            dispatch(showBackdrop(false));
            setWaitSave(false);
         }
      }
   }, [executeRes, waitSave]);

   const onSubmit = handleSubmit((data) => {
      let error=false
      data.variables = data.variables || [];
      if (data.type === "API_TEMPLATE") {
         let v: string[] = [];
         v = extractVariablesFromArray(data.headers, "value", v);
         if (data.bodytype === "JSON") {
            v = extractVariables(data.body, v);
         } else if (data.bodytype === "URLENCODED") {
            v = extractVariablesFromArray(data.parameters, "value", v);
         }
         data.variables = v;
      }else if (data.type === "CODE_PERSON"){  
         const codecolumnstrack = data.code_params_tracking.map((item) => item.key);
         const personcolumnstrack = data.person_params_tracking.map((item) => item.key);
         const codecolumns = ['Codigo']
         data.code_params.forEach((item) => {
            codecolumns.push(item.key);
            if (codeExpiration) {
               codecolumns.splice(1, 0, 'Fecha de caducidad');
            }
          });
         const personcolumns = ['Persona']
         data.person_params.forEach((item) => {
            personcolumns.push(item.key);
            if (personExpiration) {
               personcolumns.splice(1, 0, 'Fecha de caducidad');
            }
         });
         data.code_table={
            "columns": codecolumns,
            "tracking_columns": codecolumnstrack
         }
         data.person_table={
            "columns": personcolumns,
            "tracking_columns": personcolumnstrack
         }
  
         data.code_params.forEach((x,i)=>{
            const count = codecolumns.filter((value) => value === x.key).length;
            const hasDuplicates = count > 1;
            if(x.key==="Codigo"||x.key==="Fecha de caducidad"||hasDuplicates) {
               setError(`code_params.${i}.key`, { type: 'manual', message: t(langKeys.errorIntegrationColumnDuplicates) })
               error=true
            }
         })
         data.code_params_tracking.forEach((x,i)=>{
            const count = codecolumnstrack.filter((value) => value === x.key).length;
            const hasDuplicates = count > 1;
            if(hasDuplicates) {
               setError(`code_params.${i}.key`, { type: 'manual', message: t(langKeys.errorIntegrationColumnDuplicates) })
               error=true
            }
         })
         data.person_params.forEach((x,i)=>{
            const count = personcolumns.filter((value) => value === x.key).length;
            const hasDuplicates = count > 1;
            if(x.key==="Persona"||x.key==="Fecha de caducidad"||hasDuplicates){ 
               error= true
               setError(`person_params.${i}.key`, { type: 'manual', message: t(langKeys.errorIntegrationColumnDuplicates)})
            }
         })
         data.person_params_tracking.forEach((x,i)=>{
            const count = personcolumnstrack.filter((value) => value === x.key).length;
            const hasDuplicates = count > 1;
            if(hasDuplicates) {
               setError(`code_params.${i}.key`, { type: 'manual', message: t(langKeys.errorIntegrationColumnDuplicates) })
               error=true
            }
         })

      } else if (data.isnew && data.type === "DATA_TABLE") {
         const getKeyField = data.fields.filter( (d) => !dataLevelKeys.includes(d.name) && d.key === true )
         if ( getKeyField.length === 0 ) {
            dispatch( showSnackbar({ show: true, severity: "error", message: t(langKeys.field_key_required), }) );
            return null;
         }
         if (importedData && importedData.length) {
            const keyHasDuplicates = hasDuplicatesForKey(importedData, getKeyField[0].name)
            if (keyHasDuplicates) {
               dispatch( showSnackbar({ show: true, severity: "error", message: t(langKeys.keyfield_duplicate), }) );
               return null;
            }
         }

         if (data.datasource !== 'GOOGLE DRIVE') {
            setDataSourceConfig(null)
         }

         let rex1 = new RegExp(/[^0-9a-zA-Z\s-_]/, "g");
         let rex2 = new RegExp(/[\s-]/, "g");
         let corpdesc = (user?.corpdesc || "")
            .replace(rex1, "_")
            .replace(rex2, "_")
            .toLowerCase();
         let orgdesc = (user?.orgdesc || "")
            .replace(rex1, "_")
            .replace(rex2, "_")
            .toLowerCase();
         let name = data.name
            .replace(rex1, "")
            .replace(rex2, "_")
            .toLowerCase();
         data.url = `${apiUrls.INTEGRATION_URL}/integration_${corpdesc}_${orgdesc}_${name}`;
      }

      const callback = () => {
          dispatch(execute({
            header: insIntegrationManager(data),
            detail: [
               ...(importedData && importedData.length ? [insarrayIntegrationManager(0, importedData)] : []),
               ...(dataSourceConfig ? [integrationManagerDataSourceIns(0, 'DRIVE', dataSourceConfig as Dictionary)] : [])
            ]
          }, true));
         dispatch(showBackdrop(true));
         setWaitSave(true);
      };
      if(!error){      
         dispatch(
            manageConfirmation({
               visible: true,
               question: t(langKeys.confirmation_save),
               callback,
            })
         );
      }
   });

   const onChangeContentType = (e: { key: React.SetStateAction<string> }) => {
      if (e.key === "Formulario") {
         setValue("bodytype", "URLENCODED");
      }
      if (e.key === "Texto" && getValues("bodytype") === "URLENCODED") {
         setValue("bodytype", "JSON");
      }
      setContentType(e.key);
   };

   const onChangeType = async (data: Dictionary) => {
      setValue("type", data?.key || "");
      await trigger("type");
   };

   const onChangeMethod = async (data: Dictionary) => {
      setValue("method", data?.key || "");
      await trigger("method");
   };

   const onChangeAuthorization = async (data: Dictionary) => {
      setValue("authorization.type", data?.key || "");
      await trigger("authorization.type");
   };

   const onClickAddHeader = async () => {
      headersAppend({ key: "", value: "", description: "" });
   };

   const onClickDeleteHeader = async (index: number) => {
      headersRemove(index);
   };

   const onBlurHeader = (index: any, param: string, value: any) => {
      headersUpdate(index, { ...headers[index], [param]: value });
   };

   const onChangeBodyType = async (data: Dictionary) => {
      if (data?.key === "URLENCODED") {
         setContentType("Formulario");
      } else {
         setContentType("Texto");
      }
      setValue("bodytype", data?.key || "");
      await trigger("bodytype");
   };
   
   const onClickAddUrlParam = async () => {
      urlParamsAppend({ key: "", value: "" });
      updateUrl();
   };

   const updateUrl = () => {
      let baseUrl = getValues("url").split("?")[0];
      let queryParams = getValues("url_params")
         .map((p: any) => `${p.key}=${p.value}`)
         .join("&");

      setValue("url", queryParams ? `${baseUrl}?${queryParams}` : baseUrl);
   };

   const onClickDeleteUrlParam = async (index: number) => {
      urlParamsRemove(index);
      updateUrl();
   };

   const onClickAddResult = async () => {
      resultsAppend({ variable: "", path: "" });
   };

   const onClickDeleteResult = async (index: number) => {
      resultsRemove(index);
   };

   const onBlurResult = (index: any, param: string, value: any) => {
      resultsUpdate(index, { ...results[index], [param]: value });
   };

   const onClickAddParameter = async () => {
      parametersAppend({ key: "", value: "" });
   };

   const onClickDeleteParameter = async (index: number) => {
      parametersRemove(index);
   };

   const onBlurParameter = (index: any, param: string, value: any) => {
      parametersUpdate(index, { ...parameters[index], [param]: value });
   };

   const onChangeBody = (value: string) => {
      setValue("body", value);
   };

   const onClickBeautify = async () => {
      let data = getValues("body");
      if (isJson(data)) {
         data = JSON.parse(data);
         data = JSON.stringify(data, null, 4);
         setValue("body", "");
         await trigger("body");
         setValue("body", data);
         await trigger("body");
      }
   };

   const onBlurBody = () => {
      let bodytype = getValues("bodytype");
      if (bodytype === "JSON") {
         let data = getValues("body");
         validateJSON(data);
      }
   };

   const validateJSON = (data: string): any => {
      if (!isJson(data)) {
         return false;
      } else {
         return true;
      }
   };

   const onChangeLevel = async (data: Dictionary) => {
      setValue("level", data?.key || "");
      await trigger("level");
      
      let newFields = getValues("fields").filter((f) => !dataLevelKeys.includes(f.name));
      
      if (data?.key === "CORPORATION") {
        newFields = [
          { name: "corpid", key: true, id: 'newCorpid' }, // Ensure you're creating a new field here
          ...newFields,
        ];
      }
      
      if (data?.key === "ORGANIZATION") {
        newFields = [
          { name: "corpid", key: true }, 
          { name: "orgid", key: true }, 
          ...newFields,
        ];
      }
    
      // Use Set to remove duplicates based on field name.
      const fieldsWithoutDuplicates = Array.from(new Set(newFields.map(field => field.name)))
    .map(name => {
      return newFields.find(field => field.name === name) || {name: '', key:false}
    });

      setValue("fields", fieldsWithoutDuplicates);
    };
   const onClickAddField = async () => {
      fieldsAppend({ name: "", key: false });
   };

   const onClickDeleteField = async (index: number) => {
      fieldsRemove(index);
   };

   const onBlurField = (index: any, param: string, value: any) => {
      fieldsUpdate(index, { ...fields[index], [param]: value });
   };

   const disableKeys = (field: FieldType, i: number) => {
      if (dataLevelKeys.includes(field?.name)) {
         return true;
      } else if (dataKeys.has(field?.name) && !getValues("isnew")) {
         return true;
      }
      return false;
   };

   const validateDuplicateFieldName = (
      field: FieldType,
      value: string
   ): any => {
      let f = fields
         .filter((x: FieldType) => x.id !== field.id)
         .map((m: FieldType) => m.name);
      return !f.includes(value);
   };

   const validateStartwithcharFieldName = (value: string): any => {
      let rex = new RegExp(/[a-z]/, "g");
      return rex.test(value[0]);
   };

   const validateBasicLatinFieldName = (value: string): any => {
      let rex = new RegExp(/^[a-z\d]+$/, "g");
      return rex.test(value);
   };

   const onClickTestButton = async () => {
      const allOk = await trigger();
      if (!allOk) {
         return;
      }
      setOpenTestModal(true);
   };

   const cleanRequestData = () => {
      dispatch(resetRequest());
   };

   const onClickInfo = () => {
      downloadJson("info", {
         url: `${getValues("url")}/{operation}`,
         insert_one: {
            data: fields.reduce(
               (a, d) => ({
                  ...a,
                  [d.name]:
                     d.name === "corpid"
                        ? user?.corpid
                        : d.name === "orgid"
                        ? user?.orgid
                        : `${d.name}_data1`,
               }),
               {}
            ),
         },
         insert_many: {
            data: [
               fields.reduce(
                  (a, d) => ({
                     ...a,
                     [d.name]:
                        d.name === "corpid"
                           ? user?.corpid
                           : d.name === "orgid"
                           ? user?.orgid
                           : `${d.name}_data1`,
                  }),
                  {}
               ),
               fields.reduce(
                  (a, d) => ({
                     ...a,
                     [d.name]:
                        d.name === "corpid"
                           ? user?.corpid
                           : d.name === "orgid"
                           ? user?.orgid
                           : `${d.name}_data2`,
                  }),
                  {}
               ),
            ],
         },
         update: {
            data: fields.reduce(
               (a, d) => ({
                  ...a,
                  [d.name]:
                     d.name === "corpid"
                        ? user?.corpid
                        : d.name === "orgid"
                        ? user?.orgid
                        : `${d.name}_data2`,
               }),
               {}
            ),
            filter: fields.reduce(
               (a, d) => ({
                  ...a,
                  [d.name]:
                     d.name === "corpid"
                        ? user?.corpid
                        : d.name === "orgid"
                        ? user?.orgid
                        : `${d.name}_data1`,
               }),
               {}
            ),
         },
         remove: {
            filter: fields.reduce(
               (a, d) => ({
                  ...a,
                  [d.name]:
                     d.name === "corpid"
                        ? user?.corpid
                        : d.name === "orgid"
                        ? user?.orgid
                        : `${d.name}_data1`,
               }),
               {}
            ),
         },
         find_one: {
            filter: fields.reduce(
               (a, d) => ({
                  ...a,
                  [d.name]:
                     d.name === "corpid"
                        ? user?.corpid
                        : d.name === "orgid"
                        ? user?.orgid
                        : `${d.name}_data1`,
               }),
               {}
            ),
            sort: fields.reduce((a, d) => ({ ...a, [d.name]: "asc" }), {}),
         },
         find_many: {
            filter: fields.reduce(
               (a, d) => ({
                  ...a,
                  [d.name]:
                     d.name === "corpid"
                        ? user?.corpid
                        : d.name === "orgid"
                        ? user?.orgid
                        : `${d.name}_data1`,
               }),
               {}
            ),
            sort: fields.reduce((a, d) => ({ ...a, [d.name]: "asc" }), {}),
            limit: 10,
         },
      });
   };

   const handleUpload = async (files: any) => {
      
      const file = files?.item(0);
      if (file) {
         const data: any = await uploadExcel(file, undefined);
         if (data.length > 0) {
            dispatch(showBackdrop(true));
            dispatch(
               execute(insarrayIntegrationManager(getValues("id"), data))
            );
            setWaitImport(true);
         }
      }
   };

   useEffect(() => {
      if (waitImport) {
         if (!executeRes.loading && !executeRes.error) {
            dispatch(
               showSnackbar({
                  show: true,
                  severity: "success",
                  message: t(langKeys.successful_transaction),
               })
            );
            dispatch(showBackdrop(false));
            setWaitImport(false);
         } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: `${t(langKeys.key).toLocaleLowerCase()}` })
            dispatch(
               showSnackbar({
                  show: true,
                  severity: "error",
                  message: errormessage,
               })
            );
            dispatch(showBackdrop(false));
            setWaitImport(false);
         }
      }
   }, [executeRes, waitImport]);

   const onDeleteData = () => {
      const callback = () => {
         dispatch(showBackdrop(true));
         dispatch(execute(deldataIntegrationManager(getValues("id"))));
         setWaitDelete(true);
      };

      dispatch(
         manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete_data),
            callback,
         })
      );
   };

   useEffect(() => {
      if (waitDelete) {
         if (!executeRes.loading && !executeRes.error) {
            dispatch(
               showSnackbar({
                  show: true,
                  severity: "success",
                  message: t(langKeys.successful_delete),
               })
            );
            dispatch(showBackdrop(false));
            setWaitDelete(false);
         } else if (executeRes.error) {
            const errormessage = t(
               executeRes.code || "error_unexpected_error",
               {
                  module: t(langKeys.integrationmanager).toLocaleLowerCase(),
               }
            );
            dispatch(
               showSnackbar({
                  show: true,
                  severity: "error",
                  message: errormessage,
               })
            );
            dispatch(showBackdrop(false));
            setWaitDelete(false);
         }
      }
   }, [executeRes, waitDelete]);

   const handleViewTable = () => {
      dispatch(showBackdrop(true));
      dispatch(getCollectionAux(getdataIntegrationManager(getValues("id"))));
      setWaitView(true);
   };

   useEffect(() => {
      if (waitView) {
         if (!mainAuxRes.loading && !mainAuxRes.error) {
            dispatch(showBackdrop(false));
            setWaitView(false);
            if (
               mainAuxRes.data[0]?.data &&
               mainAuxRes.data[0]?.data?.length > 0
            ) {
               setTableData(mainAuxRes.data[0]?.data);
               setColumnData(
                  Object.keys(mainAuxRes.data[0].data[0]).map((c) => ({
                     Header: c,
                     accessor: c,
                  }))
                  );
            }
            setOpenViewTableModal(true);
         } else if (mainAuxRes.error) {
            const errormessage = t(
               mainAuxRes.code || "error_unexpected_error",
               {
                  module: t(langKeys.integration_plural).toLocaleLowerCase(),
               }
            );
            dispatch(
               showSnackbar({
                  show: true,
                  severity: "error",
                  message: errormessage,
               })
            );
            dispatch(showBackdrop(false));
            setWaitView(false);
         }
      }
   }, [mainAuxRes, waitView]);

   const onChangeURL = (value: string) => {
      const params = new URLSearchParams(value.split("?")[1]);
      const urlParams: { key: string; value: string }[] = [];

      const iterator = params.entries();
      let result = iterator.next();

      while (!result.done) {
         const [key, value] = result.value;
         urlParams.push({ key, value });
         result = iterator.next();
      }
      setValue("url_params", urlParams);
      setValue("url", value);
   };

   const [headFields, tailFields] = useMemo(() => {
      if(!fields) return [[],[]];
      const headLenght = levelFields[getValues("level")] === 'corpid' ? 1 : 2;
      const head = fields.slice(0, headLenght) as FieldArrayWithId<FormFields, "fields", "id">[];
      const tail = fields.slice(headLenght) as FieldArrayWithId<FormFields, "fields", "id">[];
      return [head, tail];
   }, [fields]);

   if(view === "view-1"){
      return (
         <div style={{ width: "100%" }}>
            {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            <form onSubmit={onSubmit}>
               <div
                  style={{
                     display: "flex",
                     justifyContent: "space-between",
                  }}
               >
                  <div>
                     <TemplateBreadcrumbs
                        breadcrumbs={[
                           ...arrayBread,
                           {
                              id: "view-2",
                              name: t(langKeys.integrationmanagerdetail),
                           },
                        ]}
                        handleClick={setViewSelected}
                     />
                     <TitleDetail
                        title={
                           row ? `${row.name}` : t(langKeys.newintegrationmanager)
                        }
                     />
                  </div>
                  <div
                     style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                     }}
                  >
                     {getValues("type") === "API_TEMPLATE" && (
                        <Button
                           variant="contained"
                           type="button"
                           color="primary"
                           style={{ backgroundColor: "#7721AD" }}
                           // onClick={() => onClickTest()}
                           onClick={onClickTestButton}
                        >
                           {t(langKeys.test)}
                        </Button>
                     )}
                     {!getValues("isnew") &&
                        getValues("type") === "DATA_TABLE" && (
                           <React.Fragment>
                               {/* <Button
                                 variant="contained"
                                 type="button"
                                 color="primary"
                                 startIcon={<DeleteIcon color="secondary" />}
                                 style={{ backgroundColor: "#FB5F5F" }}
                                 onClick={onDeleteData}
                              >
                                 {t(langKeys.deletedata)}
                              </Button> */}
                              
                              {/*
                              <input
                                 accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                                 id="uploadfile"
                                 type="file"
                                 style={{ display: "none" }}
                                 onChange={(e) => handleUpload(e.target.files)}
                              />
                              <label htmlFor="uploadfile">
                                 <Button
                                    className={classes.button}
                                    variant="contained"
                                    component="span"
                                    color="primary"
                                    startIcon={<BackupIcon color="secondary" />}
                                    style={{
                                       backgroundColor: "#55BD84",
                                    }}
                                 >
                                    {t(langKeys.import)}
                                 </Button>
                              </label> */}
                           </React.Fragment>
                        )}
                     <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}
                     >
                        {t(langKeys.back)}
                     </Button>
                     {edit && (
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
                     )}
                  </div>
               </div>
               <div className={classes.containerDetail}>
                  <div className="row-zyx">
                     {edit && getValues("isnew") ? (
                        <FieldEdit
                           label={t(langKeys.name)}
                           className="col-12"
                           valueDefault={getValues("name")}
                           onChange={(value) => setValue("name", value)}
                           error={errors?.name?.message}
                           helperText={ getValues('type') === 'DATA_TABLE' ? t(langKeys.tooltipintegrationname): undefined}
                        />
                     ) : (
                        <FieldView
                           label={t(langKeys.name)}
                           tooltip={t(langKeys.tooltipintegrationname)}
                           value={row?.name || ""}
                           className="col-12"
                        />
                     )}
                  </div>
   
                  <div className="row-zyx">
                     {edit && getValues("isnew") ? (
                        <FieldSelect
                           uset={true}
                           label={t(langKeys.type)}
                           className="col-12"
                           valueDefault={getValues("type")}
                           onChange={onChangeType}
                           error={errors?.type?.message}
                           data={dictToArrayKV(dataIntType)}
                           optionDesc="value"
                           optionValue="key"
                        />
                     ) : (
                        <FieldView
                           label={t(langKeys.type)}
                           value={t(dataIntType[row?.type]) || ""}
                           className="col-12"
                        />
                     )}
                  </div>
                  {getValues("type") === "CODE_PERSON" &&
                     <FieldSelect
                        uset={true}
                        fregister={{
                           ...register(`level`, {
                              validate: (value: any) =>
                                 (value && value.length) ||
                                 t(langKeys.field_required),
                           }),
                        }}
                        label={t(langKeys.level)}
                        className="col-4"
                        valueDefault={getValues("level")}
                        onChange={onChangeLevel}
                        error={errors?.level?.message}
                        data={dictToArrayKV(dataLevel)}
                        optionDesc="value"
                        optionValue="key"
                     />
                     
                  }
                  {getValues("type") === "API_TEMPLATE" &&
                     <div className="row-zyx">
                        {edit ? (
                           <React.Fragment>
                              <FieldSelect
                                 fregister={{
                                    ...register(`method`, {
                                       validate: (value: any) =>
                                          (value && value.length) ||
                                          t(langKeys.field_required),
                                    }),
                                 }}
                                 label={t(langKeys.requesttype)}
                                 className={classes.selectInput1}
                                 valueDefault={getValues("method")}
                                 onChange={onChangeMethod}
                                 error={errors?.method?.message}
                                 data={dictToArrayKV(dataMethodType)}
                                 optionDesc="value"
                                 optionValue="key"
                              />
                              <FieldEdit
                                 fregister={{
                                    ...register(`url`, {
                                       validate: (value: any) =>
                                          (value && value.length) ||
                                          t(langKeys.field_required),
                                    }),
                                 }}
                                 label={t(langKeys.url)}
                                 className={classes.selectInput2}
                                 valueDefault={getValues("url")}
                                 onChange={(value) => onChangeURL(value)}
                                 error={errors?.url?.message}
                              />
                           </React.Fragment>
                        ) : (
                           <FieldView
                              label={t(langKeys.url)}
                              value={row?.url || ""}
                              className="col-12"
                           />
                        )}
                     </div>
                  } 
                  {getValues("type") === "DATA_TABLE" && <div className="row-zyx">
                  {edit && getValues("isnew") ? (
                     <React.Fragment>
                        <FieldEdit
                           label={t(langKeys.url)}
                           className="col-12"
                           valueDefault={getValues("url")}
                           disabled={true}
                           error={errors?.url?.message}
                           helperText={t(langKeys.tooltipintegrationurl)}
                        />
                     </React.Fragment>
                  ) : (
                     <FieldView
                        label={t(langKeys.url)}
                        value={row?.url || ""}
                        className="col-12"
                        tooltip={t(langKeys.tooltipintegrationurl)}
                     />
                  )}
               </div>}
               </div>
               {getValues("type") === "API_TEMPLATE" ? (
                  <React.Fragment>
                     <div className={classes.containerDetail}>
                        <div className="row-zyx">
                           <FieldSelect
                              uset={true}
                              fregister={{
                                 ...register(`authorization.type`, {
                                    validate: (value: any) =>
                                       (value && value.length) ||
                                       t(langKeys.field_required),
                                 }),
                              }}
                              label={t(langKeys.authorization)}
                              valueDefault={getValues("authorization.type")}
                              onChange={onChangeAuthorization}
                              error={errors?.authorization?.type?.message}
                              data={dictToArrayKV(dataAuthorizationType)}
                              optionDesc="value"
                              optionValue="key"
                           />
                        </div>
   
                        {getValues("authorization.type") === "BASIC" ? (
                           <div className="row-zyx">
                              <React.Fragment>
                                 <FieldEdit
                                    fregister={{
                                       ...register(`authorization.username`, {
                                          validate: (value: any) =>
                                             getValues("authorization.type") ===
                                             "BASIC"
                                                ? (value && value.length) ||
                                                  t(langKeys.field_required)
                                                : null,
                                       }),
                                    }}
                                    label={t(langKeys.username)}
                                    className="col-6"
                                    valueDefault={getValues(
                                       "authorization.username"
                                    )}
                                    onChange={(value) =>
                                       setValue("authorization.username", value)
                                    }
                                    error={
                                       errors?.authorization?.username?.message
                                    }
                                 />
                                 <FieldEdit
                                    fregister={{
                                       ...register(`authorization.password`, {
                                          validate: (value: any) =>
                                             getValues("authorization.type") ===
                                             "BASIC"
                                                ? (value && value.length) ||
                                                  t(langKeys.field_required)
                                                : null,
                                       }),
                                    }}
                                    label={t(langKeys.password)}
                                    className="col-6"
                                    valueDefault={getValues(
                                       "authorization.password"
                                    )}
                                    onChange={(value) =>
                                       setValue("authorization.password", value)
                                    }
                                    error={
                                       errors?.authorization?.password?.message
                                    }
                                 />
                              </React.Fragment>
                           </div>
                        ) : null}
                        {getValues("authorization.type") === "BEARER" ? (
                           <div className="row-zyx">
                              {edit ? (
                                 <FieldEdit
                                    fregister={{
                                       ...register(`authorization.token`, {
                                          validate: (value: any) =>
                                             getValues("authorization.type") ===
                                             "BEARER"
                                                ? (value && value.length) ||
                                                  t(langKeys.field_required)
                                                : null,
                                       }),
                                    }}
                                    label={t(langKeys.token)}
                                    className="col-12"
                                    valueDefault={getValues("authorization.token")}
                                    onChange={(value) =>
                                       setValue("authorization.token", value)
                                    }
                                    error={errors?.authorization?.token?.message}
                                 />
                              ) : (
                                 <FieldView
                                    label={t(langKeys.token)}
                                    value={row?.authorization?.token || ""}
                                    className="col-12"
                                 />
                              )}
                           </div>
                        ) : null}
                     </div>
                     <div className={classes.containerDetail}>
                        <div
                           className="row-zyx"
                           style={{ alignItems: "flex-end" }}
                        >
                           <React.Fragment>
                              <FieldView
                                 label={t(langKeys.header)}
                                 className={classes.labelButton1}
                              />
                              {edit ? (
                                 <Button
                                    variant="outlined"
                                    type="button"
                                    color="primary"
                                    className={classes.labelButton2}
                                    startIcon={<AddIcon color="primary" />}
                                    onClick={() => onClickAddHeader()}
                                 >
                                    {t(langKeys.addheader)}
                                 </Button>
                              ) : null}
                           </React.Fragment>
                        </div>
                        {edit
                           ? headers?.map((field: any, i: number) => {
                                return (
                                   <div className="row-zyx" key={field.id}>
                                      <FieldEdit
                                         fregister={{
                                            ...register(
                                               `headers.${i}.key` as const,
                                               {
                                                  validate: (value: string) =>
                                                     value !== "" ||
                                                     (t(
                                                        langKeys.field_required
                                                     ) as string),
                                               }
                                            ),
                                         }}
                                         label={t(langKeys.key)}
                                         className={classes.fieldRow}
                                         valueDefault={field?.key || ""}
                                         onBlur={(value) =>
                                            onBlurHeader(i, "key", value)
                                         }
                                         error={errors?.headers?.[i]?.key?.message}
                                      />
                                      <FieldEdit
                                         fregister={{
                                            ...register(
                                               `headers.${i}.value` as const,
                                               {
                                                  validate: (value: string) =>
                                                     value !== "" ||
                                                     (t(
                                                        langKeys.field_required
                                                     ) as string),
                                               }
                                            ),
                                         }}
                                         label={t(langKeys.value)}
                                         className={classes.fieldRow}
                                         valueDefault={field?.value || ""}
                                         onBlur={(value) =>
                                            onBlurHeader(i, "value", value)
                                         }
                                         error={
                                            errors?.headers?.[i]?.value?.message
                                         }
                                      />
                                      <FieldEdit
                                         label={t(langKeys.description)}
                                         className={classes.fieldRow}
                                         valueDefault={field?.description || ""}
                                         onBlur={(value) =>
                                            onBlurHeader(i, "description", value)
                                         }
                                         error={
                                            errors?.headers?.[i]?.description
                                               ?.message
                                         }
                                      />
                                      <IconButton
                                         size="small"
                                         className={classes.fieldButton}
                                         onClick={() => onClickDeleteHeader(i)}
                                      >
                                         <DeleteIcon
                                            style={{
                                               color: "#000000",
                                            }}
                                         />
                                      </IconButton>
                                   </div>
                                );
                             })
                           : headers?.map((field: any, i: number) => {
                                return (
                                   <div className="row-zyx" key={field.id}>
                                      <FieldView
                                         label={t(langKeys.key)}
                                         value={field?.key || ""}
                                         className="col-12"
                                      />
                                      <FieldView
                                         label={t(langKeys.value)}
                                         value={field?.value || ""}
                                         className="col-12"
                                      />
                                   </div>
                                );
                             })}
                     </div>
                     <div className={classes.containerDetail}>
                        <div
                           className="row-zyx"
                           style={{ alignItems: "flex-end" }}
                        >
                           <React.Fragment>
                              <FieldView
                                 label={t(langKeys.urlParams)}
                                 className={classes.labelButton1}
                              />
                              {edit ? (
                                 <Button
                                    variant="outlined"
                                    type="button"
                                    color="primary"
                                    className={classes.labelButton2}
                                    startIcon={<AddIcon color="primary" />}
                                    onClick={() => onClickAddUrlParam()}
                                 >
                                    {t(langKeys.addUrlParam)}
                                 </Button>
                              ) : null}
                           </React.Fragment>
                        </div>
                        {/* {getValues("method") !== "GET" && (
                        )} */}
                        {edit
                           ? urlParams?.map((field, i) => {
                                return (
                                   <div className="row-zyx" key={field.id}>
                                      <FieldEdit
                                         fregister={{
                                            ...register(
                                               `url_params.${i}.key` as const,
                                               {
                                                  validate: (value: string) =>
                                                     value !== "" ||
                                                     (t(
                                                        langKeys.field_required
                                                     ) as string),
                                               }
                                            ),
                                         }}
                                         label={t(langKeys.key)}
                                         className={classes.fieldRow}
                                         valueDefault={field?.key || ""}
                                         //   onBlur={(value) =>
                                         //      onBlurUrlParam(i, "key", value)
                                         //   }
                                         onChange={(value) => {
                                            //   onChangeUrlParams(i, "key", value)
                                            setValue(`url_params.${i}.key`, value);
                                            updateUrl();
                                         }}
                                         error={
                                            errors?.url_params?.[i]?.key?.message
                                         }
                                      />
                                      <FieldEdit
                                         fregister={{
                                            ...register(
                                               `url_params.${i}.value` as const,
                                               {
                                                  validate: (value: string) =>
                                                     value !== "" ||
                                                     (t(
                                                        langKeys.field_required
                                                     ) as string),
                                               }
                                            ),
                                         }}
                                         label={t(langKeys.value)}
                                         className={classes.fieldRow}
                                         valueDefault={field?.value || ""}
                                         //   onBlur={(value) =>
                                         //      onBlurUrlParam(i, "value", value)
                                         //   }
                                         onChange={(value) => {
                                            //   onChangeUrlParams(i, "key", value)
                                            setValue(
                                               `url_params.${i}.value`,
                                               value
                                            );
                                            updateUrl();
                                         }}
                                         error={
                                            errors?.url_params?.[i]?.value?.message
                                         }
                                      />
                                      <FieldEdit
                                         label={t(langKeys.description)}
                                         fregister={{
                                            ...register(
                                               `url_params.${i}.description` as const
                                            ),
                                         }}
                                         className={classes.fieldRow}
                                         valueDefault={field?.description || ""}
                                         onChange={
                                            (value) => {
                                               setValue(
                                                  `url_params.${i}.description`,
                                                  value
                                               );
                                            }
                                            //   onBlurUrlParam(i, "description", value)
                                         }
                                         error={
                                            errors?.url_params?.[i]?.description
                                               ?.message
                                         }
                                      />
                                      <IconButton
                                         size="small"
                                         className={classes.fieldButton}
                                         onClick={() => onClickDeleteUrlParam(i)}
                                      >
                                         <DeleteIcon
                                            style={{
                                               color: "#000000",
                                            }}
                                         />
                                      </IconButton>
                                   </div>
                                );
                             })
                           : urlParams?.map((field: any, i: number) => {
                                return (
                                   <div className="row-zyx" key={field.id}>
                                      <FieldView
                                         label={t(langKeys.key)}
                                         value={field?.key || ""}
                                         className="col-12"
                                      />
                                      <FieldView
                                         label={t(langKeys.value)}
                                         value={field?.value || ""}
                                         className="col-12"
                                      />
                                   </div>
                                );
                             })}
                     </div>
   
                     {getValues("method") !== "GET" ? (
                        <div className={classes.containerDetail}>
                           <div className="row-zyx">
                              {edit ? (
                                 <React.Fragment>
                                    <FieldSelect
                                       fregister={{
                                          ...register(`bodytype`, {
                                             validate: (value: any) =>
                                                (value && value.length) ||
                                                t(langKeys.field_required),
                                          }),
                                       }}
                                       label={t(langKeys.bodytype)}
                                       className={`${classes.selectInput1} col-4`}
                                       valueDefault={getValues("bodytype")}
                                       onChange={onChangeBodyType}
                                       error={errors?.bodytype?.message}
                                       data={dictToArrayKV(dataBodyType)}
                                       optionDesc="value"
                                       optionValue="key"
                                    />
                                    <RadioGroudFieldEdit
                                       className={"col-4"}
                                       data={[
                                          { key: "Texto" },
                                          { key: "Formulario" },
                                       ]}
                                       label={"Tipo de contenido"}
                                       optionDesc={"key"}
                                       optionValue={"key"}
                                       value={contentType}
                                       onChange={onChangeContentType}
                                       row
                                    />
                                    {getValues("bodytype") !== "URLENCONDED" &&
                                    contentType === "Texto" ? (
                                       <Button
                                          variant="outlined"
                                          type="button"
                                          color="primary"
                                          className={classes.labelButton2}
                                          onClick={() => onClickBeautify()}
                                       >
                                          {t(langKeys.beautify)}
                                       </Button>
                                    ) : null}
                                    {getValues("bodytype") === "URLENCODED" ||
                                    contentType === "Formulario" ? (
                                       <Button
                                          variant="outlined"
                                          type="button"
                                          color="primary"
                                          className={`${classes.labelButton2} col-4`}
                                          startIcon={<AddIcon color="primary" />}
                                          onClick={() => onClickAddParameter()}
                                       >
                                          {t(langKeys.addparameter)}
                                       </Button>
                                    ) : null}
                                 </React.Fragment>
                              ) : (
                                 <FieldView
                                    label={t(langKeys.bodytype)}
                                    value={row ? row.bodytype || "" : ""}
                                    className="col-12"
                                 />
                              )}
                           </div>
                        </div>
                     ) : null}
   
                     {getValues("method") !== "GET" &&
                     getValues("bodytype") !== "URLENCODED" ? (
                        <div className="row-zyx">
                           {edit ? (
                              <FieldEditMulti
                                 fregister={{
                                    ...register(`body`, {
                                       validate: {
                                          value: (value: any) =>
                                             (value && value.length) ||
                                             t(langKeys.field_required),
                                          invalid: (value: any) =>
                                             validateJSON(value) ||
                                             t(langKeys.invalidjson),
                                       },
                                    }),
                                 }}
                                 label={t(langKeys.body)}
                                 className="col-12"
                                 valueDefault={getValues("body")}
                                 onChange={onChangeBody}
                                 onBlur={onBlurBody}
                                 error={errors?.body?.message}
                                 rows={8}
                              />
                           ) : (
                              <FieldView
                                 label={t(langKeys.body)}
                                 value={row ? row.body || "" : ""}
                                 className="col-12"
                              />
                           )}
                        </div>
                     ) : null}
                     {getValues("method") === "POST" &&
                     getValues("bodytype") === "URLENCODED" ? (
                        <div className={classes.containerDetail}>
                           <React.Fragment>
                              {edit
                                 ? parameters?.map((field: any, i: number) => {
                                      return (
                                         <div className="row-zyx" key={field.id}>
                                            <FieldEdit
                                               fregister={{
                                                  ...register(
                                                     `parameters.${i}.key` as const,
                                                     {
                                                        validate: (
                                                           value: string
                                                        ) =>
                                                           value !== "" ||
                                                           (t(
                                                              langKeys.field_required
                                                           ) as string),
                                                     }
                                                  ),
                                               }}
                                               label={t(langKeys.key)}
                                               className={classes.fieldRow}
                                               valueDefault={field?.key || ""}
                                               onBlur={(value) =>
                                                  onBlurParameter(i, "key", value)
                                               }
                                               error={
                                                  errors?.parameters?.[i]?.key
                                                     ?.message
                                               }
                                            />
                                            <FieldEdit
                                               fregister={{
                                                  ...register(
                                                     `parameters.${i}.value` as const,
                                                     {
                                                        validate: (
                                                           value: string
                                                        ) =>
                                                           value !== "" ||
                                                           (t(
                                                              langKeys.field_required
                                                           ) as string),
                                                     }
                                                  ),
                                               }}
                                               label={t(langKeys.value)}
                                               className={classes.fieldRow}
                                               valueDefault={field?.value || ""}
                                               onBlur={(value) =>
                                                  onBlurParameter(
                                                     i,
                                                     "value",
                                                     value
                                                  )
                                               }
                                               error={
                                                  errors?.parameters?.[i]?.value
                                                     ?.message
                                               }
                                            />
                                            <IconButton
                                               size="small"
                                               className={classes.fieldButton}
                                               onClick={() =>
                                                  onClickDeleteParameter(i)
                                               }
                                            >
                                               <DeleteIcon
                                                  style={{
                                                     color: "#000000",
                                                  }}
                                               />
                                            </IconButton>
                                         </div>
                                      );
                                   })
                                 : parameters?.map((field: any, i: number) => {
                                      return (
                                         <div className="row-zyx" key={field.id}>
                                            <FieldView
                                               label={t(langKeys.key)}
                                               value={field?.key || ""}
                                               className="col-12"
                                            />
                                            <FieldView
                                               label={t(langKeys.value)}
                                               value={field?.value || ""}
                                               className="col-12"
                                            />
                                         </div>
                                      );
                                   })}
                           </React.Fragment>
                        </div>
                     ) : null}
   
                     <div className={classes.containerDetail}>
                        <div
                           className="row-zyx"
                           style={{ alignItems: "flex-end" }}
                        >
                           <React.Fragment>
                              <FieldView
                                 label={t(langKeys.result)}
                                 className={classes.labelButton1}
                              />
                              {edit ? (
                                 <Button
                                    variant="outlined"
                                    type="button"
                                    color="primary"
                                    className={classes.labelButton2}
                                    startIcon={<AddIcon color="primary" />}
                                    onClick={() => onClickAddResult()}
                                 >
                                    {t(langKeys.addResponse)}
                                 </Button>
                              ) : null}
                           </React.Fragment>
                        </div>
   
                        {edit
                           ? results?.map((field, i) => {
                                return (
                                   <div className="row-zyx" key={field.id}>
                                      <FieldEdit
                                         fregister={{
                                            ...register(
                                               `results.${i}.variable` as const,
                                               {
                                                  validate: (value: string) =>
                                                     value !== "" ||
                                                     (t(
                                                        langKeys.field_required
                                                     ) as string),
                                               }
                                            ),
                                         }}
                                         label={t(langKeys.variable)}
                                         className={classes.fieldRow}
                                         valueDefault={field?.variable || ""}
                                         onBlur={(value) =>
                                            onBlurResult(i, "variable", value)
                                         }
                                         error={
                                            errors?.results?.[i]?.variable?.message
                                         }
                                      />
                                      <FieldEdit
                                         fregister={{
                                            ...register(
                                               `results.${i}.path` as const,
                                               {
                                                  validate: (value: string) => {
                                                     return (
                                                        value !== "" ||
                                                        (t(
                                                           langKeys.field_required
                                                        ) as string)
                                                     );
                                                  },
                                               }
                                            ),
                                         }}
                                         label={t(langKeys.path)}
                                         className={classes.fieldRow}
                                         valueDefault={field?.path || ""}
                                         onBlur={(value) =>
                                            onBlurResult(i, "path", value)
                                         }
                                         error={
                                            errors?.results?.[i]?.path?.message
                                         }
                                      />
                                      <FieldEdit
                                         label={t(langKeys.description)}
                                         className={classes.fieldRow}
                                         valueDefault={field?.description || ""}
                                         onBlur={(value) =>
                                            onBlurResult(i, "description", value)
                                         }
                                         error={
                                            errors?.headers?.[i]?.description
                                               ?.message
                                         }
                                      />
                                      <IconButton
                                         size="small"
                                         className={classes.fieldButton}
                                         onClick={() => onClickDeleteResult(i)}
                                      >
                                         <DeleteIcon
                                            style={{
                                               color: "#000000",
                                            }}
                                         />
                                      </IconButton>
                                   </div>
                                );
                             })
                           : results?.map((field, i) => {
                                return (
                                   <div className="row-zyx" key={field.id}>
                                      <FieldView
                                         label={t(langKeys.variable)}
                                         value={field?.variable || ""}
                                         className="col-12"
                                      />
                                      <FieldView
                                         label={t(langKeys.path)}
                                         value={field?.path || ""}
                                         className="col-12"
                                      />
                                      <FieldView
                                         label={t(langKeys.description)}
                                         value={field?.description || ""}
                                         className="col-12"
                                      />
                                   </div>
                                );
                             })}
                     </div>
                  </React.Fragment>
               ) : null}
   
                  {getValues("type") === "DATA_TABLE" ? (
                     <React.Fragment>
   
                        <div className={classes.containerDetail}>
                           <div className="row-zyx">
                              {edit && getValues("isnew") ? (
                                 <FieldEdit
                                    label={t(langKeys.apikey)}
                                    className="col-12"
                                    valueDefault={getValues("apikey")}
                                    disabled={true}
                                    error={errors?.apikey?.message}
                                 />
                              ) : (
                                 <FieldView
                                    label={t(langKeys.apikey)}
                                    value={row?.apikey || ""}
                                    className="col-12"
                                 />
                              )}
                              
                           </div>
                           <div className="row-zyx">
                              {edit && getValues("isnew") ? (
                                 <>
                                 <FieldSelect
                                    uset={true}
                                    fregister={{
                                       ...register(`level`, {
                                          validate: (value: any) =>
                                             (value && value.length) ||
                                             t(langKeys.field_required),
                                       }),
                                    }}
                                    label={t(langKeys.level)}
                                    className="col-4"
                                    valueDefault={getValues("level")}
                                    onChange={onChangeLevel}
                                    error={errors?.level?.message}
                                    data={dictToArrayKV(dataLevel)}
                                    optionDesc="value"
                                    optionValue="key"
                                 />
                                 
                                    
                                       {/* Acá deberían ir los FieldEdit */}
                                        {
                                          headFields?.map((field, i: number) => {
                                             return (
                                                <div className="col-4">
                                                <FieldEdit
                                                   fregister={{
                                                      ...register(`fields.${i}.name`, {
                                                         validate: {
                                                            value: (value: any) =>
                                                               (value && value.length) ||
                                                               t(langKeys.field_required),
                                                            duplicate: (value: any) =>
                                                               validateDuplicateFieldName(
                                                                  field,
                                                                  value
                                                               ) ||
                                                               t(langKeys.field_duplicate),
                                                            startwithchar: (value: any) =>
                                                               validateStartwithcharFieldName(
                                                                  value
                                                               ) ||
                                                               t(
                                                                  langKeys.field_startwithchar
                                                               ),
                                                            basiclatin: (value: any) =>
                                                               validateBasicLatinFieldName(
                                                                  value
                                                               ) ||
                                                               t(
                                                                  langKeys.field_basiclatinlowercase
                                                               ),
                                                         },
                                                      }),
                                                   }}
                                                   label={t(langKeys.levelName)}
                                                   className={classes.fieldRow}
                                                   valueDefault={field?.name || ""}
                                                   disabled={disableKeys(field, i)}
                                                   onBlur={(value) =>
                                                      onBlurField(i, "name", value)
                                                   }
                                                   error={errors?.fields?.[i]?.name?.message}
                                                />
                                                </div>
                                             )
                                          })
                                        }
                                 
                                 </>
                              ) : (
                                 <>
                                    <FieldView
                                       label={t(langKeys.level)}
                                       value={t(dataLevel[row?.level]) || ""}
                                       className="col-4"
                                    />
                                    {
                                          headFields?.map((field, i: number) => {
                                             return (
                                                <div className="col-4">
                                                <FieldEdit
                                                   fregister={{
                                                      ...register(`fields.${i}.name`, {
                                                         validate: {
                                                            value: (value: any) =>
                                                               (value && value.length) ||
                                                               t(langKeys.field_required),
                                                            duplicate: (value: any) =>
                                                               validateDuplicateFieldName(
                                                                  field,
                                                                  value
                                                               ) ||
                                                               t(langKeys.field_duplicate),
                                                            startwithchar: (value: any) =>
                                                               validateStartwithcharFieldName(
                                                                  value
                                                               ) ||
                                                               t(
                                                                  langKeys.field_startwithchar
                                                               ),
                                                            basiclatin: (value: any) =>
                                                               validateBasicLatinFieldName(
                                                                  value
                                                               ) ||
                                                               t(
                                                                  langKeys.field_basiclatinlowercase
                                                               ),
                                                         },
                                                      }),
                                                   }}
                                                   label={t(langKeys.levelName)}
                                                   className={classes.fieldRow}
                                                   valueDefault={field?.name || ""}
                                                   disabled={disableKeys(field, i)}
                                                   onBlur={(value) =>
                                                      onBlurField(i, "name", value)
                                                   }
                                                   error={errors?.fields?.[i]?.name?.message}
                                                />
                                                </div>
                                             )
                                          })
                                        }
         
                                 </>
                              )}
                           </div>
                        </div>
                        <div className={classes.containerDetail}>
                           <div
                              className="row-zyx"
                              style={{ alignItems: "flex-end" }}
                           >
                              {edit ? (
                                 <React.Fragment>
                                    <FieldView
                                       label={t(langKeys.tablelayout)}
                                       className={classes.labelButton1}
                                    />
                                 </React.Fragment>
                              ) : (
                                 <FieldView
                                    label={t(langKeys.tablelayout)}
                                    className="col-12"
                                 />
                              )}
                           </div>
                           {edit
                              ? tailFields?.map((field, i: number) => {
                                 const index = i + (levelFields[getValues("level")] === 'corpid' ? 1 : 2);
                                 return (
                                    <div className="row-zyx" key={field.id} style={{gap: 32}}>
                                       <FieldEdit
                                          fregister={{
                                             ...register(`fields.${index}.name`, {
                                                validate: {
                                                   value: (value: any) =>
                                                      (value && value.length) ||
                                                      t(langKeys.field_required),
                                                   duplicate: (value: any) =>
                                                      validateDuplicateFieldName(
                                                         field,
                                                         value
                                                      ) ||
                                                      t(langKeys.field_duplicate),
                                                   startwithchar: (value: any) =>
                                                      validateStartwithcharFieldName(
                                                         value
                                                      ) ||
                                                      t(
                                                         langKeys.field_startwithchar
                                                      ),
                                                   basiclatin: (value: any) =>
                                                      validateBasicLatinFieldName(
                                                         value
                                                      ) ||
                                                      t(
                                                         langKeys.field_basiclatinlowercase
                                                      ),
                                                },
                                             }),
                                          }}
                                          label={t(langKeys.columntitle)}
                                          className={classes.fieldRow}
                                          valueDefault={field?.name || ""}
                                          disabled={disableKeys(field, i)}
                                          onBlur={(value) =>
                                             onBlurField(index, "name", value)
                                          }
                                          error={errors?.fields?.[index]?.name?.message}
                                       />
                                       {getValues("isnew") ? (
                                          <FieldCheckbox
                                             label={index===0?t(langKeys.key): ""}
                                             className={`${classes.checkboxRow}`}
                                             valueDefault={field?.key}
                                             disabled={disableKeys(field, index)}
                                             onChange={(value) =>
                                                onBlurField(index, "key", value)
                                             }
                                             error={
                                                errors?.fields?.[index]?.key?.message
                                             }
                                          />
                                       ) : null}
                                       {!disableKeys(field, index) ? (
                                          <IconButton
                                             size="small"
                                             className={classes.fieldButton}
                                             onClick={() => onClickDeleteField(index)}
                                             style={{width: "30px"}}
                                          >
                                             <DeleteIcon
                                                style={{
                                                   color: "#000000",
                                                }}
                                             />
                                          </IconButton>
                                       ) : <div style={{width: "30px"}}></div>}
                                    </div>
                                 );
                              })
                              : tailFields?.map((fields:any, i: number) => {
                                 return (
                                    <div className="row-zyx" key={fields.id}>
                                       <FieldView
                                          label={t(langKeys.name)}
                                          value={fields?.name || ""}
                                          className="col-12"
                                       />
                                       <FieldView
                                          label={t(langKeys.order)}
                                          value={fields?.order || ""}
                                          className="col-12"
                                       />
                                    </div>
                                 );
                              })
                           }
                              <div
                                 className="row-zyx"
                                 style={{ alignItems: "flex-end", gap: '1rem' }}
                              >
                                    <React.Fragment>
                                       <Button
                                             variant="outlined"
                                             type="button"
                                             color="primary"
                                             className={classes.labelButton2}
                                             startIcon={<AddIcon color="primary" />}
                                             onClick={() => onClickAddField()}
                                          >
                                             {t(langKeys.addfield)}
                                       </Button>
   
                                    { isnew && (
                                       <div style={{ width: 'auto' }}>
                                          <input
                                             accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                                             id="uploadfiledetail"
                                             type="file"
                                             style={{ display: "none" }}
                                             onChange={(e) => handleExcelImport(e.target.files)}
                                             onClick={(event) => {
                                                event.target.value = null;
                                             }
                                          }
                                          />
                                          <label htmlFor="uploadfiledetail">
                                             <Button
                                                variant="outlined"
                                                className={classes.labelButton2}
                                                component="span"
                                                color="primary"
                                                startIcon={<ExcelFileIcon fill="green" stroke="7721AD" width={25} height={25}/>}
                                             >
                                                {t(langKeys.import)}
                                             </Button>
                                          </label>
                                       </div>
                                    )}

                                    { isnew && !dataSourceConfig?.credentials && (
                                       <GoogleOAuthProvider clientId={`${apiUrls.GOOGLECLIENTID_CHANNEL}`}>
                                          <GoogleLogIn
                                             label="Conectar Google Drive"
                                             scope="https://www.googleapis.com/auth/drive.readonly"
                                             googleDispatch={(e) => {
                                                   dispatch(exchangeCode({ googlecode: e.code }));
                                                   setWaitGoogleTokenExchange(true)
                                             }}
                                             data={{id: row?.id, data_code: row?.description }}
                                          />
                                       </GoogleOAuthProvider>
                                    )}

                                    { isnew && dataSourceConfig?.credentials && dataSourceConfig?.credentials.access_token && (
                                       <Button
                                          variant="outlined"
                                          type="button"
                                          color="primary"
                                          className={classes.labelButton2}
                                          startIcon={<GoogleDriveIcon fill="#7721AD" stroke="#7721AD" width={25} height={25} />}
                                          onClick={() => handleOpenPicker(String(dataSourceConfig?.credentials?.access_token))}
                                       >
                                          {'GoogleDrive'}
                                       </Button>
                                    )}
                                 </React.Fragment>
                              </div>
                              
                              <div
                                 className="row-zyx"
                                 style={{ alignItems: "flex-end" }}
                              >
                              {!getValues("isnew") &&
                                 <React.Fragment>
                                    <div style={{gap: 8}}>
                                       <Button
                                          variant="outlined"
                                          type="button"
                                          color="primary"
                                          style={{width: 155, marginRight: 8}}
                                          className={classes.labelButton2}
                                          startIcon={<GetAppIcon color="primary" />}
                                          onClick={() => onClickInfo()}
                                       >
                                          JSON
                                       </Button>
                                       <Button
                                          variant="contained"
                                          type="button"
                                          color="primary"
                                          startIcon={<ListAltIcon color="secondary" />}
                                          style={{ width: 155,backgroundColor: "#7721AD" }}
                                          onClick={handleViewTable}
                                       >
                                          {t(langKeys.view_table)}
                                       </Button>
                                    </div>
                                 </React.Fragment>
                              }
                           </div>
                        </div>
                     </React.Fragment>
                  ) : null}
               
            </form>
            {getValues("type") === "CODE_PERSON" && <div className={classes.containerClaro}>
               <div className={classes.containerDetailClaro}>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                     <FieldView
                        label={t(langKeys.code_table)}
                        tooltip={t(langKeys.codes_table_helper)}
                        className="col-6"
                     />                  
                     {!getValues("isnew") ? (
                        <Button
                           variant="contained"
                           type="button"
                           color="primary"
                           disabled={codeParams.length>=10}
                           className={classes.labelButton2}
                           onClick={() => {setView("code_table")}}
                        >
                           {t(langKeys.view_table)}
                        </Button>
                     ) : null}
                  </div>
                  <FieldEdit
                     valueDefault={"Codigo"}
                     className="col-12"
                     disabled
                  />  
                  <div className={classes.switchContainer}>
                     <div className={classes.switchStyle}>
                        <IOSSwitch checked={codeExpiration} onChange={()=>{
                           setCodeExpiration(!codeExpiration)
                        }} name="codeExpiration" />
                     </div>
                     <FieldView
                        label={t(langKeys.add_expiration_date_to_code)}
                        tooltip={t(langKeys.codes_table_helper)}
                     />
                  </div>   
                  {codeExpiration &&
                     <FieldEdit
                        valueDefault={t(langKeys.expiration_date)}
                        className="col-12"
                        disabled
                     />  
                  }   
                  <div className={classes.addField}>
                     {edit ? (
                        <Button
                           variant="outlined"
                           type="button"
                           color="primary"
                           disabled={codeParams.length>=10}
                           className={classes.labelButton2}
                           startIcon={<AddIcon color="primary" />}
                           onClick={() => {codeParamsAppend({ key: "" });
                        }}
                        >
                           {t(langKeys.addUrlParam)}
                        </Button>
                     ) : null}
                  </div> 
                  {codeParams.map((x:Dictionary,i:number)=>{
                     return <div className="row-zyx" key={"extraparamscode" + i}>
                        <FieldEdit
                           fregister={{
                              ...register(
                                 `code_params.${i}.key` as const,
                                 {
                                    validate: (value: string) =>
                                       value !== "" ||
                                       (t(
                                          langKeys.field_required
                                       ) as string),
                                 }
                              ),
                           }}
                           label={t(langKeys.columntitle)}
                           className={classes.fieldRow}
                           valueDefault={x?.key || ""}
                           onChange={(value) => {
                              setValue(`code_params.${i}.key`, value);
                           }}
                           error={
                              errors?.code_params?.[i]?.key?.message
                           }
                        />
                        <IconButton
                           size="small"
                           className={classes.fieldButton}
                           onClick={() => {
                              let value = getValues(`code_params.${i}.key`);
                              if (value!=="Codigo" && value!=="Fecha de caducidad" && value!==""){
                                 let found = false
                                 let person_params_tracking = getValues("person_params_tracking")                           
                                 for (let objeto of person_params_tracking) {
                                    if (objeto.key === value) {
                                       found = true
                                       objeto.key = "";
                                    }
                                 }
                                 if(found) setValue("person_params_tracking", person_params_tracking)
                              }
                              codeParamsRemove(i)
                           }}
                        >
                           <DeleteIcon
                              style={{
                                 color: "#000000",
                              }}
                           />
                        </IconButton>
                     </div>
                  })}    
                    
                  <div className={classes.addFieldTracking}>
                     <FieldView
                        label={t(langKeys.tracking_fields)}
                        tooltip={t(langKeys.tracking_fields_helper)}
                     />
                     {edit ? (
                        <Button
                           variant="outlined"
                           type="button"
                           color="primary"
                           disabled={codeTrackingParams.length>=10}
                           className={classes.labelButton2}
                           startIcon={<AddIcon color="primary" />}
                           onClick={() => {codeTrackingParamsAppend({ key: codeTrackingParams.length?"":"Persona" });}}
                        >
                           {t(langKeys.addUrlParam)}
                        </Button>
                     ) : null}
                  </div> 
                  {codeTrackingParams.map((x:Dictionary,i:number)=>{
                     return <div className="row-zyx" key={"extraparamscode" + i}>
                        <FieldSelect
                           fregister={{
                              ...register(
                                 `code_params_tracking.${i}.key` as const,
                                 {
                                    validate: (value: string) =>
                                       value !== "" ||
                                       (t(
                                          langKeys.field_required
                                       ) as string),
                                 }
                              ),
                           }}
                           disabled={!i}
                           data={[
                             { key: "Persona" },
                             ...getValues('person_params')
                           ]}
                           optionValue="key"
                           optionDesc="key"
                           label={t(langKeys.columntitle)}
                           className={classes.fieldRow}
                           valueDefault={getValues(`code_params_tracking.${i}.key`)}
                           onChange={(value) => {
                              setValue(`code_params_tracking.${i}.key`, value?.key||"");
                           }}
                           error={
                              errors?.code_params_tracking?.[i]?.key?.message
                           }
                        />
                        {Boolean(i) && <IconButton
                           size="small"
                           className={classes.fieldButton}
                           onClick={() => {codeTrackingParamsRemove(i)}}
                        >
                           <DeleteIcon
                              style={{
                                 color: "#000000",
                              }}
                           />
                        </IconButton>}
                     </div>
                  })}   
               </div>
               <div className={classes.containerDetailClaro}>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                     <FieldView
                        label={t(langKeys.person_table)}
                        tooltip={t(langKeys.people_table_helper)}
                        className="col-6"
                     />
                     {!getValues("isnew") ? (
                        <Button
                           variant="contained"
                           type="button"
                           color="primary"
                           disabled={codeParams.length>=10}
                           className={classes.labelButton2}
                           onClick={() => {setView("person_table")}}
                        >
                           {t(langKeys.view_table)}
                        </Button>
                     ) : null}
                  </div>
                  <FieldEdit
                     valueDefault={"Persona"}
                     className="col-12"
                     disabled
                  />  
                  <div className={classes.switchContainer}>
                     <div className={classes.switchStyle}>
                        <IOSSwitch checked={personExpiration} onChange={()=>{
                           setPersonExpiration(!personExpiration)
                        }} name="personExpiration" />
                     </div>
                     <FieldView
                        label={t(langKeys.add_expiration_date_to_person)}
                        tooltip={t(langKeys.add_expiration_date_to_person_helper)}
                     />
                  </div>    
                  {personExpiration &&
                     <FieldEdit
                        valueDefault={t(langKeys.expiration_date)}
                        className="col-12"
                        disabled
                     />  
                  }   
                  <div className={classes.addField}>
                     {edit ? (
                        <Button
                           variant="outlined"
                           type="button"
                           color="primary"
                           disabled={personParams.length>=10}
                           className={classes.labelButton2}
                           startIcon={<AddIcon color="primary" />}
                           onClick={() => {personParamsAppend({ key: "" });}}
                        >
                           {t(langKeys.addUrlParam)}
                        </Button>
                     ) : null}
                  </div> 
                  {personParams.map((x:Dictionary,i:number)=>{
                     return <div className="row-zyx" key={"extraparamsperson" + i}>
                        <FieldEdit
                           fregister={{
                              ...register(
                                 `person_params.${i}.key` as const,
                                 {
                                    validate: (value: string) =>
                                       value !== "" ||
                                       (t(
                                          langKeys.field_required
                                       ) as string),
                                 }
                              ),
                           }}
                           label={t(langKeys.columntitle)}
                           className={classes.fieldRow}
                           valueDefault={x?.key || ""}
                           onChange={(value) => {
                              setValue(`person_params.${i}.key`, value);
                           }}
                           error={
                              errors?.person_params?.[i]?.key?.message
                           }
                        />
                        <IconButton
                           size="small"
                           className={classes.fieldButton}
                           onClick={() => {
                              let value = getValues(`person_params.${i}.key`);
                              if (value!=="Persona" && value!=="Fecha de caducidad" && value!==""){
                                 let found = false
                                 let code_params_tracking = getValues("code_params_tracking")                           
                                 for (let objeto of code_params_tracking) {
                                    if (objeto.key === value) {
                                       found = true
                                       objeto.key = "";
                                    }
                                 }
                                 if(found) setValue("code_params_tracking", code_params_tracking)
                              }
                              personParamsRemove(i)
                           }}
                        >
                           <DeleteIcon
                              style={{
                                 color: "#000000",
                              }}
                           />
                        </IconButton>
                     </div>
                  })}    
                    
                  <div className={classes.addFieldTracking}>
                     <FieldView
                        label={t(langKeys.tracking_fields)}
                        tooltip={t(langKeys.tracking_fields_helper)}
                     />
                     {edit ? (
                        <Button
                           variant="outlined"
                           type="button"
                           color="primary"
                           disabled={personTrackingParams.length>=10}
                           className={classes.labelButton2}
                           startIcon={<AddIcon color="primary" />}
                           onClick={() => {personTrackingParamsAppend({ key: personTrackingParams.length?"":"Codigo" });}}
                        >
                           {t(langKeys.addUrlParam)}
                        </Button>
                     ) : null}
                  </div> 
                  {personTrackingParams.map((x:Dictionary,i:number)=>{
                     return <div className="row-zyx" key={"extraparamsperson" + i}>
                        <FieldSelect
                           fregister={{
                              ...register(
                                 `person_params_tracking.${i}.key` as const,
                                 {
                                    validate: (value: string) =>
                                       value !== "" ||
                                       (t(
                                          langKeys.field_required
                                       ) as string),
                                 }
                              ),
                           }}
                           data={[
                             { key: "Codigo" },
                             ...getValues('code_params')
                           ]}
                           optionValue="key"
                           optionDesc="key"
                           disabled={!i}
                           label={t(langKeys.columntitle)}
                           className={classes.fieldRow}
                           valueDefault={getValues(`person_params_tracking.${i}.key`)}
                           onChange={(value) => {
                              setValue(`person_params_tracking.${i}.key`, value?.key||"");
                           }}
                           error={
                              errors?.person_params_tracking?.[i]?.key?.message
                           }
                        />
                        {Boolean(i) && <IconButton
                           size="small"
                           className={classes.fieldButton}
                           onClick={() => {personTrackingParamsRemove(i)}}
                        >
                           <DeleteIcon
                              style={{
                                 color: "#000000",
                              }}
                           />
                        </IconButton>}
                     </div>
                  })}   
               </div>
            </div>}
            {openResponseModal && (
               <ModalIntegrationManager
                  data={responseData}
                  openModal={openResponseModal}
                  setOpenModal={setOpenResponseModal}
                  cleanModalData={cleanRequestData}
                  setResponseData={setResponseData}
                  setValue={setValue}
               />
            )}
            {openTestModal && (
               <ModalTestIntegrationManager
                  formData={getValues()}
                  openModal={openTestModal}
                  setOpenModal={setOpenTestModal}
                  setOpenResponseModal={setOpenResponseModal}
                  setResponseData={setResponseData}
               />
            )}
            {openViewTableModal && (
               <ModalViewTable
                  openModal={openViewTableModal}
                  setOpenModal={setOpenViewTableModal}
                  columns={columnData}
                  data={tableData}
                  formId={getValues("id")}
                  importDataFunction={handleUpload}
                  deleteDataFunction={onDeleteData} 
                  waitImport={waitImport}
                  row={row}
            />
            )}
         </div>
      );
      
   }else{
      return (<VinculationTable
            title={view}
            row={row}
            setViewSelected={setView}
         />)
   }
};

interface ModalProps {
   data: any;
   openModal: boolean;
   setOpenModal: (open: boolean) => void;
   cleanModalData: () => void;
   setResponseData: (data: any) => void;
   setValue: UseFormSetValue<FormFields>;
}

const ModalIntegrationManager: React.FC<ModalProps> = ({
   data,
   openModal,
   setOpenModal,
   cleanModalData,
   setResponseData,
   setValue,
}) => {
   const { t } = useTranslation();
   const [selectedKeys, setSelectedKeys] = useState<
      { variable: string; path: string }[]
   >([]);
   useEffect(() => {
      return () => {
         setResponseData({});
         setSelectedKeys([]);
      };
   }, []);
   const handleKeySelection = (
      key: string,
      variable: string,
      checked: boolean
   ) => {
      if (checked) {
         setSelectedKeys((prev) => [...prev, { variable, path: key }]);
      } else {
         setSelectedKeys((prev) => prev.filter((k) => k.path !== key));
      }
   };

   const getHtml: any = (data: any, param: string, path: string) => {
      if (Array.isArray(data)) {
         return (
            <div
               style={{
                  paddingLeft: "20px",
               }}
            >
               <input
                  type="checkbox"
                  name=""
                  id=""
                  onChange={(e) =>
                     handleKeySelection(path, param, e.target.checked)
                  }
               />
               "{path}":
               <div>{"["}</div>
               <div
                  style={{
                     paddingLeft: "20px",
                  }}
               >
                  {data.map((item: any, index: any) => {
                     return getHtml(
                        item,
                        `${param}[${index}]`,
                        path + `[${index}]`
                     );
                  })}
               </div>
               <div>{"]"}</div>
            </div>
         );
      } else if (data !== null && typeof data === "object") {
         return (
            <div
               style={{
                  paddingLeft: "50px",
               }}
            >
               {/* <input type="checkbox" name="" id="" /> */}
               <input
                  type="checkbox"
                  name=""
                  id=""
                  onChange={(e) =>
                     handleKeySelection(path, param, e.target.checked)
                  }
               />
               "{param}":
               <div>{"{"}</div>
               <div style={{ paddingLeft: "20px" }}>
                  {Object.keys(data).map((key) => {
                     return getHtml(data[key], key, path + "." + key);
                  })}
               </div>
               <div>{"}"}</div>
            </div>
         );
      } else {
         return (
            <div style={{ display: "flex" }} key={param}>
               <input
                  type="checkbox"
                  onChange={(e) =>
                     handleKeySelection(path, param, e.target.checked)
                  }
               />
               <div>
                  "{param}": {String(data)}
               </div>
            </div>
         );
      }
   };

   return (
      <DialogZyx
         open={openModal}
         title={t(langKeys.result)}
         handleClickButton1={() => {
            setValue("results", selectedKeys);
            setOpenModal(false);
         }}
         handleClickButton2={() => {
            // cleanModalData();
            setOpenModal(false);
         }}
         buttonText1={t(langKeys.getVariables)}
         buttonText2={t(langKeys.cancel)}
         // buttonStyle1={{
         //    backgroundColor: "#7721ad",
         //    color: "#fff",
         // }}
         buttonStyle2={{
            color: "black",
         }}
         button2Type="button"
         button1Props={{
            variant: "contained",
            color: "primary",
            disabled: selectedKeys.length === 0,
         }}
      >
         <div className="row-zyx">
            {Object.keys(data.data || {}).map((param) => {
               return <>{getHtml(data.data[param], param, param)}</>;
            })}
         </div>
      </DialogZyx>
   );
};

type ModalTestIntegrationManagerProps = {
   openModal: boolean;
   setOpenModal: (open: boolean) => void;
   setResponseData: (data: any) => void;
   setOpenResponseModal: (open: boolean) => void;
   formData: FormFields;
};

const ModalTestIntegrationManager: React.FC<
   ModalTestIntegrationManagerProps
> = ({
   openModal,
   setOpenModal,
   formData,
   setOpenResponseModal,
   setResponseData,
}) => {
   const { t } = useTranslation();
   const classes = useStyles();
   const dispatch = useDispatch();
   const [missingParams, setMissingParams] = useState<any[]>([]);
   const [paramsCompleted, setParamsCompleted] = useState<boolean>(false);
   const [replacedURL, setReplacedURL] = useState("");
   const resultRequest = useSelector((state) => state.main.testRequest);
   const [reqTrigger, setReqTrigger] = useState(false);

   useEffect(() => {
      if (openModal) {
         const cleanedParams = cleanParams(formData?.url);
         const { hasMissingParams, missingParams } = compareParams(
            formData?.url_params,
            cleanedParams
         );

         const missinParamsObject = missingParams.reduce(
            (acc: any, curr: any) => {
               return [...acc, { key: curr, value: "" }];
            },
            []
         );
         if (hasMissingParams) {
            setParamsCompleted(false);
            setMissingParams(missinParamsObject);
         } else {
            setParamsCompleted(true);
         }
      }
      return () => {
         setMissingParams([]);
         setParamsCompleted(false);
         // setResponseData({});
      };
   }, [openModal, formData.url, formData.url_params]);

   useEffect(() => {
      if (!resultRequest.loading && !resultRequest.error && reqTrigger) {
         setResponseData({ data: resultRequest.data });
         setOpenModal(false);
         setOpenResponseModal(true);
      }
   }, [resultRequest, reqTrigger]);

   useEffect(() => {
      if (formData.url && formData.url_params) {
         const newReplacedURL = replaceParams(
            formData.url_params,
            formData.url
         );
         setReplacedURL(newReplacedURL);
      }
   }, [formData.url, formData.url_params]);

   const handleChangeParams = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
      key: string
   ) => {
      setMissingParams((prev) => {
         return prev.map((param) => {
            if (param.key === key) {
               return { ...param, value: e.target.value };
            }
            return param;
         });
      });
   };

   const handleUpdateMissingParams = () => {
      let newURL = replacedURL;
      missingParams.forEach((param) => {
         const { key, value } = param;
         newURL = newURL.replace(`{{${key}}}`, value);
      });
      setReplacedURL(newURL);

      setParamsCompleted(true);
   };

   const cleanParams = (url: string) => {
      const urlParams = url.match(/({{)(.*?)(}})/g) || [];
      const paramsCleaned = urlParams.map((x: string) =>
         x.substring(x.indexOf("{{") + 2, x.indexOf("}}"))
      );
      return paramsCleaned;
   };
   const compareParams = (urlParams: Dictionary[], params: string[]) => {
      const urlParamsCleaned = urlParams?.reduce(
         (acc: any, x: any) => [...acc, "...-1-1-11"],
         []
      );
      const missingParams = params.filter(
         (x) => !urlParamsCleaned?.includes(x)
      );
      const hasMissingParams = params.some(
         (x) => !urlParamsCleaned?.includes(x)
      );

      return { hasMissingParams, missingParams };
   };

   const replaceParams = (urlParams: any, url: string) => {
      let replacedVariables = urlParams.reduce((acc: any, x: any) => {
         return acc.replace(`{{${x.key}}}`, `${x.value}`);
      }, url);
      return replacedVariables;
   };

   const testAPI = async (form: FormFields) => {
      // 
      const cleanedParams = cleanParams(formData?.url);

      const { hasMissingParams } = compareParams(
         formData?.url_params,
         cleanedParams
      );
      if (hasMissingParams) {
      }

      dispatch(
         triggerRequest({
            url: replacedURL,
            method: form.method,
            authorization: [
               {
                  ...form.authorization,
                  type:
                     form.authorization.type === "BEARER"
                        ? "bearertoken"
                        : "basicauth",
               },
            ],
            headers: form.headers,
            postformat: form.bodytype,
            body:
               form.body === "" && form.bodytype === "JSON" ? "{}" : form.body,
            parameters: form.parameters,
         })
      );
      setReqTrigger(true);
   };
   return (
      <DialogZyx
         open={openModal}
         title={t(langKeys.preview)}
         buttonText2={t(langKeys.back)}
         handleClickButton1={() => {
            if (paramsCompleted) {
               testAPI(formData);
            }
            handleUpdateMissingParams();
         }}
         handleClickButton2={() => {
            setOpenModal(false);
         }}
         buttonText1={
            paramsCompleted ? t(langKeys.getData) : t(langKeys.continue)
         }
         button2Type="button"
      >
         {paramsCompleted ? (
            <>
               <div className="row-zyx">
                  <React.Fragment>
                     <FieldSelect
                        label={t(langKeys.requesttype)}
                        className={classes.selectInput1}
                        valueDefault={formData.method}
                        disabled
                        // onChange={onChangeMethod}
                        // error={errors?.method?.message}
                        data={dictToArrayKV(dataMethodType)}
                        optionDesc="value"
                        optionValue="key"
                     />
                     <FieldEdit
                        label={t(langKeys.url)}
                        className={classes.selectInput2}
                        valueDefault={replacedURL}
                        // onChange={(value) => setValue("url", value)}
                        // error={errors?.url?.message}
                        disabled
                     />
                  </React.Fragment>
               </div>
               {/* <div>
                  <div className="row-zyx">
                     <Button
                        variant="outlined"
                        type="button"
                        color="primary"
                        className={classes.labelButton2}
                        onClick={() => testAPI(formData)}
                     >
                        {t(langKeys.getData)}
                     </Button>
                     <Button
                        variant="outlined"
                        type="button"
                        color="primary"
                        className={classes.labelButton2}
                        onClick={() => setOpenModal(false)}
                     >
                        {t(langKeys.cancel)}
                     </Button>
                  </div>
               </div> */}
            </>
         ) : (
            <>
               <div>
                  <h3>
                     Por favor, especifique los valores para las parámetros
                     faltantes:
                  </h3>
               </div>

               <div className="zyx-row">
                  {missingParams.map((param, index) => (
                     <div className="col-6">
                        <TextField
                           key={index}
                           label={param.key}
                           placeholder={`Valor para ${param.key}`}
                           value={param.value}
                           // Aquí puedes agregar una función para actualizar los valores de los parámetros faltantes en tiempo real
                           onChange={(e) => handleChangeParams(e, param.key)}
                        />
                     </div>
                  ))}
               </div>
               {/* <div>
                  <Button
                     variant="outlined"
                     type="button"
                     color="primary"
                     onClick={() => handleUpdateMissingParams()}
                     // disabled={param.value === ""}
                  >
                     {t("Continuar")}
                  </Button>
                  <Button
                     variant="outlined"
                     type="button"
                     color="primary"
                     onClick={() => setOpenModal(false)}
                  >
                     {t(langKeys.cancel)}
                  </Button>
               </div> */}
            </>
         )}
      </DialogZyx>
   );
};

interface ViewTableModalProps {
   openModal: boolean;
   setOpenModal: (value: boolean) => any;
   columns: Dictionary[];
   data: Dictionary[];
   formId: number;
   importDataFunction: (files: any) => Promise<void>
   deleteDataFunction: ()=> void;
   waitImport: boolean;
   row?: Dictionary | null;
}

interface ILangKeys {
   [key: string]: string;
}

const ModalViewTable: React.FC<ViewTableModalProps> = ({
   openModal,
   setOpenModal,
   columns = [],
   data = [],
   formId,
   importDataFunction,
   deleteDataFunction,
   waitImport,
   row
}) => {
   const { t } = useTranslation();
   const dispatch = useDispatch();
   const handleCancelModal = () => {
      setOpenModal(false);
   };
   const mainAuxRes = useSelector((state) => state.main.mainAux);
   const executeRes = useSelector((state) => state.main.execute);
   

   useEffect(() => {
      if(data.length < 0){
         
      }
      return () => {
         dispatch(resetMainAux());
      };
   }, []);

   useEffect(() => {
      if(waitImport){
         if (!executeRes.loading && !executeRes.error) {
            dispatch(getCollectionAux(getdataIntegrationManager(formId)));
         }
      }
      // if (data.length > 0) {
      // }
      return () => {
         dispatch(resetMainAux());
      }
   }, [waitImport, executeRes]);

   const tableData = useMemo(() => {
      if (mainAuxRes.data.length === 0 || mainAuxRes.data[0]?.data === null) {
        return [];
      }
      return mainAuxRes.data[0]?.data ?? [];
    }, [mainAuxRes.data]);
    
    const columnsData = useMemo(() => {
      if (mainAuxRes.data.length === 0 || mainAuxRes.data[0]?.data === null || mainAuxRes.data[0]?.data.length === 0) {
        return [];
      }
      return Object.keys(mainAuxRes.data[0]?.data[0]).map((c) => ({
        Header: c,
        accessor: c,
      }));
    }, [mainAuxRes.data]);
    

  
 

   return (
      <DialogZyx
         title=""
         open={openModal}
         maxWidth="lg"
         button1Type="button"
         buttonText1={t(langKeys.close)}
         handleClickButton1={handleCancelModal}
      >
         {
            <>
               {row?.datasource && row?.datasource_syncinfo && (
                  <div style={{ display: 'block', fontSize: '12px', position: 'absolute' }}>
                     <div style={{ display: 'flex', gap: '1.5rem'}}>
                        <div>Origen: <span><b>{row?.datasource || t(langKeys.file).toUpperCase()}</b></span></div>
                        <div>Archivo: <span><b>{row?.datasource_config?.filename}</b></span></div>
                     </div>
                     <div style={{ display: 'flex'}}>
                        <div>
                           Ult. sincronización: <span style={{ fontWeight: 'bold' }}>
                              <span style={{ marginRight: '0.5rem' }}>{stringBDTimestampToLocalDate12hr(row?.datasource_syncinfo?.last_sync)}</span>
                              <span style={{ color: row?.datasource_syncinfo?.last_sync_result === 'SUCCESS' ? 'green' : 'red' }}>
                                 (<Tooltip title={row?.datasource_syncinfo?.last_sync_message} arrow>
                                    <Typography component="span" style={{ fontSize: '12px' }}><b>{t((langKeys as ILangKeys)[String(row?.datasource_syncinfo?.last_sync_result).toLowerCase()])}</b></Typography>
                                 </Tooltip>)
                              </span>
                           </span>
                        </div>
                     </div>
                  </div>
               )}

               <TableZyx
                  columns={columnsData}
                  data={tableData}
                  download={true}
                  pageSizeDefault={20}
                  filterGeneral={false}
                  importData={true}
                  importDataFunction={importDataFunction}
                  deleteData={true}
                  deleteDataFunction={deleteDataFunction}
               />
            </>
         }
      </DialogZyx>
   );
};


export default IntegrationManager;
