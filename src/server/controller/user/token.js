import jwt from 'jsonwebtoken';
export function createToken(payload, skey) {
    return jwt.sign(payload, skey, { expiresIn: '1d' });
}
