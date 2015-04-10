myApp.controller('addstudent', ['UserService', '$http', '$location', '$scope',
    function(UserService, $http, $location, $scope) {
        var student = {
            name: "",
            company: "",
            modules: []
        }
        var page = 0,
            that = this;
        this.getstudent = function() {
            return student;
        }
        this.loaded = false;
        this.showfunc = function() {
            that.loaded = true;
        }
        this.buttons = []
        this.modules = [];
        this.credits = 72;
        this.show = false;
        // change the pages as the users goes through the modules
        this.Next = function() {
            page++
            switch(page) {
                case 1:
//                     StudentService.setDetails(student.name, student.company)
                    $location.path('/pickmodules')
                    $location.replace
                    break;
                case 2:
                    page = 0
                    $location.path('/summary')
                    $location.replace
                    break;
                default:
                    $location.path('/addstudent')
                    $location.replace;
            }
        }
        this.getModules = function() {
            $http({
                url: "http://solihullapprenticeships.iriscouch.com/modules/_design/modules/_view/all",
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Authorization': auth_hash(UserService.get().username, UserService.get().password)
                }
            }).success(function(data, status, headers, config) {
                that.showfunc();
                data.rows.forEach(function(item) {
                    that.modules[parseInt(item.value._id, 10)] = {
                        picked: false,
                        credits: item.value.credits
                    }
                })
                console.log(that.modules)
                that.modules = data.rows
                console.log(that.modules)
            }).error(function(data, status, headers, config, statusText) {
                console.log(data)
                console.log('status: ' + status)
                console.log('headers: ' + headers)
                console.log(config)
                console.log(statusText)
            })
        }
        this.buttonpress = function(id) {
            alert(id)
            id = parseInt(id, 10)
            console.log(id);
            var button = that.buttons[id]
            button = 'remove'
            console.log(button)
            //             this.press = false;
            //             this.buttontext = "Add"
            //             var x = this
            //             this.change = function() {
            //                 x.press = !x.press
            //                 x.buttontext = x.press ? 'Add' : 'Remove'
            //             }
            //             console.log(this.press)
        }
        //addStudent.addModule(item.value._id, item.value.credits)
        this.addModule = function(id, credits) {
            // check module can bbe added aswell. This should be important when the rule 
            // will need to be used. 
            id = parseInt(id, 10)
            console.log(' BUTTON PICKED : ' + id)
            console.log(student.modules.indexOf(id))
            if(student.modules.indexOf(id) > -1) {
                console.log('module already picked')
            } else {
                console.log('new module')
                student.modules.push(parseInt(id, 10));
                console.log(that.modules);
                that.credits = that.credits - credits;
            }
            //check student doesnt contain the module already
        }
        this.removeModule = function(modulecode, credits) {
            // first remove object
            var index = student.modules.indexOf(modulecode);
            if(index > -1) {
                that.student.modules.splice(index, 1);
                //put credits back that were taken away.
                that.credits = that.credits + credits;
                console.log(that.student)
            }
        }
        this.checkmodules = function() {
            // gonna be the most difficult part
        }
        this.get = function() {
            return student
        }
        $scope.init = function() {
            console.log(student)
            that.getModules();
            
        }
    }
]);