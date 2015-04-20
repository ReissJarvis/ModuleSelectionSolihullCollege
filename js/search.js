myApp.controller('searchStudent', ['UserService', '$http', '$location',
    function(UserService, $http, $location) {
        var that = this
          if(UserService.get().isLoggedIn){
            console.log("is Logged in")
            
        }else{ 
             $location.path('/login')
                    $location.replace 
        }
        this.searchBy = "name"
        this.searchterm = "";
        this.results = []
        this.loaded = false;
        this.startsearch = false
        this.search = function() {
            console.log(UserService.get())
            if(that.searchterm) {
                that.startsearch = true;
                that.loaded = false;
                //"http://solihullapprenticeships.iriscouch.com/students/_design/students/_view/all?startkey=" + that.searchterm + "&endkey=" + that.searchterm
                $http({
                    url: 'http://solihullapprenticeships.iriscouch.com/students/_design/students/_view/all?startkey="' + that.searchterm + '"&endkey="' + that.searchterm+'"',
                    method: 'GET',
                    withCredentials: true,
                    headers: {
                        'Authorization': auth_hash(UserService.get().name, UserService.get().password)
                    }
                }).success(function(data, status, headers, config) {
                    console.log(status)
                    if(status == 200) {
                        console.log(data.rows)
                        that.results = data.rows
                        that.loaded = true
                        console.log(auth_hash(UserService.get().name, UserService.get().password))
                    }
                }).error(function(data, status, headers, config, statusText) {
                    console.log(data)
                    console.log(status)
                })
            }
        }
    }
]);