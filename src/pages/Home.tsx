import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- 1. 引入本地图片 ---
import restaurantImg from '@/assets/images/restaurant.png';
import airportImg from '@/assets/images/airport.png';
import taxiImg from '@/assets/images/taxi.png';
import hospitalImg from '@/assets/images/hospital.png';
import coffeeShopImg from '@/assets/images/coffee_shop.png';
import storeImg from '@/assets/images/store.png';
import businessImg from '@/assets/images/business.png';

// --- 2. 数据源 ---
const SCENES = [
  {
    id: 'coffee_shop',
    title: '咖啡馆聊天',
    description: '在咖啡馆与朋友或店员交流，练习日常英语对话',
    level: '入门',
    vocabulary: '咖啡、饮品、聊天、休闲',
    background: coffeeShopImg , 
    characters: [
        { id: 'customer', name: '顾客', description: '在咖啡馆消费的顾客', avatar: '👤' },
        { id: 'barista', name: '咖啡师', description: '咖啡馆的工作人员', avatar: '☕' },
      ],
  },
  {
    id: 'store',
    title: '商场购物',
    description: '在商场购物时与店员交流，练习购物相关英语',
    level: '初级',
    vocabulary: '商品、价格、尺码、支付',
    background: storeImg ,
    characters: [
        { id: 'customer', name: '顾客', description: '在商店购物的顾客', avatar: '👜' },
        { id: 'salesperson', name: '店员', description: '商店的销售人员', avatar: '👨‍💼' },
      ],
  },
  {
    id: 'restaurant',
    title: '餐馆点餐',
    description: '在西餐厅体验点餐过程，练习餐饮相关英语表达',
    level: '初级',
    vocabulary: '菜单、食物、饮品、点餐用语',
    background: restaurantImg ,
    characters: [
        { id: 'customer', name: '顾客', description: '餐厅顾客，需要点餐和询问菜品', avatar: '👤' },
        { id: 'waiter', name: '服务员', description: '餐厅服务员，提供菜单和服务', avatar: '👨‍🍳' },
      ],
  },
  {
    id: 'taxi',
    title: '出租车出行',
    description: '乘坐出租车时与司机交流，练习方位和交通相关英语',
    level: '初级',
    vocabulary: '地点、方向、交通、时间',
    background: taxiImg ,
    characters: [
        { id: 'passenger', name: '乘客', description: '需要前往特定地点的乘客', avatar: '👤' },
        { id: 'driver', name: '司机', description: '出租车司机，提供接送服务', avatar: '🚕' },
      ],
  },
  {
    id: 'airport',
    title: '机场办理',
    description: '在机场办理登机手续，练习旅行相关英语对话',
    level: '中级',
    vocabulary: '登机、行李、航班、航站楼',
    background: airportImg ,
    characters: [
        { id: 'passenger', name: '乘客', description: '需要办理登机手续的旅客', avatar: '🧳' },
        { id: 'checkin_agent', name: '地勤人员', description: '机场办理登机手续的工作人员', avatar: '👩‍✈️' },
      ],
  },
  {
    id: 'hospital',
    title: '医院就诊',
    description: '在医院看病时与医生交流，学习医疗相关英语表达',
    level: '中级',
    vocabulary: '症状、疾病、药品、治疗',
    background: hospitalImg,
    characters: [
        { id: 'patient', name: '病人', description: '前往医院就诊的患者', avatar: '🤒' },
        { id: 'doctor', name: '医生', description: '为病人诊断和治疗的医生', avatar: '👨‍⚕️' },
        { id: 'nurse', name: '护士', description: '协助医生并照顾病人的护士', avatar: '👩‍⚕️' },
      ],
  },
  {
    id: 'business',
    title: '商务会议',
    description: '参与商务会议，学习商务英语表达和谈判技巧',
    level: '高级',
    vocabulary: '商务术语、会议用语、谈判技巧',
    background: businessImg,
    characters: [
        { id: 'participant', name: '参会者', description: '参加会议的商务人士', avatar: '👨‍💼' },
        { id: 'presenter', name: '主讲人', description: '在会议上做演示的人', avatar: '📊' },
        { id: 'chair', name: '主持人', description: '主持会议的人', avatar: '👥' },
      ],
  },
];

