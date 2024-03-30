"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const order_model_1 = __importDefault(require("../models/order.model"));
// create new order
exports.newOrder = (0, catchAsyncError_1.CatchAsyncError)(async (data, res, next) => {
    const order = await order_model_1.default.create(data);
    res.status(201).json({
        success: true,
        order,
    });
});
// get all orders
const getAllOrdersService = async (res) => {
    const orders = await order_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        orders,
    });
};
exports.getAllOrdersService = getAllOrdersService;
