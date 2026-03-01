/**
 * dialogFlows.js — All conversation state machine flows for eSaarthi
 * Each flow has: id, department, service, keywords (for NLU), steps[]
 * Each step: prompt (hi/en), type (speak|input|confirm|navigate|done), collectAs
 */

export const DEPARTMENTS = {
  GAS: 'gas',
  ELECTRICITY: 'electricity',
  MUNICIPAL: 'municipal',
};

export const dialogFlows = {
  // ─────────────── GAS ───────────────
  pay_gas_bill: {
    id: 'pay_gas_bill',
    department: DEPARTMENTS.GAS,
    icon: '⛽',
    keywords: {
      hi: ['गैस', 'बिल', 'भरना', 'जमा', 'पेमेंट', 'गैस का बिल'],
      en: ['gas bill', 'pay gas', 'gas payment'],
    },
    title: { hi: 'गैस बिल भुगतान', en: 'Pay Gas Bill' },
    steps: [
      {
        id: 'consumer_number',
        prompt: {
          hi: 'कृपया अपना 10 अंकों का Consumer Number बोलें या स्क्रीन पर टाइप करें।',
          en: 'Please say or type your 10-digit Consumer Number.',
        },
        type: 'input',
        collectAs: 'consumerNumber',
        inputLabel: { hi: 'Consumer Number', en: 'Consumer Number' },
      },
      {
        id: 'confirm_bill',
        prompt: {
          hi: 'आपका बकाया बिल ₹_AMOUNT_ है — बिलिंग माह _MONTH_। क्या आप अभी भुगतान करना चाहते हैं?',
          en: 'Your outstanding bill is ₹_AMOUNT_ for _MONTH_. Would you like to pay now?',
        },
        type: 'confirm',
        collectAs: 'paymentConfirmed',
      },
      {
        id: 'payment',
        prompt: {
          hi: 'भुगतान पृष्ठ खुल रहा है। UPI, Card या Cash — कोई भी विकल्प चुनें।',
          en: 'Opening payment page. Choose UPI, Card or Cash.',
        },
        type: 'navigate',
        navigateTo: 'payment_gateway',
      },
      {
        id: 'done',
        prompt: {
          hi: 'भुगतान सफल रहा! रसीद आपके पंजीकृत मोबाइल पर भेज दी गई। क्या और कोई सेवा चाहिए?',
          en: 'Payment successful! Receipt sent to your registered mobile. Anything else?',
        },
        type: 'done',
      },
    ],
  },

  new_gas_connection: {
    id: 'new_gas_connection',
    department: DEPARTMENTS.GAS,
    icon: '⛽',
    keywords: {
      hi: ['नया', 'गैस', 'कनेक्शन', 'नया गैस', 'गैस कनेक्शन', 'एलपीजी', 'पीएनजी', 'सीएनजी'],
      en: ['new gas', 'gas connection', 'lpg', 'png', 'cng', 'new connection gas'],
    },
    title: { hi: 'नया गैस कनेक्शन', en: 'New Gas Connection' },
    steps: [
      {
        id: 'connection_type',
        prompt: {
          hi: 'LPG, PNG या CNG — किस प्रकार का कनेक्शन चाहिए?',
          en: 'Which type of connection: LPG, PNG or CNG?',
        },
        type: 'choice',
        collectAs: 'connectionType',
        choices: { hi: ['LPG', 'PNG', 'CNG'], en: ['LPG', 'PNG', 'CNG'] },
      },
      {
        id: 'ujjwala_check',
        prompt: {
          hi: 'क्या आप Ujjwala Yojana 2.0 (BPL परिवार) के लिए आवेदन करना चाहते हैं?',
          en: 'Are you applying under Ujjwala Yojana 2.0 (BPL families)?',
        },
        type: 'confirm',
        collectAs: 'isUjjwala',
      },
      {
        id: 'aadhaar',
        prompt: {
          hi: 'कृपया अपना Aadhaar नंबर बोलें या टाइप करें।',
          en: 'Please say or type your Aadhaar number.',
        },
        type: 'input',
        collectAs: 'aadhaarNumber',
        inputLabel: { hi: 'Aadhaar नंबर', en: 'Aadhaar Number' },
      },
      {
        id: 'documents',
        prompt: {
          hi: 'आवश्यक दस्तावेज़: Aadhaar, Address Proof, Passport Photo। क्या ये आपके पास हैं?',
          en: 'Required documents: Aadhaar, Address Proof, Passport Photo. Do you have these?',
        },
        type: 'confirm',
        collectAs: 'documentsReady',
      },
      {
        id: 'submit',
        prompt: {
          hi: 'आवेदन फॉर्म खुल रहा है। कृपया स्क्रीन पर विवरण भरें।',
          en: 'Opening application form. Please fill in details on screen.',
        },
        type: 'navigate',
        navigateTo: 'gas_new_connection_form',
      },
      {
        id: 'done',
        prompt: {
          hi: 'आवेदन सफलतापूर्वक जमा! आपका Application Number है: GAS-2024-XXXXX। क्या और कोई सेवा चाहिए?',
          en: 'Application submitted! Your number: GAS-2024-XXXXX. Anything else?',
        },
        type: 'done',
      },
    ],
  },

  gas_complaint: {
    id: 'gas_complaint',
    department: DEPARTMENTS.GAS,
    icon: '⛽',
    keywords: {
      hi: ['शिकायत', 'गैस शिकायत', 'गैस लीकेज', 'सिलेंडर', 'होज़', 'समस्या'],
      en: ['gas complaint', 'gas leak', 'cylinder', 'hose', 'problem'],
    },
    title: { hi: 'गैस शिकायत', en: 'Gas Complaint' },
    steps: [
      {
        id: 'complaint_type',
        prompt: {
          hi: 'क्या समस्या है? गैस लीकेज, सिलेंडर नहीं मिला, या कुछ और?',
          en: 'What is the issue? Gas leakage, cylinder not delivered, or something else?',
        },
        type: 'input',
        collectAs: 'complaintDescription',
        inputLabel: { hi: 'समस्या विवरण', en: 'Issue Description' },
      },
      {
        id: 'contact',
        prompt: {
          hi: 'कृपया अपना मोबाइल नंबर बताएं।',
          en: 'Please provide your mobile number.',
        },
        type: 'input',
        collectAs: 'mobile',
        inputLabel: { hi: 'मोबाइल नंबर', en: 'Mobile Number' },
      },
      {
        id: 'done',
        prompt: {
          hi: 'शिकायत दर्ज हो गई! Ticket Number: GAS-C-78321। 24 घंटे में संपर्क किया जाएगा।',
          en: 'Complaint registered! Ticket: GAS-C-78321. You will be contacted within 24 hours.',
        },
        type: 'done',
      },
    ],
  },

  // ─────────────── ELECTRICITY ───────────────
  pay_electricity_bill: {
    id: 'pay_electricity_bill',
    department: DEPARTMENTS.ELECTRICITY,
    icon: '⚡',
    keywords: {
      hi: ['बिजली', 'बिल', 'लाइट', 'इलेक्ट्रिसिटी', 'बिजली का बिल', 'बिल भरना'],
      en: ['electricity bill', 'electric bill', 'light bill', 'pay electricity', 'bijli'],
    },
    title: { hi: 'बिजली बिल भुगतान', en: 'Pay Electricity Bill' },
    steps: [
      {
        id: 'consumer_number',
        prompt: {
          hi: 'अपना Consumer Number बोलें या स्क्रीन पर टाइप करें।',
          en: 'Say or type your Consumer Number.',
        },
        type: 'input',
        collectAs: 'consumerNumber',
        inputLabel: { hi: 'Consumer Number', en: 'Consumer Number' },
      },
      {
        id: 'confirm_bill',
        prompt: {
          hi: 'आपका बकाया बिल ₹_AMOUNT_ है। क्या भुगतान करना है?',
          en: 'Your outstanding bill is ₹_AMOUNT_. Shall I proceed to payment?',
        },
        type: 'confirm',
        collectAs: 'paymentConfirmed',
      },
      {
        id: 'payment',
        prompt: {
          hi: 'भुगतान पृष्ठ खुल रहा है।',
          en: 'Opening payment page.',
        },
        type: 'navigate',
        navigateTo: 'payment_gateway',
      },
      {
        id: 'done',
        prompt: {
          hi: 'भुगतान सफल! रसीद आपके मोबाइल पर भेज दी। क्या और कोई सेवा चाहिए?',
          en: 'Payment successful! Receipt sent to mobile. Anything else?',
        },
        type: 'done',
      },
    ],
  },

  new_electricity_connection: {
    id: 'new_electricity_connection',
    department: DEPARTMENTS.ELECTRICITY,
    icon: '⚡',
    keywords: {
      hi: ['नया', 'बिजली', 'कनेक्शन', 'नया बिजली', 'नई कनेक्शन', 'बिजली कनेक्शन'],
      en: ['new electricity', 'electricity connection', 'new power', 'new electric connection'],
    },
    title: { hi: 'नया बिजली कनेक्शन', en: 'New Electricity Connection' },
    steps: [
      {
        id: 'load',
        prompt: {
          hi: 'कितना load चाहिए? जैसे 1kW, 3kW, 5kW।',
          en: 'What load do you need? e.g. 1kW, 3kW, 5kW.',
        },
        type: 'input',
        collectAs: 'load',
        inputLabel: { hi: 'Load (kW)', en: 'Load (kW)' },
      },
      {
        id: 'aadhaar',
        prompt: {
          hi: 'अपना Aadhaar नंबर बोलें।',
          en: 'Say your Aadhaar number.',
        },
        type: 'input',
        collectAs: 'aadhaarNumber',
        inputLabel: { hi: 'Aadhaar नंबर', en: 'Aadhaar Number' },
      },
      {
        id: 'address',
        prompt: {
          hi: 'कनेक्शन का पता बताएं।',
          en: 'Provide the address for the connection.',
        },
        type: 'input',
        collectAs: 'address',
        inputLabel: { hi: 'पता', en: 'Address' },
      },
      {
        id: 'submit',
        prompt: {
          hi: 'आवेदन फॉर्म खुल रहा है।',
          en: 'Opening application form.',
        },
        type: 'navigate',
        navigateTo: 'electricity_new_connection_form',
      },
      {
        id: 'done',
        prompt: {
          hi: 'आवेदन जमा! Application Number: ELEC-2024-XXXXX। क्या और सेवा चाहिए?',
          en: 'Application submitted! Number: ELEC-2024-XXXXX. Anything else?',
        },
        type: 'done',
      },
    ],
  },

  electricity_complaint: {
    id: 'electricity_complaint',
    department: DEPARTMENTS.ELECTRICITY,
    icon: '⚡',
    keywords: {
      hi: ['बिजली शिकायत', 'लाइट गुल', 'करंट नहीं', 'फाल्ट', 'बिजली नहीं'],
      en: ['power cut', 'no electricity', 'electricity complaint', 'outage', 'no power'],
    },
    title: { hi: 'बिजली शिकायत', en: 'Electricity Complaint' },
    steps: [
      {
        id: 'issue',
        prompt: {
          hi: 'क्या समस्या है? बिजली नहीं है, fluctuation, या कुछ और?',
          en: 'What is the issue? No power, fluctuation, or something else?',
        },
        type: 'input',
        collectAs: 'complaintDescription',
        inputLabel: { hi: 'समस्या', en: 'Issue' },
      },
      {
        id: 'mobile',
        prompt: {
          hi: 'अपना मोबाइल नंबर बताएं।',
          en: 'Your mobile number please.',
        },
        type: 'input',
        collectAs: 'mobile',
        inputLabel: { hi: 'मोबाइल', en: 'Mobile' },
      },
      {
        id: 'done',
        prompt: {
          hi: 'शिकायत दर्ज! Ticket: ELEC-C-45621। 4 घंटे में समाधान किया जाएगा।',
          en: 'Complaint registered! Ticket: ELEC-C-45621. Will be resolved in 4 hours.',
        },
        type: 'done',
      },
    ],
  },

  track_status: {
    id: 'track_status',
    department: null,
    icon: '🔍',
    keywords: {
      hi: ['स्थिति', 'आवेदन', 'ट्रैक', 'status', 'कहाँ तक', 'अपडेट', 'आवेदन की स्थिति'],
      en: ['track', 'status', 'application status', 'check status', 'where is my'],
    },
    title: { hi: 'आवेदन स्थिति', en: 'Track Application' },
    steps: [
      {
        id: 'app_number',
        prompt: {
          hi: 'अपना Application Number बोलें।',
          en: 'Say your Application Number.',
        },
        type: 'input',
        collectAs: 'applicationNumber',
        inputLabel: { hi: 'Application Number', en: 'Application Number' },
      },
      {
        id: 'done',
        prompt: {
          hi: 'आपका आवेदन _STATUS_ है। अनुमानित समाधान: _DATE_। कोई और सेवा?',
          en: 'Your application is _STATUS_. Expected resolution: _DATE_. Anything else?',
        },
        type: 'done',
      },
    ],
  },

  // ─────────────── MUNICIPAL ───────────────
  pay_water_bill: {
    id: 'pay_water_bill',
    department: DEPARTMENTS.MUNICIPAL,
    icon: '💧',
    keywords: {
      hi: ['पानी', 'पानी का बिल', 'जल', 'वाटर बिल', 'पानी भरना'],
      en: ['water bill', 'pay water', 'water payment'],
    },
    title: { hi: 'पानी बिल भुगतान', en: 'Pay Water Bill' },
    steps: [
      {
        id: 'consumer_number',
        prompt: {
          hi: 'अपना Water Consumer Number बोलें।',
          en: 'Say your Water Consumer Number.',
        },
        type: 'input',
        collectAs: 'consumerNumber',
        inputLabel: { hi: 'Consumer Number', en: 'Consumer Number' },
      },
      {
        id: 'confirm',
        prompt: {
          hi: 'बकाया ₹_AMOUNT_ है। भुगतान करें?',
          en: 'Due amount ₹_AMOUNT_. Proceed to payment?',
        },
        type: 'confirm',
        collectAs: 'paymentConfirmed',
      },
      {
        id: 'done',
        prompt: {
          hi: 'भुगतान सफल! रसीद मोबाइल पर भेजी। क्या और कोई सेवा चाहिए?',
          en: 'Payment done! Receipt sent. Anything else?',
        },
        type: 'done',
      },
    ],
  },

  water_complaint: {
    id: 'water_complaint',
    department: DEPARTMENTS.MUNICIPAL,
    icon: '💧',
    keywords: {
      hi: ['पानी शिकायत', 'पानी नहीं', 'पानी की समस्या', 'नल', 'लीकेज'],
      en: ['water complaint', 'no water', 'water problem', 'pipe leak', 'leakage'],
    },
    title: { hi: 'पानी शिकायत', en: 'Water Complaint' },
    steps: [
      {
        id: 'issue',
        prompt: {
          hi: 'पानी की क्या समस्या है?',
          en: 'What is the water issue?',
        },
        type: 'input',
        collectAs: 'complaintDescription',
        inputLabel: { hi: 'समस्या', en: 'Issue' },
      },
      {
        id: 'mobile',
        prompt: {
          hi: 'मोबाइल नंबर बताएं।',
          en: 'Your mobile number.',
        },
        type: 'input',
        collectAs: 'mobile',
        inputLabel: { hi: 'मोबाइल', en: 'Mobile' },
      },
      {
        id: 'done',
        prompt: {
          hi: 'शिकायत दर्ज! Ticket: MUN-W-12943। कल सुबह तक समाधान होगा।',
          en: 'Complaint registered! Ticket: MUN-W-12943. Will be resolved by tomorrow.',
        },
        type: 'done',
      },
    ],
  },

  sanitation_complaint: {
    id: 'sanitation_complaint',
    department: DEPARTMENTS.MUNICIPAL,
    icon: '🗑️',
    keywords: {
      hi: ['कचरा', 'सफाई', 'कूड़ा', 'गंदगी', 'सफाई शिकायत'],
      en: ['garbage', 'waste', 'sanitation', 'cleaning complaint', 'trash'],
    },
    title: { hi: 'सफाई शिकायत', en: 'Sanitation Complaint' },
    steps: [
      {
        id: 'area',
        prompt: {
          hi: 'किस क्षेत्र में सफाई की समस्या है? मोहल्ला या इलाका बताएं।',
          en: 'Which area has the sanitation issue?',
        },
        type: 'input',
        collectAs: 'area',
        inputLabel: { hi: 'इलाका', en: 'Area' },
      },
      {
        id: 'done',
        prompt: {
          hi: 'शिकायत दर्ज! Ticket: MUN-S-33217। 48 घंटे में कार्रवाई होगी।',
          en: 'Complaint registered! Ticket: MUN-S-33217. Action within 48 hours.',
        },
        type: 'done',
      },
    ],
  },
};

