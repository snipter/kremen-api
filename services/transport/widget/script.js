$.noConflict();

OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
var map;
var selectControl;
var routeLayer;
var stationLayer;
var layer_style;
var station_style;

var MAP_INIT_X = 33.41;
var MAP_INIT_Y = 49.0658;
var MAP_INIT_ZOOM = 12;

var REFRESH_TIMEOUT = 1000 * 5;
var selectedCountryId = 3;
var serviceURL = "http://infobus.kz";
var selectedCityId = 10;

var selectedBusreportRouteIds = new Array();
var selectedBusStationId;
var selectedBusStationDirectionForward;
var selectedBusStationName;
var predictionIntervalId;
var intervalId;
var COOKIE_SELECTED_COUNTRY_ID = "selectedCountryId";
var COOKIE_SELECTED_CITY_ID = "selectedCityId";
var stationFeatures = new Array();
var busFeatures = new Array();
var drawnFeaturesByRoute = {};//{rouoteId:{'s': [], 'b': [], 'r': []}}
var paths = new Array();
var markers;
var markerA;
var markerB;
var mapClickCounter = 0;

//features
var selector;
var dragFeature;

var routeCollection = new Array();
var cityCollection = new Array();
var countryCollection = new Array();

var colors = ['#CC0000', '#FF8800', '#669900', '#9933CC', '#0099CC'];
var selectedColorClasses = ['uiselected-red', 'uiselected-yellow', 'uiselected-green', 'uiselected-purple', 'uiselected-blue'];

var busImages = ["/img/navigation_drop_red.png", "/img/navigation_drop_yellow.png", "/img/navigation_drop_green.png", "/img/navigation_drop_purple.png", "/img/navigation_drop_blue.png"];


function setMapSize(){
    var bodyHeight = jQuery("body").height();
    jQuery("#main").height(bodyHeight);
    var mainHeight = jQuery("#main").height();
    if (mainHeight < 480){
        mainHeight = 480;
    }
                
    var mainWidth = jQuery("#main").width();     
    if(mainWidth < 800){
        mainWidth = 800;
    }       
    var navWidth = jQuery("#nav").width();
    if (jQuery("#nav").hasClass('hide')) {
        navWidth = 0;
    }
    jQuery("#nav").height(mainHeight);
    jQuery("#nav").css('max-height', mainHeight);

    jQuery("#map").height(mainHeight);
    jQuery("#map").width(mainWidth-navWidth);            
}

