import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Navbar from './components/layout/Navbar';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [pin, setPin] = useLocalStorage('pin', null);
  const [inputPin, setInputPin] = useState('');

  const handleKeypad = (angka) => {
    if (inputPin.length < 4) {
      setInputPin(inputPin + angka);
    }
  };

  const hapusSatu = () => {
    setInputPin(inputPin.slice(0, -1));
  };

  if (pin === null) {
    return (
      <div className="min-h-screen bg-gray-300 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg text-center p-6 w-full max-w-sm">
          <h1 className="text-xl font-bold mb-2">Buat PIN Keamanan</h1>
          <p className="text-sm text-gray-500 mb-6">Masukkan PIN 4 digit</p>

          {/* tampilan bulatab pin */}
          <div className="text-4xl tracking-[1em] font-bold mb-8 text-emerald-800">
            {inputPin
              .padEnd(4, '_')
              .replace(/./g, (c) => (c === '_' ? '_' : '.'))}
          </div>

          {/* wadah keypad */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypad(num.toString())}
                className="bg-white text-2xl font-bold py-4 rounded-full shadow-sm hover:bg-emerald-100 transition active:scale-95"
              >
                {num}
              </button>
            ))}
            <div></div>
            <button
              onClick={() => handleKeypad()}
              className="bg-white text-2xl font-bold py-4 rounded-full shadow-sm hover:bg-emerald-100 transition active:scale-95"
            >
              0
            </button>
            <button
              onClick={hapusSatu}
              className="bg-white text-rose-700 text-xl font-bold py-4 rounded-full shadow-sm hover:bg-rose-200 transition active:scale-95"
            >
              DEL
            </button>
          </div>
          {/* 
          <input
            type="password"
            maxLength={4}
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value)}
            className="w-full p-2 text-center text-xl tracking-[10px] border-gray-50 bg-white rounded-lg py-3 mb-6 focus:outline-none "
            placeholder="...."
          /> */}
          <button
            className="w-full bg-rose-500 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            onClick={() => {
              if (inputPin.length === 4) setPin(inputPin);
            }}
          >
            masuk
          </button>
        </div>
      </div>
    );
  }

  return (
    //ukuran mobile
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-100 bg-gray-50 min-h-screen relative shadow-2xl border-red-500 border-1">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              {' '}
            </Route>
            <Route path="/logs" element={<Logs />}></Route>
          </Routes>
          <Navbar />
        </Router>
      </div>
    </div>
  );
}

export default App;
