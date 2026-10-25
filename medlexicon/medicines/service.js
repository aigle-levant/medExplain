
import {
    searchPublishedMedicines,
    getPublishedMedicineById
} from "./repository.js";

import { MedLexiconError } from "../main/errors.js";

export const searchMedicines = async (search = "") => {
    const term = String(search).trim();

    if (term.length > 100) {
        throw new MedLexiconError(
            "Search must be 100 characters or fewer",
            400,
            "INVALID_SEARCH"
        );
    }

    const items = await searchPublishedMedicines(term);

    return {
        items,
        total: items.length
    };
};

export const getMedicineById = async (id) => {
    if (!/^[1-9]\d*$/.test(String(id))) {
        throw new MedLexiconError(
            "Invalid medicine ID",
            400,
            "INVALID_MEDICINE_ID"
        );
    }

    const medicine = await getPublishedMedicineById(Number(id));

    if (!medicine) {
        throw new MedLexiconError(
            "Published medicine not found",
            404,
            "MEDICINE_NOT_FOUND"
        );
    }

    return medicine;
};
