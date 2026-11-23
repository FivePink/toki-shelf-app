import React from 'react';
import {
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type {
  ShelfContentPackage,
  ShelfRuntime,
  ShelfSlotId,
} from './contract';
import { useShelfSlotContent } from './useShelfSlotContent';

export function ShelfSlot({
  runtime,
  slot,
  renderContent,
  testID,
  style,
}: {
  runtime: ShelfRuntime;
  slot: ShelfSlotId;
  renderContent?: (content: ShelfContentPackage | null) => React.ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const content = useShelfSlotContent(runtime, slot);

  return (
    <View testID={testID} style={style}>
      {renderContent ? renderContent(content) : null}
    </View>
  );
}
