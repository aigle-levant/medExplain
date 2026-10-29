import { supabase } from "../config/supabase.js";

export const searchPublishedTerms = async (search) => {
    const { data, error } = await supabase
        .from("medical_terms")
        .select(`
      id,
      english_term,
      tamil_term,
      tamil_transliteration,
      simple_english,
      simple_tamil,
      medical_definition,
      category_id
    `)
        .eq("review_status", "published")
        .ilike("english_term", `%${search}%`)
        .limit(10);

    if (error) throw error;

    return data;
};

export const getPublishedTermById = async (id) => {
    const { data, error } = await supabase
        .from("medical_terms")
        .select(`
      id,
      english_term,
      tamil_term,
      tamil_transliteration,
      simple_english,
      simple_tamil,
      medical_definition,
      category_id
    `)
        .eq("id", id)
        .eq("review_status", "published")
        .maybeSingle();

    if (error) throw error;

    return data;
};