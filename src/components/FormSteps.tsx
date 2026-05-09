import React, { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle2, ArrowRight } from 'lucide-react';
import { FormData } from '../types';
import { fileToBase64 } from '../lib/utils';
import { cn } from '../lib/utils';

interface FormStepsProps {
  onComplete: (data: FormData, fileContent?: string, fileMimeType?: string) => void;
}

export function FormSteps({ onComplete }: FormStepsProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    topSubjects: '',
    passionSubject: '',
    workPreference: '',
    location: '',
    relocate: false,
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | undefined>();
  const [fileMimeType, setFileMimeType] = useState<string | undefined>();

  const onDrop = useCallback(async <T extends File>(acceptedFiles: T[]) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      setFile(f);
      try {
        const base64 = await fileToBase64(f);
        setFileBase64(base64);
        setFileMimeType(f.type || 'application/pdf'); // fallback for PDF
      } catch (err) {
        console.error("Failed to parse file", err);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop as any,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1
  } as any);


  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const handleComplete = () => {
    onComplete(formData, fileBase64, fileMimeType);
  };

  const steps = [
    {
      title: "What are your top 3 highest-scoring subjects?",
      description: "Don't overthink it. Just list the ones where you naturally score best.",
      content: (
        <input
          type="text"
          autoFocus
          placeholder="e.g. Math, Physics, Computer Science"
          className="w-full text-2xl bg-transparent border-b-2 border-border focus:border-card-foreground outline-none py-4 transition-colors placeholder:text-foreground/50 text-card-foreground"
          value={formData.topSubjects}
          onChange={e => setFormData({ ...formData, topSubjects: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && formData.topSubjects && nextStep()}
        />
      ),
      isValid: formData.topSubjects.trim().length > 2
    },
    {
      title: "Which subject do you enjoy so much you'd study it for free?",
      description: "Think about the classes where time flies by.",
      content: (
        <input
          type="text"
          autoFocus
          placeholder="e.g. History, Art, Coding"
          className="w-full text-2xl bg-transparent border-b-2 border-border focus:border-card-foreground outline-none py-4 transition-colors placeholder:text-foreground/50 text-card-foreground"
          value={formData.passionSubject}
          onChange={e => setFormData({ ...formData, passionSubject: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && formData.passionSubject && nextStep()}
        />
      ),
      isValid: formData.passionSubject.trim().length > 2
    },
    {
      title: "How do you prefer to work?",
      description: "Choose the environment that sounds most appealing.",
      content: (
        <div className="flex flex-col gap-4 mt-6">
          {['People (Collaborating, leading, helping)', 'Abstract Data (Analyzing, coding, researching)', 'Physical Tools (Building, designing, crafting)'].map(opt => {
            const val = opt.split(' ')[0];
            return (
              <button
                key={val}
                onClick={() => {
                  setFormData({ ...formData, workPreference: val });
                  setTimeout(nextStep, 300);
                }}
                className={cn(
                  "text-left p-6 rounded-2xl border-2 transition-all duration-200 text-xl font-medium",
                  formData.workPreference === val 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-border hover:border-border/80 hover:bg-card/50 text-foreground"
                )}
              >
                {opt}
              </button>
            )
          })}
        </div>
      ),
      isValid: !!formData.workPreference
    },
    {
      title: "Where are you based?",
      description: "City and state. Also let us know if you're open to moving.",
      content: (
        <div className="space-y-8 mt-4">
          <input
            type="text"
            autoFocus
            placeholder="e.g. Austin, TX"
            className="w-full text-2xl bg-transparent border-b-2 border-border focus:border-card-foreground outline-none py-4 transition-colors placeholder:text-foreground/50 text-card-foreground"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className={cn(
              "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
              formData.relocate ? "border-primary bg-primary" : "border-border group-hover:border-card-foreground"
            )}>
              {formData.relocate && <CheckCircle2 className="w-5 h-5 text-primary-foreground" />}
            </div>
            <span className="text-xl text-foreground font-medium">I am willing to relocate</span>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={formData.relocate}
              onChange={e => setFormData({ ...formData, relocate: e.target.checked })}
            />
          </label>
        </div>
      ),
      isValid: formData.location.trim().length > 2
    },
    {
      title: "Upload your Class 12th Marksheet",
      description: "Optional, but highly recommended for better accuracy. We use AI to analyze your exact grades.",
      content: (
        <div className="mt-6">
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200",
              isDragActive ? "border-primary bg-card" : "border-border hover:border-border hover:bg-card/50",
              file && "border-green-500 bg-green-500/10"
            )}
          >
            <input {...getInputProps()} />
            {file ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
                <p className="text-xl font-medium text-card-foreground">{file.name}</p>
                <p className="text-sm text-foreground/80 mt-2">File ready for analysis</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-foreground/50 mb-4" />
                <p className="text-xl font-medium text-card-foreground">Drag & drop your file here</p>
                <p className="text-sm text-foreground/80 mt-2">Supported: PDF, JPG, PNG up to 10MB</p>
              </>
            )}
          </div>
        </div>
      ),
      isValid: true // Optional step
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-12 px-6 sm:px-12 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full flex gap-2 mb-16">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              i <= step ? "bg-card-foreground" : "bg-card"
            )} 
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-card-foreground mb-4">
            {currentStep.title}
          </h2>
          <p className="text-lg text-foreground/80 mb-12">
            {currentStep.description}
          </p>

          {currentStep.content}
        </motion.div>
      </div>

      <div className="mt-12 flex items-center justify-between">
        <button 
          onClick={prevStep}
          disabled={step === 0}
          className={cn(
            "text-lg font-medium transition-opacity",
            step === 0 ? "opacity-0 pointer-events-none" : "opacity-100 hover:text-foreground/80"
          )}
        >
          Back
        </button>
        
        <button
          onClick={step === steps.length - 1 ? handleComplete : nextStep}
          disabled={!currentStep.isValid && step !== steps.length - 1} // Let them skip last step
          className={cn(
            "flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium transition-all",
            (!currentStep.isValid && step !== steps.length - 1) ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/80 hover:scale-105 active:scale-95"
          )}
        >
          {step === steps.length - 1 ? (file ? "Analyze Profile" : "Skip & Analyze") : "Continue"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
