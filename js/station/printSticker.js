var id = $.parameter("id");

app.controller("stPrintController", function ($scope, $http, $log) {
  

    $scope.render = function () {
        var param =
            {
                obj: {
                    Id: id
                }
            }
        $http.post(root + "api/manageSticker/getimagevinno", param)
         .success(function (response) {

             if (response.status != "1") {
                 $.iconMsgBox.template.status("Status", "Error 500 : " + response.message, [{ text: "Close", click: function () { $.iconMsgBox.close(); } }]);
                 return;
             } else {
                 $scope.image = response.data.StorageMethod;
                 $log.log($scope.image);
             }


         }).error(function (response) {
             $.iconMsgBox.close();
             $log.log(response);
         });
    }
    $scope.render();

    $scope.auto_print = function ()
    {

    }
});