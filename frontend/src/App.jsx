import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Service from './pages/Service';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentAddress, setCurrentAddress] = useState('全国顺丰直达');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('user_favorites') || '[]'));
  
  // --- 核心：真实的订单与消息系统 ---
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: '系统通知', content: '欢迎加入东北味道！新老铁下单享8折优惠。', time: '刚才', type: 'system' }
  ]);

  useEffect(() => { localStorage.setItem('user_favorites', JSON.stringify(favorites)); }, [favorites]);

  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // 模拟购买与自动发货逻辑
  const handlePurchase = (product, quantity) => {
    const newOrder = {
      id: `DB${Date.now()}`,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantity,
      status: '已支付',
      location: '商家准备出库',
      time: new Date().toLocaleString()
    };
    setOrders([newOrder, ...orders]);

    // 模拟 3 秒后“自动发货”
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === newOrder.id ? {...o, status: '运输中', location: '哈尔滨顺丰分拨中心'} : o));
      setNotifications(prev => [{
        id: Date.now(),
        title: '物流提醒',
        content: `老铁！您的包裹 [${product.name}] 已发货，正从哈尔滨极速赶来！`,
        time: '刚才',
        type: 'logistics'
      }, ...prev]);
    }, 4000);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
        <Navbar onSearch={setSearchQuery} currentAddress={currentAddress} onAddressChange={setCurrentAddress} />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/product/:id" element={
              <ProductDetail favorites={favorites} onToggleFavorite={toggleFavorite} onPurchase={handlePurchase} />
            } />
            <Route path="/cart" element={<Cart onCheckout={(items) => items.forEach(i => handlePurchase(i, i.quantity))} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/service" element={<Service />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile favorites={favorites} orders={orders} notifications={notifications} />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;