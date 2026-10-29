
import { supabase } from "../config/supabase.js";
import {
    getPublishedBodyPartsByTermId,
    getPublishedBodyParts
} from "./repository.js";
import { MedLexiconError } from "../main/errors.js";

export const listBodyParts = async () => {
    return getPublishedBodyParts();
};

export const getBodyPartsForTerm = async (id) => {
    if (!/^[1-9]\d*$/.test(String(id))) {
        throw new MedLexiconError(
            "Invalid medical term ID",
            400,
            "INVALID_TERM_ID"
        );
    }

    const { data: term, error } = await supabase
        .from("medical_terms")
        .select("id, english_term, tamil_term")
        .eq("id", Number(id))
        .eq("review_status", "published")
        .maybeSingle();

    if (error) throw error;

    if (!term) {
        throw new MedLexiconError(
            "Published medical term not found",
            404,
            "TERM_NOT_FOUND"
        );
    }

    const bodyParts = await getPublishedBodyPartsByTermId(term.id);

    return {
        term,
        body_parts: bodyParts,
        note: "Associated body parts do not establish the cause of a symptom."
    };
};
