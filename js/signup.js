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