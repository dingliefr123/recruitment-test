import { forwardRef, useMemo, HTMLProps } from "react";

interface InputProps extends HTMLProps<HTMLInputElement> {}

export default forwardRef<HTMLInputElement, InputProps>(function Input(props: InputProps, ref) {
  const className = useMemo(() => {
    const propsClassName = props.className ?? "";
    const filledClassName = Boolean(String(props.value ?? "").length)
      ? "filled"
      : "";
    return `box ${propsClassName} ${filledClassName}`;
  }, [props.value, props.className]);

  return <input {...props} className={className} ref={ref} />;
});
