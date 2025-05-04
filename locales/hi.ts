export const hi = {
  // App general
  appName: 'स्कैम स्कैनर',
  
  // Tab names
  home: 'होम',
  scan: 'स्कैन',
  history: 'इतिहास',
  settings: 'सेटिंग्स',
  
  // Home screen
  welcomeMessage: 'स्कैम स्कैनर में आपका स्वागत है, जो धोखाधड़ी संदेशों से आपकी रक्षा करता है। हम आपको संभावित स्कैम पहचानने और ऑनलाइन सुरक्षित रहने में मदद करते हैं।',
  scanNewMessage: 'मैसेज स्कैन करें',
  scamTips: 'स्कैम से बचाव के टिप्स',
  urgencyTitle: 'तत्काल कार्रवाई से सावधान रहें',
  urgencyDesc: 'स्कैमर्स अक्सर झूठी तत्कालता बनाते हैं ताकि आप बिना सोचे-समझे तुरंत कार्रवाई करें।',
  personalInfoTitle: 'व्यक्तिगत जानकारी की रक्षा करें',
  personalInfoDesc: 'कभी भी टेक्स्ट मैसेज के माध्यम से बैंक विवरण, पासवर्ड, OTP, या व्यक्तिगत जानकारी साझा न करें।',
  strangeLinksTitle: 'लिंक पर क्लिक करने से बचें',
  strangeLinksDesc: 'अज्ञात भेजने वालों से संदिग्ध लिंक पर क्लिक न करें, विशेष रूप से छोटे किए गए URL पर।',
  prizesTitle: 'अविश्वसनीय ऑफर',
  prizesDesc: 'अप्रत्याशित पुरस्कार, लॉटरी, या ऑफर जो सच होने के लिए बहुत अच्छे लगते हैं, वे आमतौर पर धोखा होते हैं।',
  recentActivity: 'हाल की गतिविधि',
  viewHistory: 'स्कैन इतिहास देखें',
  
  // Scan screen
  scanMessage: 'मैसेज स्कैन करें',
  pasteMessageLabel: 'स्कैन करने के लिए मैसेज पेस्ट करें:',
  messageInputPlaceholder: 'मैसेज यहां पेस्ट करें या टाइप करें...',
  scanButton: 'अभी स्कैन करें',
  clearButton: 'साफ़ करें',
  scanResultTitle: 'मैसेज विश्लेषण',
  explanationTitle: 'इसका क्या मतलब है',
  scamIndicatorsTitle: 'पता चले संकेतक',
  readAloud: 'पढ़कर सुनाएं',
  stopReading: 'पढ़ना बंद करें',
  
  // History screen
  scannedMessages: 'स्कैन किए गए मैसेज',
  clearAll: 'सभी साफ़ करें',
  noHistoryTitle: 'कोई स्कैन इतिहास नहीं',
  noHistoryDesc: 'आप जो मैसेज स्कैन करेंगे वे यहां दिखाई देंगे ताकि आप उन्हें बाद में समीक्षा कर सकें।',
  startScanning: 'स्कैनिंग शुरू करें',
  scamHistory: 'स्कैन इतिहास',
  
  // Settings
  displaySettings: 'डिस्प्ले सेटिंग्स',
  darkMode: 'डार्क मोड',
  language: 'भाषा',
  change: 'बदलें',
  selectLanguage: 'भाषा चुनें',
  notificationSettings: 'नोटिफिकेशन सेटिंग्स',
  notificationsEnabled: 'नोटिफिकेशन सक्षम करें',
  audioAlerts: 'ऑडियो अलर्ट',
  about: 'जानकारी',
  privacyPolicy: 'गोपनीयता नीति',
  version: 'वर्शन',
  appearance: 'दिखावट',
  theme: 'थीम',
  dark: 'डार्क',
  light: 'लाइट',
  
  // Alert levels
  high: 'उच्च जोखिम',
  medium: 'सावधानी',
  low: 'सुरक्षित',
  
  // Alert banners
  safeBannerTitle: 'मैसेज सुरक्षित प्रतीत होता है',
  safeBannerDesc: 'कोई स्कैम संकेतक नहीं मिला, लेकिन हमेशा सतर्क रहें।',
  warningBannerTitle: 'संभावित स्कैम का पता चला',
  warningBannerDesc: 'इस मैसेज में कुछ संदिग्ध तत्व हैं। सावधान रहें।',
  dangerBannerTitle: 'चेतावनी: संभावित स्कैम!',
  dangerBannerDesc: 'कई स्कैम संकेतक मिले हैं। जवाब न दें और किसी भी लिंक पर क्लिक न करें।',
  
  // Scam detection messages
  scamDetection: {
    low: {
      title: 'संदेश सुरक्षित प्रतीत होता है',
      description: 'यह संदेश सुरक्षित प्रतीत होता है। कोई सामान्य घोटाला संकेतक नहीं पाए गए।',
    },
    medium: {
      title: 'संभावित घोटाला पाया गया',
      description: 'इस संदेश में कुछ संभावित घोटाला संकेतक हैं। किसी भी लिंक पर क्लिक करने या जवाब देने से पहले सावधान रहें।',
    },
    high: {
      title: 'चेतावनी: संभावित घोटाला!',
      description: 'इस संदेश में कई घोटाला संकेतक हैं और यह आपकी जानकारी या पैसे चुराने का प्रयास कर सकता है। किसी भी लिंक पर क्लिक न करें या जवाब न दें।',
    },
    indicators: {
      bankingInfo: 'बैंकिंग विवरण या सुरक्षा कोड की मांग',
      kycUpdate: 'नकली KYC या खाता सत्यापन अनुरोध',
      prizes: 'नकली लॉटरी या पुरस्कार सूचनाएं',
      governmentImpersonation: 'सरकारी एजेंसी की नकल',
      jobOffers: 'संदिग्ध नौकरी प्रस्ताव या आय योजनाएं',
      investment: 'उच्च रिटर्न का वादा करने वाली संदिग्ध निवेश योजनाएं',
      techSupport: 'नकली तकनीकी सहायता या सुरक्षा चेतावनियां',
      personalInfo: 'व्यक्तिगत पहचान विवरण की मांग',
      suspiciousUrls: 'संदिग्ध या छोटे URL शामिल हैं',
      urgency: 'झूठी तात्कालिकता पैदा करता है',
      noIndicators: 'कोई विशिष्ट घोटाला संकेतक नहीं पाए गए',
    }
  },
};