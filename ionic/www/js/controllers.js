angular.module('starter.controllers', [])

.controller('AppCtrl',function($scope, $rootScope, $state, $ionicHistory) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
  };

  // function ionichelper(){
  //   $ionicHistory.nextViewOptions({
  //     disableBack: true,
  //     historyRoot:true
  //   });
  // }

  // $scope.clickSearch = function(){
  //   ionichelper();
  //   $state.go('app.search');
  // }

  //   $scope.clickHome = function(){
  //   ionichelper();
  //   $state.go('app.home');
  // }

  //   $scope.clickCategory = function(){
  //   ionichelper();
  //   $state.go('app.category');
  // }

  //   $scope.clickSetting = function(){
  //   ionichelper();
  //   $state.go('app.setting');
  // }

  //   $scope.clickAbout = function(){
  //   ionichelper();
  //   $state.go('app.about');
  // }

  //   $scope.clickFeedback = function(){
  //   ionichelper();
  //   $state.go('app.feedback');
  // }


})


.controller('home', function($scope, $rootScope, $state, $ionicPopup, AuthService, AUTH_EVENTS, Idea, $ionicModal, $q,  $ionicLoading, listenStatus, fireStatus) {

  // $scope.doRefresh = function(){

  //     $http.get('js/data.json').success(function(data){
  //     $scope.data = data;
  //     $scope.$broadcast('scroll.refreshComplete');
  //    })
  //   };


  
  $rootScope.username = AuthService.username();
 
  // $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Unauthorized!',
  //     template: 'You are not allowed to access this resource.'
  //   });
  // });
  
 <!--login-->
  // $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
  //   AuthService.logout();
  //   $state.go('signin');
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Session Lost!',
  //     template: 'Sorry, You have to login again.'
  //   });
  // });
  listenStatus($ionicLoading, $scope);
 
  $scope.setCurrentUsername = function(name) {
    $rootScope.username = name;
  };




  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  }

  $scope.recordsPerRequest = 5;
  $scope.startRecord = 0; //start from 0
  $scope.terminate = false;
  $scope.displayButton = false;

  Idea.get({id:$rootScope.username, sind: $scope.startRecord, capacity: $scope.recordsPerRequest},function(content, code){
    console.log(content);
    $ionicLoading.hide();
    var temp = $rootScope.listOfReference(content.Ideas)
    console.log(temp);
    $scope.data = {'Ideas': temp};
    $scope.startRecord = content["eind"] +1;
    $scope.size = content["size"]; //total number of records
    $scope.displayButton = true;



  }, function(error){
    fireStatus(error.status);
  });



<!--infinite scroll, load more-->


  $scope.loadMore = function() {
    $scope.displayButton = false;  
    console.log("Trying to load more");
    console.log($scope.startRecord);
    if ($scope.startRecord < $scope.size){
      Idea.get({id:$rootScope.username, sind: $scope.startRecord, capacity: $scope.recordsPerRequest},function(content, code){
        console.log(content);
        var temp = $rootScope.listOfReference(content.Ideas)
        angular.forEach(temp, function(record){
          $scope.data.Ideas.push(record);
        })
        $scope.startRecord = content["eind"] +1;
        $scope.capacity = content["capacity"];
        $scope.displayButton = true;



      }, function(error){
        fireStatus(error.status);
      })
    }

    $scope.$broadcast('scroll.infiniteScrollComplete');
  }


  // $scope.doRefresh = function(){

  //   $rootScope.data = null;
  //   $rootScope.data = Idea.get(function(){
  //     $scope.$broadcast('scroll.refreshComplete');
  //   });
    
  //  };

   $scope.findArray = function(ids){
        $rootScope.currentID = ids;
        $state.go('app.details', {id: ids}, {reload:true});
  }

  // $scope.track = function(id, username){
  //   console.log(id);
  //   console.log(username);
  //   <!--pass to API-->
  //   var data = {"Email": username, "Postid": id};
  //   HabitService.save(data, function(content, value){
  //     console.log("Habit recorded");
  //   });
  // }



  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });

  // $timeout(function() {
  //   $ionicLoading.hide();
  //   $ionicPopup.alert({
  //     title: 'Timeout',
  //     template: 'Please check your network.'
  //   });
  // }, 10000);


//rating
// var getAllRating = function(){



//   var promise = [];
//   $rootScope.ratings = [];
//   angular.forEach($scope.data.Ideas, function(idea){
//     var pm = RatingGetService.get({postid: idea.id, email: '0'});
//     promise.push(pm.$promise);
//   });

