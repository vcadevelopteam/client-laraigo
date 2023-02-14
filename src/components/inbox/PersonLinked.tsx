/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { DialogZyx } from 'components'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { IFetchData, IPerson } from '@types';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import Button from '@material-ui/core/Button';
import { Avatar, IconButton } from '@material-ui/core';
import { convertLocalDate, getPaginatedPersonLink, ufnlinkPersons } from 'common/helpers';
import { getPersonLinkListPaginated } from 'store/person/actions';
import TablePaginated from 'components/fields/table-paginated';
import LinkIcon from '@material-ui/icons/Link';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { Refresh } from '@material-ui/icons';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { execute } from 'store/main/actions';

const useStyles = makeStyles((theme) => ({
    label: {
        overflowWrap: 'anywhere',
        fontSize: 12,
        color: '#B6B4BA',
    },
    value: {
        height: 22,
        maxWidth: 180,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    image: {
        alignItems: "center",
        marginTop: "auto",
        marginBottom: "auto"
    }
}));

const DialogLinkPerson: React.FC<{
    openModal: boolean,
    setOpenModal: (param: any) => void,
    person?: IPerson | undefined | null,
    callback?: (newPerson: IPerson) => void
}> = ({ openModal, setOpenModal, person, callback }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const personList = useSelector(state => state.person.personLinkList);
    const [personParent, setPersonParent] = useState<IPerson | null | undefined>(null)
    const [personChild, setPersonChild] = useState<IPerson | null | undefined>(null)
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [step, setStep] = useState("view-table");
    const [waitLink, setWaitLink] = useState(false);
    const linkRes = useSelector(state => state.main.execute);

    const columns = React.useMemo(() => ([
        {
            Header: "",
            accessor: 'personid',
            NoFilter: true,
            isComponent: true,
            minWidth: 60,
            width: '1%',
            Cell: (props: any) => {
                const row = props.cell.row.original;
                return (
                    <IconButton
                        size='small'
                        onClick={() => {
                            setStep("view-person");
                            setPersonChild(row as IPerson)
                        }}
                    >
                        <LinkIcon />
                    </IconButton>

                )
            }
        },
        {
            Header: t(langKeys.name),
            accessor: 'name',
        },
        {
            Header: t(langKeys.phone),
            accessor: 'phone',
        },
        {
            Header: t(langKeys.email),
            accessor: 'email',
        },
        {
            Header: t(langKeys.lastContactDate),
            accessor: 'lastcontact',
            type: 'date',
            sortType: 'datetime',
            Cell: (props: any) => {
                const row = props.cell.row.original;
                return row.lastcontact ? convertLocalDate(row.lastcontact).toLocaleString() : ""
            }
        },
        {
            Header: t(langKeys.status),
            accessor: 'status',
            prefixTranslation: 'status_',
            Cell: (props: any) => {
                const { status } = props.cell.row.original;
                return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
            }
        }
    ]), [t]);

    const fetchData = ({ pageSize, pageIndex, filters, sorts }: IFetchData) => {
        dispatch(getPersonLinkListPaginated(getPaginatedPersonLink({
            skip: pageSize * pageIndex,
            take: pageSize,
            sorts,
            filters,
            originpersonid: person?.personid
        })));
    }

    useEffect(() => {
        if (openModal) {
            setPersonParent(person);
            setPersonChild(null);
            setStep("view-table");
            fetchData({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
        }
    }, [openModal])

    useEffect(() => {
        if (!personList.loading && !personList.error) {
            setPageCount(Math.ceil(personList.count / 20));
            settotalrow(personList.count);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personList]);

    useEffect(() => {
        if (waitLink) {
            if (!linkRes.loading && !linkRes.error) {
                callback && callback(personParent!!)
                dispatch(showSnackbar({ show: true, severity: "success", message: "Vinculación correcta" }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitLink(false);
            } else if (linkRes.error) {
                const message = t(linkRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message }))
                dispatch(showBackdrop(false));
                setWaitLink(false);
            }
        }
    }, [linkRes, waitLink])

    const linkPersons = () => {
        if (!(step === "view-person" && personChild)) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: "Debe seleccionar una persona" }))
            return
        }
        dispatch(showBackdrop(true));
        dispatch(execute(ufnlinkPersons({
            ...personParent,
            personidfrom: personChild?.personid,
            personidto: personParent?.personid,
        })))
        setWaitLink(true)
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.link)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.link)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={linkPersons}
            maxWidth="md"
            height="100%"
        >
            <div style={{ display: "flex", gap: 10 }}>
                <Avatar className={classes.image} alt="" style={{ width: 120, height: 120 }} src={personParent?.imageurldef} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', width: '100%', gap: "10px" }}>
                    <div>
                        <div className={classes.label}>{t(langKeys.firstname)}</div>
                        <div className={classes.value}>{personParent?.firstname}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.lastname)}</div>
                        <div className={classes.value}>{personParent?.lastname}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.documenttype)}</div>
                        <div className={classes.value}>{personParent?.documenttype}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.documentnumber)}</div>
                        <div className={classes.value}>{personParent?.documentnumber}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.email)}</div>
                        <div className={classes.value}>{personParent?.email}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.phone)}</div>
                        <div className={classes.value}>{personParent?.phone}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.alternativeEmail)}</div>
                        <div className={classes.value}>{personParent?.alternativeemail}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.alternativePhone)}</div>
                        <div className={classes.value}>{personParent?.alternativephone}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.birthday)}</div>
                        <div className={classes.value}>{personParent?.birthday}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.gender)}</div>
                        <div className={classes.value}>{personParent?.gender}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.occupation)}</div>
                        <div className={classes.value}>{personParent?.occupationdesc}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.civilStatus)}</div>
                        <div className={classes.value}>{personParent?.civilstatusdesc}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.educationLevel)}</div>
                        <div className={classes.value}>{personParent?.educationleveldesc}</div>
                    </div>
                    
                    
                    
                    <div>
                        <div className={classes.label}>{t(langKeys.address)}</div>
                        <div className={classes.value}>{personParent?.address}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.healthprofessional)}</div>
                        <div className={classes.value}>{personParent?.healthprofessional}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t(langKeys.referralchannel)}</div>
                        <div className={classes.value}>{personParent?.referralchannel}</div>
                    </div>
                    
                    <div>
                        <div className={classes.label}>{t(langKeys.observation)}</div>
                        <div className={classes.value}>{personParent?.observation}</div>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 12 }}>
                *Al realizar la vinculación, los tickets y canales de esta persona se trasladaran a la persona seleccionada
            </div>
            {step === "view-table" && (
                <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1, height: "400px" }}>
                    <TablePaginated
                        columns={columns}
                        data={personList.data}
                        pageCount={pageCount}
                        totalrow={totalrow}
                        loading={personList.loading}
                        filterrange={false}
                        download={false}
                        fetchData={fetchData}
                    />
                </div>
            )}
            {step === "view-person" && (
                <div style={{ marginTop: 16 }}>
                    <div style={{ textAlign: "right", marginBottom: 16 }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<Refresh color="secondary" />}
                            onClick={() => setStep("view-table")}
                        >{"Elegir persona"}</Button>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <div className={classes.image} >
                            {personChild?.imageurldef && (
                                <div style={{ textAlign: "center" }}>
                                    <IconButton size="small" onClick={() => {
                                        setPersonParent({
                                            ...personParent!!,
                                            imageurldef: personChild.imageurldef
                                        })
                                    }}>
                                        <ArrowUpwardIcon color="action" />
                                    </IconButton>
                                </div>
                            )}
                            <Avatar alt="" style={{ width: 120, height: 120 }} src={personChild?.imageurldef} />

                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', width: '100%', gap: "10px" }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.firstname && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                firstname: personChild.firstname
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.firstname)}</div>
                                    <div className={classes.value}>{personChild?.firstname}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.lastname && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                lastname: personChild.lastname
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.lastname)}</div>
                                    <div className={classes.value}>{personChild?.lastname}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.documenttype && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                documenttype: personChild.documenttype,
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.documenttype)}</div>
                                    <div className={classes.value}>{personChild?.documenttype}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.documentnumber && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                documentnumber: personChild.documentnumber
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.documentnumber)}</div>
                                    <div className={classes.value}>{personChild?.documentnumber}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.email && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                email: personChild.email
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.email)}</div>
                                    <div className={classes.value}>{personChild?.email}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.phone && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                phone: personChild.phone
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.phone)}</div>
                                    <div className={classes.value}>{personChild?.phone}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.alternativeemail && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                alternativeemail: personChild.alternativeemail
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.alternativeEmail)}</div>
                                    <div className={classes.value}>{personChild?.alternativeemail}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.alternativephone && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                alternativephone: personChild.alternativephone
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.alternativePhone)}</div>
                                    <div className={classes.value}>{personChild?.alternativephone}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.birthday && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                birthday: personChild.birthday
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.birthday)}</div>
                                    <div className={classes.value}>{personChild?.birthday}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.gender && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                gender: personChild.gender
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.gender)}</div>
                                    <div className={classes.value}>{personChild?.gender}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.occupationdesc && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                occupationdesc: personChild.occupationdesc,
                                                occupation: personChild.occupation,
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.occupation)}</div>
                                    <div className={classes.value}>{personChild?.occupationdesc}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.civilstatusdesc && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                civilstatusdesc: personChild.civilstatusdesc,
                                                civilstatus: personChild.civilstatus
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.civilStatus)}</div>
                                    <div className={classes.value}>{personChild?.civilstatusdesc}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.educationleveldesc && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                educationleveldesc: personChild.educationleveldesc,
                                                educationlevel: personChild.educationlevel,
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.educationLevel)}</div>
                                    <div className={classes.value}>{personChild?.educationleveldesc}</div>
                                </div>
                            </div>



                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.address && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                address: personChild.address
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.address)}</div>
                                    <div className={classes.value}>{personChild?.address}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.healthprofessional && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                healthprofessional: personChild.healthprofessional
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.healthprofessional)}</div>
                                    <div className={classes.value}>{personChild?.healthprofessional}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.referralchannel && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                referralchannel: personChild.referralchannel
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.referralchannel)}</div>
                                    <div className={classes.value}>{personChild?.referralchannel}</div>
                                </div>
                            </div>




                            <div style={{ display: "flex", gap: 8 }}>
                                {personChild?.observation && (
                                    <div>
                                        <IconButton size="small" onClick={() => {
                                            setPersonParent({
                                                ...personParent!!,
                                                observation: personChild.observation
                                            })
                                        }}>
                                            <ArrowUpwardIcon color="action" />
                                        </IconButton>
                                    </div>
                                )}
                                <div>
                                    <div className={classes.label}>{t(langKeys.observation)}</div>
                                    <div className={classes.value}>{personChild?.observation}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DialogZyx>
    )
}

export default DialogLinkPerson;