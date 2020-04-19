import * as d3 from 'd3-shape';
import {Dimensions} from 'react-native';
import {svgPathProperties} from 'svg-path-properties';

const {width} = Dimensions.get('window');

export const LeaderPathProperty = {
  width: width - 180,
  radius: 50,
};

export function getPath(month, line) {
  let fullPath = 'M90 100';
  const forwardLine = `l${line.width} 0`;
  const backwardLine = `l${-line.width} 0`;
  const leftCurve = `a${line.radius} ${line.radius} 0 0 0 0 ${line.radius * 2}`;
  const rightCurve = `a${line.radius} ${line.radius} 0 0 1 0 ${
    line.radius * 2
  }`;

  for (let i = 0; i < month; ++i) {
    if (i % 2 == 0) {
      fullPath += `${forwardLine} ${rightCurve}`;
    } else {
      fullPath += `${backwardLine} ${leftCurve}`;
    }
  }

  return fullPath;
}

export function getPathProperty(path, totalDays, radius) {
  const pathProperty = new svgPathProperties(path);
  const pathSegmentArray = [];

  let {x: previousX, y: previousY} = pathProperty.getPropertiesAtLength(0);

  for (let i = 1; i <= totalDays; ++i) {
    const leaderSegment = (i / totalDays) * pathProperty.getTotalLength();

    const {x: lx, y: ly} = pathProperty.getPropertiesAtLength(leaderSegment);

    const diffX = lx - previousX;
    const diffY = ly - previousY;

    previousX = lx;
    previousY = ly;

    const angleForOuterContourLine = Math.atan2(diffY, diffX);
    const angleForInnerContourLine = Math.PI - angleForOuterContourLine;

    const ox = lx + radius * Math.sin(angleForOuterContourLine);
    const oy = ly - radius * Math.cos(angleForOuterContourLine);
    const ix = lx - radius * Math.sin(angleForInnerContourLine);
    const iy = ly - radius * Math.cos(angleForInnerContourLine);

    const point = {
      outer: {x: ox, y: oy},
      leader: {x: lx, y: ly},
      inner: {
        x: ix,
        y: iy,
      },
    };
    pathSegmentArray.push(point);
  }

  return pathSegmentArray;
}

export const calculateProgressArea = (progress, pathSegment) => {
  const forwardArray = [];
  const backwardArray = [];

  let point = pathSegment[0];
  forwardArray.push(point.outer);
  backwardArray.push(point.inner);

  for (let i = 1; i < progress; ++i) {
    point = pathSegment[i];
    forwardArray.push(point.outer);
    backwardArray.push(point.inner);
  }

  backwardArray.reverse();
  const allPoint = [...forwardArray, ...backwardArray, forwardArray[0]];

  const area = d3
    .area()
    .x1((x) => {
      return x.x;
    })
    .y1((y) => {
      return y.y;
    })
    .y0(allPoint[0].y)
    .x0(allPoint[0].x);

  return area(allPoint);
};
