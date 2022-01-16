import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";
import { selectUserId } from "./redux/slices/ethSlice";

export default function RequireAuth({ children }: any) {
  const userId = useAppSelector(selectUserId);
  const location = useLocation();

  return userId ? children : <Navigate to="/login" replace />;
}
