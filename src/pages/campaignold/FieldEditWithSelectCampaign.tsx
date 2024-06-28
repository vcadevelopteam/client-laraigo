import { ICampaign } from "@types";
import { filterPipe } from "common/helpers";
import { FieldEditWithSelect } from "components/fields/templates";
import { useState } from "react";
import { set } from 'lodash';

type FieldEditWithSelectCampaignProps = {
    title: string,
    message: string,
    onChange: (x: any) => void,
    readOnly: boolean,
    tablevariable: any[],
    detaildata: any,
    field: string,
    rows: number,
    setDetaildata: (data: any) => void
};

class VariableHandler {
    show: boolean;
    item: any;
    inputkey: string;
    inputvalue: string;
    range: number[];
    top: number;
    left: number;
    changer: ({ ...param }) => any;
    constructor() {
        this.show = false;
        this.item = null;
        this.inputkey = '';
        this.inputvalue = '';
        this.range = [-1, -1];
        this.changer = ({ ...param }) => null;
        this.top = 0;
        this.left = 0;
    }
}

const FieldEditWithSelectCampaign: React.FC<
    FieldEditWithSelectCampaignProps
> = ({ title, message, onChange, readOnly, tablevariable, detaildata, field, setDetaildata, rows
}) => {
        const [variableHandler, setVariableHandler] = useState<VariableHandler>(new VariableHandler());
        const [tablevariableShow, setTableVariableShow] = useState<any[]>([]);
        const toggleVariableSelect = (e: React.ChangeEvent<any>, item: any, inputkey: string, changefunc: ({ ...param }) => void, filter = true) => {

            let elem = e.target;
            if (elem) {
                let selectionStart = elem.selectionStart || 0;
                let lines = (elem.value || '').substr(0, selectionStart).split('\n');
                let row = lines.length - 1;
                let column = lines[row].length * 3;
                let startIndex = (elem.value || '').slice(0, selectionStart || 0)?.lastIndexOf('{{');
                let partialText = '';
                if (startIndex !== -1) {
                    if (elem.value.slice(startIndex, selectionStart).indexOf(' ') === -1
                        && elem.value.slice(startIndex, selectionStart).indexOf('}}') === -1
                        && elem.value[selectionStart - 1] !== '}') {
                        partialText = elem.value.slice(startIndex + 2, selectionStart);
                        let rightText = (elem.value || '').slice(selectionStart, elem.value.length);
                        let selectionEnd = rightText.indexOf('}}') !== -1 ? rightText.indexOf('}}') : 0;
                        let endIndex = startIndex + partialText.length + selectionEnd + 4;
                        setVariableHandler({
                            show: true,
                            item: item,
                            inputkey: inputkey,
                            inputvalue: elem.value,
                            range: [startIndex, endIndex],
                            changer: ({ ...param }) => changefunc({ ...param }),
                            top: 24 + row * 21,
                            left: column
                        })
                        if (filter) {
                            setTableVariableShow(filterPipe(tablevariable, 'description', partialText, '%'));
                        }
                        else {
                            setTableVariableShow(tablevariable);
                        }
                    }
                    else {
                        setVariableHandler(new VariableHandler());
                    }
                }
                else {
                    setVariableHandler(new VariableHandler());
                }
            }
        }
        const selectionVariableSelect = (e: React.ChangeEvent<any>, value: string) => {
            const { item, inputkey, inputvalue, range, changer } = variableHandler;
            if (range[1] !== -1 && (range[1] > range[0] || range[0] !== -1)) {
                const updatedItem = { ...item };
                set(updatedItem, inputkey, inputvalue.substring(0, range[0] + 2)
                    + value
                    + (inputvalue[range[1] - 2] !== '}' ? '}}' : '')
                    + inputvalue.substring(range[1] - 2)
                );
        
                changer(updatedItem);
                setVariableHandler(new VariableHandler());
            }
        }
        return <div className="row-zyx">
            <FieldEditWithSelect
                label={title}
                className="col-12"
                rows={rows}
                valueDefault={message}
                onChange={onChange}
                inputProps={{
                    readOnly: readOnly,
                    onClick: (e: any) => toggleVariableSelect(e, detaildata, field, setDetaildata, detaildata.type === 'TEXTO'),
                    onInput: (e: any) => toggleVariableSelect(e, detaildata, field, setDetaildata, detaildata.type === 'TEXTO'),
                }}
                show={variableHandler.show}
                data={tablevariableShow}
                datalabel="label"
                datakey="description"
                top={variableHandler.top}
                left={variableHandler.left}
                onClickSelection={(e, value) => selectionVariableSelect(e, value)}
                onClickAway={(variableHandler) => setVariableHandler({ ...variableHandler, show: false })}
            />
        </div>
    }

export default FieldEditWithSelectCampaign;