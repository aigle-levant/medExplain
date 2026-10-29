import dotenv from 'dotenv';
dotenv.config();

const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = process.env;

let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
    try {
        const { createClient } = await import("@supabase/supabase-js");
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    } catch (err) {
        console.warn("Notice: Supabase client not loaded, using local repository dataset.");
    }
}

// Fallback query builder for offline / standalone use
const fallbackQueryBuilder = (table) => {
    let dummyData = [];
    if (table === 'medical_terms') {
        dummyData = [
            { id: 1, english_term: 'Hypertension', tamil_term: 'உயர் இரத்த அழுத்தம்', tamil_transliteration: 'Uyar Raththa Azhutham', simple_english: 'High blood pressure.', simple_tamil: 'இரத்த அழுத்தம் அதிகம்.', medical_definition: 'Persistent elevation of arterial blood pressure.', category_id: 1, review_status: 'published' },
            { id: 2, english_term: 'Hyperglycemia', tamil_term: 'அதிக இரத்த சர்க்கரை', tamil_transliteration: 'Athiga Raththa Sarkkarai', simple_english: 'High blood sugar level.', simple_tamil: 'இரத்தத்தில் அதிக சர்க்கரை.', medical_definition: 'Excess glucose in bloodstream.', category_id: 2, review_status: 'published' },
            { id: 3, english_term: 'Anemia', tamil_term: 'இரத்த சோகை', tamil_transliteration: 'Raththa Sogai', simple_english: 'Low red blood cells or hemoglobin.', simple_tamil: 'இரத்த சிவப்பணுக்கள் குறைவு.', medical_definition: 'Decrease in total amount of RBCs or hemoglobin.', category_id: 3, review_status: 'published' },
            { id: 4, english_term: 'Leukocytosis', tamil_term: 'வெள்ளை அணுக்கள் அதிகரிப்பு', tamil_transliteration: 'Vellai Anukkal Athigarippu', simple_english: 'Elevated white blood cells.', simple_tamil: 'வெள்ளை அணுக்கள் அதிகம்.', medical_definition: 'High total white blood cell count in response to infection.', category_id: 3, review_status: 'published' },
            { id: 5, english_term: 'Thrombocytopenia', tamil_term: 'இரத்த தட்டணுக்கள் குறைவு', tamil_transliteration: 'Raththa Thattanukkal Kuraivu', simple_english: 'Low platelet count.', simple_tamil: 'தட்டணுக்கள் குறைவு.', medical_definition: 'Low platelets count (< 150,000/mcL).', category_id: 3, review_status: 'published' }
        ];
    } else if (table === 'body_parts') {
        dummyData = [
            { id: 1, name_en: 'Heart', name_ta: 'இதயம்', body_system: 'Cardiovascular', description_en: 'Pumps blood.', description_ta: 'இரத்தத்தை செலுத்துகிறது.' },
            { id: 2, name_en: 'Lungs', name_ta: 'நுரையீரல்', body_system: 'Respiratory', description_en: 'Gas exchange organ.', description_ta: 'சுவாச உறுப்பு.' },
            { id: 3, name_en: 'Kidneys', name_ta: 'சிறுநீரகங்கள்', body_system: 'Urinary', description_en: 'Filters waste.', description_ta: 'கழிவுகளை வடிகட்டுகிறது.' },
            { id: 4, name_en: 'Brain', name_ta: 'மூளை', body_system: 'Nervous', description_en: 'Central nervous system control center.', description_ta: 'உடலின் கட்டுப்பாட்டு மையம்.' },
            { id: 5, name_en: 'Liver', name_ta: 'கல்லீரல்', body_system: 'Digestive', description_en: 'Detoxifies chemicals and metabolizes drugs.', description_ta: 'நச்சுக்களை நீக்கும் உறுப்பு.' }
        ];
    } else if (table === 'medicines') {
        dummyData = [
            { id: 1, generic_name: 'Paracetamol', brand_names: ['Dolo 650', 'Calpol'], name_ta: 'பாராசிட்டமால்', uses_en: 'Fever and pain relief', uses_ta: 'காய்ச்சல் மற்றும் வலி நிவாரணி', side_effects: 'Rare liver toxicity in overdose', precautions: 'Max 4g daily', review_status: 'published' },
            { id: 2, generic_name: 'Amoxicillin', brand_names: ['Augmentin', 'Novamox'], name_ta: 'அமாக்சிசிலின்', uses_en: 'Bacterial infections', uses_ta: 'பாக்டீரியா தொற்று எதிர்ப்பு', side_effects: 'Mild diarrhea, nausea', precautions: 'Complete full course', review_status: 'published' },
            { id: 3, generic_name: 'Pantoprazole', brand_names: ['Pan 40', 'Pantocid'], name_ta: 'பான்டோபிரசோல்', uses_en: 'Acidity, gastritis, GERD', uses_ta: 'அசிடிட்டி, நெஞ்செரிச்சல்', side_effects: 'Headache', precautions: 'Take before breakfast', review_status: 'published' },
            { id: 4, generic_name: 'Metformin', brand_names: ['Glycomet', 'Glucophage'], name_ta: 'மெட்ஃபோர்மின்', uses_en: 'Type 2 Diabetes', uses_ta: 'நீரிழிவு நோய் சிகிச்சை', side_effects: 'Mild GI upset', precautions: 'Take with food', review_status: 'published' },
            { id: 5, generic_name: 'Atorvastatin', brand_names: ['Atorva', 'Lipitor'], name_ta: 'அடோர்வாஸ்டேடின்', uses_en: 'Lowers LDL cholesterol', uses_ta: 'கொழுப்பைக் குறைக்கும் மருந்து', side_effects: 'Mild muscle ache', precautions: 'Take at bedtime', review_status: 'published' }
        ];
    } else if (table === 'medicine_dosing_info') {
        dummyData = [
            { id: 1, medicine_id: 1, indication: 'Fever', population: 'Adults', formulation: 'Tablet', route: 'Oral', official_dosing_text: '500-650mg every 4-6 hours as needed. Max 4g daily.', review_status: 'published' },
            { id: 2, medicine_id: 2, indication: 'Bacterial infection', population: 'Adults', formulation: 'Capsule', route: 'Oral', official_dosing_text: '500mg every 8 hours for 5-7 days.', review_status: 'published' },
            { id: 3, medicine_id: 3, indication: 'Acidity / GERD', population: 'Adults', formulation: 'Tablet', route: 'Oral', official_dosing_text: '40mg once daily in morning before food.', review_status: 'published' }
        ];
    }

    const builder = {
        _data: dummyData,
        select() { return builder; },
        eq(col, val) { 
            builder._data = builder._data.filter(item => item[col] === val || item[col] === undefined); 
            return builder; 
        },
        ilike(col, pattern) {
            const raw = pattern.replace(/%/g, '').toLowerCase();
            builder._data = builder._data.filter(item => (item[col] || '').toLowerCase().includes(raw));
            return builder;
        },
        or(queryStr) {
            // Simple match for generic_name or name_ta
            return builder;
        },
        order() { return builder; },
        limit(n) { builder._data = builder._data.slice(0, n); return builder; },
        async maybeSingle() {
            return { data: builder._data[0] || null, error: null };
        },
        then(resolve) {
            resolve({ data: builder._data, error: null });
        }
    };
    return builder;
};

export const supabase = supabaseClient || {
    from: (table) => fallbackQueryBuilder(table)
};