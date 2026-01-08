
import React, { useState } from 'react';
import { BookRecord, Session } from '../types';
import StarRating from './StarRating';
import { deleteRecord } from '../services/storage';

interface BookDetailModalProps {
  records: BookRecord[];
  onClose: () => void;
  onDeleted?: () => void;
  currentSession?: Session;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ records, onClose, onDeleted, currentSession }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const record = records[currentIndex];

  if (!record) return null;

  const isAuthor = currentSession && record.authorName === currentSession.user.name;

  const confirmDelete = () => {
    deleteRecord(record.id);
    if (onDeleted) onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ewha/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-ewha/10">
        
        {showConfirm && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-ewha/10 backdrop-blur-[2px] animate-in fade-in zoom-in duration-200">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-xs text-center border border-ewha/5">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <p className="text-gray-800 font-black text-lg mb-6 leading-tight">
                이 기록을 정말<br/>삭제하시겠습니까?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-400 font-black rounded-xl active:scale-95 transition-all"
                >
                  아니오
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500 text-white font-black rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-5 flex justify-between items-center border-b border-ewha/5 bg-gray-50/30">
          <div className="flex items-center">
            {records.length > 1 && (
              <span className="bg-ewha text-white text-[9px] font-black px-2 py-0.5 rounded-full mr-3 shadow-sm">
                {currentIndex + 1} / {records.length}
              </span>
            )}
            <h3 className="font-black text-ewha truncate max-w-[150px] md:max-w-[200px]">{record.title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {isAuthor && (
              <button 
                onClick={() => setShowConfirm(true)}
                className="p-2 hover:bg-red-50 text-red-400 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-ewha/5 rounded-full transition-colors">
              <svg className="w-6 h-6 text-ewha/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-8 custom-scrollbar flex-1">
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="w-full md:w-2/5 aspect-[3/4] bg-gray-50 rounded-[2rem] overflow-hidden shadow-2xl border border-ewha/5">
              <img src={record.coverImage} alt={record.title} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-3/5 flex flex-col justify-center space-y-4">
              <div>
                <p className="text-[10px] text-ewha/30 font-black uppercase tracking-widest mb-1">기록가</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-black text-ewha">{record.authorName}</p>
                  {isAuthor && (
                    <span className="text-[8px] font-black text-white bg-ewha-light px-2 py-0.5 rounded-full uppercase tracking-widest">My record</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-2">
                <div>
                  <p className="text-[9px] text-ewha/30 font-black uppercase tracking-widest mb-0.5">작가</p>
                  <p className="text-sm font-bold text-gray-700 truncate">{record.writer}</p>
                </div>
                <div>
                  <p className="text-[9px] text-ewha/30 font-black uppercase tracking-widest mb-0.5">출판사</p>
                  <p className="text-sm font-bold text-gray-700 truncate">{record.publisher}</p>
                </div>
                <div>
                  <p className="text-[9px] text-ewha/30 font-black uppercase tracking-widest mb-0.5">장르</p>
                  <p className="text-sm font-bold text-gray-700">{record.genre}</p>
                </div>
                <div>
                  <p className="text-[9px] text-ewha/30 font-black uppercase tracking-widest mb-0.5">페이지</p>
                  <p className="text-sm font-bold text-gray-700">{record.pages}p</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-[9px] text-ewha/30 font-black uppercase tracking-widest mb-1">독서 기간</p>
                <p className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl inline-block">
                  {record.startDate} — {record.endDate}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-ewha-soft/20 p-8 rounded-[2.5rem] border border-ewha/5">
            <div className="flex justify-between items-center mb-6">
              <StarRating rating={record.rating} />
              <span className="text-[10px] text-ewha/30 font-black uppercase tracking-widest">Recorded: {record.recordDate}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-ewha/5 relative">
              <div className="absolute -top-3 left-4 bg-white px-2 text-ewha/20">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12M10.017 21L10.017 18C10.017 16.8954 9.12157 16 8.017 16H5.017C4.46472 16 4.017 15.5523 4.017 15V9C4.017 8.44772 4.46472 8 5.017 8H9.017C9.56928 8 10.017 8.44772 10.017 9V12" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {record.review}
              </p>
            </div>
          </div>
        </div>

        {records.length > 1 && (
          <div className="p-5 bg-gray-50 border-t border-ewha/5 flex justify-between gap-4">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="flex-1 py-4 bg-white border border-ewha/10 rounded-2xl text-[10px] font-black text-ewha uppercase tracking-widest flex items-center justify-center disabled:opacity-20 transition-all active:scale-95 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
            <button 
              disabled={currentIndex === records.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="flex-1 py-4 bg-white border border-ewha/10 rounded-2xl text-[10px] font-black text-ewha uppercase tracking-widest flex items-center justify-center disabled:opacity-20 transition-all active:scale-95 shadow-sm"
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailModal;
