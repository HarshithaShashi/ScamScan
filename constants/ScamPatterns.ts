export const scamPatterns: Record<string, string[]> = {
  // High-risk financial patterns
  refundScam: [
    'sent you rs',
    'sent you ₹',
    'accidentally sent',
    'please refund',
    'send it back',
    'screenshot for proof',
    'gpay',
    'google pay',
    'phonepe',
    'paytm',
    'upi',
    'refund-gpay',
    'refund-upi',
    'refund-proof',
    'bit.ly',
    'tinyurl',
    'goo.gl',
    'click here'
  ],

  // Financial terms (medium risk)
  financial: [
    'refund',
    'bonus',
    'cash prize',
    'lottery',
    'winning',
    'reward',
    'free money',
    'instant cash',
    'quick money',
    'easy money',
    'investment',
    'returns',
    'profit',
    'guaranteed',
    'high returns'
  ],

  // Banking terms (high risk)
  banking: [
    'bank account',
    'credit card',
    'debit card',
    'account number',
    'routing number',
    'swift code',
    'ifsc code',
    'account balance',
    'transaction',
    'transfer',
    'withdrawal',
    'deposit',
    'banking details',
    'financial information',
    'account credentials'
  ],

  // Urgency indicators (medium risk)
  urgency: [
    'immediately',
    'urgent',
    'as soon as possible',
    'right away',
    'without delay',
    'promptly',
    'quickly',
    'hurry',
    'emergency',
    'critical',
    'last chance',
    'expiring soon',
    'limited time',
    'act now',
    'don\'t miss out'
  ],

  // Threats (high risk)
  threats: [
    'account will be blocked',
    'account will be suspended',
    'account will be closed',
    'account will be terminated',
    'account will be deactivated',
    'account will be restricted',
    'account will be locked',
    'account will be frozen',
    'account will be disabled',
    'account will be deleted',
    'legal action',
    'police complaint',
    'court case',
    'fine',
    'penalty'
  ],

  // Verification requests (medium risk)
  verification: [
    'verify',
    'confirm',
    'validate',
    'authenticate',
    'check',
    'verify now',
    'confirm now',
    'validate now',
    'authenticate now',
    'check now',
    'kyc',
    'know your customer',
    'identity verification',
    'account verification',
    'security verification'
  ],

  // Suspicious actions (high risk)
  actions: [
    'click here',
    'click below',
    'click now',
    'click to claim',
    'click to verify',
    'click to confirm',
    'click to validate',
    'click to authenticate',
    'click to check',
    'click to proceed',
    'download',
    'install',
    'update',
    'upgrade',
    'renew'
  ],

  // Mixed language patterns (medium risk)
  mixedLanguage: [
    'paise bhejo now',
    'you won ₹5000 ka lottery',
    'account block ho jayega',
    'kyc verify karo',
    'urgent action required hai',
    'bank details share karo',
    'otp send karo',
    'money transfer karo',
    'account verify karo',
    'security alert aaya hai'
  ],

  // Greetings (low risk)
  greetings: [
    'hey',
    'hi',
    'hello',
    'namaste',
    'namaskar',
    'good morning',
    'good afternoon',
    'good evening'
  ]
}; 