import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// 语言选项
const languages = [
  { id: 'en', name: '英语', icon: '🇺🇸' },
  { id: 'zh', name: '中文', icon: '🇨🇳' },
  { id: 'ja', name: '日语', icon: '🇯🇵' },
  { id: 'ko', name: '韩语', icon: '🇰🇷' },
  { id: 'fr', name: '法语', icon: '🇫🇷' },
  { id: 'de', name: '德语', icon: '🇩🇪' },
  { id: 'es', name: '西班牙语', icon: '🇪🇸' },
  { id: 'it', name: '意大利语', icon: '🇮🇹' },
];

// 翻译历史记录
interface TranslationHistory {
  id: number;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
}

const TranslationPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('zh');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  
  const [activeDropdown, setActiveDropdown] = useState<'source' | 'target' | null>(null);

  // 模拟翻译功能
  const handleTranslate = () => {
    if (!sourceText.trim()) {
      toast.warning('请输入要翻译的文本');
      return;
    }
    
    setIsTranslating(true);
    
    setTimeout(() => {
      const mockTranslations: Record<string, string> = {
        'Hello, how are you?': '你好，你好吗？',
        'I am learning English.': '我正在学习英语。',
        'What is your name?': '你叫什么名字？',
        'Nice to meet you.': '很高兴认识你。',
        'Thank you very much.': '非常感谢。',
        'Good morning!': '早上好！',
        'Good night!': '晚安！',
        'How much is this?': '这个多少钱？',
        'Where is the restroom?': '洗手间在哪里？',
        'Can you help me?': '你能帮助我吗？',
      };
      
      // 生成一段较长的文本来测试滚动效果
      const longTextMock = "这是一个非常长的测试文本，用于演示当翻译结果超出显示区域时，界面应该如何正确地处理滚动条，而不是让文本溢出到屏幕外面。在实际开发中，CSS的 overflow 属性非常重要。This is a very long text to demonstrate how the UI handles scrolling when the translation result exceeds the display area, instead of overflowing off the screen. In actual development, the CSS overflow property is very important. " + sourceText;

      const result = mockTranslations[sourceText] || longTextMock;
      
      setTranslatedText(result);
      
      const newHistoryItem: TranslationHistory = {
        id: Date.now(),
        sourceText,
        targetText: result,
        sourceLang,
        targetLang,
        timestamp: new Date().toLocaleString()
      };
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 29)]);
      setIsTranslating(false);
    }, 800);
  };
  
  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };
  
  const handleCopyTranslation = () => {
    navigator.clipboard.writeText(translatedText)
      .then(() => toast.success('已复制到剪贴板'))
      .catch(err => toast.error('复制失败'));
  };
  
  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
  };
  
  const handleToggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.info('已取消收藏');
    } else {
      newFavorites.add(id);
      toast.success('已添加到收藏');
    }
    setFavorites(newFavorites);
  };
  
  const handleLoadFromHistory = (item: TranslationHistory) => {
    setSourceText(item.sourceText);
    setTranslatedText(item.targetText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setShowHistory(false);
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const getLanguageName = (langId: string) => {
    return languages.find(lang => lang.id === langId)?.name || langId;
  };
  
  const getLanguageIcon = (langId: string) => {
    return languages.find(lang => lang.id === langId)?.icon || '';
  };

  const CustomLanguageSelector = ({ 
    selectedId, 
    onSelect, 
    type 
  }: { 
    selectedId: string, 
    onSelect: (id: string) => void, 
    type: 'source' | 'target' 
  }) => {
    const selectedLang = languages.find(l => l.id === selectedId);
    const isOpen = activeDropdown === type;

    return (
      <div className="relative min-w-[140px]">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveDropdown(isOpen ? null : type)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
              : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200'
          } ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">{selectedLang?.icon}</span>
            <span className="font-medium text-sm">{selectedLang?.name}</span>
          </div>
          <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} opacity-60`}></i>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10 cursor-default" 
                onClick={() => setActiveDropdown(null)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute top-full left-0 mt-2 w-48 z-20 rounded-xl shadow-xl overflow-hidden border max-h-64 overflow-y-auto ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="p-1.5 space-y-0.5">
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        onSelect(lang.id);
                        setActiveDropdown(null);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedId === lang.id
                          ? theme === 'dark' 
                            ? 'bg-blue-600/20 text-blue-400' 
                            : 'bg-blue-50 text-blue-600'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl leading-none">{lang.icon}</span>
                      <span className="flex-grow text-left">{lang.name}</span>
                      {selectedId === lang.id && (
                        <i className="fa-solid fa-check text-xs"></i>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800/70 text-white' : 'bg-gray-200/70 text-gray-800'}`}
            aria-label="Back to home"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </motion.button>
          <h1 className="text-xl font-bold">翻译助手</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHistory(!showHistory)}
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800/70 text-white' : 'bg-gray-200/70 text-gray-800'}`}
          aria-label="Toggle history"
        >
          <i className="fa-solid fa-history"></i>
        </motion.button>
      </header>

      <main className="flex-grow p-6">
        {/* 历史记录面板 (保持不变) */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: showHistory ? 1 : 0,
            height: showHistory ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className={`mb-6 overflow-hidden rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        >
          {showHistory && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">翻译历史</h2>
                <button 
                  onClick={() => {
                    setHistory([]);
                    toast.success('历史记录已清空');
                  }}
                  className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  清空历史
                </button>
              </div>
              
              {history.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <i className="fa-solid fa-history text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-1">暂无历史记录</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    进行翻译后将显示历史记录
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {history.map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleLoadFromHistory(item)}
                      className={`p-3 rounded-lg cursor-pointer ${
                        theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{getLanguageIcon(item.sourceLang)} {getLanguageName(item.sourceLang)}</span>
                          <i className="fa-solid fa-arrow-right text-xs text-gray-500 dark:text-gray-400"></i>
                          <span className="text-sm font-medium">{getLanguageIcon(item.targetLang)} {getLanguageName(item.targetLang)}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(item.id);
                          }}
                          className={`p-1 rounded-full ${
                            favorites.has(item.id) 
                              ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' 
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <i className={`fa-solid ${favorites.has(item.id) ? 'fa-star' : 'fa-star'}`}></i>
                        </button>
                      </div>
                      <p className="text-sm font-medium mb-1 line-clamp-1">{item.sourceText}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.targetText}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{item.timestamp}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
        
        {/* 翻译主区域 */}
        <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden mb-6`}>
          {/* 语言选择器区域 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <CustomLanguageSelector 
                  selectedId={sourceLang} 
                  onSelect={setSourceLang} 
                  type="source" 
                />
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleSwapLanguages}
                  className={`p-2.5 rounded-full shadow-sm flex-shrink-0 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </motion.button>
                
                <CustomLanguageSelector 
                  selectedId={targetLang} 
                  onSelect={setTargetLang} 
                  type="target" 
                />
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClear}
                  className={`p-2 rounded-full text-sm font-medium flex items-center gap-1 ${
                    theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <i className="fa-solid fa-eraser"></i>
                  <span className="hidden sm:inline">清空</span>
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* 翻译输入区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
            {/* 源语言输入 */}
            <div className="p-4 relative group flex flex-col h-full">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={`输入${getLanguageName(sourceLang)}文本...`}
                className={`w-full p-3 rounded-lg border-none focus:outline-none focus:ring-0 resize-none bg-transparent flex-grow ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                }`}
                // 这里设置 minHeight，与右侧保持视觉一致
                style={{ height: '200px' }}
              />
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {sourceText.length} 字符
                </span>
                <button 
                  onClick={() => navigator.clipboard.readText().then(text => setSourceText(text))}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    theme === 'dark' ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <i className="fa-solid fa-paste"></i> 粘贴
                </button>
              </div>
            </div>
            
            {/* 
               === 修复部分 === 
               1. 父容器保持 flex-col
               2. 内容区域添加 overflow-y-auto 和固定高度 (h-[200px]) 
               3. 文本 p 标签添加 break-words w-full 防止横向溢出
            */}
            <div className="p-4 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col">
              <div 
                className="relative overflow-y-auto pr-2 no-scrollbar" 
                style={{ height: '200px' }} // 显式设置高度，产生内部滚动
              >
                {isTranslating ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-70">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <span className={`text-sm animate-pulse ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>正在翻译...</span>
                  </div>
                ) : translatedText ? (
                  // 添加 break-words 和 w-full 修复水平溢出
                  <p className={`whitespace-pre-wrap break-words w-full leading-relaxed ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                    {translatedText}
                  </p>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
                    <i className="fa-solid fa-language text-4xl mb-3 text-gray-400"></i>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      翻译结果将显示在这里
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {translatedText.length > 0 ? `${translatedText.length} 字符` : ''}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyTranslation}
                  disabled={!translatedText}
                  className={`text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                    translatedText
                      ? theme === 'dark' 
                        ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'opacity-0 cursor-default'
                  }`}
                >
                  <i className="fa-regular fa-copy"></i> 复制结果
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText.trim()}
              className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-medium text-lg shadow-lg shadow-blue-500/20 ${
                isTranslating || !sourceText.trim()
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              } transition-all`}
            >
              {isTranslating ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>翻译中...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  <span>立即翻译</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
        
        {/* 翻译技巧提示 (保持不变) */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
              <i className="fa-solid fa-lightbulb"></i>
            </div>
            翻译小贴士
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
              <span>保持句子简单明了，避免过于复杂的从句</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
              <span>专有名词或术语建议在翻译后进行人工核对</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
              <span>支持多语言互译，点击中间箭头快速交换语言</span>
            </div>
          </div>
        </div>
      </main>

      <footer className={`border-t ${theme === 'dark' ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'} py-6 px-6 text-center text-xs`}>
        <p>SpeakBuddy &copy; {new Date().getFullYear()} - 沉浸式英语学习平台</p>
      </footer>
    </div>
  );
};

export default TranslationPage;