// Department metadata for the home screen
export const departments = [
  {
    id: DEPARTMENTS.GAS,
    icon: '⛽',
    name: { hi: 'गैस विभाग', en: 'Gas Department' },
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    services: [
      { flowId: 'pay_gas_bill', label: { hi: 'बिल भुगतान', en: 'Pay Bill' } },
      { flowId: 'new_gas_connection', label: { hi: 'नया कनेक्शन', en: 'New Connection' } },
      { flowId: 'gas_complaint', label: { hi: 'शिकायत', en: 'Complaint' } },
      { flowId: 'track_status', label: { hi: 'आवेदन स्थिति', en: 'Track Status' } },
    ],
  },
  {
    id: DEPARTMENTS.ELECTRICITY,
    icon: '⚡',
    name: { hi: 'बिजली विभाग', en: 'Electricity' },
    color: '#eab308',
    gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    services: [
      { flowId: 'pay_electricity_bill', label: { hi: 'बिल भुगतान', en: 'Pay Bill' } },
      { flowId: 'new_electricity_connection', label: { hi: 'नया कनेक्शन', en: 'New Connection' } },
      { flowId: 'electricity_complaint', label: { hi: 'शिकायत', en: 'Complaint' } },
      { flowId: 'track_status', label: { hi: 'आवेदन स्थिति', en: 'Track Status' } },
    ],
  },
  {
    id: DEPARTMENTS.MUNICIPAL,
    icon: '🏙️',
    name: { hi: 'नगर पालिका', en: 'Municipal' },
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    services: [
      { flowId: 'pay_water_bill', label: { hi: 'पानी बिल', en: 'Water Bill' } },
      { flowId: 'water_complaint', label: { hi: 'पानी शिकायत', en: 'Water Complaint' } },
      { flowId: 'sanitation_complaint', label: { hi: 'सफाई शिकायत', en: 'Sanitation' } },
      { flowId: 'track_status', label: { hi: 'आवेदन स्थिति', en: 'Track Status' } },
    ],
  },
];
