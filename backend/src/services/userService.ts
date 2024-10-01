import user from '../models/userModel';
import User, { IUser } from '../models/userModel';
import { hashPassword, comparePassword } from '../utils/bcypt';

const registerUser = async(email : string, password : string): Promise<IUser> => {
    const existinguser = await User.findOne({email});
    if(existinguser){
        throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({email, password : hashedPassword});
    await user.save();
    return user;
}
const authenticateUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { isMatch: false, message: "User not found" };
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return { isMatch: false, message: "Incorrect password" };
    }

    return { user };
};



const getUserById = async(id : string): Promise<IUser | null> => {
    return User.findById(id).select('-password'); // exclude password from the response
}

export { registerUser, authenticateUser, getUserById };
