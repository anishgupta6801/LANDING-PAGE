import { useState, useCallback } from 'react';
import { z } from 'zod';

interface ValidationOptions<T> {
  schema: z.ZodType<T>;
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
}

interface ValidationState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

interface ValidationActions<T> {
  handleChange: (field: keyof T) => (value: T[keyof T]) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => void;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
}

export const useFormValidation = <T extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
}: ValidationOptions<T>): ValidationState<T> & ValidationActions<T> => {
  const [state, setState] = useState<ValidationState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
  });

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      try {
        schema.parse({ ...state.values, [field]: value });
        return '';
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find((err) => err.path[0] === field);
          return fieldError?.message || '';
        }
        return '';
      }
    },
    [schema, state.values]
  );

  const validateForm = useCallback(() => {
    try {
      schema.parse(state.values);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof T;
          errors[field] = err.message;
        });
        setState((prev) => ({ ...prev, errors }));
      }
      return false;
    }
  }, [schema, state.values]);

  const handleChange = useCallback(
    (field: keyof T) => (value: T[keyof T]) => {
      setState((prev) => {
        const newValues = { ...prev.values, [field]: value };
        const error = validateField(field, value);
        return {
          ...prev,
          values: newValues,
          errors: { ...prev.errors, [field]: error },
          isValid: !error,
        };
      });
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [field]: true },
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const isValid = validateForm();
      if (!isValid) return;

      setState((prev) => ({ ...prev, isSubmitting: true }));
      try {
        await onSubmit(state.values);
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [onSubmit, state.values, validateForm]
  );

  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
    });
  }, [initialValues]);

  const setFieldValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      handleChange(field)(value);
    },
    [handleChange]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  return {
    ...state,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
}; 