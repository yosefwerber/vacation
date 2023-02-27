import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import "./Menu.css";

function Menu(): JSX.Element {

    const [user, setUser] = useState<UserModel>();

    useEffect(() => {

        setUser(authStore.getState().user);

        // Listen to AuthState changes:
        authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });

    }, []);




    
    return (
        <div className="Menu">
             <NavLink to="/home">Home</NavLink>

           {user && user.role === "User" && <>
             <span> | </span>
            <NavLink to="/vacations">vacations</NavLink>
            </>
            }

            {user && user.role === "Admin" && <>
            <span> | </span>
            <NavLink to="/vacations">Vacations</NavLink>
            <span> | </span>
            <NavLink to="/addvacation">Add</NavLink>
            <span> | </span>
            <NavLink to="/followersGraph">Graph</NavLink>
            </>}

        </div>
    );
}

export default Menu;
