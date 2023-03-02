/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldMultiSelect, AntTab, DialogZyx } from 'components';
import { getSLASel, getValuesFromDomain, insSLA,getCommChannelLst } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm, UseFormReturn } from 'react-hook-form';
import { getCollection, resetAllMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { DuplicateIcon } from 'icons';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import { Tabs } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

interface RowSelected {
    row: Dictionary | null,
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailSLAProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
    arrayBread?: any;
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
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        // fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
}));

interface TabDetailProps {
    form: UseFormReturn<any>;
    row: any;
    multiData: MultiData[];
}

const TabDetailSLA: React.FC<TabDetailProps> = ({ form,row, multiData }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const { setValue, getValues, formState: { errors }  } = form;
    const [fieldFlags, setFieldFlags] = useState({
        showChannels: getValues('type')==="LARAIGO"
    });
    

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataSupplier = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataGroups = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const datachannels = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const dataTipoSLA = multiData[4] && multiData[4].success ? multiData[4].data : [];
    
    return <div className={classes.containerDetail}>
        <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.organization)} 
                    className="col-6"
                    onChange={(value) => setValue('organization', value)}
                    valueDefault={row?.orgdesc || user?.orgdesc || ""}
                    error={errors?.organization?.message}
                    disabled={true}
                />
                <FieldSelect
                    label={t(langKeys.type)} 
                    className="col-6"
                    valueDefault={row?.type || ""}
                    onChange={(value) => {
                        setValue('type', value?.domainvalue|| '')
                        setFieldFlags({...fieldFlags,showChannels: value?.domainvalue === "LARAIGO"})
                    }}
                    error={errors?.type?.message}
                    data={dataTipoSLA}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
        </div>  
        <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.description)} //transformar a multiselect
                    className="col-6"
                    onChange={(value) => setValue('description', value)}
                    valueDefault={getValues('description')}
                    error={errors?.description?.message}
                />
                <FieldSelect
                    label={t(langKeys.business)} 
                    className="col-6"
                    valueDefault={getValues('company')}
                    onChange={(value) => setValue('company', value? value.domainvalue: '')}
                    error={errors?.company?.message}
                    data={dataSupplier}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
        </div>
        <div className="row-zyx">
            {fieldFlags.showChannels &&
                <FieldMultiSelect
                    label={t(langKeys.channel_plural)} //transformar a multiselect
                    className="col-12"
                    onChange={(value) => setValue('communicationchannelid', value.map((o: Dictionary) => o.communicationchannelid).join())}
                    valueDefault={row?.communicationchannelid || ""}
                    error={errors?.communicationchannelid?.message}
                    data={datachannels}
                    optionDesc="communicationchanneldesc"
                    optionValue="communicationchannelid"
                />
            }
        </div>
        <div className="row-zyx">
            {fieldFlags.showChannels &&
                <FieldMultiSelect
                    label={t(langKeys.group)} 
                    className="col-6"
                    onChange={(value) => setValue('usergroup', value.map((o: Dictionary) => o.domainvalue).join())}
                    valueDefault={row?.usergroup || ""}
                    error={errors?.usergroup?.message}
                    data={dataGroups}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
            }
            <FieldSelect
                label={t(langKeys.status)}
                className="col-6"
                valueDefault={row?.status || "ACTIVO"}
                onChange={(value) => setValue('status', value? value.domainvalue: '')}
                error={errors?.status?.message}
                uset={true}
                prefixTranslation="status_"
                data={dataStatus}
                optionDesc="domaindesc"
                optionValue="domainvalue"
            />
        </div>
        {fieldFlags.showChannels &&
            <div style={{ marginBottom: '16px' }}>
                <div className={classes.title}>{t(langKeys.detail)}</div>
                <div className="row-zyx">
                    <FieldEdit
                        type="time"
                        label={"TMO total min (HH:MM)"} 
                        className="col-4"
                        onChange={(value) => setValue('totaltmomin', value)}
                        valueDefault={row?.totaltmomin || ""}
                        error={errors?.totaltmomin?.message}
                    />
                    <FieldEdit
                        type="time"
                        label={"TMO total max (HH:MM)"} 
                        className="col-4"
                        onChange={(value) => setValue('totaltmo', value)}
                        valueDefault={row?.totaltmo || ""}
                        error={errors?.totaltmo?.message}
                    />
                    <FieldEdit
                        type="number"
                        label={`${t(langKeys.tmopercentobj)}%`} 
                        className="col-4"
                        onChange={(value) => setValue('totaltmopercentmax', value)}
                        valueDefault={row?.totaltmopercentmax || ""}
                        error={errors?.totaltmopercentmax?.message}
                    />
                </div>
                <div className="row-zyx">
                    <FieldEdit
                    type="time"
                    label={"TMO user min (HH:MM)"} 
                    className="col-4"
                    onChange={(value) => setValue('usertmomin', value)}
                    valueDefault={row?.usertmomin || ""}
                    error={errors?.usertmomin?.message}
                    />
                    <FieldEdit
                        type="time"
                        label={"TMO user max (HH:MM)"} 
                        className="col-4"
                        onChange={(value) => setValue('usertmo', value)}
                        valueDefault={row?.usertmo || ""}
                        error={errors?.usertmo?.message}
                    />
                    <FieldEdit
                        type="number"
                        label={`${t(langKeys.usertmopercentmax)}%`} 
                        className="col-4"
                        onChange={(value) => setValue('usertmopercentmax', value)}
                        valueDefault={row?.usertmopercentmax || ""}
                        error={errors?.usertmopercentmax?.message}
                    />
                </div>
                <div className="row-zyx">
                    <FieldEdit
                        type="time"
                        label={"TME user max (HH:MM)"} 
                        className="col-4"
                        onChange={(value) => setValue('usertme', value)}
                        valueDefault={row?.usertme || ""}
                        error={errors?.usertme?.message}
                    />
                    <FieldEdit
                        type="number"
                        label={`${t(langKeys.usertmepercentmax)}%`} 
                        className="col-4"
                        onChange={(value) => setValue('usertmepercentmax', value)}
                        valueDefault={row?.usertmepercentmax || ""}
                        error={errors?.usertmepercentmax?.message}
                    />
                    <FieldEdit
                        label={t(langKeys.productivitybyhour)} 
                        className="col-4"
                        type='number'
                        onChange={(value) => setValue('productivitybyhour', value)}
                        valueDefault={row?.productivitybyhour || 0}
                        error={errors?.productivitybyhour?.message}
                    />
                </div>                
            </div>
        }
    </div>
}
const TabCriticalityMatrix: React.FC<TabDetailProps> = ({ form,row, multiData }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const { setValue, getValues, formState: { errors }  } = form;
    const selectionKey= "index"
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const startAddRow = { impact: "", urgency: "", priority: ""}
    const [dataAddRow, setDataAddRow] = useState(startAddRow);
    const [errorAddRow, seterrorAddRow] = useState(startAddRow);
    const [dataCriticality, setDataCriticality] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataSupplier = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataImpact = multiData[5] && multiData[5].success ? multiData[5].data : [];
    const dataUrgency = multiData[6] && multiData[6].success ? multiData[6].data : [];
    const dataPriority = multiData[7] && multiData[7].success ? multiData[7].data : [];
    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.impact),
                accessor: 'impact',
                NoFilter: true,
                width: '33%',

            },
            {
                Header: t(langKeys.urgency),
                accessor: 'urgency',
                NoFilter: true,
                width: '33%',

            },
            {
                Header: t(langKeys.priority),
                accessor: 'priority',
                NoFilter: true,
                width: '33%',

            },           
        ],
        []
    );

    const onSubmit = () => {
        seterrorAddRow({
            impact: dataAddRow.impact===""?t(langKeys.field_required):"", 
            urgency: dataAddRow.urgency===""?t(langKeys.field_required):"", 
            priority: dataAddRow.priority===""?t(langKeys.field_required):"", 
        })
        if(!Object.values(dataAddRow).includes('')){
            if(!dataCriticality.filter((x:any)=>(x.impact===dataAddRow.impact && x.urgency===dataAddRow.urgency)).length){
                setDataCriticality([...dataCriticality, {...dataAddRow, index: dataCriticality.length}])
                setOpenModal(false)
                seterrorAddRow(startAddRow)
                setDataAddRow(startAddRow)
            }else{
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.combination_already_exists) }))
            }            
        }
    }
    
    const closeModal = () => {
        setOpenModal(false)
        seterrorAddRow(startAddRow)
        setDataAddRow(startAddRow)
    }
    
    return <div className={classes.containerDetail}>
        <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.organization)} 
                    className="col-6"
                    onChange={(value) => setValue('organization', value)}
                    valueDefault={row?.orgdesc || user?.orgdesc || ""}
                    error={errors?.organization?.message}
                    disabled={true}
                />
                <FieldSelect
                    label={t(langKeys.business)} 
                    className="col-6"
                    valueDefault={getValues('company')}
                    onChange={(value) => setValue('company', value?.domainvalue || '')}
                    error={errors?.company?.message}
                    data={dataSupplier}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
        </div>  
        <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.description)} //transformar a multiselect
                    className="col-6"
                    onChange={(value) => setValue('description', value)}
                    valueDefault={getValues('description')}
                    error={errors?.description?.message}
                />
                <FieldSelect
                    label={t(langKeys.status)}
                    className="col-6"
                    valueDefault={row?.status || "ACTIVO"}
                    onChange={(value) => setValue('status', value? value.domainvalue: '')}
                    error={errors?.status?.message}
                    uset={true}
                    prefixTranslation="status_"
                    data={dataStatus}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
        </div>
        <div className={classes.title}>{t(langKeys.criticality)}</div>
        <div style={{ width: '100%' }}>
            <TableZyx
                columns={columns}
                data={dataCriticality}
                filterGeneral={false}
                useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
                ButtonsElement={() => (
                    <div style={{display: "flex", justifyContent: "end", width: "100%"}}>
                        <Button
                            variant="contained"
                            type="button"
                            className='col-3'
                            color="primary"
                            startIcon={<AddIcon color="secondary" />}
                            style={{ backgroundColor: "#55bd84", marginRight: 8 }}
                            onClick={() => {setOpenModal(true) }}
                        >{t(langKeys.register)}</Button>
                        <Button
                            disabled={Object.keys(selectedRows).length===0}
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: Object.keys(selectedRows).length===0?"#dbdbdc":"#FB5F5F" }}
                            onClick={() => {setDataCriticality(dataCriticality.filter((x:any)=>!Object.keys(selectedRows).includes(x.name)))}}
                        >{t(langKeys.delete)}</Button>
                    </div>
                )}
                register={false}
                download={false}
                pageSizeDefault={20}
                initialPageIndex={0}
            />
        </div>
        <DialogZyx
            open={openModal}
            title={t(langKeys.registervalue)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={closeModal}
            handleClickButton2={onSubmit}
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.impact)}
                    className="col-12"
                    valueDefault={dataAddRow.impact}
                    onChange={(value) => setDataAddRow({...dataAddRow, impact: value?.domainvalue|| ''})}
                    error={errorAddRow.impact}
                    uset={true}
                    data={dataImpact}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.urgency)}
                    className="col-12"
                    valueDefault={dataAddRow.urgency}
                    onChange={(value) => setDataAddRow({...dataAddRow, urgency: value?.domainvalue|| ''})}
                    error={errorAddRow.urgency}
                    uset={true}
                    data={dataUrgency}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.priority)}
                    className="col-12"
                    valueDefault={dataAddRow.priority}
                    onChange={(value) => setDataAddRow({...dataAddRow, priority: value?.domainvalue|| ''})}
                    error={errorAddRow.priority}
                    uset={true}
                    data={dataPriority}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
            </div>
        </DialogZyx>
    </div>
}
const TabServiceTimes: React.FC<TabDetailProps> = ({ form,row, multiData }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const { setValue, getValues, formState: { errors }  } = form;
    const selectionKey= "priority"
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const startAddRow = { 
        priority: '',
        firstreply: '',
        umfirstreply: '',
        solutiontime: '',
        umsolutiontime: '',
    }
    const [dataAddRow, setDataAddRow] = useState(startAddRow);
    const [errorAddRow, seterrorAddRow] = useState(startAddRow);
    const [dataCriticality, setDataCriticality] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataSupplier = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataPriority = multiData[7] && multiData[7].success ? multiData[7].data : [];
    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.priority),
                accessor: 'priority',
                NoFilter: true,
                width:'auto'
            },           
            {
                Header: t(langKeys.firstreply),
                accessor: 'firstreply',
                NoFilter: true,
                width:'auto'
            },           
            {
                Header: 'UM ' + t(langKeys.firstreply),
                accessor: 'umfirstreply',
                NoFilter: true,
                width:'auto'
            },           
            {
                Header: t(langKeys.solutiontime),
                accessor: 'solutiontime',
                NoFilter: true,
                width:'auto'
            },           
            {
                Header: 'UM ' + t(langKeys.solutiontime),
                accessor: 'umsolutiontime',
                NoFilter: true,
                width:'auto'
            },           
        ],
        []
    );

    const onSubmit = () => {
        seterrorAddRow({
            priority: dataAddRow.priority===""?t(langKeys.field_required):"", 
            firstreply: dataAddRow.firstreply===""?t(langKeys.field_required):"", 
            umfirstreply: dataAddRow.umfirstreply===""?t(langKeys.field_required):"", 
            solutiontime: dataAddRow.solutiontime===""?t(langKeys.field_required):"", 
            umsolutiontime: dataAddRow.umsolutiontime===""?t(langKeys.field_required):"", 
        })
        if(!Object.values(dataAddRow).includes('')){
            if(!dataCriticality.filter((x:any)=>(x.impact===dataAddRow.priority && x.urgency===dataAddRow.priority)).length){
                setDataCriticality([...dataCriticality, dataAddRow])
                setOpenModal(false)
                seterrorAddRow(startAddRow)
                setDataAddRow(startAddRow)
            }else{
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.combination_already_exists) }))
            }            
        }
    }
    
    const closeModal = () => {
        setOpenModal(false)
        seterrorAddRow(startAddRow)
        setDataAddRow(startAddRow)
    }
    
    return <div className={classes.containerDetail}>
        <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.organization)} 
                    className="col-6"
                    onChange={(value) => setValue('organization', value)}
                    valueDefault={row?.orgdesc || user?.orgdesc || ""}
                    error={errors?.organization?.message}
                    disabled={true}
                />
                <FieldSelect
                    label={t(langKeys.business)} 
                    className="col-6"
                    valueDefault={getValues('company')}
                    onChange={(value) => setValue('company', value?.domainvalue || '')}
                    error={errors?.company?.message}
                    data={dataSupplier}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
        </div>  
        <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.description)} //transformar a multiselect
                    className="col-6"
                    onChange={(value) => setValue('description', value)}
                    valueDefault={getValues('description')}
                    error={errors?.description?.message}
                />
                <FieldSelect
                    label={t(langKeys.status)}
                    className="col-6"
                    valueDefault={row?.status || "ACTIVO"}
                    onChange={(value) => setValue('status', value? value.domainvalue: '')}
                    error={errors?.status?.message}
                    uset={true}
                    prefixTranslation="status_"
                    data={dataStatus}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
        </div>
        <div className={classes.title}>{t(langKeys.servicetimes)}</div>
        <div style={{ width: '100%' }}>
            <TableZyx
                columns={columns}
                data={dataCriticality}
                filterGeneral={false}
                useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
                ButtonsElement={() => (
                    <div style={{display: "flex", justifyContent: "end", width: "100%"}}>
                        <Button
                            variant="contained"
                            type="button"
                            className='col-3'
                            color="primary"
                            startIcon={<AddIcon color="secondary" />}
                            style={{ backgroundColor: "#55bd84", marginRight: 8 }}
                            onClick={() => {setOpenModal(true) }}
                        >{t(langKeys.register)}</Button>
                        <Button
                            disabled={Object.keys(selectedRows).length===0}
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: Object.keys(selectedRows).length===0?"#dbdbdc":"#FB5F5F" }}
                            onClick={() => {setDataCriticality(dataCriticality.filter((x:any)=>!Object.keys(selectedRows).includes(x.name)))}}
                        >{t(langKeys.delete)}</Button>
                    </div>
                )}
                register={false}
                download={false}
                pageSizeDefault={20}
                initialPageIndex={0}
            />
        </div>
        <DialogZyx
            open={openModal}
            title={t(langKeys.registervalue)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={closeModal}
            handleClickButton2={onSubmit}
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.priority)}
                    className="col-12"
                    valueDefault={dataAddRow.priority}
                    onChange={(value) => setDataAddRow({...dataAddRow, priority: value?.domainvalue|| ''})}
                    error={errorAddRow.priority}
                    data={dataPriority}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.firstreply)}
                    className="col-12"
                    type='number'
                    onChange={(value) => setDataAddRow({...dataAddRow, firstreply: value})}
                    valueDefault={dataAddRow.firstreply}
                    error={errorAddRow.firstreply}
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={'UM ' + t(langKeys.firstreply)}
                    className="col-12"
                    valueDefault={dataAddRow.umfirstreply}
                    onChange={(value) => setDataAddRow({...dataAddRow, umfirstreply: value?.value|| ''})}
                    error={errorAddRow.umfirstreply}
                    data={[
                        {value: 'HOURS', desc: t(langKeys.hour_plural)},
                        {value: 'MINUTES', desc: t(langKeys.minute_plural)},
                        {value: 'SECONDS', desc: t(langKeys.seconds)},
                    ]}
                    optionDesc="desc"
                    optionValue="value"
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.solutiontime)}
                    className="col-12"
                    type='number'
                    onChange={(value) => setDataAddRow({...dataAddRow, solutiontime: value})}
                    valueDefault={dataAddRow.solutiontime}
                    error={errorAddRow.solutiontime}
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={'UM ' + t(langKeys.solutiontime)}
                    className="col-12"
                    valueDefault={dataAddRow.umsolutiontime}
                    onChange={(value) => setDataAddRow({...dataAddRow, umsolutiontime: value?.value|| ''})}
                    error={errorAddRow.umsolutiontime}
                    data={[
                        {value: 'HOURS', desc: t(langKeys.hour_plural)},
                        {value: 'MINUTES', desc: t(langKeys.minute_plural)},
                        {value: 'SECONDS', desc: t(langKeys.seconds)},
                    ]}
                    optionDesc="desc"
                    optionValue="value"
                />
            </div>
        </DialogZyx>
    </div>
}

