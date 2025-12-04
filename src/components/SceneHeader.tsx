import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningContext } from '@/contexts/learningContext';
import { useTheme } from '@/hooks/useTheme';

interface SceneHeaderProps {
  onBack: () => void;
}

const SceneHeader: React.FC<SceneHeaderProps> = ({ onBack }) => {
  const context = useLearningContext();
  const { theme } = useTheme();

  if (!context || !context.scene) return null;

  const { scene, isImmersiveMode, toggleImmersiveMode, showWordPanel, setShowWordPanel } = context;

  // 修复点 1：定义动画变体 (Variants)
  // 将所有的位移控制全权交给 Framer Motion，不要在 className 里混用 translate 类
  const headerVariants = {
    hidden: { 
      y: -100, 
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    immersive: {
      y: '-100%', // 沉浸模式上移隐藏
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  return (
    <>
      {/* 
         修复点 2：使用 fixed 定位确保始终悬浮在最上层
         不再使用 sticky，因为 sticky 在隐藏时会留下空白占位。
      */}
      <motion.header 
        variants={headerVariants}
        // 根据是否沉浸模式决定当前动画状态
        initial="hidden"
        animate={isImmersiveMode ? "immersive" : "visible"}
        className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl border-b
          ${theme === 'dark' 
            ? 'bg-gray-900/80 border-white/5 shadow-sm' 
            : 'bg-white/80 border-gray-200/60 shadow-sm'
          }
        `}
      >
        <div className="max-w-[1920px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* 左侧：返回 + 标题区 */}
          <div className="flex items-center gap-4 md:gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border
                ${theme === 'dark' 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' 
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                }
              `}
              title="返回首页"
            >
              <i className="fa-solid fa-arrow-left text-sm"></i>
            </motion.button>

            <div className="flex flex-col">
              <h1 className={`text-lg md:text-xl font-bold leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {scene.title}
              </h1>
              <div className="flex items-center gap-2 text-xs mt-1 opacity-70">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border
                  ${scene.level === '入门' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    scene.level === '初级' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                    'bg-purple-500/10 text-purple-500 border-purple-500/20'}
                `}>
                  {scene.level}
                </span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-current opacity-30"></span>
                <span className={`truncate max-w-[200px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {scene.vocabulary}
                </span>
              </div>
            </div>
          </div>

          {/* 右侧：功能按钮区 */}
          <div className="flex items-center gap-3 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWordPanel(!showWordPanel)}
              className={`h-10 px-4 rounded-lg flex items-center gap-2 border transition-all
                ${showWordPanel
                  ? (theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border-indigo-100')
                  : (theme === 'dark' ? 'hover:bg-white/5 border-transparent text-gray-400' : 'hover:bg-gray-100 border-transparent text-gray-500')
                }
              `}
            >
              <i className={`fa-solid ${showWordPanel ? 'fa-book-open' : 'fa-book'} text-sm`}></i>
              <span className="hidden md:inline text-sm font-medium">单词</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleImmersiveMode}
              className={`h-10 pl-3 pr-5 rounded-full flex items-center gap-2 shadow-lg transition-all border border-white/10 relative overflow-hidden group
                ${isImmersiveMode 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-red-500/20' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-500/30'
                }
              `}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs bg-white/20 backdrop-blur-sm`}>
                <i className={`fa-solid ${isImmersiveMode ? 'fa-phone-slash' : 'fa-phone'}`}></i>
              </div>
              <span className="text-sm font-semibold tracking-wide">
                {isImmersiveMode ? '挂断' : '通话模式'}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* 
         修复点 3：占位符 (Spacer)
         这是一个空的 div，高度与 Header 相同。
         它的作用是把下方的内容“顶”下去，防止被 fixed 的 Header 遮挡。
         当 isImmersiveMode 为 true 时，我们将它隐藏（h-0），这样下方内容就会自动上移填补空间，实现真正的沉浸。
      */}
      <div 
        className={`w-full transition-all duration-300 ease-in-out
          ${isImmersiveMode ? 'h-0' : 'h-16 md:h-20'}
        `} 
      />
    </>
  );
};

export default SceneHeader;