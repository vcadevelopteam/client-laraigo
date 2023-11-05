import {
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Tooltip,
    makeStyles,
    ClickAwayListener,
} from "@material-ui/core";
import { Dictionary } from "@types";
import React, { useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
    table: {
        borderBottom: "1px solid #ebeaed",
        fontSize: "24px",
        "& tr td": {
            padding: "6px",
            borderBottom: "none",
            color: "black",
        },
    },
    rl: {},
    rv: {
        width: "100%",
    },
    tr: {
        display: "flex",
        lineHeight: "20px",
    },
    cspan: {
        marginRight: "10px",
        "&:hover": {
            textDecoration: "underline",
            cursor: "pointer",
        },
    },
    avatar: {
        color: "white !important",
        backgroundColor: "#7721AD",
    },
    error: {
        color: "red",
    },
    errorContainer: {
        display: "flex",
        alignItems: "center",
        color: "#ff7171",
    },
}));

interface CustomAutocompleteProps {
    value: string[];
    setValue: React.Dispatch<React.SetStateAction<string[]>>;
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({ value, setValue }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [error, setError] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");

    const emailRegex = /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/;

    const isInList = (email: string) => {
        return value.includes(email);
    };

    const isEmail = (email: string) => {
        const validate = emailRegex.test(email);
        return validate;
    };

    const isValid = (email: string) => {
        let error = null;
        if (!isEmail(email)) {
            error = `${email} no es valido`;
            error = `${email} ${t(langKeys.is_an_invalid_email)}`;
        }
        if (isInList(email)) {
            error = `${email} ya esta agregado`;
        }
        if (email === "") {
            setError("");
            return false;
        }
        if (error) {
            setError(error);
            return false;
        }
        setError("");
        return true;
    };

    const handleChange = (value: string[]) => {
        setValue(value);
    };

    const handleInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        if (evt.key === "Enter") {
            evt.stopPropagation();
            if (isValid(value)) {
                setValue((prevValue) => [...prevValue, value]);
            }
        }
    };

    const handleOnBlur = (evt) => {
        const value = evt.target.value;
        if (isValid(value)) {
            setValue((prevValue) => [...prevValue, value]);
        } else {
            setError("");
            setInputValue("");
        }
    };

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
    };

    const handlePaste = (evt: React.ClipboardEvent) => {
        evt.preventDefault();

        const paste = evt.clipboardData.getData("text");
        const emails = paste.match(emailRegex);

        if (emails) {
            const toBeAdded = emails.filter((email) => !isInList(email));
            setValue((prevValue) => {
                if (Array.isArray(prevValue)) {
                    return [...prevValue, ...toBeAdded];
                } else {
                    return [prevValue, ...toBeAdded];
                }
            });
        }
    };

    return (
        <div>
            <Autocomplete
                multiple
                freeSolo
                value={value}
                onChange={(_, newValue: string[]) => handleChange(newValue)}
                onPaste={handlePaste}
                options={[]}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip
                            key={index}
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            avatar={<Avatar className={classes.avatar}>{option.charAt(0).toUpperCase()}</Avatar>}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        onBlur={handleOnBlur}
                        onKeyDown={(e) => {
                            handleInput(e);
                        }}
                    />
                )}
            />
            {error !== "" && <div className={classes.errorContainer}>{error}</div>}
        </div>
    );
};

interface CopiesSpanProps {
    copySelected: Dictionary;
    setCopySelected: React.Dispatch<React.SetStateAction<Dictionary>>;
}

const CopiesSpan: React.FC<CopiesSpanProps> = ({ copySelected, setCopySelected }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const handleClick = (key: string) => {
        setCopySelected((x: Dictionary) => ({ ...x, [key]: true }));
    };

    return (
        <div>
            {!copySelected.cc && (
                <Tooltip title={`${t(langKeys.add_cc_email)}`}>
                    <span className={classes.cspan} onClick={() => handleClick("cc")}>
                        Cc
                    </span>
                </Tooltip>
            )}
            {!copySelected.cco && (
                <Tooltip title={`${t(langKeys.add_cco_email)}`}>
                    <span className={classes.cspan} onClick={() => handleClick("cco")}>
                        CCO
                    </span>
                </Tooltip>
            )}
        </div>
    );
};

interface MailRecipientsProps {
    setCopyEmails: React.Dispatch<React.SetStateAction<Dictionary>>;
}

const MailRecipients: React.FC<MailRecipientsProps> = ({ setCopyEmails }) => {
    const classes = useStyles();
    const [emailCopy, setEmailCopy] = React.useState<string[]>([]);
    const [emailCoCopy, setEmailCoCopy] = React.useState<string[]>([]);
    const person = useSelector((state) => state.inbox.person.data);
    const [copySelected, setCopySelected] = React.useState<Dictionary>({ cc: false, cco: false });

    const resetCopySelected = () => {
        setCopySelected({ cc: Boolean(emailCopy.length), cco: Boolean(emailCoCopy.length) });
    };

    useEffect(() => {
        setCopyEmails({ cc: emailCopy.join(";"), cco: emailCoCopy.join(";") });
    }, [emailCopy, emailCoCopy]);

    return (
        <ClickAwayListener onClickAway={resetCopySelected}>
            <div>
                <TableContainer>
                    <Table className={classes.table}>
                        <TableBody>
                            <TableRow className={classes.tr}>
                                <TableCell className={classes.rl}>
                                    <span style={{ marginRight: "10px" }}>Para</span>
                                </TableCell>
                                <TableCell className={classes.rv}>
                                    <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                        <div style={{ flex: "1 1 auto" }}>{person?.email}</div>
                                        <div>
                                            {copySelected.cc === false && copySelected.cco === false && (
                                                <CopiesSpan
                                                    copySelected={copySelected}
                                                    setCopySelected={setCopySelected}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {copySelected.cc === true && (
                                <TableRow className={classes.tr}>
                                    <TableCell className={classes.rl} style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "10px" }}>Cc</span>
                                    </TableCell>
                                    <TableCell className={classes.rv}>
                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                            <div style={{ flex: "1 1 auto" }}>
                                                <CustomAutocomplete value={emailCopy} setValue={setEmailCopy} />
                                            </div>
                                            <div>
                                                {copySelected.cc === true && copySelected.cco === false && (
                                                    <CopiesSpan
                                                        copySelected={copySelected}
                                                        setCopySelected={setCopySelected}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {copySelected.cco === true && (
                                <TableRow className={classes.tr}>
                                    <TableCell className={classes.rl} style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "10px" }}>CCO</span>
                                    </TableCell>
                                    <TableCell className={classes.rv}>
                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                            <div style={{ flex: "1 1 auto" }}>
                                                <CustomAutocomplete value={emailCoCopy} setValue={setEmailCoCopy} />
                                            </div>
                                            <div>
                                                {copySelected.cc === false && copySelected.cco === true && (
                                                    <CopiesSpan
                                                        copySelected={copySelected}
                                                        setCopySelected={setCopySelected}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </ClickAwayListener>
    );
};

export default MailRecipients;