const DetailSLA: React.FC<DetailSLAProps> = ({ data: { row }, setViewSelected, multiData, fetchData,arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);

    const form = useForm({
        defaultValues: {
            type: row?.type || '',
            id: row?.slaid || 0,
            description: row?.description || '',
            company: row?.company || '',
            communicationchannelid:  row?.communicationchannelid || '',
            usergroup: row?.usergroup || '',
            status: row?.status || 'ACTIVO',
            totaltmo: row?.totaltmo || '',
            totaltmomin: row?.totaltmomin || '',
            totaltmopercentmax: row?.totaltmopercentmax || 0,
            usertmo: row?.usertmo || '',
            usertmomin: row?.usertmomin || '',
            usertmopercentmax: row?.usertmopercentmax || 0,
            usertme: row?.usertme || '',
            productivitybyhour: row?.productivitybyhour || 0,
            usertmepercentmax: row?.usertmepercentmax || 0,

            organization: row?.organization || '',
            operation: !!row?.slaid ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        form.register('id');
        form.register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        form.register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        form.register('company');
        form.register('usergroup');
        form.register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        form.register('totaltmo', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });
        form.register('totaltmomin', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });
        form.register('totaltmopercentmax', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });
        form.register('usertmo', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });
        form.register('usertmomin', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });
        form.register('usertmopercentmax', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });
        form.register('usertme', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });
        form.register('productivitybyhour', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });
        form.register('usertmepercentmax', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });

        form.register('communicationchannelid', { validate: (value) => form.getValues('type')==="LARAIGO"?(value && value.length) || t(langKeys.field_required):true });
        form.register('organization');
    }, [form.register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.sla).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = form.handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insSLA(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    return (
        <div style={{width: '100%'}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.sla)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newsla)}
                        />
                    </div>
            
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.sla)} />
                    <AntTab label={t(langKeys.criticalitymatrix)} />
                    <AntTab label={t(langKeys.servicetimes)} />
                </Tabs>
                {pageSelected === 0 && <TabDetailSLA form={form} row={row} multiData={multiData} />}
                {pageSelected === 1 && <TabCriticalityMatrix form={form} row={row} multiData={multiData} />}
                {pageSelected === 2 && <TabServiceTimes form={form} row={row} multiData={multiData} />}
            </form>
        </div>
    );
}

