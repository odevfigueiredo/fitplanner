/// <reference types="nativewind/types" />

import "react-native";

declare module "*.css";

declare module "react-native" {
  interface ViewProps {
    className?: string;
    cssInterop?: boolean;
  }

  interface TextProps {
    className?: string;
    cssInterop?: boolean;
  }

  interface TextInputProps {
    className?: string;
    placeholderClassName?: string;
    cssInterop?: boolean;
  }

  interface PressableProps {
    className?: string;
    cssInterop?: boolean;
  }

  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
    indicatorClassName?: string;
    cssInterop?: boolean;
  }

  interface ImagePropsBase {
    className?: string;
    cssInterop?: boolean;
  }

  interface ImageProps {
    className?: string;
    cssInterop?: boolean;
  }

  interface SwitchProps {
    className?: string;
    cssInterop?: boolean;
  }

  interface KeyboardAvoidingViewProps {
    className?: string;
    contentContainerClassName?: string;
    cssInterop?: boolean;
  }
}
