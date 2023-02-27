import { TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import "./Register.css";

function Register(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<UserModel>();
    const navigate = useNavigate();

    async function send(user: UserModel) {
        try {
            await authService.register(user);
            alert("Welcome " + user.firstName);
            navigate("/vacations");
        }
        catch(err: any) {
            alert(err.message);
        }
    }

    return (
        <div className="Register Box">

<Typography variant="h6">Register</Typography>

            <form onSubmit={handleSubmit(send)}>

                <TextField label="First name" type="text" variant="outlined" className="TextBox"  {...register("firstName",UserModel.firstNameValidation)}/>
                <span className="Err">{formState.errors.firstName?.message}</span>

                <TextField label="Last name" type="text" variant="outlined" className="TextBox"  {...register("lastName",UserModel.lastNameValidation)}/>
                <span className="Err">{formState.errors.lastName?.message}</span>

                <TextField label="Email" type="email" variant="outlined" className="TextBox"  {...register("email",UserModel.emailValidation)}/>
                <span className="Err">{formState.errors.lastName?.message}</span>

                <TextField label="Password" type="password" variant="outlined" className="TextBox"  {...register("password",UserModel.passwordValidation)}/>
                <span className="Err"></span>

                <button className="registerButton">Register</button>

            </form>

        </div>
    );
}

export default Register;
