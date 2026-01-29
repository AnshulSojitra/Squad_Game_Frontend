// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// import { useState } from "react";

// const containerStyle = {
//   width: "100%",
//   height: "350px",
// };

// const defaultCenter = {
//   lat: 12.9716, // Bengaluru default
//   lng: 77.5946,
// };

// export default function LocationPicker({ value, onChange }) {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//   });

//   const [marker, setMarker] = useState(value || defaultCenter);

//   const handleClick = (e) => {
//     const pos = {
//       lat: e.latLng.lat(),
//       lng: e.latLng.lng(),
//     };
//     setMarker(pos);
//     onChange(pos); // send lat/lng to parent
//   };

//   if (!isLoaded) return <p>Loading map...</p>;

//   return (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={marker}
//       zoom={15}
//       onClick={handleClick}
//     >
//       <Marker position={marker} draggable />
//     </GoogleMap>
//   );
// }
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// import { useEffect, useState } from "react";

// const containerStyle = {
//   width: "100%",
//   height: "350px",
// };

// const fallbackCenter = {
//   lat: 12.9716, // default only if no value
//   lng: 77.5946,
// };

// export default function LocationPicker({ value, onChange }) {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//   });

//   const [marker, setMarker] = useState(fallbackCenter);

//   // 🔥 THIS IS THE MISSING PART
//   useEffect(() => {
//     if (value?.lat && value?.lng) {
//       setMarker({
//         lat: Number(value.lat),
//         lng: Number(value.lng),
//       });
//     }
//   }, [value]);

//   const handleClick = (e) => {
//     const pos = {
//       lat: e.latLng.lat(),
//       lng: e.latLng.lng(),
//     };
//     setMarker(pos);
//     onChange(pos);
//   };

//   if (!isLoaded) return <p>Loading map...</p>;

//   return (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={marker}
//       zoom={15}
//       onClick={handleClick}
//     >
//       <Marker position={marker} draggable />
//     </GoogleMap>
//   );
// }
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "350px",
};

const fallbackCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

export default function LocationPicker({ value, onChange }) {
  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [marker, setMarker] = useState(fallbackCenter);

  // Sync edit mode location
  useEffect(() => {
    if (value?.lat && value?.lng) {
      setMarker({
        lat: Number(value.lat),
        lng: Number(value.lng),
      });
    }
  }, [value]);

  // When admin selects place from search
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    // if (!place.geometry) return;

    // const pos = {
    //   lat: place.geometry.location.lat(),
    //   lng: place.geometry.location.lng(),
    // };
     if (!place || !place.geometry || !place.geometry.location) {
    console.warn("No geometry found for selected place");
    return;
  }

  const pos = {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
  };

    setMarker(pos);
    onChange(pos);
  };

  // When admin clicks on map
  const handleMapClick = (e) => {
    const pos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarker(pos);
    onChange(pos);
  };

  if (!isLoaded) return <p>Loading map…</p>;

  return (
    <div>
      {/* 🔍 SEARCH BOX */}
      {/* <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search area or location"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />
      </Autocomplete> */}
       <Autocomplete
      onLoad={(ref) => (autocompleteRef.current = ref)}
      onPlaceChanged={onPlaceChanged}
      options={{
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      }}
    >
      <input
        type="text"
        placeholder="Search area or location"
        className="w-full mb-3 px-4 py-2 border rounded-lg"
      />
    </Autocomplete>


      {/* 🗺 MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker}
        zoom={15}
        onClick={handleMapClick}
      >
        <Marker position={marker} draggable />
      </GoogleMap>
    </div>
  );
}
