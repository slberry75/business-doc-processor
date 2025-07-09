import styles from './FloatingLabelInput.module.css';
import React, { forwardRef, useState } from "react";

export interface FloatingLabelInputProps {
    label: string,
    type?: string,
    error?: string,
    className?: string,
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
};

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, type = 'text', error, className = '', ...props }, ref) => {
    
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const isLabelFloated = isFocused || hasValue;
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (props.onFocus !== undefined) {
            props.onFocus(e);
        }
        setIsFocused(true);
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (props.onBlur !== undefined) {
            props.onBlur(e);
        }
        setIsFocused(false);
        setHasValue(e.target.value.length > 0);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onChange !== undefined) {
            props.onChange(e);
        }
        setHasValue(e.target.value.length > 0);
    }

    return (
        <div className={styles.container}>
            <input
                ref={ref}
                type={type}
                {...props}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                className={styles.input}
                placeholder={label}
            />
            
            <label className={`
                ${styles.label}
                ${isLabelFloated ? styles.labelFloated : styles.labelPlaceholder} 
            `}>
                {label}
            </label>

        </div>
    );
    
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';