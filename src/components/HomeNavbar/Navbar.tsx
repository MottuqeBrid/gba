import Logo from "../Logo/Logo";
import NavLink from "../NavLink/NavLink";

export default function HomeNavbar() {
  const Navlinks = (
    <>
      <li>
        <NavLink href="/">Home</NavLink>
      </li>
      <li>
        <NavLink href="/about">About</NavLink>
      </li>
      <li>
        <NavLink href="/gallery">Gallery</NavLink>
      </li>
      <li>
        <NavLink href="/members">Members</NavLink>
      </li>
      {/* <li>
        <details>
          <summary>Parent</summary>
          <ul className="p-2 bg-base-100 w-40 z-1">
            <li>
              <NavLink href="/">Submenu 1</NavLink>
            </li>
          </ul>
        </details>
      </li> */}
    </>
  );

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-secondary btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {/* <li>
                <NavLink href="/">Home</NavLink>
              </li>
              <li>
                <NavLink href="/">Parent</NavLink>
                <ul className="p-2">
                  <li>
                    <NavLink href="/">Submenu 1</NavLink>
                  </li>
                  <li>
                    <NavLink href="/">Submenu 2</NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/">Item 3</Link>
              </li> */}
              {Navlinks}
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{Navlinks}</ul>
        </div>
        <div className="navbar-end">
          <Logo href="/" size="md" />
        </div>
      </div>
    </div>
  );
}
