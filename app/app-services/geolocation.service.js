(function () {
    'use strict';

    angular
        .module('app')
        .factory('GeolocationService', Service);

    function Service($http, $q) {

		var service = {};
	
		service.InitializeGeolocation = InitializeGeolocation;
		service.CreateMap = CreateMap;
		service.SetAddress = SetAddress;
	
		service.geocoder = {};
		service.infoWindow = {};
		service.map = {};
	
		return service;
	
		function InitializeGeolocation() {
			service.geocoder = new google.maps.Geocoder();
			service.infoWindow = new google.maps.InfoWindow();
		}
		
		function CreateMap() {
			var mapOptions = {
				zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}

			/*var mapElement = document.createElement('div');
			mapElement.id = 'map';
			mapElement.style = "width:500px; height:380px;";
			document.body.appendChild(mapElement);*/
			var mapElement = document.getElementById("map");
			
			service.map = new google.maps.Map(mapElement, mapOptions);
		}
		
		function SetAddress(address) {
			service.geocoder.geocode({ address: address }, function(result, status){
				if(status == google.maps.GeocoderStatus.OK){
					var markerInfo = {
						position: result[0].geometry.location,
						name: result[0].formatted_address
					}
				   createMarker(markerInfo);
				}
				else {
					document.getElementById('map').innerHTML = "Geocode was not successful for the following reason: " + status;
				}
			});
		}
		
		// private
		
		// called when creating the map to
		// add the pin that shows the set
		// location
		function createMarker(info) {
			service.map.setCenter(info.position);
			var marker = new google.maps.Marker({
				map: service.map,
				position: info.position,
				title: info.name
			});
			marker.content = '<div class="infoWindowContent">' + info.name + '</div>';

			google.maps.event.addListener(marker, 'click', function () {
				service.infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
				service.infoWindow.open(service.map, marker);
			});
		}
	}
})();