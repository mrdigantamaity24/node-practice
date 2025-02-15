const TourAPIfeatures = require(`./../utils/apiFetauresTour`);
const asyncError = require(`./../utils/asyncErrorhandle`);
const AppError = require('../utils/appError');

// get all document
exports.getAllDocument = Model => asyncError(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) {
        filter = { tour: req.params.tourId }
    }

    const apiFeatures = new TourAPIfeatures(Model.find(filter), req.query).filter().sort().fieldlimit().pagination();

    const documents = await apiFeatures.query;

    if (documents.length > 0) {
        res.status(200).json({
            status: 'success',
            results: documents.length,
            data: {
                documents
            }
        });
    } else {
        res.status(200).json({
            status: 'success',
            results: 'No data found'
        });
    }
});

// create document
exports.addDocument = Model => asyncError(async (req, res, next) => {
    const addDoc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tours: addDoc
        }
    })
});

// get document by ID
exports.getDocumentOneByID = (Model, populateOption) => asyncError(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOption) {
        query = query.populate(populateOption);
    }

    const getDocByID = await query;

    // get tour by ID
    if (!getDocByID) {
        return next(new AppError('No tour found with this Id', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Document found',
        data: {
            getDocByID
        }
    });
});

// update document
exports.updateDocument = Model => asyncError(async (req, res, next) => {
    const documentUpdate = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // tours upadte by Id
    if (!documentUpdate) {
        return next(new AppError('No document found with this Id', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Updated Successfull',
        data: {
            documentUpdate
        }
    });
});


// delete document
exports.deleteDocumentOne = Model => asyncError(async (req, res, next) => {
    const deleteDoc = await Model.findByIdAndDelete(req.params.id);

    // delete by id
    if (!deleteDoc) {
        return next(new AppError('No document found with this Id', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Successfully Deleted'
    });
});

// delete all documents together
exports.deleteDocumentsAll = Model => asyncError(async (req, res, next) => {
    const allDocuments = await Model.deleteMany();

    // all tours delete
    if (!allDocuments) {
        return next(new AppError('Something wrong', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'All documents Successfully Deleted'
    });
});