//   $q.all(promise).then(function(values){
//     angular.forEach(values, function(value){
//       $rootScope.ratings.push(value.rating);

//     });

//   });


// };

// $scope.interpolation = function(value){
//   return $interpolate(value)($scope);
// };

})

.controller('DetailController', function($scope, $rootScope, DetailIdea, AuthService, AUTH_EVENTS, $ionicPopup, $state, $ionicModal, CommentService, $ionicLoading, SimilarService, listenStatus, fireStatus, $ionicHistory){

  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });

  console.log($ionicHistory.viewHistory());

  $scope.displayButton = false;
  DetailIdea.get({id: $rootScope.currentID, email: $rootScope.username}, function(returndata){
      console.log(returndata);
      $scope.datum = $rootScope.pushDetail(returndata);
      // $scope.datum = $rootScope.datum;
      $scope.currentID = $rootScope.currentID;
      
      SimilarService.get({postid:$scope.currentID}, function(content){
        var temp = $rootScope.listOfReference(content.Ideas);
        $scope.qdata = {'Ideas':temp};
        $ionicLoading.hide();

      }, function(error){
        fireStatus(error.status);
      });
  });

  $scope.sections = [['Background', 'rtc'], ['Details','description'], ['Practical Problems Solved', 'pps'],['Success Benefits','success_benefit']];

  $scope.show_section = { "rtc": false, "description": false , "pps": false, "success_benefit" : false};
    $scope.section_select = function(section, $event) {
      $scope.show_section[section] = !$scope.show_section[section];
      $scope.$broadcast('scroll.resize');
  };

  $scope.showSimilar = false;
  $scope.similartopic = function() {
    
    $scope.showSimilar = !$scope.showSimilar;
    //<!--console.log('Similartopic');-->
    //$state.go('similartopic');
  };

//   //   $scope.checkComplete = function(text, limit){
//   //   if (text.length <= limit)
//   //     return text.length;
//   //   while (text.charAt(limit)!= ' '){
//   //     limit+=1;
//   //   }
//   //   return limit;
//   // };




  $scope.findKeyword = function(word){

    $rootScope.keyword = word;
    $state.go('app.searchpage', {id: word})
  }


     $scope.findArray = function(ids){

        $rootScope.currentID = ids;//same as currentPost
        $state.go('app.details', {id:ids});
  }

  //  <!--login authentication-->
  // $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
  //   AuthService.logout();
  //   $state.go('signin');
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Session Lost!',
  //     template: 'Sorry, You have to login again.'
  //   });
  // });
listenStatus($ionicLoading, $scope);


<!--comments related-->
$scope.loadComments = function(Postid){
    commentRetrieve(Postid);
    $scope.openModal();
  }

$ionicModal.fromTemplateUrl('templates/comment.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

    //load comments into CommentController
  var commentRetrieve = function(Postid){
    if (Postid==null)
      return;
    CommentService.get({postid: Postid }, function(content){
      //need to do sth
      $rootScope.insertAllComments(content['Comment'], Postid);

      $scope.allComments = $rootScope.retrieveComments(Postid);
      console.log($rootScope.retrieveComments(Postid));
    }, function(error){
      fireStatus(error.status);
      }
  )};

$scope.commentSubmit = function(comment, postid){
    console.log("Going to submit comments");

    var userid = $rootScope.username;
    if (comment==null || comment ==="")
      return;
    var commentsS = {"Email": userid, "PostID": postid, "Content": comment};
    console.log(commentsS.PostID);
    CommentService.save(commentsS, function(content){
      console.log(content);
      $scope.comment = null; //clear the field
      // $scope.newComments = content['Comment'];
      // if ($scope.newComments.length >= $rootScope.allComments.length){
      //   for (i = $rootScope.allComments.length; i<$scope.newComments.length; i++ ){
      //     $rootScope.allComments.push($scope.newComments[i]);
      //   }
      // }
      $rootScope.insertAllComments(content['Comment'], postid);
      $scope.allComments = $rootScope.retrieveComments(postid);
    }, function(error){
      fireStatus(error.status);
    });

  };


})

