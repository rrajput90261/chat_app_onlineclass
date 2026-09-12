import { useState } from "react";

export default function App() {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [res, setRes] = useState("Result");

  const checkInput = () => {
    if (value === "") {
      setRes("Enter a number");
      return false;
    }
    return true;
  };

  const allBtn = [
    {
      name: "Positive / Negative", function: () => {if (!checkInput()) return;const num = Number(value);if (num > 0) { setRes("Positive");} else if (num < 0) {setRes("Negative");} else {setRes("Zero"); }},css: "bg-orange-600 hover:bg-orange-700",},

    {
      name: "Even / Odd",
      function: () => {
        if (!checkInput()) return;

        const num = Number(value);

        setRes(num % 2 === 0 ? "Even" : "Odd");
      },
      css: "bg-gray-600 hover:bg-gray-700",
    },

    {
      name: "Leap Year",
      function: () => {
        if (!checkInput()) return;

        const year = Number(value);

        if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
          setRes("Leap Year");
        } else {
          setRes("Not a Leap Year");
        }
      },
      css: "bg-blue-500 hover:bg-blue-600",
    },

    {
      name: "Binary or Not",
      function: () => {
        if (!checkInput()) return;

        const num = String(value);

        if (/^[01]+$/.test(num)) {
          setRes("Binary Number");
        } else {
          setRes("Not Binary");
        }
      },
      css: "bg-red-600 hover:bg-red-700",
    },

    {
      name: "Compare A & B",
      function: () => {
        if (value === "" || value2 === "") {
          setRes("Enter both numbers");
          return;
        }

        const a = Number(value);
        const b = Number(value2);

        if (a > b) {
          setRes("A is Greater");
        } else if (a < b) {
          setRes("B is Greater");
        } else {
          setRes("A & B are Equal");
        }
      },
      css: "bg-green-600 hover:bg-green-700",
    },
  ];

  const reset = () => {
    setValue("");
    setValue2("");
    setRes("Result");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-5">

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 md:p-10">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Number Checker
          </h1>

          <p className="text-gray-500 mt-2">
            Enter numbers and choose an operation
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number A
            </label>

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="number"
              placeholder="Enter number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number B
            </label>

            <input
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              type="number"
              placeholder="Enter second number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {allBtn.map((button, index) => (
            <button
              key={index}
              onClick={button.function}
              className={`${button.css} text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all duration-200`}
            >
              {button.name}
            </button>
          ))}

        </div>

        {/* Result */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6 text-center">

          <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
            Result
          </p>

          <p className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            {res}
          </p>

        </div>

        {/* Reset */}
        <button
          onClick={reset}
          className="w-full mt-5 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition"
        >
          Reset
        </button>

      </div>
    </div>
  );
}
