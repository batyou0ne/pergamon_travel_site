const tripService = require("../services/trip.service");
const catchAsync = require("../utils/catchAsync");
const { sendSuccess } = require("../utils/response");

const tripController = {
    getMyTrips: catchAsync(async (req, res) => {
        const trips = await tripService.getUserTrips(req.user.id);
        sendSuccess(res, 200, { trips });
    }),

    getById: catchAsync(async (req, res) => {
        const trip = await tripService.getById(parseInt(req.params.id), req.user.id);
        sendSuccess(res, 200, { trip });
    }),

    create: catchAsync(async (req, res) => {
        const trip = await tripService.create(req.body, req.user.id);
        sendSuccess(res, 201, { trip }, "Trip created successfully");
    }),

    update: catchAsync(async (req, res) => {
        const trip = await tripService.update(parseInt(req.params.id), req.user.id, req.body);
        sendSuccess(res, 200, { trip }, "Trip updated successfully");
    }),

    delete: catchAsync(async (req, res) => {
        await tripService.delete(parseInt(req.params.id), req.user.id);
        res.status(204).send();
    }),
};

module.exports = tripController;
