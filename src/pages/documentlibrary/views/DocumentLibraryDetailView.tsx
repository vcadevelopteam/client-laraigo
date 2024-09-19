import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, FieldEdit, FieldSelect, TitleDetail, TemplateSwitch, FieldMultiSelect } from 'components';
import { Dictionary, IFile, MultiData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Box } from '@material-ui/core';
import { ItemFile, UploaderIcon } from '../components/uploaderComponent';
import { documentLibraryIns } from 'common/helpers/requestBodies';

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
}));

interface DocumentLibraryDetailViewProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
    arrayBread: any;
}

const DocumentLibraryDetailView: React.FC<DocumentLibraryDetailViewProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData,arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const initialValueAttachments = row?.link;
    const [files, setFiles] = useState<IFile[]>(
        initialValueAttachments ? initialValueAttachments.split(",").map((url: string) => ({ url: row?.link })) : []
    );

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row?.documentlibraryid|| 0,
            title: row?.title||"",
            description: row?.description||"",
            groups: row?.groups||"",
            favorite: row?.favorite||false,
            category: row?.category||"",
            operation: row ? "EDIT" : "INSERT",
            status: "ACTIVO",
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');
        register('title', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('groups', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('category', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description');
        register('favorite');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(documentLibraryIns({...data, link: files?.[0]?.url||""})));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }
        if(files?.length){
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }else{
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.document_library_save) }))
        }
    });

    return (
        <div style={{width: '100%'}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "view-2", name: t(langKeys.documentlibrary) + " " + t(langKeys.detail) }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.title}` : t(langKeys.new) + " " + t(langKeys.documentlibrary)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center'  }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.title)} 
                            className="col-12"
                            onChange={(value) => setValue('title', value)}
                            valueDefault={row ? (row.title || "") : ""}
                            error={errors?.title?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)} 
                            className="col-12"
                            onChange={(value) => setValue('description', value)}
                            valueDefault={row ? (row.description || "") : ""}
                            error={errors?.description?.message}
                        />
                    </div>                    
                    <div className="row-zyx">
                        <FieldMultiSelect
                            label={t(langKeys.group_plural)}
                            className="col-6"
                            valueDefault={row?.groups||""}
                            onChange={(value) => {setValue('groups', value.map(obj => obj.domainvalue).join(','))}}
                            error={errors?.groups?.message}
                            data={multiData?.[0]?.data || []}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        <FieldEdit
                            label={t(langKeys.category)} 
                            className="col-6"
                            onChange={(value) => setValue('category', value)}
                            valueDefault={row ? (row.category || "") : ""}
                            error={errors?.category?.message}
                        />
                    </div>                    
                    <div className="row-zyx">
                        <TemplateSwitch
                            className="col-12"
                            onChange={(value) => setValue('favorite', value)}
                            valueDefault={row?.favorite||false}
                            label={t(langKeys.favorite)}
                        />
                    </div>                 
                    <div className="row-zyx">
                        <div className="col-12">
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.file)}</Box>
                            <UploaderIcon classes={classes} setFiles={setFiles} type={"file"}/>
                            
                            {files.length > 0 &&
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #EBEAED', paddingBottom: 8 }}>
                                    {files.map((item: IFile) => <ItemFile key={item.id} item={item} setFiles={setFiles} />)}
                                </div>
                            }
                        </div>                  
                    </div>
                </div>
            </form>
        </div>
    );
}

export default DocumentLibraryDetailView;