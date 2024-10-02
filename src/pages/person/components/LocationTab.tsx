import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, makeStyles } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { FC } from "react";
import { Location } from "./Location";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

interface LocationTabProps {
    setValue: any;
    watch: any;
    addressbook: any;
}

export const LocationTab: FC<LocationTabProps> = ({ setValue, watch, addressbook }) => {
    const { t } = useTranslation();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto', marginTop: 20 }}>
            <div style={{ justifyContent: "end", display: "flex", marginRight: 8, marginBottom: 8 }}>
                <Button
                    variant="text"
                    color="secondary"
                    style={{ color: "black" }}
                    startIcon={<AddIcon width={24} />}
                    onClick={() => {
                        setValue("address_book", [...addressbook, {
                            country: "",
                            province: "",
                            region: "",
                            district: "",
                            addressreference: "",
                            address: "",
                            postalcode: 0,
                            addressnumber: 0,
                            ubigeocode: 0,
                            floor_number: 0,
                            latitude: 0,
                            longitude: 0,
                        }])
                    }}
                >
                    {t(langKeys.add) + " " + t(langKeys.address)}
                </Button>
            </div>
            <div>
                <Accordion defaultExpanded={true} style={{ marginBottom: '8px' }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <div style={{ fontWeight: "bold" }}>{t(langKeys.mainaddress)}</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Location row={watch} setValue={setValue} />
                    </AccordionDetails>
                </Accordion>
                {addressbook.map((x: any, i: number) => {
                    const editValue = (field: string, value: any) => {
                        let auxvalue = addressbook
                        auxvalue[i] = { ...x , [field]: value }
                        setValue("address_book", auxvalue)
                    }
                    return <Accordion defaultExpanded={false} style={{ marginBottom: '8px' }} key={`direccion-${i}`}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <div style={{ fontWeight: "bold" }}>{`${t(langKeys.additionaladdress)} ${i + 1}`}</div>

                                <IconButton onClick={() => {
                                    let auxvalue = addressbook
                                    auxvalue.splice(i, 1);
                                    setValue("address_book", auxvalue)
                                }}>
                                    <DeleteIcon color="primary" />
                                </IconButton>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Location row={addressbook[i]} setValue={editValue} />
                        </AccordionDetails>
                    </Accordion>
                })}
            </div>
        </div>
    );
}