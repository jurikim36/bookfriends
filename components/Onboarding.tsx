
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
    const trimmedCode = joinCode.trim();
    if (!trimmedCode || trimmedCode.length < 5) {
      alert('모임코드를 다시 확인해주세요.');
      return;
    }

    const group = findGroup(trimmedCode);
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
          <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-white animate-in fade-in duration-700">
            <div className="w-28 h-28 bg-ewha-soft rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-ewha/10">
              <svg className="w-14 h-14 text-ewha" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-ewha mb-3 tracking-tighter">Book Friends!</h1>
            <p className="text-ewha/40 mb-16 font-bold uppercase tracking-[0.2em] text-xs">Library for our friendship</p>
            <button 
              onClick={() => setStep('choice')}
              className="w-full max-w-xs py-5 bg-ewha text-white rounded-3xl font-black shadow-2xl shadow-ewha/20 active:scale-95 transition-all text-lg"
            >
              기록 시작하기
            </button>
          </div>
        );

      case 'choice':
        return (
          <div className="flex flex-col gap-5 px-8 pt-16 animate-in slide-in-from-right duration-400">
            <h2 className="text-3xl font-black text-ewha mb-6">어떻게 시작할까요?</h2>
            <button 
              onClick={() => setStep('create')}
              className="p-8 bg-white border border-ewha/5 rounded-[2.5rem] shadow-sm text-left group hover:border-ewha transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-ewha-soft rounded-2xl flex items-center justify-center mb-5 group-hover:bg-ewha group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-black text-xl text-gray-800">새 모임 만들기</p>
              <p className="text-sm text-ewha/30 font-bold mt-1">우리만의 독서 서가를 새로 개설합니다.</p>
            </button>
            <button 
              onClick={() => setStep('join_code')}
              className="p-8 bg-white border border-ewha/5 rounded-[2.5rem] shadow-sm text-left group hover:border-ewha transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-ewha-soft/50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-ewha group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="font-black text-xl text-gray-800">모임 참여하기</p>
              <p className="text-sm text-ewha/30 font-bold mt-1">친구에게 공유받은 코드로 입장합니다.</p>
            </button>
            
            <button 
              onClick={() => setStep('landing')}
              className="mt-6 py-3 text-ewha/30 font-black hover:text-ewha transition-colors text-sm uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        );

      case 'create':
        return (
          <div className="px-8 pt-10 pb-24 space-y-8 overflow-y-auto max-h-screen custom-scrollbar animate-in slide-in-from-right duration-400">
            <h2 className="text-3xl font-black text-ewha">새 모임 만들기</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-ewha/40 mb-2 px-1 uppercase tracking-widest">모임명</label>
                <input 
                  onChange={(e) => setGroupData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-ewha transition-all font-bold" 
                  placeholder="모임 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-ewha/40 mb-2 px-1 uppercase tracking-widest">모임장</label>
                <input 
                  onChange={(e) => setGroupData(p => ({ ...p, leaderName: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-ewha transition-all font-bold" 
                  placeholder="당신의 이름"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-ewha/40 mb-2 px-1 uppercase tracking-widest">참여 인원</label>
                <select 
                  onChange={(e) => setGroupData(p => ({ ...p, maxMembers: parseInt(e.target.value) }))}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-ewha transition-all cursor-pointer font-bold"
                  defaultValue={5}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}명</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-ewha/40 mb-2 px-1 uppercase tracking-widest">비밀번호</label>
                <input 
                  type="password"
                  onChange={(e) => setGroupData(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-ewha transition-all font-bold" 
                  placeholder="관리용 비밀번호"
                />
              </div>
            </div>
            <div className="pt-4 space-y-4">
              <button 
                onClick={handleCreateGroup}
                className="w-full py-5 bg-ewha text-white rounded-3xl font-black shadow-xl shadow-ewha/20 active:scale-95 transition-all"
              >
                모임 개설하기
              </button>
              <button onClick={() => setStep('choice')} className="w-full py-3 text-ewha/30 font-black text-sm uppercase tracking-widest">이전으로</button>
            </div>
          </div>
        );

      case 'create_success':
        return (
          <div className="px-10 pt-24 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-ewha-soft text-ewha rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-ewha mb-3">모임이 개설되었습니다!</h2>
            <p className="text-ewha/40 mb-12 font-bold uppercase tracking-widest text-[10px]">Invite your book friends</p>
            
            <div className="bg-ewha-soft/30 p-8 rounded-[2.5rem] border-2 border-dashed border-ewha/10 mb-12">
              <p className="text-[10px] text-ewha/40 uppercase font-black tracking-[0.3em] mb-3">Invitation Code</p>
              <p className="text-5xl font-mono font-black text-ewha tracking-tighter">{generatedCode}</p>
            </div>
            
            <button 
              onClick={() => setStep('signup')}
              className="w-full py-5 bg-ewha text-white rounded-3xl font-black shadow-xl shadow-ewha/20 active:scale-95 transition-all"
            >
              프로필 설정하고 시작하기
            </button>
          </div>
        );

      case 'join_code':
        return (
          <div className="px-8 pt-20 animate-in slide-in-from-right duration-400 text-center">
            <h2 className="text-3xl font-black text-ewha mb-3">모임 참여하기</h2>
            <p className="text-ewha/40 mb-16 font-bold uppercase tracking-widest text-[10px]">Enter 5-digit code</p>
            <input 
              maxLength={5}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="w-full text-center text-5xl font-mono font-black tracking-[0.5em] py-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] focus:ring-4 focus:ring-ewha/5 focus:bg-white outline-none mb-10 transition-all text-ewha"
              placeholder="00000"
            />
            <button 
              onClick={handleFindGroup}
              className="w-full py-5 bg-ewha text-white rounded-3xl font-black shadow-xl shadow-ewha/20 active:scale-95 transition-all text-lg"
            >
              참여 코드 확인
            </button>
            <button 
              onClick={isJoinOnly ? onCancel : () => setStep('choice')}
              className="w-full mt-6 py-3 text-ewha/30 font-black text-sm uppercase tracking-widest transition-colors hover:text-ewha"
            >
              취소하고 돌아가기
            </button>
          </div>
        );

      case 'join_confirm':
        return (
          <div className="px-10 pt-24 animate-in zoom-in duration-400">
            <div className="bg-white p-10 rounded-[3rem] border border-ewha/10 shadow-2xl shadow-ewha/5 mb-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-ewha"></div>
              <h3 className="text-3xl font-black text-gray-800 mb-3">{targetGroup?.name}</h3>
              <p className="text-ewha font-mono font-black text-sm mb-6 tracking-widest">#{targetGroup?.code}</p>
              <div className="h-px bg-gray-100 w-16 mx-auto mb-6" />
              <p className="text-gray-400 font-bold mb-12">이 모임에 가입하시겠습니까?</p>
              <div className="flex gap-4">
                <button onClick={() => setStep('join_code')} className="flex-1 py-4 bg-gray-50 text-gray-400 font-black rounded-2xl active:scale-95 transition-all">아니오</button>
                <button onClick={() => setStep('signup')} className="flex-1 py-4 bg-ewha text-white font-black rounded-2xl shadow-lg shadow-ewha/20 active:scale-95 transition-all">네, 맞습니다</button>
              </div>
            </div>
          </div>
        );

      case 'signup':
        return (
          <div className="px-8 pt-10 pb-24 overflow-y-auto max-h-screen custom-scrollbar animate-in slide-in-from-right duration-400">
            <div className="mb-12">
              <p className="text-[10px] font-black text-ewha/30 uppercase tracking-[0.3em] mb-2">Member Registration</p>
              <h2 className="text-3xl font-black text-ewha leading-tight">{targetGroup?.name || groupData.name}</h2>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col items-center mb-4">
                <div 
                  onClick={() => profileInputRef.current?.click()}
                  className="w-28 h-28 rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-ewha/10 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                >
                  {userData.profileImage ? (
                    <img src={userData.profileImage} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-ewha/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  <div className="absolute inset-0 bg-ewha/40 items-center justify-center flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Update</span>
                  </div>
                </div>
                <input ref={profileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-ewha/40 mb-2 px-1 uppercase tracking-widest">활동 이름</label>
                <input onChange={(e) => setUserData(p => ({ ...p, name: e.target.value }))} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-ewha transition-all font-bold" placeholder="닉네임을 적어주세요" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-ewha/40 mb-2 px-1 uppercase tracking-widest">개인 비밀번호</label>
                <input type="password" onChange={(e) => setUserData(p => ({ ...p, password: e.target.value }))} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-ewha transition-all font-bold" placeholder="기록 보호용 비밀번호" />
                <p className="text-[10px] text-ewha/30 mt-3 font-bold leading-tight px-1 italic">이 이름은 기록가 명칭으로 고정되어 사용됩니다.</p>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleFinalSubmit}
                  className="w-full py-5 bg-ewha text-white rounded-3xl font-black shadow-xl shadow-ewha/20 active:scale-95 transition-all"
                >
                  가입 완료하고 시작하기
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <div className="max-w-xl mx-auto h-full relative">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
