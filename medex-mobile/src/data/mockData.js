export const SAMPLE_REPORTS = [
  {
    id: 'cbc-sample',
    title: 'Complete Blood Count (CBC) Panel',
    date: '2026-10-28',
    patient: 'John Doe, 42M',
    summary_en: 'Your Complete Blood Count shows mild iron-deficiency anemia indicated by reduced Hemoglobin and low Hematocrit. Your White Blood Cell count is slightly elevated, suggesting your immune system is responding to a minor infection or inflammation.',
    summary_ta: 'உங்கள் இரத்த பரிசோதனை அறிக்கை (CBC) இரும்புச்சத்து குறைபாடு இரத்த சோகையைக் காட்டுகிறது. ஹீமோகுளோபின் சற்று குறைவாக உள்ளது. மேலும் வெள்ளை இரத்த அணுக்கள் சற்று அதிகமாக உள்ளதால் உடலில் லேசான தொற்று அல்லது அழற்சி இருப்பதைக் குறிக்கிறது.',
    urgency: 'MODERATE',
    urgency_ta: 'மிதமான கவனம் தேவை',
    urgency_reason: 'Mild anemia and elevated WBC require clinical review and dietary iron supplementation.',
    metrics: [
      {
        name: 'Hemoglobin (Hb)',
        value: '10.8',
        unit: 'g/dL',
        range: '13.8 - 17.2 g/dL',
        status: 'LOW',
        explanation_en: 'Carries oxygen through your blood to your organs. A low value indicates mild anemia, causing tiredness or shortness of breath.',
        explanation_ta: 'உடலில் ஆக்ஸிஜனை கொண்டு செல்லும் புரதம். இது குறைவாக இருப்பது இரத்த சோகையைக் குறிக்கிறது; இதனால் சோர்வு ஏற்படலாம்.'
      },
      {
        name: 'White Blood Cell (WBC)',
        value: '11,400',
        unit: '/mcL',
        range: '4,500 - 11,000 /mcL',
        status: 'HIGH',
        explanation_en: 'Cells that fight infection. A slight elevation indicates the immune system is actively fighting inflammation or bacterial/viral stress.',
        explanation_ta: 'தொற்றை எதிர்க்கும் இரத்த வெள்ளை அணுக்கள். இது சற்று அதிகமாக இருப்பது உடலில் எதிர்ப்பு சக்தி செயல்படுவதைக் காட்டுகிறது.'
      },
      {
        name: 'Platelet Count',
        value: '240,000',
        unit: '/mcL',
        range: '150,000 - 450,000 /mcL',
        status: 'NORMAL',
        explanation_en: 'Responsible for blood clotting to stop bleeding. Your count is optimal.',
        explanation_ta: 'இரத்தம் உறைவதற்கு உதவும் தட்டணுக்கள். இது ஆரோக்கியமான அளவில் உள்ளது.'
      },
      {
        name: 'Hematocrit (PCV)',
        value: '33.2',
        unit: '%',
        range: '40.7 - 50.3 %',
        status: 'LOW',
        explanation_en: 'Percentage of whole blood made up of red cells. Follows the low hemoglobin trend.',
        explanation_ta: 'இரத்தத்தில் உள்ள சிவப்பு அணுக்களின் சதவீதம். இது குறைவாக உள்ளது.'
      },
      {
        name: 'Mean Corpuscular Volume (MCV)',
        value: '76',
        unit: 'fL',
        range: '80 - 100 fL',
        status: 'LOW',
        explanation_en: 'Average size of red blood cells. Small cells often point to iron deficiency (microcytic anemia).',
        explanation_ta: 'சிவப்பு இரத்த அணுக்களின் சராசரி அளவு. சிறிய செல்கள் இரும்புச்சத்து குறைபாட்டைக் குறிக்கின்றன.'
      }
    ],
    abnormal_findings: [
      {
        finding_en: 'Mild Microcytic Anemia (Low Hemoglobin 10.8 g/dL, Low MCV 76 fL)',
        finding_ta: 'லேசான இரும்புச்சத்து குறைபாடு இரத்த சோகை (குறைந்த ஹீமோகுளோபின் மற்றும் MCV)'
      },
      {
        finding_en: 'Mild Leukocytosis (WBC 11,400 /mcL)',
        finding_ta: 'லேசான வெள்ளை அணுக்கள் அதிகரிப்பு (WBC 11,400)'
      }
    ],
    terms: [
      {
        term: 'Anemia',
        tamil_term: 'இரத்த சோகை',
        transliteration: 'Raththa Sogai',
        definition_en: 'A condition where the body does not have enough healthy red blood cells or hemoglobin to carry sufficient oxygen to tissues.',
        definition_ta: 'உடலில் இரத்த சிவப்பணுக்கள் அல்லது ஹீமோகுளோபின் அளவு குறைந்து சோர்வை ஏற்படுத்தும் நிலை.'
      },
      {
        term: 'Leukocytosis',
        tamil_term: 'வெள்ளை அணுக்கள் அதிகரிப்பு',
        transliteration: 'Vellai Anukkal Athigarippu',
        definition_en: 'An increase in the total white blood cell count in blood, usually responding to infection or physical stress.',
        definition_ta: 'உடலில் தொற்று அல்லது அழற்சியை எதிர்க்க வெள்ளை அணுக்களின் எண்ணிக்கை அதிகரித்தல்.'
      }
    ],
    significance_en: 'These findings point towards nutritional iron deficiency alongside a mild immune response. This is commonly manageable with dietary adjustments, iron therapy, and doctor consultation.',
    significance_ta: 'இந்த முடிவுகள் இரும்புச்சத்து குறைபாட்டையும், உடலில் லேசான நோய் எதிர்ப்பு வினையையும் காட்டுகின்றன. சத்தான உணவு மற்றும் மருத்துவரின் ஆலோசனையுடன் எளிதில் சரிசெய்யலாம்.',
    recommendations_en: [
      'Increase iron-rich foods: spinach, beetroot, pomegranate, dates, lentils, and lean meats.',
      'Pair iron foods with Vitamin C (lemon, oranges) to enhance absorption.',
      'Consult your physician regarding possible iron supplementation.',
      'Retest Complete Blood Count in 4 to 6 weeks to monitor improvement.'
    ],
    recommendations_ta: [
      'இரும்புச்சத்து நிறைந்த உணவுகளை உண்ணுங்கள்: கீரை, பீட்ரூட், மாதுளை, பேரீச்சம்பழம், பருப்பு வகைகள்.',
      'வைட்டமின் சி உள்ள பழங்களுடன் (எலுமிச்சை, ஆரஞ்சு) சாப்பிடுவது இரும்புச்சத்தை உடல் எளிதில் உறிஞ்ச உதவும்.',
      'இரும்புச்சத்து மாத்திரைகள் குறித்து மருத்துவரிடம் ஆலோசனை பெறுங்கள்.',
      '4-6 வாரங்களுக்குப் பிறகு மீண்டும் இரத்த பரிசோதனை செய்து முன்னேற்றத்தை சோதிக்கவும்.'
    ],
    doctor_questions_en: [
      'Should I start taking iron supplements or check my serum ferritin levels?',
      'Could my low hemoglobin be related to recent dietary habits or fatigue?',
      'Do we need to repeat the CBC test after 1 month?'
    ],
    doctor_questions_ta: [
      'நான் இரும்புச்சத்து மாத்திரைகள் எடுத்துக்கொள்ள வேண்டுமா?',
      'எனது சோர்வுக்கும் இந்த ஹீமோகுளோபின் குறைவுக்கும் தொடர்பு உள்ளதா?',
      'ஒரு மாதத்திற்குப் பிறகு மீண்டும் இரத்த பரிசோதனை செய்ய வேண்டுமா?'
    ]
  },
  {
    id: 'lipid-sample',
    title: 'Lipid (Cholesterol) Profile',
    date: '2026-10-27',
    patient: 'Sarah Williams, 50F',
    summary_en: 'Your Lipid Profile reveals elevated LDL ("bad") cholesterol and high Triglycerides, with low HDL ("good") cholesterol. This lipid imbalance increases cardiovascular strain if left unmanaged.',
    summary_ta: 'உங்கள் கொழுப்பு பரிசோதனை அறிக்கை கெட்ட கொழுப்பு (LDL) மற்றும் ட்ரைகிளிசரைடு அளவு அதிகமாக உள்ளதையும், நல்ல கொழுப்பு (HDL) குறைவாக உள்ளதையும் காட்டுகிறது. இதய ஆரோக்கியத்தை பாதுகாக்க வாழ்க்கைமுறை மாற்றங்கள் அவசியம்.',
    urgency: 'ATTENTION_NEEDED',
    urgency_ta: 'கவனம் தேவை',
    urgency_reason: 'Elevated LDL and Triglycerides warrant dietary intervention and cardiovascular risk assessment.',
    metrics: [
      {
        name: 'Total Cholesterol',
        value: '235',
        unit: 'mg/dL',
        range: '< 200 mg/dL',
        status: 'HIGH',
        explanation_en: 'Total amount of cholesterol in your blood. Borderline high.',
        explanation_ta: 'இரத்தத்தில் உள்ள மொத்த கொழுப்பின் அளவு. இது சற்று அதிகமாக உள்ளது.'
      },
      {
        name: 'LDL Cholesterol (Bad)',
        value: '154',
        unit: 'mg/dL',
        range: '< 100 mg/dL',
        status: 'HIGH',
        explanation_en: 'Can build up on the walls of your arteries and increase heart risk. Needs reduction.',
        explanation_ta: 'இரத்தக் குழாய்களில் படியும் கெட்ட கொழுப்பு. இது இதய பாதிப்பு அபாயத்தை அதிகரிக்கும்; குறைக்க வேண்டும்.'
      },
      {
        name: 'HDL Cholesterol (Good)',
        value: '38',
        unit: 'mg/dL',
        range: '> 50 mg/dL',
        status: 'LOW',
        explanation_en: 'Picks up excess cholesterol in your blood and takes it back to your liver. Higher is protective.',
        explanation_ta: 'இதயத்தை பாதுகாக்கும் நல்ல கொழுப்பு. இது 50-க்கு மேல் இருக்க வேண்டும், ஆனால் தற்போது குறைவாக உள்ளது.'
      },
      {
        name: 'Triglycerides',
        value: '210',
        unit: 'mg/dL',
        range: '< 150 mg/dL',
        status: 'HIGH',
        explanation_en: 'Fat molecules stored from excess calories, refined carbs, or sugars.',
        explanation_ta: 'உணவில் உள்ள அதிகப்படியான கலோரிகள் மற்றும் எண்ணெயால் உருவாகும் கொழுப்பு. இது அதிகமாக உள்ளது.'
      }
    ],
    abnormal_findings: [
      {
        finding_en: 'Hyperlipidemia: LDL 154 mg/dL (Target < 100 mg/dL)',
        finding_ta: 'அதிகப்படியான கெட்ட கொழுப்பு (LDL 154)'
      },
      {
        finding_en: 'Sub-optimal HDL 38 mg/dL (Protective target > 50 mg/dL)',
        finding_ta: 'குறைவான நல்ல கொழுப்பு (HDL 38)'
      }
    ],
    terms: [
      {
        term: 'Hyperlipidemia',
        tamil_term: 'அதி கொழுப்புக் குருதி',
        transliteration: 'Athik Koluppu Kuruthi',
        definition_en: 'High levels of lipids/fats like cholesterol and triglycerides in the blood.',
        definition_ta: 'இரத்தத்தில் கொழுப்பு மற்றும் ட்ரைகிளிசரைடு அளவு அதிகமாக உள்ள நிலை.'
      }
    ],
    significance_en: 'Combined dyslipidemia indicates elevated long-term cardiovascular risk. Early lifestyle changes provide great protective benefit.',
    significance_ta: 'கொழுப்பின் அளவுகளில் ஏற்படும் இந்த ஏற்றத்தாழ்வு இதய நலனில் கவனம் செலுத்த வேண்டியதன் அவசியத்தை உணர்த்துகிறது.',
    recommendations_en: [
      'Reduce fried foods, trans fats, refined sugars, and processed baked goods.',
      'Engage in 30 minutes of brisk walking or moderate cardio 5 days a week to boost HDL.',
      'Incorporate omega-3 fatty acids: flaxseeds, walnuts, and fatty fish.',
      'Discuss statin therapy or dietary counseling with your doctor.'
    ],
    recommendations_ta: [
      'வறுத்த உணவுகள், அதிக எண்ணெய், இனிப்புகள் மற்றும் துரித உணவுகளைத் தவிர்க்கவும்.',
      'நல்ல கொழுப்பை அதிகரிக்க தினமும் 30 நிமிடங்கள் நடைபயிற்சி மேற்கொள்ளவும்.',
      'ஆளி விதை, வால்நட் போன்ற ஒமேகா-3 நிறைந்த உணவுகளைச் சேர்த்துக் கொள்ளவும்.',
      'மருத்துவரை அணுகி கொழுப்பைக் குறைக்கும் சிகிச்சை குறித்து பரிசீலிக்கவும்.'
    ],
    doctor_questions_en: [
      'Do I need statin or cholesterol-lowering medication?',
      'What specific dietary plan do you recommend for lowering LDL and triglycerides?',
      'When should we re-evaluate my lipid profile?'
    ],
    doctor_questions_ta: [
      'கொழுப்பைக் குறைக்க எனக்கு மாத்திரைகள் தேவையா?',
      'எனது உணவு முறையில் என்னென்ன மாற்றங்கள் செய்ய வேண்டும்?',
      'எப்போது மீண்டும் கொழுப்பு பரிசோதனை செய்ய வேண்டும்?'
    ]
  }
];

