import React, { FC, useState, createContext } from 'react';

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
interface Subscription {
    selectedChannels: number;
    setselectedChannels: StateSetter<number>;

    listchannels: ListChannels;
    setlistchannels: StateSetter<ListChannels>;

    deleteOption: (option: keyof ListChannels) => void;
}

export interface ListChannels {
    facebook: boolean;
    instagram: boolean;
    instagramDM: boolean;
    messenger: boolean;
    whatsapp: boolean;
    telegram: boolean;
    twitter: boolean;
    twitterDM: boolean;
    chatWeb: boolean;
    email: boolean;
    phone: boolean;
    sms: boolean;
    android: boolean;
    apple: boolean;
}

const defaultListChanneñs: ListChannels = {
    facebook: false,
    instagram: false,
    instagramDM: false,
    messenger: false,
    whatsapp: false,
    telegram: false,
    twitter: false,
    twitterDM: false,
    chatWeb: false,
    email: false,
    phone: false,
    sms: false,
    android: false,
    apple: false,
};

export const SubscriptionContext = createContext<Subscription>({
    selectedChannels: 0,
    setselectedChannels: () => {},
    listchannels: defaultListChanneñs,
    setlistchannels: () => {},
    deleteOption: () => {},
});

export const SubscriptionProvider: FC = ({ children }) => {
    const [selectedChannels, setselectedChannels] = useState(0);
    const [listchannels, setlistchannels] = useState<ListChannels>(defaultListChanneñs);

    const deleteOption = (option: keyof ListChannels) => {
        setlistchannels((p: any) => ({
            ...p,
            [option]: false,
        }));
        setselectedChannels(prev => --prev);
    }

    return (
        <SubscriptionContext.Provider value={{
            selectedChannels,
            setselectedChannels,
            listchannels,
            setlistchannels,

            deleteOption,
        }}>
            {children}
        </SubscriptionContext.Provider>
    )
}