function initMap() {
	//var Y_map = new OpenLayers.Layer.Yandex("Яндекс", { sphericalMercator: true });
	// var gphy = new OpenLayers.Layer.Google("Google Physical", { type:
	// G_PHYSICAL_MAP, sphericalMercator: true });
	//var gsat = new OpenLayers.Layer.Google("Google Satellite",{ type:
	//	G_SATELLITE_MAP, numZoomLevels: 22, sphericalMercator: true });
	var openstreets = new OpenLayers.Layer.OSM("OpenStreetMap");
	var gmap = new OpenLayers.Layer.Google(
	        "Google Streets", // the default
	        {numZoomLevels: 20}
	        // default type, no change needed here
	    );

	var options = {
		projection : new OpenLayers.Projection("EPSG:900913"), // -this is
																// Mercator.
																// Geodetic is
																// projection:"WGS84",
		units : "m", // m
		numZoomLevels : 18,
		displayProjection : new OpenLayers.Projection("EPSG:900913"),
		maxResolution : 156543.0339,
		maxExtent : new OpenLayers.Bounds(-20037508, -20037508, 20037508,
				20037508.34),
		controls : []		 
	};
	
	OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },

        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            ); 
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger
                }, this.handlerOptions
            );
        }, 

        trigger: function(e) {
        	var lonlat = map.getLonLatFromPixel(e.xy);
        	var epsg4326 = new OpenLayers.Projection('EPSG:4326');
            var epsg900913 = new OpenLayers.Projection('EPSG:900913');
            
            var point = new OpenLayers.LonLat(lonlat.lon, lonlat.lat);
			var position = point.transform(epsg900913, epsg4326);
			
            var aid = jQuery(document.activeElement).attr("id");
            
            	var first = mapClickCounter % 2;
	            var posStr = "" + position.lat + " " + position.lon;
	            var m;
	            var mLabel = "";
	            var iconURL = "";
	            var markerInputId = "";
	            if(first == 0){
	            	m = markerA;
	            	iconURL = serviceURL + "/img/flag_start.png"
	            	markerInputId = "pathsourcelocation";
	            	mLabel = "Пункт отправления";
	            }else{
	            	m = markerB;
	            	iconURL = serviceURL + "/img/flag_finish.png"
	            	markerInputId = "pathtargetlocation";
	            	mLabel = "Пункт назначения";
	            }
	            
	            
	            
	            if(!isUndefined(m)){	            		            	
	            	//markers.removeFeatures(m);
	            	return;
	            }	            
	            
	            m = new OpenLayers.Feature.Vector(									
	            		new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat),
	                {
	            			'markerInputId': markerInputId	                
	                },				
	                {
	                    externalGraphic: iconURL,
	                    graphicWidth:32,
	                    graphicHeight:32,
	                    graphicXOffset:-16,
	                    graphicYOffset:-32,
	                    label: mLabel,	                    	                    
	                    fontColor: "#333333",
	                	fontSize: "10px",
	                	fontFamily: "Tahoma, Arial,sans-serif",
	                	fontWeight: "600",
	                	labelAlign: "lm",
	                	labelXOffset: "11",
	            		labelYOffset: "0",
	            		labelOutlineColor: "#F8F8F8",
	            		labelOutlineWidth: 3
	                }
	            );
	            markers.addFeatures([m]);
	            
	            
	            
	            if(first == 0){
	            	markerA = m;
	            	jQuery("#pathsourcelocation").attr("value", posStr);
	            	jQuery("#pathtargetlocation").focus();
	            }else{
	            	markerB = m;
	            	jQuery("#pathtargetlocation").attr("value", posStr);
	            	jQuery("#pathsourcelocation").focus();
	            }
	            
	            mapClickCounter++;	            
            
        }

    });

	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 1;
	
	map = new OpenLayers.Map("map", options);

	//map.addLayer(Y_map);
	// map.addLayer(gphy);
    //map.addLayer(gsat);
	map.addLayer(gmap);
	map.addLayer(openstreets);
	//map.addLayer(Y_map);
	
	map.addControl(new OpenLayers.Control.PanZoomBar());
	map.addControl(new OpenLayers.Control.LayerSwitcher({ ascending: true, dataLayers:[]}));
	map.addControl(new OpenLayers.Control.Navigation());
	map.addControl(new OpenLayers.Control.ScaleLine());

	// initial map center
	locateMapCenter(MAP_INIT_X, MAP_INIT_Y, MAP_INIT_ZOOM);

	layer_style = OpenLayers.Util.extend({},
			OpenLayers.Feature.Vector.style['default']);
	layer_style.fillOpacity = 0.2;
	layer_style.graphicOpacity = 1;
	layer_style.strokeWidth = 5;
	layer_style.strokeColor = "#00BB00";	
	

	station_style = OpenLayers.Util.extend({},
			OpenLayers.Feature.Vector.style['default']);
	station_style.graphicWidth = 20;
	station_style.graphicHeight = 23;
	station_style.graphicXOffset = -station_style.graphicWidth / 2;
	station_style.graphicYOffset = -station_style.graphicHeight / 2;
	station_style.externalGraphic = serviceURL + "/img/busstop.png";
	station_style.graphicOpacity = 1;
	station_style.fillOpacity = 1;
	
	
    

	routeLayer = new OpenLayers.Layer.Vector("Route", {
		style : layer_style
	});
	routeLayer.displayInLayerSwitcher = false;
	
	stationLayer = new OpenLayers.Layer.Vector("Busstop", {
		eventListeners:{
            'featureselected': onFeatureSelected,
            'featureunselected': onFeatureUnselected
		}		
	});
	stationLayer.displayInLayerSwitcher = false;	
	
	selector = new OpenLayers.Control.SelectFeature(stationLayer,{
		clickout: true, toggle: false,
		multiple: false, hover: false, 
        autoActivate:true
    }); 
	map.addLayer(routeLayer);
	map.addLayer(stationLayer);	
	map.addControl(selector);
	selector.activate();
	
	markers = new OpenLayers.Layer.Vector("Markers" );
    markers.displayInLayerSwitcher = false;
	map.addLayer(markers);	
    
	// Add a drag feature control to move features around.
	dragFeature = new OpenLayers.Control.DragFeature(markers, {    
	     	'onComplete': function(feature, pixel){	           
	           var epsg4326 = new OpenLayers.Projection('EPSG:4326');
	           var epsg900913 = new OpenLayers.Projection('EPSG:900913');
	            
	           var point = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
			   var position = point.transform(epsg900913, epsg4326);
			   var posStr = "" + position.lat + " " + position.lon;
			   jQuery("#" + feature.attributes.markerInputId).attr("value", posStr);
			   
	     	}
	     });
	map.addControl(dragFeature);
	
		    
	var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
    
    
}

