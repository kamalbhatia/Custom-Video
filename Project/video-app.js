var videoApp = angular.module('videoApp',[]);

videoApp.controller('videoController',['$scope','$window',function($scope,$window) {
    $scope.videoDisplay = document.getElementById('VideoElement');
    $scope.videoSource  = $window.videoSource;
    $scope.titleDisplay  = $window.titleDisplay;
    $scope.videoDescription  = $window.videoDescription;
    $scope.videoPlaying = false;
    $scope.currentTime;
    $scope.totalTime;
    
    
    $scope.initPlayer = function() {
        $scope.currentTime = 0;
        $scope.totalTime = 0;
        $scope.videoDisplay.addEventListener("timeupdate", $scope.updateTime, true);
        $scope.videoDisplay.addEventListener("loadedmetadata", $scope.updateData, true);
    }
    
    $scope.updateTime = function(e) {
        $scope.currentTime = e.target.currentTime;
        $scope.updateLayout();
    }
    
    $scope.updateData = function(e) {
        $scope.totalTime = e.target.duration;
    }
    
    //sometime we have to force angular to update the DOM ,so whenever we need to update the layout we can invoke this function
    $scope.updateLayout = function(e){
        //one thing we have to be careful of is using phase,we have to check if phase is true or false
        //because we dont want to force updation when its doing already,there can be a conflict
        if(!$scope.$$phase){
            $scope.$apply();
        }
    }
    
    $scope.togglePlay = function() { 
        if($scope.videoDisplay.paused){
            $scope.videoDisplay.play();
            $scope.videoPlaying = true;
            $('#playBtn').children("span").toggleClass("glyphicon-play", false);
            $('#playBtn').children("span").toggleClass("glyphicon-pause", true);
        }else{
            $scope.videoDisplay.pause();
            $scope.videoPlaying = false;
            $('#playBtn').children("span").toggleClass("glyphicon-play", true);
            $('#playBtn').children("span").toggleClass("glyphicon-pause", false);
        }
    }
    
    $scope.toggleMute = function() {
        if($scope.videoDisplay.volume == 0.0){
            $scope.videoDisplay.volume = 1.0;
            $('#muteBtn').children("span").toggleClass("glyphicon-volume-up", true);
            $('#muteBtn').children("span").toggleClass("glyphicon-volume-off", false);
        }else{
            $scope.videoDisplay.volume = 0.0;
            $('#muteBtn').children("span").toggleClass("glyphicon-volume-up", false);
            $('#muteBtn').children("span").toggleClass("glyphicon-volume-off", true);
        }
    }
    
    $scope.initPlayer();
}]);