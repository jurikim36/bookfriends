
import React, { useState } from 'react';
import { BookRecord, Session } from '../types';
import BookDetailModal from './BookDetailModal';

interface LibraryShelfProps {
  records: BookRecord[];
  onRefresh: () => void;
  session: Session;
}

const LibraryShelf: React.FC<LibraryShelfProps> = ({ records, onRefresh, session }) => {
  const [selectedBookTitle, setSelectedBookTitle] = useState<string | null>(null);

  const groupedRecords: Record<string, BookRecord[]> = records.reduce((acc, curr) => {
    if (!acc[curr.title]) acc[curr.title] = [];
    acc[curr.title].push(curr);
    return acc;
  }, {} as Record<string, BookRecord[]>);

  const sortedBookTitles = Object.keys(groupedRecords).sort((a, b) => {
    return groupedRecords[b][0].timestamp - groupedRecords[a][0].timestamp;
  });

  const rows: string[][] = [];
  for (let i = 0; i < sortedBookTitles.length; i += 3) {
    rows.push(sortedBookTitles.slice(i, i + 3));
  }

  return (
    <div className="max-w-xl mx-auto p-6 pb-24 animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-ewha">기록보기</h2>
        <p className="text-sm text-ewha/40 font-medium mt-1">우리들의 도서관 서가를 구경해 보세요.</p>
      </div>

      <div className="space-y-16">
        {rows.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="relative">
            <div className="grid grid-cols-3 gap-6 px-2 mb-2 relative z-10">
              {row.map((title) => {
                const bookRecords = groupedRecords[title];
                const displayRecord = bookRecords[0];
                return (
                  <div 
                    key={title} 
                    onClick={() => setSelectedBookTitle(title)}
                    className="relative group cursor-pointer transition-all hover:-translate-y-3"
                  >
                    <div className="aspect-[3/4] rounded-xl shadow-xl overflow-hidden border border-white/50 bg-gray-200 ring-1 ring-black/5">
                      <img src={displayRecord.coverImage} alt={title} className="w-full h-full object-cover" />
                    </div>
                    {bookRecords.length > 1 && (
                      <div className="absolute -top-3 -right-3 bg-ewha text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-2xl shadow-lg border-2 border-white">
                        {bookRecords.length}
                      </div>
                    )}
                    <div className="mt-3 text-[10px] font-black text-ewha/60 truncate text-center px-1">
                      {title}
                    </div>
                  </div>
                );
              })}
              {row.length < 3 && [...Array(3 - row.length)].map((_, i) => <div key={`empty-${i}`} className="aspect-[3/4]" />)}
            </div>
            
            <div className="h-6 bg-[#00462A] rounded-full shadow-2xl relative overflow-hidden mt-[-10px] z-0">
               <div className="absolute inset-0 bg-white/10" />
               <div className="absolute inset-0 bg-black/20" />
               <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
            </div>
            <div className="h-2 bg-[#00331f] rounded-b-full mx-3 opacity-30 mt-[-2px]" />
          </div>
        ))}

        {sortedBookTitles.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-ewha/5">
            <div className="w-16 h-16 bg-ewha-soft/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-ewha/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-ewha/30 font-bold">아직 기록된 책이 없어요.</p>
          </div>
        )}
      </div>

      {selectedBookTitle && (
        <BookDetailModal 
          records={groupedRecords[selectedBookTitle]} 
          onClose={() => setSelectedBookTitle(null)} 
          onDeleted={onRefresh}
          currentSession={session}
        />
      )}
    </div>
  );
};

export default LibraryShelf;