function onFeatureSelected(evt){	
	var feature = evt.feature;
	if(feature.attributes.type == "station"){
		selectedBusStationId = feature.attributes.id;
		selectedBusStationDirectionForward = feature.attributes.directionForward;
		selectedBusStationName = feature.attributes.name;
		
		var popupContent = "<div class=\"bsn\" data-sid=\"" + selectedBusStationId + "\" data-sdf=\"" + selectedBusStationDirectionForward + "\">Остановка: <b>" + selectedBusStationName + "</b></div><br/><div class=\"ptable-wrapper\"></div>";
        	
    	var popup = new OpenLayers.Popup.FramedCloud("station_" + selectedBusStationId,
            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
            null,
            popupContent, 
            null,
            true            
        );
        
    	feature.popup = popup;
        map.addPopup(popup);
        
        loadPredictionAndUpdatePopupContent();
        predictionIntervalId = setInterval(updatePopupContentPrediction, 5000);
        
    	sendData(serviceURL + '/statistic/add', {cid:selectedCityId, sid:feature.attributes.id, sn:feature.attributes.name, t:'web'});
	}else if(feature.attributes.type == "bus"){
		var popup = new OpenLayers.Popup.FramedCloud(null,
                OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                null,
                "<div>Гаражный номер: " + feature.attributes.name + "</div><div>Маршрут № " + feature.attributes.routeNumber + "</div>",
                null,
                true
        );
            
        feature.popup = popup;
        map.addPopup(popup);        
	}
}

function onFeatureUnselected(evt){	
    var feature = evt.feature;
    if(feature.popup){
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
	}    
    if(predictionIntervalId){
    	clearInterval(predictionIntervalId);
    	predictionIntervalId = null;
    }  
}

function onPopupClose(evt) {
	console.log(evt);
}

function updatePopupContentPrediction(){
	if(map.popups.length == 0){
		return;
	}
	for(var i=0; i<map.popups.length; i++){
		if(map.popups[i].id && map.popups[i].id == "station_" + selectedBusStationId && !map.popups[i].visible()){			
	        return;
		}
	}
	
	
	loadPredictionAndUpdatePopupContent();	
}

