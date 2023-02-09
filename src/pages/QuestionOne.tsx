import { useState } from "react";
import Navbar from "../components/Navbar";

const TEST_CASES = ["RLRRLLRLRRLL", "RLLRRRRLLRLL"];

export default function QuestionOne() {
  const [testCase, setTestCase] = useState(TEST_CASES[0]);
  const [result, setResult] = useState<string[]>([]);

  const handleTestCaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTestCase(e.target.value);
    setResult([]);
  };

  const handleSubmit = () => {
    let count = 0;
    let result = 0;
    let intervals = [];
    let start = 0;

    for (let i = 0; i < testCase.length; i++) {
      if (testCase[i] === "L") count--;
      else count++;

      if (count === 0) {
        result++;
        intervals.push(testCase.slice(start, i + 1));
        start = i + 1;
      }
    }

    setResult(intervals);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-10 text-xl">
        <div className="flex items-center">
          <label className="pr-2">Select Test Case:</label>
          <select
            name="test-case"
            id="test-case"
            value={testCase}
            onChange={handleTestCaseChange}
          >
            {TEST_CASES.map((testCase, idx) => (
              <option key={idx} value={testCase}>
                {testCase}
              </option>
            ))}
          </select>
          <button
            className="bg-green-500 px-4 py-2 rounded-md text-white mt-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      {result.length > 0 && (
        <div className="flex flex-col justify-center items-center mt-4">
          <div className="font-bold text-lg">Result: {result.length}</div>
          <div className="text-lg">
            {result.map((interval: string, idx: number) => {
              return (
                <>
                  <div key={idx}>
                    Interval #{idx + 1}: {interval}
                  </div>
                </>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
