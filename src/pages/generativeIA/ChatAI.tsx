import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { FieldEdit, TemplateBreadcrumbs, TitleDetail } from "components";
import { useTranslation } from "react-i18next";
import { resetAllMain } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { Box, Button } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    container: {
        width: '100%',
        color: "#2e2c34",
    },
    titleandcrumbs: {
        marginBottom: 12,
        marginTop: 4,
    },
    containerDetails: {
        marginTop: theme.spacing(3)
    },       
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        marginTop: 5
    },
    containerHeader: {      
        marginTop: '1rem',      
    },
}));

interface ChatAIProps {
    arrayBread: any,
    setViewSelected: (view: string) => void,
    setExternalViewSelected: (view: string) => void
}

const ChatAI: React.FC<ChatAIProps> = ({
    setViewSelected,
    arrayBread,
    setExternalViewSelected
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();

    const newArrayBread = [
        ...arrayBread,
        { id: "chatai", name: t(langKeys.chat) },
    ];

    const [waitSave, setWaitSave] = useState(false);

    useEffect(() => {
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    return (
        <div style={{ width: "100%" }}>
            <div className={classes.titleandcrumbs}>
                <div style={{flexGrow: 1}}>
                    <TemplateBreadcrumbs
                        breadcrumbs={newArrayBread}
                        handleClick={setExternalViewSelected}
                    />
                    <TitleDetail title={t(langKeys.chat)} />
                </div>
            </div>
            <div className={classes.container}>     
                <div id="chatai">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button
                            variant="contained"
                            type="button"
                            startIcon={<ArrowBackIcon color="primary" />}
                            style={{ backgroundColor: '#ffff', color: '#7721AD' }}
                            onClick={() => setViewSelected('assistantdetail')}
                        >
                            {t(langKeys.return)}
                        </Button>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: '#55BD84' }}
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>

                    <div className="row-zyx" style={{marginTop:"1.5rem"}}>
                        <FieldEdit
                            className="col-6"
                            label={t(langKeys.name)}
                            type="text"
                        />
                        <FieldEdit
                            className="col-6"
                            label={t(langKeys.description)}
                            type="text"
                        />

                     
                    </div>
                </div>
              
            </div>
        </div>
    )
}

export default ChatAI;