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
spaApp.run(($rootScope, $http)=>{
  $rootScope.loginPage = true;
  $rootScope.requiredName = false;
  $rootScope.requiredLoc = false;
  $rootScope.menuPage = false;
  $rootScope.JSONdata = [];
  $rootScope.JSONObj = [];
  $rootScope.cartObj = [];

  let id = 1;
  $http.get('./files/data.json')
  .then((response) => {
      $rootScope.JSONdata = response.data;
      console.log($rootScope.JSONdata);
      for (let obj of $rootScope.JSONdata) {
        ItemObj = new coffeeInfo(id, obj.name, obj.price, obj.description, obj.img);
        $rootScope.JSONObj.push(ItemObj);
        id++;
      }
    }
  );
})
spaApp.controller("spaCtrl",($scope, $rootScope)=>{
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

    // $scope.curObj;
    $scope.showItem = ()=>{
      $scope.menuPage = true;

      // Print the info on the modal
      let curSel = parseInt(this.event.target.dataset.id);
      $scope.curObj = $rootScope.JSONObj.filter(obj => obj.id == curSel);
    }
    $scope.closeBtn = ()=>{
      $scope.menuPage = false;
    }
    $scope.payClick = ()=>{
      this.router.navigateByUrl("/pay");
    }
    $scope.addToCart = () => {
      let cartItem = new checkout($scope.curObj[0].name, $scope.inpSize, $scope.inpQty, $scope.curObj[0].price, $scope.curObj[0].img);
      $rootScope.cartObj.push(cartItem);
      $scope.inpSize = 'S';
      $scope.inpQty = 1;
      $scope.closeBtn();  
    }
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
// class for stroe information from shopping cart and calculate tax and total by Item
class checkout{
  constructor(name,size,quantity,price, img){
    this.name = name;
    this.size = size;
    this.quantity = quantity;
    this.price = price;
    this.img = img;
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