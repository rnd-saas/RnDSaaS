import { Navigate, Outlet, useLocation } from 'react-router-dom';


function isAuthed() {
// token is stored by authService.login via apiClient.setToken
return !!localStorage.getItem('auth_token');
}


export default function ProtectedRoute() {
const location = useLocation();
if (!isAuthed()) {
return <Navigate to="/login" replace state={{ from: location }} />;
}
return <Outlet />;
}
