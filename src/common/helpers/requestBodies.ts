import { IRequestBody } from '@types';

export const getUserSel = (userid: number): IRequestBody => ({
    method: "UFN_USER_SEL",
    parameters: {
        id: userid,
        all: true
    }
})