(function () {
    'use strict';

    angular
        .module('app')
        .controller('Items.IndexController', Controller);

    function Controller($window, $stateParams, ItemService, UserService, FlashService, ChatService, GeolocationService) {
        var vm = this;
        
        vm.item = {};
        vm.items = {};
        vm.currentUser = {};
        vm.currentItemAuthor = {};
        
		vm.createItem = createItem;
		vm.deleteItem = deleteItem;
		vm.getItem = getItem;
		vm.getItems = getItems;
		vm.updateFilters = updateFilters;
        vm.updateItem = updateItem;
        
        initController();

        function initController() {
			if (!$stateParams.itemId) {
                // if no ID is provided then the user has requested
				// all the items
				getItems();
			} else if ($stateParams.itemId && $stateParams.itemId === "create") {
				UserService.GetCurrent()
                    .then(function(user){
                        vm.currentUser = user;
                        
                        vm.item.title = null;
                        vm.item.pricePerUnit = null;
                        vm.item.quantity = null;
                        vm.item.authorId = vm.currentUser._id;
                        
                        ChatService.InitializeChat(vm.currentUser._id);
                    })
                    .catch(function(error){
                        FlashService.Error(error);
                    });
			} else {
                // if an ID is provided then the user has requested
				// a specific item
				getItem();
            }
        }
		
		function createItem() {
			ItemService.Create(vm.item)
				.then(function() {
					FlashService.Success('Item successfully created');
                    $window.location.hash = "#/items";
				})
				.catch(function(error) {
					FlashService.Error(error);
				});
		}
		
		function deleteItem() {
			ItemService.Delete(vm.item._id, vm.currentUser._id)
                .then(function(){
                    // redirect user to the items tab
                    $window.location = "/app";
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
		}
		
		function getItem() {    
            UserService.GetCurrent()
                .then(function(user){
                    vm.currentUser = user;
                    
                    ChatService.InitializeChat(vm.currentUser._id);
					ItemService.GetById($stateParams.itemId)
						.then(function(item){
							vm.item = item;
							
							UserService.GetById(vm.item.authorId)
								.then(function(user){
									vm.currentItemAuthor = user;
									
									GeolocationService.InitializeGeolocation();
									GeolocationService.CreateMap();
									GeolocationService.SetAddress(vm.currentItemAuthor.address);
								})
								.catch(function(error){
									FlashService.Error(error);
								});
						})
						.catch(function(error){
							FlashService(error);
						});
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
		}
		
		function getItems() {
			UserService.GetCurrent()
				.then(function(user){
					vm.currentUser = user;
					
                    ChatService.InitializeChat(vm.currentUser._id);
                    
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
					// workaround for when sending
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
        
        function updateItem() {
            ItemService.Update(vm.item)
                .then(function(){
                    FlashService.Success("Item successfully updated!");
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
        }
        
        // private functions
    }

})();