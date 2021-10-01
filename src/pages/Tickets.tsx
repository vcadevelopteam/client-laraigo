/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, FC } from 'react'
import { exportExcel, getClassificationLevel1, getClassificationLevel2, getCommChannelLst, getComunicationChannelDelegate, getPaginatedTicket, getPersonExport, getTicketExport, getValuesFromDomain, insConversationClassificationMassive } from 'common/helpers';
import { getCollectionPaginated, exportData, getMultiCollection, resetMultiMain, resetCollectionPaginated, getCollectionAux, getCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import TablePaginated from 'components/fields/table-paginated';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { Dictionary, IFetchData, MultiData } from '@types'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box/Box';
import Button from '@material-ui/core/Button/Button';
import { DialogZyx, FieldMultiSelect, FieldSelect } from 'components';
import { Range } from 'react-date-range';
import Link from '@material-ui/core/Link';
import { DialogInteractions } from 'components';
import { TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const selectionKey = 'conversationid';

const actions = {
    close: 'close',
    typify: 'typify',
    reasign: 'reasign'
}

interface SelectedAction {
    setOpenModalTicket: (value: boolean) => void,
    setSelectedRows: (value: any) => void,
    multiData: MultiData[],
    selectedRows: any,
    openModalTicket: boolean,
    action: String
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },

    containerFilter: {
        width: '100%',
        marginBottom: theme.spacing(2),
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap'
    },
    filterComponent: {
        width: '250px',
        backgroundColor: '#FFF'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    }
}));


