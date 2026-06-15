import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Payments from "./pages/Payments";
import Courses from "./pages/Courses";
// import CreateStudent from "./pages/CreateStudent"
import CreateStudent from "./pages/CreateStudent";
import Tracking from "./pages/Tracking";
import Analytics from "./pages/Analytics";
import RecordPaymentModal from "./pages/RecordPaymentModal";
// import { useState } from "react";

function App() {
  // const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/courses" element={<Courses />} />
          {/* <Route path="/students/create" element={<CreateStudent/>}/> */}
          <Route path="/tracking" element={<Tracking/>}/>
          <Route path="/create-student" element={<CreateStudent/>}/>
          <Route path="/analytics"  element={<Analytics />}/>
          <Route
            path="/addpayment"
            element={
              <RecordPaymentModal
                isOpen={true}
                onClose={() => window.history.back()}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;