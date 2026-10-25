import * as service from "./service.js";

export const search = async (req, res, next) => {
    try {
        const data = await service.searchTerms(req.query.search);

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
        const data = await service.getTerm(req.params.id);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};