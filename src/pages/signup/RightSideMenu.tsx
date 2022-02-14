/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext } from "react";
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import Step2_5 from './Step2_5';
import ThirdStep from './ThirdStep';
import Step2_6 from './LastStep';
import RateExperience from "./Rating";
import { SubscriptionContext } from "./context";

interface RightSideMenuProps {
    setOpenWarning: (param: any) => void;
}

const RightSideMenu: FC<RightSideMenuProps> = ({ setOpenWarning }) => {
    const { step } = useContext(SubscriptionContext);

    if (step === 1) {
        return <FirstStep />;
    } else if (step === 2) {
        return <SecondStep setOpenWarning={setOpenWarning} />;
    } else if (step === 2.5) {
        return <Step2_5 setOpenWarning={setOpenWarning} />;
    } else if (step === 2.6) {
        return <Step2_6 setOpenWarning={setOpenWarning} />;
    } else if (step === 3) {
        // Seleccion de canales
        return <ThirdStep />;
    }

    return <RateExperience />;
}

export default RightSideMenu