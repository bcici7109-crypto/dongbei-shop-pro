import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Zap, Star, ShieldCheck, Truck, RotateCcw, Heart, Share2, MapPin, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetail({ favorites = [], onToggleFavorite }) {
  const { id } = useParams();
  const productId = parseInt(id);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  
  // 从全局 favorites 数组中判断是否已收藏
  const isFavorite = favorites.includes(productId);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${productId}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("加载商品失败:", err));
    window.scrollTo(0, 0);
  }, [productId]);

  const addToCart = async () => {
    try {
      await axios.post('http://localhost:8000/api/cart', { product_id: productId, quantity });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      alert("添加失败，请检查后端服务是否开启");
    }
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-xl text-gray-500 font-bold italic">正在为您采摘黑土地的新鲜宝贝...</div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 面包屑导航 */}
      <div className="bg-gray-100 border-b border-gray-200 text-xs text-gray-500 py-2.5 px-4 max-w-[1400px] mx-auto">
        首页 &gt; {product.category} &gt; <span className="text-gray-900 font-bold">{product.name}</span>
      </div>

      {/* 提示弹窗 */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-bold"
          >
            <CheckCircle2 className="w-6 h-6" /> 已成功加入购物车
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* 左侧：大图展示 */}
          <div className="w-full lg:w-2/5 shrink-0">
            <div className="sticky top-28">
              <div className="border-2 border-gray-50 rounded-[40px] overflow-hidden bg-white relative group shadow-inner">
                <span className="absolute top-8 left-8 bg-orange-600 text-white text-xs font-black px-4 py-1.5 rounded-full z-10 shadow-lg uppercase tracking-widest">Official Direct</span>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full aspect-square object-contain p-12 group-hover:scale-110 transition-transform duration-1000" 
                />
              </div>
              
              <div className="flex items-center justify-center gap-12 mt-10">
                <button 
                  onClick={() => onToggleFavorite(productId)}
                  className={`flex items-center gap-2 font-black transition-all transform active:scale-75 ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                >
                  <motion.div animate={isFavorite ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}>
                    <Heart className={`w-7 h-7 ${isFavorite ? 'fill-current' : ''}`} />
                  </motion.div>
                  {isFavorite ? '已收藏此宝贝' : '收藏此宝贝'}
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-orange-500 font-black transition-colors">
                  <Share2 className="w-7 h-7" /> 分享
                </button>
              </div>
            </div>
          </div>
          
          {/* 中间：信息介绍 */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
            <p className="text-xl text-gray-400 font-medium mb-10 tracking-wide">{product.subtitle}</p>
            
            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
              <div className="flex text-orange-400">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-orange-600 font-black text-lg">4.9 Excellent</span>
              <span className="text-gray-300 text-sm">|</span>
              <span className="text-gray-500 font-bold tracking-tighter">月销 8,000+ 件</span>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-10 mb-12 shadow-2xl relative overflow-hidden group">
               <Zap className="absolute right-[-30px] bottom-[-30px] w-48 h-48 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
               <div className="relative z-10">
                 <span className="text-orange-500 font-black text-xs uppercase tracking-[0.2em] mb-4 block">Limited Time Offer</span>
                 <div className="flex items-baseline gap-4">
                   <span className="text-6xl font-black text-white tracking-tighter"><span className="text-2xl mr-1">¥</span>{product.price}</span>
                   <span className="text-gray-500 line-through text-xl">¥{(product.price * 1.5).toFixed(1)}</span>
                 </div>
               </div>
            </div>

            <div className="space-y-8">
               <h3 className="text-2xl font-black flex items-center gap-3 text-gray-900">
                 <div className="w-2 h-8 bg-orange-500 rounded-full"></div> 商品亮点
               </h3>
               <div className="bg-orange-50/30 p-8 rounded-[32px] border-l-8 border-orange-500">
                  <p className="text-gray-700 leading-relaxed text-xl font-bold italic italic">
                    "{product.description}"
                  </p>
               </div>
            </div>
          </div>

          {/* 右侧：购买面板 */}
          <div className="w-full lg:w-1/5 shrink-0">
            <div className="border-2 border-gray-100 rounded-[40px] p-8 sticky top-28 bg-white shadow-2xl shadow-gray-200/50">
              <div className="space-y-5 mb-10 text-sm font-bold">
                <div className="flex items-center gap-3 text-green-600"><Truck className="w-5 h-5"/> 顺丰冷链·全国包邮</div>
                <div className="flex items-center gap-3 text-gray-500"><MapPin className="w-5 h-5"/> 配送至 全国主要城市</div>
                <div className="flex items-center gap-3 text-gray-500"><RotateCcw className="w-5 h-5"/> 7天无理由退换</div>
              </div>

              <div className="mb-10">
                <label className="block font-black text-gray-900 mb-4 text-xs uppercase tracking-widest text-center">选择购买数量</label>
                <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-12 rounded-xl bg-white shadow-sm font-black text-xl hover:text-orange-500 transition-colors">-</button>
                  <span className="w-16 text-center font-black text-2xl">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-12 rounded-xl bg-white shadow-sm font-black text-xl hover:text-orange-500 transition-colors">+</button>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={addToCart} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center gap-3">
                  <ShoppingCart className="w-6 h-6" /> 加入购物车
                </button>
                <button onClick={() => { addToCart(); navigate('/cart'); }} className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl shadow-xl hover:bg-orange-600 transition-all transform active:scale-95 flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6" /> 立即购买
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}