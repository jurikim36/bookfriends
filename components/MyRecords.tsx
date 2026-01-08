
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
    <div className="max-w-xl mx-auto p-6 pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">내 기록</h2>
        <p className="text-sm text-gray-500 mt-1">내가 작성한 모든 독서 기록을 한눈에 보세요.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-100 text-white">
          <p className="text-[10px] font-bold uppercase opacity-80 mb-1">총 작성 기록</p>
          <p className="text-3xl font-black">{userRecords.length}권</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">참여 중인 모임</p>
          <p className="text-xl font-bold text-gray-800">{joinedSessions.length}개</p>
        </div>
      </div>

      {/* Groups List */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">내가 참여한 모임</h3>
          <button 
            onClick={onJoinNewGroup}
            className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            + 모임 참여하기
          </button>
        </div>
        <div className="space-y-3">
          {joinedSessions.map((s) => (
            <div 
              key={s.group.code}
              onClick={() => handleSwitch(s)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${s.group.code === currentSession.group.code ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-gray-100 hover:border-blue-200'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${s.group.code === currentSession.group.code ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {s.group.name.substring(0, 1)}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{s.group.name}</p>
                  <p className="text-[10px] text-gray-400">코드: #{s.group.code}</p>
                </div>
              </div>
              {s.group.code === currentSession.group.code && (
                <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Active</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Records List */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">내 독서 활동</h3>
        <div className="space-y-4">
          {userRecords.length > 0 ? (
            userRecords.sort((a,b) => b.timestamp - a.timestamp).map((record) => (
              <div 
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  <img src={record.coverImage} className="w-full h-full object-cover" alt={record.title} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-800 truncate text-sm">{record.title}</h4>
                    <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-1.5 rounded uppercase">
                      {joinedSessions.find(s => s.group.code === record.groupId)?.group.name || '알수없음'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-2">{record.recordDate} 기록됨</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-2.5 h-2.5 ${record.rating >= s ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">아직 작성한 기록이 없습니다.</p>
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
