angular.module('starter.controllers', [])

.controller('AppCtrl', ['AuthService' ,function($scope, $rootScope, $ionicModal, $timeout, AuthService) {
  
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



}])

.controller('home', ['$scope', '$rootScope', '$state','$ionicPopup', 'AuthService' , 'AUTH_EVENTS','Idea', '$http', '$stateParams', '$ionicModal', 'CommentService','RatingGetService', '$interpolate','$q', 'HabitService', 'DetailIdea', function($scope, $rootScope, $state, $ionicPopup, AuthService, AUTH_EVENTS, Idea, $http, $stateParams, $ionicModal,CommentService, RatingGetService, $interpolate, $q, HabitService, DetailIdea ) {

  // $scope.doRefresh = function(){

  //     $http.get('js/data.json').success(function(data){
  //     $scope.data = data;
  //     $scope.$broadcast('scroll.refreshComplete');
  //    })
  //   };

  // $http.get("js/data.json").success(function(data){
  //     $scope.data = data;
  //     for (i=0; i< $scope.data.Ideas.length ; i++){
  //       $scope.data.Ideas[i].id = i;
  //     }
  // })

  $rootScope.username = AuthService.username();
 
  // $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Unauthorized!',
  //     template: 'You are not allowed to access this resource.'
  //   });
  // });
 <!--login-->
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('signin');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 
  $scope.setCurrentUsername = function(name) {
    $rootScope.username = name;
  };

 <!--login-->


  $scope.currentPage = $stateParams.id;

  // $scope.like = function(id, input){
  //   if (!$scope.toggleLikes){
  //     input.Ideas[id].likes_count+=1;
  //     $scope.toggleLikes= !$scope.toggleLikes;
  //   }
      
  // };

  //   $scope.unlike = function(id, input){
  //   if($scope.toggleLikes){
  //   input.Ideas[id].likes_count-=1;
  //   $scope.toggleLikes =!$scope.toggleLikes;
  //   }
  // };

  // $scope.toggleLikes = false;

  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  }

  $scope.tagProcessor = function(text){
    var returnTag ="";

    if (text){
      var tagArray = text.split(", ");
      for (i = 0; i < tagArray.length; i++){
        returnTag = returnTag.concat("#" + tagArray[i] + " ");
      }
      return returnTag.substring(0, returnTag.length-1);
    }

  }
  
  $scope.data = Idea.get({id:$rootScope.username},function(content, code){
    console.log(content);
    console.log(code);
    // getAllRating();

  });

  $scope.loadDetails = function(ids){
    DetailIdea.get({id: ids}, function(returndata){
        console.log(returndata);
        $rootScope.datum = returndata;
    });
  }

<!--infinite scroll, load more-->
$scope.recordsPerRequest = 10;
$scope.lastRecord = 9; //start from 0

  $scope.loadMore = function() {
    // var params = {};
    // if ($scope.data.length > 0){
    //   params['after'] = $scope.data[$scope.data.length - 1].name;
    // }
    // $scope.data = Idea.get();


    $scope.$boardcast('scroll.infiniteScrollComplete');
  }


  $scope.doRefresh = function(){

    $scope.data = null;
    $scope.data = Idea.get(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
    
   };

   $scope.findArray = function(id){
    for (i=0; i< $scope.data.Ideas.length; i++){
      if ($scope.data.Ideas[i].id ==id){
        console.log(i);
        $rootScope.currentIndex = i;
        $rootScope.currentID = id;
      }
    }
    

  }

  $scope.track = function(id, username){
    console.log(id);
    console.log(username);
    <!--pass to API-->
    var data = {"Email": username, "Postid": id};
    HabitService.save(data, function(content, value){
      console.log("Habit recorded");
    });
  }

//needs attention
$scope.sections = [['Background', 'rtc'], ['Details','description'], ['Practical Problems Solved', 'pps'],['Success Benefits','success_benefit']];

 $scope.show_section = { "rtc": false, "description": false , "pps": false, "success_benefit" : false};
    $scope.section_select = function(section, $event) {
      $scope.show_section[section] = !$scope.show_section[section];
      $scope.$broadcast('scroll.resize');
  };



  

  $scope.changePage = function(id){
    $scope.currentPage = id;
  }

  //load comments into CommentController
  var commentRetrieve = function(Postid){
    if (Postid==null)
      return;
    CommentService.get({postid: Postid }, function(content){
      //need to do sth
      $rootScope.currentPost = Postid;
      $rootScope.allComments = content['Comment'];
    })
  }

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




//rating
var getAllRating = function(){

  // RatingGetService.get({postid: 1, email: $rootScope.username}, function(data){
  //   $rootScope.temp = data;
  //   console.log($rootScope.temp.rating[0]);
  // });


  var promise = [];
  $rootScope.ratings = [];
  angular.forEach($scope.data.Ideas, function(idea){
    var pm = RatingGetService.get({postid: idea.id, email: '0'});
    promise.push(pm.$promise);
  });

  $q.all(promise).then(function(values){
    angular.forEach(values, function(value){
      $rootScope.ratings.push(value.rating);
      // console.log(value.rating)
    });

  });

//break
  // var promise = [];
  // for (i = 0; i < $scope.data.Ideas.length; i++){
  //   promise[i] = RatingGetService.get({postid: $scope.data.Ideas[i].id, email: $rootScope.username });
  // };
  
  // $q.all(promise).then(function(data){
  //   console.log(data);
  //   for (j = 0; j< $scope.data.Ideas.length; j++){
  //     $scope.rating2[j] = data[j];
  //   }
  //   console.log($scope.rating2[0]);

  // });

  // for (i = 0; i < $scope.data.Ideas.length; i++){
  //    promise[i].then(function(data){
  //     $rootScope.ratings[i] = data;
  //   })
  // };
};

$scope.interpolation = function(value){
  return $interpolate(value)($scope);
};

}])

