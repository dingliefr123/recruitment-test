import React, { useState, useCallback, useRef, useEffect } from 'react';
import Input from '../Input';

interface ICodeInputProps {
  length: number;
  onCodeFull: (code: string) => void;
}

/*====================Child=========================*/

type IChildProps = {
  index: number
  activeIdx: number
  value: string
  onFocus: React.FocusEventHandler<HTMLInputElement>
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
};

export function useChildHook({ index, activeIdx }: Pick<IChildProps, "index" | "activeIdx">) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (activeIdx !== index) return;
    inputRef.current?.focus();
  });
  return { inputRef }
}

export const Child: React.FC<IChildProps> = (props) => {
  const { inputRef } = useChildHook(props);
  const { activeIdx, ..._props } = props;
  return <Input { ..._props } ref={inputRef} role="input" />;
}

/*================================CodeInput==========================*/

export function useCodeInputHook({ length: MAX_LENGTH, onCodeFull }: ICodeInputProps) {
  const MAX_VALID_INDEX = MAX_LENGTH - 1;
  const [arr, setArr] = useState<string[]>(['', '', '', '']);
  const [activeIdx, setActiveIdx] = useState(0);

  const focusHandler = useCallback(
    (ev: React.FormEvent<HTMLInputElement>) => {
      const idx = getIdxFromInputEleEv(ev);
      if (idx < 0) return;
      const forceRefresh = () => setArr((arr) => [...arr]);
      setActiveIdx((activeIdx) => {
        if (activeIdx !== idx) forceRefresh();
        return activeIdx;
      });
    },
    [setActiveIdx, setArr]
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
          if (curIdx === MAX_VALID_INDEX)
            onCodeFull(arr.join(""));
          return [...arr];
        });
        return Math.min(curIdx + 1, MAX_VALID_INDEX);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setActiveIdx, setArr]
  );

  const keydownHandler = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      const isDelEv = checkIsDelOrbackspaceEv(ev);
      if (!isDelEv) return;
      setActiveIdx((curIdx) => {
        let hasValueAtCurIdx = false;
        setArr((arr) => {
          hasValueAtCurIdx = Boolean(arr[curIdx]);
          arr[curIdx] = "";
          return [...arr];
        });
        if (hasValueAtCurIdx)
          return curIdx;
        return Math.max(0, curIdx - 1);
      });
    },
    [setArr, setActiveIdx]
  );

  return {
    arr,
    activeIdx,
    focusHandler,
    inputHandler,
    keydownHandler
  };
}

const CodeInput: React.FC<ICodeInputProps> = (props) => {
  const {
    arr,
    activeIdx,
    focusHandler,
    inputHandler,
    keydownHandler
  } = useCodeInputHook(props);
  return <>{
    new Array(props.length).fill(0).map((_, index) =>
      <Child
        key={index}
        index={index}
        value={arr[index]}
        activeIdx={activeIdx}
        onFocus={focusHandler}
        onChange={inputHandler}
        onKeyDown={keydownHandler}
      />
    )
  }</>;
}

export default CodeInput

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

function getParentEle(node: HTMLElement) {
  return node?.parentElement || node?.parentNode;
}

function findDomIdxOfParent(node: any) {
  if (!node) return -1;
  const parentEle = getParentEle(node),
    children = parentEle?.children || parentEle?.childNodes;
  if (!children) return -1;
  for (const idx in children) {
    if (node === children[idx]) return Number(idx);
  }
  return -1;
}

type InputElementType =
  | React.FormEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLInputElement>;

function getIdxFromInputEleEv<T extends InputElementType>(ev: T) {
  const inputEle = ev.currentTarget;
  return findDomIdxOfParent(inputEle);
}