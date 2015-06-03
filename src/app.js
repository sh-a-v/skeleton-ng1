import angular from 'angular';

export default angular.module('app', [
  'ui.router',
  'ngResource',
  'ngTouch'
]).config(($stateProvider, $locationProvider, $resourceProvider, $httpProvider) => {

  $stateProvider
    .state('index', {
      url: '/',
      title: 'Index'
    });

  $locationProvider
    .html5Mode({
      enabled: true,
      requireBase: false
    });

  $resourceProvider
    .defaults.stripTrailingSlashes = true;

});

angular.bootstrap(document, ['app']);
