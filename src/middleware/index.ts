import { getUserBySessionToken } from '../db/users'
import express from 'express'
import { get, merge } from 'lodash'

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentuserId = get(req, 'identity._id') as string;

        console.log('ID from params:', id);
        console.log('Current User ID:', currentuserId);

        if (!currentuserId) {
            return res.sendStatus(403);
        }
        if (currentuserId.toString() !== id.toString()) {
            return res.sendStatus(403); 
        }

        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400); 
    }
};

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['SWABAH-AUTH']

        if (!sessionToken) {
            return res.sendStatus(403)
        }

        const existingUser = await getUserBySessionToken(sessionToken)

        if (!existingUser) {
            return res.sendStatus(403)
        }

        merge(req, { identity: existingUser })

        return next()

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}