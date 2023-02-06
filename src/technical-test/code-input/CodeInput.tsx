import Input from '../Input';

interface CodeInputProps {
  length: number;
  onCodeFull: (code: string) => void;
}

export default function CodeInput({ length, onCodeFull }: CodeInputProps) {
  return <Input />;
}