import { Request, Response, NextFunction } from 'express';

import axios, { AxiosResponse } from 'axios';

export const testFunction = async (req:Request, res:Response) => {
    let result: AxiosResponse = await axios.get('https:/jsonplaceholder.typicode.com/todos/1');
    return res.send(result.data);
}