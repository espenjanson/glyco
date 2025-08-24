# React Native/Expo Code Refactoring Instructions

You are tasked with refactoring a React Native/Expo codebase to follow best practices. Below are the specific changes you need to make, organized by priority and file.

## Global Refactoring Patterns

### Pattern 1: Inline Style Objects in Text Components
**Apply this pattern wherever you see:**
Text components using inline `style` prop with object literals instead of Restyle theme variants.

**Replace with:**
```typescript
// Instead of inline styles
<Text
  style={{
    fontSize: 48,
    fontFamily: "Circular-Bold",
    lineHeight: 56,
    textAlign: "center",
  }}
  color="text"
>
  {value}
</Text>

// Create and use theme variants
<Text variant="display" textAlign="center">
  {value}
</Text>
```

**Files containing this pattern:**
- `app/(tabs)/index.tsx` (lines 135-142)
- `components/history/RecentEntries.tsx` (line 25)
- `components/home/QuickActionButton.tsx` (multiple instances)
- `components/ui/Picker.tsx` (multiple instances)
- `components/medical/HelpTooltip.tsx` (multiple instances)
- `components/charts/LineChart.tsx` (multiple instances)

### Pattern 2: Time Picker Logic Duplication
**Apply this pattern wherever you see:**
Identical time picker implementation and date/time handling logic repeated across multiple components.

**Replace with:**
```typescript
// Create custom hook for time picker logic
export const useTimePicker = (initialTime?: Date) => {
  const [selectedTime, setSelectedTime] = useState(initialTime || new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = useCallback((increment: number) => {
    const newTime = new Date(selectedTime);
    newTime.setMinutes(newTime.getMinutes() + increment);
    setSelectedTime(newTime);
  }, [selectedTime]);

  const handleTimePickerChange = useCallback((_: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  }, []);

  return {
    selectedTime,
    setSelectedTime,
    showTimePicker,
    setShowTimePicker,
    handleTimeChange,
    handleTimePickerChange,
  };
};
```

**Files containing this pattern:**
- `components/sheets/GlucoseInputSheet.tsx` (lines 56-92)
- `components/sheets/InsulinInputSheet.tsx` (lines 56-68)

### Pattern 3: Form State and Validation Logic Duplication
**Apply this pattern wherever you see:**
Similar form handling, validation, and saving patterns across sheet components.

**Replace with:**
```typescript
// Create custom hook for common form operations
export const useFormState = <T extends Record<string, any>>(
  initialState: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as any);
  const [saving, setSaving] = useState(false);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<keyof T, string | null> = {} as any;
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field as keyof T](formData[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validationRules]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({} as any);
  }, [initialState]);

  return {
    formData,
    errors,
    saving,
    setSaving,
    updateField,
    validateForm,
    resetForm,
  };
};
```

**Files containing this pattern:**
- `components/sheets/GlucoseInputSheet.tsx` (lines 28-133)
- `components/sheets/InsulinInputSheet.tsx` (lines 28-100)

## File-Specific Refactoring Tasks

### CRITICAL FIXES (Fix these first)

#### File: `components/ui/Box.tsx`
**Current Issues:**
- File is 281 lines long (exceeds 200 line limit)
- Contains multiple component definitions that should be separate files
- Mixed component patterns and abstractions

**Required Changes:**

1. **Split into multiple component files:**
   - Extract lines 51-74 (Card component) into new file `components/ui/Card.tsx`
   - Extract lines 76-97 (TouchableBox component) into new file `components/ui/TouchableBox.tsx`
   - Extract lines 158-167 (Spacer component) into new file `components/ui/Spacer.tsx`
   - Keep Box, Text, Row, Column, Center, Container, SafeContainer, ScrollBox, SafeBox in original file

2. **Update imports in dependent files:**
   - Update all files importing `Card` from `./Box` to import from `./Card`
   - Update all files importing `TouchableBox` from `./Box` to import from `./TouchableBox`
   - Update all files importing `Spacer` from `./Box` to import from `./Spacer`

#### File: `components/sheets/GlucoseInputSheet.tsx`
**Current Issues:**
- File is 275 lines long (exceeds 200 line limit)
- Contains duplicate time picker logic
- Complex form validation logic that could be abstracted

