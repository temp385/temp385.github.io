var app = angular.module('ngApp', []);
app.controller('ngCtrl', function($scope, $http) {
	$scope.maxResults="5";
	$scope.btn_prev_disabled=true;
	$scope.btn_next_disabled=true;
	$scope.buildQuery = function() {
		var arg_str=$scope.searchTerm.replace(/[^\w\s]/gi, '');
		var get_str="https://www.googleapis.com/youtube/v3/search?maxResults=" + $scope.maxResults + "&type=video&part=snippet&q=" + arg_str + "&key=AIzaSyDzqrV5otkF16h8F-9HKAMb_IGVBxG16qg";
		executeQuery(get_str);
	}
	$scope.buildQueryNext = function() {
		var arg_str=$scope.searchTerm.replace(/[^\w\s]/gi, '');
		var token=$scope.token_next;
		console.log(token);
		var get_str="https://www.googleapis.com/youtube/v3/search?maxResults=" + $scope.maxResults + "&type=video&pageToken=" + token + "&part=snippet&q=" + arg_str + "&key=AIzaSyDzqrV5otkF16h8F-9HKAMb_IGVBxG16qg";
		executeQuery(get_str);
	}
	$scope.buildQueryPrev = function() {
		var arg_str=$scope.searchTerm.replace(/[^\w\s]/gi, '');
		var token=$scope.token_prev;

		console.log(token);
		var get_str="https://www.googleapis.com/youtube/v3/search?maxResults=" + $scope.maxResults + "&type=video&pageToken=" + token + "&part=snippet&q=" + arg_str + "&key=AIzaSyDzqrV5otkF16h8F-9HKAMb_IGVBxG16qg";
		executeQuery(get_str);
	}
	
	function executeQuery(get_str) {
		//var arg_str=$scope.searchTerm.replace(/[^\w\s]/gi, '');
		//var get_str="https://www.googleapis.com/youtube/v3/search?maxResults=5&type=video&part=snippet&q=" + arg_str + "&key=AIzaSyDzqrV5otkF16h8F-9HKAMb_IGVBxG16qg";
		var item_str="";
		$http({
			method : "GET",
			url : get_str
		}).then(function mySuccess(response) {
			$scope.query = response.data.items;
			$scope.token_next = response.data.nextPageToken;
			if ($scope.token_next) {
				$scope.btn_next_disabled=false;
			} else {
				$scope.btn_next_disabled=true;
			}
			$scope.token_prev = response.data.prevPageToken;
			if ($scope.token_prev) {
				$scope.btn_prev_disabled=false;
			} else {
				$scope.btn_prev_disabled=true;
			}
			var item_count=response.data.items.length;
			item_str="";
			for (i=0; i<item_count; ++i) {
				item_str+=response.data.items[i].id.videoId + ",";
			}
			item_str = item_str.slice(0, item_str.length-1);
			getDurations(item_str);
			//console.log(item_str);
		}, function myError(response) {
			$scope.query = response.statusText;
		});
		
		
		function getDurations(item_str) {
			//console.log(item_str);
			var get_item_str = "https://www.googleapis.com/youtube/v3/videos?id=" + item_str + "&part=contentDetails&key=AIzaSyDzqrV5otkF16h8F-9HKAMb_IGVBxG16qg";
			
			$http({
				method : "GET",
				url : get_item_str
			}).then(function mySuccess(response) {
				var aux_array=[];
				var item_count=response.data.items.length;
				for (i=0; i<item_count; i++) {
					aux_array[i] = parseDuration(response.data.items[i].contentDetails.duration);
				}
				//$scope.videoDetail = response.data.items;
				$scope.videoDetail = aux_array;
			});
		}
	}
	
	function parseDuration(str){
		var hh="00";
		var mm="00";
		var ss="00";
		var duration="hh:mm:ss";
		if (str.indexOf("H") != -1) {
			var h_index= str.indexOf("H");
			if (isNaN(str.charAt(h_index-2))) {
				hh=str.slice(h_index-1,h_index);
			} else {
				hh=str.slice(h_index-2,h_index);
			}
		}
		if (str.indexOf("M") != -1) {
			var m_index= str.indexOf("M");
			if (isNaN(str.charAt(m_index-2))) {
				if (mm != "00") {
					mm="0" + str.slice(m_index-1,m_index);
				} else {
					mm=str.slice(m_index-1,m_index);
				}
			} else {
				mm=str.slice(m_index-2,m_index);
			}
		}
		if (str.indexOf("S") != -1) {
			var s_index= str.indexOf("S");
			if (isNaN(str.charAt(s_index-2))) {
				ss="0" + str.slice(s_index-1,s_index);
			} else {
				ss=str.slice(s_index-2,s_index);
			}
		}
		console.log(hh,mm,ss);
		if (hh == "00" && mm == "00") {
			duration = "0:" + ss;
		} else if (hh == "00") {
			duration = mm + ":" + ss;
		} else {
			duration = hh + ":" + mm + ":" + ss;
		}
		return duration;
	}
	

	$('.videoModal').on('hide.bs.modal', function(e) {    
		var $if = $(e.delegateTarget).find('iframe');
		var src = $if.attr("src");
		$if.attr("src", '/empty.html');
		$if.attr("src", src);
	});

	
	$scope.selectVideo = function(x) {
		$(".videoModal").find("iframe").attr("src", "https://www.youtube.com/embed/" + x.id.videoId);
		$(".videoModal").find(".modal-header").empty().append("<h3>" + x.snippet.title + "</h3>");
		$(".videoModal").find("#description").empty().append(x.snippet.description);
	}
	
});