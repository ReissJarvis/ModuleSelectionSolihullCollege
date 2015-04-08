/**
* Created with Solihull College Apprenticeship module choice.
* User: reissefer
* Date: 2015-04-07
* Time: 07:57 PM
* To change this template use Tools | Templates.
*/
var myApp = angular.module("myApp", ['ngRoute']);
myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/overview', {
            templateUrl: 'templates/overview.html'
        }).when('/login', {
            templateUrl: 'templates/login.html'
        }).otherwise({
            redirectTo: '/login'
        })
    }
])
myApp.controller('Login', ['UserService', '$http', '$location',
        function(UserService, $http, $location) {
            var currentdate = new Date(),
                self = this;
            this.docs = {};
            this.loggedinstate = UserService.get().isLoggedIn
            this.loginlink = function() {
                if(UserService.get().isLoggedIn) {
                    return 'logout'
                } else {
                    return 'login'
                }
            }
            if(UserService.get().isLoggedIn === true) {
                $http({
                    url: 'http://305jarvisr2.iriscouch.com/games/_design/user/_view/allreviews?startkey="' + UserService.get().username + '"&endkey="' + UserService.get().username + '"',
                    method: 'GET',
                    withCredentials: true,
                    headers: {
                        'Authorization': auth_hash(UserService.get().username, UserService.get().password)
                    }
                }).success(function(data, status, headers, config) {
                    console.log(data)
                    self.docs = data.rows
                    console.log(self.docs)
                }).error(function(data, status, headers, config) {
                    console.log(headers);
                    console.log(config);
                })
            } else {
                console.log('not logged in')
                $location.path('/login');
                $location.replace;
            }
        }
    ]);


myApp.factory('UserService', [
        function() {
            var status = {
                isLoggedIn: false,
                username: '',
                password: ''
            }
            return {
                get: function() {
                    return status
                },
                set: function(aUsername, aPassword) {
                    status.username = aUsername;
                    status.password = aPassword;
                    status.isLoggedIn = true;
                    return status;
                },
                reset: function() {
                    console.log('user service reset ');
                    status = {
                        isLoggedIn: false,
                        username: '',
                        password: ''
                    }
                    return status;
                }
            };
        }
    ])

    function auth_hash(username, password) {
        return 'Basic ' + btoa(username + ':' + password);
    }