**Required Changes:**

1. **Extract time picker logic into custom hook:**
   - Replace lines 56-92 with `useTimePicker` hook usage
   - Remove duplicate time picker implementation

2. **Extract form validation logic:**
   - Replace lines 28-133 with `useFormState` hook usage
   - Create validation rules object for glucose input

3. **Simplify component structure:**
   - Extract time picker modal into separate component `TimePickerModal.tsx`
   - Reduce component to focus only on glucose-specific logic

#### File: `components/sheets/InsulinInputSheet.tsx`
**Current Issues:**
- File is 193 lines long (approaches 200 line limit)
- Duplicate time picker logic identical to GlucoseInputSheet
- Similar form patterns that could be abstracted

**Required Changes:**

1. **Replace duplicate time picker logic:**
   - Replace lines 56-68 with `useTimePicker` hook usage
   - Remove duplicate implementation identical to GlucoseInputSheet

2. **Extract form state management:**
   - Replace lines 28-100 with `useFormState` hook for insulin shot data
   - Create validation rules specific to insulin input

3. **Fix duplicate InsulinDosageSelector rendering:**
   - Lines 161 and 165 both render `InsulinDosageSelector`
   - Remove the duplicate instance on line 161

### BEST PRACTICE IMPROVEMENTS

#### File: `app/(tabs)/index.tsx`
**Current Issues:**
- Uses inline style object instead of theme variant (lines 135-142)
- Missing performance optimizations (no React.memo, useMemo, useCallback)
- Complex component that could benefit from extraction

**Required Changes:**

1. **Convert inline styles to theme variants:**
   Replace lines 135-142:
   ```typescript
   // Instead of inline styles
   <Text
     style={{
       fontSize: 48,
       fontFamily: "Circular-Bold",
       lineHeight: 56,
       textAlign: "center",
     }}
     color="text"
   >
     {getDisplayGlucoseValue()}
   </Text>

   // Use new theme variant
   <Text variant="display" textAlign="center">
     {getDisplayGlucoseValue()}
   </Text>
   ```

2. **Add performance optimizations:**
   - Wrap expensive calculations with useMemo:
   ```typescript
   const todayStats = useMemo(() => {
     const today = new Date();
     today.setHours(0, 0, 0, 0);
     const todayShots = insulinShots.filter((shot) => shot.timestamp >= today);
     const totalUnits = todayShots.reduce((sum, shot) => sum + shot.units, 0);
     return {
       totalUnits: Math.round(totalUnits * 10) / 10,
       shotCount: todayShots.length,
     };
   }, [insulinShots]);
   ```

   - Add useCallback for event handlers:
   ```typescript
   const handleQuickAction = useCallback((action: QuickActionType) => {
     switch (action) {
       case "glucose":
         setShowGlucoseSheet(true);
         break;
       case "insulin":
         setShowInsulinSheet(true);
         break;
       case "food":
       case "exercise":
         break;
     }
   }, []);
   ```

#### File: `app/(tabs)/_layout.tsx`
**Current Issues:**
- Hard-coded style values instead of theme tokens (lines 9-35)
- No responsive design considerations

**Required Changes:**

1. **Move tab bar styles to theme variants:**
   Create new variant in `theme/index.ts`:
   ```typescript
   tabBarVariants: {
     floating: {
       position: "absolute",
       bottom: 40,
       width: "auto",
       marginHorizontal: 96,
       borderRadius: "round",
       height: "auto",
       shadowColor: "shadow",
       shadowOffset: { width: 0, height: 4 },
       shadowOpacity: 0.15,
       shadowRadius: 8,
       elevation: 10,
       alignItems: "center",
       paddingBottom: 0,
       paddingTop: 0,
     },
   },
   ```

2. **Use responsive values for margins:**
   ```typescript
   marginHorizontal: { phone: 32, tablet: 96 }
   ```

#### File: `components/ui/Button.tsx`
**Current Issues:**
- Using object spread for styles instead of proper Restyle variants
- Hard-coded color values instead of theme colors (line 76)
- Complex inline style logic that should use theme variants

**Required Changes:**

