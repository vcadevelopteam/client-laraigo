import { Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, makeStyles } from "@material-ui/core";
import { Dictionary } from "@types";
import { FieldMultiSelectFreeSolo } from "components/fields/templates";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

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
        //row value
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
}));

interface CopiesSpanProps {
    copySelected: Dictionary;
    setCopySelected: React.Dispatch<React.SetStateAction<Dictionary>>;
}

const CopiesSpan: React.FC<CopiesSpanProps> = ({ copySelected, setCopySelected }) => {
    const classes = useStyles();

    const handleClick = (key: string) => {
        setCopySelected((x: Dictionary) => ({ ...x, [key]: true }));
    };

    return (
        <div>
            {!copySelected.cc && (
                <Tooltip title={"Añadir destinatarios a CC"}>
                    <span className={classes.cspan} onClick={() => handleClick("cc")}>
                        Cc
                    </span>
                </Tooltip>
            )}
            {!copySelected.cco && (
                <Tooltip title={"Añadir destinatarios a CCO"}>
                    <span className={classes.cspan} onClick={() => handleClick("cco")}>
                        CCO
                    </span>
                </Tooltip>
            )}
        </div>
    );
};

const dd: Dictionary[] = [];

const MailRecipients: React.FC<unknown> = () => {
    const classes = useStyles();
    const [copySelected, setCopySelected] = React.useState<Dictionary>({ cc: false, cco: false });
    const [emailCopy, setEmailCopy] = React.useState("");
    const [emailCoCopy, setEmailCoCopy] = React.useState("");

    const resetCopySelected = () => {
        setCopySelected({ cc: emailCopy !== "", cco: emailCoCopy !== "" });
    };

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
                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                                        <div style={{ flex: "1 1 auto" }}>{emailCopy}</div>
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
                                    <TableCell
                                        className={classes.rl}
                                        style={{ display: "flex", alignItems: "flex-end" }}
                                    >
                                        <span style={{ marginRight: "10px" }}>Cc</span>
                                    </TableCell>
                                    <TableCell className={classes.rv}>
                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                            <div style={{ flex: "1 1 auto" }}>
                                                <FieldMultiSelectFreeSolo
                                                    label={""}
                                                    style={{ margin: 0 }}
                                                    valueDefault={""}
                                                    onChange={(value) => {
                                                        setEmailCopy(value.join(","));
                                                    }}
                                                    data={dd}
                                                    optionDesc=""
                                                    optionValue=""
                                                />
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
                                    <TableCell
                                        className={classes.rl}
                                        style={{ display: "flex", alignItems: "flex-end" }}
                                    >
                                        <span style={{ marginRight: "10px" }}>CCO</span>
                                    </TableCell>
                                    <TableCell className={classes.rv}>
                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                            <div style={{ flex: "1 1 auto" }}>
                                                <FieldMultiSelectFreeSolo
                                                    label={""}
                                                    style={{ margin: 0 }}
                                                    valueDefault={""}
                                                    onChange={(value) => {
                                                        setEmailCoCopy(value.join(","));
                                                    }}
                                                    data={dd}
                                                    optionDesc=""
                                                    optionValue=""
                                                />
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
