import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="flex justify-around items-center h-16 bg-white text-black relative shadow-sm"
      role="navigation"
    >
      <div>Tamata Task</div>
      <div className="pr-8 md:block hidden">
        <Link to="/" className="p-4">
          Question One
        </Link>
        <Link to="/map" className="p-4">
          Question Two
        </Link>
      </div>
    </nav>
  );
}
