var config = require('config.json');
var express = require('express');
var router = express.Router();
var itemService = require('services/item.service');
var jwt = require('jsonwebtoken');

// routes
router.put('/:_id', updateItem);
router.delete('/:_id/:authorId', deleteItem);
router.get('/:_id', getItemById);
router.post('/', createItem);
router.get('/', getAllItems);
router.get('/filter/:title/:priceMin/:priceMax/:quantity', getFilteredItems);

module.exports = router;

function updateItem(req, res) {
    if (req.body.authorId !== req.user.sub) {
        // can only update own items
        return res.status(401).send('You can only update your own items');
    }
    
    itemService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteItem(req, res) {
    if (req.params.authorId !== req.user.sub) {
        // can only delete own items
        return res.status(401).send('You can only delete your own items');
    }

    itemService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getItemById(req, res)
{
	itemService.getById(req.params._id)
		.then(function(item){
			if (item) {
				res.send(item);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err){
			res.send(400).send(err);
		});
}

function createItem(req, res) {
	// set the authorId to the current user's ID
	// (the req.user.sub is the ID of the currently
	// logged in user and is available in the API
	// controllers)
	req.body.authorId = req.user.sub;
	
	itemService.create(req.body)
		.then(function(){
			res.sendStatus(200);
		})
		.catch(function (err) {
			res.status(400).send(err);
		});
}

function getAllItems(req, res) {
	itemService.getAll()
		.then(function(items){
			if (items && items.length > 0) {
				res.send(items);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err){
			res.status(400).send(err);
		});
}

function getFilteredItems(req, res) {
	itemService.filter(req.params)
		.then(function(items){
			if (items && items.length > 0) {
				res.send(items);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err){
			res.status(400).send(err);
		});
}