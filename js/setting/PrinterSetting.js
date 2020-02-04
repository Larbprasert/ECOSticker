

app.controller("PrinterSettingController", function ($scope, $rootScope, $http, $log) {


    $scope.data = {
        Id: '',
        Name: ''
    }


    $scope.searchData = [];
    $scope.gridParam = new GridParam();

    $scope.search = function () {
        $scope.loading = true;

        var param = {
            gridOption: $scope.gridParam.ToServerObject()
        }

        $.iconMsgBox.template.loading();
        $http.post(root + "api/Setting/LoadPrinter", param)
            .success(function (response) {
                // $log.log(response);
                $scope.searchData = response.data.items;

                $scope.gridParam.TotalRecord = response.data.page.TotalRecord;
                $scope.gridParam.LastPage = response.data.page.LastPage;
                $.iconMsgBox.close();

            }).error(function (response) {
                $.iconMsgBox.close();
                $log.log(response);
            });
    };

    $scope.search();

    $scope.modalPrinter = function () {
        $('#modalPrinter').modal("show");
        $scope.data = {
            Id: '',
            Name: ''
        }

    };

    $scope.save = function () {
       // $log.log($scope.data);


        $("#modalPrinter").modal("hide");

        $.iconMsgBox.template.pleaseWait();
        $http.post(root + "/api/Setting/savePrinter", $scope.data)
           .success(function (response) {
              // $log.log(response);

               if (response.status == "1") {
                   $.iconMsgBox({
                       title: 'Success',
                       msg: '<div class="text-center">Save Success</div>',
                       buttons: [
                       {
                           text: 'OK', click: function () {
                               $.iconMsgBox.close();
                               $scope.search();
                           }
                       }

                       ]
                   });
               }


               else {
                   $.iconMsgBox({
                       title: 'error',
                       msg: '<div class="text-center">' + response.message + '</div>',
                       buttons: [{
                           text: 'OK',
                           click: function () {
                               $.iconMsgBox.close();
                               $scope.search();
                           }
                       }

                       ]
                   });
               }
           }).error(function (response) {
               $log.log(response);
               $.iconMsgBox({
                   title: 'error',
                   msg: response.ExceptionMessage,
                   buttons: [
                              {
                                  text: 'OK', click: function () {
                                      $.iconMsgBox.close();
                                      $scope.search();
                                  }
                              }

                   ]
               });

           });


    };

    //edit
    $scope.edit = function (a) {

        $("#modalPrinter").modal("show");
       
        $scope.data = {
            Id: a.Id,
            Name: a.Name
        }

    }

    $scope.delete = function (a) {

        var Id = a.Id;

        $.iconMsgBox({
            title: 'Confirm  Delete',
            msg: '<label> ' + a.Name + '</label>',
            buttons: [
            {
                text: 'OK', click: function () {
                    $.iconMsgBox.close();
                    $.iconMsgBox.template.pleaseWait();
                    $http.post(root + "/api/Setting/DeletePrinter", { Id: Id })
                        .success(function (response) {

                            $log.log(response);
                            $.iconMsgBox.close();
                            $scope.search();

                        }).error(function (response) {
                            $.iconMsgBox.close();
                            $log.log(response);
                        });



                }
            }

            ]
        });


    };
});