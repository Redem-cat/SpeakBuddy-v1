import { createContext, useContext } from "react";

// 定义 Context 的数据类型
interface LearningContextType {
  scene: any;
  dialogues: any[];
  words: any[];
  isImmersiveMode: boolean;
  bilingualMode: boolean;
  setBilingualMode: (value: boolean) => void;
  handleAddMessage: (text: string) => void;
  toggleImmersiveMode: () => void;
  showWordPanel: boolean;
  setShowWordPanel: (value: boolean) => void;
  selectedRole: string;
  aiRole: string;
}

// 创建 Context，初始值为 undefined，以便强制检查 Provider 是否存在
const LearningContext = createContext<LearningContextType | undefined>(undefined);

// 导出 Provider
export const LearningContextProvider = LearningContext.Provider;

// 导出 Hook 
export const useLearningContext = () => {
  const context = useContext(LearningContext);
  
  // 安全检查：如果 context 为空，说明组件忘记包在 Provider 里了
  if (!context) {
    throw new Error("useLearningContext must be used within a LearningContextProvider");
  }
  
  return context;
};