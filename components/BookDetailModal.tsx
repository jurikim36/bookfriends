
import React, { useState } from 'react';
import { BookRecord, Session } from '../types';
import StarRating from './StarRating';
import { deleteRecord } from '../services/storage';

interface BookDetailModalProps {
  records: BookRecord[];
  onClose: () => void;
  onDeleted?: () => void;
  currentSession?: Session; // Pass session to check ownership
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ records, onClose, onDeleted, currentSession }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const record = records[currentIndex];

  if (!record) return null;

  // Check if current user is the author of the record
  // If no session provided (for some reason), we default to not allowing delete for safety
  const isAuthor = currentSession && record.authorName === currentSession.user.name;

  const confirmDelete = () => {
    deleteRecord(record.id);
    if (onDeleted) onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* 삭제 확인 커스텀 다이얼로그 오버레이 */}
        {showConfirm && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in zoom-in duration-200">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <p className="text-gray-800 font-bold text-lg mb-6 leading-tight">
                이 기록을 정말<br/>삭제하시겠습니까?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  아니오
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  예
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center">
            {records.length > 1 && (
              <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full mr-2">
                기록 {currentIndex + 1} / {records.length}
              </span>
            )}
            <h3 className="font-bold text-gray-800 truncate max-w-[150px] md:max-w-[200px]">{record.title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {isAuthor && (
              <button 
                onClick={() => setShowConfirm(true)}
                className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-full transition-colors"
                title="삭제"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 custom-scrollbar flex-1">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-1/3 aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden shadow-lg">
              <img src={record.coverImage} alt={record.title} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">기록가</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-blue-600">{record.authorName}</p>
                  {isAuthor && (
                    <span className="text-[8px] font-black text-blue-400 bg-blue-50 px-1 rounded border border-blue-100 uppercase">My Record</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">작가</p>
                  <p className="text-sm font-medium text-gray-700">{record.writer}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">출판사</p>
                  <p className="text-sm font-medium text-gray-700">{record.publisher}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">장르</p>
                  <p className="text-sm font-medium text-gray-700">{record.genre}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">페이지</p>
                  <p className="text-sm font-medium text-gray-700">{record.pages}p</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">독서 기간</p>
                <p className="text-xs font-medium text-gray-600">
                  {record.startDate} ~ {record.endDate}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <StarRating rating={record.rating} />
              <span className="text-[10px] text-gray-400 font-medium">기록일: {record.recordDate}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap italic">
                &quot;{record.review}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Navigation for multiple reviews */}
        {records.length > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-4">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              이전 기록
            </button>
            <button 
              disabled={currentIndex === records.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
            >
              다음 기록
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailModal;