export const SAMPLE_PRESCRIPTIONS = [
  {
    id: 'rx-sample-1',
    doctorName: 'Dr. K. Rajesh, M.D.',
    clinicOrHospital: 'City Health Clinic, Chennai',
    prescriptionDate: '2026-10-28',
    patientName: 'Arun Kumar (38M)',
    totalMedicines: 3,
    medicines: [
      {
        id: 'med-1',
        name: 'Amoxicillin 500mg',
        dosage: '1 capsule',
        frequencyNotation: '1-0-1',
        timings: { breakfast: true, lunch: false, dinner: true },
        foodTiming: 'after_food',
        durationDays: 5,
        specialInstructions: 'Complete the full 5-day antibiotic course even if you feel better.'
      },
      {
        id: 'med-2',
        name: 'Pantoprazole 40mg',
        dosage: '1 tablet',
        frequencyNotation: '1-0-0',
        timings: { breakfast: true, lunch: false, dinner: false },
        foodTiming: 'before_food',
        durationDays: 5,
        specialInstructions: 'Take early morning on an empty stomach with a glass of water.'
      },
      {
        id: 'med-3',
        name: 'Paracetamol 650mg (Dolo)',
        dosage: '1 tablet',
        frequencyNotation: '1-1-1 (SOS)',
        timings: { breakfast: true, lunch: true, dinner: true },
        foodTiming: 'after_food',
        durationDays: 3,
        specialInstructions: 'Take only if fever or headache exceeds 100°F.'
      }
    ],
    doctorCheckup: {
      mentioned: true,
      followUpInDays: 5,
      suggestedDate: '2026-11-02',
      instructions: 'Review after 5 days with completed fever chart.'
    }
  }
];