.controller('SignInCtrl', function($scope, $rootScope, $state, $ionicPopup, AuthService, $ionicLoading) {
  
  $scope.signIn = function(user) {
    
    $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });

    if ((user == null)|| (user.username==null)||(user.password == null)){
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
      return;
    }

    AuthService.login(user.username, user.password).then(function(authenticated) {
      user.username = "";
      user.password = "";
      console.log("logging in");
      $state.go('app.home', {}, {reload: true});

      $scope.setCurrentUsername(user.username);
    }, function(err) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
    
  };


   $scope.forgotPw = function() {
    console.log('Forgot-pw');
    $state.go('forgotpw');
  };

  $scope.register = function(user) {
    <!--console.log('Register', user);-->
    $state.go('register');
  };
  

  $scope.setCurrentUsername = function(name) {
    $rootScope.username = name;
  };


})

.controller('forgetController', function($scope, $ionicPopup, $state, forgetService){


  $scope.mailValidation = function(text){
    console.log("Mail is " + text);
    if (text ==null){
      var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Please input your email!'
      });
      return;
    }
    Tjson = {"Email": text};
    forgetService.save(Tjson, function(response, code){
      if (response['success']){
        var alertPopup = $ionicPopup.alert({
        title: 'Email is accepted!',
        template: 'A new password has been sent to you.'
      });
        console.log(code);
      }
      else
        var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Unsuccessful'
      });
    });
    


  }

  $scope.cancel = function(){

    $state.go('signin');
  }



})

.controller('registerController', function($scope, $ionicPopup, $state, RegService, AuthService, $rootScope){

  //validation

  $scope.register = function(info){
    if (info == null){
      return;
    }
    if (info.userid ==""|| info.username=="" || info.email==""||info.password==""){
      return;
    }
    var data = {'UserID': info.userid, 'Username': info.username, 'Password': hex_md5(info.password), 'Email': info.email};
    RegService.save(data, function(content){
        console.log(content);
        var alertPopup = $ionicPopup.alert({
        title: 'Registration is successfully!',
        template: 'You can now log in the applcation.'
        });
        alertPopup.then(function(res){
          AuthService.login(info.email, info.password).then(function(authenticated) {
          $state.go('app.home', {}, {reload: true});
          $scope.setCurrentUsername(info.email);
          }, function(err) {
          // $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
        });
      });

    }, function(error){
        var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Cannot register!'
        });
    })

  }

  $scope.setCurrentUsername = function(name) {
    $rootScope.username = name;
  };

  $scope.cancel = function(){

    $state.go('signin');
  }



})


.controller('searchCon',function($scope, QueryService, $rootScope, RatingGetService, $q, DetailIdea, $state, $ionicPopup, $ionicLoading, listenStatus, fireStatus){

    function keywordSplit(keyword){
      var kw = keyword;
      var splitedArray = kw.split(" ");
      return splitedArray;
    };

    function keywordJoin(array){
      var String = array[0];
      for (i = 1; i<array.length; i++){
        String = String + '&' + array[i];
      }

      return String;
    }

    //search settings
    $scope.recordsPerRequest = 5;
    $scope.startRecord = 0; //start from 0
    $scope.terminate = false;
    $scope.displayButton = false;


    $scope.search = function(search, sort){
      $scope.displayButton = false;
      $scope.startRecord = 0;
        $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
        animation: 'fade-in',
        showBackdrop: true,
        maxwidth: 200,
        hideOnStateChange: true
        //duration: 1000
      });

      if (search.keyword == null){
        $ionicLoading.hide();
        return;
      }

      search.keyword = search.keyword.toLowerCase();
      var splitedArray = keywordSplit(search.keyword);
      $scope.joinedArray = keywordJoin(splitedArray);
      var sortingMethod = sort;
      if (sortingMethod ==null){
        sortingMethod = "relevance";
      }
      console.log(sortingMethod);
      QueryService.get({queries: $scope.joinedArray, sind: $scope.startRecord, capacity: $scope.recordsPerRequest, sortMethod: sortingMethod}, function(content1){
        console.log(content1);
        var temp = $rootScope.listOfReference(content1.Ideas);
        $scope.qdata = {"Ideas": temp};
        $ionicLoading.hide();
        $scope.startRecord = content1["eind"] +1;
        $scope.size = content1["size"]; //total number of records
        $scope.displayButton = true;



      }, function(error){
        fireStatus(error.status);
      } );

    }

