import { FC, useContext, useState } from "react";
import { Button, IconButton, makeStyles, TextareaAutosize, TextField } from "@material-ui/core";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { SubscriptionContext } from "./context";
import { useHistory } from "react-router-dom";
import {
    MoodBad as MoodBadIcon,
    InsertEmoticon as InsertEmoticonIcon,
    Face as  Faceicon,
} from '@material-ui/icons';
import paths from "common/constants/paths";

const useRateStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        padding: '2em',
        borderRadius: 4,
        border: '1px solid rgb(0, 0, 0, .3)',
        textAlign: 'center',
        backgroundColor: 'white',

    },
    title: {
        color: theme.palette.primary.main,
    },
    ratingOptionsRow: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: '1em',
    },
    ratingOption: {
        display: 'flex',
        flexDirection: 'column',
    },
}));

export const RateExperience: FC = () => {
    const classes = useRateStyles();
    const { t } = useTranslation();
    const history = useHistory();
    const { commonClasses } = useContext(SubscriptionContext);
    const [rating, setRating] = useState<0 | 1 | 2 | 3>(0);

    return (
        <div className={classes.root}>
            <h1 className={classes.title}>
                ¿Cómo calificaría su experiencia al suscribirse?
            </h1>
            <div className={classes.ratingOptionsRow}>
                <div className={classes.ratingOption}>
                    <IconButton
                        color={rating === 0 || rating === 1 ? "primary" : "default"}
                        onClick={() => setRating(1)}
                    >
                        <MoodBadIcon style={{ height: 74, width: 74 }} />
                    </IconButton>
                    <span>No me gusto</span>
                </div>
               <div className={classes.ratingOption}>
                    <IconButton
                        color={rating === 0 || rating === 2 ? "primary" : "default"}
                        onClick={() => setRating(2)}
                    >
                        <Faceicon style={{ height: 74, width: 74 }} />
                    </IconButton>
                    <span>Puede mejorar</span>
               </div>
                <div className={classes.ratingOption}>
                    <IconButton
                        color={rating === 0 || rating === 3 ? "primary" : "default"}
                        onClick={() => setRating(3)}
                    >
                        <InsertEmoticonIcon style={{ height: 74, width: 74 }} />
                    </IconButton>
                    <span>Me encanto</span>
                </div>
            </div>
            <TextField
                label="¿Cómo podemos mejorar?"
                variant="outlined"
                multiline
                minRows={6}
                maxRows={6}
                style={{ resize: 'none' }}
            />
            <Button
                onClick={() => window.open(paths.SIGNUPBASIC, "_self")}
                className={commonClasses.button}
                style={{ marginTop: '3em' }}
                variant="contained"
                color="primary"
                disabled={rating === 0}
            >
                <Trans i18nKey={langKeys.next} />
            </Button>
        </div>
    )
}