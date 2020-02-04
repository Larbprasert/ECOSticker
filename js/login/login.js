

app.controller("loginController", function ($scope, $http, $log) {
 
    $scope.Username = "Administrator@mg.com";
    $scope.Password = "password";

    $scope.signin = function () {
        var alt = "";
        if ($scope.Username == "" || $scope.Username == undefined) alt += "<div class='text-center'>Please enter Username.</div>";
        if ($scope.Password == "" || $scope.Password == undefined) alt += "<div class='text-center'>Please enter Password.</div>";

        if (alt != "") {
            $.iconMsgBox.template.status("Warning", alt, [{ text: "Close", click: function () { $.iconMsgBox.close(); } }]);
            return;
        }

        $.iconMsgBox.template.pleaseWait();
        var param = { "Username": $scope.Username, "Password": $scope.Password };

        $http.post(root + "api/login/Login", param)
        .success(function (response) {
         
            if (response.status == "0") {
                $.iconMsgBox.template.status("Error",response.message, [{ text: "Close", click: function () { $.iconMsgBox.close(); } }]);
                return;
            }
        
        
            var data = { users: response.data, role: response.optional };
            $log.log(response.optional);
            $.cookie.json = true;
            $.cookie('userecosticker', data, { expires: 365, path: '/' });
          
       window.location.href = root+"home";

        }).error(function (response) {
            $log.log(response);
        });


    }


});