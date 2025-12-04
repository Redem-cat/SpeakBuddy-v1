import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LearningScene from "@/pages/LearningScene";
import WordBookPage from "@/pages/WordBookPage";
import AchievementsPage from "@/pages/AchievementsPage";
import PronunciationPage from "@/pages/PronunciationPage";
import TranslationPage from "@/pages/TranslationPage";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // 默认登录状态以展示功能

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scene/:sceneId" element={<LearningScene />} />
        <Route path="/wordbook" element={<WordBookPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/pronunciation" element={<PronunciationPage />} />
         <Route path="/translation" element={<TranslationPage />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </AuthContext.Provider>
  );
}
