
import React, { useState, useEffect } from 'react';
import CalendarView from './components/CalendarView';
import RecordForm from './components/RecordForm';
import LibraryShelf from './components/LibraryShelf';
import MyRecords from './components/MyRecords';
import Onboarding from './components/Onboarding';
import { getRecords, getSession, clearSession } from './services/storage';
import { BookRecord, Session } from './types';

type View = 'home' | 'record' | 'view' | 'profile';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [records, setRecords] = useState<BookRecord[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningNewGroup, setIsJoiningNewGroup] = useState(false);

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);
    if (currentSession) {
      setRecords(getRecords(currentSession.group.code));
    }
    setIsLoading(false);
  }, []);

  const refreshRecords = () => {
    const currentSession = getSession();
    setSession(currentSession);
    if (currentSession) {
      setRecords(getRecords(currentSession.group.code));
    }
  };

  const handleSaved = () => {
    refreshRecords();
    setActiveView('home');
  };

  const handleOnboardingComplete = () => {
    const newSession = getSession();
    setSession(newSession);
    setIsJoiningNewGroup(false);
    if (newSession) {
      setRecords(getRecords(newSession.group.code));
    }
    setActiveView('home');
  };

  if (isLoading) return null;

  if (!session || isJoiningNewGroup) {
    return <Onboarding onComplete={handleOnboardingComplete} isJoinOnly={isJoiningNewGroup} onCancel={() => setIsJoiningNewGroup(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 border-b border-ewha/5 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-black bg-gradient-to-r from-ewha to-ewha-light bg-clip-text text-transparent">북프렌즈</h1>
          <p className="text-[10px] text-ewha/50 font-bold uppercase tracking-widest">{session.group.name} · #{session.group.code}</p>
        </div>
        <div 
          onClick={() => setActiveView('profile')}
          className={`w-10 h-10 rounded-2xl bg-ewha-soft/30 border flex items-center justify-center cursor-pointer transition-all ${activeView === 'profile' ? 'border-ewha ring-4 ring-ewha/5' : 'border-gray-100 hover:bg-gray-100'}`}
        >
          {session.user.profileImage ? (
            <img src={session.user.profileImage} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <svg className="w-5 h-5 text-ewha/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        {activeView === 'home' && <CalendarView records={records} onRefresh={refreshRecords} session={session} />}
        {activeView === 'record' && (
          <RecordForm 
            onSaved={handleSaved} 
            defaultAuthor={session.user.name} 
            groupId={session.group.code} 
          />
        )}
        {activeView === 'view' && <LibraryShelf records={records} onRefresh={refreshRecords} session={session} />}
        {activeView === 'profile' && (
          <MyRecords 
            currentSession={session} 
            onSwitchGroup={refreshRecords} 
            onJoinNewGroup={() => setIsJoiningNewGroup(true)}
            onRefresh={refreshRecords}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-2 flex justify-around items-center pb-safe">
        <button 
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeView === 'home' ? 'text-ewha' : 'text-gray-400 hover:text-ewha/60'}`}
        >
          <svg className="w-6 h-6 mb-1" fill={activeView === 'home' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-wider">홈</span>
        </button>

        <button 
          onClick={() => setActiveView('record')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeView === 'record' ? 'text-ewha' : 'text-gray-400 hover:text-ewha/60'}`}
        >
          <div className={`p-1 rounded-lg ${activeView === 'record' ? 'bg-ewha/10' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">기록하기</span>
        </button>

        <button 
          onClick={() => setActiveView('view')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeView === 'view' ? 'text-ewha' : 'text-gray-400 hover:text-ewha/60'}`}
        >
          <svg className="w-6 h-6 mb-1" fill={activeView === 'view' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-wider">기록보기</span>
        </button>

        <button 
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeView === 'profile' ? 'text-ewha' : 'text-gray-400 hover:text-ewha/60'}`}
        >
          <svg className="w-6 h-6 mb-1" fill={activeView === 'profile' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-wider">내 기록</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
