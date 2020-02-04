app.controller("vcController", function ($scope, $http, $log) {
    $scope.dataPrint = [];
    $http.post(root + "api/manageSticker/testPrinter")
         .success(function (response) {
            // $scope.dataPrint = response.data;
             $log.log(response);

         }).error(function (response) {
             $.iconMsgBox.close();
             $log.log(response);
         });
});