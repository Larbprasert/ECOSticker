app.controller("StationController", function ($scope, $rootScope, $http, $log) {
    $scope.VINNO = "";
    $scope.VINNO_search = "";
    $scope.statusSearch = true;
    $scope.error_message = false;
    $scope.success_message = false;
    $scope.search_result = false;
    $scope.preview_template = false;
    $scope.disable_btnprt = true;
    $scope.disable_txtprt = true;
    $scope.message_when_success = "";
    $scope.result = GlobalVar.useronline().role;
    $scope.data_vinno = [];
    $scope.PrinterId = "";
    
 
    $scope.textChange = function (vinno) {
      
       
        $scope.success_message = false;
        if (!$scope.validateVINNO(vinno)) {
            $scope.error_message = true;
            
            $scope.disable_btnprt = true;
            $scope.preview_template = false;
        } else {
            //if ($scope.VINNO_search != vinno) {
            //    $scope.statusSearch = true;
            //} else {
            //    $scope.statusSearch = false;
            //}
         
            $scope.disable_btnprt = false;
            $scope.error_message = false;
        }
      
        $scope.statusSearch = true;
      
       
    }
    $scope.search = function (vinno) {
  
        $.iconMsgBox.template.loading();
        var param =
            {
                obj: {
                    VINNO: vinno,
                        
                }
            }
    
        $http.post(root + "api/manageSticker/searchvinno", param)
         .success(function (response) {
             $.iconMsgBox.close();
             if (response.status != "1") {
                 //$.iconMsgBox.template.status("Status", response.message, [{ text: "Close", click: function () { $.iconMsgBox.close(); } }]);
                 //return;
                 $scope.error_message = true;
                 $scope.preview_template = false;
                 $scope.success_message = false;
                 $scope.VINNO_search = vinno;
                 $scope.search_result = false;
                 $scope.statusSearch = true;
             } else {
               
                 $scope.data_vinno = response.data[0];
                 $scope.VINNO_search = $scope.data_vinno.VINNO;
                 $scope.vwimage = root + '/api/manageSticker/getimage/' + $scope.data_vinno.Img_Picture;
                 $scope.vwsticker = root + '/api/manageSticker/getimage/' + $scope.data_vinno.Stk_Picture;
                 $scope.error_message = false;
                 $scope.success_message = true;
                 $scope.preview_template = true;
                
                 $scope.message_when_success = "Can print.";
                 $scope.search_result = true;
                
             }


         }).error(function (response) {
             $.iconMsgBox.close();
             $log.log(response);
         });
    }


    $scope.click_search = function (vinno) {
      
        
       
        if ( !_.contains($scope.result, "Engineer"))
        {
           
            $scope.error_message = true;
            return;
        }

        if ($scope.statusSearch) { $scope.statusSearch = false; return $scope.search(vinno); }
        else {
          
                    $scope.reprint();
 
        }

      
       // if (vinno == "") 
      //  $scope.search(vinno);
    }

    $scope.reprint = function () {
        
        $rootScope.chUsername = "";
        $rootScope.chPassword = "";
        $('#modalPassword').modal("show");

    }
    $scope.changedPrinter = function (prt) {
       
            
        if (prt !== null) {
            $scope.PrinterId = prt.Id;
            $scope.disable_btnprt = false; 
            $scope.disable_txtprt = false;
            if ($scope.search_result == true) {
                $scope.success_message = true;
            }
           
        } else {
           
            $scope.disable_btnprt = true;
            $scope.disable_txtprt = true;
            $scope.error_message = false;
            $scope.success_message = false;
            }

        
     
    }
    $rootScope.checkPassword = function (user, pass) {

        var param = {
            Username: user,
            Password:pass
        }
        $http.post(root + "api/login/login", param)
            .success(function (response) {

                if (response.status != "1") {
                    $.iconMsgBox.template.status("Status", "Incorrect username or password.", [{ text: "Close", click: function () { $.iconMsgBox.close(); } }]);
                    return;
                } else {
                   
                    if (_.contains(response.optional, "Engineer")) {

                        $('#modalPassword').modal("hide");
                         $scope.print();
                    } else {
                        $.iconMsgBox.template.status("Status", "Role not an Engineer.", [{ text: "Close", click: function () { $.iconMsgBox.close(); } }]);
                        return;
                    }
                   
                }


            }).error(function (response) {
                $.iconMsgBox.close();
                $log.log(response);
            });


    }

    $scope.print = function () {
      

        $.iconMsgBox.template.loading();
            var param =
               {
                   obj: {
                       Id: $scope.data_vinno.Id,
                       printId: $scope.PrinterId,
                       user: GlobalVar.useronline().users.Id
                   }
               }
          
            $http.post(root + "api/manageSticker/generatevinno", param)
             .success(function (response) {

                 if (response.status != "1") {
                     $.iconMsgBox.template.status("Status", "Error 500 : " + response.message, [{ text: "Close", click: function () { $.iconMsgBox.close(); } }]);
                     return;
                 } else {
                     $.iconMsgBox.template.status("Status", "Print successfully.", [{ text: "OK", click: function () { $.iconMsgBox.close(); } }]);
                    // $scope.statusSearch = true;
                     return;
                 }


             }).error(function (response) {
                 $.iconMsgBox.close();
               
             });
        
    }

    $scope.ddl_print = function () {
        $.iconMsgBox.template.loading();
        var param =
            {
                obj: {
                   
                }
            }
      
        $http.post(root + "api/query/getPrinter", param)
         .success(function (response) {
             $.iconMsgBox.close();
             if (response.status != "1") {
                 $.iconMsgBox.template.status("Status", response.message, [{ text: "Close", click: function () { $.iconMsgBox.close(); } }]);
                 return;
              

             } else {
                
                 $scope.print_data = response.data;
               
                 $.iconMsgBox.close();
             }


         }).error(function (response) {
             $.iconMsgBox.close();
             $log.log(response);
         });
    }
    $scope.ddl_print();

    $scope.validateVINNO = function (vinno) {

        var re = /^MML+(W1|B2|B3|W2|W3|W4|A2|A1|L2|Z1|E1)+[2-6]+[1-9|ABCDEFGHJKLNPQTUVWXYZ]+[0-9]+[1-9|A-Y]+T+[0-9]{6}$/;
        return re.test(vinno);
    };
});