1. **Convert to proper Restyle button variants:**
   Create button variants in `theme/index.ts`:
   ```typescript
   buttonVariants: {
     defaults: {
       borderRadius: 'l',
       alignItems: 'center',
       justifyContent: 'center',
       flexDirection: 'row',
       paddingHorizontal: 'm',
       paddingVertical: 's',
       minHeight: 44,
     },
     primary: {
       backgroundColor: 'primary',
     },
     secondary: {
       backgroundColor: 'secondary',
     },
     outline: {
       backgroundColor: 'transparent',
       borderWidth: 1,
       borderColor: 'primary',
     },
     ghost: {
       backgroundColor: 'transparent',
     },
     danger: {
       backgroundColor: 'error',
     },
     small: {
       paddingHorizontal: 's',
       paddingVertical: 'xs',
       minHeight: 32,
     },
     large: {
       paddingHorizontal: 'l',
       paddingVertical: 'm',
       minHeight: 56,
     },
   },
   ```

2. **Replace color hard-coding:**
   Replace line 76:
   ```typescript
   // Instead of hard-coded colors
   <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#161616' : '#FFFFFF'} />

   // Use theme colors
   <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.white} />
   ```

#### File: `app/(tabs)/settings.tsx`
**Current Issues:**
- File is 195 lines long (approaches 200 line limit)
- Complex state management that could be simplified
- Missing performance optimizations

**Required Changes:**

1. **Extract settings state management into custom hook:**
   Create `hooks/useSettings.ts`:
   ```typescript
   export const useSettings = () => {
     const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
     const [medicalSettings, setMedicalSettings] = useState<MedicalSettings | null>(null);
     const [sectionWarnings, setSectionWarnings] = useState<Record<string, string[]>>({});
     const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

     // Move all the settings logic here
     const loadSettings = useCallback(async () => {
       // Implementation from lines 43-51
     }, []);

     const updateUserSetting = useCallback(<K extends keyof UserSettings>(
       key: K,
       value: UserSettings[K]
     ) => {
       // Implementation from lines 78-103
     }, [userSettings]);

     const updateMedicalSetting = useCallback((path: string[], value: any) => {
       // Implementation from lines 105-149
     }, [medicalSettings]);

     return {
       userSettings,
       medicalSettings,
       sectionWarnings,
       loadSettings,
       updateUserSetting,
       updateMedicalSetting,
     };
   };
   ```

2. **Add performance optimizations:**
   - Wrap the component with React.memo
   - Add useMemo for computed values
   - Add useCallback for event handlers

## New Files to Create

### 1. Create `hooks/useTimePicker.ts`
This custom hook consolidates repeated time picker logic found in:
- `GlucoseInputSheet.tsx` (lines 56-92)
- `InsulinInputSheet.tsx` (lines 56-68)

```typescript
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

export const useTimePicker = (initialTime?: Date) => {
  const [selectedTime, setSelectedTime] = useState(initialTime || new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = useCallback((increment: number) => {
    const newTime = new Date(selectedTime);
    newTime.setMinutes(newTime.getMinutes() + increment);
    setSelectedTime(newTime);
  }, [selectedTime]);

  const handleTimePickerChange = useCallback((_: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  }, []);

  return {
    selectedTime,
    setSelectedTime,
    showTimePicker,
    setShowTimePicker,
    handleTimeChange,
    handleTimePickerChange,
  };
};
```

### 2. Create `hooks/useFormState.ts`
Consolidates form state management patterns found across multiple components:
```typescript
import { useCallback, useState } from 'react';

export const useFormState = <T extends Record<string, any>>(
  initialState: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as any);
  const [saving, setSaving] = useState(false);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<keyof T, string | null> = {} as any;
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field as keyof T](formData[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validationRules]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({} as any);
  }, [initialState]);

  return {
    formData,
    errors,
    saving,
    setSaving,
    updateField,
    validateForm,
    resetForm,
  };
};
```

