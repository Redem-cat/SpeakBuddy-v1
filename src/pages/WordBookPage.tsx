import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// 模拟单词数据
const mockWords = [
  { 
    id: 1, 
    word: 'genre', 
    pronunciation: '/ˈʒɑːnrə/', 
    meaning: '类型', 
    example: 'What genre of movie do you like best?', 
    progress: 80,
    scene: 'movie',
    lastReviewed: '2025-11-19'
  },
  { 
    id: 2, 
    word: 'visual effects', 
    pronunciation: '/ˈvɪʒuəl ɪˈfekts/', 
    meaning: '视觉效果', 
    example: 'The visual effects in that movie were amazing.', 
    progress: 60,
    scene: 'movie',
    lastReviewed: '2025-11-18'
  },
  { 
    id: 3, 
    word: 'director', 
    pronunciation: '/dəˈrektər/', 
    meaning: '导演', 
    example: 'Who is the director of this film?', 
    progress: 90,
    scene: 'movie',
    lastReviewed: '2025-11-20'
  },
  { 
    id: 4, 
    word: 'attraction', 
    pronunciation: '/əˈtrækʃn/', 
    meaning: '景点', 
    example: 'The Eiffel Tower is a famous attraction in Paris.', 
    progress: 50,
    scene: 'travel',
    lastReviewed: '2025-11-17'
  },
  { 
    id: 5, 
    word: 'accommodation', 
    pronunciation: '/əˌkɑːməˈdeɪʃn/', 
    meaning: '住宿', 
    example: 'Have you booked your accommodation yet?', 
    progress: 40,
    scene: 'travel',
    lastReviewed: '2025-11-16'
  },
  { 
    id: 6, 
    word: 'itinerary', 
    pronunciation: '/aɪˈtɪnəreri/', 
    meaning: '行程', 
    example: 'Let me check our itinerary for tomorrow.', 
    progress: 70,
    scene: 'travel',
    lastReviewed: '2025-11-19'
  },
];

 // 单词本类型
const wordBookTypes = [
  { id: 'custom', name: '我的单词本', icon: 'fa-book' },
  { id: 'cet4', name: '四级词汇', icon: 'fa-graduation-cap' },
  { id: 'cet6', name: '六级词汇', icon: 'fa-graduation-cap' },
  { id: 'tem8', name: '专八词汇', icon: 'fa-graduation-cap' },
  { id: 'toefl', name: '托福词汇', icon: 'fa-globe' },
  { id: 'ielts', name: '雅思词汇', icon: 'fa-globe' },
];

