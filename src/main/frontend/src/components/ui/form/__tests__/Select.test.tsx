import {describe, expect, it} from 'vitest';
import {fireEvent, render, screen} from '../../../../test/test-utils';
import Select from '../Select';

describe('Select component', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  it('renders correctly with options', () => {
    render(
      <Select
        id="test-select"
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Option 1');
    expect(options[1]).toHaveTextContent('Option 2');
    expect(options[2]).toHaveTextContent('Option 3');
  });

  it('selects the correct default value', () => {
    render(
      <Select
        id="test-select"
        options={defaultOptions}
        value="option2"
        onChange={() => {}}
      />
    );
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });

  it('triggers onChange when selection changes', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Select
        id="test-select"
        options={defaultOptions}
        value="option1"
        onChange={mockOnChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option3' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange.mock.calls[0][0].target.value).toBe('option3');
  });

  it('applies error styling when error prop is true', () => {
    render(
      <Select
        id="test-select"
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
        error={true}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-500');
  });

  it('handles disabled state', () => {
    render(
      <Select
        id="test-select"
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
        disabled
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('supports additional className prop', () => {
    render(
      <Select
        id="test-select"
        options={defaultOptions}
        value="option1"
        onChange={() => {}}
        className="test-class"
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('test-class');
  });
});