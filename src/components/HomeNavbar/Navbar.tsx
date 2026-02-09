import Logo from "../Logo/Logo";
import NavLink from "../NavLink/NavLink";
import ThemeToggle from "../ThemeTogle/ThemeTogle";

export default function HomeNavbar() {
  // Navlinks
  const Navlinks = (
    <>
      <li>
        <NavLink
          href="/"
          className="text-primary hover:text-primary-dark underline-offset-2 hover:underline"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          href="/events"
          className="text-primary hover:text-primary-dark underline-offset-2 hover:underline"
        >
          Events
        </NavLink>
      </li>
      <li>
        <NavLink
          href="/gallery"
          className="text-primary hover:text-primary-dark underline-offset-2 hover:underline"
        >
          Gallery
        </NavLink>
      </li>
      <li>
        <NavLink
          href="/members"
          className="text-primary hover:text-primary-dark underline-offset-2 hover:underline"
        >
          Members
        </NavLink>
      </li>
      <li>
        <NavLink
          href="/about"
          className="text-primary hover:text-primary-dark underline-offset-2 hover:underline"
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          href="/admin"
          className="text-primary hover:text-primary-dark underline-offset-2 hover:underline"
        >
          Admin
        </NavLink>
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
    <div className="bg-base-100/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="navbar max-w-7xl mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-secondary btn-ghost lg:hidden"
            >
              {/* menu icon */}
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
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{Navlinks}</ul>
          </div>
        </div>
        <div className="navbar-end">
          {/* <ThemeToggle variant="dropdown" />
          <ThemeToggle />
          <ThemeToggle variant="button" size="lg" /> */}
          <ThemeToggle variant="dropdown" showLabel />
          <Logo href="/" size="md" />
        </div>
      </div>
    </div>
  );
}
