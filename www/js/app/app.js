  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'

  angular.module('lf', [ 'ionic',
                         'pascalprecht.translate',
                         'angularMoment',
                         'nl2br',
                         'firebase',
                         'lf.services.office', 
                         'lf.services.category',
                         'lf.services.item',
                         'lf.directives.map',
                         'lf.services.camera'])

  .run(function($ionicPlatform, $ionicLoading, $rootScope, $translate,$firebaseObject, OfficeService, CategoryService, ItemService,amMoment,constants) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $rootScope.ref = new Firebase(constants.FIREBASEID);
      var auth = $rootScope.ref.getAuth();

      if(!!auth){
          $rootScope.currentUser = $firebaseObject($rootScope.ref.child('users').child(auth.uid));
          $rootScope.currentUser.$loaded().then(function () {
              console.log($rootScope.currentUser.name);
              console.log($rootScope.currentUser.language);
              $translate.use($rootScope.currentUser.language);
              amMoment.changeLocale($rootScope.currentUser.language);
          });
      }else{
          // usuario no autetificado
          if(typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function(language) {
                console.log(language);
                $translate.use((language.value).split("-")[0]).then(function(data) {
                    console.log("SUCCESS -> " + data);
                }, function(error) {
                    console.log("ERROR -> " + error);
                });
            }, null);
        }else{
          $translate.use("en");
          amMoment.changeLocale("en");
        }
      }

      //Parse.initialize(constants.APP_ID, constants.JS_KEY);
      //$rootScope.currentUser = Parse.User.current();
       $rootScope.languages = [
                                { code: "en",
                                  name: "English" },
                                { code: "es",
                                  name: "Español"},
                                { code: "eu",
                                  name: "Euskara"}
                              ];
      
      /*
      window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({ // this line replaces FB.init({
          appId      : constants.FB_APP_ID, // Facebook App ID
          status     : true,  // check Facebook Login status
          cookie     : true,  // enable cookies to allow Parse to access the session
          xfbml      : true,  // initialize Facebook social plugins on the page
          version    : 'v2.2' // point to the latest Facebook Graph API version
        });
        // Run code after the Facebook SDK is loaded.
      };
      */
     
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));


/*
      $rootScope.alert_collection = {
          'models': []
      };
*/

      initAppInfo();    

      $rootScope.showLoading = function()  {
       $ionicLoading.show({ template: 'Loading...', noBackdrop:true });
      };

      $rootScope.hideLoading = function()  {
        $ionicLoading.hide();
      };

    });

    function initAppInfo() {
        $ionicLoading.show({ template: 'Iniciando aplicacion...', noBackdrop:true });
        console.log("init app");
        OfficeService.loadOffice(function(error,office){
          console.log(error);
          console.log("Office: " + office);
            console.log("Office id: " + office.$id);
            $rootScope.office = office;

            // bulk loading of data
            async.parallel([
              function(cb){
                
                CategoryService.fetch(function(error,collection){
                    console.log('fetchCategory Error: ' + error);
                    console.log('Categories: ' + collection);
                    $rootScope.category_collection = collection;
                    cb(error,collection);
                });
                  
                  //cb(null,null);
              },
              function(cb){
                
                ItemService.fetchFoundItems(function(error,collection){
                  console.log('fetchFoundItems Error: ' + error);
                  console.log('FoundItems: '+ collection);
                  $rootScope.founditems_collection = collection;
                  console.log('FoundItemsCollection: ' + $rootScope.founditems_collection);
                  cb(error,collection);
                });
                
                //cb(null,null);
              },
              function(cb){
                ItemService.fetchAlerts(function(error,collection){
                  console.log(collection);
                  console.log(collection.length);
                  console.log(error);
                  $rootScope.alert_collection = collection;
                  console.log(collection);
                  cb(error,collection);
                });
              }
          ], function(err,results){
                  $ionicLoading.hide();
                  if(err)
                    $ionicPopup.alert({ title: err.message })
            });
        });
      }
  })

  .constant('angularMomentConfig', {
//    preprocess: 'unix', // optional
      timezone: 'Europe/Madrid' // optional
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "js/app/components/main/menu.html",
        controller: 'AppCtrl'
      })

      .state('app.foundItems', {
        url: "/found_items",
        views: {
          'menuContent' :{
            templateUrl: "js/app/components/founditems/founditems.html",
            controller: 'FoundItemsCtrl'
          }
        }
      })
      
      .state('app.item', {
        url: "/found_items/:item",
        views: {
          'menuContent': {
            templateUrl: "js/app/components/founditem/founditem.html",
            controller: 'FoundItemCtrl'
          }
        }
      })

      .state('app.officeMessages',{
        url: "/found_items/messages/:item",
        views: {
          'menuContent': {
            templateUrl: "js/app/components/message/office/officemessage.html",
            controller: 'OfficeMessageCtrl'
          }
        }
      })

      .state('app.alertMessages', {
        url: "/alert_items/messages/:item",
        views: {
          'menuContent': {
            templateUrl: "js/app/components/message/alert/alertmessage.html",
            controller: "AlertMessageCtrl"
          }
        }
      })

      .state('app.alerts', {
        url: "/alerts",
        views: {
          'menuContent' :{
            templateUrl: "js/app/components/alerts/alerts.html",
            controller: "AlertsCtrl"
          }
        }
      })

      .state('app.alertitem', {
        url: "/alerts/:item",
        views: {
          'menuContent' :{
            templateUrl: "js/app/components/alertitem/alertitem.html",
            controller: 'AlertItemCtrl'
          }
        }
      })

      .state('app.launchAlert', {
        url: "/launch_alert",
        views: {
          'menuContent' :{
            templateUrl: "js/app/components/launchalert/launchalert.html",
            controller: 'LaunchAlertCtrl'
          }
        }
      })
      
      .state('app.info', {
        url: '/info',
        views: {
          'menuContent' :{
            templateUrl: 'js/app/components/info/info.html',
            controller: 'InfoCtrl'
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'js/app/components/settings/settings.html',
            controller: 'SettingsCtrl' 
          }
        }
      })

      .state('app.signup', {
        url: "/signup",
        views: {
          'menuContent' :{
            templateUrl: "js/app/components/signup/signup.html",
            controller: 'SignUpCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/found_items');

  });
