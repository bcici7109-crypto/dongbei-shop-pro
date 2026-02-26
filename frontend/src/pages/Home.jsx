import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ShoppingCart, Star, Zap, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取 URL 里的查询参数 (比如 /?q=大米)
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    axios.get('http://localhost:8000/api/products').then(res => setProducts(res.data)).catch(err => console.error(err));
  }, []);

  const quickAddToCart = async (e, productId) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/cart', { product_id: productId, quantity: 1 });
      alert('已成功加入购物车！');
    } catch (err) { alert('加购失败'); }
  };

  // 核心：如果存在 searchQuery，就对商品进行过滤；否则展示全部
  const filteredProducts = products.filter(p => 
    p.name.includes(searchQuery) || p.description.includes(searchQuery) || p.category.includes(searchQuery)
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      
      {/* 顶部广告位 (如果正在搜索，则隐藏广告以突出结果) */}
      {!searchQuery && (
        <div className="relative bg-slate-900 h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-brand/20 z-0"></div>
          <div className="absolute -right-20 top-0 w-96 h-96 bg-brand/30 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="bg-brand text-white px-3 py-1 text-xs md:text-sm font-black uppercase tracking-widest rounded-sm mb-4 inline-block shadow-lg">Prime 品质甄选</span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">探索黑土地的 <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-yellow-400">极品珍馐</span></h1>
              <p className="text-gray-300 text-sm md:text-lg mb-8 max-w-2xl mx-auto">严格原产地直采，冷链极速送达。为您还原那份最纯粹、最地道的家乡记忆。</p>
            </motion.div>
          </div>
        </div>
      )}

      {/* 主体内容区 */}
      <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 ${searchQuery ? 'pt-12' : '-mt-10'}`}>
        
        {/* 如果有搜索词，显示搜索结果提示 */}
        {searchQuery && (
          <div className="mb-8 text-xl text-gray-800 font-bold">
            为您找到 "{searchQuery}" 的相关商品共 <span className="text-brand">{filteredProducts.length}</span> 件：
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 左侧边栏 - 增加了 sticky top-28 和 h-fit 实现完美的滚动吸附 */}
          <div className="hidden lg:block w-64 shrink-0 space-y-6 sticky top-28 h-fit">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2">热门分类</h3>
              <ul className="space-y-3">
                {Object.keys(products.reduce((acc, p) => { acc[p.category]=1; return acc; }, {})).map(category => (
                  <li key={category}>
                    <button onClick={() => navigate(`/?q=${category}`)} className="w-full text-left text-gray-600 hover:text-brand font-medium flex items-center justify-between group">
                      {category} <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-brand/10 p-5 rounded-xl border border-brand/20">
              <h3 className="font-bold text-brand mb-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> 平台保障</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✅ 产地直供 假一赔十</li>
                <li>✅ 坏单包赔 极速退款</li>
                <li>✅ 顺丰冷链 全国包邮</li>
              </ul>
            </div>
          </div>

          {/* 右侧商品流 */}
          <div className="flex-1 space-y-12">
            {Object.keys(groupedProducts).length === 0 ? (
              <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-200">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">未找到相关商品</h3>
                <p className="text-gray-500 mb-6">换个关键词试试，比如“大米”或“冻梨”</p>
                <button onClick={() => navigate('/')} className="bg-brand text-white px-6 py-2 rounded-full font-bold">返回全部商品</button>
              </div>
            ) : (
              Object.entries(groupedProducts).map(([category, items]) => (
                <div key={category} id={`category-${category}`} className="scroll-mt-28">
                  <div className="flex items-end justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3"><div className="w-1.5 h-8 bg-brand rounded-full"></div><h2 className="text-2xl font-black text-gray-900">{category}</h2></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {items.map((product, idx) => (
                      <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                        <Link to={`/product/${product.id}`} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200 h-full relative">
                          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">官方自营</div>
                          <div className="relative aspect-square overflow-hidden bg-gray-50 p-4"><img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" /></div>
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-brand transition-colors">{product.name}</h3>
                            <div className="flex items-center gap-1 mt-1.5"><div className="flex text-yellow-400">{[1,2,3,4,5].map(star => <Star key={star} className="w-3 h-3 md:w-4 md:h-4 fill-current" />)}</div><span className="text-[10px] md:text-xs text-brand hover:underline cursor-pointer">{Math.floor(Math.random() * 500 + 100)} 条评价</span></div>
                            <div className="mt-auto pt-4 flex flex-col gap-2">
                              <div className="flex items-end gap-1"><span className="text-xs text-red-600 font-bold">¥</span><span className="text-xl md:text-2xl font-black text-red-600 leading-none">{product.price}</span><span className="ml-2 text-[10px] font-bold text-blue-600 italic border border-blue-600 px-1 rounded-sm">V-Prime</span></div>
                              <button onClick={(e) => quickAddToCart(e, product.id)} className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-sm rounded-full shadow-sm flex items-center justify-center gap-1 transition-colors"><ShoppingCart className="w-4 h-4" /> 加入购物车</button>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}