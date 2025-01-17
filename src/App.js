import './App.css';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ServiceList from './components/Services/ServiceList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/services" element={<ServiceList />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;