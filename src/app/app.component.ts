import "zone.js/dist/zone"; // Included with Angular CLI.
import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from "@angular/core";
import * as uuid from "uuid";
// No idea why this import fail, we have to load the webcomponent from app.componet.html
// Casa guys use the import.
// import 'trafimage-maps';
import RouteLayer from "trafimage-maps/es/layers/RouteLayer";
import ZoneLayer from "trafimage-maps/es/layers/ZoneLayer";
import { casa } from "trafimage-maps/es/config/topics";
import TrafimageMapboxLayer from "trafimage-maps/es/layers/TrafimageMapboxLayer";

const apiKey = "5cc87b12d7c5370001c1d655352830d2fef24680ae3a1cda54418cb8";
const apiKeyName = 'key';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  title = "angular-react-test";

  domId = '';
  private tmMapId = 'TmMap';
  private netzkarteLayer = new TrafimageMapboxLayer({
    name: "ch.sbb.netzkarte",
    copyright:
      "© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS",
    visible: true,
    isQueryable: false,
    isBaseLayer: true,
    radioGroup: "baseLayer",
    preserveDrawingBuffer: true,
    zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
    style: "base_bright_v2",
    apiKey:"5cc87b12d7c5370001c1d655352830d2fef24680ae3a1cda54418cb8"
    // https://maps.geops.io/styles/base_bright_v2/style.json?key=5cc87b12d7c5370001c1d655352830d2fef24680ae3a1cda54418cb8
  });

  // Intialization of zone layer.
  private  zoneLayer = new ZoneLayer({
    apiKey: apiKey,
    apiKeyName: apiKeyName,
    validFrom: '2019-12-16',
    validTo: '2020-12-01',
  });

  // Initialize route layer.
  private routeLayer = new RouteLayer({
    key: 'ch.sbb.casa.routeLayer',
    apiKey: apiKey,
    apiKeyName: apiKeyName,
  });

  private props = {
    topics: [
      {
        key: "My topic",
        layers: []
      }
    ]
  };

  render() {
    if (this.isMounted()) {
      const tm = document.getElementById("TmMap") || {};
      tm["topics"] = [
        {
          key: "Casa",
          layers: [ ...casa.layers, this.zoneLayer, this.routeLayer],
          elements: {
            mapControls: true,
            menu: false,
            popup: true,
            baseLayerSwitcher: true,
          },
        }
      ];
    }
  }

  ngOnInit(): void {
    this.domId = uuid.v1();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngAfterViewInit(): void {
    this.render();

  // Select zones.
  this.zoneLayer.loadZones([
    {
      partnerCode: 801,
      zones: [
        {
          zoneCode: 10,
          zoneName: 'Davos',
          isClickable: true,
        },
      ],
    },
    {
      partnerCode: 490,
      zones: [
        {
          zoneCode: 163,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 164,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 120,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 121,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 122,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 123,
          isSelected: false,
          isClickable: false,
        },
        {
          zoneCode: 124,
          isSelected: false,
          isClickable: false,
        },
      ],
    },
    {
      partnerCode: 446,
      zones: [
        {
          zoneCode: 170,
          isSelected: false,
          isClickable: true,
        },
        {
          zoneCode: 116,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 126,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 626,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 710,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 700,
          isSelected: true,
          isClickable: true,
        },
        {
          zoneCode: 701,
          isSelected: true,
          isClickable: true,
        },
      ],
    },
  ]);
  // // Visualize a route on the map.
  this.routeLayer
    .loadRoutes([
      {
        isClickable: true,
        isSelected: false,
        popupTitle: 'Route Biel/Bienne >> Freiburg/Fribourg',
        popupContent: ['Von: Bern', 'Nach: Freiburg/Fribourg'],
        sequences: [
          {
            uicFrom: 8507000,
            uicTo: 8504100,
            mot: 'rail',
          },
        ],
      },
      {
        isClickable: true,
        isSelected: true,
        sequences: [
          {
            uicFrom: 8500218,
            uicTo: 8507000,
            mot: 'rail',
          },
          {
            uicFrom: 8507000,
            lonLatTo: [46.94691, 7.44079],
            mot: 'foot',
          },
          {
            uicFrom: 8576646,
            uicTo: 8507180,
            mot: 'bus',
          },
          {
            uicFrom: 8507180,
            uicTo: 8507150,
            mot: 'foot',
          },
          {
            uicFrom: 8507150,
            lonLatTo: [46.68848, 7.68974],
            mot: 'ferry',
          },
        ],
      },
    ])
    .then(f => {
      this.routeLayer.zoomToRoute({duration: 1000});
    });
  }

  ngOnDestroy(): void {}

  private isMounted() {
    return !!this.domId;
  }

  private getDomNode(): HTMLElement | null {
    return document.getElementById(this.domId);
  }

  private getProps(): any {
    return this.props;
  }
}
