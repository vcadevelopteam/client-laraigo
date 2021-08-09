import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';

import { getCollection, resetMain, getMultiCollection, resetMultiMain } from 'store/main/actions';

import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getPropertySel, getChannelsByOrg, getValuesFromDomain } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';

import { useForm, NestedValue } from 'react-hook-form';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailPropertyProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
}
const arrayBread = [
    { id: "view-1", name: "Properties" },
    { id: "view-2", name: "Property detail" }
];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
}));

const DetailProperty: React.FC<DetailPropertyProps> = ({ data: { row, edit }, setViewSelected, multiData }) => {
    const classes = useStyles();

    const dataStatus = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataChannel = multiData[0] && multiData[0].success ? multiData[0].data : [];

    console.log(dataStatus)

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            communicationchannelid: row ? row.communicationchannelid : 0,
            id: row ? row.id : 0,
            propertyname: row ? row.propertyname : '',
            propertyvalue: row ? row.propertyvalue : '',
            description: row ? (row.description || '') : '',
            status: row ? row.status : 'ACTIVO',
        }
    });

    React.useEffect(() => {
        register('communicationchannelid');
        register('type');
        register('id');
        register('propertyname', { validate: (value) => (value && value.length) || 'This is required.' });
        register('propertyvalue', { validate: (value) => (value && value.length) || 'This is required.' });
        register('description', { validate: (value) => (value && value.length) || 'This is required.' });
        register('status', { validate: (value) => (value && value.length) || 'This is required.' });
    }, [edit, register]);

    const onSubmit = handleSubmit((data) => console.log(data));

    return (
        <div>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={row ? `${row.propertyname}` : "New property"}
            />
            <form onSubmit={onSubmit}>

                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label="Corporation"
                                className="col-6"
                                valueDefault={row ? (row.corpdesc || "") : ""}
                                disabled={true}
                            />
                            : <FieldView
                                label="Corporation"
                                value={row ? (row.corpdesc || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label="Organization"
                                className="col-6"
                                valueDefault={row ? (row.orgdesc || "") : ""}
                                disabled={true}
                            />
                            : <FieldView
                                label="Organization"
                                value={row ? (row.orgdesc || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label="Channel"
                                valueDefault={row ? (row.communicationchanneldesc || "") : ""}
                                className="col-6"
                                onChange={(value) => setValue('communicationchannelid', value.communicationchannelid)}
                                error={errors?.status?.message}
                                data={dataChannel}
                                optionDesc="description"
                                optionValue="communicationchannelid"
                            />
                            : <FieldView
                                label="Channel"
                                value={row ? (row.communicationchanneldesc || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label="Name"
                                className="col-6"
                                valueDefault={row ? (row.propertyname || "") : ""}
                                onChange={(value) => setValue('propertyname', value)}
                                error={errors?.propertyname?.message}
                            />
                            : <FieldView
                                label="Name"
                                value={row ? (row.propertyname || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label="Value"
                                className="col-6"
                                valueDefault={row ? (row.propertyvalue || "") : ""}
                                onChange={(value) => setValue('propertyvalue', value)}
                                error={errors?.propertyvalue?.message}
                            />
                            : <FieldView
                                label="Value"
                                value={row ? (row.propertyvalue || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldSelect
                                label="Status"
                                className="col-6"
                                valueDefault={row ? (row.status || "") : ""}
                                onChange={(value) => setValue('status', value.domainvalue)}
                                error={errors?.status?.message}
                                data={dataStatus}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label="Status"
                                value={row ? (row.status || "") : ""}
                                className="col-6"
                            />}
                    </div>

                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label="Description"
                                className="col-6"
                                valueDefault={row ? (row.description || "") : ""}
                                onChange={(value) => setValue('description', value)}
                                error={errors?.description?.message}
                            />
                            : <FieldView
                                label="Description"
                                value={row ? (row.description || "") : ""}
                                className="col-6"
                            />}
                    </div>
                </div>
                <input type="submit" />

            </form>

        </div>
    );
}

const Properties: FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });

    const columns = React.useMemo(
        () => [

            {
                Header: 'Name',
                accessor: 'propertyname',
                NoFilter: true
            },
            {
                Header: 'Description',
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: 'Value',
                accessor: 'propertyvalue',
                NoFilter: true
            },
            {
                Header: 'Status',
                accessor: 'status',
                NoFilter: true
            },

            {
                Header: 'Corporation',
                accessor: 'corpdesc',
                NoFilter: true
            },
            {
                Header: 'Organization',
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: 'Channel',
                accessor: 'communicationchanneldesc',
                NoFilter: true
            },
            {
                Header: 'Change Date',
                accessor: 'changedate',
                NoFilter: true
            },
            {
                Header: 'Action',
                accessor: 'userid',
                NoFilter: true,
                isComponent: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;

                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
        ],
        []
    );

    useEffect(() => {
        dispatch(getCollection(getPropertySel(0)));
        dispatch(getMultiCollection([getChannelsByOrg(), getValuesFromDomain("ESTADOGENERICO")]));
        return () => {
            dispatch(resetMain());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        // setViewSelected("view-2");
        // setRowSelected(row);
    }

    if (mainResult.mainData.loading) {
        return <h1>LOADING</h1>;
    }
    else if (mainResult.mainData.error) {
        return <h1>ERROR</h1>;
    }

    if (viewSelected === "view-1") {
        return (
            <TableZyx
                columns={columns}
                titlemodule='Properties'
                data={mainResult.mainData.data}
                download={true}
                register={true}
                handleRegister={handleRegister}
            // fetchData={fetchData}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailProperty
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
            />
        )
    } else
        return null;

}

export default Properties;