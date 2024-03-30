"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getNotifications = void 0;
const notification_modal_1 = __importDefault(require("../models/notification.modal"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const node_cron_1 = __importDefault(require("node-cron"));
// get all notifications --- only for admin
exports.getNotifications = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const notifications = await notification_modal_1.default.find().sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update notification status -- only admin
exports.updateNotification = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const notification = await notification_modal_1.default.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler_1.default("Notification not found", 404));
        }
        else {
            notification.status
                ? (notification.status = "read")
                : notification.status;
        }
        await notification.save();
        const notifications = await notification_modal_1.default.find().sort({
            createdBy: -1,
        });
        res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// delete notification -- only admin
node_cron_1.default.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await notification_modal_1.default.deleteMany({
        status: "read",
        createdAt: { $lt: thirtyDaysAgo },
    });
    console.log("Delete read notifications");
});
