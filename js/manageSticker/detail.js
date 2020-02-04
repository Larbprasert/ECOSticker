var id = $.parameter("id");
var type = $.parameter("type");

app.controller("vcController", function ($scope, $http, $log) {
    $scope.gridParam = new GridParam();
  //  $('#imglogo').attr("src", root + '/api/manageSticker/getimage/' + 'e14d0036761a40ab9b687e18a9d6679c');
    $scope.type = type;
    $scope.check_dataeco = 0;
    $scope.vc_data = function () {
        $scope.data_vc = [];
      
    
        var param = {
            objSearch: {
                Id:id

            }

        }
        $log.log(param);
       
        if (type == "upload") {
            $http.post(root + "api/manageSticker/getvcdata", param)
            .success(function (response) {




                $scope.data_vc = response.data[0];

                $log.log(response);

                $.iconMsgBox.close();
           
            }).error(function (response) {
                $.iconMsgBox.close();
                $log.log(response);
            });
        } else {
            $http.post(root + "api/manageSticker/getvieweco", param)
            .success(function (response) {




                $scope.data_vc = response.data[0];
                $scope.vwimage = root + '/api/manageSticker/getimage/' + $scope.data_vc.Img_Picture;
                $scope.vwsticker = root + '/api/manageSticker/getimage/' + $scope.data_vc.Stk_Picture;
                $scope.vin_data();
                $log.log(response);

                $.iconMsgBox.close();
                $scope.loading = false;
            }).error(function (response) {
                $.iconMsgBox.close();
                $log.log(response);
            });
        }
        
    };
    $scope.vc_data();


    $scope.ul_data = function (id) {
        $scope.data_eco = [];
        $.iconMsgBox.template.loading();

        var param = {
            objSearch: {
                Id: id

            }

        }
        $log.log(param);
       
        $http.post(root + "api/manageSticker/getecodata", param)
            .success(function (response) {



                $("#btn_save").attr('disabled', false);
                $scope.data_eco = response.data[0];
                $scope.image = root + '/api/manageSticker/getimage/' + $scope.data_eco.Img_Picture;
                $scope.sticker = root + '/api/manageSticker/getimage/' + $scope.data_eco.Stk_Picture;
                $log.log($scope.check_dataeco);
               
                $.iconMsgBox.close();
               
            }).error(function (response) {
                $.iconMsgBox.close();
                $log.log(response);
            });
    };
  
    $scope.click_vc = function (a) {
        location.href = "detail?id=" + a.VCId;

    }

    $scope.vin_data = function () {

        var param = {
            objSearch: {
                Id: id

            },
            gridOption: $scope.gridParam.ToServerObject()
        }

        $http.post(root + "api/manageSticker/getvin", param)
            .success(function (response) {




                $scope.data_vin = response.data.items;
                $scope.gridParam.TotalRecord = response.data.page.TotalRecord;
                //    $log.log(response.data.page.TotalRecord);
                //  $log.log(response.data.page.LastPage);
                $scope.gridParam.LastPage = response.data.page.LastPage;
               
            }).error(function (response) {
                $.iconMsgBox.close();
                $log.log(response);
            });
    };
    


    $scope.save = function () {
        $.iconMsgBox({
            title: "Confirm",
            msg: "Do you want to save this sticker?",
            target: "#vcController",
            lockScreen: true,
            buttons: [
                {
                    text: "OK", click: function () {
                        $.iconMsgBox.template.pleaseWait();
                        var eco = $scope.data_eco;
                        var param = {

                            eCo: eco



                        }
                        $log.log(param);

                        $http.post(root + "api/manageSticker/saveuploadecosticker", param)
                            .success(function (response) {

                                if (response.status != "1") {
                                    $.iconMsgBox.template.status("Status", "Error 500 : " + response.message, [{ text: "Close", click: function () { $.iconMsgBox.close(); } }]);
                                    return;
                                }

                                $.iconMsgBox.template.status("Status",
                                    "Save complete",
                                    [{
                                        text: "OK", click: function () {
                                            $.iconMsgBox.close();
                                            location.href = "index";

                                        }
                                    }]
                                );


                            }).error(function (response) {
                                $.iconMsgBox.close();
                                $log.log(response);
                            });
                    }
                },
                {
                    text: "Cancel", click: function () { $.iconMsgBox.close(); }
                }
            ]
        });





      

    }
    $scope.test = function () {
        $scope.check_dataeco = 0;
       // $.iconMsgBox.close();
    }
});