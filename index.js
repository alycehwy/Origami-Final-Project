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
    .when("/pay",{
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
        if($scope.username == undefined && $scope.location == undefined || $scope.location == ""){
            $scope.requiredName = true;
            $scope.requiredLoc = true;
        }
        else if($scope.username == undefined || $scope.username == ""){
            $scope.requiredName = true;
            $scope.requiredLoc = false;
        }
        else if($scope.location == undefined || $scope.location == ""){
            $scope.requiredName = false;
            $scope.requiredLoc = true;
        }
        else{
            $scope.loginPage = false;
        }
    };
})
class coffeeInfo{
  constructor(name,price,description,img){
    this.name = name;
    this.price = price;
    this.description = description;
    this.img = img;
  }
}
class checkout{
  constructor(name,size,quantity,price){
    this.name = name;
    this.size = size;
    this.quantity = quantity;
    this.price = price;
  }
  CalTotalByItem(){
    let totalByItem = 0;
    totalByItem = this.quantity * this.price;
    totalByItem = totalByItem.toFixed(2);
    return totalByItem
  }
  calTaxByItem(){
    let taxByItem = 0;
    let tax = 5;
    taxByItem = this.quantity * this.price * (tax/100);
    taxByItem = taxByItem.toFixed(2);
    return taxByItem
  }
}
let icedCoffee = new coffeeInfo("Iced Coffee",3.15,"Served lightly sweetened and refreshing taste of the coffee served over ice","url");
console.log(icedCoffee);
let icedCoffeeOrder = new checkout("Iced Coffee","L",5,3.15);
console.log(icedCoffeeOrder)
console.log(icedCoffeeOrder.CalTotalByItem());
console.log(icedCoffeeOrder.calTaxByItem());

// // Modal
// var modal = document.getElementById("cart-modal");
// var btn = document.getElementById("myBtn");
// var span = document.getElementsByClassName("close")[0];

// btn.onclick = function () {
//   modal.style.display = "block";
// }

// span.onclick = function () {
//   modal.style.display = "none";
// }

// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }