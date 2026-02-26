import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Smartphone, Github, Chrome, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('phone');

  const handleSimulateLogin = (e, provider) => {
    e.preventDefault();
    // 核心逻辑：把登录状态和模拟的用户名存入浏览器的本地存储
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', '尊贵的东北老铁');
    
    alert(`✅ 模拟 ${provider} 登录成功！欢迎回来。`);
    // 使用这种方式可以强制让 Navbar 重新感知到登录状态
    window.location.href = '/profile'; 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* 左侧：品牌视觉 */}
        <div className="md:w-5/12 bg-slate-900 text-white p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-black tracking-tight flex items-center gap-2 mb-12">
              🌾 东北<span className="text-brand">味道</span>
            </Link>
            <h2 className="text-4xl font-black leading-tight mb-6">开启您的<br/><span className="text-brand">寻味之旅</span></h2>
            <p className="text-gray-400 leading-relaxed">加入我们，享受原产地直供的极品山珍与特色美食。新人注册即享 88 元专享红包。</p>
          </div>
          <div className="relative z-10 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span className="font-bold text-sm">平台级安全防护</span>
            </div>
            <p className="text-xs text-gray-400">您的隐私和交易数据均经过企业级 SSL 加密，请放心使用。</p>
          </div>
        </div>

        {/* 右侧：交互表单 */}
        <div className="md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">欢迎回来</h3>
            <p className="text-gray-500 mb-8">请选择您的登录方式以继续</p>

            <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
              <button onClick={() => setLoginMethod('phone')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 ${loginMethod === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                <Smartphone className="w-4 h-4" /> 手机快捷登录
              </button>
              <button onClick={() => setLoginMethod('email')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 ${loginMethod === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                <Mail className="w-4 h-4" /> 账号密码登录
              </button>
            </div>

            <form className="space-y-5 mb-8">
              {loginMethod === 'phone' ? (
                <>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1.5">手机号码</label><input type="text" placeholder="请输入 11 位手机号" className="w-full bg-gray-50 border px-4 py-3 rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1.5">验证码</label><div className="flex gap-3"><input type="text" placeholder="6位验证码" className="w-full bg-gray-50 border px-4 py-3 rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" /><button type="button" className="px-6 bg-brand/10 text-brand font-bold rounded-xl whitespace-nowrap">获取验证码</button></div></div>
                </>
              ) : (
                <>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1.5">邮箱账号</label><input type="email" placeholder="example@dongbei.com" className="w-full bg-gray-50 border px-4 py-3 rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" /></div>
                  <div><div className="flex justify-between mb-1.5"><label className="block text-sm font-bold text-gray-700">密码</label><span className="text-xs text-brand cursor-pointer">忘记密码？</span></div><input type="password" placeholder="••••••••" className="w-full bg-gray-50 border px-4 py-3 rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" /></div>
                </>
              )}
              <button onClick={(e) => handleSimulateLogin(e, '系统账号')} className="w-full bg-brand text-white font-bold py-3.5 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                立即登录 <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative flex items-center py-4 mb-6"><div className="flex-grow border-t"></div><span className="px-4 text-xs text-gray-400">其他方式登录</span><div className="flex-grow border-t"></div></div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={(e) => handleSimulateLogin(e, 'Google')} className="flex items-center justify-center gap-2 border bg-white py-3 rounded-xl font-bold"><Chrome className="w-5 h-5 text-blue-500" /> Google</button>
              <button onClick={(e) => handleSimulateLogin(e, 'GitHub')} className="flex items-center justify-center gap-2 border bg-[#24292F] text-white py-3 rounded-xl font-bold"><Github className="w-5 h-5" /> GitHub</button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
