import pick from 'lodash';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export const issueAuthToken = (email, role, res, req) => {
    let token =  jwt.sign({
        email,
        role
        }, 
        process.env.SECRET_KEY, {
        expiresIn: '1d'
        }
    );
    return `Bearer ${token}`;
};

export const serializeUser = user => pick(user, [
    'id',
    'email',
    'fullname'
]);