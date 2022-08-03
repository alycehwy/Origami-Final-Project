let spaApp = angular.module("spaApp",["ngRoute","ngCookies"]);
// SPA function
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

// when page load will run these function
spaApp.run(($rootScope, $http)=>{
  $rootScope.loginPage = true;
  $rootScope.requiredName = false;
  $rootScope.requiredLoc = false;
  $rootScope.menuPage = false;
  $rootScope.err = false;
  $rootScope.cartNum = false;
  $rootScope.JSONdata = [];
  $rootScope.JSONObj = [];
  $rootScope.cartObj = [];

  let id = 1;
  $http.get('./files/data.json') // get the JSON file data
  .then((response) => { 
      $rootScope.JSONdata = response.data; // put the JSON file data in an array
      // console.log($rootScope.JSONdata);
      for (let obj of $rootScope.JSONdata) { // go through the JSON data array and store info to class, then put into JSONObj array
        ItemObj = new coffeeInfo(id, obj.name, obj.price, obj.description, obj.img);
        $rootScope.JSONObj.push(ItemObj);
        id++;
      }
    }
  );
})
spaApp.controller("spaCtrl",($scope,$rootScope,$cookies)=>{
    // login page close function
    $scope.loginPageClose = ()=>{ // check username and location empty or not
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
        else{ // username and location all fill close the login page
            $scope.loginPage = false;
        }
    };

    // $scope.curObj;
    $scope.showItem = ()=>{ // show the item in menu page
      $scope.menuPage = true;
      // Print the info on the modal
      let curSel = parseInt(this.event.target.dataset.id);
      $scope.curObj = $rootScope.JSONObj.filter(obj => obj.id == curSel);
    }

    $scope.closeBtn = ()=>{ // close the menu modal box function
      $scope.menuPage = false;
    }
    // check if cookie already exist
    console.log($cookies.getAll());
    if ($cookies.getAll()) {
      console.log("There's a coookie");
      $scope.username = $cookies.get("Name");
      $scope.buyerTel = $cookies.get("Phone");
      $scope.buyerEmail = $cookies.get("Email");
      $scope.payerName = $cookies.get("cardName");
      $scope.payerCard = $cookies.get("cardNum");
      $scope.payerExp = $cookies.get("Exp");
      $scope.payerCsv = $cookies.get("CSV");
    } else {
      console.log("No cookie");
    }

    $scope.payDone = ()=>{ // Payment button function
      if($rootScope.cartObj == ""){ // check if cartObj have item or not
        alert("You didn't choose items, please back to menu to choose items");
      }
      else{
        $scope.payDoneModal = true; // show the pay done modal
        $rootScope.cartObj = []; // empty the cartObj
        $rootScope.cartNum = false; // empty the cartNum
        // store all info into cookie
        $cookies.put("Name",$scope.username);
        $cookies.put("Phone",$scope.buyerTel);
        $cookies.put("Email",$scope.buyerEmail);
        $cookies.put("cardName",$scope.payerName);
        $cookies.put("cardNum",$scope.payerCard);
        $cookies.put("Exp",$scope.payerExp);
        $cookies.put("CSV",$scope.payerCsv);
        $cookies.put("Total",$rootScope.sum)
      }
    }

    $scope.addToCart = () => { // add seleted item to cartObj
      checkRepeat = false; // variable for identify if add item is same item in cartObj
      if($scope.inpQty >= 1){ // check qty is valid
        if($rootScope.cartObj == ""){ // if cartObj is empty, add item to cartObj
          let cartItem = new checkout($scope.curObj[0].name, $scope.inpSize, $scope.inpQty, $scope.curObj[0].price, $scope.curObj[0].img);
          $rootScope.cartObj.push(cartItem);
        }
        else{ 
          for(let curItem of $rootScope.cartObj){ // if cartObj is not empty go through the cartObj to find if there have same item, then update qty
            if($scope.curObj[0].name == curItem.name && $scope.inpSize == curItem.size){ // check name and size is the same
              curItem.quantity += $scope.inpQty; // update the qty
              checkRepeat = true;
            }
          }
          if(checkRepeat == false){ // if there have no same item, add item to cartObj
            let cartItem = new checkout($scope.curObj[0].name, $scope.inpSize, $scope.inpQty, $scope.curObj[0].price, $scope.curObj[0].img);
            $rootScope.cartObj.push(cartItem);
          }
        }
        $scope.inpSize = 'S'; // define initial size
        $scope.inpQty = 1; // define initial size
        $scope.closeBtn(); // close the menu modal box
        $scope.err = false; // 
        $rootScope.cartNum = true;
        // console.log($rootScope.cartObj)
      }
      else{ // if qty is invalid show error msg
        $scope.err = true;
      }
    }

    $scope.delCart = ()=>{ // delete the single item
      $rootScope.cartObj.splice(event.target.id, 1);
      if($rootScope.cartObj == ""){
        $rootScope.cartNum = false;
      }
    }

    $scope.calTotalTax = ()=>{ // calculate total Tax
      $scope.totalTax = 0;
      for (let tax of $rootScope.cartObj){
        $scope.totalTax += parseFloat(tax.calTaxByItem());
      }
      $scope.totalTax = $scope.totalTax.toFixed(2);
      return $scope.totalTax
    }

    $scope.showTotal = () => { // calculate total price
      $rootScope.sum = 0;
      $rootScope.cartObj.forEach(e => {
        $rootScope.sum += parseFloat(e.CalTotalByItem());
      });
      $rootScope.sum += parseFloat($scope.totalTax);
      $rootScope.sum = $rootScope.sum.toFixed(2);
      return $rootScope.sum
    }

    $scope.cartClear = () =>{ // cart all clear
      $rootScope.cartObj = [];
      $rootScope.cartNum = false;
    }

    $scope.cartPay = () =>{ // check cartObj is empty or not before pay
      if($rootScope.cartObj == ""){ // if is empty show alert and stay same page
        alert("You didn't choose items");
        $scope.cartLink = "#!cart";
      }
      else{ // if is not empty jump to pay page
        $scope.cartLink = "#!pay";
      }
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