const CUSTOM_SCENE_ID = 'custom_ai_scene';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [selectedSceneId, setSelectedSceneId] = useState<string>(SCENES[0].id);
  
  // 自定义场景输入状态
  const [customPrompt, setCustomPrompt] = useState({
    title: '',
    role: '',
    keywords: '',
  });

  const currentScene = SCENES.find(s => s.id === selectedSceneId);
  const isCustomScene = selectedSceneId === CUSTOM_SCENE_ID;

  const handleSceneSelect = (id: string) => {
    setSelectedSceneId(id);
  };

  const startLearning = () => {
    if (isCustomScene) {
      navigate(`/scene/${CUSTOM_SCENE_ID}`, { 
        state: { isCustom: true, ...customPrompt } 
      });
    } else if (currentScene) {
      navigate(`/scene/${currentScene.id}`);
    }
  };

  return (
    <div className={`h-screen overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        >
          SpeakBuddy AI
        </motion.h1>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? <i className="fa-solid fa-sun text-yellow-400"></i> : <i className="fa-solid fa-moon text-gray-600"></i>}
        </button>
      </header>

      <main className="flex-1 min-h-0 flex flex-col lg:flex-row p-6 gap-6 max-w-screen-2xl mx-auto w-full">  
        
        {/* --- 左侧列表 --- */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/3 xl:w-[35%] flex flex-col gap-4 h-full overflow-y-auto p-2 no-scrollbar"
        >
          <h2 className="text-2xl font-bold px-1 mb-2">选择学习场景</h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-4">
            {SCENES.map((scene) => (
              <SceneCard 
                key={scene.id} 
                scene={scene} 
                isSelected={selectedSceneId === scene.id} 
                onClick={() => handleSceneSelect(scene.id)} 
              />
            ))}

            {/* --- AI 自定义场景卡片 --- */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSceneSelect(CUSTOM_SCENE_ID)}
              className={`p-5 rounded-2xl border-2 transition-all text-left flex flex-col justify-between min-h-[140px] group relative overflow-hidden ${
                isCustomScene
                  ? 'border-transparent shadow-lg shadow-purple-500/30' // 选中：无边框（由背景填充），强阴影
                  : 'border-dashed border-purple-300 dark:border-purple-800 bg-white dark:bg-gray-800 hover:border-purple-400 dark:hover:border-purple-600' // 未选中：虚线框，干净背景
              }`}
            >
              {/* 背景层：只在选中时显示渐变 */}
              {isCustomScene && (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 z-0"></div>
              )}

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-xl leading-tight transition-colors ${
                      isCustomScene ? 'text-white' : 'text-gray-800 dark:text-gray-100'
                    }`}>
                      AI 自由对话
                    </h3>
                    {/* 图标：选中时跳动，未选中时紫色 */}
                    <i className={`fa-solid fa-wand-magic-sparkles text-xl transition-colors ${
                      isCustomScene ? 'text-yellow-300 animate-pulse' : 'text-purple-500'
                    }`}></i>
                  </div>
                  <p className={`text-sm line-clamp-3 transition-colors ${
                    isCustomScene ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    没有找到想要的场景？自定义你的专属对话练习。
                  </p>
                </div>

                <div className="mt-4">
                   <span className={`text-xs px-2 py-1 rounded-md font-medium border transition-colors ${
                     isCustomScene 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-gray-700 dark:text-purple-300 dark:border-gray-600'
                   }`}>
                      Free Talk
                   </span>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* --- 右侧内容区 --- */}
        <motion.div 
          layout
          className="w-full lg:w-2/3 xl:w-[65%] flex flex-col h-full overflow-y-auto no-scrollbar"
        >
          <div className="flex flex-col gap-5 h-full">
            
            {isCustomScene ? (
              // >>> 自定义场景视图 <<<
              <div className="flex-grow flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-violet-900 text-white relative transition-all duration-500">
                
                {/* 装饰性光晕 */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                
                <div className="p-8 md:p-12 z-10 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-purple-200 mb-4">
                       <i className="fa-solid fa-bolt text-yellow-400"></i> AI Powered
                    </div>
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-200 mb-3">
                      创建你的练习场景
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl">
                    </p>
                  </div>

                  {/* 输入表单 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-purple-200 mb-2 ml-1">场景主题 (Topic)</label>
                        <input 
                          type="text" 
                          // 修改点：更务实的 Placeholder
                          placeholder="例如英文技术面试、雅思口语 Part 2..." 
                          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:bg-white/10 focus:ring-1 focus:ring-purple-400 outline-none transition-all placeholder-gray-500 text-white"
                          value={customPrompt.title}
                          onChange={(e) => setCustomPrompt({...customPrompt, title: e.target.value})}
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-purple-200 mb-2 ml-1">对方角色 (Role)</label>
                        <input 
                          type="text" 
                          // 修改点：更务实的 Placeholder
                          placeholder="例如严厉的面试官、房东、甚至你喜欢的影视角色..." 
                          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:bg-white/10 focus:ring-1 focus:ring-purple-400 outline-none transition-all placeholder-gray-500 text-white"
                          value={customPrompt.role}
                          onChange={(e) => setCustomPrompt({...customPrompt, role: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="h-full flex flex-col">
                        <label className="block text-sm font-semibold text-purple-200 mb-2 ml-1">重点词汇/要求 (Optional)</label>
                        <textarea 
                          rows={5}
                    
                          placeholder="输入你想练习的单词或短语，AI 会在对话中引导或使用。&#10;例如：salary expectation, five-year plan, leadership..." 
                          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:bg-white/10 focus:ring-1 focus:ring-purple-400 outline-none transition-all placeholder-gray-500 text-white resize-none flex-grow"
                          value={customPrompt.keywords}
                          onChange={(e) => setCustomPrompt({...customPrompt, keywords: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <p className="text-sm text-gray-400 hidden md:block">
                      <i className="fa-regular fa-lightbulb mr-2"></i>
                      提示：描述越详细，AI 的表现越逼真。
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startLearning}
                      disabled={!customPrompt.title}
                      className={`px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-xl shadow-lg flex items-center gap-3 transition-all ${
                        !customPrompt.title ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-purple-500/40'
                      }`}
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      生成场景并开始
                    </motion.button>
                  </div>
                </div>
              </div>

            ) : (
              // >>> 普通场景视图 (保持不变) <<<
              currentScene && (
                <>
                  <div className="relative h-64 sm:h-72 shrink-0 rounded-2xl overflow-hidden shadow-lg group">
                    <AnimatePresence mode='wait'>
                      <motion.div 
                        key={currentScene.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0"
                      >
                        <img 
                          src={currentScene.background} 
                          alt={currentScene.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      </motion.div>
                    </AnimatePresence>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <motion.div
                        key={currentScene.id + "-text"}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      >
                        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{currentScene.title}</h2>
                        <p className="text-white/90 text-base font-medium">
                          <i className="fa-solid fa-quote-left mr-2 opacity-60"></i>
                          {currentScene.vocabulary}
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  <div className={`flex-grow p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col`}>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-crosshairs text-blue-500"></i>
                        学习目标
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                        {currentScene.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FeatureCard icon="fa-language" color="green" title="翻译助手" desc="辅助工具" onClick={() => navigate('/translation')} />
                        <FeatureCard icon="fa-book" color="purple" title="场景词汇" desc="核心词汇" onClick={() => navigate('/wordbook')} />
                        <FeatureCard icon="fa-headphones" color="blue" title="发音纠正" desc="实时评分" onClick={() => navigate('/pronunciation')} />
                        <FeatureCard icon="fa-trophy" color="amber" title="历史成绩" desc="查看进度" onClick={() => navigate('/achievements')} />
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={startLearning}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex justify-center items-center gap-3"
                      >
                        <span className="p-1 bg-white/20 rounded-full"><i className="fa-solid fa-play text-xs block w-4 h-4 leading-4 text-center"></i></span>
                        进入场景开始对话
                      </motion.button>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// 保持不变的辅助组件
const SceneCard = ({ scene, isSelected, onClick }: any) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 transition-all text-left flex flex-col justify-between min-h-[140px] group ${
        isSelected 
          ? 'border-blue-500 bg-blue-600 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
      }`}
    >
      <div>
        <h3 className={`font-bold text-xl leading-tight mb-2 ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
          {scene.title}
        </h3>
        <p className={`text-sm leading-relaxed line-clamp-3 ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {scene.description}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-xs px-2 py-1 rounded-md font-medium ${
          isSelected
            ? 'bg-white/20 text-white' 
            : (
                scene.level === '入门' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                scene.level === '初级' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
              )
        }`}>
          {scene.level}
        </span>
      </div>
    </motion.button>
  );
};

const FeatureCard = ({ icon, color, title, desc, onClick }: any) => {
  const colorMap: any = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };

  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 cursor-pointer transition-colors hover:bg-white dark:hover:bg-gray-700"
      onClick={onClick}
    >
      <div className={`p-3 rounded-full ${colorMap[color]} mb-3 text-xl`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h4 className="font-bold text-gray-800 dark:text-gray-200">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
    </motion.div>
  );
};