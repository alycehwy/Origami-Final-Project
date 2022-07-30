let spaApp = angular.module("spaApp",["ngRoute"]);
spaApp.config(($routeProvider)=>{
    $routeProvider
    .when("/",{
        templateUrl:"./pages/home.html"
    })
    .when("/menu",{
        templateUrl:"./pages/menu.html"
    })
    .when("/cart",{
        templateUrl:"./pages/cart.html"
    })
    .when("/payment",{
        templateUrl:"./pages/pay.html"
    })
})
spaApp.run(($rootScope)=>{
    $rootScope.loginPage = true;
    $rootScope.requiredName = false;
    $rootScope.requiredLoc = false;
})
spaApp.controller("spaCtrl",($scope)=>{
    $scope.loginPageClose = ()=>{
        if($scope.username == undefined && $scope.location == undefined){
            $scope.requiredName = true;
            $scope.requiredLoc = true;
        }
        else if($scope.username == undefined || $scope.username == ""){
            $scope.requiredName = true;
        }
        else if($scope.location == undefined || $scope.location == ""){
            $scope.requiredLoc = true;
        }
        else{
            $scope.loginPage = false;
        }
    };
    $scope.payClick = ()=>{
        this.router.navigate("/payment");
    }
})

//loading JSON
let JSONdata = [];
spaApp.run(($http) => {
  $http.get('./files/data.json')
  .then((response) => {
    JSONdata = response.data;
    console.log(JSONdata);
  })
})

// Modal --- FIX THIS
console.log('Hello, World!');

var modal = document.getElementById("cart-modal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.addEventListener('click', () => {
  modal.style.display = "block";
});

span.addEventListener('click', () => {
  modal.style.display = "none";
});

window.addEventListener('click', () => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});