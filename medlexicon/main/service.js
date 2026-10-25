import * as repository from "./repository.js";
import { validateSearchTerm } from "./validation.js";
import { MedLexiconError } from "./errors.js";

export const searchTerms = async (query) => {
    const search = validateSearchTerm(query);
    const items = await repository.searchPublishedTerms(search);

    return {
        items,
        total: items.length
    };
};

export const getTerm = async (id) => {
    if (!/^\d+$/.test(String(id))) {
        throw new MedLexiconError(
            "Invalid medical term ID",
            400,
            "INVALID_TERM_ID"
        );
    }

    const term = await repository.getPublishedTermById(Number(id));

    if (!term) {
        throw new MedLexiconError(
            "Medical term not found",
            404,
            "TERM_NOT_FOUND"
        );
    }

    return term;
};