function loadPredictionAndUpdatePopupContent(){
	var popupContent = "";

	jQuery.when(jQuery.getJSON(serviceURL + '/cities/'+selectedCityId+'/stations/' + selectedBusStationId + '/routesatstation'), 
			jQuery.getJSON(serviceURL + '/cities/'+selectedCityId+'/stations/' + selectedBusStationId + '/prediction')).done(function(data1, data2) {
		
		
		var routesHtml = "";
		
		var pd = {};
    	jQuery.each(data1[0], function(index, value) {
    		var routeNumber =  routeCollection[value].routeNumber;
    		
    		pd[value] = new Array(2);
    		pd[value][0] = new Array();
    		pd[value][1] = new Array();
    		routesHtml = routesHtml + "<a href=\"javascript:void(0);\" onclick=\"javascript:displayRoute(" + value + ");\" title=\"" + escapeString(routeCollection[value].routeName) + "\">" +  routeNumber + "</a>&nbsp;";
    	});
    	    	
    	jQuery.each(data2[0], function(index, p){
    		var routeNumber =  routeCollection[p.routeId].routeNumber;
    		if(p.reverse){ //direction backward
    			pd[p.routeId][1].push(p);
    		}else{//direction forward
    			pd[p.routeId][0].push(p);
    		}	                			                		
    	});
    	    	
    	var predictionTableHtml = "<table class=\"ptable\"><thead><tr><th>Маршрут</th><th>Ближайший</th><th>Следующий</th></tr></thead><tbody>";
    	for (var rid in pd){
    		var p1 = "-";
    		var p2 = "-";
    		var p10 = "";
    		var p11 = "";
    		var p20 = "";
    		var p21 = "";
    		var pv = [undefined, undefined, undefined, undefined];
    		var pvstr = [" - ", " - ", " - ", " - "];
    		for(var i=0; i<2; i++){	                		
    			for(var j=0; j<Math.min(pd[rid][i].length, 2); j++){
    				pv[2*i+j] = pd[rid][i][j].prediction;
    			}
    		}
    		
    		for(var i=0; i<4; i++){
    			if(pv[i] != undefined){
    				var p = pv[i];
    				pvstr[i] = "<span class=\"ptable-prd\">" + ((p / 60 < 1.0) ? p + "</span> сек." : Math.ceil(p / 60) + "</span> мин.");
    			}
    		}
    		
    		if(selectedBusStationDirectionForward){
    			p1 = pvstr[0]
        		p2 = pvstr[1]
    		}else{
    			p1 = pvstr[2];
        		p2 = pvstr[3];
    		}
    		/*
    		p1 = "прямо " + pvstr[0] + " | обратно " + pvstr[2];
    		p2 = "прямо " + pvstr[1] + " | обратно " + pvstr[3];
    		*/ 
    		
    		predictionTableHtml += "<tr " + ((getIndexOfFromSelectedBusreportRouteIds(rid) >=0) ? " class=\"ptable-sr\"" : "") + "><td><a href=\"javascript:void(0);\" onclick=\"javascript:displayRoute(" + rid + ");\" title=\"" + escapeString(routeCollection[rid].routeName) + "\">" + routeCollection[rid].routeNumber + "</a></td><td>" + p1 + "</td><td> " + p2 + "</td></tr>";
    	}
    	predictionTableHtml += "</tbody></table>";
    	
    	popupContent = "<div class=\"bsn\" data-sid=\"" + selectedBusStationId + "\" data-sdf=\"" + selectedBusStationDirectionForward + "\">Остановка: <b>" + selectedBusStationName + "</b></div><br/><div class=\"ptable-wrapper\">" + predictionTableHtml + "</div>";
    	
    	for(var i=0; i<map.popups.length; i++){
    		if(map.popups[i].id && map.popups[i].id == "station_" + selectedBusStationId){
	    		map.popups[i].setContentHTML(popupContent);
	    		map.popups[i].updateSize();
    		}
    	}
    	
	});		
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function searchPath(){
	jQuery("#pathoptions").html("");
	clearMap();
	var s = jQuery("#pathsourcelocation").attr('value');
	var t = jQuery("#pathtargetlocation").attr('value');
	if(isUndefined(s) || isUndefined(t) || isEmpty(s) || isEmpty(t)){
		return;
	}
	var sl = s.split(' ', 2);
	var tl = t.split(' ', 2);
	var b = jQuery("#searchpath");
	var bvalue = b.attr("value");
	b.attr("disabled", "disabled");
	b.attr("value", ".");
	b.addClass("bgload");
	jQuery.getJSON(serviceURL + '/cities/' + selectedCityId + '/pathsbwpoints?sourceLat=' + sl[0] + '&sourceLng=' + sl[1] +'&targetLat=' + tl[0] + '&targetLng=' + tl[1] , function(data) {
		paths = data;
		displayPath(0);			
	}).always(function(){		
		b.removeClass("bgload");
		b.attr("value", bvalue);
		b.removeAttr("disabled");
	});
	dragFeature.deactivate();
	selector.activate();
	
}

function clearSearchParams(){
	clearMap();
	jQuery("#pathoptions").html("");
	jQuery("#pathsourcelocation").attr('value', "");
	jQuery("#pathtargetlocation").attr('value', "");
	jQuery("#ddlRoutes li").removeClass();
	markers.removeFeatures(markerA);
	markers.removeFeatures(markerB);
	markerA = null;
	markerB = null;
	mapClickCounter = 0;
	dragFeature.deactivate();
	selector.activate();
}

function clearMap(){
	stationLayer.removeAllFeatures();
	stationFeatures = new Array();	
	busFeatures = new Array();		
	
	clearSelectedBusreportRouteIds();
	drawnFeaturesByRoute = {};
	routeLayer.removeAllFeatures();
	jQuery("#ddlRoutes li").removeClass("uiselected");
}

function displayPath(pidx){
	var dsteps = "";
	if(paths.length == 0){
		dsteps = "Не удалось проложить маршрут.";
	}else{
		var dsteps = "<div>Вариант № " + (pidx + 1) + ":</div><ol>";
		jQuery.each(paths[pidx], function(sidx, step){
			
			dsteps += "<li><div class=\"departure-stop\">Остановка <a class=\"link\" href=\"javascript:void(0);\" onclick=\"javascript:locateMapCenter(" + step.departure_stop.location.lng + "," + step.departure_stop.location.lat + ", 18)\">" + step.departure_stop.name + "</a></div>";
			var rstr = "Маршрут ";
			if(sidx > 0 && paths[pidx][sidx-1].route.id != step.route.id){
				rstr = "пересадка на маршрут ";
			}
			dsteps += "<div class=\"route-name\">" + rstr + "<a href=\"javascript:void(0);\" onclick=\"javascript:displayRoute(" + step.route.id + ");\" title=\"" + escapeString(step.route.name) + "\">" +  step.route.number + "</a></div>";
			dsteps += "<div class=\"arrival-stop\">Остановка <a class=\"link\" href=\"javascript:void(0);\" onclick=\"javascript:locateMapCenter(" + step.arrival_stop.location.lng + "," + step.arrival_stop.location.lat + ", 18)\">" + step.arrival_stop.name + "</a></div>" +		
			"<label class=\"hint\">остановок " + step.num_stops + "</label></li>";
			
		});
		dsteps += "</ol>";
		dsteps += "<div clas=\"opt-nav\">";
		if (0 <= pidx - 1 && pidx - 1 < paths.length){
			dsteps += "<a class=\"prev-opt link\" href=\"javascript:void(0);\" onclick=\"javascript:displayPath(" + (pidx - 1) + ")\">предыдущий</a>"  
		}
		
		if (0 <= pidx + 1 && pidx + 1 < paths.length){
			dsteps += "<a class=\"next-opt link\" href=\"javascript:void(0);\" onclick=\"javascript:displayPath(" + (pidx + 1) + ")\">следующий</a>"  
		}
		dsteps += "<div class=\"clearfix\"></div></div>";
	}
	
	jQuery("#pathoptions").html(dsteps);
}

function onContainerResize(){
	map.updateSize();
}

function locateMapCenter(x, y, zoom){
	var _x = x;
	var _y = y;
	var _zoom = zoom;
	if(isUndefined(x) || isUndefined(y) || isUndefined(zoom)){
		_x = MAP_INIT_X;
		_y = MAP_INIT_Y;
		_zoom = MAP_INIT_ZOOM;
	}
	
	if (map.baseLayer.forwardMercator) // for yandex maps
		map.setCenter(map.baseLayer.forwardMercator(_x, _y),
				_zoom);
	else {
		if (map.baseLayer.name == "OpenStreetMap") // for OSM
		{
			var proj = new OpenLayers.Projection("EPSG:4326");
			var point = new OpenLayers.LonLat(_x, _y);
			map.setCenter(point.transform(proj, map.getProjectionObject()),
					_zoom);
		} else
			// for all
			map.setCenter(new OpenLayers.LonLat(_x, _y),
					_zoom);
	}
}

function isUndefined(x){
	return typeof x === "undefined" || x == null;	
}

function main() {		
	initMap();
	loadCountries();	
}

function loadCountries(){
	showLoadIndicator();	
	jQuery.getJSON('http://infobus.kz/countries', function(data) {
		jQuery.each(data, function() {			
			countryCollection[this.id] = this;			
		});
		hideLoadIndicator();		
		loadCities(selectedCountryId);		
	});
}

function loadCities(countryId) {
	showLoadIndicator();		
	
	jQuery.getJSON('http://infobus.kz/countries/'+countryId+'/cities', function(data) {
		jQuery.each(data, function() {			
			cityCollection[this.id] = this;			
		});
		citiesChanged();
		hideLoadIndicator();		
	});
	
}

function displayRoute(routeId){
	jQuery('#ddlRoutes li[data-id=\'' + routeId + '\']').click();	
}

function saveSelectedCountryToCookie(countryId){
	
}

function getSelectedCountryFromCookie(){
	return 1;
}

function saveSelectedCityToCookie(cityId){
	
}

function getSelectedCityFromCookie(){
	return 1;
}

function loadRoutes(cityId) {
	showLoadIndicator();
	jQuery('#ddlRoutes').empty();
	jQuery.getJSON(serviceURL + '/cities/' + cityId + '/routes', function(data) {
		jQuery.each(data, function() {
			addItemToRouteList(this.busreportRouteId, "<div class=\"rn\">" + this.routeNumber + " - " + this.routeName +"</div><div class=\"ba\">" + this.bussesOnRoute + "</div>");
			routeCollection[this.busreportRouteId] = this;
		});
		hideLoadIndicator();
	});
	
}

function citiesChanged() {	
	serviceURL = cityCollection[selectedCityId].serviceURL;
	clearMap();
	loadRoutes(selectedCityId);	
	jQuery.getJSON(serviceURL + "/cities/" + selectedCityId + "/routeamount", function(data){
		jQuery("#routeAmount").text("(всего " + data + ")");
	});
	jQuery.getJSON(serviceURL + "/cities/" + selectedCityId + "/busamount", function(data){
		jQuery("#busAmount").text("Автобусов всего " + data);
	});
	
	jQuery.getJSON(serviceURL+'/cities', function(data) {
		jQuery.each(data, function() {
			if (this.id === selectedCityId){
				var city = this;
				if(city.displayMessage){
					jQuery("#cityMessage p").html(city.message);
					jQuery("#cityMessage").show();
				}else{
					jQuery("#cityMessage p").html("");
					jQuery("#cityMessage").hide();
				}
				locateMapCenter(city.lon, city.lat, city.mapZoom);
			}			
		});
		
	});
	
}

function addItemToRouteList(key, value) {
	jQuery('#ddlRoutes').append(
			jQuery("<li/>", {click: function(){
				var isSelected = jQuery(this).hasClass("uiselected");
				var routeId = parseInt(jQuery(this).attr("data-id"));
				if(isSelected){
					//remove route from map
					jQuery(this).removeClass("uiselected");					
					jQuery(this).removeClass();
					removeItemFromSelectedBusreportRouteIds(routeId);										
					routeLayer.removeFeatures(drawnFeaturesByRoute[routeId]['r']);	
					stationLayer.removeFeatures(drawnFeaturesByRoute[routeId]['s']);
					stationLayer.removeFeatures(drawnFeaturesByRoute[routeId]['b']);
				}else{
					if(countNotEmptyValuesInSelectedBusreportRouteIds() < 5){
						//add route to map
						var index = addItemToSelectedBusreportRouteIds(routeId);
						jQuery(this).addClass("uiselected");
						jQuery(this).addClass(selectedColorClasses[index]);						
						drawnFeaturesByRoute[routeId] = {'s': [], 'b': [], 'r': []};
						routeChanged(routeId);
					}
				}
																
				if(!isUndefined(intervalId)){
					window.clearInterval(intervalId);
				}
				var refreshTime = REFRESH_TIMEOUT;
				if(selectedCityId === 8){
					refreshTime = 1000;
				}
				intervalId = window.setInterval(function(){refresh();}, refreshTime);
				
			}
		}).attr("data-id", key).html(value));
}

function routeChanged(routeId) {
	
	var lineString = routeCollection[routeId].location;
	var frn = routeCollection[routeId].routeNumber + ' - ' + routeCollection[routeId].routeName;
	sendData(serviceURL + '/statistic/add', {cid:selectedCityId, rid:routeId, rn:frn, t:'web'});		
	drawRoute(routeId, getPoints(lineString));	
	loadStationByRoute(selectedCityId, routeId);
	loadBusByRoute(selectedCityId, routeId);
	map.zoomToExtent(routeLayer.getDataExtent());	
}

function getPoints(lineString){
	var points = new Array();
	var p = lineString.split(",");
	var j=0;
	for(var i in p){
		var x_y = jQuery.trim(p[i]).split(" ");
		if(x_y.length >= 2){
			var point = new Object();
			point.X = x_y[0];
			point.Y = x_y[1];
			points[j] = point;
			j = j + 1;
		}
	}
	
	return points;
}

function drawRoute(routeId, points) {	

	var route_points = [];
	for (i in points) {
		point = new OpenLayers.Geometry.Point(points[i].X, points[i].Y);
		point.transform(new OpenLayers.Projection("EPSG:4326"), // transform
																// from WGS 1984
		map.getProjectionObject() // to Spherical Mercator Projection
		);
		route_points.push(point);
	}

	var routeline = new OpenLayers.Feature.Vector(
			new OpenLayers.Geometry.LineString(route_points), null, buildRouteStyle(routeId));
	drawnFeaturesByRoute[routeId]['r'].push(routeline);	
	routeLayer.addFeatures(drawnFeaturesByRoute[routeId]['r']);
}

function drawRoad(road) {		
	var points = getPoints(road.polyline);
	var label = (road.display_text_on_map) ? road.description : "";
	var road_points = [];
	for (i in points) {
		point = new OpenLayers.Geometry.Point(points[i].X, points[i].Y);
		point.transform(new OpenLayers.Projection("EPSG:4326"), // transform
																// from WGS 1984
		map.getProjectionObject() // to Spherical Mercator Projection
		);
		road_points.push(point);
	}
	
	var roadline = new OpenLayers.Feature.Vector(
			new OpenLayers.Geometry.LineString(road_points),
			{
				'type': "closedroad",			    
			    'road': road
			}, buildClosedRaodStyle(label, road.ttype.line_color, road.ttype.line_weight)
	);	
	closedRoadFeatures.push(roadline);	
}

function loadBusByRoute(cityId, busreportRouteId) {
	if(isUndefined(cityId) || isUndefined(busreportRouteId)){
		return;
	}
	
	var url = serviceURL + "/cities/" + cityId + "/routes/" + busreportRouteId + "/busses";
	jQuery.getJSON(url, function(data) {	
		stationLayer.removeFeatures(drawnFeaturesByRoute[busreportRouteId]['b']);
		drawnFeaturesByRoute[busreportRouteId]['b'] = new Array();
		
		jQuery.each(data, function() {
			drawBus(this.lon, this.lat,this.direction, this.offline, this.name, this.busreportRouteId);			
		});
		stationLayer.addFeatures(drawnFeaturesByRoute[busreportRouteId]['b']);		
	});
}

function loadStationByRoute(cityId, routeId){
	if(isUndefined(cityId) || isUndefined(routeId)){
		return;
	}
	
	var url = serviceURL + "/cities/" + cityId + "/routes/" + routeId + "/stations";
	jQuery.getJSON(url, function(data) {		
		
		jQuery.each(data, function() {
			drawStation(this.lon, this.lat, this.name, this.id, this.sequenceNumber, this.directionForward, this.routeId);			
		});		
		stationLayer.addFeatures(drawnFeaturesByRoute[routeId]['s']);
	});
}

function buildClosedRaodStyle(label, strokeColor, strokeWidth){
	var closedRoadStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
	closedRoadStyle.pointRadius = 6;
	closedRoadStyle.labelYOffset = -15;
	closedRoadStyle.labelOutlineColor = "white";
	closedRoadStyle.labelOutlineWidth = 3;
	closedRoadStyle.label = label;
	closedRoadStyle.strokeColor = strokeColor;
	closedRoadStyle.strokeOpacity = 0.6;
	closedRoadStyle.strokeWidth = strokeWidth;
	
	return closedRoadStyle;
}

function buildRouteStyle(routeId){
	var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);	
	style.strokeColor = colors[getIndexOfFromSelectedBusreportRouteIds(routeId)];
	style.strokeOpacity = 0.6;
	style.strokeWidth = 5;
	
	return style;
}

