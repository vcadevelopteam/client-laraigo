import React, { FC, useState, createContext, useMemo } from 'react';

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
interface Subscription {
    selectedChannels: number;
    listchannels: ListChannels;
    
    resetChannels: () => void;
    addChannel: (option: keyof ListChannels) => void;
    deleteChannel: (option: keyof ListChannels) => void;
    toggleChannel: (option: keyof ListChannels) => void;
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
    listchannels: defaultListChanneñs,
    addChannel: () => {},
    deleteChannel: () => {},
    resetChannels: () => {},
    toggleChannel: () => {},
});

export const SubscriptionProvider: FC = ({ children }) => {
    const [listchannels, setlistchannels] = useState<ListChannels>(defaultListChanneñs);

    const deleteChannel = (option: keyof ListChannels) => {
        setlistchannels(prev => {
            const v = prev[option];
            if (v === false) return prev;
            return {
                ...prev,
                [option]: false,
            };
        });
    }

    const addChannel = (option: keyof ListChannels) => {
        setlistchannels(prev => {
            const v = prev[option];
            if (v === true) return prev;
            return {
                ...prev,
                [option]: true,
            };
        });
    }

    const toggleChannel = (option: keyof ListChannels) => {
        setlistchannels(prev => ({
            ...prev,
            [option]: !prev[option],
        }));
    }

    const resetChannels = () => setlistchannels(defaultListChanneñs);

    const selectedChannels = useMemo(() => {
        return Object.
            keys(listchannels).
            filter(key => listchannels[key as keyof ListChannels] === true).
            length;
    }, [listchannels]);

    return (
        <SubscriptionContext.Provider value={{
            selectedChannels,
            listchannels,
            addChannel,
            deleteChannel,
            resetChannels,
            toggleChannel,
        }}>
            {children}
        </SubscriptionContext.Provider>
    )
}
