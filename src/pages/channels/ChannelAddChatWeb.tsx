import React, { FC, useState } from 'react';
import { AppBar, Box, Button, Input, makeStyles, Tab, Tabs, Typography, TextField, Grid, Select, IconButton, FormControl, InputLabel, MenuItem, Divider } from '@material-ui/core';
import { IOSSwitch } from 'components';
import { Trans, useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { langKeys } from 'lang/keys';
import { ChromePicker, ColorChangeHandler } from 'react-color';
import { ArrowDropDown, Close, CloudUpload } from '@material-ui/icons';

interface TabPanelProps {
    value: string;
    index: string;
}

interface FieldTemplate {
    text: string;
    node: (onClose: (key: string) => void) => React.ReactNode;
}

const useTabPanelStyles = makeStyles(theme => ({
    root: {
        border: '#A59F9F 1px solid',
        borderRadius: 6,
    },
}));

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    const classes = useTabPanelStyles();

    return (
        <div
            role="tabpanel"
            hidden={value != index}
            className={classes.root}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            style={{ display: value === index ? 'block' : 'none' }}
        >
            <Box p={3}>
                {children}
            </Box>
        </div>
    );
}

const useTabInterfacetyles = makeStyles(theme => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    icon: {
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
        }
    },
    imgContainer: {
        borderRadius: 20,
        backgroundColor: 'white',
        width: 157,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        height: '80%',
        width: 'auto',
    },
}));

