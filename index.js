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
spaApp.controller("spaCtrl",($scope,$http)=>{
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
    //loading JSON
    let JSONdata = [];
    let JSONObj = [];
    let id = 1;
    $http.get('./files/data.json').then(
      (response)=>{
        JSONdata = response.data;
        // console.log(JSONdata);
        for(let obj of JSONdata){
          ItemObj = new coffeeInfo(id,obj.name,obj.price,obj.description,obj.img);
          JSONObj.push(ItemObj);
          id++;
        }
      }
    );
    console.log(JSONObj);
})

spaApp.controller("menuCtrl", ($scope) => {
  $scope.data = 
  console.log('Talking from menu');
})

class coffeeInfo{
  constructor(id,name,price,description,img){
    this.id = id;
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
