import fs from 'fs';
import Papa from 'papaparse';
import { parse as originalParse } from 'wellknown';
import { BigQuery } from 'google-cloud/bigquery';
import Parcel from '../models/Parcel.js';

const bigQuery = new BigQuery();
export const getParcel = async (req, res) => {
  const mapblklot = req.params.mapblklot;
  const query = `SELECT * FROM your_dataset.your_table WHERE mapblklot = @mapblklot`;

  const options = {
    query: query,
    params: { mapblklot: mapblklot },
  };

  try {
    const [rows] = await bigQuery.query(options);
    res.json(rows);
  } catch (error) {
    console.error(`Failed to query BigQuery: ${error}`);
    res.status(500).json({ error: 'Failed to fetch parcel data' });
  }
};

const fsp = fs.promises;
const BATCH_SIZE = 500;

export const parseParcels = async (req, res) => {
  let allData = []; // Use this to collect all parcel data first

  try {
    const csvData = await fsp.readFile('./data/parcels.csv', 'utf8');

    // Synchronously collect data
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (row) => {
        if (row.data.shape) {
          allData.push(createParcel(row.data));
        } else {
          console.log(`Skipping row with null shape: ${JSON.stringify(row.data)}`);
        }
      },
      complete: async () => {
        // Now, process allData in batches after parsing is complete
        try {
          for (let i = 0; i < allData.length; i += BATCH_SIZE) {
            const batch = allData.slice(i, i + BATCH_SIZE);
            await saveBatch(batch);
          }
          res.status(200).json({ message: `${allData.length} parcels parsed and saved successfully.` });
        } catch (error) {
          console.error('Batch processing error:', error);
          res.status(400).json({ message: error.message });
        }
      },
      error: (error) => {
        console.error('Parsing error:', error);
        res.status(400).json({ message: error.message });
      }
    });
  } catch (error) {
    console.error('Error reading the CSV file:', error);
    res.status(500).json({ message: error.message });
  }
};

function parse(wkt) {
  const geojson = originalParse(wkt);

  if (geojson && geojson.type === 'MultiPolygon') {
    geojson.coordinates = geojson.coordinates.map(polygon => 
      polygon.map(ring => 
        ring.map(coord => [parseFloat(coord[0]), parseFloat(coord[1])])
      )
    );
  }
  
  return geojson;
}

function createParcel(data) {
  const geojson = parse(data.shape);

  return new Parcel({
    mapblklot: data.mapblklot,
    blklot: data.blklot,
    location: geojson
  });
}

async function saveBatch(batch) {
  return Parcel.insertMany(batch);
}

