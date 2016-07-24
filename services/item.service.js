// This is the very backend which communicates with
// the database

var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var jwt = require("jsonwebtoken");
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('items');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
	var deferred = Q.defer();
	
	db.items.find().toArray(function(err, items){
		if (err) deferred.reject(err);
		
		if (items.length > 0) {
			// return items
			deferred.resolve(items);
		} else {
			// no items
			deferred.resolve();
		}
	});
	
	return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.items.findById(_id, function (err, item) {
        if (err) deferred.reject(err);

        if (item) {
            // return item
            deferred.resolve(item);
        } else {
            // item not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(itemParam) {
    var deferred = Q.defer();

    createItem();

    function createItem() {
        // set item object to itemParam
        var item = itemParam;
		
        db.items.insert(
            item,
            function (err, doc) {
                if (err) deferred.reject(err);
				
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, itemParam) {
    var deferred = Q.defer();

    // validation
    db.items.findById(_id, function (err, item) {
        if (err) deferred.reject(err);
		
        updateItem();
    });

    function updateItem() {
        // fields to update
        var set = {
            name: itemParam.title,
            pricePerUnit: itemParam.pricePerUnit,
            quantity: itemParam.quantity,
        };

        db.items.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.items.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}