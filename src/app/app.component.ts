import "trafimage-maps";
import TrafimageMapboxLayer from "trafimage-maps/es/layers/TrafimageMapboxLayer";
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

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  title = "angular-react-test";

  private domId: string;
  private tmMapId: string;
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
    style: "trafimage_perimeter_v2"
  });

  private props = {
    topics: [
      {
        key: "My topic",
        layers: [this.netzkarteLayer]
      }
    ]
  };

  render() {
    if (this.isMounted()) {
      const tm = document.getElementById("TmMap");
      /* tm.topics = [
        {
          key: "My topic",
          layers: [this.netzkarteLayer]
        }
      ]; */
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
