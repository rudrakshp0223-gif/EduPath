import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FormSteps } from './components/FormSteps';
import { Results } from './components/Results';
import { analyzeStudentData } from './lib/gemini';
import { FormData, RecommendData } from './types';
import { ArrowRight, Sparkles, LogIn, LogOut } from 'lucide-react';
import { auth, db } from './lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type AppState = 'landing' | 'form' | 'loading' | 'results' | 'inappropriate' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [resultsData, setResultsData] = useState<RecommendData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // fetch existing info
        const docRef = doc(db, 'users', u.uid);
        const d = await getDoc(docRef);
        if (d.exists()) {
          setDbData(d.data());
          if (appState === 'landing') setAppState('dashboard');
        } else {
          await setDoc(docRef, { email: u.email, createdAt: new Date().toISOString() });
          if (appState === 'landing') setAppState('dashboard');
        }
      } else {
        if (appState === 'dashboard') setAppState('landing');
      }
    });
    return unsub;
  }, [appState]);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(e => console.error(e));
  };

  const handleLogout = () => signOut(auth);

  const handleStart = () => setAppState('form');

  const handleFormComplete = async (formData: FormData, fileContent?: string, fileMimeType?: string) => {
    setAppState('loading');
    try {
      const data = await analyzeStudentData(formData, fileContent, fileMimeType);
      
      // If we flagged inappropriate content:
      if (data.targetCareer?.title === 'Inappropriate Input') {
        setAppState('inappropriate');
        return;
      }
      
      setResultsData(data);
      if (user) {
        await setDoc(doc(db, 'analyses', user.uid), { // using user.uid for simplicity as analysisId for now
          userId: user.uid,
          status: fileContent ? 'completed' : 'pending_marksheet',
          targetCareer: data.targetCareer,
          programs: data.programs || [],
          institutes: data.institutes || [],
          roadmap: data.roadmap || [],
          marketInsights: data.marketInsights || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      setAppState('results');
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(`Analysis failed: ${error instanceof Error ? error.message : "Network error"}\n\nNote: If deploying to Vercel, check that your branch is NOT protected by "Vercel Authentication" or try deploying to "main". Also ensure your file upload is under 4MB.`);
      setAppState('form');
    }
  };

  const handleReset = () => {
    setResultsData(null);
    setAppState(user ? 'dashboard' : 'landing');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] selection:bg-black selection:text-white font-sans flex flex-col">
      <nav className="absolute top-0 right-0 p-6 flex gap-4 w-full justify-end z-10">
         {user ? (
           <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium hover:text-[#86868B] transition-colors"><LogOut className="w-4 h-4" /> Logout</button>
         ) : (
           <button onClick={handleLogin} className="flex items-center gap-2 text-sm font-medium hover:text-[#86868B] transition-colors"><LogIn className="w-4 h-4" /> Log In to Save</button>
         )}
      </nav>

      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 p-4 bg-white rounded-2xl shadow-sm border border-[#D2D2D7]/30 inline-block"
            >
              <Sparkles className="w-8 h-8 text-[#1D1D1F]" />
            </motion.div>
            <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter text-[#1D1D1F] mb-6 leading-none">
              EduPath
            </h1>
            <p className="text-xl sm:text-2xl text-[#86868B] mb-12 max-w-2xl font-light">
              An effortless AI career recommendation engine. Answer 4 questions, upload your marksheet, and discover your path.
            </p>
            <button 
              onClick={handleStart}
              className="group flex items-center gap-3 bg-[#1D1D1F] text-white px-8 py-5 rounded-full text-xl font-medium transition-all hover:bg-black hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {appState === 'dashboard' && user && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col items-center pt-32 p-6 max-w-4xl mx-auto w-full">
            <h1 className="text-4xl font-bold mb-6">Welcome Back, {user.displayName || 'Explorer'}</h1>
            <p className="text-[#86868B] mb-12 text-center max-w-md">Access your saved career path or start a new analysis.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
               <div className="bg-white p-8 rounded-3xl border border-[#D2D2D7]/30 shadow-sm flex flex-col items-start">
                  <h2 className="text-2xl font-semibold mb-2">New Analysis</h2>
                  <p className="text-[#86868B] mb-8">Take the quiz and discover your ideal career path based on your latest interests.</p>
                  <button onClick={handleStart} className="bg-[#1D1D1F] text-white px-6 py-3 rounded-full mt-auto font-medium transition hover:scale-105">Start Quiz</button>
               </div>
               <div className="bg-white p-8 rounded-3xl border border-[#D2D2D7]/30 shadow-sm flex flex-col items-start bg-blue-50/50">
                  <h2 className="text-2xl font-semibold mb-2">Upload Marksheet</h2>
                  <p className="text-[#86868B] mb-8">Skipped uploading your marksheet earlier? Add it now to refine your previous results and build a better model.</p>
                  <button onClick={() => setAppState('form')} className="bg-white border border-[#D2D2D7] text-[#1D1D1F] px-6 py-3 rounded-full mt-auto font-medium transition hover:shadow-md">Upload Later</button>
               </div>
            </div>
          </motion.div>
        )}

        {appState === 'inappropriate' && (
          <motion.div key="inappropriate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 text-2xl">⚠️</div>
             <h2 className="text-3xl font-bold mb-4">Inappropriate Input Detected</h2>
             <p className="text-[#86868B] mb-8">The responses or file provided contained content that goes against our safety guidelines. Please ensure your input is appropriate and relevant for career counseling.</p>
             <button onClick={() => setAppState('form')} className="bg-[#1D1D1F] text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-black hover:scale-105">Try Again Seriously</button>
          </motion.div>
        )}

        {appState === 'form' && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 w-full">
            <FormSteps onComplete={handleFormComplete} />
          </motion.div>
        )}

        {appState === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center w-full"
          >
            <div className="w-16 h-16 border-4 border-[#D2D2D7]/50 border-t-[#1D1D1F] rounded-full animate-spin mb-8" />
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-[#1D1D1F]">Analyzing Your Profile</h2>
            <p className="text-[#86868B] text-lg max-w-md">
              Our AI is synthesizing your answers and marksheet data against thousands of career trajectories...
            </p>
          </motion.div>
        )}

        {appState === 'results' && resultsData && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 w-full flex flex-col">
            <Results data={resultsData} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
