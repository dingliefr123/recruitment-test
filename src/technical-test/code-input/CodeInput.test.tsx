import { render, screen } from "@testing-library/react";
import CodeInput, { Child } from "./CodeInput";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
const CHILD_INPUT_NUMBER = 4;

const handleCodeInputFilled = (code: string) => {
  console.log({code});
}

const mockFn = jest.fn(handleCodeInputFilled);

describe('testing CodeInput', () => {
  test("rendering 4 child elements properly", () => {
    render(<CodeInput length={4} onCodeFull={handleCodeInputFilled} />);
    const children = screen.queryAllByRole("input");
    expect(children.length).toBe(CHILD_INPUT_NUMBER);
  });
  
  test("after inputint in the 1st element, it should have valid value and the sibiling should be focused", () => {
    render(<CodeInput length={4} onCodeFull={handleCodeInputFilled} />);
    const inputEles = screen.queryAllByRole("input");
    expect(inputEles.length).toBeGreaterThanOrEqual(2);
    const [ curInput, nextInput ] = inputEles;
    expect(curInput).toBeInTheDocument();
    expect(nextInput).toBeInTheDocument();
    const input = '1';
    userEvent.type(curInput, input);
    expect(curInput).toHaveValue(input);
    expect(nextInput).toHaveFocus();
  });
  
  test("after inputint in the 1st element, when the sibling input elemnt should be focused," + 
    "if this time input the backspace, the previous element should be focused", 
  () => {
    render(<CodeInput length={4} onCodeFull={handleCodeInputFilled} />);
    const inputEles = screen.queryAllByRole("input");
    expect(inputEles.length).toBeGreaterThanOrEqual(2);
    const [ firstInput, secInput ] = inputEles;
    expect(firstInput).toBeInTheDocument();
    expect(secInput).toBeInTheDocument();
    const input = '1';
    userEvent.type(firstInput, input);
    expect(firstInput).toHaveValue(input);
    expect(secInput).toHaveFocus();
    userEvent.type(secInput, '{backspace}');
    expect(firstInput).toHaveFocus();
  });
  
  test("after 4 continuing valid input, the right result should be logged", () => {
    render(<CodeInput length={4} onCodeFull={mockFn} />);
    const inputEles = screen.queryAllByRole("input");
    expect(inputEles.length).toBeGreaterThanOrEqual(CHILD_INPUT_NUMBER);
    const input = '1234';
    inputEles.forEach((inputEle, idx) => {
      expect(inputEle).toBeInTheDocument();
      userEvent.type(inputEle, input[idx]);
      expect(inputEle).toHaveValue(input[idx]);
    });
    expect(mockFn).toHaveBeenCalledWith(input);
  });
})

describe('testig child component', () => {
  test("rendering the child component properly", () => {
    const mockFn = jest.fn();
    render(
      <Child
        index={0}
        activeIdx={0}
        value=""
        onFocus={mockFn}
        onChange={mockFn}
        onKeyDown={mockFn}
      />
    );
    const inputEle = screen.getByRole("input");
    expect(inputEle).toBeInTheDocument();
  });
  
  test("after clicking the input, it should be focused and the foucsHandler callback should be called", () => {
    const mockFn = jest.fn();
    render(
      <Child
        index={0}
        activeIdx={0}
        value=""
        onFocus={mockFn}
        onChange={mockFn}
        onKeyDown={mockFn}
      />
    );
    const inputEle = screen.getByRole("input");
    expect(inputEle).toBeInTheDocument();
    userEvent.click(inputEle);
    expect(inputEle).toHaveFocus()
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  
  test("testing input event and input handler," +
       "after input, the inner text of input element should be updated," +
       "the inputHandler should be called and return the right input",
  async () => {
    const focusmockFn = jest.fn(),
      inputMockFn = jest.fn(ev => ev),
      keydownMockFn = jest.fn();
    render(
      <Child
        index={0}
        activeIdx={0}
        value=""
        onFocus={focusmockFn}
        onChange={inputMockFn}
        onKeyDown={keydownMockFn}
      />
    );
    const inputEle = screen.getByRole("input");
    expect(inputEle).toBeInTheDocument();
    const value = '1';
    userEvent.type(inputEle, value);
    expect(inputMockFn).toHaveBeenCalledTimes(1);
    expect(inputMockFn).toHaveReturned();
  });
})
