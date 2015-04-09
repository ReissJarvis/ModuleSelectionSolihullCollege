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
        $routeProvider.when('/mainpage', {
            templateUrl: 'templates/mainpage.html'
        }).when('/login', {
            templateUrl: 'templates/login.html'
        }).when('/signup', {
            templateUrl: 'templates/signup.html'
        }).when('/logout', {
            templateUrl: 'templates/logout.html'
        }).when('/addstudent', {
            templateUrl: 'templates/addstudent.html'
        }).when('/pickmodules', {
            templateUrl: 'templates/pickmodules.html'
        }).otherwise({
            redirectTo: '/login'
        })
    }
])
myApp.controller('Login', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
        this.username = '';
        this.password = '';
        this.login = function() {
            UserService.set(this.username, this.password);
            console.log(UserService.get().username + UserService.get().password + UserService.get().isLoggedIn);
            var userpassword = this.password;
            var self = this;
            self.docs = {};
            $http({
                url: 'http://solihullapprenticeships.iriscouch.com/students/_all_docs',
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Authorization': auth_hash(UserService.get().username, UserService.get().password)
                }
            }).success(function(data, status, headers, config) {
                $location.path('/mainpage');
                $location.replace;
            }).error(function(data, status, headers, config, statusText) {
                console.log(headers);
                console.log(config);
                console.log(status);
                console.log(statusText)
            })
        };
        this.stop = function() {
            return false;
        };
    }
]);
myApp.controller('signUpController', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
        'use strict';
        this.signupdetails = {
            username: '',
            password: ''
        }
        var that = this
        console.log(this.signupdetails);
        this.signup = function() {
            var user = {
                name: this.signupdetails.username,
                password: this.signupdetails.password,
                roles: ['assessor'],
                type: 'user'
            }
            console.log('doing PUT')
            console.log(user)
            $http({
                url: "http://solihullapprenticeships.iriscouch.com/_users/org.couchdb.user:" + user.name,
                method: 'PUT',
                withCredentials: true,
                headers: {
                    'Authorization': auth_hash('reissjarvis', 'test')
                },
                data: user
            }).success(function(data, status, headers, config) {
                console.log('user added')
                $location.path('/mainpage');
                $location.replace;
            }).error(function(data, status, headers, config, statusText) {
                console.log(data)
                console.log('status: ' + status)
                console.log('headers: ' + headers)
                console.log(config)
                console.log(statusText)
            })
        }
    }
]);
myApp.controller('mainController', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
        this.username = ""
        this.data = ""
        this.setLogin = function() {
            if(UserService.get().isLoggedIn) {
                this.data = {
                    string: "You're Signed In As: " + UserService.get().username + " ",
                    loginstate: "Logout",
                    href:'logout'
                }
            } else {
                this.data = {
                    string: "You're Not Signed In",
                    loginstate: "Login",
                    href:'login'
                }
            }
        }
    }
]);
myApp.controller('logout', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
        this.logout = function() {
            UserService.reset();
            $location.path('/login');
            $location.replace;
        }
        this.logout();
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