export const MEDICAL_TERMS = [
  {
    id: 1,
    english_term: 'Hypertension',
    tamil_term: 'உயர் இரத்த அழுத்தம்',
    tamil_transliteration: 'Uyar Raththa Azhutham',
    simple_english: 'Consistently high pressure in blood vessels, often called high blood pressure.',
    simple_tamil: 'இரத்தக் குழாய்களில் அழுத்தம் தொடர்ந்து அதிகமாக இருக்கும் நிலை.',
    medical_definition: 'Persistent elevation of systemic arterial blood pressure (systolic >= 130 mmHg or diastolic >= 80 mmHg).',
    category: 'Cardiovascular'
  },
  {
    id: 2,
    english_term: 'Hyperglycemia',
    tamil_term: 'அதிக இரத்த சர்க்கரை',
    tamil_transliteration: 'Athiga Raththa Sarkkarai',
    simple_english: 'Higher than normal glucose (sugar) levels in the blood, common in diabetes.',
    simple_tamil: 'இரத்தத்தில் சர்க்கரை அளவு இயல்பை விட அதிகமாக இருக்கும் நிலை.',
    medical_definition: 'Excess of glucose in the bloodstream, typically fasting blood glucose > 125 mg/dL.',
    category: 'Endocrinology'
  },
  {
    id: 3,
    english_term: 'Anemia',
    tamil_term: 'இரத்த சோகை',
    tamil_transliteration: 'Raththa Sogai',
    simple_english: 'Not having enough healthy red blood cells or hemoglobin to carry oxygen.',
    simple_tamil: 'உடலில் இரத்த சிவப்பணுக்கள் அல்லது ஹீமோகுளோபின் குறைவு.',
    medical_definition: 'A decrease in the total amount of red blood cells (RBCs) or hemoglobin in the blood, lowering oxygen-carrying capacity.',
    category: 'Hematology'
  },
  {
    id: 4,
    english_term: 'Leukocytosis',
    tamil_term: 'வெள்ளை அணுக்கள் அதிகரிப்பு',
    tamil_transliteration: 'Vellai Anukkal Athigarippu',
    simple_english: 'Higher number of infection-fighting white blood cells in your blood.',
    simple_tamil: 'தொற்றை எதிர்க்கும் வெள்ளை அணுக்கள் இரத்தத்தில் அதிகரித்தல்.',
    medical_definition: 'An increase in the total circulating white blood cell count above normal reference range (> 11,000/mcL).',
    category: 'Hematology'
  },
  {
    id: 5,
    english_term: 'Thrombocytopenia',
    tamil_term: 'இரத்த தட்டணுக்கள் குறைவு',
    tamil_transliteration: 'Raththa Thattanukkal Kuraivu',
    simple_english: 'Low platelet count, which can make it harder for blood to clot during injuries.',
    simple_tamil: 'இரத்தம் உறைவதற்குத் தேவையான தட்டணுக்களின் அளவு குறைதல்.',
    medical_definition: 'Abnormally low number of platelets (thrombocytes) in the circulation (< 150,000/mcL).',
    category: 'Hematology'
  },
  {
    id: 6,
    english_term: 'Electrocardiogram (ECG)',
    tamil_term: 'இதய மின்னலை வரைபடம்',
    tamil_transliteration: 'Ithaya Minnalai Varaipadam',
    simple_english: 'A quick, painless test that records the electrical activity of your heartbeat.',
    simple_tamil: 'இதயத் துடிப்பின் மின்சார சமிக்ஞைகளை பதிவு செய்து இதய நலனை அறியும் பரிசோதனை.',
    medical_definition: 'Transthoracic interpretation of the electrical activity of the heart over time detected by electrodes.',
    category: 'Cardiology'
  },
  {
    id: 7,
    english_term: 'Biopsy',
    tamil_term: 'திசுப் பரிசோதனை',
    tamil_transliteration: 'Thisup Parisothanai',
    simple_english: 'Removing a tiny sample of tissue from your body to examine under a microscope.',
    simple_tamil: 'உடலின் ஒரு சிறிய திசுவை எடுத்து நுண்ணோக்கி மூலம் நோயை கண்டறியும் ஆய்வு.',
    medical_definition: 'Removal and microscopic examination of cells or tissue from the living body for diagnostic evaluation.',
    category: 'Pathology'
  },
  {
    id: 8,
    english_term: 'Tachycardia',
    tamil_term: 'விரைவான இதயத்துடிப்பு',
    tamil_transliteration: 'Viraivaana Ithayaththudippu',
    simple_english: 'Heart beating faster than 100 beats per minute at rest.',
    simple_tamil: 'ஓய்வு நிலையில் இதயம் இயல்பை விட மிக வேகமாக துடித்தல்.',
    medical_definition: 'Heart rate exceeding the normal resting rate, typically greater than 100 beats per minute in adults.',
    category: 'Cardiology'
  },
  {
    id: 9,
    english_term: 'Creatinine',
    tamil_term: 'கிரியாட்டினின் (சிறுநீரகக் கழிவு)',
    tamil_transliteration: 'Creatinine',
    simple_english: 'A waste chemical produced by muscles that healthy kidneys filter out through urine.',
    simple_tamil: 'தசைகளால் உருவாக்கப்பட்டு சிறுநீரகத்தால் வெளியேற்றப்படும் கழிவுப் பொருள்.',
    medical_definition: 'A breakdown product of creatine phosphate from muscle and protein metabolism, filtered by the glomeruli.',
    category: 'Nephrology'
  },
  {
    id: 10,
    english_term: 'Bilirubin',
    tamil_term: 'பிலிரூபின் (மஞ்சள் நிறமி)',
    tamil_transliteration: 'Bilirubin',
    simple_english: 'A yellowish substance made when old red blood cells break down; processed by the liver.',
    simple_tamil: 'பழைய இரத்த சிவப்பணுக்கள் அழியும் போது கல்லீரலால் கையாளப்படும் மஞ்சள் நிறமி.',
    medical_definition: 'Yellowish breakdown pigment of normal heme catabolism, excreted in bile and urine; elevated levels cause jaundice.',
    category: 'Hepatology'
  }
];

