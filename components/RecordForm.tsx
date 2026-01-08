
import React, { useState, useEffect, useRef } from 'react';
import { GENRES } from '../constants';
import { BookRecord } from '../types';
import { getDraft, saveDraft, saveRecord, clearDraft } from '../services/storage';
import StarRating from './StarRating';

interface RecordFormProps {
  onSaved: () => void;
  defaultAuthor?: string;
  groupId: string;
}

const RecordForm: React.FC<RecordFormProps> = ({ onSaved, defaultAuthor, groupId }) => {
  const [formData, setFormData] = useState<Partial<BookRecord>>({
    title: '',
    authorName: defaultAuthor || '',
    writer: '',
    publisher: '',
    genre: '소설',
    pages: 0,
    startDate: '',
    endDate: '',
    recordDate: new Date().toISOString().split('T')[0],
    coverImage: '',
    rating: 0,
    review: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      setFormData(prev => ({ ...prev, ...draft }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pages' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.coverImage) {
      alert('책 제목과 커버 사진은 필수입니다!');
      return;
    }
    const fullRecord: BookRecord = {
      ...formData as BookRecord,
      id: crypto.randomUUID(),
      groupId: groupId,
      timestamp: Date.now(),
    };
    saveRecord(fullRecord);
    clearDraft();
    alert('기록되었습니다!');
    onSaved();
  };

  const handleDraft = () => {
    saveDraft(formData);
    alert('임시 저장되었습니다.');
  };

  return (
    <div className="max-w-xl mx-auto pb-24 px-4 pt-4">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold text-gray-800">기록하기</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleDraft}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            임시저장
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            기록하기
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">책 제목</label>
            <input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="책 제목을 입력하세요"
              className="w-full px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">기록가 이름</label>
            <input 
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              placeholder="본인의 이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </section>

        {/* Cover Image */}
        <section className="bg-white p-6 rounded-3xl shadow-sm">
          <label className="block text-sm font-semibold text-gray-600 mb-4">책 커버 사진</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[3/4] max-w-[200px] mx-auto border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-100 transition-all relative group"
          >
            {formData.coverImage ? (
              <>
                <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover Preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold">변경하기</span>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 font-bold">사진 업로드</p>
                <p className="text-[10px] text-gray-400 mt-1">갤러리에서 선택</p>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </section>

        {/* Book Details */}
        <section className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">&lt;책 정보&gt;</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">읽기 시작한 날</label>
                <input 
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">다 읽은 날</label>
                <input 
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">작가</label>
              <input 
                name="writer"
                value={formData.writer}
                onChange={handleChange}
                placeholder="책 저자 이름"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">출판사</label>
              <input 
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="출판사명"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">장르</label>
                <select 
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                >
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">페이지 수</label>
                <input 
                  type="number"
                  name="pages"
                  value={formData.pages || ''}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Book Review */}
        <section className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">&lt;책 기록&gt;</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-3">별점</label>
              <StarRating 
                rating={formData.rating || 0} 
                interactive 
                onRatingChange={(r) => setFormData(prev => ({ ...prev, rating: r }))} 
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-gray-500">기록 (감상)</label>
                <span className={`text-[10px] font-bold ${ (formData.review?.length || 0) > 450 ? 'text-red-400' : 'text-gray-300'}`}>{(formData.review?.length || 0)} / 500자</span>
              </div>
              <textarea 
                name="review"
                value={formData.review}
                onChange={handleChange}
                maxLength={500}
                placeholder="책을 읽고 느낀 점을 자유롭게 기록해 보세요 (500자 이내)"
                className="w-full h-40 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecordForm;
