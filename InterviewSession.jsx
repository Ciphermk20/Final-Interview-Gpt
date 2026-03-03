import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Loader2, CheckCircle2, AlertCircle, Settings2, Zap, Trophy, Target, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraView from '../components/CameraView';

const InterviewSession = () => {
  // --- CONFIG ---
  const techRoles = ["Full Stack Developer", "Frontend Engineer", "Backend Developer", "Data Scientist", "DevOps Engineer", "AI/ML Engineer"];
  const techStack = ["JavaScript", "TypeScript", "Python", "Java", "C++", "React.js", "Node.js"];

  const [config, setConfig] = useState({ role: techRoles[0], language: techStack[0], type: 'Technical', experience: 'Fresher' });
  const [isStarted, setIsStarted] = useState(false);
  
  // --- ENGINE ---
  const cameraRef = useRef();
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(''); // THIS IS THE SOURCE OF TRUTH
  
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState(''); // FOR UI ONLY
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState("");

  // --- INITIALIZE SPEECH ENGINE ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech API not found. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          transcriptRef.current += transcriptChunk + ' ';
        } else {
          interimTranscript += transcriptChunk;
        }
      }
      // Update UI so user sees they are being heard
      setLiveTranscript(transcriptRef.current + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      if (event.error === 'no-speech') setError("No speech detected. Check your mic.");
      if (event.error === 'not-allowed') setError("Microphone permission denied.");
    };

    recognitionRef.current = recognition;
  }, []);

  const handleStartSession = () => {
    setCurrentQuestion(`Explain your approach to building a scalable application using ${config.language} as a ${config.role}.`);
    setIsStarted(true);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // --- STOPPING ---
      setIsRecording(false);
      recognitionRef.current?.stop();
      setIsProcessing(true);
      setError('');

      // Wait 1 second to ensure the final "blob" of text is processed
      setTimeout(async () => {
        const finalText = transcriptRef.current.trim();
        console.log("Final Transcript captured:", finalText);

        if (finalText.length < 10) {
          setError("I didn't hear you clearly. Please try again and speak louder.");
          setIsProcessing(false);
          return;
        }

        try {
          // 1. Get Video File
          const uploadResult = await cameraRef.current?.stopRecording();
          
          // 2. Send to AI
          const response = await fetch('http://localhost:5000/api/interview/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...config,
              question: currentQuestion,
              transcript: finalText,
              videoFilename: uploadResult?.filename || "no-video.webm"
            }),
          });

          const data = await response.json();
          if (response.ok) setAiFeedback(data);
          else setError("Evaluation failed.");
        } catch (err) {
          setError("Server error. Is the backend running?");
        } finally {
          setIsProcessing(false);
        }
      }, 1200);

    } else {
      // --- STARTING ---
      transcriptRef.current = '';
      setLiveTranscript('');
      setAiFeedback(null);
      setError('');
      
      try {
        cameraRef.current?.startRecording();
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        setError("Could not start microphone.");
      }
    }
  };

  // --- UI RENDER (SETUP) ---
  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto p-10">
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/10">
          <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
            <Settings2 className="text-blue-600" /> Interview Setup
          </h1>
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase text-gray-400">Target Role</label>
              <select value={config.role} onChange={e => setConfig({...config, role: e.target.value})} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none outline-none ring-2 ring-transparent focus:ring-blue-500 font-bold">
                {techRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase text-gray-400">Language</label>
              <select value={config.language} onChange={e => setConfig({...config, language: e.target.value})} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none outline-none ring-2 ring-transparent focus:ring-blue-500 font-bold">
                {techStack.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleStartSession} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
            Enter Interview Room
          </button>
        </div>
      </div>
    );
  }

  // --- UI RENDER (INTERVIEW) ---
  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-4">
      <div className="flex-1 bg-black rounded-[3rem] overflow-hidden relative shadow-2xl min-h-[500px]">
        <CameraView ref={cameraRef} />
        {isRecording && <div className="absolute top-8 left-8 bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-black animate-pulse z-50">LIVE RECORDING</div>}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
          {error && <div className="bg-red-500 text-white text-xs px-4 py-2 rounded-xl flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}
          <button onClick={toggleRecording} disabled={isProcessing} className={`px-12 py-5 rounded-full font-black text-white shadow-2xl transition-all ${isRecording ? 'bg-red-500 scale-105' : 'bg-blue-600 hover:scale-105'}`}>
            {isRecording ? 'FINISH ANSWER' : 'START ANSWERING'}
          </button>
        </div>
      </div>

      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-blue-500/10">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">Question</span>
          <p className="text-xl font-bold leading-tight italic">"{currentQuestion}"</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] flex-1 shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Live Transcription</span>
          <div className="flex-1 overflow-y-auto pr-2">
            <p className="text-gray-500 font-medium leading-relaxed italic">
              {liveTranscript || "Speak into your microphone to begin..."}
            </p>
          </div>
        </div>

        {isProcessing && <div className="p-6 bg-blue-600 text-white rounded-[2rem] font-black text-center animate-pulse">AI IS ANALYZING...</div>}

        <AnimatePresence>
          {aiFeedback && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[3rem] p-10 text-center shadow-2xl border border-white/10">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy size={48} className="text-green-500" />
                </div>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{aiFeedback.score}%</h2>
                <p className="text-gray-500 font-bold mb-8 uppercase tracking-widest">AI Performance Score</p>
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl mb-8 text-left">
                  <p className="text-sm font-medium leading-relaxed italic">"{aiFeedback.summary}"</p>
                </div>
                <button onClick={() => window.location.href='/dashboard'} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30">View Detailed Report</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewSession;