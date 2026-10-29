
import { supabase } from "../config/supabase.js";

export const getPublishedBodyPartsByTermId = async (termId) => {
    const { data, error } = await supabase
        .from("term_body_parts")
        .select(`
      relationship_type,
      source_reference,
      body_parts (
        id,
        name_en,
        name_ta,
        body_system,
        description_en,
        description_ta
      )
    `)
        .eq("term_id", termId)
        .eq("review_status", "published");

    if (error) throw error;

    return (data ?? [])
        .filter((item) => item.body_parts)
        .map((item) => ({
            ...item.body_parts,
            relationship_type: item.relationship_type,
            source_reference: item.source_reference
        }));
};

export const getPublishedBodyParts = async () => {
    const { data, error } = await supabase
        .from("body_parts")
        .select(`
      id,
      name_en,
      name_ta,
      body_system,
      description_en,
      description_ta
    `)
        .order("name_en");

    if (error) throw error;

    return data ?? [];
};
