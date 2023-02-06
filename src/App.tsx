import './App.css';
import CodeInput from './technical-test/code-input/CodeInput';

function App() {
  const handleCodeInputFilled = (code: string) => {
    console.log({code});
  }
  return (
    <div className="App">
      <CodeInput length={4} onCodeFull={handleCodeInputFilled}/>
    </div>
  );
}

export default App;
