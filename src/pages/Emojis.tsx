/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import Box from "@material-ui/core/Box/Box";
import { langKeys } from "lang/keys";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import SearchField from "components/fields/SearchField";
import { EmojiICon } from "icons";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import { DialogZyx, FieldEdit, FieldMultiSelect, FieldSelect } from "components/fields/templates";
import Typography from "@material-ui/core/Typography/Typography";
import { useDispatch } from "react-redux";
import { execute, getCollection, getCollectionAux, getMultiCollection, resetMain } from "store/main/actions";
import { getDomainValueSel, getEmojiGroupSel, getEmojiSel, getOrgsByCorp, updateEmojiOrganization } from "common/helpers";
import { useSelector } from 'hooks';
import { Dictionary, MultiData } from "@types";
import { useForm } from "react-hook-form";
import { Button } from "@material-ui/core";
import { manageConfirmation, showBackdrop } from "store/popus/actions";

interface ModalProps {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    multiData: MultiData[];
    fetchData: () => void;
}

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%'
    },
    containerHeader: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
    root: {
        flexGrow: 1,
        width: '100%',
        paddingTop: theme.spacing(2),
    },
}));

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Typography key={"typography_" + index}>{children}</Typography>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const DetailValue: React.FC<ModalProps> = ({ openModal, setOpenModal, multiData, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const mainAuxResult = useSelector(state => state.main.mainAux);
    const dataOrganization = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const datachannels = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const { register, handleSubmit, setValue, formState: { errors }, reset, getValues } = useForm();
    const [allParameters, setAllParameters] = useState({});
    const [channelsOrganization, setChannelsOrganization] = useState<Dictionary[]>([]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(updateEmojiOrganization({ ...allParameters, emojidec: mainAuxResult.data[0].emojidec })));
            fetchData();
            setOpenModal(false);

        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    useEffect(() => {
        if (openModal) {
            reset({
                organization: '',
                emojidec: mainAuxResult.data[0]?.emojidec,
                //favoritechannels:
                //favoritechannels:
            })
        }

        setChannelsOrganization([]);
        setAllParameters({});

    }, [openModal]);

    const setValueChannel = (orgid: number) => {
        setChannelsOrganization(mainAuxResult.data.filter(x => x.orgid === orgid));
        setAllParameters({ ...allParameters, ['orgid']: getValues('organization') });
    }

    const setFavoritesChange = () => {
        setAllParameters({ ...allParameters, ['favoritechannels']: getValues('favorites') });
    }

    const setRestrictedChange = () => {
        setAllParameters({ ...allParameters, ['restrictedchannels']: getValues('restricted') });
    }

    return (
        <DialogZyx
            open={openModal}
            title="Emoji"
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                {
                    <FieldEdit
                        label="Name"
                        disabled={true}
                        className="col-6"
                        valueDefault={mainAuxResult.data[0]?.emojidec}
                    //onChange={(value) => setValue('emojidec', value)}
                    />
                }
                {
                    <FieldEdit
                        label="Category name"
                        disabled={true}
                        className="col-6"
                        valueDefault={mainAuxResult.data[0]?.categorydesc}
                    //onChange={(value) => setValue('categorydesc', value)}
                    />
                }
            </div>
            <div className="row-zyx">
                {
                    <FieldEdit
                        label={t(langKeys.corporation)}
                        disabled={true}
                        className="col-6"
                        valueDefault={user?.corpdesc}
                    //onChange={(value) => setValue('corpdesc', value)}
                    />
                }
                {
                    <FieldSelect
                        label={t(langKeys.organization)}
                        className="col-6"
                        valueDefault={getValues('organization')}
                        onChange={(value) => {
                            setValue('organization', value.orgid)
                            setValueChannel(value.orgid)
                        }}
                        data={dataOrganization}
                        optionDesc="orgdesc"
                        optionValue="orgid"
                    />
                }
            </div>
            <div className="row-zyx">
                {
                    <FieldMultiSelect
                        label="Favorites"
                        className="col-12"
                        onChange={(value) => {
                            setValue('favorites', value.map((o: Dictionary) => o.domainvalue).join())
                            setFavoritesChange();
                        }}
                        valueDefault={channelsOrganization[0]?.favoritechannels}
                        data={datachannels}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                }
                {
                    <FieldMultiSelect
                        label="Restricted"
                        className="col-12"
                        onChange={(value) => {
                            setValue('restricted', value.map((o: Dictionary) => o.domainvalue).join())
                            setRestrictedChange();
                        }}
                        valueDefault={channelsOrganization[0]?.restrictedchannels}
                        data={datachannels}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                }
            </div>
        </DialogZyx>
    );
}

const Emojis: FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const emojiGroupResult = useSelector(state => state.main.mainData.data);
    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = useState(0);

    const fetchData = () => dispatch(getCollection(getEmojiGroupSel("", true)));

    useEffect(() => {
        fetchData();

        dispatch(getMultiCollection([
            getOrgsByCorp(0),
            getDomainValueSel("TIPOCANAL")
        ]));

        return () => {
            dispatch(resetMain());
        };
    }, []);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    const handleDoubleClick = (emoji: Dictionary) => {
        setOpenDialog(true);
        dispatch(getCollectionAux(getEmojiSel(String(emoji))));
    };

    //Para implementar la busqueda de un emoji.
    const handleFiend = (valor: string) => {

    };

    return (
        <div className={classes.container}>
            <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                <span className={classes.title}>
                    {t(langKeys.emoji_plural)}
                </span>
            </Box>

            <div className={classes.root}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="scrollable force tabs example"
                    style={{ paddingBottom: 12 }}
                >
                    {
                        emojiGroupResult.map(group =>
                            <Tab
                                key={'tab_' + (group.categoryorder)}
                                label={group.categorydesc} icon={<EmojiICon />}
                                {...a11yProps(group.categoryorder - 1)} />
                        )
                    }
                </Tabs>

                <SearchField
                    colorPlaceHolder='#EAE9E9'
                    handleChangeOther={handleFiend}
                    lazy
                />

                <Box>
                    {emojiGroupResult &&
                        <>
                            {emojiGroupResult.map(group => {

                                let emojisarreglo: Dictionary[] = group.emojis;

                                return (
                                    <TabPanel
                                        key={'tabPanel_' + (group.categoryorder)}
                                        value={value}
                                        index={group.categoryorder - 1}
                                        style={{ padding: 12, backgroundColor: '#fff', marginTop: '12px' }}>
                                        {
                                            emojisarreglo &&
                                            emojisarreglo.map(x =>
                                                <Button
                                                    key={'button_' + (group.categoryorder) + "_" + x}
                                                    onDoubleClick={() => handleDoubleClick(x)}
                                                    style={{ padding: 0, fontSize: '30px' }}>
                                                    <label
                                                        key={'label_' + (group.categoryorder) + "_" + x}
                                                        style={{ fontSize: 30 }}>{x}</label>
                                                </Button>
                                            )
                                        }
                                    </TabPanel>
                                )
                            }
                            )
                            }
                        </>
                    }
                </Box>
            </div>

            <DetailValue
                openModal={openDialog}
                setOpenModal={setOpenDialog}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />

        </div>
    )
}

export default Emojis;