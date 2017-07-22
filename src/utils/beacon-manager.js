import beacons from '../data/beacons';

let BeaconManager = (function( cordova ){

	let _regions = [];

	let monitor = {

		start : function(){

			console.log(cordova.plugins.locationManager);

			// Region 1
			let uuid = beacons.LEMON.UUID;
			let identifier = 'LEMON';
			let minor = beacons.LEMON.minor;
			let major = beacons.LEMON.major;

			// Check if Cordova is ready
			if( cordova ){

				let delegate = new cordova.plugins.locationManager.Delegate();
		
				delegate.didDetermineStateForRegion = function (pluginResult) {
				   console.log('[DOM] didDetermineStateForRegion: ' , pluginResult);				   
				   alert("[didDetermineStateForRegion]" + pluginResult.region.uuid + " " + pluginResult.state);

				};

				delegate.didStartMonitoringForRegion = function (pluginResult) {
				    console.log('didStartMonitoringForRegion:', pluginResult);
				    console.log('didStartMonitoringForRegion:' , pluginResult);				    
					alert("[didStartMonitoringForRegion] " + pluginResult.region.uuid);
				};

				delegate.didRangeBeaconsInRegion = function (pluginResult) {
				   console.log('[DOM] didRangeBeaconsInRegion: ',pluginResult);

				   alert("[didRangeBeaconsInRegion]" + pluginResult.region.uuid);
				};



				let beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

				_regions.push(beaconRegion);

				cordova.plugins.locationManager.setDelegate(delegate);

				// required in iOS 8+
				cordova.plugins.locationManager.requestWhenInUseAuthorization();				

				cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
					.fail(function(e) { console.error(e); })
					.done();

				// cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
				// 	.fail(function(e) { console.error(e); })
				// 	.done();

				console.log(_regions,cordova.plugins.locationManager);
			}
		},

		stop: function(){

			_regions.map(function(region,index){

				cordova.plugins.locationManager.stopMonitoringForRegion(beaconRegion)
					.fail(function(e) { console.error(e); })
					.done();	
			});				
		
		}			
		
	};

	return monitor;

}(cordova));

module.exports = BeaconManager;