<!--infinite scroll, load more-->


  $scope.loadMore = function() {
    $scope.displayButton = false;  
    console.log("Trying to load more");
    console.log($scope.startRecord);
    if ($scope.startRecord < $scope.size){
      QueryService.get({queries: $scope.joinedArray, sind: $scope.startRecord, capacity: $scope.recordsPerRequest},function(content, code){
        console.log(content);
        var temp = $rootScope.listOfReference(content.Ideas);

        angular.forEach(temp, function(record){
          $scope.qdata.Ideas.push(record);
        })
        $scope.startRecord = content["eind"] +1;
        $scope.capacity = content["capacity"];
        $scope.displayButton = true;



      }, function(error){
        fireStatus(error.status);
      })
    }


    $scope.$broadcast('scroll.infiniteScrollComplete');
  }


  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  };



//   var getAllRating = function(){




//   var promise = [];
//   $rootScope.ratings = [];
//   angular.forEach($scope.data.Ideas, function(idea){
//     var pm = RatingGetService.get({postid: idea.id, email: '0'});
//     promise.push(pm.$promise);
//   });

//   $q.all(promise).then(function(values){
//     angular.forEach(values, function(value){
//       $rootScope.ratings.push(value.rating);
//       // console.log(value.rating)
//     });

//   });


// };

   $scope.findArray = function(ids){

        $rootScope.currentID = ids;//same as currentPost
        $state.go('app.details', {id:ids});
  }




  // $scope.track = function(id, username){
  //   console.log(id);
  //   console.log(username);
  //   <!--pass to API-->
  //   var data = {"Email": username, "Postid": id};
  //   HabitService.save(data, function(content, value){
  //     console.log("Habit recorded");
  //   });

  // }

    // $("#autocomplete").autocomplete({
    //   source: ["c++","c++","java","php","coldfusion","javascript","asp","ruby"]
    // })

    // $('input').keyup(function(){
    //   this.value = this.value.toLowerCase();
    // });

  //      <!--login authentication-->
  // $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
  //   AuthService.logout();
  //   $state.go('signin');
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Session Lost!',
  //     template: 'Sorry, You have to login again.'
  //   });
  // });
  listenStatus($ionicLoading, $scope);


})





.controller('CategoryController', function($scope, CategoryService, $ionicPopup, $rootScope, $state, $ionicLoading, listenStatus, fireStatus) {

  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });

  $scope.Category = null;

  CategoryService.query( function(content){
    console.log(content);
    $scope.Category = content;
    $ionicLoading.hide();
  }, function(error){
    fireStatus(error.status);
  });

  $scope.items=[];
  $scope.items[0] = "#E19D65";
  $scope.items[1] = "#737373";
  $scope.items[2] = "#079DD9";
  $scope.items[3] = "#A8D95F";
  $scope.items[4] = "#F25C5C";
  $scope.colorInitialize= function(){for (var i=5;i<100;i++){
    $scope.items[i] = $scope.items[Math.floor(Math.random()*5)];
}};

  $scope.findKeyword = function(word){
    $rootScope.keyword = word;
    $state.go('app.searchpage',{id: word}, {reload:true});
    
  };

  listenStatus($ionicLoading, $scope);
})



.controller('RatingController', function($scope, $rootScope, RatingGetService, RatingPostService, $ionicPopup) {
  console.log(this.info);
  $scope.currentID = this.info;
  $scope.rating = 0;
  //get individual rating
  RatingGetService.get({postid: $scope.currentID, email: $rootScope.username }, function(data){
    $rootScope.changeInRating($scope.currentID, data.rating);
    $scope.rating = $rootScope.getInRating($scope.currentID);
  }, function(error){
        var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'Unable to retrieve the rating!'
      });

  });

  $scope.star = ["grey","grey","grey","grey","grey"];
  
  var isRated = false;

  $scope.changeRating = function(number){
    console.log(number);
    $scope.rating = number;
    isRated = true;
    RatingPostService.save({'Email': $rootScope.username, 'Rating': number, 'PostID': $scope.currentID}, function(content, status){
      console.log("rating changed");
      //get average rating
      RatingGetService.get({postid: $scope.currentID, email: "0" }, function(data){
        $rootScope.changeARating($scope.currentID, data.rating);
        console.log($rootScope.detailSource);
        // $rootScope.datum['rating'] = data.rating;
        // console.log($rootScope.datum['rating']);
        // if ($rootScope.data){
        //   for (i = 0; i < $rootScope.data.Ideas.length; i++){
        //     // console.log($rootScope.data[i].id);
        //     // console.log($rootScope.currentID);
        //     if ($rootScope.data.Ideas[i].id == $rootScope.currentID){
        //       $rootScope.data.Ideas[i].rating = data.rating;
        //       console.log("Found data in home");
        //       break;
        //     }
        //   }
        // }
        // if ($rootScope.qdata){
        //   for (i = 0 ;i <$rootScope.qdata.Ideas.length; i++){
        //     if ($rootScope.qdata.Ideas[i].id == $rootScope.currentID){
        //       $rootScope.qdata.Ideas[i].rating = data.rating;
        //       break;
        //     }
        //   }
        // }

      }, function(error){
    var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'Unable to retrieve the rating!'
      });

      })
    }, function(error){
        var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'Unable to save the rating!'
      });
    });
  }

  $scope.$watch(function(){return $scope.rating}, function(nV, oV){
   
    // console.log($rootScope.ratings[controll.info]);
    var i = 0;
    for (; i < nV; i++){
      $scope.star[i] = "gold";
    }
    for (; i <5; i++){
      $scope.star[i] = "grey";
    }
    // console.log($scope.star);
  });

  $scope.getStarColor = function(id){
    if (id <= $scope.rating){
      return "gold";
    }
    else
      return "grey";
  }
})

