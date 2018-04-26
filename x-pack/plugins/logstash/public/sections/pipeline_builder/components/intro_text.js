/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiText,
  EuiPanel
} from '@elastic/eui';
import loggy from '../../../assets/loggy.svg';

export class IntroText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldAppear: false,
      shouldTalk: false,
      hasSpoken: false
    };
    this.timeoutId = null;
  }

  componentDidMount() {
    this.showLoggy();
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  showLoggy = () => {
    this.timeoutId = setTimeout(() => this.setState({ shouldAppear: true }), 1000);
  }

  showSpeechBubble = () => {
    this.timeoutId = setTimeout(() => this.setState({ shouldTalk: true }), 100);
  }

  render() {
    const imgStyle = {
      position: 'fixed',
      right: -200,
      bottom: 10,
      width: 200,
      float: 'right',
      transition: 'transform 0.5s ease-in-out',
      transformOrigin: '100px 400px'
    };

    if (this.state.shouldAppear) {
      imgStyle.transform = 'rotate(-30deg)';
    }

    const speechBubbleStyle = {
      position: 'fixed',
      right: 120,
      bottom: 120,
      borderRadius: 16,
      width: 360
    };

    const speechBubble =
      this.state.shouldTalk
        ? (
          <EuiPanel
            paddingSize="l"
            hasShadow={true}
            grow={false}
            style={speechBubbleStyle}
          >
            <EuiText><h2>Go ahead, add an input plugin to get your pipeline started!</h2></EuiText>
          </EuiPanel>
        )
        : null;

    return (
      <div>
        { speechBubble }
        <img
          src={loggy}
          style={imgStyle}
          onTransitionEnd={this.showSpeechBubble}
        />
      </div>
    );
  }
}

// export function IntroText() {

//   const style = {
//     position: 'fixed',
//     right: -200,
//     bottom: 10,
//     width: 200
//   };

//   return (
//     <div
//       style={style}
//     >
//       <EuiFlexGroup
//         alignItems="flexEnd"
//         justifyContent="flexEnd"
//       >
//         <EuiFlexItem
//           grow={false}
//         >
//           <img
//             src={loggy}
//             width="100%"
//           />
//         </EuiFlexItem>
//       </EuiFlexGroup>
//     </div>
//   );

//   return (
//     <EuiFlexGroup
//       alignItems="center"
//       justifyContent="center"
//       style={{ width: "100%", height: "100%" }}
//     >
//       <EuiFlexItem
//         grow={false}
//       >
//         <div
//           style={{
//             backgroundImage: `url(${loggySpeechBubble})`,
//             backgroundSize: 'cover',
//             backgroundRepeat: 'no-repeat',
//             width: 522,
//             height: 500
//           }}
//         >
//           <div
//             style={{
//               marginTop: 90,
//               marginLeft: 120
//             }}
//           >
//             <EuiText><h2>Go ahead, add an input plugin</h2></EuiText>
//           </div>
//         </div>
//       </EuiFlexItem>
//     </EuiFlexGroup>
//   );
// }
