import { useState } from "react";
import {
  Lightbulb,
  CircleCheck,
  Brain,
  Sparkles,
} from "lucide-react";


/* =====================================================
   ANIMATED CHARACTER
===================================================== */

function AnimatedCharacter({ happy }: { happy: boolean }) {
  return (
    <div
      className={`character-wrap ${
        happy ? "character-happy" : "character-thinking"
      }`}
    >
      {/* HEAD */}
      <div className="character-head">

        <div className="character-hair" />

        {/* EYES */}
        <div className="character-eyes">
          <span className="character-eye" />
          <span className="character-eye" />
        </div>

        {/* MOUTH */}
        <div
          className={`character-mouth ${
            happy ? "mouth-happy" : "mouth-thinking"
          }`}
        />

        {/* THINKING DOTS */}
        {!happy && (
          <div className="thinking-dots">
            <span />
            <span />
            <span />
          </div>
        )}

      </div>

      {/* BODY */}
      <div className="character-body">
        <div className="character-collar" />
      </div>

      {/* ARMS */}
      {happy ? (
        <>
          <div className="character-arm character-arm-left-happy" />
          <div className="character-arm character-arm-right-happy" />
        </>
      ) : (
        <div className="character-hand-thinking">
          <div className="character-hand" />
        </div>
      )}

    </div>
  );
}


/* =====================================================
   CIRCUIT SIMULATOR
===================================================== */

