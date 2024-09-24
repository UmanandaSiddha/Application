import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import { instance } from "../../server.js";
import Plan, { planEnum } from "../../models/payment/planModel.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";

export const createPlan = catchAsyncErrors(async (req, res, next) => {
    const { name, description, planType, cards, amount, period, interval } = req.body;
    if (!name || !description || !planType || !cards || !amount || !period || !interval) {
        return next(new ErrorHandler("All fields are required", 404));
    };

    const razorPlan = await instance.plans.create({
        period,
        interval,
        item: {
            name,
            amount: Number(amount) * 100,
            currency: "INR",
            description,
        },
    });   
    if (!razorPlan) {
        return next(new ErrorHandler("Failed to create plan", 404));
    }

    const plan = await Plan.create({
        name,
        amount: Number(amount),
        description,
        cards: Number(cards),
        planType,
        period,
        interval: Number(interval),
        razorPlanId: razorPlan.id,
    });

    res.status(200).json({
        success: true,
        plan
    });
});

export const createFreePlan = catchAsyncErrors(async (req, res, next) => {
    const { name, description, cards, period, interval } = req.body;
    if (!cards || !period || !interval || !name || !description) {
        return next(new ErrorHandler("All fields are required", 404));
    }

    const plan = await Plan.create({
        name,
        amount: 0,
        description,
        cards: Number(cards),
        planType: planEnum.FREE,
        visible: false,
        period,
        interval: Number(interval),
    });

    res.status(200).json({
        success: true,
        plan
    });
});

export const updateFreePlan = catchAsyncErrors(async (req, res, next) => {
    const plan = await Plan.findOne({ _id: req.params.id, planType: planEnum.FREE });
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    }
    
    const { name, description, cards, period, interval } = req.body;
    const updatePlan = {};
    if (name) updatePlan.name = name;
    if (description) updatePlan.description = description;
    if (cards) updatePlan.cards = Number(cards);
    if (period) updatePlan.period = period;
    if (interval) updatePlan.interval = Number(interval);

    await Plan.findByIdAndUpdate(
        req.params.id, 
        updatePlan,
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `Free Plan Updated`,
    });
});

export const switchPlanVisibility = catchAsyncErrors(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    }

    await Plan.findByIdAndUpdate(
        req.params.id, 
        { visible: !plan.visible }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "Plan visibility was updated successfully",
    });
});

export const getAllPlans = catchAsyncErrors( async (req, res, next) => {
    
    const resultPerPage = 5;
    const count  = await Plan.countDocuments();

    const apiFeatures = new ApiFeatures(Plan.find().sort({ $natural: -1 }), req.query).search().filter();

    let filteredPlans = await apiFeatures.query;
    let filteredPlanCount = filteredPlans.length;

    apiFeatures.pagination(resultPerPage);
    filteredPlans = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        plans: filteredPlans,
        filteredPlanCount
    });
});

export const getParticularPlan = catchAsyncErrors( async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    };

    res.status(200).json({
        success: true,
        plan
    });
});

export const updatePlan = catchAsyncErrors(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    }

    const { name, description, cards } = req.body;
    const planData = {};
    if (name) planData.name = name;
    if (description) planData.description = description;
    if (cards) planData.cards = Number(cards);

    const updatedPlan = await Plan.findByIdAndUpdate(
        req.params.id, 
        planData, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "Plan Updated Successfully",
        plan: updatedPlan
    });
});

export const deletePlan = catchAsyncErrors( async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    };

    await Plan.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: `Plan deleted successfully`,
    });
});