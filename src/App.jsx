import "./index.css";
import { useEffect, useState } from "react";
import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
    DirectionsRenderer,
    GoogleMap,
    LoadScript,
    MarkerF,
    useJsApiLoader,
    Autocomplete,
} from "@react-google-maps/api";
function App() {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [originCoord, setOriginCoord] = useState(null);
    const [destinationCoord, setDestinationCoord] = useState(null);
    const [center, setCenter] = useState({
        lat: -34.6036844,
        lng: -58.3815591,
    });
    const [directionPoints, setDirectionPoints] = useState(null);

    const directionRoute = async () => {
        const directionsService = new google.maps.DirectionsService();
        const res = await directionsService.route({
            origin: originCoord,
            destination: destinationCoord,
            travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionPoints(res);
    };

    const handleChangeOrigin = (newValue) => {
        setOrigin(newValue);
        const placeId = newValue.value.place_id;
        const service = new google.maps.places.PlacesService(
            document.createElement("div")
        );
        service.getDetails({ placeId }, (place, status) => {
            if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place &&
                place.geometry &&
                place.geometry.location
            ) {
                setOriginCoord({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
                console.log({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            }
        });
    };
    const handleChangeDestination = (newValue) => {
        setDestination(newValue);
        const placeId = newValue.value.place_id;
        const service = new google.maps.places.PlacesService(
            document.createElement("div")
        );
        service.getDetails({ placeId }, (place, status) => {
            if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place &&
                place.geometry &&
                place.geometry.location
            ) {
                setDestinationCoord({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
                console.log({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            }
        });
    };
    // google api librari
    const containerStyle = {
        width: "400px",
        height: "400px",
    };

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map);
    }, []);
    // if (map) {
    //     map.panTo({ lat: -31.4511313, lng: -60.9443879 });
    // }
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);
    useEffect(() => {
        if (originCoord !== null && map) {
            setCenter(originCoord);
            map.panTo(originCoord);
        }
        if (destinationCoord !== null && originCoord !== null) {
            console.log("entre al cambiar the origin");

            directionRoute();
        }
    }, [originCoord]);
    useEffect(() => {
        if (destinationCoord !== null && map) {
            setCenter(destinationCoord);
            map.panTo(destinationCoord);
        }
        if (destinationCoord !== null && originCoord !== null) {
            console.log("entre al cambiar the destination");
            directionRoute();
            // console.log(directionPoints);
        }
    }, [destinationCoord]);
    const handleCalc = () => {
        const minPrice = 800;
        const maxPrice = 1600;
        const dinstance = google.maps.geometry.spherical.computeDistanceBetween(
            originCoord,
            destinationCoord
        );
        const roundedDistance = Math.round(dinstance / 100) * 100;
        if (roundedDistance > minPrice && roundedDistance < maxPrice) {
            roundedDistance;
        } else if (roundedDistance <= minPrice) {
            minPrice;
        } else {
            maxPrice;
        }
    };
    console.log(import.meta.env.VITE_GOOGLE_API_KEY);
    return (
        <>
            <LoadScript
                libraries={["places"]}
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
            >
                {/* para poder hacer mas dinamico y no repetir codigo puedo crear un componente que sea input,y que tenga una prop type y que segun si es origin o destination que se pase a la funcion onchange el tipo tambien ademas de el value y ahi hacer una sola funcion en el handleInputChange z */}
                <GooglePlacesAutocomplete
                    selectProps={{
                        value: origin,
                        onChange: handleChangeOrigin,
                    }}
                />
                <GooglePlacesAutocomplete
                    selectProps={{
                        value: destination,
                        onChange: handleChangeDestination,
                    }}
                />
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                    }}
                >
                    {originCoord && (
                        <MarkerF
                            position={originCoord}
                            icon={{
                                url: "/marker.png",
                                scaledSize: {
                                    width: 50,
                                    height: 50,
                                },
                            }}
                        />
                    )}
                    {destinationCoord && (
                        <MarkerF
                            position={destinationCoord}
                            // icon={{
                            //     url: "/marker.png",
                            //     scaledSize: {
                            //         width: 50,
                            //         height: 50,
                            //     },
                            // }}
                        />
                    )}

                    {directionPoints ? (
                        <DirectionsRenderer
                            directions={directionPoints}
                            options={{
                                suppressMarkers: true,
                                polylineOptions: {
                                    strokeColor: "#000",
                                    strokeWeight: 2,
                                },
                                // routeIndex: 1,
                            }}
                        />
                    ) : null}
                </GoogleMap>
                <Autocomplete>
                    <input type="text" />
                </Autocomplete>
            </LoadScript>
            {/* <button onClick={handleCalc}>calcular</button> */}
            {/* <button onClick={directionRoute}>mostrar direccion</button> */}
        </>
    );
}

export default App;
