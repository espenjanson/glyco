import { useState } from 'react';

export const useFormState = <T extends Record<string, any>>(
  initialState: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as any);
  const [saving, setSaving] = useState(false);

  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
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
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({} as any);
  };

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