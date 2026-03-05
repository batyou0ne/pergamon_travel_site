const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const tripService = {
    async getUserTrips(userId) {
        return prisma.trip.findMany({
            where: { userId },
            include: {
                destination: {
                    select: { id: true, name: true, country: true, city: true, imageUrl: true, category: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async getById(id, userId) {
        const trip = await prisma.trip.findUnique({
            where: { id },
            include: {
                destination: true,
            },
        });

        if (!trip) throw new AppError("Trip not found.", 404);
        if (trip.userId !== userId) throw new AppError("You do not have permission to view this trip.", 403);

        return trip;
    },

    async create(data, userId) {
        // Verify destination exists
        const destination = await prisma.destination.findUnique({
            where: { id: data.destinationId },
        });
        if (!destination) throw new AppError("Destination not found.", 404);

        return prisma.trip.create({
            data: { ...data, userId },
            include: {
                destination: {
                    select: { id: true, name: true, country: true, city: true, imageUrl: true },
                },
            },
        });
    },

    async update(id, userId, data) {
        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip) throw new AppError("Trip not found.", 404);
        if (trip.userId !== userId) throw new AppError("You do not have permission to update this trip.", 403);

        return prisma.trip.update({
            where: { id },
            data,
            include: {
                destination: {
                    select: { id: true, name: true, country: true, city: true, imageUrl: true },
                },
            },
        });
    },

    async delete(id, userId) {
        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip) throw new AppError("Trip not found.", 404);
        if (trip.userId !== userId) throw new AppError("You do not have permission to delete this trip.", 403);

        await prisma.trip.delete({ where: { id } });
    },
};

module.exports = tripService;
