var videoApp = angular.module('videoApp',[]);

videoApp.controller('videoController',['$scope','$window','$interval',function($scope,$window,$interval) {
    $scope.videoDisplay = document.getElementById('VideoElement');
    $scope.videoSource  = $window.videoSource;
    $scope.titleDisplay  = $window.titleDisplay;
    $scope.videoDescription  = $window.videoDescription;
    $scope.videoPlaying = false;
    $scope.currentTime;
    $scope.totalTime;
    $scope.scrubTop = -1000;
    $scope.scrubLeft = -1000;
    $scope.vidHeightCenter = -1000;
    $scope.vidWidthCenter = -1000;
    
    //we are using angular's interval function to update layout every 100ms
    $interval(function(){
        var t = $scope.videoDisplay.currentTime;
        var d = $scope.videoDisplay.duration;
        var w = t / d * 100;
        var p = document.getElementById('progressMeterFull').offsetLeft + document.getElementById('progressMeterFull').offsetWidth;
        $scope.scrubLeft = (t / d * p) - 7;
        $scope.updateLayout();
    }, 100);
    
    
    $scope.initPlayer = function() {
        $scope.currentTime = 0;
        $scope.totalTime = 0;
        $scope.videoDisplay.addEventListener("timeupdate", $scope.updateTime, true);
        $scope.videoDisplay.addEventListener("loadedmetadata", $scope.updateData, true);
    }
    
    $scope.updateTime = function(e) {
        $scope.currentTime = e.target.currentTime;
        //$scope.updateLayout();
        if($scope.currentTime == $scope.totalTime){
            $scope.videoDisplay.pause();
            $scope.videoPlaying = false;
            $scope.currentTime = 0;
            $('#playBtn').children("span").toggleClass("glyphicon-play", true);
            $('#playBtn').children("span").toggleClass("glyphicon-pause", false);
        }
    }
    
    $scope.updateData = function(e) {
        $scope.totalTime = e.target.duration;
    }
    
    //sometime we have to force angular to update the DOM ,so whenever we need to update the layout we can invoke this function
    $scope.updateLayout = function(){
        $scope.scrubTop = document.getElementById('progressMeterFull').offsetTop-2;
        $scope.vidHeightCenter =  $scope.videoDisplay.offsetHeight/2 - 50;
        $scope.vidWidthCenter = $scope.videoDisplay.offsetWidth/2 - 50;
        //one thing we have to be careful of is using phase,we have to check if phase is true or false
        //because we dont want to force updation when its doing already,there can be a conflict
        //using $scope.apply() to force real time updation of time.
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

//custom Filters are created outside the controllers
videoApp.filter('time', function() {
    return function(seconds) {
        var hh = Math.floor(seconds / 3600), mm = Math.floor(seconds / 60) % 60, ss = Math.floor(seconds) % 60;
        return hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
    };
});