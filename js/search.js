myApp.controller('searchStudent', ['UserService','studentStorage', '$http', '$location',
    function(UserService, studentStorage, $http, $location) {
        var that = this
          if(UserService.get().isLoggedIn){
            console.log("is Logged in")
            
        }else{ 
             $location.path('/login')
                    $location.replace 
        }
var student = {
            name: "",
            company: "",
            modules: "",
            level: ""
        }
this.get = function(){
    return student;
}
        this.searchBy = "name"
        this.searchterm = "";
        this.results = []
        this.loaded = false;
        this.startsearch = false
        this.viewstudent = false;
        this.search = function() {
            console.log(UserService.get())
            if(that.searchterm) {
                that.startsearch = true;
                that.loaded = false;
                var url = ""
                 
                if (that.searchBy == "name"){
                    url= 'http://solihullapprenticeships.iriscouch.com/students/_design/students/_view/byName?startkey="' + that.searchterm + '"&endkey="' + that.searchterm+'"'
                }else{
                    url= 'http://solihullapprenticeships.iriscouch.com/students/_design/students/_view/byCompany?startkey="' + that.searchterm + '"&endkey="' + that.searchterm+'"'
                }
                $http({
                    url: url,
                    method: 'GET',
                    withCredentials: true,
                    headers: {
                        'Authorization': auth_hash(UserService.get().username, UserService.get().password)
                    }
                }).success(function(data, status, headers, config) {
                    console.log(status)
                    if(status == 200) {
                        console.log(config)
                        console.log(data.rows)
                        that.results = data.rows
                        that.loaded = true
                        console.log(auth_hash(UserService.get().username, UserService.get().password))
                    }
                }).error(function(data, status, headers, config, statusText) {
                    console.log(config)
                    console.log(status)
                })
            }else{
                alert("Please enter a search term")
            }
        }
        this.Show= function(item){
            student.name = item.value.name
            student.company = item.value.company
            student.modules = item.value.modules
            that.viewstudent = true;
            
        }
            this.Edit = function(item){
                studentStorage.set(item.value.name, item.value.company)
                studentStorage.setModules(item.value.modules)
                studentStorage.setLevel(item.value.levelofstudy)
                $location.path('/addstudent')
                    $location.replace;
                
            }
    }
]);