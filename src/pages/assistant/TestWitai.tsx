/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldEdit } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, makeStyles } from '@material-ui/core';
import { testwitai } from 'store/witia/actions';
import { useDispatch } from 'react-redux';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import TableZyx from 'components/fields/table-simple';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
}));

export const TestWitai: FC = () => {
    const { t } = useTranslation();
    const [textfield, settextfield] = useState("");
    const [response, setresponse] = useState<any>(null);
    const [dataintentions, setdataintentions] = useState<any>(null);
    const [dataentities, setdataentities] = useState<any>(null);
    const [textfieldsent, settextfieldsent] = useState(false);
    const classes = useStyles();
    const executeRes = useSelector(state => state.witai.witaitestresult);
    const dispatch = useDispatch();

    useEffect(() => {
        if(textfieldsent){
            if(!executeRes.loading && !executeRes.error){
                setresponse(executeRes.data)
                setdataintentions(executeRes.data.intents)
                setdataentities(Object.values(executeRes.data.entities).reduce((acc:any,x)=>acc.concat(x),[]))
                settextfieldsent(false);
                dispatch(showBackdrop(false));
            }else if(executeRes.error){
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.test).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                settextfieldsent(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes,textfieldsent]);
    
    const columnsintentions = React.useMemo(
        () => [
            {
                accessor: 'name',
                Header: t(langKeys.name),
                width: "auto",
                NoFilter: true
            },
            {
                accessor: 'confidence',
                Header: "Confidence",
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <div style={{textAlign:"center"}}>{row.confidence*100} %</div>;
                }
            },
        ],
        []
    );
    const columnsentities = React.useMemo(
        () => [
            {
                accessor: 'name',
                Header: t(langKeys.name),
                width: "auto",
                NoFilter: true
            },
            {
                accessor: 'value',
                Header: t(langKeys.value),
                width: "auto",
                NoFilter: true
            },
            {
                accessor: 'confidence',
                Header: "Confidence",
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <div style={{textAlign:"center"}}>{row.confidence*100} %</div>;
                }
            },
        ],
        []
    );

    return (
        <div style={{ width: '100%' }}>
            
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.message)} 
                        className="col-12"
                        onChange={(value) => {
                            settextfield(value)
                        }}
                        valueDefault={textfield}
                    />
                </div>
                <div className="row-zyx">
                    <Button
                        variant="contained"
                        type="button"
                        className='col-3'
                        color="primary"
                        style={{ backgroundColor:"#0078f6" }}
                        onClick={() => {
                            if(!!textfield){
                                setresponse(null)
                                dispatch(testwitai({
                                    model: "",
                                    message: textfield
                                }))
                                settextfieldsent(true)
                                dispatch(showBackdrop(true));
                            }
                        }}
                    >{t(langKeys.send)}</Button>
                </div>
                {response && (
                    
                    <div className="row-zyx">
                        <div className='col-6'>
                            <b>{t(langKeys.intentions)}</b> 
                            <TableZyx
                                columns={columnsintentions}
                                data={dataintentions}
                                download={false}
                                pageSizeDefault={20}
                                filterGeneral={false}
                                toolsFooter={false}
                            />
                        </div>
                        <div className='col-6'>
                            <b>{t(langKeys.entities)}</b> 
                            <TableZyx
                                columns={columnsentities}
                                data={dataentities}
                                download={false}
                                pageSizeDefault={20}
                                filterGeneral={false}
                                toolsFooter={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}