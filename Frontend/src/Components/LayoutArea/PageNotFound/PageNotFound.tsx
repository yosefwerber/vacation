import "./PageNotFound.css";
import imageSource from "../../../Assets/Images/page404.jpg";

function PageNotFound(): JSX.Element {
    return (
        <div className="PageNotFound">

<p>The page you are looking for doesn't exist.</p>

<iframe width="560" height="315" src="https://www.youtube.com/embed/t3otBjVZzT0?autoplay=true" allow="autoplay" title="Page not Found"></iframe>

<br />
<br />

<img src={imageSource} />

</div>
);
}

export default PageNotFound;
