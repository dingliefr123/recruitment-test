import { render, screen } from "@testing-library/react";
import CodeInput, { Child } from "./CodeInput";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
const CHILD_INPUT_NUMBER = 4;

const handleCodeInputFilled = (code: string) => {
  console.log({code});
}

const mockFn = jest.fn(handleCodeInputFilled);

describe('les tests de CodeInput', () => {
  test("le rendu des 4 élements d'enfants soit correct", () => {
    render(<CodeInput length={4} onCodeFull={handleCodeInputFilled} />);
    const children = screen.queryAllByRole("input");
    expect(children.length).toBe(CHILD_INPUT_NUMBER);
  });
  
  test("après l'entrée de 1er élement, la 2ième élement doit être focused", () => {
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
  
  test("dans 2ième élement et pas encore entrée, après reculer, la 1er élement doit être focused", 
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
  
  test("après 4 fois des entrées, il faut imprimer ces 4 caractères dans le console", () => {
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

describe('les tests de child component', () => {
  test("le rendu de composant soit correct", () => {
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
  
  test("après cliquer l'élement, il doit être focused et le callback 'foucsHandler' doit être appelé", () => {
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
  
  test("les tests de inputHandler quand il fault règler les évenements," +
       "après l'entrée, sa valeur ou le texte dedans doit changer," +
       "il faut appeler le 'inputHandler' et renvoyer la caractère correctement",
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
