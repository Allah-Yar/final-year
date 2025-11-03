

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ImageUploadForm from "./components/ImageUploadForm";
import Instructions from "./components/Instructions";
import UploadHistory from "./components/UploadHistory";

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        {/* Wrap all routes inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="instructions" element={<Instructions />} />
          <Route path="check" element={<ImageUploadForm />} />
          <Route path="history" element={<UploadHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;



