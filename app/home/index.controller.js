﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, ChatService) {
        var vm = this;
        
        vm.user = null;
        
        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                
                ChatService.InitializeChat(user._id);
            });
        }
        
        // private functions
    }

})();