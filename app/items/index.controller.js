(function () {
    'use strict';

    angular
        .module('app')
        .controller('Items.IndexController', Controller);

    function Controller($window, $stateParams, ItemService, UserService, FlashService) {
        var vm = this;
		
		vm.createItem = createItem;
		vm.deleteItem = deleteItem;
		vm.getItem = getItem;
		vm.getItems = getItems;
		vm.updateFilters = updateFilters;
		
        initController();

        function initController() {
			// DEBUG
			//
			// uncomment to create an item when controller
			// is initialized (use only for debugging prurposes)
			//
			/*vm.item = {};
			vm.item.title = "Telephone";
			vm.item.pricePerUnit = 200.00;
			vm.item.quantity = 1;
			createItem();*/
			
			if ($stateParams.itemId && $stateParams.itemId !== "") {
				// if an ID is provided then the user has requested
				// a specific item
				getItem();
			} else {
				// if no ID is provided then the user has requested
				// all the items
				getItems();
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
					UserService.GetById(item.authorId)
						.then(function(user){
							vm.currentItemAuthor = user;
						})
						.catch(function(error){
							FlashService.Error(error);
						});
				})
				.catch(function(error){
					FlashService(error);
				});
		}
		
		function getItems() {
			UserService.GetCurrent()
				.then(function(user){
					vm.currentUser = user;
					
					// temporary workaround for when sending
					// a query without a title
					if (!vm.currentUser.filters.title) {
						vm.currentUser.filters.title = null;
					}
					
					ItemService.GetAllFiltered(vm.currentUser.filters)
						.then(function(items){
							vm.items = items;
						})
						.catch(function(error){
							FlashService.Error(error);
						});
				})
				.catch(function(error){
					FlashService.Error(error);
				});
		}
		
		function updateFilters() {
			UserService.Update(vm.currentUser)
				.then(function(){
					// temporary workaround for when sending
					// a query without a title
					if (!vm.currentUser.filters.title) {
						vm.currentUser.filters.title = null;
					}
						
					ItemService.GetAllFiltered(vm.currentUser.filters)
						.then(function(items){
							vm.items = items;
						})
						.catch(function(error){
							FlashService.Error(error);
						});
				})
				.catch(function(error){
					FlashService.Error(error);
				});
		}
    }

})();