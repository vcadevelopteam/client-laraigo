import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, IconButton, Button, TextField,
    Box,
    Select,
    MenuItem
} from '@material-ui/core';
import { Add as AddIcon, FirstPage, LastPage, NavigateBefore, NavigateNext, Remove as RemoveIcon } from '@material-ui/icons';
import { convertLocalDate } from 'common/helpers';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

interface DetailProps {
    tableData: any;
    setTableData: (x: any) => void;
    selectedRows: any;
    setSelectedRows: (x: any) => void;
    loading: boolean;
}
export const EntitiesTable: React.FC<DetailProps> = ({ tableData, setTableData, selectedRows, setSelectedRows, loading}) => {
    const [data, setData] = useState(tableData);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const { t } = useTranslation();

    const [pageSize, setPageSize] = useState(20);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageCount, setPageCount] = useState(Math.ceil(data.length / pageSize));


    useEffect(() => {
        setPageCount(Math.ceil(data.length / pageSize));
    }, [data, pageSize]);

    useEffect(() => {
        setData(tableData);
    }, [tableData]);

    const handleEditRow = (index: any) => {
        setEditRowIndex(index);
    };

    const handleValueChange = (index: any, field: any, value: any) => {
        setData((prevData: any) => {
            const updatedData = [...prevData];
            updatedData[index][field] = value;
            return updatedData;
        });
    };

    const handleSynonymChange = (index: any, synonymIndex: any, value: any) => {
        setData((prevData: any) => {
            const updatedData = [...prevData];
            updatedData[index].synonyms[synonymIndex] = value;
            return updatedData;
        });
    };

    const addSynonymField = (index: any) => {
        setData((prevData: any) => {
            const updatedData = [...prevData];
            updatedData[index].synonyms.push('');
            return updatedData;
        });
    };

    const removeSynonymField = (index: any, synonymIndex: any) => {
        setData((prevData: any) => {
            const updatedData = [...prevData];
            updatedData[index].synonyms.splice(synonymIndex, 1);
            return updatedData;
        });
    };

    const handleSave = () => {
        setTableData(data);
    };

    const handleSelectRow = (value: any) => {
        setSelectedRows((prevSelected: any) =>
            prevSelected.includes(value)
                ? prevSelected.filter((row: any) => row !== value)
                : [...prevSelected, value]
        );
    };

    const isRowSelected = (value: any) => selectedRows.includes(value);

    const gotoPage = (page: any) => {
        setPageIndex(page);
    };

    const previousPage = () => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        }
    };

    const nextPage = () => {
        if (pageIndex < pageCount - 1) {
            setPageIndex(pageIndex + 1);
        }
    };

    const canNextPage = pageIndex < pageCount - 1;
    const canPreviousPage = pageIndex > 0;

    const paginatedData = data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);


    return (

        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                                    checked={selectedRows.length === data.length}
                                    color="primary"
                                    onChange={() => {
                                        if (selectedRows.length === data.length) {
                                            setSelectedRows([]);
                                        } else {
                                            setSelectedRows(data.map((item: any) => item.value));
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell style={{ width: '300px' }}>{t(langKeys.value)}</TableCell>
                            <TableCell>{t(langKeys.sinonims)}</TableCell>
                            <TableCell style={{ width: '300px' }}>{t(langKeys.date)}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((item: any, index: any) => (
                            <TableRow
                                key={index}
                                onClick={() => handleEditRow(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isRowSelected(item.value)}
                                        color="primary"
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSelectRow(item.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell style={{ width: '300px' }}>
                                    {editRowIndex === index ? (
                                        <TextField
                                            value={item.value}
                                            onChange={(e) => handleValueChange(index, 'value', e.target.value)}
                                            onBlur={handleSave} // Save on field blur
                                        />
                                    ) : (
                                        item.value
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editRowIndex === index ? (
                                        item.synonyms.map((synonym: any, synonymIndex: any) => (
                                            <div key={synonymIndex} style={{ display: 'inline-flex', marginRight: 5 }}>
                                                <TextField
                                                    value={synonym}
                                                    onChange={(e) => handleSynonymChange(index, synonymIndex, e.target.value)}
                                                    onBlur={handleSave} // Save on field blur
                                                />
                                                {synonymIndex !== item.synonyms.length - 1 && (
                                                    <IconButton onClick={() => removeSynonymField(index, synonymIndex)}><RemoveIcon /></IconButton>
                                                )}
                                                {synonymIndex === item.synonyms.length - 1 && (
                                                    <IconButton onClick={() => addSynonymField(index)}><AddIcon /></IconButton>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        (item?.synonyms||[]).join(', ')
                                    )}
                                </TableCell>
                                <TableCell style={{ width: '200px' }}>{convertLocalDate(item?.createDate || new Date()).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box className="footerTable" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
                <Box>
                    <IconButton
                        onClick={() => {
                            gotoPage(0);
                        }}
                        disabled={!canPreviousPage || loading}
                    >
                        <FirstPage />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            previousPage();
                        }}
                        disabled={!canPreviousPage || loading}
                    >
                        <NavigateBefore />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            nextPage();
                        }}
                        disabled={!canNextPage || loading}
                    >
                        <NavigateNext />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            gotoPage(pageCount - 1);
                        }}
                        disabled={!canNextPage || loading}
                    >
                        <LastPage />
                    </IconButton>
                    <Box component="span" fontSize={14}>
                        <Trans
                            i18nKey="tablePageOf"
                            values={{ currentPage: (pageCount === 0 ? 0 : pageIndex + 1), totalPages: pageCount }}
                        />
                    </Box>
                </Box>
                <Box>
                    <Select
                        disableUnderline
                        style={{ display: 'inline-flex' }}
                        value={pageSize}
                        disabled={loading}
                        onChange={e => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[5, 10, 20, 50, 100].map(pageSize => (
                            <MenuItem key={pageSize} value={pageSize}>
                                {pageSize}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box fontSize={14} display="inline" style={{ marginRight: '1rem' }}>
                        <Trans i18nKey="recordPerPage" count={pageSize} />
                    </Box>
                </Box>
            </Box>
        </>
    );
};