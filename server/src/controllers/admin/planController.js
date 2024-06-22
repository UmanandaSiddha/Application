import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import { instance } from "../../server.js";
import Plan, { planEnum } from "../../models/payment/planModel.js";

export const createPlan = catchAsyncErrors(async (req, res, next) => {

    const { name, description, planType, cards, amount, period, interval } = req.body;
    if (!name || !description || !planType || !cards || !amount || !period || !interval) {
        return next(new ErrorHandler("All fields are required", 404));
    };

    let razorPlan;
    try {
        razorPlan = await instance.plans.create({
            period,
            interval,
            item: {
                name,
                amount: Number(amount) * 100,
                currency: "INR",
                description,
            },
        });   
    } catch (error) {
        return next(new ErrorHandler(`Error: ${error.error.description}`, error.statusCode));
    }

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
    const plan = await Plan.create({
        name: req.body.name,
        amount: 0,
        description: req.body.description,
        cards: Number(req.body.cards),
        planType: planEnum.FREE,
        visible: false,
        period: req.body.period,
        interval: Number(req.body.interval),
    });

    res.status(200).json({
        success: true,
        plan
    });
});

export const updateFreePlan = catchAsyncErrors(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    }

    await Plan.findByIdAndUpdate(
        req.params.id, 
        { 
            name: req.body.name,
            description: req.body.description,
            cards: Number(req.body.cards),
            period: req.body.period,
            interval: Number(req.body.interval),
        }, 
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
    const plans = await Plan.find();
    const count  = await Plan.countDocuments();

    res.status(200).json({
        success: true,
        plans,
        count
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

    const updatedPlan = await Plan.findByIdAndUpdate(
        req.params.id, 
        { 
            name: req.body.name,
            description: req.body.description,
            cards: Number(req.body.cards),
        }, 
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