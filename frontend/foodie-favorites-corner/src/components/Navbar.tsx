import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Plus, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";  // or "@/contexts/AuthContext"

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              RecipeHub
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Home
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/my-recipes"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === "/my-recipes"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    My Recipe
                  </Link>

                  <Link
                    to="/create-recipe"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === "/create-recipe"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Create Recipe
                  </Link>

                  {user?.is_admin && (
                    <Link
                      to="/admin/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === "/admin/dashboard"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button asChild size="sm" className="hidden sm:flex">
                  <Link to="/create-recipe">
                    <Plus className="h-4 w-4 mr-2" />
                    New Recipe
                  </Link>
                </Button>

                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>

                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>

                <Button asChild size="sm">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
