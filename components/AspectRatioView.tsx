import React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';

const ASPECT_RATIO = 9 / 20;

export default function AspectRatioView({ children }: { children: React.ReactNode }) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const isPortrait = screenHeight > screenWidth;

  let containerWidth;
  let containerHeight;

  if (isPortrait) {
    containerWidth = screenWidth;
    containerHeight = screenWidth / ASPECT_RATIO;
    if (containerHeight > screenHeight) {
      containerHeight = screenHeight;
      containerWidth = screenHeight * ASPECT_RATIO;
    }
  } else {
    containerHeight = screenHeight;
    containerWidth = screenHeight * ASPECT_RATIO;
    if (containerWidth > screenWidth) {
      containerWidth = screenWidth;
      containerHeight = screenWidth / ASPECT_RATIO;
    }
  }

  const horizontalMargin = (screenWidth - containerWidth) / 2;
  const verticalMargin = (screenHeight - containerHeight) / 2;

  return (
    <View style={styles.outerContainer}>
      <View
        style={{
          width: containerWidth,
          height: containerHeight,
          marginHorizontal: horizontalMargin,
          marginVertical: verticalMargin,
        }}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
});