export const BODY_PARTS = [
  {
    id: 1,
    name_en: 'Heart',
    name_ta: 'இதயம்',
    body_system: 'Cardiovascular System',
    description_en: 'Muscular organ that pumps blood throughout the body via circulatory vessels, supplying oxygen and nutrients.',
    description_ta: 'உடல் முழுவதும் இரத்தத்தை செலுத்தி ஆக்ஸிஜன் மற்றும் ஊட்டச்சத்துக்களை வழங்கும் முக்கிய தசை உறுப்பு.'
  },
  {
    id: 2,
    name_en: 'Lungs',
    name_ta: 'நுரையீரல்',
    body_system: 'Respiratory System',
    description_en: 'Pair of spongy organs that take in oxygen from inhaled air and expel carbon dioxide waste from the body.',
    description_ta: 'சுவாசிக்கும் காற்றில் இருந்து ஆக்ஸிஜனை எடுத்து கார்பன் டை ஆக்சைடை வெளியேற்றும் சுவாச உறுப்பு.'
  },
  {
    id: 3,
    name_en: 'Liver',
    name_ta: 'கல்லீரல்',
    body_system: 'Digestive & Metabolic System',
    description_en: 'Large organ that detoxifies chemicals, metabolizes drugs, synthesizes proteins, and secretes digestive bile.',
    description_ta: 'உடலில் உள்ள நச்சுக்களை நீக்கி, செரிமானத்திற்கு பித்தநீரை சுரக்கும் மிகப்பெரிய உள் உறுப்பு.'
  },
  {
    id: 4,
    name_en: 'Kidneys',
    name_ta: 'சிறுநீரகங்கள்',
    body_system: 'Urinary System',
    description_en: 'Two bean-shaped organs that filter waste, excess fluid, and toxins from blood to form urine, balancing electrolytes.',
    description_ta: 'இரத்தத்தில் உள்ள கழிவுகளையும் அதிகப்படியான நீரையும் வடிகட்டி சிறுநீராக வெளியேற்றும் உறுப்புகள்.'
  },
  {
    id: 5,
    name_en: 'Brain',
    name_ta: 'மூளை',
    body_system: 'Nervous System',
    description_en: 'Central control center of the nervous system responsible for memory, thoughts, motor movements, and vital functions.',
    description_ta: 'நினைவாற்றல், சிந்தனை, உணர்வுகள் மற்றும் உடலின் அனைத்து இயக்கங்களையும் கட்டுப்படுத்தும் தலைமை உறுப்பு.'
  },
  {
    id: 6,
    name_en: 'Stomach',
    name_ta: 'வயிறு (இரைப்பை)',
    body_system: 'Digestive System',
    description_en: 'Muscular pouch that receives chewed food, secrets powerful gastric acids, and churns it for digestion.',
    description_ta: 'உணவை ஏற்று அமிலங்களை சுரந்து செரிமானத்திற்கு தயார் செய்யும் தசைப் பை.'
  },
  {
    id: 7,
    name_en: 'Pancreas',
    name_ta: 'கணையம்',
    body_system: 'Endocrine & Digestive System',
    description_en: 'Produces insulin and glucagon hormones to regulate blood glucose, and secretes digestive enzymes.',
    description_ta: 'இரத்த சர்க்கரை அளவை கட்டுப்படுத்தும் இன்சுலின் மற்றும் செரிமான நொதிகளை சுரக்கும் சுரப்பி.'
  },
  {
    id: 8,
    name_en: 'Thyroid Gland',
    name_ta: 'தைராய்டு சுரப்பி',
    body_system: 'Endocrine System',
    description_en: 'Butterfly-shaped endocrine gland at the base of your neck that controls metabolism, heart rate, and growth.',
    description_ta: 'கழுத்துப் பகுதியில் உள்ள பட்டாம்பூச்சி வடிவ சுரப்பி; உடலின் வளர்ச்சி மற்றும் வளர்சிதை மாற்றத்தை கட்டுப்படுத்துகிறது.'
  }
];

