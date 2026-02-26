import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, MapPin, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  
  // 搜索与地址状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);
  const [manualAddr, setManualAddr] = useState({ province: '', city: '', district: '' });
  const [currentAddress, setCurrentAddress] = useState('全国顺丰直达');

  useEffect(() => {
    // 读取持久化登录状态
    const logged = localStorage.getItem('isLoggedIn');
    if (logged === 'true') {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem('userName') || '用户');
    }

    const fetchCart = () => {
      axios.get('https://dongbei-shop-pro.onrender.com/api/cart')
        .then(res => setCartCount(res.data.reduce((sum, item) => sum + item.quantity, 0)))
        .catch(() => {});
    };
    fetchCart();
    const interval = setInterval(fetchCart, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(searchKeyword)}`);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualAddr.province && manualAddr.city) {
      const fullAddr = `${manualAddr.province} ${manualAddr.city} ${manualAddr.district}`;
      setCurrentAddress(fullAddr);
      setShowAddressModal(false);
      setIsManualInput(false);
    }
  };

  return (
    <>
      <nav className="bg-slate-900 text-white sticky top-0 z-40 shadow-xl w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🌾</span>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black text-white">东北<span className="text-orange-500">味道</span></span>
                  <span className="text-[10px] text-gray-400 hidden md:block uppercase tracking-widest font-bold">Premium Mall</span>
                </div>
              </Link>
              
              {/* 地址选择触发 */}
              <div onClick={() => setShowAddressModal(true)} className="hidden lg:flex items-center gap-1 hover:border-white border border-transparent p-1.5 rounded cursor-pointer transition-colors">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-gray-400 font-bold">配送至</span>
                  <span className="text-sm font-bold line-clamp-1 max-w-[100px]">{currentAddress}</span>
                </div>
              </div>
            </div>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="flex w-full bg-white rounded-lg overflow-hidden focus-within:ring-4 focus-within:ring-orange-500/50 transition-all">
                <input 
                  type="text" 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索 五常大米、秋林红肠..." 
                  className="flex-1 px-4 py-2.5 text-gray-900 outline-none font-medium" 
                />
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 transition-colors">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>

            {/* 操作区 */}
            <div className="flex items-center gap-2 md:gap-6 shrink-0">
              <Link to={isLoggedIn ? "/profile" : "/login"} className="hidden md:flex flex-col leading-tight hover:border-white border border-transparent p-1.5 rounded transition-colors">
                <span className="text-[11px] text-gray-400 font-bold">{isLoggedIn ? `你好, ${userName}` : '你好, 请登录'}</span>
                <span className="text-sm font-bold flex items-center gap-1">账户与订单 <User className="w-4 h-4" /></span>
              </Link>

              <Link to="/cart" className="relative flex items-end gap-1 hover:border-white border border-transparent p-1.5 rounded transition-colors group">
                <div className="relative">
                  <ShoppingCart className="w-8 h-8 text-white group-hover:text-orange-500 transition-colors" />
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[11px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md border-2 border-slate-900">
                    {cartCount}
                  </span>
                </div>
                <span className="text-sm font-bold hidden md:block mt-1">购物车</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 副导航栏 */}
        <div className="bg-slate-800 text-sm overflow-x-auto no-scrollbar">
          <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-6 py-2.5 whitespace-nowrap">
            <button className="flex items-center gap-1 font-bold hover:text-orange-500"><Menu className="w-5 h-5" /> 全部</button>
            <Link to="/#category-特色鲜果" className="hover:text-orange-500 font-bold">🍎 特色鲜果</Link>
            <Link to="/#category-经典熏酱" className="hover:text-orange-500 font-bold">🍖 经典熏酱</Link>
            <Link to="/#category-珍稀山货" className="hover:text-orange-500 font-bold">🍄 珍稀山货</Link>
            <span className="text-gray-600">|</span>
            <span className="text-orange-500 font-bold animate-pulse cursor-default">🔥 今日秒杀</span>
            <Link to="/service" className="hover:text-orange-500 font-bold">客服服务</Link>
          </div>
        </div>
      </nav>

      {/* 地址选择弹窗逻辑 */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddressModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-[101]"
            >
              <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-orange-500"/> 选择配送地址</h3>
                <button onClick={() => setShowAddressModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X/></button>
              </div>
              <div className="p-6">
                {!isManualInput ? (
                  <div className="space-y-3">
                    {['全国顺丰直达', '黑龙江省 哈尔滨市 道里区', '北京市 朝阳区 建国路'].map((addr, idx) => (
                      <div 
                        key={idx} onClick={() => { setCurrentAddress(addr); setShowAddressModal(false); }}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${currentAddress === addr ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
                      >
                        <span className="font-bold text-gray-800">{addr}</span>
                        {currentAddress === addr && <CheckCircle2 className="text-orange-500 w-5 h-5" />}
                      </div>
                    ))}
                    <button 
                      onClick={() => setIsManualInput(true)}
                      className="w-full mt-4 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-orange-500 hover:text-orange-500 transition-all"
                    >
                      + 手动输入新地址
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <input placeholder="省份" required className="p-3 bg-gray-50 border rounded-xl outline-none focus:border-orange-500 font-bold" onChange={(e) => setManualAddr({...manualAddr, province: e.target.value})} />
                      <input placeholder="城市" required className="p-3 bg-gray-50 border rounded-xl outline-none focus:border-orange-500 font-bold" onChange={(e) => setManualAddr({...manualAddr, city: e.target.value})} />
                      <input placeholder="区/县" className="p-3 bg-gray-50 border rounded-xl outline-none focus:border-orange-500 font-bold" onChange={(e) => setManualAddr({...manualAddr, district: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full py-4 bg-orange-500 text-white font-black rounded-xl shadow-lg">确认地址</button>
                    <button type="button" onClick={() => setIsManualInput(false)} className="w-full text-sm text-gray-400 font-bold">返回常用地址</button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );

}
