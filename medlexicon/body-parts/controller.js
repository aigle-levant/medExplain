
import {
    listBodyParts,
    getBodyPartsForTerm
} from "./service.js";

export const getAll = async (req, res, next) => {
    try {
        const data = await listBodyParts();

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};

export const getByTermId = async (req, res, next) => {
    try {
        const data = await getBodyPartsForTerm(req.params.id);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