export const MEDICINES_DATABASE = [
  {
    id: 1,
    generic_name: 'Paracetamol',
    brand_names: ['Dolo 650', 'Calpol', 'Crocin'],
    name_ta: 'பாராசிட்டமால்',
    uses_en: 'Reduces mild-to-moderate fever, headache, body aches, and cold symptoms.',
    uses_ta: 'காய்ச்சல், தலைவலி, உடல் வலி மற்றும் சளி உபாதைகளைக் குறைக்கப் பயன்படுகிறது.',
    side_effects: 'Rare when taken as directed. High overdose can cause severe liver damage.',
    precautions: 'Do not exceed 4,000 mg per day. Avoid drinking alcohol while taking paracetamol.',
    dosing_information: [
      {
        population: 'Adults',
        indication: 'Fever or Pain',
        route: 'Oral',
        official_dosing_text: '500mg to 650mg every 4 to 6 hours as needed. Maximum 4g daily.'
      },
      {
        population: 'Pediatrics (Children)',
        indication: 'Fever',
        route: 'Oral suspension',
        official_dosing_text: '10 to 15 mg/kg per dose every 4 to 6 hours. Do not exceed 5 doses in 24 hours.'
      }
    ]
  },
  {
    id: 2,
    generic_name: 'Amoxicillin',
    brand_names: ['Augmentin (with clavulanate)', 'Novamox', 'Mox'],
    name_ta: 'அமாக்சிசிலின்',
    uses_en: 'Broad-spectrum penicillin-class antibiotic for ear, nose, throat, respiratory, and skin bacterial infections.',
    uses_ta: 'காது, மூக்கு, தொண்டை, நுரையீரல் மற்றும் தோல் பாக்டீரியா தொற்றுகளுக்கான நுண்ணுயிர் எதிர்ப்பு மருந்து.',
    side_effects: 'Nausea, mild diarrhea, upset stomach, temporary skin rash.',
    precautions: 'Must complete the entire prescribed duration. Inform doctor if allergic to penicillin.',
    dosing_information: [
      {
        population: 'Adults',
        indication: 'Bacterial Infection',
        route: 'Oral',
        official_dosing_text: '500mg three times daily (every 8 hours) or 875mg twice daily for 5-7 days.'
      }
    ]
  },
  {
    id: 3,
    generic_name: 'Pantoprazole',
    brand_names: ['Pantocid', 'Pan-40', 'Pantodac'],
    name_ta: 'பான்டோபிரசோல்',
    uses_en: 'Proton pump inhibitor (PPI) that reduces stomach acid for acidity, heartburn, gastritis, and GERD.',
    uses_ta: 'அசிடிட்டி, நெஞ்செரிச்சல், வாயுத்தொல்லை மற்றும் வயிற்றுப் புண்களை குணப்படுத்த அமிலம் சுரப்பதைக் குறைக்கிறது.',
    side_effects: 'Headache, flatulence, mild constipation or diarrhea.',
    precautions: 'Best taken 30 to 60 minutes before breakfast with a glass of water.',
    dosing_information: [
      {
        population: 'Adults',
        indication: 'Acidity / GERD / Gastric Protection',
        route: 'Oral',
        official_dosing_text: '40mg once daily in the morning before food for 2 to 4 weeks.'
      }
    ]
  },
  {
    id: 4,
    generic_name: 'Metformin',
    brand_names: ['Glycomet', 'Glucophage', 'Obimet'],
    name_ta: 'மெட்ஃபோர்மின்',
    uses_en: 'First-line medication for Type 2 diabetes to lower blood sugar and improve insulin sensitivity.',
    uses_ta: 'வகை 2 நீரிழிவு நோயாளிகளில் இரத்த சர்க்கரை அளவை கட்டுப்படுத்த பயன்படும் முதன்மை மருந்து.',
    side_effects: 'Abdominal bloating, mild diarrhea, metallic taste in mouth during first week.',
    precautions: 'Take with or immediately after meals to minimize stomach upset. Monitor kidney function regularly.',
    dosing_information: [
      {
        population: 'Adults',
        indication: 'Type 2 Diabetes Mellitus',
        route: 'Oral',
        official_dosing_text: 'Initial: 500mg once or twice daily with meals. May titrate up to 1000mg twice daily.'
      }
    ]
  },
  {
    id: 5,
    generic_name: 'Atorvastatin',
    brand_names: ['Atorva', 'Lipitor', 'Storvas'],
    name_ta: 'அடோர்வாஸ்டேடின்',
    uses_en: 'Lowers LDL bad cholesterol and triglycerides, helping prevent heart attacks and strokes.',
    uses_ta: 'கெட்ட கொழுப்பைக் குறைத்து, மாரடைப்பு மற்றும் பக்கவாதம் ஏற்படும் அபாயத்தைத் தடுக்கிறது.',
    side_effects: 'Mild muscle ache, joint discomfort, digestive changes.',
    precautions: 'Avoid excessive grapefruit juice. Report unexplained severe muscle pain or tenderness.',
    dosing_information: [
      {
        population: 'Adults',
        indication: 'Hypercholesterolemia / Cardiovascular Risk',
        route: 'Oral',
        official_dosing_text: '10mg to 20mg once daily at bedtime.'
      }
    ]
  },
  {
    id: 6,
    generic_name: 'Cetirizine',
    brand_names: ['Cetzine', 'Alerid', 'Zyrtec'],
    name_ta: 'செட்டிரிசின்',
    uses_en: 'Antihistamine for allergy symptoms: running nose, sneezing, itchy watery eyes, and skin hives.',
    uses_ta: 'ஒவ்வாமை, தும்மல், மூக்கில் நீர் வடிதல், கண்கள் அரிப்பு மற்றும் தோல் தடிப்புகளுக்கான மருந்து.',
    side_effects: 'Drowsiness, dry mouth, tiredness.',
    precautions: 'Take at night if it causes sleepiness. Avoid driving or alcohol.',
    dosing_information: [
      {
        population: 'Adults & Children > 12 yrs',
        indication: 'Allergic Rhinitis / Urticaria',
        route: 'Oral',
        official_dosing_text: '10mg once daily at night.'
      }
    ]
  }
];

