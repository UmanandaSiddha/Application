import { Router } from "express";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import User from "../../models/accounts/user.model.js";
import Transaction from "../../models/payment/transaction.model.js";
import Card from "../../models/card/card.model.js";
import Subscription from "../../models/payment/subscription.model.js";

const router = Router();

/**
 * Helper function to get the start and end date based on the period
 */
const getDateRange = (period: string) => {
    const today = new Date();
    switch (period) {
        case "daily":
            return { start: startOfDay(today), end: endOfDay(today) };
        case "weekly":
            return { start: startOfWeek(today), end: endOfWeek(today) };
        case "monthly":
            return { start: startOfMonth(today), end: endOfMonth(today) };
        case "yearly":
            return { start: startOfYear(today), end: endOfYear(today) };
        default:
            return { start: new Date(0), end: today }; // Default: All-time
    }
};

/**
 * @route GET /stats/users
 * @desc Get users count with date filtering
 */
router.get("/users", async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;

        let dateFilter: any = {};
        if (startDate && endDate) {
            dateFilter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        } else if (period) {
            const { start, end } = getDateRange(period as string);
            dateFilter.createdAt = { $gte: start, $lte: end };
        }

        const totalUsers = await User.countDocuments(dateFilter);
        res.json({ totalUsers });
    } catch (error) {
        res.status(500).json({ error: "Error fetching users count" });
    }
});

/**
 * @route GET /stats/donations
 * @desc Get total donations with time range filtering
 */
router.get("/donations", async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;

        let dateFilter: any = {};
        if (startDate && endDate) {
            dateFilter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        } else if (period) {
            const { start, end } = getDateRange(period as string);
            dateFilter.createdAt = { $gte: start, $lte: end };
        }

        const totalDonations = await Transaction.aggregate([
            { $match: { transactionFor: "DONATOR", ...dateFilter } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);

        res.json({ totalDonations: totalDonations[0]?.totalAmount || 0 });
    } catch (error) {
        res.status(500).json({ error: "Error fetching donations amount" });
    }
});

/**
 * @route GET /stats/cards
 * @desc Get total cards count over time
 */
router.get("/cards", async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;

        let dateFilter: any = {};
        if (startDate && endDate) {
            dateFilter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        } else if (period) {
            const { start, end } = getDateRange(period as string);
            dateFilter.createdAt = { $gte: start, $lte: end };
        }

        const totalCards = await Card.countDocuments(dateFilter);
        res.json({ totalCards });
    } catch (error) {
        res.status(500).json({ error: "Error fetching cards count" });
    }
});

/**
 * @route GET /stats/subscriptions/trend
 * @desc Get subscriptions trend for graphs
 */
router.get("/subscriptions/trend", async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;

        let dateFilter: any = {};
        if (startDate && endDate) {
            dateFilter.createdAt = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        } else if (period) {
            const { start, end } = getDateRange(period as string);
            dateFilter.createdAt = { $gte: start, $lte: end };
        }

        const trend = await Subscription.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({ trend });
    } catch (error) {
        res.status(500).json({ error: "Error fetching subscriptions trend" });
    }
});

export default router;
