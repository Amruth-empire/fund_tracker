import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";

interface NavbarProps {
  isLoggedIn?: boolean;
  userRole?: "admin" | "contractor";
}

const Navbar = ({ isLoggedIn = false, userRole }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-heading font-bold text-foreground">
            Panchayat Fund Tracker
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Button asChild variant="ghost">
                <Link to="/citizen">Citizen Portal</Link>
              </Button>
              <Button asChild variant="default">
                <Link to="/login">Login</Link>
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">
                {userRole === "admin" ? "Admin" : "Contractor"}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