function buildBusStyle(offline, objName, course, busIndex){
	var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);	
	style.graphicWidth = 32;
	style.graphicHeight = 32;
	style.graphicXOffset = -16;
	style.graphicYOffset = -24;
	style.graphicOpacity = 1;
	if(offline){
		style.backgroundWidth = 32;
		style.backgroundHeight = 32;
		style.backgroundXOffset = -16;
		style.backgroundYOffset = -24;
		style.backgroundGraphic = serviceURL + busImages[busIndex];		
		style.externalGraphic = serviceURL + "/img/navigation_drop_offline.png";			
	}else{		
		style.externalGraphic = serviceURL + busImages[busIndex];		
	}
	style.rotation = course;
	style.fillOpacity = 1;
	style.label = objName;
	style.fontColor = "black";
	style.fontSize = "10px";
	style.fontFamily = "Tahoma, Arial,sans-serif";
	style.fontWeight = "bold";
	style.labelAlign = "cb";
	style.labelXOffset = "0";
	style.labelYOffset = "-24";
	style.labelOutlineColor = "white";
	style.labelOutlineWidth = 3;	
	
	return style;
}

function drawBus(X, Y,course, offline, objName, busreportRouteId) {
	var point = new OpenLayers.Geometry.Point(X, Y);
	point.transform(new OpenLayers.Projection("EPSG:4326"), // transform from
															// WGS 1984
	map.getProjectionObject() // to Spherical Mercator Projection
	);
	var busIndex = getIndexOfFromSelectedBusreportRouteIds(busreportRouteId);
	var busFeature = new OpenLayers.Feature.Vector(point, {name: objName, type : "bus", xOffset: 16, yOffset: -16, routeNumber: routeCollection[busreportRouteId].routeNumber}, buildBusStyle(offline, objName, course, busIndex));
	stationLayer.drawFeature(busFeature);
	drawnFeaturesByRoute[busreportRouteId]['b'].push(busFeature);
	
	drawRouteNumber(X, Y, course, objName, busreportRouteId);
}



