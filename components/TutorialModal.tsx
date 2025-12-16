
import React, { useState } from 'react';

interface Props {
  onClose: (neverShowAgain: boolean) => void;
}

const TutorialModal: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Z-SIMULATOR에 오신 것을 환영합니다",
      icon: "🧟",
      content: "이곳은 MBTI 성격 유형과 인간관계를 기반으로 작동하는 좀비 아포칼립스 생존 시뮬레이터입니다. 당신의 선택과 우연이 생존자들의 운명을 결정합니다."
    },
    {
      title: "생존자 등록",
      icon: "📝",
      content: "먼저 이름, 성별, MBTI, 정신 상태를 설정하여 생존자를 그룹에 추가하세요. MBTI 유형에 따라 위기 대처 방식과 이벤트가 달라집니다."
    },
    {
      title: "상태 관리",
      icon: "❤️",
      content: "체력(HP), 정신력(Sanity), 피로도(Fatigue), 감염도(Infection)를 주의 깊게 살피세요. 피로도가 높으면 사고가 발생하고, 정신력이 낮으면 이상 행동을 보입니다."
    },
    {
      title: "인간관계의 변화",
      icon: "💞",
      content: "매일 발생하는 이벤트를 통해 캐릭터 간의 호감도가 변합니다. 연인이 되거나, 원수가 되어 서로를 해칠 수도 있습니다. 관계도를 통해 이를 확인할 수 있습니다."
    },
    {
      title: "아이템과 루팅",
      icon: "🎒",
      content: "시뮬레이션 중 다양한 물자를 획득합니다. 인벤토리의 아이템을 클릭(터치)하여 생존자에게 사용해 위기를 넘기세요."
    },
    {
      title: "생존을 시작하세요",
      icon: "🔥",
      content: "'다음 날' 버튼을 눌러 하루를 진행하세요. 과연 며칠이나 생존할 수 있을까요? 행운을 빕니다."
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose(true);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onClose(true);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-600 flex flex-col min-h-[400px]">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5">
          <div 
            className="h-full bg-zombie-green transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-6 animate-bounce-slow">
            {steps[step].icon}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            {steps[step].title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {steps[step].content}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
          
          <div className="flex justify-center mb-4">
            {/* Dots Indicator */}
            <div className="flex gap-1.5">
              {steps.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-colors ${idx === step ? 'bg-slate-800 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-600'}`}
                ></div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 font-medium text-sm transition-colors"
            >
              건너뛰기
            </button>
            <div className="flex-1 flex justify-end gap-3">
              {step > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm transition-colors"
                >
                  이전
                </button>
              )}
              <button
                onClick={handleNext}
                className={`px-6 py-2 rounded-lg text-white font-bold text-sm shadow-sm transition-transform active:scale-95 ${step === steps.length - 1 ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {step === steps.length - 1 ? '시작하기' : '다음'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