const SLA: FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null });
    const [waitSave, setWaitSave] = useState(false);
    const arrayBread = [
        { id: "view-0", name: t(langKeys.configuration_plural) },
        { id: "view-1", name: t(langKeys.app_sla) },
    ];
    function redirectFunc(view:string){
        if(view ==="view-0"){
            history.push(paths.CONFIGURATION)
            return;
        }
        setViewSelected(view)
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'slaid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            extraOption={t(langKeys.duplicate)}
                            extraFunction={() => handleDuplicate(row)}
                            ExtraICon={() => <DuplicateIcon width={28} style={{ fill: '#7721AD' }} />}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.business),
                accessor: 'company',
                NoFilter: true
            },
            {
                Header: t(langKeys.channel),
                accessor: 'communicationchanneldesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.tmopercentobj),
                accessor: 'totaltmopercentmax',
                NoFilter: true,
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { totaltmopercentmax } = props.cell.row.original;
                    return `${(Number(totaltmopercentmax) || 0).toFixed(2)} %`;
                }
            },
            {
                Header: t(langKeys.usertmopercentmax),
                accessor: 'usertmopercentmax',
                NoFilter: true,
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { usertmopercentmax } = props.cell.row.original;
                    return `${(Number(usertmopercentmax) || 0).toFixed(2)} %`;
                }
            },
            {
                Header: t(langKeys.usertmepercentmax),
                accessor: 'usertmepercentmax',
                NoFilter: true,
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { usertmepercentmax } = props.cell.row.original;
                    return `${(Number(usertmepercentmax) || 0).toFixed(2)} %`;
                }
            },            
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getSLASel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("EMPRESA"),
            getValuesFromDomain("GRUPOS"),
            getCommChannelLst(),
            getValuesFromDomain("TIPOSLA"),
            getValuesFromDomain("IMPACTO"),
            getValuesFromDomain("URGENCIA"),
            getValuesFromDomain("PRIORIDAD"),
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.sla).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null });
    }

    const handleDuplicate = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row: {...row, slaid:0} });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insSLA({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.slaid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {

        return (
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex',  justifyContent: 'space-between',  alignItems: 'center'}}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={redirectFunc}
                    />
                </div>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.app_sla, { count: 2 })}
                    data={mainResult.mainData.data}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={true}
                    onClickRow={handleEdit}
                    ButtonsElement={() => (
                        <Button
                            disabled={mainResult.mainData.loading}
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => history.push(paths.CONFIGURATION)}
                        >{t(langKeys.back)}</Button>
                    )}
                    handleRegister={handleRegister}
                // fetchData={fetchData}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailSLA
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

export default SLA;