import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  AlertTriangle,
  BarChart3,
  Shield,
} from "lucide-react";

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/projects", icon: FolderOpen, label: "Projects" },
  { to: "/upload-invoice", icon: Upload, label: "Upload Invoice" },
  { to: "/fraud-detection", icon: AlertTriangle, label: "Fraud Detection" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

const Sidebar = () => {
  return (
    <aside className="sticky top-0 h-screen w-64 border-r bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="border-b border-sidebar-border px-6 py-5">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-heading font-bold text-sidebar-foreground">
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