### 3. Create `hooks/useSettings.ts`
Extracts settings management logic from settings screen:
```typescript
import { useCallback, useRef, useState } from 'react';
import { MedicalSettings, UserSettings } from '../types';
import { MedicalCalculator } from '../utils/medical';
import { StorageService } from '../utils/storage';

export const useSettings = () => {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [medicalSettings, setMedicalSettings] = useState<MedicalSettings | null>(null);
  const [sectionWarnings, setSectionWarnings] = useState<Record<string, string[]>>({});
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousUserSettingsRef = useRef<UserSettings | null>(null);
  const previousMedicalSettingsRef = useRef<MedicalSettings | null>(null);

  const loadSettings = useCallback(async () => {
    const userSettingsData = await StorageService.getUserSettings();
    const medicalSettingsData = await StorageService.getMedicalSettings();
    setUserSettings(userSettingsData);
    setMedicalSettings(medicalSettingsData);
    previousUserSettingsRef.current = userSettingsData;
    previousMedicalSettingsRef.current = medicalSettingsData;
    setSectionWarnings({});
  }, []);

  const autoSave = useCallback(async (settings: {
    user?: UserSettings;
    medical?: MedicalSettings;
  }) => {
    try {
      if (settings.user) {
        await StorageService.saveUserSettings(settings.user);
        previousUserSettingsRef.current = settings.user;
      }
      if (settings.medical) {
        await StorageService.saveMedicalSettings(settings.medical);
        previousMedicalSettingsRef.current = settings.medical;

        const validation = MedicalCalculator.validateMedicalSettings(settings.medical);
        setSectionWarnings(validation.warningsBySection);
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, []);

  const updateUserSetting = useCallback(<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    if (!userSettings) return;

    const oldValue = userSettings[key];
    const newSettings = { ...userSettings, [key]: value };
    setUserSettings(newSettings);

    StorageService.saveSettingsChange("App Settings", String(key), oldValue, value);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      autoSave({ user: newSettings });
    }, 1000);
  }, [userSettings, autoSave]);

  const updateMedicalSetting = useCallback((path: string[], value: any) => {
    if (!medicalSettings) return;

    let oldCurrent = medicalSettings;
    for (let i = 0; i < path.length - 1; i++) {
      oldCurrent = oldCurrent[path[i] as keyof typeof oldCurrent] as any;
    }
    const oldValue = oldCurrent[path[path.length - 1] as keyof typeof oldCurrent];

    const newSettings = JSON.parse(JSON.stringify(medicalSettings));
    let current = newSettings;

    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    setMedicalSettings(newSettings);

    const sectionMap: Record<string, string> = {
      patientInfo: "Patient Information",
      basalInsulin: "Basal Insulin",
      mealInsulin: "Meal Insulin",
      correctionInsulin: "Correction Insulin",
      glucoseTargets: "Glucose Targets",
      administrationInstructions: "Administration Instructions",
    };
    const section = sectionMap[path[0]] || path[0];
    const field = path.join(".");

    StorageService.saveSettingsChange(section, field, oldValue, value);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      autoSave({ medical: newSettings });
    }, 1000);
  }, [medicalSettings, autoSave]);

  return {
    userSettings,
    medicalSettings,
    sectionWarnings,
    loadSettings,
    updateUserSetting,
    updateMedicalSetting,
  };
};
```

### 4. Create `components/ui/Card.tsx`
Extract Card component from Box.tsx:
```typescript
import { createRestyleComponent, createVariant, VariantProps } from "@shopify/restyle";
import React from "react";
import { View } from "react-native";
import { Theme } from "../../theme";

type CardProps = VariantProps<Theme, "cardVariants"> & {
  children?: React.ReactNode;
} & React.ComponentProps<typeof View>;

const CardBase = createRestyleComponent<CardProps, Theme>(
  [
    createVariant({ themeKey: "cardVariants" }),
  ],
  View
);

export const Card: React.FC<CardProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <CardBase {...props}>
      {children}
    </CardBase>
  );
};
```

### 5. Create `components/ui/TouchableBox.tsx`
Extract TouchableBox component from Box.tsx:
```typescript
import { createRestyleComponent } from "@shopify/restyle";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Theme } from "../../theme";

type TouchableBoxProps = TouchableOpacityProps & {
  children?: React.ReactNode;
} & React.ComponentProps<typeof View>;

const TouchableBoxBase = createRestyleComponent<TouchableBoxProps, Theme>(
  [],
  TouchableOpacity
);

export const TouchableBox = React.forwardRef<View, TouchableBoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <TouchableBoxBase ref={ref} {...props}>
        {children}
      </TouchableBoxBase>
    );
  }
);

TouchableBox.displayName = 'TouchableBox';
```

