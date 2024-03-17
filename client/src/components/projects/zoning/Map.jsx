import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const SearchBox = styled('div')(({ theme }) => ({
  background: 'transparent',
  padding: '0.5em',
  fontSize: '15px',
  lineHeight: '30px',
  borderRadius: '2px',
  position: 'absolute',
  top: 10,
  left: 10,
  zIndex: 10,
}));

const SearchInput = styled('input')(({ theme }) => ({
  boxSizing: 'border-box',
  border: '1px solid transparent',
  width: '240px',
  height: '32px',
  padding: '0 12px',
  borderRadius: '12px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  fontSize: '14px',
  outline: 'none',
  textOverflow: 'ellipses',
}));

const Map = () => {
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null); // Ref for the autocomplete object

  useEffect(() => {
    if (window.google) {
      const center = { lat: 40.749933, lng: -73.98633 };
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center,
        mapTypeControl: false,
        gestureHandling: 'cooperative',
      });

      const input = document.getElementById('search-input'); // Directly get the input element
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        fields: ["formatted_address", "geometry", "name"],
        types: ['geocode'],
      });
      autocomplete.bindTo('bounds', map);
      
      autocompleteRef.current = autocomplete; // Store the autocomplete object in the ref

      const marker = new window.google.maps.Marker({
        map,
        anchorPoint: new window.google.maps.Point(0, -29),
      });

      autocomplete.addListener('place_changed', () => {
        marker.setVisible(false);
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
      });
    }
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', mb: '2rem' }}>
      <SearchBox>
        <SearchInput
          id="search-input"
          type="text"
          placeholder="Search Places..."
        />
      </SearchBox>
      <div ref={mapRef} style={{ height: '60vh', width: '100%' }}></div>
    </Box>
  );
};

export default Map;