function drawRouteNumber(X, Y, course, objName, busreportRouteId) {
	var point = new OpenLayers.Geometry.Point(X, Y);
	point.transform(new OpenLayers.Projection("EPSG:4326"), // transform from
															// WGS 1984
	map.getProjectionObject() // to Spherical Mercator Projection
	);
	var rn = routeCollection[busreportRouteId].routeNumber;
	var feature = new OpenLayers.Feature.Vector(point, {name: objName, type : "bus", xOffset: 16, yOffset: -16, routeNumber: rn}, createRouteNumberStyle(course, rn));	
	stationLayer.drawFeature(feature);
	drawnFeaturesByRoute[busreportRouteId]['b'].push(feature);
}

function drawStation(X, Y, name, id, sequenceNumber, directionForward, routeId){
	var point = new OpenLayers.Geometry.Point(X, Y);
	point.transform(new OpenLayers.Projection("EPSG:4326"), // transform from
															// WGS 1984
	map.getProjectionObject() // to Spherical Mercator Projection
	);

	var isAlreadyAdded = false;
	var i;
	var routeIds = getNotEmptyValuesFromSelectedBusreportRouteIds();
	for(i=0; i<routeIds.length; i++){		
		if(jQuery.inArray(routeIds[i], drawnFeaturesByRoute[routeIds[i]]['s']) >= 0){
			isAlreadyAdded = true;
			console.log('station ' + id + ' is already added');
			break;
		}
	}
	var stationFeature = new OpenLayers.Feature.Vector(point, {"id": id, "name": name, "sequenceNumber": sequenceNumber, "directionForward": directionForward, "type" : "station"} , station_style);
	if(!isAlreadyAdded){
		drawnFeaturesByRoute[routeId]['s'].push(stationFeature);
	}	
	
}

