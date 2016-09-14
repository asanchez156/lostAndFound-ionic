angular.module('lf')
.controller('AlertsCtrl', function($scope,$rootScope,ItemService){

	/*
	  if($rootScope.alert_collection)
		$scope.items = $rootScope.alert_collection;
	*/

	$rootScope.$watch('alert_collection', function(newValue, oldValue) {
		$scope.items = newValue;
		//$scope.items = newValue.models;
	});

	$rootScope.showLoading();
	ItemService.fetchAlerts(function(error, items) {
		$rootScope.hideLoading();
		$scope.items = items;
		$scope.$apply();
	});

	$scope.doRefresh = function() {
		ItemService.fetchAlerts(function(error,collection){
			setTimeout(function(){
				$rootScope.alert_collection = collection;
				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			},1000);
		});
	}

});