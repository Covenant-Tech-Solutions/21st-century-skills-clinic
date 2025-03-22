"use client"
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { authRoutes, protectedRoutes } from "src/routes/routes";


const Routes = ({ children }) => {

    const userData = useSelector(state => state.User)

    // Check if the user is authenticated based on the presence of the token
    const isAuthenticated = userData.token

    const navigate = useRouter()

    const pathname = usePathname();

    // Check if the given pathname matches any of the patterns
    const isRouteProtected = (pathname) => {
        return pathname && protectedRoutes.some(pattern => pathname.startsWith(pattern));
      };

    // Check if the current route requires authentication
    // const requiresAuth = protectedRoutes.includes(pathname)
    const requiresAuth = isRouteProtected(pathname);

    useEffect(() => {
        authCheck()
    }, [requiresAuth,pathname])

    const authCheck = () => {
        if (requiresAuth) {
            if (isAuthenticated === null) {
                navigate.push('/auth/login')
                toast.error('Please Login first')
                return
            }
        }
    }

    // Check if the current route is an authentication route
    const isAuthRoute = authRoutes.includes(pathname)

    useEffect(() => {
        notAccessAfterLogin()
    }, [isAuthRoute])

    const notAccessAfterLogin = () => {
        if (isAuthenticated) {
            if (isAuthRoute) {
                navigate.push('/')
            }
        }
    }
    return (
        <div>{children}</div>
    )
}

export default Routes