import React, { forwardRef, useRef, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';  
import '../../css/additional-styles/datepicker.css';

const MultiDateSelect = forwardRef(
  ({ selectedDates = [], onSelect, className = '', isFocused = false, placeholder = 'Select dates' }, ref) => {
    const datePickerRef = ref || useRef();
    const [internalDates, setInternalDates] = useState(selectedDates.map(date => new Date(date)));

    useEffect(() => {
      if (isFocused && datePickerRef.current) {
        datePickerRef.current.setFocus();
      }
    }, [isFocused]);

    const handleDateChange = (date) => {
      if (!date) return;

      const isAlreadySelected = internalDates.some(
        (selectedDate) => selectedDate.toDateString() === date.toDateString()
      );

      const updatedDates = isAlreadySelected
        ? internalDates.filter(
            (selectedDate) => selectedDate.toDateString() !== date.toDateString()
          )
        : [...internalDates, date];

      setInternalDates(updatedDates);

      if (onSelect) {
        onSelect(updatedDates.map(date => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`));
      }
    };

    return (
      <div className={`multi-date-select ${className}`}>
        <DatePicker
          selected={null}
          onChange={handleDateChange}
          highlightDates={internalDates} 
          inline
          placeholderText={placeholder}
          ref={datePickerRef}
        />
      </div>
    );
  }
);

export default MultiDateSelect;
