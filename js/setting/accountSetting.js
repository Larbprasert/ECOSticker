

app.controller("accountSettingController", function ($scope, $rootScope, $http, $log) {
    var parentScope = $scope.$parent;
    $scope.arrole = [];
    $rootScope.editdata = {};
    $scope.roleEdit = '';
    $scope.data = {
        Id: '',
        name: '',
        email: '',
        password: '',
        telephone: '',
        roles: ''

    }

    $scope.searchData = [];
    $scope.gridParam = new GridParam();

    $scope.search = function () {
        $scope.loading = true;

        var param = {
            objSearch: {
                name: '',
                email: ''
            },
            gridOption: $scope.gridParam.ToServerObject()
        }

        $.iconMsgBox.template.loading();
        $http.post(root + "api/Setting/LoadAccount", param)
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
    $scope.role = [];
    $rootScope.roles
    $scope.loadRole = function () {
        $http.post(root + "api/Setting/getRole").success(function (response) {

            // $log.log(response);
            role = response.data;
            $scope.role = response.data;
            $rootScope.roles = response.data;


        }).error(function (response) {
            $log.log(response);
        });
    }
    $scope.loadRole();


    $scope.clickc = function (i, r) {
       
        var v = $scope.role.value[i];
      
        if (v == "true") {
            $scope.arrole.push(r.Id);
        } else {

            $scope.arrole = _.without($scope.arrole, r.Id);

        }
        $log.log($scope.arrole);
        $scope.data.roles = $scope.arrole;
    };

    $scope.clickEdit = function ($event, Id) {

        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
       
        if (action == 'add' & $scope.arrole.indexOf(Id) == -1) $scope.arrole.push(Id);
        if (action == 'remove' && $scope.arrole.indexOf(Id) != -1) $scope.arrole.splice($scope.arrole.indexOf(Id), 1);
       
        $log.log($scope.arrole);
       
    };
 


    $scope.modalAccount = function () {



        $scope.arrole = [];
        $scope.data.roles = [];
        $scope.loadRole();
        $("#modalAccount").modal("show");
        $scope.data = {
            Id: '',
            name: '',
            email: '',
            password: '',
            telephone: '',
            roles: ''

        }

    }


    $scope.save = function () {

        $log.log($scope.data);

       
        if ($scope.data.roles == "") {

            $.iconMsgBox({
                title: 'error',
                msg: '<div class="text-center">Please select Role</div>',
                buttons: [
                {
                    text: 'OK', click: function () {
                        $.iconMsgBox.close();
                        
                    }
                }

                ]
            });

            return;
        }

        $("#modalAccount").modal("hide");
        $("#modalEditAccount").modal("hide");
        $.iconMsgBox.template.pleaseWait();
        $http.post(root + "/api/Setting/saveuser", $scope.data)
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
                       msg: '<div class="text-center">'+response.message+'</div>',
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

        $("#modalEditAccount").modal("show");
        $scope.arrole = []
        $scope.data.roles = []
        $scope.data = {
            Id: '',
            name: '',
            email: '',
            telephone: '',
            roles: ''

        }

        //getRolebyuser
        $.iconMsgBox.template.pleaseWait();
        $http.post(root + "api/Setting/getRoleByuser", { Id: a.Id }).success(function (response) {

            //  $log.log(response);
            $scope.roleEdit = response.data;

            var rId = _.filter(response.data, { selected: true });

            var roleId = _.map(rId, function (i) {
                return i.Id;
            });


            $scope.arrole = roleId;
            $log.log(roleId);
            $scope.data.roles = $scope.arrole;

           
            $.iconMsgBox.close();

        }).error(function (response) {
            $log.log(response);
        });



        $scope.data = {
            Id: a.Id,
            name: a.Name,
            email: a.Username,
            telephone: a.Tel,
            roles: $scope.arrole
        }

        // $log.log($scope.data);
      
    }


    //delete
    $scope.delete = function (a) {


        $.iconMsgBox({
            title: 'Confirm  Delete',
            msg: '<div class="text-center"> ' + a.Name + '</div>',
            buttons: [
            {
                text: 'OK', click: function () {
                    $.iconMsgBox.close();
                    $.iconMsgBox.template.pleaseWait();
                    $http.post(root + "/api/Setting/Deleteuser", { Id: a.Id })
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
    }


});