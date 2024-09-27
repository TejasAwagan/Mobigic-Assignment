import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/MainPage";
import Signup from "./components/RegistrationPage";
import Login from "./components/LoginPage";
import UploadFile from "./components/FileUpload/FileUpload"; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false); 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Main />} />
          <Route path="/upload" element={<UploadFile />} />
        </>
      ) : (
        <>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
