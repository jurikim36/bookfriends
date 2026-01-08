
import React, { useState, useRef } from 'react';
import { Group, UserProfile } from '../types';
import { generateGroupCode, createGroup, findGroup, setSession } from '../services/storage';

interface OnboardingProps {
  onComplete: () => void;
  isJoinOnly?: boolean;
  onCancel?: () => void;
}

type Step = 'landing' | 'choice' | 'create' | 'create_success' | 'join_code' | 'join_confirm' | 'signup';

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, isJoinOnly = false, onCancel }) => {
  const [step, setStep] = useState<Step>(isJoinOnly ? 'join_code' : 'landing');
  const [groupData, setGroupData] = useState<Partial<Group>>({ maxMembers: 5 });
  const [generatedCode, setGeneratedCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [targetGroup, setTargetGroup] = useState<Group | null>(null);
  const [userData, setUserData] = useState<Partial<UserProfile>>({ name: '', profileImage: '' });
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateGroup = () => {
    if (!groupData.name || !groupData.leaderName || !groupData.password) {
      alert('모든 정보를 입력해주세요.');
      return;
    }
    const code = generateGroupCode();
    const newGroup: Group = {
      ...groupData as Group,
      code,
    };
    createGroup(newGroup);
    setGeneratedCode(code);
    setStep('create_success');
  };

  const handleFindGroup = () => {
    const group = findGroup(joinCode);
    if (group) {
      setTargetGroup(group);
      setStep('join_confirm');
    } else {
      alert('모임코드를 다시 확인해주세요.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = () => {
    if (!userData.name || !userData.password) {
      alert('이름과 비밀번호를 입력해주세요.');
      return;
    }
    const group = targetGroup || findGroup(generatedCode);
    if (!group) return;

    const session = {
      group,
      user: { ...userData, groupId: group.code } as UserProfile
    };
    setSession(session);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 'landing':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-100/50">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Friends!</h1>
            <p className="text-gray-500 mb-12">같이 독서 기록을 나눠요</p>
            <button 
              onClick={() => setStep('choice')}
              className="w-full max-w-xs py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              기록하기
            </button>
          </div>
        );

      case 'choice':
        return (
          <div className="flex flex-col gap-4 px-6 pt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">어떻게 시작할까요?</h2>
            <button 
              onClick={() => setStep('create')}
              className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm text-left group hover:border-blue-500 transition-all"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-bold text-lg text-gray-800">모임 만들기</p>
              <p className="text-sm text-gray-400">새로운 독서 모임을 개설합니다.</p>
            </button>
            <button 
              onClick={() => setStep('join_code')}
              className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm text-left group hover:border-blue-500 transition-all"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="font-bold text-lg text-gray-800">모임 참여하기</p>
              <p className="text-sm text-gray-400">코드를 입력하고 모임에 합류합니다.</p>
            </button>
            {onCancel && (
              <button 
                onClick={onCancel}
                className="mt-4 py-3 text-gray-400 font-medium"
              >
                취소하고 돌아가기
              </button>
            )}
          </div>
        );

      case 'create':
        return (
          <div className="px-6 pt-8 pb-24 space-y-6 overflow-y-auto max-h-screen custom-scrollbar">
            <h2 className="text-2xl font-bold text-gray-800">모임 만들기</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">모임명</label>
                <input 
                  onChange={(e) => setGroupData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="독서 모임의 이름을 적어주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">모임장 이름</label>
                <input 
                  onChange={(e) => setGroupData(p => ({ ...p, leaderName: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="모임장의 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">참여 인원</label>
                <select 
                  onChange={(e) => setGroupData(p => ({ ...p, maxMembers: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}명</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">모임 소개글</label>
                <textarea 
                  onChange={(e) => setGroupData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none" 
                  placeholder="모임에 대해 간단히 소개해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">모임 비밀번호 설정</label>
                <input 
                  type="password"
                  onChange={(e) => setGroupData(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="모임 관리를 위한 비밀번호"
                />
                <p className="text-[10px] text-red-400 mt-2">※ 비밀번호는 분실 시 찾을 수 없으니 꼭 기억해주세요.</p>
              </div>
            </div>
            <button 
              onClick={handleCreateGroup}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg"
            >
              모임 생성하기
            </button>
            <button 
              onClick={() => setStep('choice')}
              className="w-full py-3 text-gray-400 font-medium"
            >
              취소하고 돌아가기
            </button>
          </div>
        );

      case 'create_success':
        return (
          <div className="px-8 pt-20 text-center">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">모임이 생성되었습니다!</h2>
            <p className="text-gray-500 mb-8">친구들에게 코드를 공유하세요.</p>
            
            <div className="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200 mb-8">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">모임 코드</p>
              <p className="text-4xl font-mono font-black text-blue-600 tracking-tighter">{generatedCode}</p>
            </div>
            
            <div className="text-left bg-red-50 p-4 rounded-xl mb-10 border border-red-100">
              <p className="text-[11px] text-red-500 leading-tight">
                ※ 모임코드는 잊어버리면 찾을 수 없으므로 반드시 다른 곳에 기록해두세요.
              </p>
            </div>

            <button 
              onClick={() => setStep('signup')}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg"
            >
              내 프로필 설정하기
            </button>
          </div>
        );

      case 'join_code':
        return (
          <div className="px-6 pt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">모임 참여하기</h2>
            <p className="text-gray-500 mb-8">전달받은 5자리 코드를 입력해주세요.</p>
            <input 
              maxLength={5}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full text-center text-4xl font-mono font-bold tracking-widest py-6 bg-white border border-gray-200 rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none mb-6"
              placeholder="00000"
            />
            <button 
              onClick={handleFindGroup}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg"
            >
              모임 찾기
            </button>
            <button 
              onClick={onCancel || (() => setStep('choice'))}
              className="w-full mt-4 py-3 text-gray-400 font-medium"
            >
              취소하고 돌아가기
            </button>
          </div>
        );

      case 'join_confirm':
        return (
          <div className="px-8 pt-20">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 mb-10 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{targetGroup?.name}</h3>
              <p className="text-blue-600 font-mono text-sm mb-4">#{targetGroup?.code}</p>
              <div className="h-px bg-gray-100 w-12 mx-auto mb-4" />
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{targetGroup?.description}</p>
              <p className="text-gray-800 font-bold">이 모임이 맞습니까?</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setStep('join_code')}
                className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl"
              >
                아니오
              </button>
              <button 
                onClick={() => setStep('signup')}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl"
              >
                예
              </button>
            </div>
          </div>
        );

      case 'signup':
        return (
          <div className="px-6 pt-8 pb-24 overflow-y-auto max-h-screen">
            <div className="mb-8">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">모임 가입</p>
              <h2 className="text-2xl font-bold text-gray-800">{targetGroup?.name || groupData.name}</h2>
              <p className="text-xs text-gray-400 mt-1">{targetGroup?.description || groupData.description}</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div 
                  onClick={() => profileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                >
                  {userData.profileImage ? (
                    <img src={userData.profileImage} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  <div className="absolute inset-0 bg-black/40 items-center justify-center flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white font-bold">수정</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-bold">기록가 프로필 사진</p>
                <input ref={profileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">기록가 이름</label>
                <input 
                  onChange={(e) => setUserData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="활동할 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">개인 비밀번호</label>
                <input 
                  type="password"
                  onChange={(e) => setUserData(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="기록 수정 시 필요합니다"
                />
                <p className="text-[10px] text-gray-400 mt-2">비밀번호는 본인의 기록을 보호하기 위해 사용됩니다.</p>
              </div>

              <button 
                onClick={handleFinalSubmit}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg mt-8"
              >
                가입 완료하고 시작하기
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-xl mx-auto h-full relative">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
