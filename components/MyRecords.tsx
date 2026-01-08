
import React, { useState, useEffect } from 'react';
import { BookRecord, Session } from '../types';
import { getAllUserRecords, getJoinedGroups, setSession } from '../services/storage';
import BookDetailModal from './BookDetailModal';

interface MyRecordsProps {
  currentSession: Session;
  onSwitchGroup: () => void;
  onJoinNewGroup: () => void;
  onRefresh: () => void;
}

const MyRecords: React.FC<MyRecordsProps> = ({ currentSession, onSwitchGroup, onJoinNewGroup, onRefresh }) => {
  const [userRecords, setUserRecords] = useState<BookRecord[]>([]);
  const [joinedSessions, setJoinedSessions] = useState<Session[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BookRecord | null>(null);

  useEffect(() => {
    setUserRecords(getAllUserRecords(currentSession.user.name));
    setJoinedSessions(getJoinedGroups());
  }, [currentSession]);

  const handleSwitch = (session: Session) => {
    setSession(session);
    onSwitchGroup();
  };

  return (
    <div className="max-w-xl mx-auto p-6 pb-24 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-ewha">내 기록</h2>
        <p className="text-sm text-ewha/50 font-medium mt-1">내가 작성한 모든 독서 기록을 관리합니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-gradient-to-br from-ewha to-ewha-light p-6 rounded-[2rem] shadow-xl shadow-ewha/10 text-white">
          <p className="text-[10px] font-black uppercase opacity-70 mb-1 tracking-widest">총 작성 기록</p>
          <p className="text-4xl font-black">{userRecords.length}<span className="text-sm ml-1 font-bold">권</span></p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-ewha/5 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase text-ewha/30 mb-1 tracking-widest">참여 모임</p>
          <p className="text-2xl font-black text-ewha">{joinedSessions.length}<span className="text-sm ml-1 font-bold">개</span></p>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-[11px] font-black text-ewha/40 uppercase tracking-widest">내가 참여한 모임</h3>
          <button 
            onClick={onJoinNewGroup}
            className="text-[11px] font-black text-white bg-ewha-light px-4 py-1.5 rounded-full hover:bg-ewha transition-colors shadow-sm active:scale-95"
          >
            + 다른 모임 참여하기
          </button>
        </div>
        <div className="space-y-3">
          {joinedSessions.map((s) => (
            <div 
              key={s.group.code}
              onClick={() => handleSwitch(s)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${s.group.code === currentSession.group.code ? 'bg-ewha-soft/50 border-ewha/20 ring-4 ring-ewha/5' : 'bg-white border-gray-100 hover:border-ewha/20'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${s.group.code === currentSession.group.code ? 'bg-ewha text-white' : 'bg-gray-100 text-gray-300'}`}>
                  {s.group.name.substring(0, 1)}
                </div>
                <div>
                  <p className="font-black text-gray-800">{s.group.name}</p>
                  <p className="text-[10px] text-ewha/40 font-bold uppercase tracking-widest">Code: {s.group.code}</p>
                </div>
              </div>
              {s.group.code === currentSession.group.code && (
                <span className="bg-ewha text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-black text-ewha/40 uppercase tracking-widest mb-4 px-1">내 독서 타임라인</h3>
        <div className="space-y-4">
          {userRecords.length > 0 ? (
            userRecords.sort((a,b) => b.timestamp - a.timestamp).map((record) => (
              <div 
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="bg-white p-4 rounded-3xl border border-ewha/5 flex gap-5 cursor-pointer hover:shadow-lg hover:border-ewha/10 transition-all active:scale-[0.99]"
              >
                <div className="w-20 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-50">
                  <img src={record.coverImage} className="w-full h-full object-cover" alt={record.title} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-gray-800 truncate text-base">{record.title}</h4>
                    <span className="text-[9px] text-ewha font-black bg-ewha/5 px-2 py-0.5 rounded-full border border-ewha/10">
                      {joinedSessions.find(s => s.group.code === record.groupId)?.group.name || '알수없음'}
                    </span>
                  </div>
                  <p className="text-[10px] text-ewha/30 font-bold mb-3">{record.recordDate} 기록</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-3 h-3 ${record.rating >= s ? 'text-yellow-400' : 'text-gray-100'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-ewha/5">
              <div className="w-16 h-16 bg-ewha-soft/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ewha/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-sm text-ewha/30 font-bold">아직 작성한 기록이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {selectedRecord && (
        <BookDetailModal 
          records={[selectedRecord]} 
          onClose={() => setSelectedRecord(null)} 
          onDeleted={onRefresh}
          currentSession={currentSession}
        />
      )}
    </div>
  );
};

export default MyRecords;
