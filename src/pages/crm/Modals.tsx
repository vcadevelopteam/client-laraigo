import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { SaveActivityModal, TabPanelLogNote } from "./LeadForm";
import { getAdvisers, saveLeadActivity, saveLeadLogNote } from "store/lead/actions";
import { adviserSel, leadActivityIns, leadLogNotesIns } from "common/helpers";
import { Box, Button, makeStyles, Modal } from "@material-ui/core";
import { TitleDetail } from "components";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";

interface IModalProps {
    name: string;
    open: boolean;
    payload: Dictionary | null;
  }

interface IFCModalProps {
    gridModalProps: IModalProps;
    setGridModal: (data: any) => void;
}

const useSelectPersonModalStyles = makeStyles(theme => ({
    root: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: "80%",
        maxHeight: "80%",
        width: '80%',
        backgroundColor: 'white',
        padding: "16px",
        overflowY: 'auto',
    },
}));

export const NewActivityModal: FC<IFCModalProps> = ({ gridModalProps, setGridModal }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (gridModalProps.name === 'ACTIVITY' && gridModalProps.open === true) {
            dispatch(getAdvisers(adviserSel()));
        }
    }, [dispatch, gridModalProps])

    const submitActivitiesModal = (data: any) => {
        dispatch(saveLeadActivity(leadActivityIns(data)));
        setGridModal({ name: '', open: false, payload: null })
    }
    
    return (
        <SaveActivityModal
            onClose={() => setGridModal({ name: '', open: false, payload: null })}
            open={gridModalProps.name === 'ACTIVITY' && gridModalProps.open}
            activity={null}
            leadid={gridModalProps.payload?.leadid}
            onSubmit={submitActivitiesModal}
        />
    )
}

export const NewNoteModal: FC<IFCModalProps> = ({ gridModalProps, setGridModal }) => {
    const dispatch = useDispatch();
    const modalClasses = useSelectPersonModalStyles();
    const { t } = useTranslation();

    useEffect(() => {
        if (gridModalProps.name === 'NOTE' && gridModalProps.open === true) {

        }
    }, [dispatch, gridModalProps])

    const submitNotesModal = (data: any) => {
        dispatch(saveLeadLogNote(leadLogNotesIns(data)));
        setGridModal({ name: '', open: false, payload: null });
    }
    
    return (
        <Modal
            open={gridModalProps.name === 'NOTE' && gridModalProps.open}
            onClose={() => setGridModal({ name: '', open: false, payload: null })}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={modalClasses.root} style={{ height: '480px' }}>
                <TitleDetail title={t(langKeys.logNote_plural)} />
                <div style={{ height: '1em' }} />
                <TabPanelLogNote
                    readOnly={false}
                    loading={false}
                    notes={[]}
                    leadId={gridModalProps.payload?.leadid}
                    onSubmit={submitNotesModal}
                    AdditionalButtons={
                        () => (
                            <Button
                                variant="contained"
                                color="primary"
                                style={{marginLeft: '5px'}}
                                onClick={() => setGridModal({ name: '', open: false, payload: null })}
                            >
                                {t(langKeys.cancel)}
                            </Button>
                        )
                    }
                />
            </Box>
        </Modal>
    )
}