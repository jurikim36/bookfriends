
import React, { useState } from 'react';
import { BookRecord, Session } from '../types';
import { KOREAN_HOLIDAYS } from '../constants';
import BookDetailModal from './BookDetailModal';

interface CalendarViewProps {
  records: BookRecord[];
  onRefresh: () => void;
  session: Session;
}

const CalendarView: React.FC<CalendarViewProps> = ({ records, onRefresh, session }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayRecords, setSelectedDayRecords] = useState<BookRecord[] | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getDayString = (day: number) => {
    const d = day < 10 ? `0${day}` : `${day}`;
    const m = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    return `${year}-${m}-${d}`;
  };

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const currentMonthPrefix = `${year}-${(month + 1).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-xl mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-6 px-2 pt-2">
        <h2 className="text-2xl font-black text-ewha tracking-tighter">
          {year}년 {month + 1}월
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2.5 bg-ewha-soft/50 hover:bg-ewha/10 text-ewha rounded-2xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={nextMonth} className="p-2.5 bg-ewha-soft/50 hover:bg-ewha/10 text-ewha rounded-2xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-ewha/5 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-50 bg-gray-50/30">
          {dayNames.map((day, idx) => (
            <div key={day} className={`py-4 text-center text-[11px] font-black uppercase tracking-widest ${idx === 0 ? 'text-red-400' : idx === 6 ? 'text-ewha/60' : 'text-ewha/30'}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="aspect-square bg-gray-50/10" />;
            
            const dateStr = getDayString(day);
            const holiday = KOREAN_HOLIDAYS.find(h => h.date === dateStr);
            const recordsOnDay = records.filter(r => r.recordDate === dateStr);
            const latestRecord = recordsOnDay[recordsOnDay.length - 1];
            
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div 
                key={dateStr} 
                onClick={() => recordsOnDay.length > 0 && setSelectedDayRecords(recordsOnDay)}
                className={`relative aspect-square border-r border-b border-gray-50 flex flex-col p-1.5 group overflow-hidden ${isToday ? 'bg-ewha/5' : ''} ${recordsOnDay.length > 0 ? 'cursor-pointer hover:bg-ewha/5 transition-all' : ''}`}
              >
                <span className={`text-[10px] font-black mb-0.5 z-10 ${holiday || idx % 7 === 0 ? 'text-red-500' : idx % 7 === 6 ? 'text-ewha' : 'text-gray-400'}`}>
                  {day}
                </span>
                
                {holiday && (
                  <span className="text-[7px] text-red-400 font-bold truncate leading-none z-10">{holiday.name}</span>
                )}

                {latestRecord && (
                  <div className="absolute inset-0 z-0 p-1 animate-in fade-in zoom-in duration-300">
                    <img 
                      src={latestRecord.coverImage} 
                      className="w-full h-full object-cover rounded-xl shadow-md border border-white/50" 
                      alt={latestRecord.title}
                    />
                    {recordsOnDay.length > 1 && (
                      <div className="absolute top-1.5 right-1.5 bg-ewha/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded-lg backdrop-blur-sm">
                        +{recordsOnDay.length - 1}
                      </div>
                    )}
                  </div>
                )}
                {isToday && !latestRecord && (
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-ewha rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 px-2">
        <h3 className="text-xs font-black text-ewha/30 mb-4 flex items-center uppercase tracking-widest px-2">
          <span className="w-1.5 h-1.5 bg-ewha rounded-full mr-2"></span>
          Monthly Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-ewha/5 group hover:border-ewha/20 transition-all">
            <p className="text-[10px] text-ewha/30 font-black uppercase tracking-widest mb-1">이달의 책</p>
            <p className="text-2xl font-black text-ewha">{records.filter(r => r.recordDate.startsWith(currentMonthPrefix)).length}<span className="text-xs ml-1 opacity-40">권</span></p>
          </div>
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-ewha/5 group hover:border-ewha/20 transition-all">
            <p className="text-[10px] text-ewha/30 font-black uppercase tracking-widest mb-1">총 기록수</p>
            <p className="text-2xl font-black text-ewha">{records.length}<span className="text-xs ml-1 opacity-40">개</span></p>
          </div>
        </div>
      </div>

      {selectedDayRecords && (
        <BookDetailModal 
          records={selectedDayRecords} 
          onClose={() => setSelectedDayRecords(null)} 
          onDeleted={onRefresh}
          currentSession={session}
        />
      )}
    </div>
  );
};

export default CalendarView;