const TabPanelInterface: FC = () => {
    const classes = useTabInterfacetyles();
    const [chatBtn, setChatBtn] = useState<File | null>(null);
    const [headerBtn, setHeaderBtn] = useState<File | null>(null);
    const [botBtn, setBotBtn] = useState<File | null>(null);

    const handleChatBtnClick = () => {
        const input = document.getElementById('chatBtnInput');
        input!.click();
    }

    const handleHeaderBtnClick = () => {
        const input = document.getElementById('headerBtnInput');
        input!.click();
    }

    const handleBotBtnClick = () => {
        const input = document.getElementById('botBtnInput');
        input!.click();
    }

    const onChangeChatInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setChatBtn(e.target.files[0]);
    }

    const onChangeHeaderInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setHeaderBtn(e.target.files[0]);
    }

    const onChangeBotInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setBotBtn(e.target.files[0]);
    }

    const handleCleanChatInput = () => {
        if (!chatBtn) return;
        const input = document.getElementById('chatBtnInput') as HTMLInputElement;
        input.value = "";
        setChatBtn(null);
    }

    const handleCleanHeaderInput = () => {
        if (!headerBtn) return;
        const input = document.getElementById('headerBtnInput') as HTMLInputElement;
        input.value = "";
        setHeaderBtn(null);
    }

    const handleCleanBotInput = () => {
        if (!botBtn) return;
        const input = document.getElementById('botBtnInput') as HTMLInputElement;
        input.value = "";
        setBotBtn(null);
    }

    return (
        <Grid container direction="column">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>Título</label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder="Título de la cabecera del chat"
                                name="titulo"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>Subtitulo</label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder="Subtitulo de la cabecera del chat"
                                name="subtitulo"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>Botón del chat</label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div className={classes.imgContainer}>
                                    {chatBtn && <img src={URL.createObjectURL(chatBtn)} className={classes.img} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="chatBtnInput"
                                        type="file"
                                        onChange={onChangeChatInput}
                                    />
                                    <IconButton onClick={handleChatBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanChatInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>Cabecera</label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div className={classes.imgContainer}>
                                    {headerBtn && <img src={URL.createObjectURL(headerBtn)} className={classes.img} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="headerBtnInput"
                                        type="file"
                                        onChange={onChangeHeaderInput}
                                    />
                                    <IconButton onClick={handleHeaderBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanHeaderInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <label className={classes.text}>Botón del Bot</label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div className={classes.imgContainer}>
                                    {botBtn && <img src={URL.createObjectURL(botBtn)} className={classes.img} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="botBtnInput"
                                        type="file"
                                        onChange={onChangeBotInput}
                                    />
                                    <IconButton onClick={handleBotBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanBotInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

const useColorInputStyles = makeStyles(theme => ({
    colorInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '1%',
        height: 30,
        cursor: 'pointer',
        borderRadius: 2,
        position: 'relative',
    },
    colorInput: {
        position: 'relative',
        flexGrow: 1,
        borderRadius: '0 2px 2px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    colorInputSplash: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        borderRadius: 2,
        '&:hover': {
            backgroundColor: 'black',
            opacity: .15,
        },
    },
    colorInputPreview: {
        flexGrow: 1,
        borderRadius: 2,
    },
    popover: {
        position: 'absolute',
        zIndex: 2,
        top: 36,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
}));

const ColorInput: FC<{ hex: string, onChange: ColorChangeHandler }> = ({ hex, onChange }) => {
    const classes = useColorInputStyles();
    const [open, setOpen] = useState(false);

    const iconStyle = { style: { width: 'unset', height: 'unset' } };
    const Icon: FC = () => open ? <Close {...iconStyle} /> : <ArrowDropDown {...iconStyle} />;

    return (
        <div className={classes.colorInputContainer}>
            <div style={{ backgroundColor: hex }} className={classes.colorInputPreview} />
            <div className={classes.colorInput} onClick={() => setOpen(!open)}>
                <Icon />
                <div className={classes.colorInputSplash} />
            </div>
            {open && (
                <div className={classes.popover}>
                    <ChromePicker color={hex} onChange={onChange} />
                </div>
            )}
        </div>
    );
}

const useTabColorStyles = makeStyles(theme => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    colorOption: {
        width: 28,
        height: 28,
        padding: 0,
        minWidth: 28,
        minHeight: 28,
    },
}));

const TabPanelColors: FC = () => {
    const classes = useTabColorStyles();
    const [color, setColor] = useState('#fff');

    return (
        <Grid container direction="row">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>Cabecera de chat</label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={color} onChange={e => setColor(e.hex)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>Fondo de chat</label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={color} onChange={e => setColor(e.hex)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>Borde de chat</label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={color} onChange={e => setColor(e.hex)} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>Mensajes de cliente</label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={color} onChange={e => setColor(e.hex)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <label className={classes.text}>Mensaje de bot</label>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <ColorInput hex={color} onChange={e => setColor(e.hex)} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

const useTemplateStyles = makeStyles(theme => ({
    root: {
        border: `${theme.palette.primary.main} 1px solid`,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
        margin: theme.spacing(1),
    },
    title: {
        fontWeight: 700,
        fontSize: 20,
        color: theme.palette.primary.main,
        margin: '0 0 12 0',
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    fieldContainer: {
        margin: theme.spacing(1),
    },
    headertitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    closeBtn: {
        border: `${theme.palette.primary.main} 1px solid`,
    },
}));

const NameTemplate: FC<{ onClose: () => void }> = ({ onClose }) => {
    const classes = useTemplateStyles();
    const [required, setRequired] = useState(true);

    return (
        <div className={classes.root}>
            <div className={classes.headertitle}>
                <label className={clsx(classes.title, classes.fieldContainer)}>Name</label>
                <IconButton color="primary" onClick={onClose} className={classes.closeBtn}>
                    <Close color="primary" className="fa fa-plus-circle" />
                </IconButton>
            </div>
            <div style={{ height: 18 }} />
            <Grid container direction="column">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                            <Grid container direction="column">
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row" style={{ minHeight: 40 }}>
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>Required</label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <IOSSwitch checked={required} onChange={(_, v) => setRequired(v)} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row">
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>Label</label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <TextField placeholder="Name" variant="outlined" size="small" fullWidth />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                            <Grid container direction="column">
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row">
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>Placeholder</label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <TextField placeholder="Enter your name" variant="outlined" size="small" fullWidth />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box m={1}>
                                        <Grid container direction="row">
                                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                                <label className={classes.text}>Error text</label>
                                            </Grid>
                                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                                <TextField placeholder="Please enter your name" variant="outlined" size="small" fullWidth />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider style={{ margin: '22px 0' }} />
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Box m={1}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={2}>
                                <label className={classes.text}>Input validation</label>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={10}>
                                <TextField placeholder="regex" variant="outlined" size="small" fullWidth />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Box m={1}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={2}>
                                <label className={classes.text}>Validation on keychange</label>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={10}>
                                <TextField placeholder="regex" variant="outlined" size="small" fullWidth />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

const useTabFormStyles = makeStyles(theme => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
}));

const NAME_FIELD = "NAME_FIELD";
const LASTNAME_FIELD = "LASTNAME_FIELD";

const templates: { [x: string]: FieldTemplate } = {
    [NAME_FIELD]: {
        text: 'Name',
        node: (onClose) => <NameTemplate onClose={() => onClose(NAME_FIELD)} key={NAME_FIELD} />,
    },
    [LASTNAME_FIELD]: {
        text: 'Lastname',
        node: (onClose) => <NameTemplate onClose={() => onClose(LASTNAME_FIELD)} key={LASTNAME_FIELD} />,
    },
};

const TabPanelForm: FC = () => {
    const classes = useTabFormStyles();
    const [enabled, setEnabled] = useState(true);
    const [fieldTemplate, setFieldTemplate] = useState<string>("");
    const [fields, setFields] = useState<FieldTemplate[]>([]);

    const handleCloseTemplate = (key: string) => {
        const newFields = fields.filter(e => e != templates[key]);
        setFields(newFields);
    };

    const handleAddTemplate = () => {
        if (fieldTemplate === "") return;

        setFields([...fields, templates[fieldTemplate]]);
        setFieldTemplate("");
    }

    const getMenuTemplates = () => {
        const temp: React.ReactNode[] = [];
        for (const key in templates) {
            if (fields.includes(templates[key])) continue;
            temp.push(<MenuItem key={key} value={key}>{templates[key].text}</MenuItem>);
        }
        return temp;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container direction="column">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Typography className={classes.text}>Do you want to add the form to you site?</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <IOSSwitch checked={enabled} onChange={(_, v) => setEnabled(v)} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Typography className={classes.text}>Select a field</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <FormControl style={{ width: 160, marginRight: 20 }}>
                                <Select
                                    variant="outlined"
                                    value={fieldTemplate}
                                    onChange={e => setFieldTemplate(e.target.value as string)}
                                    displayEmpty
                                    style={{ height: 40 }}
                                >
                                    <MenuItem value={""}>
                                        <em>Select -</em>
                                    </MenuItem>
                                    {getMenuTemplates()}
                                </Select>
                            </FormControl>
                            <Button
                                disabled={fieldTemplate === undefined}
                                variant="contained"
                                color="primary"
                                style={{ height: 40, minHeight: 40 }}
                                onClick={handleAddTemplate}
                            >
                                Add +
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {fields.map(e => e.node(handleCloseTemplate))}
        </div>
    );
}

const useTabBubbleStyles = makeStyles(theme => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    icon: {
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
        }
    },
    imgContainer: {
        borderRadius: 20,
        backgroundColor: 'white',
        width: 157,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        height: '80%',
        width: 'auto',
    },
}));

const TabPanelBubble: FC = () => {
    const classes = useTabBubbleStyles();
    const [enabled, setEnabled] = useState(true);
    const [waitingImg, setWaitingImg] = useState<File | null>(null);

    const handleWaitingBtnClick = () => {
        const input = document.getElementById('waitingBtnInput');
        input!.click();
    }

    const onChangeWaitingInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setWaitingImg(e.target.files[0]);
    }

    const handleCleanWaitingInput = () => {
        if (!waitingImg) return;
        const input = document.getElementById('waitingBtnInput') as HTMLInputElement;
        input.value = "";
        setWaitingImg(null);
    }

    return (
        <Grid container direction="column">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>Estilo de mensaje de espera</label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div className={classes.imgContainer}>
                                    {waitingImg && <img src={URL.createObjectURL(waitingImg)} className={classes.img} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="waitingBtnInput"
                                        type="file"
                                        onChange={onChangeWaitingInput}
                                    />
                                    <IconButton onClick={handleWaitingBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanWaitingInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>Habilitar mensaje de espera</label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <IOSSwitch checked={enabled} onChange={(_, v) => setEnabled(v)} />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box m={1} style={{ display: enabled ? 'block' : 'none' }}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>Texto</label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                placeholder="Texto del mensaje"
                                name="texto"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

const useTabExtrasStyles = makeStyles(theme => ({
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
}));

const TabPanelExtras: FC = () => {
    const classes = useTabExtrasStyles();
    const [enableBotname, setEnableBotName] = useState(false);

    return (
        <Grid container direction="column">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Subir archivos</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Subir video</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Enviar ubicación</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Subir imagenes</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Subir audio</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Recargar chat</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Powered by</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Divider style={{ margin: '22px 0 38px 0' }} />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Input siempre activo</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Evento de abandono</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Sonido de mensaje nuevo</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Historial en base a formulario</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Enviar metadata</label>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={true} onChange={(_, v) => {}} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                    variant="outlined"
                    placeholder="CSS Header"
                    multiline
                    minRows={5}
                    maxRows={10}
                    fullWidth
                />
            </Grid>
            <div style={{ height: 20 }} />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                    variant="outlined"
                    placeholder="JS Script"
                    multiline
                    minRows={5}
                    maxRows={10}
                    fullWidth
                />
            </Grid>
            <Divider style={{ margin: '22px 0 38px 0' }} />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={10} md={9} lg={9} xl={9}>
                                <label className={classes.text}>Activar nombre del bot</label>
                            </Grid>
                            <Grid item xs={12} sm={2} md={3} lg={3} xl={3}>
                                <IOSSwitch checked={enableBotname} onChange={(_, v) => setEnableBotName(v)} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: enableBotname ? 'block' : 'none' }}>
                <TextField
                    variant="outlined"
                    placeholder="Nombre del bot"
                    fullWidth
                />
            </Grid>
        </Grid>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        width: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontWeight: 500,
        fontSize: 32,
        margin: '20px 0',
        color: theme.palette.primary.main,
    },
    subtitle: {
        margin: '8px 0',
        fontSize: 20,
        fontWeight: 500,
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#A59F9F',
    },
    scriptPreview: {
        width: 'inherit',
        height: 111,
        minHeight: 111,
        backgroundColor: 'white',
        border: '#A59F9F 1px solid',
        margin: '24px 0',
        padding: theme.spacing(2),
        position: 'relative',
        overflowWrap: 'break-word',
        overflow: 'hidden',
    },
    scriptPreviewGradient: {
        backgroundImage: 'linear-gradient(transparent, white)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    scriptPreviewCopyBtn: {
        height: 45,
        width: 123,
        minHeight: 45,
        minWidth: 123,
        top: '50%',
        transform: 'translateY(-50%)',
        right: theme.spacing(2),
        position: 'absolute',
        alignSelf: 'center',
    },
    scriptPreviewFullViewTxt: {
        margin: 0,
        position: 'absolute',
        bottom: theme.spacing(1),
        left: '50%',
        transform: 'translateX(-50%)',
        height: 24,

        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',

        '&:hover': {
            cursor: 'pointer',
        }
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        // width: 130,
        height: 45,
        maxWidth: 'unset',
        border: '#A59F9F 1px solid',
        borderRadius: 6,
        backgroundColor: 'white',
        flexGrow: 1,
    },
    activetab: {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
    }
}));

const script = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Laraigo c-commerce you need"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /> -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <title>Laraigo</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;

export const ChannelAddChatWeb: FC = () => {
    const classes = useStyles();
    const [tabIndex, setTabIndes] = useState('0');

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>Activate Laraigo on your website</h2>
            <Typography className={classes.subtitle}>
                Copy and paste this code on your site for the chatbot to start attracting customers.
            </Typography>
            <div style={{ height: 8 }} />
            <Typography className={classes.text}>
                Paste it into the {'<body />'} tag in your web page code or send it to your developer.
            </Typography>
            <div className={classes.scriptPreview}>
                <code lang="html">{script}</code>
                <div className={classes.scriptPreviewGradient} />
                <h5 className={classes.scriptPreviewFullViewTxt} onClick={() => console.log('ss')}>
                    Ver completo
                </h5>
                <Button variant="contained" color="primary" className={classes.scriptPreviewCopyBtn}>
                    Copy
                </Button>
            </div>
            <div style={{ height: 20 }} />
            <AppBar position="static" elevation={0}>
                <Tabs
                    value={tabIndex}
                    onChange={(_, i: string) => setTabIndes(i)}
                    aria-label="simple tabs example"
                    className={classes.tabs}
                    TabIndicatorProps={{ style: { display: 'none' } }}
                >
                    <Tab className={clsx(classes.tab, tabIndex === "0" && classes.activetab)} label="Interfaz" value="0" />
                    <Tab className={clsx(classes.tab, tabIndex === "1" && classes.activetab)} label="Colores" value="1" />
                    <Tab className={clsx(classes.tab, tabIndex === "2" && classes.activetab)} label="Formulario" value="2" />
                    <Tab className={clsx(classes.tab, tabIndex === "3" && classes.activetab)} label="Bubble" value="3" />
                    <Tab className={clsx(classes.tab, tabIndex === "4" && classes.activetab)} label="Extras" value="4" />
                </Tabs>
            </AppBar>
            <TabPanel value="0" index={tabIndex}><TabPanelInterface /></TabPanel>
            <TabPanel value="1" index={tabIndex}><TabPanelColors /></TabPanel>
            <TabPanel value="2" index={tabIndex}><TabPanelForm /></TabPanel>
            <TabPanel value="3" index={tabIndex}><TabPanelBubble /></TabPanel>
            <TabPanel value="4" index={tabIndex}><TabPanelExtras /></TabPanel>
            <div style={{ height: 20 }} />
        </div>
    );
};
