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
import CreateStudent from "./pages/CreateStudent"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/students/create" element={<CreateStudent/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;