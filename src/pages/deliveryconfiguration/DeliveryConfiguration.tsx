import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { resetAllMain } from "store/main/actions";
import DeliveryConfigurationDetail from "./views/DeliveryConfigurationDetail";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const DeliveryConfiguration: FC = () => {
  const dispatch = useDispatch(); 
  const [rowSelected] = useState<RowSelected>({
    row: null,
    edit: false,
  });

  useEffect(() => {
    return () => {
      dispatch(resetAllMain());
    };
  }, []);
  
  return (
    <DeliveryConfigurationDetail
      data={rowSelected}
    />
  );
};

export default DeliveryConfiguration;