.controller('SignInCtrl', function($scope, $rootScope, $state, $ionicPopup, AuthService) {
  
  $scope.signIn = function(user) {
    if ((user == null)|| (user.username==null)||(user.password == null)){
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
      return;
    }
    //debug
    if (user.username ==='admin'){
      $state.go('app.home', {}, {reload: true});
      return; //temporary
    }
    //
    AuthService.login(user.username, user.password).then(function(authenticated) {
      user.username = "";
      user.password = "";
      $state.go('app.home', {}, {reload: true});

      $scope.setCurrentUsername(user.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
    
  };

   $scope.forgotPw = function(user) {
    <!--console.log('Forgot-pw', user);-->
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

.controller('registerController', function($scope, $ionicPopup, $state, RegService){

  //validation

  $scope.register = function(info){
    if (info == null){
      return;
    }
    if (info.userid ==""|| info.username=="" || info.email==""||info.password==""){
      return;
    }
    var data = {'UserID': info.userid, 'Username': info.username, 'Password': info.password, 'Email': info.email};
    RegService.save(data, function(content){
      console.log(content);
        var alertPopup = $ionicPopup.alert({
        title: 'Registration is successfully!',
        template: 'You can now log in the applcation.'
      });
    })

  }


  $scope.cancel = function(){

    $state.go('signin');
  }



})


.controller('searchCon', ['$scope','QueryService','$rootScope', 'RatingGetService', '$q', 'HabitService', function($scope, QueryService, $rootScope, RatingGetService, $q, HabitService){

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

    $scope.search = function(search){
      if (search.keyword == null){
        return;
      }

      var splitedArray = keywordSplit(search.keyword);
      var joinedArray = keywordJoin(splitedArray);
      QueryService.get({queries: joinedArray}, function(content1){
        console.log(content1);
        $scope.data = content1;
        getAllRating();

      } );

      // var jsonF = {"Query": splitedArray}; 
      // Idea.save(jsonF, function(content1){
      //   console.log(content1);
      //   $scope.searchResult = content1['Result'];
      // });
    }

  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  };


  var getAllRating = function(){




  var promise = [];
  $rootScope.ratings = [];
  angular.forEach($scope.data.Ideas, function(idea){
    var pm = RatingGetService.get({postid: idea.id, email: '0'});
    promise.push(pm.$promise);
  });

  $q.all(promise).then(function(values){
    angular.forEach(values, function(value){
      $rootScope.ratings.push(value.rating);
      // console.log(value.rating)
    });

  });


};

   $scope.findArray = function(id){
    for (i=0; i< $scope.data.Ideas.length; i++){
      if ($scope.data.Ideas[i].id ==id){
        console.log(i);
        $rootScope.currentIndex = i;
        $rootScope.currentID = id;//same as currentPost
      }
    }
    

  }

    $scope.loadDetails = function(ids){
    DetailIdea.get({id: ids}, function(returndata){
        $rootScope.datum = returndata;
    });
  }




  $scope.track = function(id, username){
    console.log(id);
    console.log(username);
    <!--pass to API-->
    var data = {"Email": username, "Postid": id};
    HabitService.save(data, function(content, value){
      console.log("Habit recorded");
    });

  }

    $("#autocomplete").autocomplete({
      source: ["c++","c++","java","php","coldfusion","javascript","asp","ruby"]
    })

    $('input').keyup(function(){
      this.value = this.value.toLowerCase();
    });
}])


.controller("CommentController", function($scope, $rootScope,CommentService){

  $scope.commentSubmit = function(comment, postid){
    var userid = $rootScope.username;
    if (comment==null || comment ==="")
      return;
    var commentsS = {"Email": userid, "Postid": postid, "Comment": comment};
    CommentService.save(commentsS, function(content){
      console.log(content);
    });

  };

  $rootScope.allComments = "";


})

.controller('CategoryController', ['$scope', '$http', function($scope,$http) {
  $scope.data = null;
  $http.get('js/data.json').success(function(abcd){
    $scope.data = abcd;
  })
  $scope.items=[];
  $scope.items[0] = "#E19D65";
  $scope.items[1] = "#737373";
  $scope.items[2] = "#079DD9";
  $scope.items[3] = "#A8D95F";
  $scope.items[4] = "#F25C5C";
  $scope.colorInitialize= function(){for (var i=5;i<100;i++){
    $scope.items[i] = $scope.items[Math.floor(Math.random()*5)];
}}
}])

.controller('RatingController', ['$scope', '$rootScope','RatingGetService','RatingPostService', function($scope, $rootScope, RatingGetService, RatingPostService) {
  $scope.rating = 0;
  RatingGetService.get({postid: $rootScope.currentID, email: $rootScope.username }, function(data){
    $scope.rating = data.rating;
  });

  $scope.star = ["grey","grey","grey","grey","grey"];
  
  isRated = false;

  $scope.changeRating = function(number){
    $scope.rating = number;
    isRated = true;
    RatingPostService.save({'Email': $rootScope.username, 'Rating': number, 'PostID': $rootScope.currentID}, function(content, status){
      console.log("rating changed");
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
}])

.controller('UnchangeRatingController', ['$scope', '$http', '$rootScope', '$timeout', function($scope,$http, $rootScope, $timeout) {
  
  var controll = this;
  // $scope.rating = $rootScope.ratings[controll.info];

  $scope.star = ["grey","grey","grey","grey","grey"];

  $scope.$watch(function(){return controll.info]}, function(nV, oV){
   
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
}])

.controller('feedbackController', function($scope, $ionicPopup, $state){

  $scope.feedback = function(feedback){
    var data = {'Title': feedback.title, 
      'Details': feedback.detail};
    
    var alertPopup = $ionicPopup.alert({
      title: 'Sent',
      template: 'Your Feedback is well received.'
      });
    }
  })

;