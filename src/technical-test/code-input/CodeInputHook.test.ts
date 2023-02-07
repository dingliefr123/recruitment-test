import { renderHook, act, waitFor } from "@testing-library/react";
import {
  useChildHook,
  useCodeInputHook,
  BACKSPACE_KEY,
  BACKSPACE_KEY_CODE
} from './CodeInput';
import React from 'react';
const CHILD_INPUT_NUMBER = 4;
jest.mock('react', () => {
  const originReact = jest.requireActual('react');
    return {
      ...originReact,
      useRef: jest.fn()
    };
});

describe('testing useChildHook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  test('it should function properly, an Ref should be returned' +
      'and the internal useEffect hook should call the focus function of the refered element',
  () => {
    let index = 0, activeIdx = 0;
    const mockFocus = jest.fn();
    (React.useRef as jest.Mock).mockReturnValue({ current: { focus: mockFocus } });
    const { result } = renderHook(
      () => useChildHook({ index, activeIdx }));
    expect(result.current.inputRef).toBeDefined();
    expect(mockFocus).toBeCalled();
  });

  test('after updating activeIdx from 0 to 1,' +
    'the internal useEffect hook should not recall the focus function',
  () => {
    let index = 0, activeIdx = 0;
    const mockFocus = jest.fn();
    (React.useRef as jest.Mock).mockReturnValue({ current: { focus: mockFocus } });
    const { rerender } = renderHook(
      () => useChildHook({ index, activeIdx }));
    expect(mockFocus).toHaveBeenCalledTimes(1);
    activeIdx = 1;
    rerender({ index, activeIdx });
    expect(mockFocus).toHaveBeenCalledTimes(1);
  });
});

describe('testing the useCodeInputHook', () => {
  const ParrentProps = {
    length:4,
    onCodeFull: (code: string) => console.log({ code })
  };
  test('it should function properly, and it should return such things,' +
  'arr, the length of which should be 4 and all elements should be empty,' +
  'activeIdx, the initialvalue should be 0,' +
  'focusHandler, the callback function of focus event,' +
  'inputHandler, the callback function of input event' +
  'keydownHandler, the callback function of keydown event',
  () => {
    const { result: { current } } = renderHook(() => useCodeInputHook(ParrentProps));
    const {
      arr,
      activeIdx,
      focusHandler,
      inputHandler,
      keydownHandler
    } = current;
    expect(activeIdx).toBe(0);
    expect(arr).toHaveLength(CHILD_INPUT_NUMBER);
    for(const ele of arr)
      expect(ele).toEqual('');
    expect(focusHandler).toBeDefined();
    expect(inputHandler).toBeDefined();
    expect(keydownHandler).toBeDefined();
  });

  test('after typing the first letter by calling inputHandler,' +
  'the activeIdx should updated from 0 to 1 and arr[0], which should save the first input,' +
  'shpuld also be the value of input',
  async () => {
    const { result } = renderHook(() => useCodeInputHook(ParrentProps));
    const { inputHandler } = result.current;
    const input = '1';
    act(() =>
      inputHandler({ currentTarget: { value: input } } as React.FormEvent<HTMLInputElement>));
    expect(result.current.arr[0]).toBe(input);
    await waitFor(() => expect(result.current.activeIdx).toBe(1));
  });

  test('input and delete testing,' +
  "after consecutive 2 input operations, the activeIdx should be 2 and arr should be ['1', '2']," +
  "after consecutive 2 del operations, input arr should be ['1', '']",
  async () => {
    const { result } = renderHook(() => useCodeInputHook(ParrentProps));
    const { keydownHandler, inputHandler } = result.current;
    const firstInput = '1', secInput = '2';
    act(() =>
      inputHandler({ currentTarget: { value: firstInput } } as React.FormEvent<HTMLInputElement>));
    act(() =>
      inputHandler({ currentTarget: { value: secInput } } as React.FormEvent<HTMLInputElement>));
    await waitFor(() => expect(result.current.activeIdx).toBe(2));
    expect(result.current.arr).toEqual([firstInput, secInput, '', '']);
    const DelEvent =
      { key: BACKSPACE_KEY, keyCode: BACKSPACE_KEY_CODE } as React.KeyboardEvent<HTMLInputElement>;
    act(() => {
      keydownHandler(DelEvent);
      keydownHandler(DelEvent)
    });
    expect(result.current.arr).toEqual([firstInput, '', '', '']);
  });

  test("after inputing 4 times, the result should be logged like this '1234'",
  async () => {
    const logSpy = jest.spyOn(console, 'log');
    const { result } = renderHook(() => useCodeInputHook(ParrentProps));
    const { inputHandler } = result.current;
    const inputs = '1234';
    const inputEvent = {
      currentTarget: { value: '' }
    } as React.FormEvent<HTMLInputElement>;
    act(() => {
      for(const value of inputs) {
        inputEvent.currentTarget.value = value;
        inputHandler(inputEvent);
      }
    });
    await waitFor(expect(logSpy).toHaveBeenCalled);
  });
})