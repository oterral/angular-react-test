import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as uuid from 'uuid';
import * as React from 'react';
import { ReactDOM } from 'react';
import TrafimageMaps from 'trafimage-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  title = 'angular-react-test';

  private domId: string;
  private netzkarteLayer = {
    name: 'ch.sbb.netzkarte',
    copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
    isBaseLayer: true,
    url: '/localhost:4211'
  };
  private props = {
    baseLayers: [this.netzkarteLayer],
    elements: {},
    topics: {
      name: 'Digitale Stelen',
      key: 'ch.sbb.stelen',
      layers: [this.netzkarteLayer],
    }
  };

  render() {
    if (this.isMounted()) {
      ReactDOM.render(React.createElement(TrafimageMaps, this.getProps()), this.getDomNode());
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

  ngOnDestroy(): void {
  }

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
