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
    $rootScope.menuPage = false;
    $rootScope.payDoneModal = false;
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
    //loading JSON and put informatio to object
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
    // console.log(JSONObj);
    // show the menu item in modal box
    $scope.showItem = ()=>{
      $scope.menuPage = true;
      console.log(this.event.path)
    }
    $scope.closeBtn = ()=>{
      $scope.menuPage = false;
    }
    $scope.payDone = ()=>{
      $scope.payDoneModal = true;
    }
})
// class for stroe information from JSON file
class coffeeInfo{
  constructor(id,name,price,description,img){
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.img = img;
  }
}
// class for stroe information from shopping cart and calculate tax and total by Item
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
