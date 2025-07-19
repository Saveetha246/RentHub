import { Navigate, Outlet } from "react-router-dom";

export  default function LandLordRoute() {
    const isAuthenticated  = !! localStorage.getItem('jwt') 
    const user= localStorage.getItem("user");
    return isAuthenticated && JSON.parse(user)?.role==="ROLE_LANDLORD" ? <Outlet /> : <Navigate to="/login" replace />
}
export function TenantRoute(){
    const isAuthenticated  = !! localStorage.getItem('jwt') 
    const user= localStorage.getItem("user");
    return isAuthenticated && JSON.parse(user)?.role==="ROLE_TENANT" ? <Outlet /> : <Navigate to="/login" replace />

}