function createRouteNumberStyle(course, routeNumber) {
	var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
	style.label = routeNumber;
	style.fontColor = "black";
	style.fontSize = "10px";
	style.fontFamily = "Tahoma, Arial,sans-serif";
	style.fontWeight = "bold";
	style.labelAlign = "cm";
	style.labelXOffset = "0";
	style.labelYOffset = "0";
	style.labelOutlineColor = "white";
	style.labelOutlineWidth = 3;
	style.rotation = course;
	style.stroke = false;
	style.fill = false;
	style.strokeOpacity = 0;
	style.strokeWidth = 0;	
	style.fillOpacity = 0;
	style.pointRadius = 0; 
	
	return style;
}


function sendData(path, data){
	jQuery.post(path, data);
}

function refresh() {
	var i;
	var routeIds = getNotEmptyValuesFromSelectedBusreportRouteIds();
	for(i=0; i<routeIds.length; i++){		
		loadBusByRoute(selectedCityId, selectedBusreportRouteIds[i]);	
	}
	return false;
}

function clearSelectedBusreportRouteIds(){
	var i;
	selectedBusreportRouteIds = new Array();
	for(i=0; i<5; i++){
		selectedBusreportRouteIds.push(-1);
	}
}

function addItemToSelectedBusreportRouteIds(val){
	var i = getFirstEmtpyIndexFromSelectedBusreportRouteIds();	
	selectedBusreportRouteIds[i] = val;
	return i;	
}

