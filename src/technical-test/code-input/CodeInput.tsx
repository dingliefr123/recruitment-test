import React, { useState, useCallback, useRef, useEffect } from "react";
import Input from "../Input";

interface ICodeInputProps {
  length: number;
  onCodeFull: (code: string) => void;
}

export function useCodeInputHook({
  length: MAX_LENGTH,
  onCodeFull,
}: ICodeInputProps) {
  const MAX_VALID_INDEX = MAX_LENGTH - 1;
  const [arr, setArr] = useState<string[]>(new Array(MAX_LENGTH).fill(""));
  const [activeIdx, setActiveIdx] = useState(0);
  const inputElesRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusHandler = useCallback(
    (idx: number) => {
      setActiveIdx((activeIdx) => {
        if (activeIdx !== idx) inputElesRef.current[activeIdx]?.focus();
        return activeIdx;
      });
    },
    [setActiveIdx]
  );

  const inputHandler = useCallback(
    (ev: React.FormEvent<HTMLInputElement>) => {
      const input = ev.currentTarget.value;
      if (Number.isNaN(Number(input)))
        return alert("Entrez uniquement les nombres");
      if (input.length !== 1) return;
      setActiveIdx((curIdx) => {
        setArr((arr) => {
          arr[curIdx] = input;
          if (curIdx === MAX_VALID_INDEX) onCodeFull(arr.join(""));
          return [...arr];
        });
        return Math.min(curIdx + 1, MAX_VALID_INDEX);
      });
    },
    [setActiveIdx, setArr, MAX_VALID_INDEX, onCodeFull]
  );

  const keydownHandler = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      const isDelEv = checkIsDelOrbackspaceEv(ev);
      if (!isDelEv) return;
      setActiveIdx((curIdx) => {
        const prevIdx = Math.max(0, curIdx - 1);
        setArr((arr) => {
          const hasValueAtCurIdx = Boolean(arr[curIdx]);
          if (hasValueAtCurIdx) arr[curIdx] = "";
          else arr[prevIdx] = "";
          return [...arr];
        });
        if (curIdx === MAX_VALID_INDEX) {
          const val = inputElesRef.current[curIdx]?.value;
          if (val) return curIdx;
        }
        return prevIdx;
      });
    },
    [setArr, setActiveIdx, MAX_VALID_INDEX, inputElesRef]
  );

  useEffect(() => {
    inputElesRef.current[activeIdx]?.focus();
  }, [activeIdx, inputElesRef]);

  return {
    arr,
    activeIdx,
    focusHandler,
    inputHandler,
    keydownHandler,
    inputElesRef,
  };
}

const CodeInput: React.FC<ICodeInputProps> = (props) => {
  const {
    arr,
    focusHandler,
    inputHandler: onChange,
    keydownHandler: onKeyDown,
    inputElesRef,
  } = useCodeInputHook(props);
  return (
    <>
      {new Array(props.length).fill(0).map((_, index) => {
        const onFocus = () => focusHandler(index);
        return (
          <Input
            key={index}
            value={arr[index] || ""}
            onFocus={onFocus}
            onChange={onChange}
            onKeyDown={onKeyDown}
            ref={(ele) => (inputElesRef.current[index] = ele)}
            role="input"
          />
        );
      })}
    </>
  );
};

export default CodeInput;

/*==============utils=================*/
export const BACKSPACE_KEY_CODE = 13;
const DEL_KEY_CODE = 8;
export const BACKSPACE_KEY = "Backspace";
const DELETE_KEY = "Delete";
export function checkIsDelOrbackspaceEv(ev: React.KeyboardEvent) {
  if (!ev || (!ev.key && !ev.keyCode)) return false;
  const { key, keyCode } = ev;
  return (
    [BACKSPACE_KEY, DELETE_KEY].includes(key) ||
    [BACKSPACE_KEY_CODE, DEL_KEY_CODE].includes(keyCode)
  );
}
