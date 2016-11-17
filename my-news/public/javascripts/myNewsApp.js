var app = angular.module("myNews",['ui.router']);
app.factory('posts',['$http',function($http){
	var o ={
		posts:[
		 {title: 'post 1', upvotes: 4 ,comments: {}},
  {title: 'post 2', upvotes: 6 , comments: {}},
  {title: 'post 3', upvotes: 9, comments: {}},
  {title: 'post 4', upvotes: 7 , comments: {}},
  {title: 'post 5', upvotes: 5 ,comments: {}}
  ]
	};
  o.getAll=function(){
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };
	return o;
}]);
app.controller('mainController',['$scope','posts',function($scope,posts){
	$scope.posts = posts.posts;
	$scope.addPost =function(){
		if(!$scope.title || $scope.title === '') { return; }
		$scope.posts.push({title:$scope.title,
			link:$scope.link,
			upvotes:0,
			comments: [
    				{author: 'Joe', body: 'Cool post!', upvotes: 0},
    				{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
  			]
		});
		$scope.title = '';
		$scope.link = '';
	};
	$scope.incrementUpvotes=function(post){
		post.upvotes +=1;
	}
}]);
app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
function($scope, $stateParams, posts){
	$scope.post = posts.posts[$stateParams.id];
	$scope.addComment = function(){
  			if($scope.body === '') { return; }
  			if(!$scope.post.comments){$scope.post.comments={};}
 				 $scope.post.comments.push({
    			body: $scope.body,
    			author: 'user',
    			upvotes: 0
  				});
  $scope.body = '';
  $scope.incrementUpvotes=function(comment){
		comment.upvotes +=1;
  }
  $scope.modifyOrderFunction = function() {
    if ($scope.post.comments) {
    	console.log("it comes inside");
        return '-upvotes';
    }
    else {
        return;
    }
}
};
}]);
app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
$stateProvider.state('home',{
	url :'/home',
	templateUrl :'/home.html',
	controller: 'mainController',
  resolve: {
    postPromise: ['posts', function(posts){
      return posts.getAll();
    }]
  }
}).state('posts', {
  url: '/posts/{id}',
  templateUrl: '/posts.html',
  controller: 'PostsCtrl'
});
$urlRouterProvider.otherwise('home');
}]);