function removeItemFromSelectedBusreportRouteIds(val){
	var i = getIndexOfFromSelectedBusreportRouteIds(val);
	selectedBusreportRouteIds[i] = -1;
}

function getFirstEmtpyIndexFromSelectedBusreportRouteIds(){
	var i;
	for(i=0; i<5; i++){
		if(selectedBusreportRouteIds[i] == -1){
			return i;
		}
	}
}

function getIndexOfFromSelectedBusreportRouteIds(val){
	var i;
	for(i=0; i<5; i++){
		if(selectedBusreportRouteIds[i] == val){
			return i;
		}
	}
	return -1;
}

function countNotEmptyValuesInSelectedBusreportRouteIds(){
	var count = 0;
	var i;
	for(i=0; i<5; i++){
		if(selectedBusreportRouteIds[i] != -1){
			count = count + 1;
		}
	}
	return count;
}

function getNotEmptyValuesFromSelectedBusreportRouteIds(){
	var r = new Array();
	for(i=0; i<5; i++){
		if(selectedBusreportRouteIds[i] != -1){
			r.push(selectedBusreportRouteIds[i]);
		}
	}
	return r;
}

function showLoadIndicator(){
	
}

function hideLoadIndicator(){
	
}

function escapeString(str){
	var entityMap = {
		    "&": "&amp;",
		    "<": "&lt;",
		    ">": "&gt;",
		    '"': '&quot;',
		    "'": '&#39;',
		    "/": '&#x2F;'
		  };
	return String(str).replace(/[&<>"'\/]/g, function (s) {
	      return entityMap[s];
	    });
}