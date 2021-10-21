import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import RouteLayer from 'trafimage-maps/es/layers/RouteLayer';
import ZoneLayer from 'trafimage-maps/es/layers/ZoneLayer';
import {casa} from 'trafimage-maps/es/config/topics';
import {MapElements, Route, ZoneConfig} from '../../../route-offer-panel/model/trafimage-maps.model';
import 'trafimage-maps';
import {apiKeys, environment} from '../../../../../../../environments/environment';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

    private static readonly TRAFIMAGE_API_KEY_NAME = 'api_key';
    private static readonly TILE_SERVER_URL = 'https://journey-maps-tiles.geocdn.sbb.ch';
    private static readonly ROUTE_PATH = '/v1/route';

    @Input() mapElements: MapElements;
    @Input() zoneValidity: string;
    @Output() zoneClicked = new EventEmitter<ZoneConfig>();
    @Output() routeClicked = new EventEmitter<Route>();

    @ViewChild('mapContainer')
    containerElement: ElementRef;

    private mapElement: HTMLElement;
    private zoneLayer: ZoneLayer;
    private routeLayer: RouteLayer;

    private journeyMapsUrl: string;
    private journeyMapsApiKey: string;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.mapElements && !changes.mapElements.isFirstChange()) {
            this.renderMap(changes.mapElements.currentValue);
        }
    }

    ngOnInit(): void {
        this.journeyMapsUrl = environment.journeyMapsUrl + MapComponent.ROUTE_PATH;
        this.journeyMapsApiKey = apiKeys.journeyMapsApiKey;

        this.zoneLayer = this.createZoneLayer();
        this.routeLayer = this.createRouteLayer();
    }

    ngAfterViewInit(): void {
        this.mapElement = this.createMapElement();
        this.renderMap(this.mapElements);
    }

    private createZoneLayer(): ZoneLayer {
        const zoneLayer = new ZoneLayer({
            apiKey: apiKeys.trafmageApiKey
        });

        zoneLayer.onClick(feature => {
            if (feature && feature.length > 0 && feature[0].get('isClickable')) {
                const partnerCode = Number(feature[0].get('partner_code'));
                const zoneCode = feature[0].get('zone');
                const zones = this.mapElements.zoneConfigs.find(zoneConfig => zoneConfig.partnerCode === partnerCode).zones;
                const zone = zones.find(z => z.zoneCode === zoneCode);

                this.zoneClicked.emit({
                    partnerCode,
                    zones: [zone]
                });
            }
        });

        return zoneLayer;
    }

    private createRouteLayer(): RouteLayer {
        const routeLayer = new RouteLayer({
            key: 'ch.sbb.casa.routeLayer',
            url: this.journeyMapsUrl,
            apiKeyName: MapComponent.TRAFIMAGE_API_KEY_NAME,
            apiKey: this.journeyMapsApiKey
        });

        routeLayer.onClick(feature => {
            if (feature && feature.length > 0 && feature[0].get('route').isClickable) {
                const route = feature[0].get('route');
                if (route) {
                    this.routeClicked.emit(route);
                }
            }
        });

        return routeLayer;
    }

    private renderMap(mapConfiguration: MapElements) {
        this.zoneLayer.clear();
        this.routeLayer.clear();

        const hasRoute = mapConfiguration && mapConfiguration.routes && mapConfiguration.routes.length > 0;
        const hasZone = mapConfiguration && mapConfiguration.zoneConfigs && mapConfiguration.zoneConfigs.length > 0;
        if (hasRoute) {
            this.routeLayer.loadRoutes(mapConfiguration.routes)
                .then(() => {
                    this.routeLayer.zoomToRoute();
                })
                .catch(error => {
                    console.error('Error in \'loadRoutes\': ' + error);
                });
        }

        if (hasZone) {
            this.zoneLayer.setValidity(this.zoneValidity, this.zoneValidity);
            this.zoneLayer.loadZones(mapConfiguration.zoneConfigs)
                .then(() => {
                    if (!hasRoute) {
                        this.zoneLayer.zoomToZones();
                    }
                })
                .catch(error => {
                    console.error('Error in \'loadZones\': ' + error);
                });
        }

    }

    /**
     * Element must not be added to the DOM before configuration of the topics. Therefore not possible to add to template
     */
    private createMapElement(): HTMLElement {
        const mapElement: HTMLElement | any = document.createElement('trafimage-maps');
        this.containerElement.nativeElement.appendChild(mapElement);
        mapElement.setAttribute('appName', 'casa');
        mapElement.setAttribute('apiKey', apiKeys.trafmageApiKey);
        mapElement.setAttribute('apiKeyName', MapComponent.TRAFIMAGE_API_KEY_NAME);
        mapElement.setAttribute('vectorTilesKey', apiKeys.tileServerApiKey);
        mapElement.setAttribute('vectorTilesUrl', MapComponent.TILE_SERVER_URL);
        mapElement.setAttribute('zoom', '8');

        mapElement.topics = [{  // requires mapElement to be typed as any
            ...casa,
            layers: [...casa.layers, this.zoneLayer, this.routeLayer],
            elements: {
                mapControls: true,
                popup: true,
                baseLayerSwitcher: true
            }
        }];

        // HACK: Must be set after initialization of map element. (Will be overwritten otherwise)
        this.routeLayer.apiKey = this.journeyMapsApiKey;
        this.zoneLayer.apiKey = apiKeys.trafmageApiKey;

        return mapElement;
    }

}
