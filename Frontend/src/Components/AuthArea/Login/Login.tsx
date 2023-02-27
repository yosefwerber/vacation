import { Avatar, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";
import notify from "../../../Utils/Notify";
import "./Login.css";

function Login(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    async function send(credentials: CredentialsModel) {
        try {
            await authService.login(credentials);
            notify.success("Welcome back!");
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Login Box">
            
            <Typography variant="h6">Login</Typography>

            <form onSubmit={handleSubmit(send)}>
                <TextField label="Email" type="email" variant="outlined" className="TextBox"  {...register("email",CredentialsModel.emailValidation)} />
                <span className="Err"></span>
                <TextField label="Password" type="password" variant="outlined" className="TextBox"  {...register("password",CredentialsModel.passwordValidation)} />
                <span className="Err"></span>

                <button className="loginButton">Login</button>
            </form>

        </div>
    );
}

export default Login;
