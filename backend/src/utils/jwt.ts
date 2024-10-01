import jwt, {Jwt, JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (payload : JwtPayload , expiresIn : string | number = '1h') => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn});
}

const verifyToken = (token : string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
}

export {generateToken, verifyToken};