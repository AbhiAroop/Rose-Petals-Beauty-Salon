import './App.css';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ServiceList from './components/Services/ServiceList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { AuthProvider } from './components/Auth/AuthContext';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/services" element={<ServiceList />} />
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;