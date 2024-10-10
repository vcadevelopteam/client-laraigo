import { Button, IconButton, makeStyles, withStyles } from "@material-ui/core"
import { FieldEditMulti, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import CloseIcon from '@material-ui/icons/Close';
import { useState } from "react";
import { Dictionary } from "@types";
import { WatsonService } from "network";
import { useDispatch } from "react-redux";
import { showSnackbar } from "store/popus/actions";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    container: {
        overflowX: 'hidden',
        marginLeft: 10,
        borderLeft: '1px solid #EBEAED',
        width: 500,
        padding: "0px 0px 20px 20px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
    },
    eyeicon: {
        color: "#7721ad",
        cursor: "pointer",

    },
}));

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

export const ModelTestDrawer: React.FC<{ setOpenDrawer: (x: boolean) => void, data: any }> = ({ setOpenDrawer, data }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<Dictionary[]>([
    ]);


    const handleSubmitText = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            WatsonService.rasatest({ watsonid: data?.watsonid || 0, text: text }).then(
                (axios_result) => {
                    if (axios_result.status === 200) {
                        setMessages([...messages, axios_result.data.data])
                    }
                }
            );
        } catch (error) {
            dispatch(showSnackbar({ show: true, severity: "error", message: "error_unexpected_error" }))
        }
        setText("");
    };

    return <div className={classes.container}>
        <div style={{ width: "100%" }}>
            <div style={{ width: "100%", justifyContent: "flex-end", display: "flex" }}>
                <IconButton size="small" onClick={() => { setOpenDrawer(false) }}>
                    <CloseIcon style={{ color: '#8F92A1' }} />
                </IconButton>
            </div>
        </div>
        <div>
            <span className={classes.title}>
                {t(langKeys.speakwithyourmodel)}
            </span>
        </div>
        <div style={{ width: "100%" }}>
            <div style={{ width: "100%", justifyContent: "flex-end", display: "flex" }}>
                <Button color="primary" onClick={() => { setMessages([]) }}>{t(langKeys.clear)}</Button>
            </div>
        </div>
        <div >
            {messages.map(x => {
                console.log(x)
                const transformedIntents = x?.intents?.map((intent: any) => ({
                    ...intent,
                    intent: `#${intent.intent}`, // Agregamos el '#' a cada valor de 'intent'
                })) || [];
                const testarray = [
                    { intent: "test1", confidence: 0.25 },
                    { intent: "2231azzzz", confidence: 0.25 }
                ]
                return <div style={{ paddingTop: 10 }}>
                    <div style={{ borderLeft: "3px solid grey", paddingLeft: 5 }}>{x.input.text}</div>
                    <div style={{ padding: "5px 0", display: "flex" }}>
                        <div style={{ width: "100%" }} >
                            <FieldSelect data={transformedIntents} optionValue={"intent"} valueDefault={transformedIntents?.[0]?.intent || ""} optionDesc={"intent"} disabled />
                        </div>
                        <HtmlTooltip
                            title={
                                <>
                                    {testarray?.map((intent: any, i: number) => {
                                        return <div
                                            key={i}
                                            style={{
                                                color: i === 0 ? "#7721ad" : "black",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%", 
                                                gap: 3
                                            }}
                                        >
                                            <span>#{intent.intent}: </span>
                                            <span>{intent.confidence.toFixed(2)}</span>
                                        </div>
                                    })}
                                </>
                            }
                        >
                            <VisibilityIcon className={classes.eyeicon} />
                        </HtmlTooltip>
                    </div>
                    <a href="url" style={{ color: "#7721ad", paddingTop: 5 }}>@{x?.entities?.[0]?.entity || ""}: {x?.entities?.[0]?.value || ""}</a>
                </div>
            })}
        </div>
        <div style={{ width: "100%", marginTop: "auto" }}>
            <Button variant="contained" color="primary" disabled={!text} style={{ width: "100%", marginBottom: 10 }} onClick={handleSubmitText}>
                {t(langKeys.send)}
            </Button>
            <FieldEditMulti
                variant="outlined"
                rows={2}
                valueDefault={text}
                onChange={(e) => { setText(e) }}
                placeholder={t(langKeys.modelplaceholder)}
            />
        </div>
    </div>
}