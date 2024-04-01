import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { useGetParcelQuery } from 'state/api';
import { zoningSimToColor } from 'utils/parcels';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2lyYnJhbmRvbm4iLCJhIjoiY2x1MGlua2VwMDMxNTJrbDgzZHFpNXV0NiJ9.7qLWTEKvQXQC5ebmA5HeMQ'

const MapBox = ({ parcelData, onSearch }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ closeButton: false }));

  const parseShapeToGeoJSON = (shape) => {
    if (!shape) return [];
    const cleanedShape = shape.replace('MULTIPOLYGON (((', '').replace(')))', '');
    const polygonArray = cleanedShape.split(', ').map(coord => {
      const [longitude, latitude] = coord.split(' ').map(Number);
      return [longitude, latitude];
    });
    return polygonArray;
  };

  const updateMapBounds = (parcelData) => {
    if (!parcelData || parcelData.length === 0 || !mapRef.current) return;
    const bounds = new mapboxgl.LngLatBounds();
  
    const validParcels = parcelData.filter(parcel => 
      parcel.centroid_latitude && parcel.centroid_longitude !== 0 && parcel.shape !== ''
    );

    if (validParcels.length === 0) return;
    
    validParcels.forEach(parcel => {
      const coordinates = parseShapeToGeoJSON(parcel.shape);
      coordinates.forEach(coord => {
        bounds.extend(coord);
      });
    });
  
    mapRef.current.fitBounds(bounds, { padding: 100 });
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-122.430, 37.768],
        zoom: 11,
      });

      mapRef.current.scrollZoom.disable();
      mapRef.current.addControl(new mapboxgl.NavigationControl());

      let hoveredPolygonId = null;

      mapRef.current.on('load', () => {
        mapRef.current.addSource('neighborhoods', {
          type: 'geojson',
          data: 'http://localhost:5001/data/neighborhoods.geojson'
        });
        
        mapRef.current.addLayer({
          id: 'neighborhood-fill',
          type: 'fill',
          source: 'neighborhoods',
          layout: {},
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.9,
              0.3
            ]
          },
          maxzoom: 13
        });

        mapRef.current.addLayer({
          'id': 'neighborhoods-outline',
          'type': 'line',
          'source': 'neighborhoods',
          'layout': {},
          'paint': {
            'line-color': '#040273',
            'line-width': 1.5
          }
        });

        mapRef.current.addSource('zoning-districts', {
          type: 'geojson',
          data: 'http://localhost:5001/data/zoning_districts.geojson'
        });

        mapRef.current.addLayer({
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

        mapRef.current.addLayer({
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

        mapRef.current.addSource('parcels', {
          type: 'geojson',
          data: 'http://localhost:5001/data/active_parcels.geojson'
        });

        mapRef.current.addLayer({
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

        mapRef.current.addLayer({
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

      mapRef.current.on('mousemove', 'neighborhood-fill', (e) => {
        if (e.features.length > 0) {
          if (hoveredPolygonId !== null) {
            mapRef.current.setFeatureState(
              { source: 'neighborhoods', id: hoveredPolygonId },
              { hover: false }
            );
          }
          const feature = e.features[0];
          hoveredPolygonId = feature.id;
          mapRef.current.setFeatureState(
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
            .addTo(mapRef.current);

            mapRef.current.getCanvas().style.cursor = 'pointer';
        }
      });

      mapRef.current.on('mouseleave', 'neighborhood-fill', () => {
        if (hoveredPolygonId !== null) {
          popUpRef.current.remove();
          mapRef.current.getCanvas().style.cursor = '';
          mapRef.current.setFeatureState(
            { source: 'neighborhoods', id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });

      mapRef.current.on('click', 'neighborhood-fill', (e) => {
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
          mapRef.current.fitBounds(bounds, { padding: 100 });
        }
      });

      mapRef.current.on('click', 'parcels', (e) => {
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
          mapRef.current.fitBounds(bounds, { padding: 100 });
        }
      });
    }

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      if (mapContainerRef.current) {
        resizeObserver.unobserve(mapContainerRef.current);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (parcelData && mapRef.current) {
      updateMapBounds(parcelData);
    }
  }, [parcelData]);

  return <Box ref={mapContainerRef} style={{ display: 'flex', width: '100%', height: '70vh' }} />;
};

export default MapBox;
