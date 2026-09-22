import { useEffect, useState } from "react";
import { Lightbulb, RotateCcw, Zap } from "lucide-react";

type TankOption = {
  liters: number;
  voltage: number;
};

const TANK_OPTIONS: TankOption[] = [
  { liters: 1, voltage: 12 },
  { liters: 2, voltage: 24 },
  { liters: 3, voltage: 48 },
];

export default function VoltageCurrentSimulator() {
  const [tank, setTank] = useState<TankOption>(TANK_OPTIONS[0]);
  const [water, setWater] = useState(1);
  const [tapOpen, setTapOpen] = useState(0);

  const maxWater = tank.liters;

  /*
    Voltage available based on remaining water.
  */
  const availableVoltage =
    maxWater > 0
      ? (water / maxWater) * tank.voltage
      : 0;

  /*
    Current is controlled by tap opening.
    This is a visual learning model.
  */
  const current =
    availableVoltage > 0
      ? (tapOpen / 100) * 6
      : 0;

  /*
    Bulb brightness depends on current.
  */
  const brightness =
    current > 0
      ? 0.35 + (current / 6) * 0.65
      : 0.25;

  /*
    Tap opening controls how quickly water leaves the tank.
  */
  useEffect(() => {
    if (tapOpen <= 0 || water <= 0) return;

    const interval = setInterval(() => {
      setWater((previous) => {
        const drainRate =
          (tapOpen / 100) *
          maxWater *
          0.012;

        return Math.max(
          0,
          previous - drainRate
        );
      });
    }, 100);

    return () => clearInterval(interval);
  }, [tapOpen, maxWater, water]);

  /*
    Automatically close tap when tank becomes empty.
  */
  useEffect(() => {
    if (water <= 0) {
      setTapOpen(0);
    }
  }, [water]);

  const selectTank = (option: TankOption) => {
    setTank(option);
    setWater(option.liters);
    setTapOpen(0);
  };

  const resetSimulator = () => {
    setWater(tank.liters);
    setTapOpen(0);
  };

  const waterPercentage =
    (water / maxWater) * 100;

  const flowSpeed =
    tapOpen > 0
      ? Math.max(
          0.18,
          1.5 - (tapOpen / 100) * 1.25
        )
      : 0;

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-lg">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex items-center justify-between bg-slate-900 px-5 py-3">

        <div>
          <h3 className="text-base font-extrabold text-white">
            Voltage & Current Simulator
          </h3>

          <p className="text-[10px] text-slate-300">
            Tank capacity → Voltage → Tap flow → Current
          </p>
        </div>

        <button
          onClick={resetSimulator}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
        >
          <RotateCcw size={13} />
          Reset
        </button>

      </div>


      {/* =========================================
          MAIN
      ========================================= */}

      <div className="flex h-[calc(100%-58px)] flex-col gap-3 bg-slate-50 p-4">

        {/* =========================================
            TANK CAPACITY
        ========================================= */}

        <div className="flex shrink-0 items-center justify-between rounded-xl border border-blue-200 bg-white px-4 py-2.5">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Tank Capacity
            </p>

            <p className="text-sm font-extrabold text-slate-800">
              {tank.liters} L
              <span className="mx-2 text-slate-300">
                =
              </span>
              {tank.voltage} V
            </p>
          </div>


          <div className="flex gap-2">

            {TANK_OPTIONS.map((option) => (
              <button
                key={option.liters}
                onClick={() => selectTank(option)}
                className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition ${
                  tank.liters === option.liters
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option.liters} L
                <span className="ml-1 opacity-70">
                  {option.voltage}V
                </span>
              </button>
            ))}

          </div>

        </div>


        {/* =========================================
            CIRCUIT AREA
        ========================================= */}

        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-200 bg-white">

          {/* POWER FLOW LABEL */}

          <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Power Pass Flow
          </div>


          <div className="flex w-full items-center justify-center px-5">


            {/* =====================================
                WATER TANK
            ===================================== */}

            <div className="flex w-[90px] shrink-0 flex-col items-center">

              <div className="relative flex h-[115px] w-[70px] items-end justify-center overflow-hidden rounded-b-2xl border-4 border-slate-400 bg-slate-100">

                {/* WATER */}

                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-300"
                  style={{
                    height: `${waterPercentage}%`,
                  }}
                >

                  {/* WATER WAVES */}

                  <div className="absolute -top-1 left-0 h-2 w-full rounded-full bg-blue-300" />

                </div>


                {/* TANK EMOJI */}

                <div className="relative z-10 mb-2 text-3xl">
                  🛢️
                </div>

              </div>


              <p className="mt-2 text-[10px] font-extrabold text-slate-700">
                Water Tank
              </p>

              <p className="text-[9px] font-bold text-blue-500">
                {water.toFixed(2)} L
              </p>

            </div>


            {/* =====================================
                FIRST FLOW
            ===================================== */}

            <div className="relative mx-2 h-2 flex-1 overflow-hidden rounded-full bg-slate-300">

              {tapOpen > 0 && water > 0 && (
                <>
                  <div
                    className="tank-power-flow"
                    style={{
                      animationDuration: `${flowSpeed}s`,
                    }}
                  />

                  <div
                    className="tank-power-dot"
                    style={{
                      animationDuration: `${flowSpeed}s`,
                    }}
                  />
                </>
              )}

            </div>


            {/* =====================================
                TAP
            ===================================== */}

            <div className="flex w-[75px] shrink-0 flex-col items-center">

              <div
                className={`flex h-[62px] w-[62px] items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                  tapOpen > 0
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-300 bg-slate-50"
                }`}
              >

                <span
                  className="text-4xl transition-transform duration-300"
                  style={{
                    transform: `rotate(${
                      -45 + (tapOpen / 100) * 90
                    }deg)`,
                  }}
                >
                  🚰
                </span>

              </div>

              <p className="mt-2 text-[10px] font-extrabold text-slate-700">
                Tap
              </p>

              <p className="text-[10px] font-extrabold text-blue-600">
                {tapOpen}%
              </p>

            </div>


            {/* =====================================
                SECOND FLOW
            ===================================== */}

            <div className="relative mx-2 h-2 flex-1 overflow-hidden rounded-full bg-slate-300">

              {tapOpen > 0 && water > 0 && (
                <>
                  <div
                    className="tank-power-flow"
                    style={{
                      animationDuration: `${flowSpeed}s`,
                    }}
                  />

                  <div
                    className="tank-power-dot"
                    style={{
                      animationDuration: `${flowSpeed}s`,
                    }}
                  />
                </>
              )}

            </div>


            {/* =====================================
                BULB
            ===================================== */}

            <div className="flex w-[80px] shrink-0 flex-col items-center">

              <div
                className={`flex h-[70px] w-[70px] items-center justify-center rounded-xl border-2 transition-all duration-500 ${
                  current > 0
                    ? "border-yellow-400 bg-yellow-100"
                    : "border-slate-300 bg-slate-50"
                }`}
                style={{
                  boxShadow:
                    current > 0
                      ? `0 0 ${
                          8 + current * 8
                        }px rgba(250,204,21,${brightness})`
                      : "none",
                }}
              >

                <Lightbulb
                  size={42}
                  strokeWidth={2}
                  style={{
                    opacity: brightness,
                  }}
                  className={
                    current > 0
                      ? "text-yellow-500"
                      : "text-slate-400"
                  }
                />

              </div>

              <p className="mt-2 text-[10px] font-extrabold text-slate-700">
                Bulb
              </p>

              <p className="text-[9px] font-bold text-yellow-500">
                {current > 0
                  ? "Working"
                  : "OFF"}
              </p>

            </div>

          </div>


          {/* =====================================
              LIVE VALUES
          ===================================== */}

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">

            <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-center">

              <p className="text-[8px] font-bold text-blue-400">
                VOLTAGE
              </p>

              <p className="text-sm font-extrabold text-blue-600">
                {availableVoltage.toFixed(1)} V
              </p>

            </div>


            <div className="rounded-lg bg-green-50 px-3 py-1.5 text-center">

              <p className="text-[8px] font-bold text-green-500">
                CURRENT
              </p>

              <p className="text-sm font-extrabold text-green-600">
                {current.toFixed(2)} A
              </p>

            </div>

          </div>

        </div>


        {/* =========================================
            TAP CONTROL
        ========================================= */}

        <div className="shrink-0 rounded-xl border-2 border-slate-200 bg-white px-4 py-3">

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="text-lg">
                🚰
              </span>

              <span className="text-xs font-extrabold text-slate-700">
                Open Tap
              </span>

            </div>

            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-extrabold text-blue-600">
              {tapOpen}%
            </span>

          </div>


          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={tapOpen}
            onChange={(e) =>
              setTapOpen(Number(e.target.value))
            }
            className="tank-slider w-full"
          />


          <div className="mt-1 flex justify-between text-[8px] font-bold text-slate-400">

            <span>CLOSED</span>

            <span>LOW FLOW</span>

            <span>MEDIUM</span>

            <span>FULL OPEN</span>

          </div>

        </div>


        {/* =========================================
            EXPLANATION
        ========================================= */}

        <div className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2">

          <span className="text-[10px] font-bold text-blue-300">
            Water Level ↓
          </span>

          <span className="text-slate-500">
            →
          </span>

          <Zap
            size={12}
            className="text-yellow-400"
          />

          <span className="text-[10px] font-bold text-yellow-300">
            Flow ↑
          </span>

          <span className="text-slate-500">
            →
          </span>

          <span className="text-[10px] font-bold text-green-400">
            Current ↑
          </span>

          <span className="text-slate-500">
            →
          </span>

          <span className="text-[10px] font-bold text-yellow-300">
            Brightness ↑
          </span>

        </div>

      </div>

    </div>
  );
}