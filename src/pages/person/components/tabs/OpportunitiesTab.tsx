import { Rating } from "@material-ui/lab";
import { convertLocalDate, getOpportunitiesByPersonBody } from "common/helpers";
import TableZyx from "components/fields/table-simple";
import { useSelector } from "hooks";
import { langKeys } from "lang/keys";
import { SimpleTabProps } from "pages/person/model";
import { FC, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getLeadsByPerson, resetGetLeadsByPerson } from "store/person/actions";


const urgencyLevels = [null, 'LOW', 'MEDIUM', 'HIGH']

const OpportunitiesTab: FC<SimpleTabProps> = ({ person }) => {
    const dispatch = useDispatch();
    const leads = useSelector(state => state.person.personLeadList);
    const { t } = useTranslation();
    

    const columns = useMemo(
        () => [
            {
                Header: t(langKeys.opportunity),
                accessor: 'description',
            },
            {
                Header: t(langKeys.lastUpdate),
                accessor: 'changedate',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.changedate ? convertLocalDate(row.changedate).toLocaleString() : ""
                }
            },
            {
                Header: t(langKeys.phase),
                accessor: 'phase',
            },
            {
                Header: t(langKeys.priority),
                accessor: 'priority',
                type: "select",
                listSelectFilter: [{ key: t(langKeys.priority_low), value: "LOW" }, { key: t(langKeys.priority_medium), value: "MEDIUM" }, { key: t(langKeys.priority_high), value: "HIGH" }],
                Cell: (props: any) => {
                    const { priority } = props.cell.row.original;
                    return (
                        <Rating
                            name="simple-controlled"
                            max={3}
                            value={urgencyLevels.findIndex(x => x === priority)}
                            readOnly={true}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status'
            },
            {
                Header: t(langKeys.product, { count: 2 }),
                accessor: 'leadproduct',
                Cell: (props: any) => {
                    const { leadproduct } = props.cell.row.original;
                    if (!leadproduct) return null;
                    return leadproduct.split(",").map((t: string, i: number) => (
                        <span key={`leadproduct${i}`} style={{
                            backgroundColor: '#7721AD',
                            color: '#fff',
                            borderRadius: '20px',
                            padding: '2px 5px',
                            margin: '2px'
                        }}>{t}</span>
                    ))
                }
            },
            {
                Header: t(langKeys.tags),
                accessor: 'tags',
                Cell: (props: any) => {
                    const { tags } = props.cell.row.original;
                    if (!tags)
                        return null;
                    return tags.split(",").map((t: string, i: number) => (
                        <span key={`lead${i}`} style={{
                            backgroundColor: '#7721AD',
                            color: '#fff',
                            borderRadius: '20px',
                            padding: '2px 5px',
                            margin: '2px'
                        }}>{t}</span>
                    ))
                }
            },
            {
                Header: t(langKeys.comments),
                accessor: 'datenote',
                NoFilter: true,
                NoSort: true,
                Cell: (props: any) => {
                    const { datenote, leadnote, dateactivity, leadactivity } = props.cell.row.original;
                    return (
                        <div>
                            {datenote &&
                                <div>{t(langKeys.lastnote)} ({convertLocalDate(datenote).toLocaleString()}) {leadnote}</div>
                            }
                            {dateactivity &&
                                <div>{t(langKeys.nextprogramedactivity)} ({convertLocalDate(dateactivity).toLocaleString()}) {leadactivity}</div>
                            }
                        </div>
                    )
                }
            },
        ],
        []
    );

    useEffect(() => {
        if ((person?.personid || 0) > 0) {
            dispatch(getLeadsByPerson(getOpportunitiesByPersonBody(person.personid)));
        }
        return () => {
            dispatch(resetGetLeadsByPerson());
        };
    }, [dispatch, person]);

    return (
        <TableZyx
            columns={columns}
            filterGeneral={false}
            data={leads.data}
            download={false}
            loading={leads.loading}
            register={false}
        />
    );
}

export default OpportunitiesTab;