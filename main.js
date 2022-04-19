import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import Draw from 'ol/interaction/Draw';
import Snap from 'ol/interaction/Snap';
import Modify from 'ol/interaction/Modify';

const map = new Map({
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

const source = new VectorSource();

const standardMapLayer = new TileLayer({     // Creates standardmap layer/
  source: new OSM(),
});
standardMapLayer.setZIndex(0);

const countryBorderLayer = new VectorLayer({  // Creates new VectorLayer with country borders.
  source: new VectorSource({
    format: new GeoJSON(),
    url: './data/countries.json',
  })
});
countryBorderLayer.setZIndex(2);

const dragDropLayer = new VectorLayer({     // Creates new VectorLayer from given source.
  source: source,
});
dragDropLayer.setZIndex(1);

map.addLayer(standardMapLayer);     // Adds basic map to map object.
map.addLayer(countryBorderLayer);   // Adds country border layer to map object.
map.addLayer(dragDropLayer);        // Adds new Vectorlayer to map object.

const clear = document.getElementById('clear');          
const download = document.getElementById('download');
const standardMap = document.getElementById('standardMap');
const countryBorders = document.getElementById('countryBorders')
const format = new GeoJSON({featureProjection: 'EPSG:3857'}); 

clear.addEventListener('click', function () {       // Clears drag/drop vector layer & drawn vectors on click.
  source.clear();
});

source.on('change', function () {                               // Serialize vector data on changes in source vector and construct a data URI for the download element.
  const features = source.getFeatures();
  const json = format.writeFeatures(features);
  download.href =
    'data:application/json;charset=utf-8,' + encodeURIComponent(json);
});

standardMap.addEventListener('change', function() {     // Adds / removes standard map layer on checkbox change.
  if (this.checked) {
      map.addLayer(standardMapLayer)
  } else {
      map.removeLayer(standardMapLayer)
  }
});

countryBorders.addEventListener('change', function() {  // Adds/removes border layer on checkbox change.
  if (this.checked) {
      map.addLayer(countryBorderLayer)
  } else {
      map.removeLayer(countryBorderLayer)
  }
});

map.addInteraction(         // Allows for loading .json files onto map.
  new DragAndDrop({
    source: source,
    formatConstructors: [GeoJSON],
  })
);

map.addInteraction(         // Allows for modifying vector boundaries.
  new Modify({
      source: source,
  })
);

map.addInteraction(         // Allows for drawing new vectors
new Draw({
  type: 'Polygon',
  source: source,
})
);

map.addInteraction(         // snaps cursor to existing vector boundaries
  new Snap({
    source: source,
  })
);