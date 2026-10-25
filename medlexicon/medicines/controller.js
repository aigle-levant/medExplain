
import {
    searchMedicines,
    getMedicineById
} from "./service.js";

export const search = async (req, res, next) => {
    try {
        const data = await searchMedicines(req.query.search ?? "");

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const data = await getMedicineById(req.params.id);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
