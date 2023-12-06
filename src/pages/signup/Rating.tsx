import { Button, Collapse, IconButton, makeStyles, TextField } from "@material-ui/core";
import { Face, InsertEmoticon, MoodBad } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { SubscriptionContext } from "./context";
import { Trans, useTranslation } from "react-i18next";

import paths from "common/constants/paths";
import React, { FC, useContext, useState } from "react";

const useRateStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        border: "1px solid rgb(0, 0, 0, .3)",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        padding: "2em",
        textAlign: "center",
    },
    title: {
        color: theme.palette.primary.main,
    },
    ratingOptionsRow: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: "1em",
        width: "100%",
    },
    ratingOption: {
        display: "flex",
        flexDirection: "column",
    },
}));

const RateExperience: FC = () => {
    const { commonClasses } = useContext(SubscriptionContext);
    const { t } = useTranslation();

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState<0 | 1 | 2 | 3>(0);

    const classes = useRateStyles();

    return (
        <div className={classes.root}>
            <h1 className={classes.title}>{t(langKeys.subscription_signup_rating_01)}</h1>
            <div className={classes.ratingOptionsRow}>
                <div className={classes.ratingOption}>
                    <IconButton
                        color={rating === 0 || rating === 1 ? "primary" : "default"}
                        onClick={() => setRating(1)}
                    >
                        <MoodBad style={{ height: 74, width: 74 }} />
                    </IconButton>
                    <span>{t(langKeys.subscription_signup_rating_02)}</span>
                </div>
                <div className={classes.ratingOption}>
                    <IconButton
                        color={rating === 0 || rating === 2 ? "primary" : "default"}
                        onClick={() => setRating(2)}
                    >
                        <Face style={{ height: 74, width: 74 }} />
                    </IconButton>
                    <span>{t(langKeys.subscription_signup_rating_03)}</span>
                </div>
                <div className={classes.ratingOption}>
                    <IconButton
                        color={rating === 0 || rating === 3 ? "primary" : "default"}
                        onClick={() => setRating(3)}
                    >
                        <InsertEmoticon style={{ height: 74, width: 74 }} />
                    </IconButton>
                    <span>{t(langKeys.subscription_signup_rating_04)}</span>
                </div>
            </div>
            <Collapse in={rating !== 0}>
                <TextField
                    fullWidth
                    label={t(langKeys.subscription_signup_rating_05)}
                    maxRows={6}
                    minRows={6}
                    multiline
                    onChange={(e) => setComment(e.target.value)}
                    style={{ resize: "none" }}
                    value={comment}
                    variant="outlined"
                />
            </Collapse>
            <Button
                className={commonClasses.button}
                color="primary"
                disabled={rating === 0 || comment.length === 0}
                onClick={() => window.open(paths.SIGNIN, "_self")}
                style={{ marginTop: "3em" }}
                variant="contained"
            >
                <Trans i18nKey={langKeys.next} />
            </Button>
        </div>
    );
};

export default RateExperience;