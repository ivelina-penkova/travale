(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);
        
    function Controller($window, $stateParams, UserService, FlashService, ChatService) {
        var vm = this;
        
        vm.user = null;
        vm.currentUser = null;
        
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.createChatBox = createChatBox;

        initController();

        function initController() {
			// get current user
			UserService.GetCurrent().then(function (user) {
				vm.currentUser = user;
                
				if ($stateParams.userId && $stateParams.userId !== "") {
					UserService.GetById($stateParams.userId)
						.then(function(user){
							vm.user = user;
						})
						.catch(function(error){
							FlashService.Error(error);
						});
				}
				
                ChatService.InitializeChat(vm.currentUser._id);
            });
        }

        function saveUser() {
            UserService.Update(vm.currentUser)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.currentUser._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        
        function getCurrentUser() {
            
        }
        
        function getUser() {
            
        }
		
		function createChatBox() {
			ChatService.CreateChatBox(vm.currentUser, vm.user);
		}
        
        // private functions
    }

})();