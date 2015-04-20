myApp.controller('addstudent', ['UserService', 'studentStorage', '$http', '$location', '$scope',
    function(UserService, studentStorage, $http, $location, $scope) {
        // temp local page student storage
        
        if(UserService.get().isLoggedIn){
            console.log("is Logged in")
            
        }else{ 
             $location.path('/login')
                    $location.replace 
        }
        var student = {
            name: studentStorage.get().name,
            company: studentStorage.get().company,
            modules: studentStorage.get().modules,
            level: studentStorage.get().level
        }
        var page = studentStorage.get().page,
            that = this;
        this.nametemp =studentStorage.get().name
        this.companytemp = studentStorage.get().name
        //set page for each time page is open.
        this.setpage = function(page){
            studentStorage.changepage(page)
            console.log("page = " + studentStorage.get().page);
        }
        this.leveltemp = studentStorage.get().level
        this.getstudent = function() {
            return student;
        }
        this.printopen = false
        this.loaded = false;
        this.showfunc = function() {
            that.loaded = true;
        }
        this.buttons = [];
        this.modules = [];
        var savemodules = [];
        this.currentmodules = []
        this.credits = 0;
        this.show = false;
        this.rule = {
            totalcredits: false,
            totalcredits_text: "",
            unitflag: false,
            unitflag_text: "",
            minimumcredits: false,
            minimumcredits_text: "",
            maximumunit: false,
            maximumunit_text: "",
            maximumcredits: true,
            maximumcredits_text: ""
        }
        // change the pages as the users goes through the modules
        this.Next = function() {
            page++
            switch(page) {
                case 1:
                    studentStorage.set(that.nametemp, that.companytemp)
                    studentStorage.setLevel(that.leveltemp)
                    studentStorage.changepage(page);
                    $location.path('/pickmodules')
                    $location.replace
                    break;
                case 2:
                    if( 
                        that.rule.totalcredits == true &&
                        that.rule.unitflag == true &&
                        that.rule.minimumcredits == true&&
                        that.rule.maximumunit == true&&
                        that.rule.maximumcredits == true
                        ){
                        studentStorage.changepage(page);
                        studentStorage.setModules(student.modules)
                        console.log(studentStorage.get().modules)
                        $location.path('/summary')
                    $location.replace
                    break;
                    }
                    break;
                case 3:
                    console.log("in case 3")
                    var callbackfunction = function(code){
                        if (code == 201){
                            studentStorage.reset();
                            console.log("Student added Sucessfully")
                            $location.path('/addstudent')
                            $location.replace
                            
                        }else{
                            console.log(code)
                            page--
                        } 
                    }
                    console.log(callbackfunction)
                    studentStorage.addtodatabase(callbackfunction)
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
                that.modules = data.rows;
                savemodules = data.rows;
                data.rows.forEach(function(item) {
                    that.buttons[parseInt(item.value._id, 10)] = false
                })
                that.modules.forEach(function(item) {
                    item.value.show = true;
                })
                console.log(that.modules)
                console.log(that.modules)
            }).error(function(data, status, headers, config, statusText) {
                console.log(data)
                console.log('status: ' + status)
                console.log('headers: ' + headers)
                console.log(config)
                console.log(statusText)
            })
        }
        //addStudent.addModule(item.value._id, item.value.credits)
        this.addModule = function(id,name,credits) {
            // check module can be added aswell. This should be important when the rule 
            // will need to be used. 
            id = parseInt(id, 10)
            //console.log(that.buttons)
            that.buttons[id] = true;
            //console.log(' BUTTON PICKED : ' + id)
            //console.log(student.modules.indexOf(id))
            var count = 0;
            var array = -1;
            student.modules.forEach(function(item) {
                if(item.modulecode == id) {
                    console.log("module found")
                    array = count;
                }
                count++
            })
            if(array >= 0) {
                console.log("module already picked")
            } else {
                student.modules.push({
                    modulecode: parseInt(id, 10),
                    name:name,
                    credits: credits
                });
                that.buttons[id] = true
                that.credits = that.credits + credits;
                that.checkmodules();
            }
        }
        this.removeModule = function(modulecode, credits) {
            var count = 0;
            var array = -1;
            student.modules.forEach(function(item) {
                if(item.modulecode == modulecode) {
                    console.log("module found")
                    array = count;
                }
                count++
            })
            if(array >= 0) {
                that.buttons[modulecode] = false;
                student.modules.splice(array, 1);
                //put credits back that were taken away.
                that.credits = that.credits - credits;
                that.buttons[modulecode] = false
                that.checkmodules();
            }
            that.checkmodules();
        }
        this.checkmodules = function() {
            that.modules = []
            //variables to count and flag
            var modulecount = 0
            var tempcreditcheck = 0,
                minimumcreditcount = 0,
                maximumcreditcount = 0,
                maximumunitcount = 0;
            // level 4 module rules variables
            var optionalmodulefound = 0;
            var modulefound = false
            console.log("in check modules");
            that.modules = savemodules;
            //              savemodules.forEach(function(item,index) {
            //                 if(item.value.credits > that.credits) {
            //                     item.value.show = false;
            //                     that.modules.splice(index, 1);  
            //                 }else{
            //                     that.modules.push(item);
            //                 }
            //              })
            // check through the student modules against the rules
            // level 1 rules
            //level 2 rules
            if(student.level == 2) {
                student.modules.forEach(function(item, index) {
                    // check it contains  1 unit from the modules
                    if(item.modulecode == 201 || item.modulecode == 203 || item.modulecode == 301 || item.modulecode == 303) {
                        console.log("found 201,203,301,303")
                        that.rule.maximumunit = true
                        maximumunitcount = maximumunitcount + 1;
                    } else {
                        that.rule.maximumunit = false
                    }
                    // minimum of 48 credits
                    if((item.modulecode == 102) || (item.modulecode == 103) || (item.modulecode >= 106 && item.modulecode <= 111) || (item.modulecode >= 113 && item.modulecode <= 114) || (item.modulecode >= 171 && item.modulecode <= 180) || (item.modulecode >= 186 && item.modulecode <= 187) || (item.modulecode == 201) || (item.modulecode >= 203 && item.modulecode <= 206) || (item.modulecode >= 208 && item.modulecode <= 217) || (item.modulecode >= 219 && item.modulecode <= 225) || (item.modulecode >= 229 && item.modulecode <= 230) || (item.modulecode == 232) || (item.modulecode >= 237 && item.modulecode <= 243) || (item.modulecode >= 252 && item.modulecode <= 258) || (item.modulecode >= 271 && item.modulecode <= 281) || (item.modulecode == 301) || (item.modulecode == 303) || (item.modulecode >= 305 && item.modulecode <= 317) || (item.modulecode >= 319 && item.modulecode <= 327) || (item.modulecode >= 329 && item.modulecode <= 351) || (item.modulecode >= 371 && item.modulecode <= 385) || (item.modulecode >= 388 && item.modulecode <= 400) || (item.modulecode >= 435 && item.modulecode <= 437)) {
                        tempcreditcheck = tempcreditcheck + item.credits;
                    }
                    // minmum of 27 credits from these 
                    if((item.modulecode == 201) || (item.modulecode == 203) || (item.modulecode == 204) || (item.modulecode >= 205 && item.modulecode <= 206) || (item.modulecode >= 208 && item.modulecode <= 217) || (item.modulecode >= 219 && item.modulecode <= 225) || (item.modulecode >= 229 && item.modulecode <= 230) || (item.modulecode == 232) || (item.modulecode >= 237 && item.modulecode <= 243) || (item.modulecode >= 252 && item.modulecode <= 258)) {
                        minimumcreditcount = minimumcreditcount + item.credits;
                    }
                    //check it contains a maximum of 12
                    if((item.modulecode >= 171 && item.modulecode <= 180) || (item.modulecode >= 271 && item.modulecode <= 280) || (item.modulecode >= 371 && item.modulecode <= 380)) {
                        maximumcreditcount = maximumcreditcount + item.credits;
                    }
                })
                // check 9 credits from 102 and 204 are there
                student.modules.forEach(function(item, index) {
                    // check it contains 304
                    if(item.modulecode == 102 || item.modulecode == 204) {
                        console.log("in 304")
                        modulecount = modulecount + item.credits
                    }
                })
                if(modulecount == 9) {
                    that.rule.unitflag = true
                } else {
                    that.rule.unitflag = false
                }
                //check all the counts to check its past the number or below the number
                //total credit checks
                if(tempcreditcheck >= 48) {
                    that.rule.totalcredits = true
                } else {
                    that.rule.totalcredits = false;
                }
                // minimum of 27 credits from modules check
                if(minimumcreditcount >= 27) {
                    console.log("minimum credit : " + minimumcreditcount)
                    that.rule.minimumcredits = true
                } else {
                    that.rule.minimumcredits = false
                }
                //not greater then 1 unit
                if(maximumunitcount > 1) {
                    console.log("over 1")
                    console.log()
                    that.rule.maximumunit = false
                } else {
                    console.log("under 1")
                    that.rule.maximumunit = true
                }
                // has a minimum of 12 credits 
                if(maximumcreditcount > 12) {
                    console.log("maximum credit count : " + maximumcreditcount)
                    that.rule.maximumcredits = false
                } else {
                    that.rule.maximumcredits = true
                }
            }
            // // level 3 Rules
            // 
            // 
            // 
            // 
            // 
            // 
            // 
            if(student.level == 3) {
                student.modules.forEach(function(item, index) {
                    // check it contains  1 unit from the modules
                    if(item.modulecode == 201 || item.modulecode == 203 || item.modulecode == 301 || item.modulecode == 303) {
                        console.log("found 201,203,301,303")
                        that.rule.maximumunit = true
                        maximumunitcount = maximumunitcount + 1;
                    }
                    //check it contains a minimum of these modules
                    if((item.modulecode >= 301 && item.modulecode <= 303) || (item.modulecode >= 305 && item.modulecode <= 317) || (item.modulecode >= 319 && item.modulecode <= 327) || (item.modulecode >= 329 && item.modulecode <= 351) || (item.modulecode == 360) || (item.modulecode >= 371 && item.modulecode <= 386) || (item.modulecode >= 388 && item.modulecode <= 400) || (item.modulecode >= 501 && item.modulecode <= 505)) {
                        minimumcreditcount = minimumcreditcount + item.credits;
                    }
                    //check it contains a maximum 
                    if((item.modulecode >= 171 && item.modulecode <= 180) || (item.modulecode >= 271 && item.modulecode <= 280) || (item.modulecode >= 371 && item.modulecode <= 380)) {
                        maximumcreditcount = maximumcreditcount + item.credits;
                    }
                    tempcreditcheck = tempcreditcheck + item.credits
                })
                // check 304 is there
                student.modules.forEach(function(item, index) {
                    // check it contains 304
                    if(item.modulecode == 304) {
                        console.log("in 304")
                        modulecount++
                    }
                })
                if(modulecount == 1) {
                    that.rule.unitflag = true
                } else {
                    that.rule.unitflag = false
                }
                //check all the counts to check its past the number or below the number
                //total credit checks
                if(tempcreditcheck >= 72) {
                    that.rule.totalcredits = true
                } else {
                    that.rule.totalcredits = false;
                }
                // minimum of 36 credits from modules check
                if(minimumcreditcount >= 36) {
                    console.log("minimum credit : " + minimumcreditcount)
                    that.rule.minimumcredits = true
                } else {
                    that.rule.minimumcredits = false
                }
                //not greated then 1 unit
                if(maximumunitcount > 1) {
                    that.rule.maximumunit = false
                } else {
                    that.rule.maximumunit = true
                }
                // has a minimum of 24 credits 
                if(maximumcreditcount > 24) {
                    console.log("maximum credit count : " + maximumcreditcount)
                    that.rule.maximumcredits = false
                } else {
                    that.rule.maximumcredits = true
                }
            }
            // level 4 rules
            // 
            // 
            // 
            // 
            // 
            if(student.level == 4) {
                student.modules.forEach(function(item, index) {
                    // check it contains  1 unit from the modules
                    if(item.modulecode == 201 || item.modulecode == 203 || item.modulecode == 301 || item.modulecode == 303) {
                        console.log("found 201,203,301,303")
                        that.rule.maximumunit = true
                        maximumunitcount = maximumunitcount + 1;
                    } else {
                        that.rule.maximumunit = false
                    }
                    // minimum of 48 credits
                    if((item.modulecode >= 106 && item.modulecode <= 111) || (item.modulecode >= 113 && item.modulecode <= 114) || (item.modulecode >= 171 && item.modulecode <= 180) || (item.modulecode >= 186 && item.modulecode <= 187) || (item.modulecode == 201) || (item.modulecode == 203) || (item.modulecode >= 205 && item.modulecode <= 217) || (item.modulecode >= 219 && item.modulecode <= 225) || (item.modulecode >= 229 && item.modulecode <= 230) || (item.modulecode == 232) || (item.modulecode >= 237 && item.modulecode <= 243) || (item.modulecode >= 252 && item.modulecode <= 258) || (item.modulecode >= 271 && item.modulecode <= 281) || (item.modulecode == 301) || (item.modulecode == 303) || (item.modulecode >= 305 && item.modulecode <= 317) || (item.modulecode >= 319 && item.modulecode <= 327) || (item.modulecode >= 329 && item.modulecode <= 338) || (item.modulecode >= 340 && item.modulecode <= 386) || (item.modulecode >= 389 && item.modulecode <= 400) || (item.modulecode >= 405 && item.modulecode <= 407) || (item.modulecode == 411) || (item.modulecode == 414) || (item.modulecode == 416) || (item.modulecode >= 420 && item.modulecode <= 426) || (item.modulecode >= 432 && item.modulecode <= 437)) {
                        tempcreditcheck = tempcreditcheck + item.credits;
                    }
                    // minmum of 24 credits from these 
                    if((item.modulecode >= 405 && item.modulecode <= 407) || (item.modulecode == 411) || (item.modulecode == 414) || (item.modulecode == 416) || (item.modulecode >= 420 && item.modulecode <= 426) || (item.modulecode >= 432 && item.modulecode <= 437)) {
                        minimumcreditcount = minimumcreditcount + item.credits;
                    }
                    //check it contains a maximum of 4 units
                    if((item.modulecode >= 171 && item.modulecode <= 180) || (item.modulecode >= 271 && item.modulecode <= 280) || (item.modulecode >= 371 && item.modulecode <= 380)) {
                        maximumcreditcount++
                    }
                })
                // check mandatory modules are there from 404 and (102 or 204) are there
                var optionalmodulefound = false;
                var modulefound = false
                student.modules.forEach(function(item, index) {
                    // check it contains 304
                    if(item.modulecode == 404) {
                        modulefound = true
                        modulecount++
                    }
                    if(item.modulecode == 102) {
                        console.log("in 304")
                        optionalmodulefound++
                        modulecount++
                    } else if(item.modulecode == 204 && optionalmodulefound == 0) {
                        console.log("in 304")
                        optionalmodulefound++
                        modulecount++
                    }
                })
                if(modulecount == 2 && optionalmodulefound == 1 && modulefound == true) {
                    that.rule.unitflag = true
                } else {
                    that.rule.unitflag = false
                }
                //check all the counts to check its past the number or below the number
                //total credit checks
                if(tempcreditcheck >= 65) {
                    that.rule.totalcredits = true
                } else {
                    that.rule.totalcredits = false;
                }
                // minimum of 27 credits from modules check
                if(minimumcreditcount >= 24) {
                    console.log("minimum credit : " + minimumcreditcount)
                    that.rule.minimumcredits = true
                } else {
                    that.rule.minimumcredits = false
                }
                //not greater then 1 unit
                if(maximumunitcount > 4) {
                    console.log("over 1")
                    console.log()
                    that.rule.maximumunit = false
                } else {
                    console.log("under 1")
                    that.rule.maximumunit = true
                }
                // has a minimum of 12 credits 
                if(maximumcreditcount > 24) {
                    console.log("maximum credit count : " + maximumcreditcount)
                    that.rule.maximumcredits = false
                } else {
                    that.rule.maximumcredits = true
                }
            }
        }
        this.get = function() {
            return student
        }
        this.printDiv = function(divName) {
            that.printopen = true
  var printContents = document.getElementById(divName).innerHTML;
  var popupWin = window.open('', '_blank', 'width=300,height=300');
  popupWin.document.open()
  popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/style.css" /></head><body>' + printContents + '</html>');
that.printopen = false
        }
        this.Edit=function(){
             $location.path('/addstudent')
                    $location.replace;
                 
         
        }
        $scope.init = function() {
            that.setpage(1);
            // get the modules for the page
            that.getModules();
            // set the rule text for each level
            if(studentStorage.get().level == 2) {
                        that.rule.totalcredits_text= "Need a minimum if 48 credits"
                        that.rule.unitflag_text= "Need 9 Credits from: 102, 204"
                        that.rule.minimumcredits_text= "need a minimum of 27 credits from (201, 203, 204, 205-206, 208-217,219-225, 229-230, 232, 237-243, 252-258, 271-282)"
                        that.rule.maximumunit_text= "need a maximum of 1 unit from (201, 203, 301, 303)"
                        that.rule.maximumcredits_text= "a maximum of 12 credits from (171-180, 271-280, 371-380), Please deselect extra modules."
                    } else if(studentStorage.get().level == 3) {
                        that.rule.totalcredits_text= "need a minimum of 72 credits"
                        that.rule.unitflag_text= "304 is missing"
                        that.rule.minimumcredits_text= "need a minimum of  36 credits from:  301 - 303, 305-317, 319-327, 329-351, 360, 371-386, 388-400, 501-505"
                        that.rule.maximumunit_text= "Need 1 unit from : 201, 203, 301, 303"
                        that.rule.maximumcredits_text= "need a maximum of 24 credits from : 171-180, 271-280, 371-380, Please deselect extra modules"
                    } else if(studentStorage.get().level == 4) {
                        that.rule.totalcredits_text= "Need a minimum total of 80 Credits"
                        that.rule.unitflag_text= "Need 404 and must contain 201 or 302 not both."
                        that.rule.minimumcredits_text= "Need a minimum of 24 credits must come from (405-407, 411,414,416,420-426,432-437)"
                        that.rule.maximumunit_text= "Need 1 unit from : 201, 203, 301, 303"
                        that.rule.maximumcredits_text= "need a maximum of 4 units from : 171-180, 271-280, 371-380, Please deselect extra modules"
                    } else {
                        alert("invalid Level for qualification selected, Please try again")
                        $location.path('/addstudent')
                    $location.replace;
                    }
        }
    }
]);
myApp.factory('studentStorage', ["UserService","$http",
    function(UserService,$http) {
        var student = {
            name: "",
            company: "",
            modules: [],
            level: 3,
            page:0
        }
        return {
            get: function() {
                return student
            },
            set: function(name, company) {
                student.name = name;
                student.company = company
                return student
            },
            setModules: function(modules) {
                student.modules = modules;
                return student
            },
            setLevel: function(level) {
                student.level = level;
                return student
            },
            addtodatabase:function(callback){
                console.log('Add to database')
                var d = new Date();
                var data = {
                    "name":student.name,
                    "company":student.company,
                    "modules": student.modules,
                    "levelofstudy": student.level,
                    "addedBy": UserService.get().username,
                    "dateadded": d,
                    "datemodified":d
                }
                $http({
                url: "http://solihullapprenticeships.iriscouch.com/students/"+ student.name,
                method: 'PUT',
                withCredentials: true,
                headers: {
                    'Authorization': auth_hash(UserService.get().username, UserService.get().password)
                },
                data:data
            }).success(function(data, status, headers, config) {
                callback(status);
            }).error(function(data, status, headers, config, statusText) {
                callback(status);
            })
                
            },
            changepage:function(page){
              student.page = page;
                return student
            },

            reset: function() {
                console.log('Student Storage reset ');
                student = {
            name: "",
            company: "",
            modules: [],
            level: 3,
            page:0
                }
                return student;
            }
        };
    }
])