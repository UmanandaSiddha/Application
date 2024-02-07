import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Tree from "../models/treeModel.js";
import ApiFeatures from "../utils/apiFeatures.js";
import User from "../models/userModel.js";

export const createTreeVCard = catchAsyncErrors(async (req, res, next) => {

    const tree = await Tree.create(req.body);

    res.status(201).json({
        success: true,
        tree, 
    });
});

export const updateTreeVCard = catchAsyncErrors(async (req, res, next) => {

    const trex = await Tree.findById(req.params.id);
    if (!trex) {
        return next(new ErrorHandler(`Tree does not exist with Id: ${req.params.id}`), 404);
    }

    const tree = await Tree.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    if (!tree) {
        return next(new ErrorHandler(`Update Failed`), 404);
    }

    res.status(200).json({
        success: true,
        tree,
    });
});

export const deleteTreeVCard = catchAsyncErrors(async (req, res, next) => {

    const tree = await Tree.findById(req.params.id);
    if (!tree) {
        return next(new ErrorHandler(`Tree does not exist with Id: ${req.params.id}`), 404);
    }

    await Tree.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: `Tree deleted`,
    });
});

export const getUserVcards = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 5;
    const treeCount = await Tree.countDocuments({ user: req.user.id });

    const apiFeatures = new ApiFeatures(Tree.find({ user: req.user.id }).sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const tree = await apiFeatures.query;

    res.status(201).json({
        success: true,
        count: treeCount,
        tree,
    });
});

export const getTreeVCard = catchAsyncErrors(async (req, res, next) => {
    const tree = await Tree.findById(req.params.id);
    if (!tree) {
        return next(new ErrorHandler("Tree Not Found", 400));
    }

    const user = await User.findById(tree.user);
    if ( user.currentPlan.endDate < Date.now() ) {
        return next(new ErrorHandler("Subscription Expired", 400));
    }

    res.status(201).json({
        success: true,
        tree,
    });
});