app.controller("vcController", function ($scope, $http, $log) {
    $scope.vc_serch = "";

    $scope.gridParam = new GridParam();
    $scope.search = function () {
        $scope.loading = true;

        var param = {
            objSearch: {
                vcno: $scope.vc_serch

            },
            gridOption: $scope.gridParam.ToServerObject()
        }
     
       
        $http.post( root + "api/manageSticker/getEcosticker", param)
            .success(function (response) {
               
              
               

                $scope.data_vc = response.data.items;
                $scope.gridParam.TotalRecord = response.data.page.TotalRecord;
            //    $log.log(response.data.page.TotalRecord);
              //  $log.log(response.data.page.LastPage);
                $scope.gridParam.LastPage = response.data.page.LastPage;
                $.iconMsgBox.close();
                $scope.loading = false;
            }).error(function (response) {
                $.iconMsgBox.close();
                $log.log(response);
            });
    };
    $scope.search();

    $scope.btn_search = function ()
    {
        $scope.search();

    }
    $scope.click_vc = function (a)
    {
        if (a.vc_Status == 'pending') {
            location.href = root + "managesticker/detail?id=" + a.VCId +"&type=upload";
        } else {
            location.href = root + "managesticker/detail?id=" + a.VCId+"&type=view";
        }
       

    }
});