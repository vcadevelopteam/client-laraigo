import { Button } from "@material-ui/core";
import { DialogZyx, TemplateIcons } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import TableZyx from "components/fields/table-simple";
import InsertDeliverySchedulesDialog from "./InsertDeliverySchedulesDialog";
import { CellProps } from "react-table";
import { Dictionary } from "@types";

const DeliverySchedulesDialog: React.FC<{
  openModal: boolean;
  setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation();
  const [openModalInsertDeliverySchedules, setOpenModalInsertDeliverySchedules] = useState(false);

const columns = React.useMemo(
  () => [   
    {
      accessor: "storeid",
      NoFilter: true,
      disableGlobalFilter: true,
      isComponent: true,
      minWidth: 60,
      width: "1%",
      Cell: (props: CellProps<Dictionary>) => {
        const row = props.cell.row.original;
        return (
          <TemplateIcons
            //deleteFunction={() => handleDelete(row)}
            //editFunction={() => handleEdit(row)}
          />
        );
      },
    },
    {
      Header: t(langKeys.shifts),
      accessor: "shifts",
      width: "auto",
    },
    {
      Header: t(langKeys.from),
      accessor: "from",
      width: "auto",
    },
    {
      Header: t(langKeys.until),
      accessor: "until",
      width: "auto",
    },   
  ],
  []
);
  
  return (
    <DialogZyx open={openModal} title={t(langKeys.deliveryshifts)} maxWidth="md">
      <div className="row-zyx">  
      
        <div className="row-zyx">
          <TableZyx
            columns={columns}            
            data={[]}           
            filterGeneral={false}
            toolsFooter={false}    
            register={true} 
            handleRegister={setOpenModalInsertDeliverySchedules}  
            ButtonsElement={() => (
              <div style={{ textAlign: 'right'}}>            
                  <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    {t(langKeys.close)}
                  </Button>      
              </div>
            )}                    
          />
        </div>      
      </div>      
      <InsertDeliverySchedulesDialog
            openModal={openModalInsertDeliverySchedules}
            setOpenModal={setOpenModalInsertDeliverySchedules}
            row = {[]}
      />
    </DialogZyx>
  );
};

export default DeliverySchedulesDialog;