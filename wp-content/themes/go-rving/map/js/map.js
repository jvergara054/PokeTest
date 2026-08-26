let map;

async function initMap() {

    if ($('.gorving-map').length) {

        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

        const mapArgs = {
            zoom: 9,
            scrollwheel: false,
            disableDefaultUI: true,
            mapId: "4c8beafdc82a4828"
        }
        map = new Map(document.querySelector('.gorving-map'), mapArgs)


        var zoomControlDiv = document.createElement('div');
        zoomControlDiv.classList.add('map__zoom');
        var zoomControl = new ZoomControl(zoomControlDiv, map);
        zoomControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(zoomControlDiv);


        //Map moved update.
        if (typeof trip_guide === 'undefined') {
            google.maps.event.addListener(map, 'dragend', function() {
                var idleListener = map.addListener('idle', function () {
                    google.maps.event.removeListener(idleListener);
                    loadLocations()
                });
            });
        }

        map.markers = []

        let infoWindow = new InfoWindow({
            headerDisabled: true
        });
        let lastMarker = null;


        const waypts = [];
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true, polylineOptions: { strokeColor: '#EE7648', strokeWeight: 5 }});
        directionsRenderer.setMap(map);

        let first_load = true;
        load_locations(locations);

        if (typeof trip_guide !== 'undefined') {
            directionsService
                .route({
                    origin: locations[0].address,
                    destination: locations.pop().address,
                    waypoints: waypts,
                    optimizeWaypoints: false,
                    travelMode: google.maps.TravelMode.DRIVING,
                })
                .then((response) => {
                    directionsRenderer.setDirections(response);
                })
                .catch((e) => console.log("Directions request failed due to " + status));
        }

        function load_locations(locations){

            let bounds = new google.maps.LatLngBounds()

            locations.forEach(function (location) {

                const position = {
                    lat: parseFloat(location.lat),
                    lng: parseFloat(location.lng)
                }

                let img = document.createElement("img");
                img.src ='/wp-content/themes/go-rving/map/markers/inactive.svg';
                if(location.featured)
                    img.src ='/wp-content/themes/go-rving/map/markers/featured.svg';

                if (typeof trip_guide !== 'undefined') {

                    waypts.push({
                        location: new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng)),
                        stopover: true,
                    });

                    img.src ='/wp-content/themes/go-rving/map/markers/inactive-'+location.id+'.svg';
                }

                const marker = new AdvancedMarkerElement({
                    id: location.id,
                    position: position,
                    map: map,
                    title: location.title,
                    content: img
                })
                map.markers.push(marker)


                //Marker Click
                marker.addListener("click", function() {
                    openInfoWindow(marker, location);
                });

                //Marker Mouseover/Mouseout
                /*
                marker.content.addEventListener('mouseenter', function(){
                    openInfoWindow(marker, location);
                });
                */

                //Sidebar Mouseover/Mouseout
                $(document).on('mouseover', ".location-"+location.id, function(){
                    openInfoWindow(marker, location);
                })
                $(document).on('mouseout', ".location-"+location.id, function(){
                    closeInfoWindow(marker, location);
                })

                bounds.extend(marker.position)
            });

            if(first_load) {
                map.fitBounds(bounds)
                first_load = false;
            }

        }

        function loadLocations(){

            $('.landing__results h1').html('Loading...')
            $('[data-num-results]').hide();
            $('.landing__results .ajax-wrapper').html('');
            for (var i = 0; i < map.markers.length; i++ ) {
                map.markers[i].setMap(null);
            }
            map.markers.length = 0;

            const map_bounds = map.getBounds()
            const NECorner = map_bounds.getNorthEast()
            const SWCorner = map_bounds.getSouthWest()
            const bounds = `${NECorner.lat()}|${NECorner.lng()}|${SWCorner.lat()}|${SWCorner.lng()}`;

            var data = {
                action: 'exsite_get_map_locations',
                data: {bounds: bounds, form: $('form.form-rv-dealers-campgrounds').serialize()}
            };
            $.post(ajax_params.ajax_url, data, function (response) {

                if(response.success){
                    load_locations(response.data.locations);
                    $('[data-num-results]').show().html(response.data.locations.length);
                    $('.landing__results .ajax-wrapper').html(response.data.cards);
                    $('.landing__results h1').html(response.data.title)
                    $('#map-search').val('Map area')
                    lazyMediaLoad();
                }else{
                    $('.landing__results h2').html('Error')
                }

            });
        }


        function openInfoWindow(marker, location){

            //if(lastMarker != null)
            //    closeInfoWindow(lastMarker)

            lastMarker = marker;
            infoWindow.close();
            infoWindow.setContent(location.infowindow);
            infoWindow.open(marker.map, marker);

            let img = document.createElement("img");
            img.src = '/wp-content/themes/go-rving/map/markers/active.svg';

            if (typeof trip_guide !== 'undefined') {
                img.src ='/wp-content/themes/go-rving/map/markers/active-'+location.id+'.svg';
            }

            marker.content = img;

        }

        function closeInfoWindow(marker, location){
            lastMarker = null;
            infoWindow.close();

            let img = document.createElement("img");
            img.src = '/wp-content/themes/go-rving/map/markers/inactive.svg';
            if(location.featured)
                img.src ='/wp-content/themes/go-rving/map/markers/featured.svg';
            marker.content = img;
        }


        function ZoomControl(controlDiv, map) {
            var zoomInButton = document.createElement('button');
            zoomInButton.innerHTML = '<svg class="icon icon--plus"><use xlink:href="#plus"></use></svg>';
            controlDiv.appendChild(zoomInButton).classList.add('button', 'button--icon', 'button--xxsmall');

            var zoomOutButton = document.createElement('button');
            zoomOutButton.innerHTML = '<svg class="icon icon--minus"><use xlink:href="#minus"></use></svg>';
            controlDiv.appendChild(zoomOutButton).classList.add('button', 'button--icon', 'button--xxsmall');

            google.maps.event.addDomListener(zoomInButton, 'click', function() {
                map.setZoom(map.getZoom() + 1);
            });

            google.maps.event.addDomListener(zoomOutButton, 'click', function() {
                map.setZoom(map.getZoom() - 1);
            });

        }

        //TONY - UPDATE TO LINK MAIN MIN FUNCTIONS.
        function lazyMediaLoadUpdates($lazyMedia, callback) {
            $lazyMedia.Lazy({
                defaultImage: '',
                threshold: 250,
                visibleOnly: true,
                afterLoad: function($element) {
                    $element.closest('.media-wrapper').addClass('is-loaded');

                    if (callback) {
                        callback();
                    }
                }
            });
        }

        function nonLazyMediaLoadUpdates($nonLazyMedia) {
            $nonLazyMedia.Lazy({
                delay: 0,
                visibleOnly: false,
                afterLoad: function($element) {
                    $element.closest('.media-wrapper').addClass('is-loaded');
                }
            });
        }

        function lazyMediaLoad(callback) {
            const $lazyImage = $('.lazy-image');
            const $lazyVideo = $('.lazy-video');
            if ($lazyImage.length || $lazyVideo.length) {
                var ua = navigator.userAgent;
                var isChromeIOS = /CriOS/i.test(ua);

                if ($lazyImage.length) {
                    if (isChromeIOS) {
                        nonLazyMediaLoadUpdates($lazyImage);
                    } else {
                        lazyMediaLoadUpdates($lazyImage, callback);
                    }
                }

                if ($lazyVideo.length) {
                    if (isChromeIOS) {
                        nonLazyMediaLoadUpdates($lazyVideo);
                    } else {
                        lazyMediaLoadUpdates($lazyVideo, callback);
                    }
                }
            }
        }

    }

}
initMap();


