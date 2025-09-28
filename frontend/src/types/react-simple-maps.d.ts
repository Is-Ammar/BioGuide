declare module 'react-simple-maps' {
  import * as React from 'react';
  import { GeoProjection } from 'd3-geo';

  export interface ComposableMapProps {
    projection?: any;
    projectionConfig?: any;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  export const ComposableMap: React.FC<ComposableMapProps>;

  export interface ZoomableGroupProps {
    children?: React.ReactNode;
    zoom?: number;
    center?: [number, number];
    disablePanning?: boolean;
  }
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;

  export interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: any[]; projection: GeoProjection }) => React.ReactNode;
  }
  export const Geographies: React.FC<GeographiesProps>;

  export interface GeographyProps {
    geography: any;
    projection?: GeoProjection;
    style?: any;
  }
  export const Geography: React.FC<GeographyProps>;
}
