import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Lock, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = () => axios.get('http://localhost:8000/api/cart').then(res => setCartItems(res.data));
  useEffect(() => { fetchCart(); }, []);

  const updateQuantity = async (cartId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      await axios.post('http://localhost:8000/api/cart', { product_id: cartItems.find(i => i.cart_id === cartId).id, quantity: delta });
      fetchCart();
    } catch(err) { console.error(err); }
  };

  const removeItem = async (cartId) => {
    await axios.delete(`http://localhost:8000/api/cart/${cartId}`);
    fetchCart();
  };

  const checkout = async () => {
    if (cartItems.length === 0) return;
    try {
      await axios.post('http://localhost:8000/api/orders/checkout');
      alert('✅ 支付成功！东北的美味正在打包中...');
      navigate('/profile');
    } catch (err) { alert('结算异常，请稍后重试'); }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl font-black text-gray-900 mb-8">购物车</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">您的购物车是空的</h2>
            <p className="text-gray-500 mb-8">再去逛逛，发现更多地道东北美味吧！</p>
            <Link to="/" className="inline-block px-10 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-full shadow-md transition-colors">
              继续购物
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 左侧：商品列表 */}
            <div className="flex-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <span className="font-bold text-gray-700">商品信息</span>
                  <span className="text-sm text-gray-500">共 {cartItems.length} 件特产</span>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map(item => (
                    <motion.div key={item.cart_id} layout className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative group hover:bg-gray-50 transition-colors">
                      
                      <Link to={`/product/${item.id}`} className="shrink-0 block">
                        <img src={item.image} alt={item.name} className="w-32 h-32 object-contain bg-white border border-gray-100 rounded-lg p-2" />
                      </Link>
                      
                      <div className="flex-1 flex flex-col justify-between w-full h-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/product/${item.id}`} className="font-bold text-lg text-gray-900 hover:text-brand line-clamp-2 leading-tight pr-8">{item.name}</Link>
                            <p className="text-sm text-green-600 font-bold mt-2">现货</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">官方自营</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-black text-red-600">¥{(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-400">单价: ¥{item.price}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden shadow-sm">
                            <button onClick={() => updateQuantity(item.cart_id, item.quantity, -1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold">-</button>
                            <span className="px-4 py-1.5 font-bold text-sm bg-gray-50 border-x border-gray-300">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cart_id, item.quantity, 1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold">+</button>
                          </div>
                          
                          <button onClick={() => removeItem(item.cart_id)} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            <Trash2 className="w-4 h-4" /> 删除
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：订单摘要与结算 */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24 overflow-hidden">
                <div className="p-6">
                  <h3 className="font-black text-lg text-gray-900 mb-6">订单摘要</h3>
                  
                  <div className="space-y-4 mb-6 text-sm text-gray-600">
                    <div className="flex justify-between"><span>商品总计：</span><span>¥{total.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>运费：</span><span className="text-green-600 font-bold">免邮</span></div>
                    <div className="flex justify-between"><span>活动优惠：</span><span className="text-red-500">-¥0.00</span></div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 mb-6 flex justify-between items-end">
                    <span className="font-bold text-gray-900">实付款：</span>
                    <span className="text-3xl font-black text-red-600">¥{total.toFixed(2)}</span>
                  </div>

                  <button onClick={checkout} className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-full shadow-sm mb-4 transition-colors text-lg">
                    去结算 ({cartItems.length}件)
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                    <Lock className="w-4 h-4 text-green-600" />
                    安全支付保障体系
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    提示：商品价格、包装、产地等信息可能随时变动，请以最终结算页面和实物为准。
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}