// 学习状态分类
const statusFilters = [
  { id: 'all', name: '全部状态' },
  { id: 'mastered', name: '已掌握' },
  { id: 'learning', name: '学习中' },
  { id: 'new', name: '新单词' },
];

 const WordBookPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [words, setWords] = useState(mockWords);
  const [selectedWordBookType, setSelectedWordBookType] = useState('custom');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [showWordDetail, setShowWordDetail] = useState(false);
  const [customWordBooks, setCustomWordBooks] = useState([
    { id: '1', name: '我的收藏', count: 12, created: '2025-11-15' },
    { id: '2', name: '旅行必备', count: 8, created: '2025-11-10' },
    { id: '3', name: '商务英语', count: 15, created: '2025-11-05' },
  ]);
  const [showCustomWordBooks, setShowCustomWordBooks] = useState(false);

   // 过滤单词
  const filteredWords = words.filter(word => {
    // 如果选择了自定义单词本以外的类型，我们模拟显示不同的单词
    if (selectedWordBookType !== 'custom') {
      // 这里应该根据所选单词本类型加载不同的单词
      // 为了演示，我们只返回全部单词
    }
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'mastered' && word.progress >= 80) ||
      (statusFilter === 'learning' && word.progress >= 40 && word.progress < 80) ||
      (statusFilter === 'new' && word.progress < 40);
    const matchesSearch = searchTerm === '' || 
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // 计算统计数据
  const totalWords = words.length;
  const masteredWords = words.filter(w => w.progress >= 80).length;
  const learningWords = words.filter(w => w.progress >= 40 && w.progress < 80).length;
  const newWords = words.filter(w => w.progress < 40).length;

  // 处理单词点击
  const handleWordClick = (word: any) => {
    setSelectedWord(word);
    setShowWordDetail(true);
  };

  // 处理更新单词进度
  const handleUpdateProgress = (newProgress: number) => {
    if (!selectedWord) return;
    
    const updatedWords = words.map(word => 
      word.id === selectedWord.id 
        ? { ...word, progress: newProgress, lastReviewed: new Date().toISOString().split('T')[0] }
        : word
    );
    
    setWords(updatedWords);
    setSelectedWord({ ...selectedWord, progress: newProgress });
    toast.success(`已更新 ${selectedWord.word} 的掌握程度`);
  };

  // 处理单词发音
  const handlePronunciation = () => {
    if (!selectedWord) return;
    
    // 模拟发音功能
    toast.success(`正在播放 ${selectedWord.word} 的发音`);
    // 实际应用中这里会使用浏览器的文本转语音API
  };

  // 处理返回
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 顶部导航栏 */}
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
          <h1 className="text-xl font-bold">单词本</h1>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-grow p-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <i className="fa-solid fa-book"></i>
              <span className="text-sm font-medium">总词汇量</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{totalWords}</span>
              <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>个单词</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center gap-2 text-green-500 mb-1">
              <i className="fa-solid fa-check-circle"></i>
              <span className="text-sm font-medium">已掌握</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{masteredWords}</span>
              <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>个单词</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center gap-2 text-amber-500 mb-1">
              <i className="fa-solid fa-sparkles"></i>
              <span className="text-sm font-medium">学习中</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{learningWords}</span>
              <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>个单词</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center gap-2 text-purple-500 mb-1">
              <i className="fa-solid fa-star"></i>
              <span className="text-sm font-medium">新单词</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{newWords}</span>
              <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>个单词</span>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6">
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
             {/* 搜索框 */}
            <div className="mb-4">
              <div className={`flex items-center p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                <i className="fa-solid fa-search ml-1 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="搜索单词或释义..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full ml-2 outline-none ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <i className="fa-solid fa-times-circle"></i>
                  </button>
                )}
              </div>
            </div>
            
            {/* 单词本类型选择 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">选择单词本</h3>
              <div className="flex flex-wrap gap-2">
                {wordBookTypes.map((bookType) => (
                  <motion.button
                    key={bookType.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedWordBookType(bookType.id);
                      if (bookType.id === 'custom') {
                        setShowCustomWordBooks(true);
                      } else {
                        setShowCustomWordBooks(false);
                        // 在实际应用中，这里应该根据所选单词本类型加载对应的单词
                        toast.info(`已切换到${bookType.name}`);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                      selectedWordBookType === bookType.id
                        ? 'bg-blue-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    <i className={`fa-solid ${bookType.icon}`}></i>
                    {bookType.name}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* 自定义单词本列表 */}
            {selectedWordBookType === 'custom' && showCustomWordBooks && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">我的单词本</h3>
                <div className="grid grid-cols-2 gap-2">
                  {customWordBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-2 rounded-lg flex justify-between items-center ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm">{book.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{book.created}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                      }`}>
                        {book.count}个单词
                      </span>
                    </motion.div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-2 rounded-lg flex items-center justify-center gap-2 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                    onClick={() => toast.info('创建新单词本功能即将上线')}
                  >
                    <i className="fa-solid fa-plus text-sm"></i>
                    <span className="text-sm">新建单词本</span>
                  </motion.button>
                </div>
              </div>
            )}
            
            {/* 学习状态筛选 */}
            <div>
              <h3 className="text-sm font-medium mb-2">按学习状态筛选</h3>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <motion.button
                    key={filter.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      statusFilter === filter.id
                        ? 'bg-blue-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    {filter.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 单词列表 */}
        <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden`}>
          <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
            <h2 className="font-semibold">单词列表 ({filteredWords.length})</h2>
            <button 
              className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
              onClick={() => {
                // 模拟导出功能
                toast.info('单词本导出功能即将上线');
              }}
            >
              <i className="fa-solid fa-download mr-1"></i> 导出单词
            </button>
          </div>
          
          {filteredWords.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <i className="fa-solid fa-book-open text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium mb-1">没有找到匹配的单词</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                请尝试更改筛选条件或搜索关键词
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredWords.map((word) => (
                <motion.div
                  key={word.id}
                  whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}
                  onClick={() => handleWordClick(word)}
                  className="p-4 cursor-pointer flex justify-between items-center"
                >
                  <div>
                   <div className="flex items-center gap-2">
                    <h3 className="font-medium">{word.word}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">{word.pronunciation}</span>
                  </div>
                  <p className="text-sm mt-1">{word.meaning}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedWordBookType === 'custom'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : selectedWordBookType === 'cet4'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : selectedWordBookType === 'cet6'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : selectedWordBookType === 'tem8'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : selectedWordBookType === 'toefl'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {wordBookTypes.find(s => s.id === selectedWordBookType)?.name || '我的单词本'}
                    </span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      上次复习: {word.lastReviewed}
                    </span>
                  </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      {word.progress >= 80 ? (
                        <i className="fa-solid fa-check-circle text-green-500"></i>
                      ) : word.progress >= 40 ? (
                        <i className="fa-solid fa-sparkles text-amber-500"></i>
                      ) : (
                        <i className="fa-solid fa-star text-purple-500"></i>
                      )}
                      <span className="text-sm">{word.progress}%</span>
                    </div>
                    
                    <div className={`w-24 h-1.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${word.progress}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${
                          word.progress >= 80 ? 'bg-green-500' : 
                          word.progress >= 40 ? 'bg-amber-500' : 
                          'bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 单词详情弹窗 */}
      {showWordDetail && selectedWord && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowWordDetail(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`w-full max-w-md rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedWord.word}</h2>
                <p className="text-gray-500 dark:text-gray-400 italic">/{selectedWord.pronunciation}/</p>
              </div>
              <button 
                onClick={() => setShowWordDetail(false)}
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">中文释义</h3>
              <p className="text-lg">{selectedWord.meaning}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">例句</h3>
              <p className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {selectedWord.example}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">掌握程度</h3>
              <div className="flex items-center gap-2 mb-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateProgress(20)}
                  className={`p-2 rounded-full ${selectedWord.progress === 20 ? 'bg-purple-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                >
                  <i className="fa-solid fa-star"></i>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateProgress(40)}
                  className={`p-2 rounded-full ${selectedWord.progress === 40 ? 'bg-purple-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                >
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateProgress(60)}
                  className={`p-2 rounded-full ${selectedWord.progress === 60 ? 'bg-amber-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                >
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateProgress(80)}
                  className={`p-2 rounded-full ${selectedWord.progress === 80 ? 'bg-amber-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
               >
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUpdateProgress(100)}
                className={`p-2 rounded-full ${selectedWord.progress === 100 ? 'bg-green-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </motion.button>
            </div>
            
            {/* 添加到自定义单词本 */}
            {selectedWordBookType === 'custom' && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">添加到单词本</h3>
                <div className="flex flex-wrap gap-2">
                  {customWordBooks.map(book => (
                    <motion.button
                      key={book.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`px-3 py-1 rounded-full text-xs ${
                        theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                      } transition-colors`}
                      onClick={() => toast.success(`已添加到${book.name}`)}
                    >
                      {book.name}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-3 py-1 rounded-full text-xs ${
                      theme === 'dark' ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                    } transition-colors`}
                    onClick={() => toast.info('创建新单词本并添加功能即将上线')}
                  >
                    <i className="fa-solid fa-plus mr-1"></i>新建单词本
                  </motion.button>
                </div>
              </div>
            )}
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePronunciation}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                } transition-colors`}
              >
                <i className="fa-solid fa-volume-high text-blue-500"></i>
                <span>发音练习</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  // 模拟加入复习计划
                  toast.success(`${selectedWord.word} 已添加到每日复习计划`);
                }}
                className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <i className="fa-solid fa-calendar-plus"></i>
                <span>添加复习</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 页脚 */}
       <footer className={`border-t ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'} py-4 px-6 text-center text-sm`}>
        <p>SpeakBuddy - 沉浸式英语学习平台</p>
      </footer>
    </div>
  );
};

export default WordBookPage;