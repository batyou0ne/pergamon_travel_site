const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const destinationService = {
    async getAll({ page = 1, limit = 12, category, country, search }) {
        const skip = (page - 1) * limit;

        const where = {
            ...(category && { category }),
            ...(country && { country: { contains: country } }),
            ...(search && {
                OR: [
                    { name: { contains: search } },
                    { country: { contains: search } },
                    { city: { contains: search } },
                    { description: { contains: search } },
                ],
            }),
        };

        const [destinations, total] = await prisma.$transaction([
            prisma.destination.findMany({
                where,
                skip,
                take: limit,
                orderBy: { rating: "desc" },
                select: {
                    id: true,
                    name: true,
                    country: true,
                    city: true,
                    imageUrl: true,
                    category: true,
                    rating: true,
                    reviewCount: true,
                },
            }),
            prisma.destination.count({ where }),
        ]);

        return { destinations, total, page, limit };
    },

    async getById(id) {
        const destination = await prisma.destination.findUnique({
            where: { id },
            include: {
                reviews: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!destination) throw new AppError("Destination not found.", 404);
        return destination;
    },

    async create(data) {
        return prisma.destination.create({ data });
    },

    async update(id, data) {
        const destination = await prisma.destination.findUnique({ where: { id } });
        if (!destination) throw new AppError("Destination not found.", 404);

        return prisma.destination.update({ where: { id }, data });
    },

    async delete(id) {
        const destination = await prisma.destination.findUnique({ where: { id } });
        if (!destination) throw new AppError("Destination not found.", 404);

        await prisma.destination.delete({ where: { id } });
    },
};

module.exports = destinationService;
