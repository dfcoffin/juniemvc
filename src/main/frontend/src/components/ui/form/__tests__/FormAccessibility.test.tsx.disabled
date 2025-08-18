import {describe, expect, it} from 'vitest';
import {render} from '../../../../test/test-utils';
import {FormField} from '../index';
import Input from '../Input';
import Select from '../Select';

// Extend the Vitest types to include our custom matcher
declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      toHaveNoAccessibilityViolations(): void;
    }
    interface Assertion {
      toHaveNoAccessibilityViolations(): Promise<void>;
    }
  }
}

describe('Form Components Accessibility', () => {
  it('FormField with Input is accessible', async () => {
    // Render a form field with an input
    const { container } = render(
      <form>
        <FormField id="test-field" label="Test Label" required>
          <Input 
            id="test-field" 
            placeholder="Enter text" 
            aria-required="true"
            aria-describedby="test-field-description"
          />
          <p id="test-field-description">This is a description for the field</p>
        </FormField>
      </form>
    );
    
    // Run accessibility tests
    await expect(container).toHaveNoAccessibilityViolations();
  });

  it('FormField with error message is accessible', async () => {
    // Render a form field with an error message
    const { container } = render(
      <form>
        <FormField 
          id="test-field" 
          label="Test Label" 
          error="This field is required"
          required
        >
          <Input 
            id="test-field" 
            placeholder="Enter text" 
            aria-invalid="true"
            aria-errormessage="test-field-error"
            error={true}
          />
          <div id="test-field-error" role="alert">This field is required</div>
        </FormField>
      </form>
    );
    
    // Run accessibility tests
    await expect(container).toHaveNoAccessibilityViolations();
  });

  it('Select component is accessible', async () => {
    // Render a select component
    const { container } = render(
      <form>
        <FormField id="test-select" label="Select an option">
          <Select
            id="test-select"
            value="option1"
            onChange={() => {}}
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' }
            ]}
          />
        </FormField>
      </form>
    );
    
    // Run accessibility tests
    await expect(container).toHaveNoAccessibilityViolations();
  });

  it('Form with multiple fields is accessible', async () => {
    // Render a form with multiple fields
    const { container } = render(
      <form>
        <div className="space-y-4">
          <FormField id="name" label="Full Name" required>
            <Input 
              id="name" 
              placeholder="Enter your name" 
              aria-required="true"
            />
          </FormField>
          
          <FormField id="email" label="Email Address" required>
            <Input 
              id="email" 
              type="email"
              placeholder="Enter your email" 
              aria-required="true"
            />
          </FormField>
          
          <FormField id="country" label="Country">
            <Select
              id="country"
              value=""
              onChange={() => {}}
              options={[
                { value: '', label: 'Select a country' },
                { value: 'us', label: 'United States' },
                { value: 'ca', label: 'Canada' },
                { value: 'uk', label: 'United Kingdom' }
              ]}
            />
          </FormField>
          
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </form>
    );
    
    // Run accessibility tests
    await expect(container).toHaveNoAccessibilityViolations();
  });
});