function CircuitSimulator() {

  const [connected, setConnected] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);

  const circuitOn = connected && switchOn;


  /* =================================================
     BATTERY
  ================================================= */

  const handleBattery = () => {

    if (!connected) {

      setConnected(true);

    } else {

      setConnected(false);
      setSwitchOn(false);

    }

  };


  /* =================================================
     SWITCH
  ================================================= */

  const handleSwitch = () => {

    if (!connected) {
      return;
    }

    setSwitchOn((previous) => !previous);

  };


  /* =================================================
     RESET
  ================================================= */

  const resetCircuit = () => {

    setConnected(false);
    setSwitchOn(false);

  };


  return (

    <div className="h-full w-full overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-lg flex flex-col">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex shrink-0 items-center justify-between bg-slate-900 px-4 py-2.5">

        <div>

          <h3 className="text-base font-bold text-white">
            Interactive Circuit
          </h3>

          <p className="text-[10px] text-slate-300">
            Connect the battery and turn ON the switch.
          </p>

        </div>


        {/* STATUS */}

        <div
          className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${
            circuitOn
              ? "bg-green-500 text-white"
              : "bg-slate-700 text-slate-300"
          }`}
        >
          {circuitOn ? "POWER ON" : "POWER OFF"}
        </div>

      </div>



      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div className="flex min-h-0 flex-1 flex-col bg-slate-50 p-3">


        {/* =================================================
            CIRCUIT FRAME
        ================================================= */}

        <div
          className={`relative min-h-0 flex-1 overflow-hidden rounded-xl border-2 bg-white transition-all duration-500 ${
            circuitOn
              ? "border-green-300 shadow-[0_0_25px_rgba(34,197,94,0.15)]"
              : "border-slate-200"
          }`}
        >


          {/* CIRCUIT LABEL */}

          <div className="absolute left-0 right-0 top-2 text-center">

            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Electrical Circuit
            </span>

          </div>



          {/* STATUS BOX */}

          <div className="absolute right-2 top-2 z-20">

            <div
              className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[9px] font-bold ${
                circuitOn
                  ? "border-green-200 bg-green-50 text-green-600"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >

              {circuitOn ? (
                <>
                  <CircleCheck size={11} />
                  ON
                </>
              ) : (
                "○ OFF"
              )}

            </div>

          </div>



          {/* =================================================
              COMPONENTS
              Battery → Power Flow → Switch → Power Flow → LED
          ================================================= */}

          <div className="absolute inset-0 flex items-center justify-center px-4">

            <div className="flex w-full max-w-[440px] items-center justify-center">


              {/* ================= BATTERY ================= */}

              <div className="component-float flex w-[78px] shrink-0 flex-col items-center">

                <button
                  onClick={handleBattery}
                  className={`flex h-[62px] w-[62px] items-center justify-center rounded-xl border-2 bg-white transition-all duration-300 ${
                    connected
                      ? "border-green-400 shadow-[0_0_18px_rgba(34,197,94,0.35)]"
                      : "border-slate-300 shadow-sm hover:border-green-300"
                  }`}
                >

                  <span className="text-[36px] leading-none">
                    🔋
                  </span>

                </button>


                <span className="mt-1.5 text-[10px] font-bold text-slate-700">
                  Battery
                </span>

              </div>



              {/* ================= POWER FLOW 1 ================= */}

              <div className="relative mx-2 h-[6px] w-[62px] shrink-0 overflow-hidden rounded-full bg-slate-300">

                {circuitOn && (
                  <>
                    <div className="power-flow" />
                    <div className="power-dot" />
                  </>
                )}

              </div>



              {/* ================= SWITCH ================= */}

              <div className="component-float component-float-delay flex w-[78px] shrink-0 flex-col items-center">

                <button
                  onClick={handleSwitch}
                  className={`flex h-[62px] w-[62px] items-center justify-center rounded-xl border-2 bg-white transition-all duration-300 ${
                    switchOn
                      ? "border-green-400 shadow-[0_0_18px_rgba(34,197,94,0.35)]"
                      : "border-slate-300 shadow-sm hover:border-blue-300"
                  }`}
                >

                  <span className="text-[34px] leading-none">
                    🔘
                  </span>

                </button>


                <span className="mt-1.5 text-[10px] font-bold text-slate-700">
                  Switch
                </span>

              </div>



              {/* ================= POWER FLOW 2 ================= */}

              <div className="relative mx-2 h-[6px] w-[62px] shrink-0 overflow-hidden rounded-full bg-slate-300">

                {circuitOn && (
                  <>
                    <div className="power-flow" />
                    <div className="power-dot" />
                  </>
                )}

              </div>



              {/* ================= LED ================= */}

              <div className="component-float component-float-delay-2 flex w-[78px] shrink-0 flex-col items-center">

                <div
                  className={`flex h-[62px] w-[62px] items-center justify-center rounded-xl border-2 bg-white transition-all duration-500 ${
                    circuitOn
                      ? "border-yellow-400 bg-yellow-100 shadow-[0_0_30px_rgba(250,204,21,0.85)]"
                      : "border-slate-300"
                  }`}
                >

                  <Lightbulb
                    size={35}
                    strokeWidth={2}
                    className={`transition-all duration-500 ${
                      circuitOn
                        ? "text-yellow-500 animate-pulse"
                        : "text-slate-400"
                    }`}
                  />

                </div>


                <span className="mt-1.5 text-[10px] font-bold text-slate-700">
                  LED
                </span>

              </div>

            </div>

          </div>



          {/* =================================================
              CHARACTER + DIALOG
          ================================================= */}

          <div className="absolute bottom-3 left-0 right-0 flex justify-center px-3">

            <div
              className={`relative flex w-[360px] min-h-[92px] items-center gap-4 rounded-2xl border-2 px-5 py-3 shadow-lg transition-all duration-500 ${
                circuitOn
                  ? "border-green-300 bg-green-50 shadow-[0_0_25px_rgba(34,197,94,0.2)]"
                  : "border-slate-200 bg-slate-50"
              }`}
            >

              {/* SPEECH BUBBLE TAIL */}

              <div
                className={`absolute -bottom-2 left-[48px] h-4 w-4 rotate-45 border-r-2 border-b-2 ${
                  circuitOn
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              />


              {/* CHARACTER */}

              <div className="relative z-10 flex h-[68px] w-[68px] shrink-0 items-center justify-center">

                <AnimatedCharacter happy={circuitOn} />

              </div>


              {/* DIALOG */}

              <div className="relative z-10 flex-1">

                {circuitOn ? (

                  <>
                    <div className="mb-1 flex items-center gap-1.5">

                      <CircleCheck
                        size={18}
                        className="text-green-600"
                      />

                      <p className="text-base font-extrabold text-green-700">
                        It works!
                      </p>

                      <Sparkles
                        size={17}
                        className="joy-icon text-yellow-500"
                      />

                    </div>

                    <p className="text-[11px] font-medium leading-relaxed text-slate-600">
                      Great! Electrical energy is reaching the LED.
                    </p>

                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-green-600">
                      ⚡ Circuit complete
                    </div>
                  </>

                ) : (

                  <>
                    <div className="mb-1 flex items-center gap-1.5">

                      <Brain
                        size={18}
                        className="text-blue-500"
                      />

                      <p className="text-base font-extrabold text-slate-800">
                        Will the LED light up?
                      </p>

                    </div>

                    <p className="text-[11px] font-medium leading-relaxed text-slate-500">
                      Connect the battery and turn ON the switch to find out.
                    </p>

                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-blue-500">
                      <Lightbulb size={11} />
                      Let's test the circuit
                    </div>
                  </>

                )}

              </div>


              {/* JOY SPARKLES */}

              {circuitOn && (

                <div className="absolute right-3 top-2 flex gap-1">

                  <Sparkles
                    size={14}
                    className="joy-sparkle-1 text-yellow-400"
                  />

                  <Sparkles
                    size={18}
                    className="joy-sparkle-2 text-green-500"
                  />

                </div>

              )}

            </div>

          </div>

        </div>



        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="mt-2.5 flex shrink-0 items-center justify-center gap-2">


          <button
            onClick={handleBattery}
            className={`h-9 min-w-[125px] rounded-lg px-3 text-xs font-bold text-white shadow-sm transition ${
              connected
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {connected
              ? "✓ Battery Connected"
              : "Connect Battery"}
          </button>


          <button
            onClick={handleSwitch}
            className={`h-9 min-w-[105px] rounded-lg px-3 text-xs font-bold text-white shadow-sm transition ${
              switchOn
                ? "bg-green-600 hover:bg-green-700"
                : "bg-slate-700 hover:bg-slate-800"
            }`}
          >
            {switchOn
              ? "✓ Switch ON"
              : "Switch OFF"}
          </button>


          <button
            onClick={resetCircuit}
            className="h-9 min-w-[75px] rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            ↻ Reset
          </button>

        </div>

      </div>

    </div>

  );
}

export default CircuitSimulator;