export const HOSPITALS_DATA = [
  {
    id: 1,
    name: 'Sir Ivan Stedeford Hospital',
    rating: 4.5,
    totalReviews: 2150,
    distanceKm: 3.2,
    address: 'Chennai - Tiruvallur High Rd, Ambattur, Chennai, Tamil Nadu 600053',
    contact: '+91 44 2638 0303',
    emergencyAvailable: true,
    location: {
      latitude: 13.1118,
      longitude: 80.1583
    }
  },
  {
    id: 2,
    name: 'Sri Ramachandra Medical Centre (SRMC)',
    rating: 4.8,
    totalReviews: 5420,
    distanceKm: 9.8,
    address: 'No.1 Ramachandra Nagar, Porur, Chennai, Tamil Nadu 600116',
    contact: '+91 44 4592 8500',
    emergencyAvailable: true,
    location: {
      latitude: 13.0392,
      longitude: 80.1485
    }
  },
  {
    id: 3,
    name: 'MIOT International',
    rating: 4.6,
    totalReviews: 4890,
    distanceKm: 11.4,
    address: '4/112, Mount Poonamallee Rd, Manapakkam, Chennai, Tamil Nadu 600089',
    contact: '+91 44 4200 2288',
    emergencyAvailable: true,
    location: {
      latitude: 13.0163,
      longitude: 80.1802
    }
  },
  {
    id: 4,
    name: 'Apollo Hospitals',
    rating: 4.7,
    totalReviews: 8900,
    distanceKm: 14.5,
    address: '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006',
    contact: '+91 44 2829 0200',
    emergencyAvailable: true,
    location: {
      latitude: 13.0604,
      longitude: 80.2523
    }
  },
  {
    id: 5,
    name: 'Rajiv Gandhi Government General Hospital',
    rating: 4.2,
    totalReviews: 3100,
    distanceKm: 18.1,
    address: 'EVR Periyar Salai, Park Town, Chennai, Tamil Nadu 600003',
    contact: '+91 44 2530 5000',
    emergencyAvailable: true,
    location: {
      latitude: 13.0827,
      longitude: 80.2750
    }
  },
  {
    id: 6,
    name: 'Kauvery Hospital',
    rating: 4.7,
    totalReviews: 3450,
    distanceKm: 19.5,
    address: '199, Luz Church Road, Mylapore, Chennai, Tamil Nadu 600004',
    contact: '+91 44 4000 6000',
    emergencyAvailable: true,
    location: {
      latitude: 13.0375,
      longitude: 80.2586
    }
  }
];

export const EMERGENCY_HELPLINES = [
  { name: 'National Emergency Ambulance', number: '108', desc: 'Free 24/7 Medical & Trauma Ambulance' },
  { name: 'Mother & Infant Emergency', number: '102', desc: 'Free Pregnant Mothers & Newborn Transport' },
  { name: 'Tamil Nadu Health Advice Helpline', number: '104', desc: 'Free Medical Advice & Hospital Locator' }
];
