
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

  // Calculate current month string for filtering statistics
  const currentMonthPrefix = `${year}-${(month + 1).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-xl mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold text-gray-800">
          {year}년 {month + 1}월
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-50">
          {dayNames.map((day, idx) => (
            <div key={day} className={`py-3 text-center text-xs font-bold ${idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="aspect-square bg-gray-50/30" />;
            
            const dateStr = getDayString(day);
            const holiday = KOREAN_HOLIDAYS.find(h => h.date === dateStr);
            const recordsOnDay = records.filter(r => r.recordDate === dateStr);
            const latestRecord = recordsOnDay[recordsOnDay.length - 1];
            
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div 
                key={dateStr} 
                onClick={() => recordsOnDay.length > 0 && setSelectedDayRecords(recordsOnDay)}
                className={`relative aspect-square border-r border-b border-gray-50 flex flex-col p-1 group overflow-hidden ${isToday ? 'bg-blue-50/30' : ''} ${recordsOnDay.length > 0 ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
              >
                <span className={`text-[10px] font-semibold mb-0.5 z-10 ${holiday || idx % 7 === 0 ? 'text-red-500' : idx % 7 === 6 ? 'text-blue-500' : 'text-gray-600'}`}>
                  {day}
                </span>
                
                {holiday && (
                  <span className="text-[8px] text-red-400 truncate leading-none z-10">{holiday.name}</span>
                )}

                {latestRecord && (
                  <div className="absolute inset-0 z-0 p-0.5 animate-in fade-in zoom-in duration-300">
                    <img 
                      src={latestRecord.coverImage} 
                      className="w-full h-full object-cover rounded-md shadow-sm" 
                      alt={latestRecord.title}
                    />
                    {recordsOnDay.length > 1 && (
                      <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded-full">
                        +{recordsOnDay.length - 1}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 px-4">
        <h3 className="text-sm font-bold text-gray-500 mb-3 flex items-center">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
          기록 통계
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">이달의 책</p>
            <p className="text-xl font-bold text-gray-800">{records.filter(r => r.recordDate.startsWith(currentMonthPrefix)).length}권</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">총 기록수</p>
            <p className="text-xl font-bold text-gray-800">{records.length}개</p>
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
