import mongoose, { Document } from 'mongoose';

interface UserDocument extends Document {
    username: string;
    email: string;
    authentication: {
        password: string;
        salt?: string;
        sessionToken?: string;
    };
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    }
});

// Create the Mongoose model
const userModel = mongoose.model<UserDocument>('user', UserSchema);

const getUsers = () => userModel.find();
const getUserByEmail = (email: string) => userModel.findOne({ email });
const getUserBySessionToken = (sessionToken: string) => userModel.findOne({
    'authentication.sessionToken': sessionToken,
});
const getUserById = (id: string) => userModel.findById(id);

// Ensure proper instantiation of userModel
const createUser = (values: Record<string, any>) => {
    const user = new userModel(values);  // Correct instantiation
    return user.save().then((user) => user.toObject());  // Now save() will work
};

const deleteUserById = (id: string) => userModel.findOneAndDelete({ _id: id });
const updateUserById = (id: string, values: Record<string, any>) => userModel.findByIdAndUpdate(id, values);

export {
    createUser,
    deleteUserById,
    updateUserById,
    userModel,
    getUserByEmail,
    getUsers,
    getUserBySessionToken,
    getUserById
};
