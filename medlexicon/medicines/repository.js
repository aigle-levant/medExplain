
import { supabase } from "../config/supabase.js";

const MEDICINE_FIELDS = `
  id,
  generic_name,
  brand_names,
  name_ta,
  uses_en,
  uses_ta,
  side_effects,
  precautions,
  source_reference,
  review_status,
  created_at
`;

const DOSING_FIELDS = `
  id,
  indication,
  population,
  formulation,
  route,
  official_dosing_text,
  source_reference,
  reviewed_by,
  review_status
`;

export const searchPublishedMedicines = async (search) => {
    let query = supabase
        .from("medicines")
        .select(MEDICINE_FIELDS)
        .eq("review_status", "published")
        .order("generic_name")
        .limit(20);

    if (search) {
        query = query.or(
            `generic_name.ilike.%${search}%,name_ta.ilike.%${search}%`
        );
    }

    const { data, error } = await query;

    if (error) throw error;

    return data ?? [];
};

export const getPublishedMedicineById = async (id) => {
    const { data, error } = await supabase
        .from("medicines")
        .select(MEDICINE_FIELDS)
        .eq("id", id)
        .eq("review_status", "published")
        .maybeSingle();

    if (error) throw error;

    if (!data) return null;

    const { data: dosingInfo, error: dosingError } = await supabase
        .from("medicine_dosing_info")
        .select(DOSING_FIELDS)
        .eq("medicine_id", id)
        .eq("review_status", "published");

    if (dosingError) throw dosingError;

    return {
        ...data,
        dosing_information: dosingInfo ?? []
    };
};
