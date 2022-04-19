import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

const map = new Map({
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

const standardMapLayer = new TileLayer({     // Creates standardmap layer/
  source: new OSM(),
});
standardMapLayer.setZIndex(0);
map.addLayer(standardMapLayer);     // Adds basic map to map object.

const countryBorderLayer = new VectorLayer({  // Creates new VectorLayer with country borders.
  source: new VectorSource({
    format: new GeoJSON(),
    url: './data/countries.json',
  })
});
countryBorderLayer.setZIndex(2);
map.addLayer(countryBorderLayer);   // Adds country border layer to map object.