.controller('UnchangeRatingController', function($scope,$http, $rootScope) {
  
  var controll = this;
  // $scope.rating = $rootScope.ratings[controll.info];

  $scope.star = ["grey","grey","grey","grey","grey"];

  $scope.$watch(function(){return controll.info}, function(nV, oV){
   
    // console.log($rootScope.ratings[controll.info]);
    var i = 0;
    for (; i < nV; i++){
      $scope.star[i] = "gold";
    }
    for (; i <5; i++){
      $scope.star[i] = "grey";
    }
    // console.log($scope.star);
  });


  
  $scope.changeRating = function(number){
    $scope.rating = number;
    isRated = true;
  }
  $scope.getStarColor = function(id){
    if (id <= $scope.rating){
      return "gold";
    }
    else
      return "grey";
  }
})




.controller("tagSearchCon", function($scope, QueryService, $rootScope, $ionicLoading, $ionicPopup, $state, listenStatus, fireStatus){


    //search settings
    $scope.recordsPerRequest = 5;
    $scope.startRecord = 0; //start from 0
    $scope.terminate = false;
    $scope.displayButton = false;
    $scope.keyword = $rootScope.keyword;

    QueryService.get({queries: $scope.keyword, sind: $scope.startRecord, capacity: $scope.recordsPerRequest}, function(content1){
        console.log(content1);
        $ionicLoading.hide();
        var temp = $rootScope.listOfReference(content1.Ideas);
        $scope.qdata = {'Ideas':temp};
        $scope.startRecord = content1["eind"] +1;
        $scope.size = content1["size"]; //total number of records
        $scope.displayButton = true;



      }, function(error){
        fireStatus(error.status);

      } );


  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });

  listenStatus($ionicLoading, $scope);

    <!--infinite scroll, load more-->


  $scope.loadMore = function() {
    $scope.displayButton = false;  
    console.log("Trying to load more");
    console.log($scope.startRecord);
    if ($scope.startRecord < $scope.size){
      QueryService.get({queries: $scope.keyword, sind: $scope.startRecord, capacity: $scope.recordsPerRequest},function(content, code){
        console.log(content);
        var temp = $rootScope.listOfReference(content.Ideas);
        angular.forEach(temp, function(record){
          $scope.qdata.Ideas.push(record);
        })
        $scope.startRecord = content["eind"] +1;
        $scope.capacity = content["capacity"];
        $scope.displayButton = true;



      }, function(error){
        fireStatus(error.status);
      })
    }


    $scope.$broadcast('scroll.infiniteScrollComplete');
  }


  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  };

   $scope.findArray = function(ids){

    $rootScope.currentID = ids;//same as currentPost
    $state.go('app.details', {id:ids});

  }


})

.controller('SettingCtrl', function($scope) {

  $scope.onItemDelete = function(item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
  };
  
  $scope.items = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
    { id: 16 },
    { id: 17 },
    { id: 18 },
    { id: 19 },
    { id: 20 }

  ];
  
})

.controller('FeedbackCtrl', function($scope, $ionicPopup) {
  $scope.sendEmail = function(subject, body) {
      var link = "mailto:test@123.com"
               + "?subject=New%20email " + escape(subject)
               + "&body=" + escape(body); 
               
      window.location.href = link;

      var alertPopup = $ionicPopup.alert({
      title: 'Sent',
      template: 'Your Feedback is well received.'
      });
   };
});