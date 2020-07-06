import React, {Component} from 'react';
import {Text, Dimensions, ScrollView} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import * as PathHelper from './PathHelper';

const {width} = Dimensions.get('screen');
export default class App extends Component {
  constructor(props) {
    super(props);

    this.month = 10;
    this.totalDays = this.month * 30;

    this.leaderLineProperty = {
      lineWidth: width - 180,
      radius: 50,
    };
  }

  startProcessing = () => {
    this.path = PathHelper.getPath(this.month, PathHelper.LeaderPathProperty);
    this.pathSegmentArray = PathHelper.getPathProperty(
      this.path,
      this.totalDays,
      20,
    );
    this.area = PathHelper.calculateProgressArea(
      this.totalDays,
      this.pathSegmentArray,
    );
  };

  render() {
    this.startProcessing();
    return (
      <ScrollView style={{flex: 1}}>
        <Svg style={{width: '100%', height: this.month * 100 + 120}}>
          <Path
            d={this.area}
            stroke="black"
            strokeWidth={1}
            fill="red"
            fillRule="evenodd"
          />
        </Svg>
      </ScrollView>
    );
  }
}
