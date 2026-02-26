import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Headphones, PhoneCall, ChevronRight, User } from 'lucide-react';

export default function Service() {
  const [messages, setMessages] = useState([
    { role: 'system', text: '您好！我是东北味道的首席客服老铁。请点击左侧业务或直接输入，我将为您竭诚服务！🌾' }
  ]);
  const [input, setInput] = useState('');
  const [activeMenu, setActiveMenu] = useState(null); // 当前展开的子菜单
  const chatEndRef = useRef(null);

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 业务逻辑配置
  const serviceLogic = {
    '物流进度查询': ['查询最新订单', '顺丰单号没动', '修改配送时间'],
    '退换货申请': ['收到货坏了', '不想要了怎么退', '退款多久到账'],
    '商品真伪鉴定': ['如何辨别正宗五常米', '红肠外包装校验', '防伪码扫不出来'],
    '加盟与合作': ['想开线下加盟店', '大宗采购咨询', '供应商入驻'],
  };

  const botResponses = {
    '查询最新订单': '正在调取您的黑土地包裹信息... 顺丰单号 SF1422**** 已发车，预计明天下午抵达！',
    '收到货坏了': '哎呀真对不住！老铁别上火，请拍摄破损照片发给俺，俺直接给您补发一份新鲜的！',
    '如何辨别正宗五常米': '正宗五常大米有中国地理标志保护产品标识，颗粒细长，开锅满屋香。咱家全是核心产区直供，放心吃！',
    '想开线下加盟店': '热烈欢迎！请留下您的联系电话，我们的招商负责人会在 2 小时内给您回电。'
  };

  const handleQuickCommand = (cmd) => {
    // 1. 用户“说出”指令
    const userMsg = { role: 'user', text: cmd };
    setMessages(prev => [...prev, userMsg]);

    // 2. 机器人回复
    setTimeout(() => {
      const replyText = botResponses[cmd] || `收到关于“${cmd}”的咨询，正在为您转接高级人工客服...`;
      setMessages(prev => [...prev, { role: 'system', text: replyText }]);
    }, 800);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧：带子菜单的快捷服务 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 sticky top-28">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
              <Headphones className="text-brand"/> 智能自助台
            </h2>
            <div className="space-y-4">
              {Object.keys(serviceLogic).map(menu => (
                <div key={menu} className="space-y-2">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                    className={`w-full flex justify-between items-center p-4 rounded-2xl transition-all font-bold ${activeMenu === menu ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-gray-50 text-gray-700 hover:bg-brand/5'}`}
                  >
                    {menu} <ChevronRight className={`transition-transform ${activeMenu === menu ? 'rotate-90' : ''}`}/>
                  </button>
                  
                  {/* 展开的三个快捷选项 */}
                  <AnimatePresence>
                    {activeMenu === menu && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 space-y-2">
                        {serviceLogic[menu].map(option => (
                          <button 
                            key={option} onClick={() => handleQuickCommand(option)}
                            className="w-full text-left p-3 text-sm font-bold text-gray-500 hover:text-brand hover:bg-white rounded-xl transition-all flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-brand rounded-full"></span> {option}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：对话窗口 */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[750px]">
          <div className="bg-slate-900 p-6 flex items-center gap-4 text-white">
             <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center font-black">老铁</div>
             <div><h3 className="font-bold">首席客服 - 老铁 (在线)</h3><p className="text-xs text-gray-400">响应时间：&lt; 1分钟</p></div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            {messages.map((msg, idx) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${msg.role === 'user' ? 'bg-slate-700' : 'bg-brand'}`}>
                    {msg.role === 'user' ? <User size={14}/> : '店'}
                  </div>
                  <div className={`p-4 rounded-2xl font-bold shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <div className="flex gap-4">
               <input 
                 value={input} onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleQuickCommand(input)}
                 placeholder="老铁，想问点啥？输入并按回车..." 
                 className="flex-1 p-4 rounded-2xl border-2 border-transparent focus:border-brand outline-none transition-all shadow-inner font-bold"
               />
               <button onClick={() => handleQuickCommand(input)} className="bg-brand text-white px-8 rounded-2xl font-black shadow-lg shadow-brand/30 hover:scale-105 active:scale-95 transition-all">发送</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}