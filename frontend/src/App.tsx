import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Payments from "./pages/Payments";
import Courses from "./pages/Courses";
import CreateStudent from "./pages/CreateStudent";
import Tracking from "./pages/Tracking";
import Analytics from "./pages/Analytics";
import RecordPaymentModal from "./pages/RecordPaymentModal";
import AddPayment from "./pages/AddPayment";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/create-student" element={<CreateStudent />} />
          <Route path="/analytics" element={<Analytics />} />

          <Route
            path="/addpayment"
            element={
              <RecordPaymentModal
                isOpen={true}
                onClose={() => window.history.back()}
              />
            }
          />

          <Route
            path="/payments/new/:studentId"
            element={<AddPayment />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;