import { FC } from "react";

export const DashboardIcon: FC<{ color: string }> = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.5332 14.6097C16.3234 14.9669 16.4429 15.4265 16.8 15.6363C17.1572 15.8461 17.6168 15.7266 17.8266 15.3695L16.5332 14.6097ZM16.5302 8.52994C16.8231 8.23705 16.8231 7.76218 16.5302 7.46928C16.2373 7.17639 15.7625 7.17639 15.4696 7.46928L16.5302 8.52994ZM12.8796 10.0593C12.5867 10.3522 12.5867 10.8271 12.8796 11.1199C13.1725 11.4128 13.6473 11.4128 13.9402 11.1199L12.8796 10.0593ZM8.9299 6.80961L9.30907 7.45671L9.31114 7.45549L8.9299 6.80961ZM13.4903 6.96674C13.8863 7.08803 14.3057 6.86529 14.427 6.46923C14.5483 6.07318 14.3256 5.65378 13.9295 5.53249L13.4903 6.96674ZM17.0136 10.4818C17.4409 11.8596 17.2667 13.3612 16.5332 14.6097L17.8266 15.3695C18.7731 13.7581 18.9989 11.8196 18.4462 10.0375L17.0136 10.4818ZM15.4696 7.46928L12.8796 10.0593L13.9402 11.1199L16.5302 8.52994L15.4696 7.46928ZM7.44699 14.6204C5.98549 12.1263 6.81801 8.91638 9.30907 7.45671L8.55073 6.16252C5.34179 8.04285 4.27431 12.173 6.15281 15.3788L7.44699 14.6204ZM9.31114 7.45549C10.5679 6.71366 12.0896 6.53778 13.4903 6.96674L13.9295 5.53249C12.1302 4.98145 10.1719 5.20556 8.54865 6.16374L9.31114 7.45549Z" fill={color} />
        </svg>
    );
};
