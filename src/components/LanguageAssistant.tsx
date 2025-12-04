import { useState } from 'react';
import { useLearningContext } from '@/contexts/learningContext';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

const LanguageAssistant: React.FC = () => {
  const { bilingualMode, setBilingualMode } = useLearningContext();
  const { theme } = useTheme();
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  
  // 动态提示语
  const conversationPrompts = [
    'Could you tell me more about your hobbies?',
    'What do you think about this topic?',
    'Can you explain that in a different way?',
    'I\'m interested in learning more about this.',
    'How would you respond in this situation?'
  ];
  
  // 模拟翻译功能
  const handleTranslate = () => {
    if (!textToTranslate.trim()) {
      toast.warning('请输入要翻译的文本');
      return;
    }
    
    setIsTranslating(true);
    
    // 模拟翻译延迟
    setTimeout(() => {
      // 简单的模拟翻译结果
      const mockTranslations: Record<string, string> = {
        'Hello, how are you?': '你好，你好吗？',
        'I am learning English.': '我正在学习英语。',
        'What is your name?': '你叫什么名字？',
        'Nice to meet you.': '很高兴认识你。',
        'Thank you very much.': '非常感谢。'
      };
      
      // 如果有预设翻译则使用，否则使用通用翻译结果
      const result = mockTranslations[textToTranslate] || 
        `这是"${textToTranslate}"的翻译结果。在实际应用中，这里会显示真实的翻译。`;
      
      setTranslation(result);
      setIsTranslating(false);
    }, 800);
  };
  
  // 模拟发音练习
  const handlePronunciationPractice = () => {
    toast.info('发音练习功能已启动，请开始朗读...');
    // 实际应用中，这里会调用浏览器的语音识别API
  };
  
  // 模拟语法检查
  const handleGrammarCheck = () => {
    if (!textToTranslate.trim()) {
      toast.warning('请输入要检查的文本');
      return;
    }
    
    // 简单的模拟语法检查结果
    const mockGrammarIssues = ['建议在句首添加主语',
      '动词时态使用不一致',
      '考虑使用更简洁的表达方式',
      '拼写检查：建议将"teh"改为"the"',
      '没有发现明显的语法错误，很好！'
    ];
    
    const randomIssue = mockGrammarIssues[Math.floor(Math.random() * mockGrammarIssues.length)];
    toast.info(`语法检查结果：${randomIssue}`);
  };
  
  // 快速插入提示语
  const handleInsertPrompt = (prompt: string) => {
    setTextToTranslate(prompt);
    toast.success('提示语已插入');
  };
  
  return (
     <div className={`${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/80'} backdrop-blur-sm rounded-xl shadow-lg overflow-hidden`}>
      {/* 面板标题 */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'}`}>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <i className="fa-solid fa-magic text-purple-500"></i>
          语言助手
        </h2>
      </div>
      
      {/* 双语模式切换 */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-language text-blue-500"></i>
            <span>双语模式</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBilingualMode(!bilingualMode)}
            className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
              bilingualMode ? 'bg-blue-500 justify-end' : theme === 'dark' ? 'bg-gray-700 justify-start' : 'bg-gray-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white"></div>
          </motion.button>
        </div>
      </div>
      
      {/* 翻译功能 */}
      <div className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <i className="fa-solid fa-translate text-green-500"></i>
          翻译助手
        </h3>
        
        {/* 输入框 */}
        <div className="mb-3">
          <textarea
            value={textToTranslate}
            onChange={(e) => setTextToTranslate(e.target.value)}
            placeholder="输入要翻译的文本..."
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
              theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'
            }`}
          />
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-2 mb-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
              isTranslating
                ? 'bg-gray-500 text-white cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 transition-colors'
            }`}
          >
            {isTranslating ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>翻译中...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-language"></i>
                <span>翻译</span>
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGrammarCheck}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
              theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            <i className="fa-solid fa-pen-to-square text-blue-500"></i>
            <span>语法检查</span>
          </motion.button>
        </div>
        
        {/* 翻译结果 */}
        {translation && (
          <div className={`p-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">翻译结果</h4>
            <p>{translation}</p>
          </div>
        )}
        
        {/* 对话提示语 */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">对话提示</h4>
          <div className="grid grid-cols-2 gap-2">
            {conversationPrompts.slice(0, 4).map((prompt, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInsertPrompt(prompt)}
                className={`p-2 text-sm rounded-lg text-left ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 发音练习 */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePronunciationPractice}
          className="w-full py-3 rounded-lg flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <i className="fa-solid fa-microphone-lines"></i>
          <span>开始发音练习</span>
        </motion.button>
      </div>
    </div>
  );
};

export default LanguageAssistant;