### 6. Create `components/common/TimePickerModal.tsx`
Extract time picker modal logic used in multiple sheets:
```typescript
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Platform } from "react-native";
import { Box, Column, Row } from "../ui/Box";
import { Button } from "../ui/Button";

interface TimePickerModalProps {
  visible: boolean;
  value: Date;
  onChange: (event: any, selectedDate?: Date) => void;
  onClose: () => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  value,
  onChange,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <Column gap="s">
      <DateTimePicker
        value={value}
        mode="datetime"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onChange}
      />
      {Platform.OS === "ios" && (
        <Row gap="s">
          <Box flex={1}>
            <Button
              label="Cancel"
              onPress={onClose}
              variant="outline"
              fullWidth
            />
          </Box>
          <Box flex={1}>
            <Button
              label="Done"
              onPress={onClose}
              variant="primary"
              fullWidth
            />
          </Box>
        </Row>
      )}
    </Column>
  );
};
```

### 7. Update `theme/index.ts` with new variants
Add the missing theme variants identified throughout the codebase:
```typescript
// Add to existing theme object
textVariants: {
  // ... existing variants
  display: {
    fontFamily: "Circular-Bold",
    fontSize: 48,
    lineHeight: 56,
    color: "text",
  },
},

buttonVariants: {
  defaults: {
    borderRadius: 'l',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 'm',
    paddingVertical: 's',
    minHeight: 44,
  },
  primary: {
    backgroundColor: 'primary',
  },
  secondary: {
    backgroundColor: 'secondary',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'primary',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: 'error',
  },
  small: {
    paddingHorizontal: 's',
    paddingVertical: 'xs',
    minHeight: 32,
  },
  large: {
    paddingHorizontal: 'l',
    paddingVertical: 'm',
    minHeight: 56,
  },
},

tabBarVariants: {
  floating: {
    position: "absolute",
    bottom: 40,
    width: "auto",
    marginHorizontal: { phone: 32, tablet: 96 },
    borderRadius: "round",
    height: "auto",
    shadowColor: "shadow",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    alignItems: "center",
    paddingBottom: 0,
    paddingTop: 0,
  },
},
```

## Refactoring Rules to Follow

1. **When splitting components:**
   - Each new component file should be 150-200 lines maximum
   - Export components as named exports unless they're screen components
   - Place shared components in `src/components/ui/`
   - Place screen-specific components in `src/components/[domain]/`

2. **When extracting hooks:**
   - Custom hooks go in `hooks/`
   - Focus on reusability and single responsibility
   - Always use useCallback and useMemo appropriately for performance

3. **When optimizing performance:**
   - Always provide dependency arrays for useEffect, useMemo, useCallback
   - Use React.memo for components that receive stable props
   - Extract expensive computations into useMemo

4. **Style guidelines:**
   - Use Shopify Restyle variants instead of inline styles
   - Define reusable variants in the theme for repeated patterns
   - Use responsive values for different screen sizes
   - Never use hard-coded colors - always use theme tokens

## Implementation Order

1. Create all new custom hooks first (`useTimePicker`, `useFormState`, `useSettings`)
2. Update theme with new variants
3. Split large component files (Box.tsx, extract Card, TouchableBox, Spacer)
4. Refactor sheet components to use new hooks
5. Update all inline styles to use theme variants
6. Add performance optimizations (React.memo, useMemo, useCallback)
7. Update imports throughout codebase

## Validation Checklist

After refactoring each file, ensure:
- [ ] No file exceeds 200 lines of code
- [ ] No duplicate code patterns exist
- [ ] All components follow single responsibility principle
- [ ] All styles use Restyle variants (no inline styles or hard-coded values)
- [ ] All hooks have proper dependency arrays
- [ ] All expensive operations use useMemo/useCallback
- [ ] All imports are properly organized

## Special Instructions

- Preserve all existing functionality - this is a refactor, not a rewrite
- Maintain the same API/props for components that are used elsewhere
- Use TypeScript properly with all new hooks and components
- Focus on converting all inline styles to proper Restyle theme usage
- Ensure all color values come from the theme, never hard-coded