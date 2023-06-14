import { FC } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { useSelector } from "hooks";
import { makeStyles } from "@material-ui/core/styles";
import { IServiceDeskLead } from "@types";
import { langKeys } from "lang/keys";
import { DraggablesCategoriesGroup } from "./DraggablesCategoriesGroups";

interface dataBackend {
  columnid: number;
  column_uuid: string;
  description: string;
  status: string;
  type: string;
  globalid: string;
  index: number;
  total_revenue?: number | null;
  items?: IServiceDeskLead[] | null;
}

const useStyles = makeStyles((theme) => ({
  columnheadercontainer: {
    display: "flex",
    color: "white",
    paddingTop: 10,
    fontSize: "1.6em",
    fontWeight: "bold",
  },
  columnheader: {
    minWidth: 280,
    maxWidth: 280,
    backgroundColor: "#aa53e0",
    padding: "10px 0",
    margin: "0 5px",
    display: "flex",
    overflow: "hidden",
    maxHeight: "100%",
    textAlign: "center",
    flexDirection: "column",
  },
}));
export const KanbanTableGroups: FC<{
  dataColumn: dataBackend[];
  handleDelete: (lead: IServiceDeskLead) => void;
  handleCloseLead: (lead: IServiceDeskLead) => void;
  columns: any[];
}> = ({ dataColumn, handleDelete, handleCloseLead,columns }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const user = useSelector((state) => state.login.validateToken.user);
  return (
    <>
      <div className={classes.columnheadercontainer}>
        <div className={classes.columnheader}></div>
        <div className={classes.columnheader}>{t(langKeys.support)} N1</div>
        <div className={classes.columnheader}>{t(langKeys.support)} N2</div>
        <div className={classes.columnheader}>{t(langKeys.support)} N3</div>
      </div>
      <DragDropContext onDragEnd={() => {}}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ display: "flex" }}
            >
              {dataColumn.map((column, index) => (
                <DraggablesCategoriesGroup
                  column={column}
                  index={index}
                  handleDelete={handleDelete}
                  handleCloseLead={handleCloseLead}
                  role={user?.roledesc || ""}
                />
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
