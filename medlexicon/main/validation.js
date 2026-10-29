import { MedLexiconError } from "./errors.js";

export const validateSearchTerm = (value) => {
    if (typeof value !== "string" || !value.trim()) {
        throw new MedLexiconError(
            "A search term is required",
            400,
            "INVALID_SEARCH"
        );
    }

    const search = value.trim();

    if (search.length > 100) {
        throw new MedLexiconError(
            "Search term must not exceed 100 characters",
            400,
            "INVALID_SEARCH"
        );
    }

    return search;
};