const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const authService = {
    async register({ name, email, password }) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError("An account with this email already exists.", 409);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        const token = signToken(user.id);
        return { user, token };
    },

    async login({ email, password }) {
        if (!email || !password) {
            throw new AppError("Please provide email and password.", 400);
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError("Incorrect email or password.", 401);
        }

        const { password: _pwd, ...safeUser } = user;
        const token = signToken(user.id);
        return { user: safeUser, token };
    },

    async getMe(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
                dreamCity: true,
                travelStyle: true,
                languages: true,
                createdAt: true
            },
        });
        if (!user) throw new AppError("User not found.", 404);
        return user;
    },

    async updateProfile(userId, data) {
        const { name, bio, avatar, dreamCity, travelStyle, languages } = data;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                avatar,
                dreamCity,
                travelStyle,
                languages,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
                dreamCity: true,
                travelStyle: true,
                languages: true,
                createdAt: true,
            },
        });

        return updatedUser;
    },
};

module.exports = authService;
