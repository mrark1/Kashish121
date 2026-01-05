import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { AppRoute } from '../types';
import { ShieldCheck, Mail, Key } from 'lucide-react';

export const ForgotPassword = ({ onNavigate }: { onNavigate: (r: AppRoute) => void }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [masterKey, setMasterKey] = useState('');

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6 flex gap-3">
              <Mail className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-200">Step 1: Email Verification</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">We will send a One-Time Password to your registered email.</p>
              </div>
            </div>
            <Input label="Registered Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@kashish.com" />
            <div className="mt-4 flex justify-end">
               <Button onClick={() => setStep(2)}>Send OTP</Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mb-6 flex gap-3">
              <ShieldCheck className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-900 dark:text-yellow-200">Step 2: Security Verification</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Enter the OTP sent to {email} and verify security question.</p>
              </div>
            </div>
            <div className="space-y-4">
              <Input label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Security Question: What is your favorite color?</label>
                <Input value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} placeholder="Answer" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
               <Button onClick={() => {
                 if(securityAnswer.toLowerCase() === 'blue') setStep(3);
                 else alert('Incorrect security answer (Hint: blue)');
               }}>Verify</Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-6 flex gap-3">
              <Key className="text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-200">Step 3: Master Recovery Key</h3>
                <p className="text-sm text-red-700 dark:text-red-300">Enter the offline master recovery key generated during setup.</p>
              </div>
            </div>
            <Input label="Master Key" type="password" value={masterKey} onChange={(e) => setMasterKey(e.target.value)} placeholder="KASHISH-XXXX-XXXX" />
            <div className="mt-4 flex justify-end">
               <Button variant="danger" onClick={() => {
                 if(masterKey === 'KASHISH-MASTER-KEY-2025') {
                   alert('Access Granted. New password sent to email.');
                   onNavigate(AppRoute.LOGIN);
                 } else {
                   alert('Invalid Master Key');
                 }
               }}>Unlock Account</Button>
            </div>
          </>
        );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Account Recovery</h2>
        {renderStep()}
        <div className="mt-6 text-center">
          <button onClick={() => onNavigate(AppRoute.LOGIN)} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">Back to Login</button>
        </div>
      </Card>
    </div>
  );
};
