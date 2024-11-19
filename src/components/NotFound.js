import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="not-found">
            <h1>404</h1>
            <h2>The page you're looking for does not exist</h2>
            <Link to="/">Go back to main page</Link>
        </div>
    )
}

export default NotFound;