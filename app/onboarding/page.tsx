'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { Step1Profile } from '@/components/onboarding/Step1Profile';
import { Step2Period } from '@/components/onboarding/Step2Period';
import { Step3Symptoms } from '@/components/onboarding/Step3Symptoms';
import { Step4Dosha } from '@/components/onboarding/Step4Dosha';
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { saveUserProfile, setOnboardingComplete, isOnboardingComplete } from '@/lib/storage';
import type { Dosha, UserProfile } from '@/lib/types';
import { DOSHA_QUESTIONS } from '@/lib/types';

const STEP_LABELS = ['Your Profile', 'Your Cycle', 'Symptoms', 'Dosha Quiz'];
const TOTAL_STEPS = 4;
const TODAY = new Date().toISOString().split('T')[0];

function calcDosha(answers: (Dosha | null)[]): { dosha: Dosha; scores: Record<Dosha, number> } {
  const scores: Record<Dosha, number> = { vata: 0, pitta: 0, kapha: 0 };
  answers.forEach(a => { if (a) scores[a]++; });
  const dosha = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as Dosha;
  return { dosha, scores };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(TODAY);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [doshaAnswers, setDoshaAnswers] = useState<(Dosha | null)[]>(
    Array(DOSHA_QUESTIONS.length).fill(null)
  );

  // Redirect away if already onboarded
  useEffect(() => {
    if (isOnboardingComplete()) router.replace('/');
  }, [router]);

  function canAdvance(): boolean {
    if (step === 1) return name.trim().length > 0 && !!startDate;
    if (step === 2) return !!lastPeriodDate;
    if (step === 3) return true; // symptoms are optional
    if (step === 4) return doshaAnswers.every(a => a !== null);
    return false;
  }

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
      return;
    }
    // Final step — compute and save
    const { dosha, scores } = calcDosha(doshaAnswers);
    const newProfile: UserProfile = {
      name: name.trim(),
      startDate,
      lastPeriodDate,
      symptoms,
      dosha,
      doshaScores: scores,
      createdAt: new Date().toISOString(),
    };
    saveUserProfile(newProfile);
    setOnboardingComplete();
    setProfile(newProfile);
    setDone(true);
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1);
  }

  if (done && profile) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <div className="flex-1 max-w-md mx-auto w-full px-5 py-10 overflow-y-auto">
          <WelcomeScreen profile={profile} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 max-w-md mx-auto w-full px-5 flex flex-col">
        {/* Header */}
        <div className="pt-10 pb-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-full bg-terracotta flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="text-sm font-semibold text-charcoal/70">Heal Her</span>
          </div>
          <StepIndicator current={step} total={TOTAL_STEPS} labels={STEP_LABELS} />
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto pb-4">
          {step === 1 && (
            <Step1Profile
              data={{ name, startDate }}
              onChange={d => { setName(d.name); setStartDate(d.startDate); }}
            />
          )}
          {step === 2 && (
            <Step2Period
              lastPeriodDate={lastPeriodDate}
              onChange={setLastPeriodDate}
            />
          )}
          {step === 3 && (
            <Step3Symptoms
              selected={symptoms}
              onChange={setSymptoms}
            />
          )}
          {step === 4 && (
            <Step4Dosha
              answers={doshaAnswers}
              onChange={setDoshaAnswers}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="py-6 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary flex-1 py-3.5"
            >
              ← Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance()}
            className={`flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm
              ${canAdvance()
                ? 'bg-terracotta text-white hover:bg-terracotta-dark active:scale-[0.98]'
                : 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed'
              }`}
          >
            {step === TOTAL_STEPS ? 'See my results →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
