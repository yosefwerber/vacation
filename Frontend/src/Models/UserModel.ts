import { RegisterOptions } from "react-hook-form";
import RoleModel from "./RoleModel";

class UserModel {

    public userId: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public role: RoleModel;

    public static firstNameValidation: RegisterOptions = {
        required: { value: true, message: "Missing first name"},
        minLength: { value: 2, message: "First name must be minimum 2 chars"},
        maxLength: { value: 30, message: "First name can't exceeds 30 chars"}
    };

    public static lastNameValidation: RegisterOptions = {
        required: { value: true, message: "Missing last name"},
        minLength: { value: 2, message: "Last name must be minimum 2 chars"},
        maxLength: { value: 30, message: "Last name can't exceeds 30 chars"}
    };

    public static emailValidation: RegisterOptions = {
        required: { value: true, message: "Missing email" },
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
        }
    };


    public static passwordValidation: RegisterOptions = {
        required: { value: true, message: "Missing password"},
        minLength: { value: 4, message: "Password must be minimum 4 chars"},
        maxLength: { value: 30, message: "Password can't exceeds 30 chars"}
    };

}




export default UserModel;