/*
This script provides a set of masking utilities for input fields,
converting a jQuery-dependent implementation to pure JavaScript
for compatibility with Angular 19.
*/

// Helper to simulate a simplified event trigger if needed, though direct event listeners are preferred.
function triggerEvent(element, eventType) {
  const event = new Event(eventType);
  element.dispatchEvent(event);
}

/**
 * Handles decimal input masking behavior.
 * This function is designed to be attached directly to input elements
 * or used within Angular directives.
 *
 * @param {HTMLInputElement} inputElement The input element to apply the decimal mask to.
 */
function decimal(inputElement) {
  const exp = /^0,[0-9]{2}$/;
  const initialDataAlign = inputElement.getAttribute('data-align');
  const alignClass = initialDataAlign && initialDataAlign !== '' ? initialDataAlign : 'right';

  // Apply initial attributes
  inputElement.setAttribute('placeholder', '0,00');
  inputElement.classList.add(`${alignClass}-align`);

  const handleKeyDown = (event) => {
    const value = inputElement.value;

    if (value === '' || value === '0,00' || value === '0') {
      if (event.keyCode === 8) { // Backspace key
        inputElement.value = '0,00';
        event.preventDefault();
        return;
      }
    }

    // Check if the pressed key is a numeric character
    if (Mask.masker.isNumeric(event.key)) {
      // Temporarily convert to float for logic, but keep string for display manipulation
      const numericValue = parseFloat(value.replace(',', '.'));

      if (exp.test(value)) {
        if (numericValue < 1 && value.length > 1) { // Avoid slicing '0,'
          inputElement.value = value.slice(-2); // Keep only the last two digits after '0,'
        }
      }
    }

    // Reapply the decimal mask after initial keydown processing
    setTimeout(() => {
      inputElement.value = Mask.masker.decimal(inputElement.value);
    }, 0);
  };

  const handleKeyUp = (event) => {
    if (inputElement.value === '' || inputElement.value === '0,00' || inputElement.value === '0') {
      if (event.keyCode === 8) {
        inputElement.value = '0,00';
        event.preventDefault();
      }
    }
  };

  const handleFocus = () => {
    if (inputElement.value.length === 0 || parseFloat(inputElement.value.replace(',', '.')) === 0) {
      inputElement.value = '0,00';
    }
  };

  const handleBlur = () => {
    if (inputElement.value.length === 0 || parseFloat(inputElement.value.replace(',', '.')) === 0) {
      inputElement.value = '0,00';
    }
  };

  // Attach event listeners
  inputElement.addEventListener('keydown', handleKeyDown);
  inputElement.addEventListener('keyup', handleKeyUp);
  inputElement.addEventListener('focus', handleFocus);
  inputElement.addEventListener('blur', handleBlur);
}

