(function () {
    'use strict';

    angular
        .module('app')
        .factory('ItemService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetAll = GetAll;
		service.GetAllFiltered = GetAllFiltered;
        service.GetById = GetById;
        service.GetByAuthor = GetByAuthor;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
		
        return service;

        function GetAll() {
            return $http.get('/api/items').then(handleSuccess, handleError);
        }

		function GetAllFiltered(filters) {
			return $http.get('/api/items/filter/' + filters.title +
							"/" + filters.priceMin +
							"/" + filters.priceMax +
							"/" + filters.quantity).then(handleSuccess, handleError);
		}
		
        function GetById(_id) {
            return $http.get('/api/items/' + _id).then(handleSuccess, handleError);
        }

		// TODO: Handle this in the backend service by GETting all the items
		// with a specific authorId
        function GetByAuthor(authorId) {
            return $http.get('/api/items/' + authorId).then(handleSuccess, handleError);
        }

        function Create(item) {
            return $http.post('/api/items', item).then(handleSuccess, handleError);
        }

        function Update(item) {
            return $http.put('/api/items/' + item._id, item).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/items/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
