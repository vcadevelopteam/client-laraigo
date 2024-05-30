import { SubscriptionContext } from "./context";

import FirstStep from "./FirstStep";
import RateExperience from "./Rating";
import { FC, useContext } from "react";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";

const RightSideMenu = () => {
    const { step } = useContext(SubscriptionContext);

    if (step === 1) {
        return <FirstStep />;
    } else if (step === 2) {
        return <SecondStep />;
    } else if (step === 3) {
        return <ThirdStep />;
    }

    return <RateExperience />;
};

export default RightSideMenu;