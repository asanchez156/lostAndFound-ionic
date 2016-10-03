'use strict';

angular.module('lf')
.controller('AlertsCtrl', function($rootScope, $scope, $filter, $ionicPopover, $ionicPopup, $ionicFilterBar, ItemService){

	$scope.showSearchBar = function() {
		$scope.hideSearchBar = $ionicFilterBar
			.show({
				items: $scope.items,
				update: function(newItems) {
					$scope.items = newItems;
				}
			});
	};

	$scope.favIcon = function(item) {
		var itemKey = item.$id;
		var user = $rootScope.data.currentUser;
		if (user) {
			if (user.favorites && user.favorites.hasOwnProperty(itemKey)) 
				return 'ion-star';
		}
		return 'ion-ios-star-outline';
	};
	
	$scope.swapFav = function(item, event) {
		event.preventDefault();
		var user = $rootScope.data.currentUser;
		var itemKey = item.$id;
		if (!user.favorites) {
			user.favorites = {};
		}
		if (user.favorites.hasOwnProperty(itemKey)) {
			user.favorites[itemKey] = null;
		} else {
			if (!user.favorites) user.favorites = {};
			user.favorites[itemKey] = true;
		}
		user.$save();
	};

	$scope.distanceObject = function(dist) {
		var obj = {};
		if (dist < 1000) {
			obj.distance = dist;
			obj.unit = 'm';
		} else {
			obj.distance = Math.round(dist/10)/100;
			obj.unit = 'km';
		}
		return obj;
	};
	
	$scope.noFavorites = function() {
		return !!$scope.showFavorites && $rootScope.data.currentUser && (!$rootScope.data.currentUser.favorites || $rootScope.data.currentUser.favorites.length == 0);
	};

	$scope.isFavorite = function(item) {
		if ($scope.showFavorites) {
			if ($rootScope.data.currentUser && $rootScope.data.currentUser.favorites)
				return $rootScope.data.currentUser.favorites.hasOwnProperty(item.$id);
			else
				return false;
		} else {
			return true;
		}
	};

	$scope.showAllItems = function() {
		$scope.showFavorites = false;
	};

	$scope.showFavItems = function() {
		if ($rootScope.data.currentUser) {
			$scope.showFavorites = true;
		} else {
			$ionicPopup.show({
				template: 'Please log in to use this function',
				scope: $scope,
				buttons: [
					{ text: 'OK' }
				]
			});
		}
	};

	$scope.doRefresh = function() {
		$scope.items = ItemService.getAlertItems();
		//Stop the ion-refresher from spinning
		$scope.$broadcast('scroll.refreshComplete');
	};

	$scope.doRefresh();

	$rootScope.$on('alert-deleted', function(event, item) {
		for (var i=0;i<$scope.items.length;i++) {
			if ($scope.items[i].$id == item.$id) {
				return $scope.items.splice(i, 1);
			}
		}
	});

	$rootScope.$on('alert-added', function(event) {
		$scope.doRefresh();
	});

});

