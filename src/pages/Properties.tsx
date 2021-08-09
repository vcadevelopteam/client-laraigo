import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getCollection, resetMain } from 'store/main/actions';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView } from 'components';
import { getUserSel } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

export interface DetailPropertyProps {
    data: Dictionary | null;
    setViewSelected: (view: string) => void;
}
const arrayBread = [
    { id: "view-1", name: "Users" },
    { id: "view-2", name: "User detail" }
];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
}));

const DetailProperty: React.FC<DetailPropertyProps> = ({ data, setViewSelected }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={data ? `${data.firstname} ${data.lastname}` : "New user"}
            />
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.firstname)} // "Firstname"
                        value={data ? data.firstname : ""}
                        className="col-6"
                    />
                    <FieldView
                        label={t(langKeys.lastname)}
                        value={data ? data.lastname : ""}
                        className="col-6"
                    />
                </div>
                <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.user)}
                        value={data ? data.usr : ""}
                        className="col-6"
                    />
                    <FieldView
                        label={t(langKeys.email)}
                        value={data ? data.email : ""}
                        className="col-6"
                    />
                </div>
                <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.docType)}
                        value={data ? data.doctype : ""}
                        className="col-6"
                    />
                    <FieldView
                        label={t(langKeys.docNumber)}
                        value={data ? data.docnum : ""}
                        className="col-6"
                    />
                </div>
                <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.company)}
                        value={data ? data.company : ""}
                        className="col-6"
                    />
                    <FieldView
                        label={t(langKeys.doubleAuthentication)}
                        value={data ? (t(data.twofactorauthentication ? langKeys.active : langKeys.inactive)) : ""}
                        className="col-6"
                    />
                </div>
                <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.billingGroup)}
                        value={data ? data.billinggroup : ""}
                        className="col-6"
                    />
                    <FieldView
                        label={t(langKeys.registerCode)}
                        value={data ? data.docnum : ""}
                        className="col-6"
                    />
                </div>
            </div>
        </div>
    );
}

const Properties: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.data);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);

    const columns = React.useMemo(
        () => [

            {
                Header: t(langKeys.email),
                accessor: 'email',
                NoFilter: true
            },
            {
                Header: 'Globalid',
                accessor: 'globalid',
                NoFilter: true
            },
            {
                Header: t(langKeys.group, { count: 2 }),
                accessor: 'groups',
                NoFilter: true
            },
            {
                Header: t(langKeys.role, { count: 2 }),
                accessor: 'roledesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: t(langKeys.user),
                accessor: 'usr',
                NoFilter: true
            },
            {
                Header: t(langKeys.action),
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
        dispatch(getCollection(getUserSel(0)));
        return () => {
            dispatch(resetMain());
        };
    }, []);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected(null);
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected(row);
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected(row);
    }

    const handleDelete = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected(row);
    }

    if (mainResult.loading) {
        return <h1>LOADING</h1>;
    }
    else if (mainResult.error) {
        return <h1>ERROR</h1>;
    }

    if (viewSelected === "view-1") {
        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.property, { count: 2 })}
                data={mainResult.data}
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
            />
        )
    } else
        return null;

}

export default Properties;