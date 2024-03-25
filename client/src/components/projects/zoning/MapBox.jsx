import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useGetParcelQuery } from 'state/api';
import { zoningSimToColor } from 'utils/parcels';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2lyYnJhbmRvbm4iLCJhIjoiY2x1MGlua2VwMDMxNTJrbDgzZHFpNXV0NiJ9.7qLWTEKvQXQC5ebmA5HeMQ'

const MapBox = ({ parcelData }) => {
  console.log('parcelData: ', parcelData);
  const mapContainerRef = useRef(null);
  const [selectedParcel, setSelectedParcel] = useState('');
  const { data: parcel, isLoading: isParcelLoading } = useGetParcelQuery({ mapblklot: selectedParcel }, { skip: !selectedParcel });

  // Helper function to parse shape string to GeoJSON coordinates.
  const parseShapeToGeoJSON = (shape) => {
    if (!shape) return null;
    const cleanedShape = shape.replace('MULTIPOLYGON (((', '').replace(')))', '');
    const polygonArray = cleanedShape.split(', ').map(coord => {
      const [longitude, latitude] = coord.split(' ').map(Number);
      return [longitude, latitude];
    });
    return polygonArray;
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-122.417, 37.760],
      zoom: 12,
    });

    map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      map.addSource('parcels', {
        type: 'geojson',
        data: 'http://localhost:5001/data/active_parcels.geojson'
      });

      map.addLayer({
        id: 'parcels',
        type: 'fill',
        source: 'parcels',
        layout: {},
        paint: {
          'fill-color': ['get', ['to-string', ['get', 'zoning_code']], ['literal', zoningSimToColor]],
          'fill-opacity': 0.6
        }
      });
    });

    map.on('click', 'parcels', (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        const mapblklot = feature.properties.mapblklot;
        setSelectedParcel(mapblklot);
        console.log(`A click event has occurred: ${mapblklot}`);

        let bounds = new mapboxgl.LngLatBounds();
        const coordinates = feature.geometry.coordinates[0];
        coordinates.forEach((point) => {
          bounds.extend(point);
        });
        console.log('bounds: ', bounds);
        map.fitBounds(bounds, { padding: 100 });
      }
    });

    if (parcelData) {
      const firstParcel = parcelData[0];
      const coordinates = parseShapeToGeoJSON(firstParcel.shape);
      if (coordinates) {
        let bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach(coord => {
          bounds.extend(coord);
        });
        map.fitBounds(bounds, { padding: 100 });
      }
    }

    return () => map.remove();
  }, [parcelData]);
  
  return <div ref={mapContainerRef} style={{ width: '100%', height: '70vh' }} />;
};

export default MapBox;
