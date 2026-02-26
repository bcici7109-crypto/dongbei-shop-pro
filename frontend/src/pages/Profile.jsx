import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, MapPin, Phone, Mail, Save, Package, Heart, CreditCard, Bell, ChevronRight, LogOut, Wallet, Gift, Coins, Info, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile({ favorites = [] }) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', email: '' });
  const [allProducts, setAllProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const navigate = useNavigate();

  useEffect(() => {
    // 获取用户数据
    axios.get('http://localhost:8000/api/user').then(res => { if (res.data) setFormData(res.data); });
    // 获取商品库，用于渲染收藏夹
    axios.get('http://localhost:8000/api/products').then(res => setAllProducts(res.data));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const saveUser = async () => {
    try {
      await axios.put('http://localhost:8000/api/user', formData);
      setIsEditing(false);
      alert('✅ 资料已同步至云端');
    } catch (err) { alert('同步失败'); }
  };

  // 根据全局 favorites 数组过滤出被收藏的商品
  const myFavoriteProducts = allProducts.filter(p => favorites.includes(p.id));

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 左侧菜单 */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-28">
              <div className="p-10 bg-slate-900 text-white flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-4xl font-black mb-6 border-4 border-white/10 shadow-2xl shadow-orange-500/20">
                  {formData.name ? formData.name.charAt(0) : '客'}
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tight">{formData.name || '东北老铁'}</h2>
                <div className="bg-orange-500/20 text-orange-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-orange-500/30">
                  Premium Member
                </div>
              </div>
              
              <nav className="p-6 space-y-2">
                {[
                  { id: 'orders', name: '我的订单', icon: <Package size={20}/> },
                  { id: 'wallet', name: '我的钱包', icon: <Wallet size={20}/> },
                  { id: 'favs', name: '收藏夹', icon: <Heart size={20}/> },
                  { id: 'msg', name: '消息中心', icon: <Bell size={20}/> },
                  { id: 'account', name: '账户资料', icon: <User size={20}/> },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === item.id ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    {item.icon} {item.name}
                  </button>
                ))}
                <button 
                  onClick={() => { localStorage.clear(); navigate('/'); window.location.reload(); }}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-red-400 hover:bg-red-50 mt-10 transition-colors"
                >
                  <LogOut size={20} /> 退出登录
                </button>
              </nav>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              
              {/* 账户资料 */}
              {activeTab === 'account' && (
                <motion.div key="account" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-12">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter">账户资料与安全</h3>
                      <button onClick={() => setIsEditing(!isEditing)} className="px-8 py-3 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all text-sm">
                        {isEditing ? '取消修改' : '修改个人信息'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       {[
                         {f: 'name', n: '收货人姓名', i: <User/>},
                         {f: 'phone', n: '联系电话', i: <Phone/>},
                         {f: 'address', n: '详细配送地址', i: <MapPin/>},
                         {f: 'email', n: '电子邮箱', i: <Mail/>}
                       ].map((item) => (
                          <div key={item.f} className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{item.n}</label>
                             <div className={`flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all ${isEditing ? 'bg-white border-orange-500 shadow-lg shadow-orange-500/10' : 'bg-gray-50 border-transparent opacity-80'}`}>
                                <div className="text-orange-500">{item.i}</div>
                                <input 
                                  disabled={!isEditing} 
                                  name={item.f} 
                                  value={formData[item.f]} 
                                  onChange={handleChange} 
                                  className="w-full bg-transparent outline-none font-black text-gray-900" 
                                />
                             </div>
                          </div>
                       ))}
                    </div>
                    {isEditing && (
                      <button onClick={saveUser} className="mt-12 w-full py-5 bg-orange-500 text-white font-black rounded-[24px] shadow-2xl shadow-orange-500/40 hover:-translate-y-1 transition-all flex justify-center items-center gap-3">
                        <Save size={24}/> 同步至服务器
                      </button>
                    )}
                </motion.div>
              )}

              {/* 收藏夹逻辑 */}
              {activeTab === 'favs' && (
                 <motion.div key="favs" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 min-h-[600px]">
                    <h3 className="text-3xl font-black text-gray-900 mb-10 tracking-tighter flex items-center gap-4">
                      <Heart className="text-red-500 fill-current" size={32}/> 收藏清单
                    </h3>
                    
                    {myFavoriteProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                          <Heart className="w-16 h-16 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-300">还没有心动的宝贝</h3>
                        <button onClick={() => navigate('/')} className="mt-10 px-12 py-4 bg-orange-500 text-white font-black rounded-full shadow-2xl hover:scale-105 transition-all">前往商城挑选</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {myFavoriteProducts.map(product => (
                          <Link key={product.id} to={`/product/${product.id}`} className="flex items-center gap-6 p-6 rounded-[32px] border-2 border-gray-50 hover:border-orange-500/50 hover:shadow-2xl transition-all group relative overflow-hidden bg-white">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img src={product.image} alt={product.name} className="w-24 h-24 object-contain bg-gray-50 rounded-[24px] p-2 relative z-10" />
                            <div className="flex-1 relative z-10">
                              <h4 className="font-black text-xl text-gray-900 group-hover:text-orange-500 mb-1">{product.name}</h4>
                              <p className="text-xs text-gray-400 font-bold mb-3">{product.category}</p>
                              <div className="text-2xl font-black text-red-600 tracking-tighter">¥{product.price}</div>
                            </div>
                            <ChevronRight className="text-gray-200 group-hover:text-orange-500 transition-colors shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}
                 </motion.div>
              )}

              {/* 钱包 */}
              {activeTab === 'wallet' && (
                <motion.div key="wallet" initial={{opacity:0, x:20}} animate={{opacity:1, y:0}} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                      <Coins className="absolute -right-6 -bottom-6 w-40 h-40 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
                      <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Available Balance</p>
                      <h3 className="text-5xl font-black tracking-tighter italic">8,888.66</h3>
                      <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl text-xs font-black transition-all">DEPOSIT NOW</button>
                    </div>
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
                      <Coins className="text-orange-500 w-10 h-10 mb-4"/>
                      <div><p className="text-gray-400 font-black text-[10px] uppercase">Reward Points</p><h3 className="text-4xl font-black text-gray-900">12,450</h3></div>
                    </div>
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
                      <Gift className="text-red-500 w-10 h-10 mb-4"/>
                      <div><p className="text-gray-400 font-black text-[10px] uppercase">Coupons</p><h3 className="text-4xl font-black text-gray-900">5 <span className="text-sm font-normal">PCS</span></h3></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 消息中心 */}
              {activeTab === 'msg' && (
                <motion.div key="msg" initial={{opacity:0, x:20}} animate={{opacity:1, y:0}} className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 min-h-[600px]">
                  <h3 className="font-black text-3xl text-gray-900 mb-10 tracking-tighter flex items-center gap-4"><Bell className="text-orange-500"/> Notification</h3>
                  <div className="space-y-4">
                    <div className="p-8 rounded-[32px] bg-orange-50/50 border border-orange-200/50 flex gap-6">
                      <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xl shadow-orange-500/20 font-black">!</div>
                      <div>
                        <h4 className="font-black text-xl text-orange-600 mb-1">系统通知：订单发货提醒</h4>
                        <p className="text-gray-600 font-bold leading-relaxed">您的订单 [五常大米] 已由哈尔滨物流中心发出，请留意顺丰推送。</p>
                        <span className="text-[10px] text-gray-400 mt-4 block font-black uppercase tracking-widest">2 Minutes Ago</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}