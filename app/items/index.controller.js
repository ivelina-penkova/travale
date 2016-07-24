(function () {
    'use strict';

    angular
        .module('app')
        .controller('Items.IndexController', Controller);

    function Controller($window, $stateParams, ItemService, FlashService) {
        var vm = this;
		
		vm.createItem = createItem;
		vm.deleteItem = deleteItem;
		vm.getItem = getItem;
		vm.getItems = getAllItems;
		
        initController();

        function initController() {
			if ($stateParams.itemId && $stateParams.itemId !== "") {
				// if an ID is provided then the user has requested
				// a specific item
				getItem();
			} else {
				// if no ID is provided then the user has requested
				// all the items
				getAllItems();
			}
        }
		
		function createItem() {
			ItemService.Create(vm.item)
				.then(function() {
					FlashService.Success('Item successfully created');
				})
				.catch(function(error) {
					FlashService.Error(error);
				});
		}
		
		function deleteItem() {
			// to implement
		}
		
		function getItem() {
			ItemService.GetById($stateParams.itemId)
				.then(function(item){
					vm.item = item;
				})
				.catch(function(error){
					FlashService(error);
				});
		}
		
		function getAllItems() {
			ItemService.GetAll()
				.then(function(items){
					vm.items = items;
				})
				.catch(function(error){
					FlashService.Error(error);
				});
		}
    }

})();