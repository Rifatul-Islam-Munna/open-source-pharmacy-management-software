"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calculator as CalcIcon } from "lucide-react";

export function QuickCalculator() {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState(""); // Shows calculation
  const [prev, setPrev] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const inputNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setNewNumber(false);
    }
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
    setPrev(null);
    setOperation(null);
    setNewNumber(true);
  };

  const performOperation = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (prev === null) {
      setPrev(inputValue);
      setExpression(`${inputValue} ${nextOp}`);
    } else if (operation) {
      const currentValue = prev || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPrev(newValue);
      setExpression(`${newValue} ${nextOp}`);
    }

    setNewNumber(true);
    setOperation(nextOp);
  };

  const calculate = (first: number, second: number, op: string): number => {
    switch (op) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "×":
        return first * second;
      case "÷":
        return first / second;
      case "%":
        return (first * second) / 100;
      default:
        return second;
    }
  };

  const equals = () => {
    const inputValue = parseFloat(display);
    if (prev !== null && operation) {
      const result = calculate(prev, inputValue, operation);
      setExpression(`${prev} ${operation} ${inputValue} =`);
      setDisplay(String(result));
      setPrev(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const buttonClass = "h-12 text-lg font-semibold";

  return (
    <>
      {/* Floating Button - LEFT SIDE */}
      <Button
        onClick={() => setOpen(true)}
        className="  h-12 w-12 rounded-full bg-primary-blue hover:bg-dark-blue shadow-lg"
        size="icon"
        title="Quick Calculator"
      >
        <CalcIcon className="h-10 w-10" />
      </Button>

      {/* Calculator Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[340px]">
          <DialogHeader>
            <DialogTitle>Quick Calculator</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Display with Expression */}
            <div className="bg-slate-100 p-4 rounded-lg border-2 border-slate-300">
              {/* Expression (what you're calculating) */}
              <div className="text-right text-sm font-mono text-slate-500 h-6 mb-1">
                {expression || "\u00A0"}
              </div>
              {/* Result */}
              <div className="text-right text-3xl font-mono font-bold text-slate-800 break-all">
                {display}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={clear}
                variant="destructive"
                className={`${buttonClass} col-span-2`}
              >
                C
              </Button>
              <Button
                onClick={() => performOperation("%")}
                variant="secondary"
                className={buttonClass}
              >
                %
              </Button>
              <Button
                onClick={() => performOperation("÷")}
                variant="secondary"
                className={buttonClass}
              >
                ÷
              </Button>

              <Button
                onClick={() => inputNumber("7")}
                variant="outline"
                className={buttonClass}
              >
                7
              </Button>
              <Button
                onClick={() => inputNumber("8")}
                variant="outline"
                className={buttonClass}
              >
                8
              </Button>
              <Button
                onClick={() => inputNumber("9")}
                variant="outline"
                className={buttonClass}
              >
                9
              </Button>
              <Button
                onClick={() => performOperation("×")}
                variant="secondary"
                className={buttonClass}
              >
                ×
              </Button>

              <Button
                onClick={() => inputNumber("4")}
                variant="outline"
                className={buttonClass}
              >
                4
              </Button>
              <Button
                onClick={() => inputNumber("5")}
                variant="outline"
                className={buttonClass}
              >
                5
              </Button>
              <Button
                onClick={() => inputNumber("6")}
                variant="outline"
                className={buttonClass}
              >
                6
              </Button>
              <Button
                onClick={() => performOperation("-")}
                variant="secondary"
                className={buttonClass}
              >
                -
              </Button>

              <Button
                onClick={() => inputNumber("1")}
                variant="outline"
                className={buttonClass}
              >
                1
              </Button>
              <Button
                onClick={() => inputNumber("2")}
                variant="outline"
                className={buttonClass}
              >
                2
              </Button>
              <Button
                onClick={() => inputNumber("3")}
                variant="outline"
                className={buttonClass}
              >
                3
              </Button>
              <Button
                onClick={() => performOperation("+")}
                variant="secondary"
                className={buttonClass}
              >
                +
              </Button>

              <Button
                onClick={() => inputNumber("0")}
                variant="outline"
                className={`${buttonClass} col-span-2`}
              >
                0
              </Button>
              <Button
                onClick={inputDecimal}
                variant="outline"
                className={buttonClass}
              >
                .
              </Button>
              <Button
                onClick={equals}
                className={`${buttonClass} bg-primary-blue hover:bg-dark-blue`}
              >
                =
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
