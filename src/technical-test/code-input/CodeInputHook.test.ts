import { renderHook, act, waitFor } from "@testing-library/react";
import {
  useCodeInputHook,
  BACKSPACE_KEY,
  BACKSPACE_KEY_CODE,
} from "./CodeInput";
import React from "react";
const CHILD_INPUT_NUMBER = 4;

describe("faire les tests de useCodeInputHook", () => {
  const ParrentProps = {
    length: 4,
    onCodeFull: (code: string) => console.log({ code }),
  };
  test(
    "il faut fonctioner correctement, et il faut renvoyer les choses au-dessous," +
      "arr, avec la taille de quartre," +
      "focusHandler, " +
      "inputHandler, " +
      "keydownHandler",
    () => {
      const {
        result: { current },
      } = renderHook(() => useCodeInputHook(ParrentProps));
      const { arr, focusHandler, inputHandler, keydownHandler } = current;
      expect(arr).toHaveLength(CHILD_INPUT_NUMBER);
      for (const ele of arr) expect(ele).toEqual("");
      expect(focusHandler).toBeDefined();
      expect(inputHandler).toBeDefined();
      expect(keydownHandler).toBeDefined();
    }
  );

  test(
    "après entrer la premiere caractère, " +
      "et arr[0] " +
      "doit avoir la valeur, equale à la caractère déjà",
    async () => {
      const { result } = renderHook(() => useCodeInputHook(ParrentProps));
      const { inputHandler } = result.current;
      const input = "1";
      act(() =>
        inputHandler({
          currentTarget: { value: input },
        } as React.FormEvent<HTMLInputElement>)
      );
      expect(result.current.arr[0]).toBe(input);
    }
  );

  test(
    "les tests sur l'entrée et suppression," +
      "après 2 fois des entrées et arr soit ['1', '2']," +
      "après 2 fois des suppression, arr soit ['', '']",
    async () => {
      const { result } = renderHook(() => useCodeInputHook(ParrentProps));
      const { keydownHandler, inputHandler } = result.current;
      const firstInput = "1",
        secInput = "2";
      act(() =>
        inputHandler({
          currentTarget: { value: firstInput },
        } as React.FormEvent<HTMLInputElement>)
      );
      act(() =>
        inputHandler({
          currentTarget: { value: secInput },
        } as React.FormEvent<HTMLInputElement>)
      );
      expect(result.current.arr).toEqual([firstInput, secInput, "", ""]);
      const DelEvent = {
        key: BACKSPACE_KEY,
        keyCode: BACKSPACE_KEY_CODE,
      } as React.KeyboardEvent<HTMLInputElement>;
      act(() => {
        keydownHandler(DelEvent);
        keydownHandler(DelEvent);
      });
      expect(result.current.arr).toEqual(["", "", "", ""]);
    }
  );

  test("aprè 4 fois d'entrées, le résultat soit '1234'", async () => {
    const logSpy = jest.spyOn(console, "log");
    const { result } = renderHook(() => useCodeInputHook(ParrentProps));
    const { inputHandler } = result.current;
    const inputs = "1234";
    const inputEvent = {
      currentTarget: { value: "" },
    } as React.FormEvent<HTMLInputElement>;
    act(() => {
      for (const value of inputs) {
        inputEvent.currentTarget.value = value;
        inputHandler(inputEvent);
      }
    });
    await waitFor(expect(logSpy).toHaveBeenCalled);
  });
});
