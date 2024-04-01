import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetAllMain } from "store/main/actions";
import DeliveryConfigurationDetail from "./views/DeliveryConfigurationDetail";

const DeliveryConfiguration: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetAllMain());
    };
  }, []);
  
  return (
    <DeliveryConfigurationDetail/>
  );
};

export default DeliveryConfiguration;