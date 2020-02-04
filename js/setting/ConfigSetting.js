

app.controller("ConfigSettingController", function ($scope, $rootScope, $http, $log) {


    $scope.data = {
        Id: '',
        Value: '',
        Description: ''

    }


    $scope.searchData = [];
    $scope.gridParam = new GridParam();

    $scope.search = function () {
        $scope.loading = true;

        var param = {
            gridOption: $scope.gridParam.ToServerObject()
        }

        $.iconMsgBox.template.loading();
        $http.post(root + "api/Setting/LoadConfig", param)
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

    $scope.save = function () {
        $log.log($scope.data);


        $("#modalConfig").modal("hide");

        $.iconMsgBox.template.pleaseWait();
        $http.post(root + "/api/Setting/saveConfig", $scope.data)
           .success(function (response) {
               $log.log(response);

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
                       msg: response.message
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

        $("#modalConfig").modal("show");
      
        $scope.data = {
            Id: a.Id,
            Value: a.Value,
            Description: a.Description
        }

    }
});