import { NavLink } from "react-router-dom";
import imageSource from "../../../Assets/Images/VacationsImage.jpg";
import "./Home.css";

function Home(): JSX.Element {
    return (
        <div className="Home">
			<p>The best vacation site on the internet</p>
           <p> A variety of vacations for a variety of different destinations
            </p>

            <img src={imageSource} />

            <div className="AuthButtons">
            <NavLink to="/register">Register</NavLink>
            <span> | </span>
            <NavLink to="/login">Login</NavLink>
            </div>
        </div>
    );
}

export default Home;
