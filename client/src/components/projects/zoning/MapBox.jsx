import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useGetParcelQuery } from 'state/api';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2lyYnJhbmRvbm4iLCJhIjoiY2x1MGlua2VwMDMxNTJrbDgzZHFpNXV0NiJ9.7qLWTEKvQXQC5ebmA5HeMQ'

const MapBox = () => {
  const mapContainerRef = useRef(null);
  const [getParcel] = useGetParcelQuery();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-122.417, 37.760],
      zoom: 12
    });

    map.on('load', () => {
      map.addSource('parcels', {
        type: 'geojson',
        data: 'http://localhost:5001/data/parcels.geojson'
      });

      map.addLayer({
        id: 'parcels',
        type: 'fill',
        source: 'parcels',
        layout: {},
        paint: {
          'fill-color': '#888',
          'fill-opacity': 0.4
        }
      });
    });

    map.on('click', 'parcels', (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        const mapblklot = feature.properties.mapblklot;
        console.log(`A click event has occurred: ${mapblklot}`);

        let bounds = new mapboxgl.LngLatBounds();
        const coordinates = feature.geometry.coordinates[0];
        coordinates.forEach((point) => {
          bounds.extend(point);
        });

        map.fitBounds(bounds, { padding: 40 });
      }
    });

    return () => map.remove();
  }, []);
  
  return <div ref={mapContainerRef} style={{ width: '100%', height: '70vh', marginBottom: '2rem' }} />;
};

export default MapBox;
