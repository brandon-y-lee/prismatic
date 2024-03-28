import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { useGetParcelQuery } from 'state/api';
import { zoningSimToColor } from 'utils/parcels';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2lyYnJhbmRvbm4iLCJhIjoiY2x1MGlua2VwMDMxNTJrbDgzZHFpNXV0NiJ9.7qLWTEKvQXQC5ebmA5HeMQ'

const MapBox = ({ parcelData, onSearch }) => {
  const mapContainerRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ closeButton: false }));

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
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.430, 37.768],
      zoom: 11,
    });

    let hoveredPolygonId = null;

    map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      map.addSource('neighborhoods', {
        type: 'geojson',
        data: 'http://localhost:5001/data/neighborhoods.geojson'
      });
      
      map.addLayer({
        id: 'neighborhood-fill',
        type: 'fill',
        source: 'neighborhoods',
        layout: {},
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.3
          ]
        },
        maxzoom: 13
      });

      map.addLayer({
        'id': 'neighborhoods-outline',
        'type': 'line',
        'source': 'neighborhoods',
        'layout': {},
        'paint': {
          'line-color': '#040273',
          'line-width': 1.5
        }
      });

      map.addSource('zoning-districts', {
        type: 'geojson',
        data: 'http://localhost:5001/data/zoning_districts.geojson'
      });

      map.addLayer({
        id: 'zoning-districts',
        type: 'fill',
        source: 'zoning-districts',
        layout: {},
        paint: {
          'fill-color': ['get', ['to-string', ['get', 'zoning_sim']], ['literal', zoningSimToColor]],
          'fill-opacity': 0.3
        },
        minzoom: 13,
        maxzoom: 15
      });

      map.addLayer({
        'id': 'zoning-outline',
        'type': 'line',
        'source': 'zoning-districts',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 0.5
        },
        minzoom: 13,
        maxzoom: 15
      });

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
        },
        minzoom: 14
      });

      map.addLayer({
        'id': 'parcels-outline',
        'type': 'line',
        'source': 'parcels',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 0.5
        },
        minzoom: 14
      });
    });

    map.on('mousemove', 'neighborhood-fill', (e) => {
      if (e.features.length > 0) {
        if (hoveredPolygonId !== null) {
          map.setFeatureState(
            { source: 'neighborhoods', id: hoveredPolygonId },
            { hover: false }
          );
        }
        const feature = e.features[0];
        hoveredPolygonId = feature.id;
        map.setFeatureState(
          { source: 'neighborhoods', id: hoveredPolygonId },
          { hover: true }
        );

        let bounds = new mapboxgl.LngLatBounds();
        const properties = feature.properties;
        const coordinates = feature.geometry.coordinates[0];

        coordinates.forEach((point) => {
          bounds.extend(point);
        });
        
        const centroidLng = (bounds.getNorthEast().lng + bounds.getSouthWest().lng) / 2.0;
        const centroidLat = (bounds.getNorthEast().lat + bounds.getSouthWest().lat) / 2.0;

        popUpRef.current
          .setLngLat([centroidLng, centroidLat])
          .setHTML(`<h3>${properties.name}</h3>`)
          .addTo(map);

        map.getCanvas().style.cursor = 'pointer';
      }
    });

    map.on('mouseleave', 'neighborhood-fill', () => {
      if (hoveredPolygonId !== null) {
        popUpRef.current.remove();
        map.getCanvas().style.cursor = '';
        map.setFeatureState(
          { source: 'neighborhoods', id: hoveredPolygonId },
          { hover: false }
        );
      }
      hoveredPolygonId = null;
    });

    map.on('click', 'neighborhood-fill', (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        const name = feature.properties.name;
        console.log(`Neighborhood clicked: ${name}`);

        let bounds = new mapboxgl.LngLatBounds();
        const coordinates = feature.geometry.coordinates[0];
        coordinates.forEach((point) => {
          bounds.extend(point);
        });
        console.log('bounds: ', bounds);
        map.fitBounds(bounds, { padding: 100 });
      }
    });

    map.on('click', 'parcels', (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        console.log('feature: ', feature);
        const blklot = feature.properties.blklot;
        console.log(`A click event has occurred: ${blklot}`);

        onSearch(blklot);

        let bounds = new mapboxgl.LngLatBounds();
        const coordinates = feature.geometry.coordinates[0];
        coordinates.forEach((point) => {
          bounds.extend(point);
        });
        console.log('bounds: ', bounds);
        map.fitBounds(bounds, { padding: 100 });
      }
    });
    return () => map.remove();
  }, []);

  return <Box ref={mapContainerRef} style={{ display: 'flex', width: '100%', height: '70vh' }} />;
};

export default MapBox;
