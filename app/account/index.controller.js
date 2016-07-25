(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, $stateParams, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            // get current user
			if ($stateParams.userId && $stateParams.userId !== "") {
				getUser();
			} else {
				getCurrentUser();
			}
            
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
		
		function getCurrentUser() {
			UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
		}
		
		function getUser() {
			UserService.GetById($stateParams.userId)
				.then(function(user){
					vm.user = user;
				})
				.catch(function(error){
					FlashService.Error(error);
				});
		}
    }

})();