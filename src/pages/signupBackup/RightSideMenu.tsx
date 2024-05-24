import { SubscriptionContext } from "./context";

import FirstStep from "./FirstStep";
import RateExperience from "./Rating";
import React, { FC, useContext } from "react";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";

interface RightSideMenuProps {
    setOpenWarning: (param: boolean) => void;
}

const RightSideMenu: FC<RightSideMenuProps> = ({ setOpenWarning }) => {
    const { step } = useContext(SubscriptionContext);

    if (step === 1) {
        return <FirstStep />;
    } else if (step === 2) {
        return <SecondStep setOpenWarning={setOpenWarning} />;
    } else if (step === 3) {
        return <ThirdStep />;
    }

    return <RateExperience />;
};

export default RightSideMenu;