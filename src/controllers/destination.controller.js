const destinationService = require("../services/destination.service");
const catchAsync = require("../utils/catchAsync");
const { sendSuccess, sendPaginated } = require("../utils/response");

const destinationController = {
    getAll: catchAsync(async (req, res) => {
        const { page = 1, limit = 12, category, country, search } = req.query;
        const { destinations, total, page: p, limit: l } = await destinationService.getAll({
            page: parseInt(page),
            limit: parseInt(limit),
            category,
            country,
            search,
        });
        sendPaginated(res, destinations, total, p, l);
    }),

    getById: catchAsync(async (req, res) => {
        const destination = await destinationService.getById(parseInt(req.params.id));
        sendSuccess(res, 200, { destination });
    }),

    create: catchAsync(async (req, res) => {
        const destination = await destinationService.create(req.body);
        sendSuccess(res, 201, { destination }, "Destination created successfully");
    }),

    update: catchAsync(async (req, res) => {
        const destination = await destinationService.update(parseInt(req.params.id), req.body);
        sendSuccess(res, 200, { destination }, "Destination updated successfully");
    }),

    delete: catchAsync(async (req, res) => {
        await destinationService.delete(parseInt(req.params.id));
        res.status(204).send();
    }),
};

module.exports = destinationController;
