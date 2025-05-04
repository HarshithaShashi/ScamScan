export const en = {
  // App general
  appName: 'ScamScanner',
  
  // Tab names
  home: 'Home',
  scan: 'Scan',
  history: 'History',
  settings: 'Settings',
  
  // Home screen
  welcomeMessage: 'Welcome to ScamScanner, your protection against scam messages. We help you identify potential scams and stay safe online.',
  scanNewMessage: 'Scan a Message',
  scamTips: 'Scam Prevention Tips',
  urgencyTitle: 'Be Wary of Urgency',
  urgencyDesc: 'Scammers often create false urgency to pressure you into taking immediate action without thinking.',
  personalInfoTitle: 'Protect Personal Information',
  personalInfoDesc: 'Never share bank details, passwords, OTPs, or personal information via text messages.',
  strangeLinksTitle: 'Avoid Clicking Links',
  strangeLinksDesc: 'Don\'t click on suspicious links in messages, especially shortened URLs from unknown senders.',
  prizesTitle: 'Too Good To Be True',
  prizesDesc: 'Unexpected prizes, lotteries, or offers that seem too good to be true usually are scams.',
  recentActivity: 'Recent Activity',
  viewHistory: 'View Scan History',
  
  // Scan screen
  scanMessage: 'Scan Message',
  pasteMessageLabel: 'Paste the message you want to scan:',
  messageInputPlaceholder: 'Paste or type message here...',
  scanButton: 'Scan Now',
  clearButton: 'Clear',
  scanResultTitle: 'Message Analysis',
  explanationTitle: 'What This Means',
  scamIndicatorsTitle: 'Detected Indicators',
  readAloud: 'Read Aloud',
  stopReading: 'Stop Reading',
  
  // History screen
  scannedMessages: 'Scanned Messages',
  clearAll: 'Clear All',
  noHistoryTitle: 'No Scan History',
  noHistoryDesc: 'Messages you scan will appear here so you can review them later.',
  startScanning: 'Start Scanning',
  scamHistory: 'Scan History',
  
  // Settings
  displaySettings: 'Display Settings',
  darkMode: 'Dark Mode',
  language: 'Language',
  change: 'Change',
  selectLanguage: 'Select Language',
  notificationSettings: 'Notification Settings',
  notificationsEnabled: 'Enable Notifications',
  audioAlerts: 'Audio Alerts',
  about: 'About',
  privacyPolicy: 'Privacy Policy',
  version: 'Version',
  appearance: 'Appearance',
  theme: 'Theme',
  dark: 'Dark',
  light: 'Light',
  
  // Alert levels
  high: 'High Risk',
  medium: 'Caution',
  low: 'Safe',
  
  // Alert banners
  safeBannerTitle: 'Message Appears Safe',
  safeBannerDesc: 'No scam indicators detected, but always stay vigilant.',
  warningBannerTitle: 'Possible Scam Detected',
  warningBannerDesc: 'This message contains some suspicious elements. Be cautious.',
  dangerBannerTitle: 'Warning: Likely Scam!',
  dangerBannerDesc: 'Multiple scam indicators found. Do not respond or click any links.',
  
  // Scam detection messages
  scamDetection: {
    low: {
      title: 'Message Appears Safe',
      description: 'This message appears to be safe. No common scam indicators were detected.',
    },
    medium: {
      title: 'Possible Scam Detected',
      description: 'This message contains some potential scam indicators. Be cautious before responding or clicking any links.',
    },
    high: {
      title: 'Warning: Likely Scam!',
      description: 'This message contains multiple scam indicators and may be attempting to steal your information or money. Do not respond or click any links.',
    },
    indicators: {
      bankingInfo: 'Requests for banking details or security codes',
      kycUpdate: 'Fake KYC or account verification requests',
      prizes: 'Fake lottery or prize notifications',
      governmentImpersonation: 'Government agency impersonation',
      jobOffers: 'Suspicious job offers or income schemes',
      investment: 'Suspicious investment schemes promising high returns',
      techSupport: 'Fake tech support or security warnings',
      personalInfo: 'Requests for personal identification details',
      suspiciousUrls: 'Contains suspicious or shortened URLs',
      urgency: 'Creates a false sense of urgency',
      noIndicators: 'No specific scam indicators detected',
    }
  },
  
  scan: {
    title: 'Scan Message',
    placeholder: 'Enter or paste message to scan',
    scanButton: 'Scan',
    pasteMessageLabel: 'Paste Message',
    scanMessage: 'Scan Message',
    alertLevels: {
      low: 'Low Risk',
      medium: 'Medium Risk',
      high: 'High Risk'
    }
  }
};