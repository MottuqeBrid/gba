import Link from "next/link";
import Logo from "../../../components/Logo/Logo";
import NavLink from "../../../components/NavLink/NavLink";

export default function AdminNavbar() {
  const adminLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/events", label: "Manage Events" },
    { href: "/admin/members", label: "Manage Members" },
    { href: "/admin/gallery", label: "Manage Gallery" },
    { href: "/admin/settings", label: "Settings" },
  ];

  const NavItems = (
    <>
      {adminLinks.map((link) => (
        <li key={link.href}>
          <NavLink
            href={link.href}
            className="text-(--text-secondary) hover:text-(--color-primary) font-medium"
            activeClassName="text-(--color-primary) font-bold"
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </>
  );

  return (
    <div className="bg-base-100/95 backdrop-blur-sm border-b border-base-200 sticky top-0 z-50">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Menu Button & Logo */}
        <div className="navbar-start lg:hidden">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52 gap-2"
            >
              {NavItems}
              <div className="divider my-1"></div>
              <li>
                <Link href="/" className="text-error">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop: Logo */}
        <div className="navbar-start hidden lg:flex">
          <div className="flex items-center gap-2">
            <Logo href="/admin" size="sm" />
            <span className="font-bold text-lg text-(--color-primary)">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Mobile: Center Logo */}
        <div className="navbar-center lg:hidden">
          <Logo href="/admin" size="sm" />
        </div>

        {/* Desktop: Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6">{NavItems}</ul>
        </div>

        {/* Desktop: User Profile / Logout */}
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full border border-base-300">
                <img
                  alt="Admin Avatar"
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <span className="font-semibold text-(--text-primary)">
                  Administrator
                </span>
              </li>
              <div className="divider my-0"></div>
              <li>
                <Link href="/admin/profile">Profile</Link>
              </li>
              <li>
                <Link href="/admin/settings">Settings</Link>
              </li>
              <li>
                <Link href="/" className="text-error hover:bg-error/10">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