async function initLocationSearch() {

    const dealer_search = $('.form-rv-dealers-campgrounds');

    const { Autocomplete } = await google.maps.importLibrary("places");

    if (dealer_search.length) {
        const input = document.getElementById('map-search')
        const autocomplete = new Autocomplete(input)
        autocomplete.setComponentRestrictions({
            country: ['ca'],
        })
        enableEnterKey(input);

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            const place = autocomplete.getPlace()

            dealer_search.find('#lat').val(place.geometry.location.lat())
            dealer_search.find('#lng').val(place.geometry.location.lng())

            dealer_search.submit();

        })

        google.maps.event.addDomListener(input, 'keydown', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault()
            }
        })
    }
}
initLocationSearch();


function enableEnterKey(input) {
    const _addEventListener = input.addEventListener
    const addEventListenerWrapper = (type, listener) => {
        if (type === 'keydown') {
            const _listener = listener
            listener = (event) => {
                const suggestionSelected = document.getElementsByClassName('pac-item-selected').length
                if (event.key === 'Enter' && !suggestionSelected) {
                    const e = new KeyboardEvent('keydown', {
                        key: 'ArrowDown',
                        code: 'ArrowDown',
                        keyCode: 40,
                    })
                    _listener.apply(input, [e])
                }
                _listener.apply(input, [event])
            }
        }
        _addEventListener.apply(input, [type, listener])
    }
    input.addEventListener = addEventListenerWrapper
}


$(document).ready(function($) {

    if ($('.get-near-me').length) {
        $('.get-near-me').click(function () {
            if (navigator.geolocation) {
                $(this).find('span').html("Locating...");
                navigator.geolocation.getCurrentPosition(successNearMe, error);
            } else {
                $(this).find('span').html("Geolocation is not supported by this browser.");
            }
            return false;
        })
    }

    $('.landing__view-toggle').click(function(){
        $('input[name="view"]').val($(this).data('type'));
        $(this).closest().form().submit();
    })

    if ($('.form-rv-dealers-campgrounds .dealer-type-select').length){
        $('.dealer-type-select label').click(function () {
            window.location = $(this).data('link');
            return false;
        })
    }

});

function successNearMe(position) {
    $('.form-near-me').find('#lat').val(position.coords.latitude)
    $('.form-near-me').find('#lng').val(position.coords.longitude)
    $('.form-near-me').find('#map-search').val("Near Me")
    $('.form-near-me').submit();
    $('.get-near-me').find('span').html("Located.");
}

function error(err)
{
    console.warn('ERROR(' + err.code + '): ' + err.message);
}