const Mask = {
  // Defines maximum lengths for various mask types.
  maxlength: {
    cep: 9,
    cnpj: 18,
    cpf: 14,
    date: 10,
    email: null, // No specific max length for email
    time: 8,
    credit_card: 19,
    phone: 15,
    celular: 16,
	decimal: null
  },

  // Regular expressions for validating masked input formats.
format: {
    cep: /^(\d{5}-\d{3})$/,
    cnpj: /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/,
    cpf: /^(\d{3}\.\d{3}\.\d{3}-\d{2})$/,
    date: /^((0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4})$/, // DD/MM/YYYY
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    time: /^([01]?[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/, // HH:MM or HH:MM:SS
    credit_card: /^(\d{4}\s){3}\d{4}$/, // XXXX XXXX XXXX XXXX
	decimal: /^((\d\.)+)\,(\d)$/
  },

  /**
   * Applies a specific mask to an input element's value.
   *
   * @param {HTMLInputElement} inputElement The input element to apply the mask to.
   * @param {string} maskType The type of mask to apply (e.g., 'cpf', 'decimal').
   */
  exec: (inputElement, maskType) => {
    const maskerFn = Mask.masker[maskType];
    if (typeof maskerFn === 'function') {
      // Use requestAnimationFrame for smoother updates, or setTimeout(0) for immediate async.
      // setTimeout(0) is used here to mimic the original's setTimeout(1) without blocking.
      requestAnimationFrame(() => {
        inputElement.value = maskerFn(inputElement.value);
        // Manually dispatch 'input' event to notify Angular of changes
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      });
    } else {
      console.error(`Mask function "${maskType}" does not exist in Mask.masker.`);
    }
  },

  /**
   * Provides various masking functions.
   */
  masker: {
    /**
     * Checks if a character is a numeric digit.
     * @param {string} char The character to check.
     * @returns {boolean} True if the character is a digit, false otherwise.
     */
    isNumeric: (char) => {
      return /^\d$/.test(char);
    },

    /**
     * Removes all non-numeric characters from a string.
     * @param {string} v The input string.
     * @returns {string} The string containing only numeric characters.
     */
    numeric: (v) => {
      return String(v).replace(/\D/g, '');
    },

    /**
     * Formats a string as a decimal number (e.g., "1234" becomes "12,34").
     * Handles Brazilian decimal format (comma as decimal separator, dot as thousands separator).
     * @param {string} v The input string.
     * @returns {string} The formatted decimal string.
     */
    decimal: (v) => {
      // Ensure input is a string and remove any non-digit characters except for comma
      v = String(v).replace(/\D/g, '');

      if (v.length === 0) return '0,00';
      if (v.length === 1) return `0,0${v}`;
      if (v.length === 2) return `0,${v}`;

      let integerPart = v.slice(0, -2);
      let decimalPart = v.slice(-2);

      // Add thousands separators
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      return `${integerPart},${decimalPart}`;
    },

    /**
     * Returns the input string unchanged (placeholder for generic string masking).
     * @param {string} v The input string.
     * @returns {string} The input string.
     */
    string: (v) => {
      return String(v);
    },

    /**
     * Formats a string as a CPF (Brazilian Individual Taxpayer Registry).
     * @param {string} v The input string.
     * @returns {string} The formatted CPF string.
     */
    cpf: (v) => {
      v = String(v).replace(/\D/g, '');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      return v;
    },

    /**
     * Formats a string as a CNPJ (Brazilian Corporate Taxpayer Registry).
     * @param {string} v The input string.
     * @returns {string} The formatted CNPJ string.
     */
    cnpj: (v) => {
      v = String(v).replace(/\D/g, '');
      v = v.replace(/(\d{2})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1/$2');
      v = v.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
      return v;
    },

    /**
     * Formats a string as either CPF or CNPJ based on its length.
     * @param {string} v The input string.
     * @returns {string} The formatted CPF or CNPJ string.
     */
    cpfcnpj: (v) => {
      v = String(v).replace(/\D/g, '');
      if (v.length <= 11) { // CPF has 11 digits (before formatting)
        return Mask.masker.cpf(v);
      } else { // CNPJ has 14 digits (before formatting)
        return Mask.masker.cnpj(v);
      }
    },

    /**
     * Formats a string as a date (DD/MM/YYYY).
     * @param {string} v The input string.
     * @returns {string} The formatted date string.
     */
    date: (v) => {
      v = String(v).replace(/\D/g, '');
      v = v.replace(/(\d{2})(\d)/, '$1/$2');
      v = v.replace(/(\d{2})(\d)/, '$1/$2');
      return v;
    },

    /**
     * Formats a string as a time (HH:MM or HH:MM:SS).
     * @param {string} v The input string.
     * @returns {string} The formatted time string.
     */
    time: (v) => {
      v = String(v).replace(/\D/g, '');
      v = v.replace(/(\d{2})(\d)/, '$1:$2');
      v = v.replace(/(\d{2})(\d)/, '$1:$2');
      return v;
    },

    /**
     * Formats a string as a phone number.
     * Supports both 8-digit and 9-digit phone numbers (after DDD).
     * @param {string} v The input string.
     * @returns {string} The formatted phone number string.
     */
    phone: (v) => {
      v = String(v).replace(/\D/g, '');
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2'); // (XX) XXXXXXXX
      if (v.length > 14) { // (XX) XXXXX-XXXX for 9-digit numbers
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
      } else { // (XX) XXXX-XXXX for 8-digit numbers
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
      }
      return v;
    },

    /**
     * Formats a string as a mobile phone number (celular).
     * @param {string} v The input string.
     * @returns {string} The formatted mobile number string.
     */
    celular: (v) => {
      v = String(v).replace(/\D/g, '');
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
      return v;
    },

    /**
     * Formats a string as a CEP (Brazilian Zip Code).
     * @param {string} v The input string.
     * @returns {string} The formatted CEP string.
     */
    cep: (v) => {
      v = String(v).replace(/\D/g, '');
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
      return v;
    },

    /**
     * Returns the email string unchanged (no specific formatting for email).
     * @param {string} v The input string.
     * @returns {string} The input email string.
     */
    email: (v) => {
      return String(v);
    },

    /**
     * Formats a string as a credit card number (XXXX XXXX XXXX XXXX).
     * @param {string} v The input string.
     * @returns {string} The formatted credit card number string.
     */
    credit_card: (v) => {
      v = String(v).replace(/\D/g, '');
      const parts = [];
      for (let i = 0; i < v.length; i += 4) {
        parts.push(v.substring(i, i + 4));
      }
      return parts.join(' ');
    }
  },

  /**
   * Initializes masking for all elements with a 'data-mask' attribute.
   * This function should be called when the DOM is ready, typically
   * within Angular's `ngAfterViewInit` or in a service after elements are rendered.
   */
  init: () => {
    // Select all elements with the 'data-mask' attribute
    document.querySelectorAll('[data-mask]').forEach((inputElement) => {
      const maskType = inputElement.getAttribute('data-mask');
      const maxLengthAttr = inputElement.getAttribute('maxlength');
      const placeholderAttr = inputElement.getAttribute('placeholder');

      const definedMaxLength = Mask.maxlength[maskType];
      const finalMaxLength = maxLengthAttr ? parseInt(maxLengthAttr, 10) : definedMaxLength;

      if (finalMaxLength) {
        inputElement.setAttribute('maxlength', finalMaxLength);
      }

      if (placeholderAttr) {
        inputElement.setAttribute('placeholder', placeholderAttr);
        // Find the parent with class 'input-field' and its label, then add 'active'
        const parentInputField = inputElement.closest('.input-field');
        if (parentInputField) {
          const label = parentInputField.querySelector('label');
          if (label) {
            label.classList.add('active');
          }
        }
      }

      // If the input type is hidden, create a visible label
      if (inputElement.getAttribute('type') === 'hidden') {
        const textValue = inputElement.value || 'Não informado';
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', maskType); // Use maskType as id for 'for' attribute
        labelElement.textContent = textValue;
        if (textValue === 'Não informado') {
          labelElement.style.color = 'inherit'; // Or set to a specific color
        } else {
          labelElement.style.color = 'inherit'; // Default to inherit for informed values
        }
        inputElement.parentNode.appendChild(labelElement);
      } else {
        const onEvent = inputElement.getAttribute('data-onevent') || 'keyup keypress keydown';

        if (maskType === 'decimal') {
          decimal(inputElement); // Directly call the decimal function
        } else {
          // Attach a single event listener that handles all specified events
          onEvent.split(' ').forEach(eventType => {
            inputElement.addEventListener(eventType, () => {
              Mask.exec(inputElement, maskType);
            });
          });
        }

        // Add event listeners for format validation and error handling
        ['keypress', 'keyup', 'keydown'].forEach(eventType => {
          inputElement.addEventListener(eventType, () => {
            const parentInputField = inputElement.closest('.input-field');
            if (parentInputField) {
              // Remove existing error states and messages
              parentInputField.classList.remove('error');
              const existingErrorDiv = parentInputField.querySelector('.error-message');
              if (existingErrorDiv) {
                existingErrorDiv.remove();
              }

              const formatRegex = Mask.format[maskType];
              // Validate format only if there's a value and a regex defined
              if (inputElement.value && formatRegex && !formatRegex.test(inputElement.value)) {
                parentInputField.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = 'Formato inválido.';
                parentInputField.appendChild(errorDiv);
              }

              // Remove error if the input is empty
              if (!inputElement.value) {
                parentInputField.classList.remove('error');
                const existingErrorDiv = parentInputField.querySelector('.error-message');
                if (existingErrorDiv) {
                  existingErrorDiv.remove();
                }
              }
            }
          });
        });
      }
    });
  }
};