const Tickets = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);

    const [allParameters, setAllParameters] = useState({});
    //const format = (date: Date) => date.toISOString().split('T')[0];
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [openModalTicket, setOpenModalTicket] = useState(false);
    const [action, setAction] = useState("");
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    }

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.ticket_numeroticket),
                accessor: 'numeroticket',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => handleClickOpen(row)}
                        >
                            {row.numeroticket}
                        </label>
                    )
                }
            },
            {
                Header: t(langKeys.ticket_fecha),
                NoFilter: true,
                accessor: 'fecha'
            },
            {
                Header: t(langKeys.ticket_firstusergroup),
                NoFilter: true,
                accessor: 'firstusergroup'
            },
            {
                Header: t(langKeys.ticket_ticketgroup),
                NoFilter: true,
                accessor: 'ticketgroup'
            },
            {
                Header: t(langKeys.ticket_communicationchanneldescription),
                NoFilter: true,
                accessor: 'communicationchanneldescription'
            },
            {
                Header: t(langKeys.ticket_name),
                NoFilter: true,
                accessor: 'name'
            },
            {
                Header: t(langKeys.ticket_canalpersonareferencia),
                NoFilter: true,
                accessor: 'canalpersonareferencia'
            },
            {
                Header: t(langKeys.ticket_fechainicio),
                NoFilter: true,
                accessor: 'fechainicio'
            },
            {
                Header: t(langKeys.ticket_fechafin),
                NoFilter: true,
                accessor: 'fechafin'
            },
            {
                Header: t(langKeys.ticket_fechaprimeraconversacion),
                NoFilter: true,
                accessor: 'fechaprimeraconversacion'
            },
            {
                Header: t(langKeys.ticket_fechaultimaconversacion),
                NoFilter: true,
                accessor: 'fechaultimaconversacion'
            },
            {
                Header: t(langKeys.ticket_fechahandoff),
                NoFilter: true,
                accessor: 'fechahandoff'
            },
            {
                Header: t(langKeys.ticket_asesorinicial),
                NoFilter: true,
                accessor: 'asesorinicial'
            },
            {
                Header: t(langKeys.ticket_asesorfinal),
                NoFilter: true,
                accessor: 'asesorfinal'
            },
            {
                Header: t(langKeys.ticket_supervisor),
                NoFilter: true,
                accessor: 'supervisor'
            },
            {
                Header: t(langKeys.ticket_empresa),
                NoFilter: true,
                accessor: 'empresa'
            },
            {
                Header: t(langKeys.ticket_attentiongroup),
                NoFilter: true,
                accessor: 'attentiongroup'
            },
            {
                Header: t(langKeys.ticket_classification),
                NoFilter: true,
                accessor: 'classification'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuesta),
                NoFilter: true,
                accessor: 'tiempopromediorespuesta'
            },
            {
                Header: t(langKeys.ticket_tiempoprimerarespuestaasesor),
                NoFilter: true,
                accessor: 'tiempoprimerarespuestaasesor'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuestaasesor),
                NoFilter: true,
                accessor: 'tiempopromediorespuestaasesor'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuestapersona),
                NoFilter: true,
                accessor: 'tiempopromediorespuestapersona'
            },
            {
                Header: t(langKeys.ticket_duraciontotal),
                NoFilter: true,
                accessor: 'duraciontotal'
            },
            {
                Header: t(langKeys.ticket_duracionreal),
                NoFilter: true,
                accessor: 'duracionreal'
            },
            {
                Header: t(langKeys.ticket_duracionpausa),
                NoFilter: true,
                accessor: 'duracionpausa'
            },
            {
                Header: t(langKeys.ticket_tmoasesor),
                NoFilter: true,
                accessor: 'tmoasesor'
            },
            {
                Header: t(langKeys.ticket_tiempoprimeraasignacion),
                NoFilter: true,
                accessor: 'tiempoprimeraasignacion'
            },
            {
                Header: t(langKeys.ticket_estadoconversacion),
                NoFilter: true,
                accessor: 'estadoconversacion'
            },
            {
                Header: t(langKeys.ticket_tipocierre),
                NoFilter: true,
                accessor: 'tipocierre'
            },
            {
                Header: t(langKeys.ticket_tipification),
                NoFilter: true,
                accessor: 'tipification'
            },
            {
                Header: t(langKeys.ticket_firstname),
                NoFilter: true,
                accessor: 'firstname'
            },
            {
                Header: t(langKeys.ticket_contact),
                NoFilter: true,
                accessor: 'contact'
            },
            {
                Header: t(langKeys.ticket_lastname),
                NoFilter: true,
                accessor: 'lastname'
            },
            {
                Header: t(langKeys.ticket_email),
                NoFilter: true,
                accessor: 'email'
            },
            {
                Header: t(langKeys.ticket_phone),
                NoFilter: true,
                accessor: 'phone'
            },
            {
                Header: t(langKeys.ticket_balancetimes),
                NoFilter: true,
                accessor: 'balancetimes'
            },
            {
                Header: t(langKeys.ticket_documenttype),
                NoFilter: true,
                accessor: 'documenttype'
            }
            ,
            {
                Header: t(langKeys.ticket_dni),
                NoFilter: true,
                accessor: 'dni'
            },
            {
                Header: t(langKeys.ticket_abandoned),
                NoFilter: true,
                accessor: 'abandoned'
            },
            {
                Header: t(langKeys.ticket_enquiries),
                NoFilter: true,
                accessor: 'enquiries'
            },
            {
                Header: t(langKeys.ticket_labels),
                NoFilter: true,
                accessor: 'labels'
            },
            {
                Header: t(langKeys.ticket_tdatime),
                NoFilter: true,
                accessor: 'tdatime'
            }
        ],
        []
    );

    const handleClickOpen = useCallback((row: any) => {
        setOpenModal(true);
        setRowSelected({ ...row, displayname: row.name, ticketnum: row.numeroticket })
    }, [mainResult]);

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        dispatch(exportData(getTicketExport({
            filters,
            sorts,
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            ...allParameters
        })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(getPaginatedTicket({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: filters,
            ...allParameters
        })))
    };

    const onClickTicket = () => {
        if (Object.keys(selectedRows).length > 0) {
            setOpenModalTicket(true);
        } else {
            const callback = () => {
                setOpenModalTicket(false);
            }
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    }

    useEffect(() => {
        dispatch(getMultiCollection([
            getCommChannelLst(),
            getValuesFromDomain("GRUPOS"),
            getValuesFromDomain("MOTIVOCIERRE"),
            getComunicationChannelDelegate(""),
            getClassificationLevel1("TIPIFICACION")
        ]));

        return () => {
            dispatch(resetCollectionPaginated());
            dispatch(resetMultiMain());
        };
    }, []);

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated])

    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                window.open(resExportData.url, '_blank');
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave])

    return (
        <div className={classes.container}>

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                    <div className={classes.title}>
                        {t(langKeys.ticket_plural)}
                    </div>
                    <div style={{display: 'flex', gap: 16}}>
                        <div>
                            All tickets
                        </div>
                        <div>
                            Open
                        </div>
                        <div>
                            Clsoed
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{textAlign: 'right'}}>
                        {/* <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            size="small"
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        // style={{ display: deleteFunction ? 'block' : 'none' }}
                        >
                            <MoreVertIcon style={{ color: '#B6B4BA' }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={(e) => {
                                setAnchorEl(null)
                                // deleteFunction && deleteFunction(e)
                            }}>
                                Reasignar
                            </MenuItem>
                            <MenuItem onClick={(e) => {
                                setAnchorEl(null)
                                // deleteFunction && deleteFunction(e)
                            }}>
                                Eliminar
                            </MenuItem>
                            <MenuItem onClick={(e) => {
                                setAnchorEl(null)
                                // deleteFunction && deleteFunction(e)
                            }}>
                                Tipificar
                            </MenuItem>
                        </Menu> */}
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                        {mainResult?.multiData?.data[0]?.data &&
                            <FieldMultiSelect
                                label={t(langKeys.channel_plural)}
                                className={classes.filterComponent}
                                key="fieldMultiSelect_channel"
                                onChange={(value) => setValue("channel", value ? value.map((o: Dictionary) => o.communicationchannelid).join() : '')}
                                variant="outlined"
                                data={mainResult?.multiData?.data[0]?.data}
                                optionDesc="communicationchanneldesc"
                                optionValue="communicationchannelid"
                                disabled={mainPaginated.loading}
                            />
                        }

                        {mainResult?.multiData?.data[1]?.data &&
                            <FieldMultiSelect
                                label={t(langKeys.group_plural)}
                                className={classes.filterComponent}
                                key="fieldMultiSelect_group"
                                onChange={(value) => setValue("usergroup", value ? value.map((o: Dictionary) => o.domainvalue).join() : '')}
                                variant="outlined"
                                data={mainResult?.multiData?.data[1]?.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                disabled={mainPaginated.loading}
                            />
                        }
                         <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            size="small"
                            color="primary"
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        // style={{ display: deleteFunction ? 'block' : 'none' }}
                        >
                            <MoreVertIcon  />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={(e) => {
                                setAnchorEl(null)
                                // deleteFunction && deleteFunction(e)
                            }}>
                                Reasignar
                            </MenuItem>
                            <MenuItem onClick={(e) => {
                                setAnchorEl(null)
                                // deleteFunction && deleteFunction(e)
                            }}>
                                Eliminar
                            </MenuItem>
                            <MenuItem onClick={(e) => {
                                setAnchorEl(null)
                                // deleteFunction && deleteFunction(e)
                            }}>
                                Tipificar
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </Box>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {/* {mainResult?.multiData?.data[0]?.data &&
                        <FieldMultiSelect
                            label={t(langKeys.channel_plural)}
                            className={classes.filterComponent}
                            key="fieldMultiSelect_channel"
                            onChange={(value) => setValue("channel", value ? value.map((o: Dictionary) => o.communicationchannelid).join() : '')}
                            variant="outlined"
                            data={mainResult?.multiData?.data[0]?.data}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                            disabled={mainPaginated.loading}
                        />
                    }

                    {mainResult?.multiData?.data[1]?.data &&
                        <FieldMultiSelect
                            label={t(langKeys.group_plural)}
                            className={classes.filterComponent}
                            key="fieldMultiSelect_group"
                            onChange={(value) => setValue("usergroup", value ? value.map((o: Dictionary) => o.domainvalue).join() : '')}
                            variant="outlined"
                            data={mainResult?.multiData?.data[1]?.data}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            disabled={mainPaginated.loading}
                        />
                    } */}
                </div>
                <div style={{ display: 'none', gap: 8, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        style={{ backgroundColor: '#FB5F5F', width: 120 }}
                        onClick={() => {
                            setAction(actions.close);
                            onClickTicket();
                        }}
                    //startIcon={<DownloadIcon />}
                    >{t(langKeys.ticket_close)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        style={{ backgroundColor: '#55BD84', width: 120 }}
                        onClick={() => {
                            setAction(actions.typify);
                            //setOpenModalTicket(true)
                            onClickTicket();
                        }}
                    //startIcon={<DownloadIcon />}
                    >{t(langKeys.ticket_typify)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}

                        style={{ width: 120 }}
                        onClick={() => {
                            setAction(actions.reasign);
                            onClickTicket();
                        }}
                    //startIcon={<DownloadIcon />}
                    >{t(langKeys.ticket_reasign)}
                    </Button>
                </div>
            </div>

            <TablePaginated
                columns={columns}
                data={mainPaginated.data}
                totalrow={totalrow}
                loading={mainPaginated.loading}
                pageCount={pageCount}
                filterrange={true}
                download={true}
                fetchData={fetchData}
                exportPersonalized={triggerExportData}
                useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
            />

            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />

            <DialogTicket
                setOpenModalTicket={setOpenModalTicket}
                setSelectedRows={setSelectedRows}
                openModalTicket={openModalTicket}
                multiData={mainResult.multiData.data}
                selectedRows={selectedRows}
                action={action}
            />

        </div >
    )
}

const DialogTicket: FC<SelectedAction> = ({ setOpenModalTicket, setSelectedRows, multiData, selectedRows, openModalTicket, action }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const dataClasificationLevel2 = useSelector(state => state.main.mainData);
    const dataClasificationLevel3 = useSelector(state => state.main.mainAux);
    const user = useSelector(state => state.login.validateToken.user);
    const dataClosingReasons = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataUser = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const dataClasificationLevel1 = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const { handleSubmit, setValue, reset, getValues } = useForm();
    const [waitSave, setWaitSave] = useState(false);
    const [sizeComment, setSizeComment] = useState(0);
    const [classificationidLevel1, setClassificationidLevel1] = useState(-1);
    const [classificationidLevel2, setClassificationidLevel2] = useState(-1);
    const [classificationidLevel3, setClassificationidLevel3] = useState(-1);
    const [allClassificationid, setAllClassificationid] = useState<Dictionary>({});

    const onSubmit = handleSubmit((data) => {
        if (waitSave) {
            const callback = () => {
                const alldifnegative = (Object.values(allClassificationid).filter(x => x != '-1'));

                switch (action) {
                    case actions.close:

                        break;
                    case actions.typify:

                        dispatch(execute(insConversationClassificationMassive(
                            (Object.keys(selectedRows).map(x => x)).join(),
                            alldifnegative[alldifnegative.length - 1],
                            user?.usr,
                            ""
                        )));

                        break;
                    case actions.reasign:

                        break;
                }

                setOpenModalTicket(false);
                setWaitSave(false);
                setAllClassificationid({});
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        } else {
            setOpenModalTicket(false);
            setWaitSave(false);
        }
    });

    useEffect(() => {
        if (classificationidLevel1 > 0) {
            dispatch(getCollection(
                getClassificationLevel2("TIPIFICACION", classificationidLevel1)
            ));
        }
    }, [classificationidLevel1]);

    useEffect(() => {
        if (classificationidLevel2 > 0) {
            dispatch(getCollectionAux(
                getClassificationLevel2("TIPIFICACION", classificationidLevel2)
            ));
        }
    }, [classificationidLevel2]);

    return (
        <DialogZyx
            title={t("ticket_" + action)}
            open={openModalTicket}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(action === actions.reasign ? langKeys.submit : langKeys.save)}
            handleClickButton1={() => setOpenModalTicket(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            {action === actions.typify ?
                <>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.select)}
                            variant="outlined"
                            onChange={(value) => {
                                setWaitSave(true);
                                setClassificationidLevel1(value ? value.classificationid : -1);
                                setClassificationidLevel2(-1);
                                setClassificationidLevel3(-1);
                                setAllClassificationid({ ...allClassificationid, level1: (value ? value.classificationid : -1), level2: -1, level3: -1 });
                            }}
                            data={dataClasificationLevel1}
                            optionDesc="description"
                            optionValue="classificationid"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.select)}
                            variant="outlined"
                            onChange={(value) => {
                                setWaitSave(true);
                                setClassificationidLevel2(value ? value.classificationid : -1);
                                setClassificationidLevel3(-1);
                                setAllClassificationid({ ...allClassificationid, level2: (value ? value.classificationid : -1), level3: -1 });
                            }}
                            data={dataClasificationLevel2.data}
                            optionDesc="description"
                            optionValue="classificationid"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.select)}
                            variant="outlined"
                            onChange={(value) => {
                                setWaitSave(true);
                                setClassificationidLevel3(value ? value.classificationid : -1);
                                setAllClassificationid({ ...allClassificationid, level3: (value ? value.classificationid : -1) });
                            }}
                            data={dataClasificationLevel3.data}
                            optionDesc="description"
                            optionValue="classificationid"
                        />
                    </div>
                </>
                :
                <>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(action === actions.close ? langKeys.ticket_reason : langKeys.ticket_user)}
                            variant="outlined"
                            onChange={(value) => {
                                setValue(action === actions.close ? "domainvalue" : "userid", action === actions.close ? value.domainvalue : value.userid);
                                setWaitSave(true);
                            }}
                            data={action === actions.close ? dataClosingReasons : dataUser}
                            optionDesc={action === actions.close ? "domaindesc" : "displayname"}
                            optionValue={action === actions.close ? "domainvalue" : "userid"}
                        />
                    </div>
                    <div className="row-zyx">
                        <TextField
                            label={t(langKeys.ticket_comment)}
                            multiline
                            variant="outlined"
                            rows={10}
                            onChange={(value) => {
                                setValue('comment', value?.target?.value);
                                setSizeComment(value?.target?.value?.length);
                            }}
                            inputProps={{ maxLength: 4000 }}
                        />
                    </div>
                    <div className="row-zyx">
                        <label style={{ textAlign: 'right' }}>{sizeComment}/4000</label>
                    </div>
                </>
            }
        </DialogZyx>
    );
}

export default Tickets;