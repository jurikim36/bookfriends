
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

  // Group records by title
  const groupedRecords: Record<string, BookRecord[]> = records.reduce((acc, curr) => {
    if (!acc[curr.title]) acc[curr.title] = [];
    acc[curr.title].push(curr);
    return acc;
  }, {} as Record<string, BookRecord[]>);

  // Sort groups by the first record's timestamp (desc)
  const sortedBookTitles = Object.keys(groupedRecords).sort((a, b) => {
    return groupedRecords[b][0].timestamp - groupedRecords[a][0].timestamp;
  });

  // Split into rows of 3 for shelf effect
  const rows: string[][] = [];
  for (let i = 0; i < sortedBookTitles.length; i += 3) {
    rows.push(sortedBookTitles.slice(i, i + 3));
  }

  return (
    <div className="max-w-xl mx-auto p-6 pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">기록보기</h2>
        <p className="text-sm text-gray-500 mt-1">우리들의 도서관 서가를 구경해 보세요.</p>
      </div>

      <div className="space-y-12">
        {rows.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="relative">
            {/* Books Container */}
            <div className="grid grid-cols-3 gap-6 px-2 mb-2">
              {row.map((title) => {
                const bookRecords = groupedRecords[title];
                const displayRecord = bookRecords[0];
                return (
                  <div 
                    key={title} 
                    onClick={() => setSelectedBookTitle(title)}
                    className="relative group cursor-pointer transition-transform hover:-translate-y-2"
                  >
                    <div className="aspect-[3/4] rounded-lg shadow-lg overflow-hidden border border-gray-100 bg-gray-200">
                      <img src={displayRecord.coverImage} alt={title} className="w-full h-full object-cover" />
                    </div>
                    {bookRecords.length > 1 && (
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                        {bookRecords.length}
                      </div>
                    )}
                    <div className="mt-2 text-[10px] font-bold text-gray-600 truncate text-center px-1">
                      {title}
                    </div>
                  </div>
                );
              })}
              {/* Fill empty spots in grid to maintain spacing */}
              {row.length < 3 && [...Array(3 - row.length)].map((_, i) => <div key={`empty-${i}`} className="aspect-[3/4]" />)}
            </div>
            
            {/* Shelf Graphic */}
            <div className="h-4 bg-[#d97706] rounded-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] relative overflow-hidden">
               <div className="absolute inset-0 bg-white/10" />
               <div className="absolute inset-0 bg-black/5" />
            </div>
            <div className="h-1 bg-[#b45309] rounded-b-full mx-2 opacity-50" />
          </div>
        ))}

        {sortedBookTitles.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">아직 기록된 책이 없어요.</p>
            <p className="text-xs text-gray-300 mt-1">첫 번째 책을 기록해 보세요!</p>
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
