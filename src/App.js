// App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import SellItems from './components/SellItems';
import Cart from './components/Cart';
import Support from './components/Support';
import Profile from './components/Profile';
import ProductPage from './components/ProductPage';
import ProfileSetUp from './components/ProfileSetUp';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/sellitems" element={<ProtectedRoute> <SellItems /> </ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute> <Cart /> </ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute> <Support /> </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute> <ProductPage /> </ProtectedRoute>} />
        <Route path="/profilesetup" element={<ProtectedRoute> <ProfileSetUp/> </ProtectedRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;