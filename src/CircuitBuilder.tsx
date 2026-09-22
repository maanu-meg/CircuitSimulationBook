import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ComponentId = "battery" | "switch" | "led";

type PortId =
  | "battery-positive"
  | "battery-negative"
  | "switch-input"
  | "switch-output"
  | "led-input"
  | "led-output";

type PortSide =
  | "left"
  | "right"
  | "top"
  | "bottom";

type PortConfig = {
  label: string;
  side: PortSide;
};

type ComponentState = {
  id: ComponentId;
  x: number;
  y: number;
};

type Wire = {
  id: string;
  from: PortId;
  to: PortId;
};

type Point = {
  x: number;
  y: number;
};

const COMPONENT_WIDTH = 104;
const COMPONENT_HEIGHT = 88;

/* =========================================================
   PORT CONFIGURATION
========================================================= */

const PORTS: Record<PortId, PortConfig> = {
  /* -------------------------
     BATTERY
  ------------------------- */

  "battery-positive": {
    label: "+",
    side: "top",
  },

  "battery-negative": {
    label: "−",
    side: "bottom",
  },

  /* -------------------------
     SWITCH
  ------------------------- */

  "switch-input": {
    label: "IN",
    side: "left",
  },

  "switch-output": {
    label: "OUT",
    side: "right",
  },

  /* -------------------------
     LED
  ------------------------- */

  "led-input": {
    label: "IN",
    side: "top",
  },

  "led-output": {
    label: "OUT",
    side: "bottom",
  },
};

/* =========================================================
   PORT OWNER
========================================================= */

const PORT_OWNER: Record<
  PortId,
  ComponentId
> = {
  "battery-positive": "battery",
  "battery-negative": "battery",

  "switch-input": "switch",
  "switch-output": "switch",

  "led-input": "led",
  "led-output": "led",
};

/* =========================================================
   INITIAL COMPONENT POSITIONS
========================================================= */

const INITIAL_COMPONENTS: ComponentState[] = [
  {
    id: "battery",
    x: 55,
    y: 70,
  },

  {
    id: "switch",
    x: 250,
    y: 145,
  },

  {
    id: "led",
    x: 445,
    y: 70,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getPortOwner(
  portId: PortId
): ComponentId {
  return PORT_OWNER[portId];
}

function getPortPosition(
  component: ComponentState,
  portId: PortId
): Point {
  const port = PORTS[portId];

  /* -------------------------
     TOP
  ------------------------- */

  if (port.side === "top") {
    return {
      x:
        component.x +
        COMPONENT_WIDTH / 2,

      y: component.y,
    };
  }

  /* -------------------------
     BOTTOM
  ------------------------- */

  if (port.side === "bottom") {
    return {
      x:
        component.x +
        COMPONENT_WIDTH / 2,

      y:
        component.y +
        COMPONENT_HEIGHT,
    };
  }

  /* -------------------------
     LEFT / RIGHT
  ------------------------- */

  return {
    x:
      port.side === "left"
        ? component.x
        : component.x +
          COMPONENT_WIDTH,

    y:
      component.y +
      COMPONENT_HEIGHT / 2,
  };
}

function hasConnection(
  wires: Wire[],
  first: PortId,
  second: PortId
) {
  return wires.some(
    (wire) =>
      (wire.from === first &&
        wire.to === second) ||
      (wire.from === second &&
        wire.to === first)
  );
}

function createWireId() {
  return (
    Date.now().toString() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2)
  );
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CircuitBuilder() {
  const boardRef =
    useRef<HTMLDivElement | null>(
      null
    );

  /* =======================================================
     COMPONENT STATE
  ======================================================= */

  const [components, setComponents] =
    useState<ComponentState[]>(
      INITIAL_COMPONENTS
    );

  /* =======================================================
     WIRES
  ======================================================= */

  const [wires, setWires] =
    useState<Wire[]>([]);

  /* =======================================================
     COMPONENT DRAG
  ======================================================= */

  const [
    draggingComponent,
    setDraggingComponent,
  ] = useState<ComponentId | null>(
    null
  );

  const [
    componentOffset,
    setComponentOffset,
  ] = useState<Point>({
    x: 0,
    y: 0,
  });

  /* =======================================================
     WIRE DRAG
  ======================================================= */

  const [
    connectingFrom,
    setConnectingFrom,
  ] = useState<PortId | null>(
    null
  );

  const [
    mousePoint,
    setMousePoint,
  ] = useState<Point | null>(
    null
  );

  /* =======================================================
     SWITCH
  ======================================================= */

  const [switchOn, setSwitchOn] =
    useState(false);

  /* =======================================================
     SIMULATION
  ======================================================= */

  const [
    simulationState,
    setSimulationState,
  ] = useState<
    "idle" | "success" | "wrong"
  >("idle");

  /* =======================================================
     BOARD SIZE
  ======================================================= */

  const [boardSize, setBoardSize] =
    useState({
      width: 650,
      height: 330,
    });

  /* =======================================================
     UPDATE BOARD SIZE
  ======================================================= */

  useEffect(() => {
    const updateBoardSize = () => {
      if (!boardRef.current) {
        return;
      }

      const rect =
        boardRef.current.getBoundingClientRect();

      setBoardSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateBoardSize();

    const observer =
      new ResizeObserver(
        updateBoardSize
      );

    if (boardRef.current) {
      observer.observe(
        boardRef.current
      );
    }

    window.addEventListener(
      "resize",
      updateBoardSize
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateBoardSize
      );
    };
  }, []);

  /* =======================================================
     COMPONENT MAP
  ======================================================= */

  const componentMap = useMemo(() => {
    const map = new Map<
      ComponentId,
      ComponentState
    >();

    components.forEach(
      (component) => {
        map.set(
          component.id,
          component
        );
      }
    );

    return map;
  }, [components]);

  /* =======================================================
     GET ABSOLUTE PORT POSITION
  ======================================================= */

  const getAbsolutePortPosition =
    useCallback(
      (
        portId: PortId
      ): Point | null => {
        const owner =
          getPortOwner(portId);

        const component =
          componentMap.get(owner);

        if (!component) {
          return null;
        }

        return getPortPosition(
          component,
          portId
        );
      },
      [componentMap]
    );

  /* =======================================================
     START COMPONENT DRAG
  ======================================================= */

  const startComponentDrag =
    useCallback(
      (
        event: React.PointerEvent,
        component: ComponentState
      ) => {
        if (connectingFrom) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const board =
          boardRef.current?.getBoundingClientRect();

        if (!board) {
          return;
        }

        setDraggingComponent(
          component.id
        );

        setComponentOffset({
          x:
            event.clientX -
            board.left -
            component.x,

          y:
            event.clientY -
            board.top -
            component.y,
        });

        try {
          (
            event.currentTarget as HTMLElement
          ).setPointerCapture(
            event.pointerId
          );
        } catch {
          // Ignore pointer capture errors
        }
      },
      [connectingFrom]
    );

  /* =======================================================
     MOVE COMPONENT
  ======================================================= */

  const moveComponent =
    useCallback(
      (
        event: React.PointerEvent
      ) => {
        if (!draggingComponent) {
          return;
        }

        const board =
          boardRef.current?.getBoundingClientRect();

        if (!board) {
          return;
        }

        const rawX =
          event.clientX -
          board.left -
          componentOffset.x;

        const rawY =
          event.clientY -
          board.top -
          componentOffset.y;

        const maxX = Math.max(
          0,
          boardSize.width -
            COMPONENT_WIDTH
        );

        const maxY = Math.max(
          0,
          boardSize.height -
            COMPONENT_HEIGHT
        );

        const newX = clamp(
          rawX,
          0,
          maxX
        );

        const newY = clamp(
          rawY,
          0,
          maxY
        );

        setComponents(
          (previous) =>
            previous.map(
              (component) =>
                component.id ===
                draggingComponent
                  ? {
                      ...component,
                      x: newX,
                      y: newY,
                    }
                  : component
            )
        );
      },
      [
        draggingComponent,
        componentOffset,
        boardSize,
      ]
    );

  /* =======================================================
     STOP COMPONENT DRAG
  ======================================================= */

  const stopComponentDrag =
    useCallback(() => {
      setDraggingComponent(null);
    }, []);

  /* =======================================================
     START WIRE
  ======================================================= */

  const startWire = useCallback(
    (
      event: React.PointerEvent,
      portId: PortId
    ) => {
      event.preventDefault();
      event.stopPropagation();

      const board =
        boardRef.current?.getBoundingClientRect();

      if (!board) {
        return;
      }

      const start =
        getAbsolutePortPosition(
          portId
        );

      if (!start) {
        return;
      }

      setDraggingComponent(
        null
      );

      setConnectingFrom(
        portId
      );

      setMousePoint({
        x:
          event.clientX -
          board.left,

        y:
          event.clientY -
          board.top,
      });
    },
    [getAbsolutePortPosition]
  );

  /* =======================================================
     MOVE WIRE
  ======================================================= */

  const moveWire = useCallback(
    (
      event: React.PointerEvent
    ) => {
      if (!connectingFrom) {
        return;
      }

      const board =
        boardRef.current?.getBoundingClientRect();

      if (!board) {
        return;
      }

      setMousePoint({
        x:
          event.clientX -
          board.left,

        y:
          event.clientY -
          board.top,
      });
    },
    [connectingFrom]
  );

  /* =======================================================
     FIND TERMINAL
  ======================================================= */

  const findTerminal =
    useCallback(
      (
        event: React.PointerEvent
      ): PortId | null => {
        const element =
          document.elementFromPoint(
            event.clientX,
            event.clientY
          );

        const terminal =
          element?.closest(
            "[data-port-id]"
          ) as HTMLElement | null;

        if (!terminal) {
          return null;
        }

        const portId =
          terminal.dataset.portId;

        return (
          portId as PortId
        );
      },
      []
    );

  /* =======================================================
     FINISH WIRE
  ======================================================= */

  const finishWire = useCallback(
    (
      event: React.PointerEvent
    ) => {
      if (!connectingFrom) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const targetPort =
        findTerminal(event);

      if (
        targetPort &&
        targetPort !== connectingFrom
      ) {
        const firstOwner =
          getPortOwner(
            connectingFrom
          );

        const secondOwner =
          getPortOwner(
            targetPort
          );

        /* Prevent connecting a component
           to itself */

        if (
          firstOwner !==
          secondOwner
        ) {
          const alreadyExists =
            hasConnection(
              wires,
              connectingFrom,
              targetPort
            );

          if (!alreadyExists) {
            setWires(
              (previous) => [
                ...previous,
                {
                  id: createWireId(),
                  from: connectingFrom,
                  to: targetPort,
                },
              ]
            );
          }
        }
      }

      setConnectingFrom(
        null
      );

      setMousePoint(null);
    },
    [
      connectingFrom,
      findTerminal,
      wires,
    ]
  );

  /* =======================================================
     CANCEL WIRE
  ======================================================= */

  const cancelWire =
    useCallback(() => {
      setConnectingFrom(null);
      setMousePoint(null);
    }, []);

  /* =======================================================
     DELETE WIRE
  ======================================================= */

  const deleteWire = useCallback(
    (
      event: React.PointerEvent,
      wireId: string
    ) => {
      event.preventDefault();
      event.stopPropagation();

      if (connectingFrom) {
        return;
      }

      setWires(
        (previous) =>
          previous.filter(
            (wire) =>
              wire.id !== wireId
          )
      );

      setSimulationState(
        "idle"
      );
    },
    [connectingFrom]
  );

  /* =======================================================
     RESET
  ======================================================= */

  const resetCircuit =
    useCallback(() => {
      setComponents(
        INITIAL_COMPONENTS.map(
          (component) => ({
            ...component,
          })
        )
      );

      setWires([]);

      setSwitchOn(false);

      setConnectingFrom(null);

      setMousePoint(null);

      setSimulationState(
        "idle"
      );
    }, []);

  /* =======================================================
     SIMULATE
  ======================================================= */

  const simulateCircuit =
    useCallback(() => {
      /*
       Correct circuit:

       Battery +
            ↓
       Switch IN
       Switch OUT
            ↓
        LED IN
        LED OUT
            ↓
       Battery −
      */

      const batteryToSwitch =
        hasConnection(
          wires,
          "battery-positive",
          "switch-input"
        );

      const switchToLed =
        hasConnection(
          wires,
          "switch-output",
          "led-input"
        );

      const ledToBattery =
        hasConnection(
          wires,
          "led-output",
          "battery-negative"
        );

      const correct =
        batteryToSwitch &&
        switchToLed &&
        ledToBattery &&
        switchOn;

      if (correct) {
        setSimulationState(
          "success"
        );
      } else {
        setSimulationState(
          "wrong"
        );
      }
    }, [wires, switchOn]);

  /* =======================================================
     RENDER WIRES
  ======================================================= */

  const renderedWires =
    wires.map((wire) => {
      const start =
        getAbsolutePortPosition(
          wire.from
        );

      const end =
        getAbsolutePortPosition(
          wire.to
        );

      if (!start || !end) {
        return null;
      }

      const isCorrectWire =
        (wire.from ===
          "battery-positive" &&
          wire.to ===
            "switch-input") ||
        (wire.from ===
          "switch-input" &&
          wire.to ===
            "battery-positive") ||

        (wire.from ===
          "switch-output" &&
          wire.to ===
            "led-input") ||
        (wire.from ===
          "led-input" &&
          wire.to ===
            "switch-output") ||

        (wire.from ===
          "led-output" &&
          wire.to ===
            "battery-negative") ||
        (wire.from ===
          "battery-negative" &&
          wire.to ===
            "led-output");

      const isCurrentFlow =
        simulationState ===
          "success" &&
        isCorrectWire &&
        switchOn;

      return (
        <g key={wire.id}>
          {/* Main wire */}

          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={
              isCurrentFlow
                ? "#22c55e"
                : "#64748b"
            }
            strokeWidth={4}
            strokeLinecap="round"
            className={
              isCurrentFlow
                ? "current-wire"
                : ""
            }
          />

          {/* Invisible clickable wire */}

          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="transparent"
            strokeWidth={16}
            strokeLinecap="round"
            style={{
              pointerEvents:
                "stroke",
              cursor: "pointer",
            }}
            onPointerDown={(
              event
            ) =>
              deleteWire(
                event,
                wire.id
              )
            }
          />

          {/* Moving current */}

          {isCurrentFlow && (
            <circle
              r="5"
              fill="#facc15"
            >
              <animateMotion
                dur="0.9s"
                repeatCount="indefinite"
                path={`
                  M ${start.x} ${start.y}
                  L ${end.x} ${end.y}
                `}
              />
            </circle>
          )}
        </g>
      );
    });

  /* =======================================================
     TEMPORARY WIRE
  ======================================================= */

  const temporaryWire =
    connectingFrom &&
    mousePoint
      ? (() => {
          const start =
            getAbsolutePortPosition(
              connectingFrom
            );

          if (!start) {
            return null;
          }

          return (
            <line
              x1={start.x}
              y1={start.y}
              x2={mousePoint.x}
              y2={mousePoint.y}
              stroke="#2563eb"
              strokeWidth={3}
              strokeDasharray="8 6"
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })()
      : null;

  /* =======================================================
     RENDER COMPONENT
  ======================================================= */

  const renderComponent = (
    component: ComponentState
  ) => {
    const isBattery =
      component.id ===
      "battery";

    const isSwitch =
      component.id ===
      "switch";

    const isLed =
      component.id ===
      "led";

    const floatClass =
      isBattery
        ? "component-float"
        : isSwitch
          ? "component-float component-float-delay"
          : "component-float component-float-delay-2";

    return (
      <div
        key={component.id}
        className="
          absolute
          select-none
        "
        style={{
          left: component.x,
          top: component.y,

          width:
            COMPONENT_WIDTH,

          height:
            COMPONENT_HEIGHT,

          zIndex:
            draggingComponent ===
            component.id
              ? 30
              : 10,

          cursor:
            connectingFrom
              ? "default"
              : "grab",

          touchAction: "none",
        }}
        onPointerDown={(
          event
        ) =>
          startComponentDrag(
            event,
            component
          )
        }
        onPointerMove={
          moveComponent
        }
        onPointerUp={
          stopComponentDrag
        }
        onPointerCancel={
          stopComponentDrag
        }
      >
        <div
          className={`
            ${floatClass}
            w-full
            h-full
            rounded-2xl
            bg-white
            border
            border-slate-200
            shadow-md
            flex
            flex-col
            items-center
            justify-center
            relative
          `}
        >
          {/* =================================================
              BATTERY
          ================================================= */}

          {isBattery && (
            <>
              <div className="text-4xl leading-none">
                🔋
              </div>

              <div
                className="
                  mt-1
                  text-[10px]
                  font-bold
                  text-slate-600
                "
              >
                Battery
              </div>
            </>
          )}

          {/* =================================================
              SWITCH
          ================================================= */}

          {isSwitch && (
            <>
              <div className="text-4xl leading-none">
                🔘
              </div>

              <div
                className="
                  mt-1
                  text-[10px]
                  font-bold
                  text-slate-600
                "
              >
                Switch
              </div>

              <button
                type="button"
                className={`
                  mt-1
                  px-2
                  py-0.5
                  rounded-full
                  text-[9px]
                  font-bold

                  ${
                    switchOn
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }
                `}
                onPointerDown={(
                  event
                ) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(
                  event
                ) => {
                  event.stopPropagation();

                  setSwitchOn(
                    (previous) =>
                      !previous
                  );

                  setSimulationState(
                    "idle"
                  );
                }}
              >
                {switchOn
                  ? "ON"
                  : "OFF"}
              </button>
            </>
          )}

          {/* =================================================
              LED
          ================================================= */}

          {isLed && (
            <>
              <div
                className={
                  simulationState ===
                  "success"
                    ? "bulb-glow"
                    : ""
                }
              >
                <span className="text-4xl leading-none">
                  💡
                </span>
              </div>

              <div
                className="
                  mt-1
                  text-[10px]
                  font-bold
                  text-slate-600
                "
              >
                LED
              </div>
            </>
          )}

          {/* =================================================
              BATTERY + — TOP
          ================================================= */}

          {isBattery && (
            <PortButton
              portId="battery-positive"
              label="+"
              position="top"
              onStartWire={
                startWire
              }
            />
          )}

          {/* =================================================
              BATTERY − — BOTTOM
          ================================================= */}

          {isBattery && (
            <PortButton
              portId="battery-negative"
              label="−"
              position="bottom"
              onStartWire={
                startWire
              }
            />
          )}

          {/* =================================================
              SWITCH IN — LEFT
          ================================================= */}

          {isSwitch && (
            <PortButton
              portId="switch-input"
              label="IN"
              position="left"
              onStartWire={
                startWire
              }
            />
          )}

          {/* =================================================
              SWITCH OUT — RIGHT
          ================================================= */}

          {isSwitch && (
            <PortButton
              portId="switch-output"
              label="OUT"
              position="right"
              onStartWire={
                startWire
              }
            />
          )}

          {/* =================================================
              LED IN — TOP
          ================================================= */}

          {isLed && (
            <PortButton
              portId="led-input"
              label="IN"
              position="top"
              onStartWire={
                startWire
              }
            />
          )}

          {/* =================================================
              LED OUT — BOTTOM
          ================================================= */}

          {isLed && (
            <PortButton
              portId="led-output"
              label="OUT"
              position="bottom"
              onStartWire={
                startWire
              }
            />
          )}
        </div>
      </div>
    );
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div
      className="
        w-full
        h-full
        flex
        flex-col
        gap-2
        min-h-0
      "
    >
      {/* =====================================================
          STATUS
      ===================================================== */}

      <div
        className="
          shrink-0
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <div
          className={`
            px-3
            py-1.5
            rounded-xl
            text-xs
            font-semibold

            ${
              simulationState ===
              "success"
                ? "bg-green-100 text-green-700"
                : simulationState ===
                    "wrong"
                  ? "bg-red-100 text-red-700"
                  : "bg-white text-slate-600 border border-slate-200"
            }
          `}
        >
          {simulationState ===
          "success"
            ? "🤩 Awesome! Circuit is complete."
            : simulationState ===
                "wrong"
              ? "😕 Almost there! Check the connections and switch."
              : "Connect the terminals to form a circuit."}
        </div>

        <div
          className="
            text-[10px]
            text-slate-500
            font-medium
          "
        >
          Click a wire to delete
        </div>
      </div>

      {/* =====================================================
          CIRCUIT FRAME
      ===================================================== */}

      <div
        ref={boardRef}
        className="
          relative
          flex-1
          min-h-0
          overflow-hidden
          rounded-2xl
          border
          border-slate-300
          bg-white
          circuit-grid
          shadow-inner
        "
        onPointerMove={
          moveWire
        }
        onPointerUp={
          finishWire
        }
        onPointerCancel={
          cancelWire
        }
      >
        {/* ===================================================
            SVG WIRE LAYER
        =================================================== */}

        <svg
          className="
            absolute
            inset-0
            w-full
            h-full
          "
          style={{
            pointerEvents:
              "none",
            zIndex: 5,
            overflow:
              "visible",
          }}
        >
          {renderedWires}

          {temporaryWire}
        </svg>

        {/* ===================================================
            COMPONENT LAYER
        =================================================== */}

        {components.map(
          renderComponent
        )}

        {/* ===================================================
            SUCCESS CHARACTER
        =================================================== */}

        {simulationState ===
          "success" && (
          <div
            className="
              absolute
              left-1/2
              bottom-3
              -translate-x-1/2
              z-40
              flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-xl
              bg-white/95
              border
              border-green-200
              shadow-sm
            "
          >
            <div
              className="
                text-3xl
                joy-character
              "
            >
              🤩
            </div>

            <div>
              <div
                className="
                  text-sm
                  font-extrabold
                  text-green-700
                "
              >
                Awesome!
              </div>

              <div
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                The LED is glowing.
              </div>
            </div>

            <div
              className="
                text-lg
                joy-stars
              "
            >
              ✨
            </div>
          </div>
        )}

        {/* ===================================================
            WRONG CHARACTER
        =================================================== */}

        {simulationState ===
          "wrong" && (
          <div
            className="
              absolute
              left-1/2
              bottom-3
              -translate-x-1/2
              z-40
              flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-xl
              bg-white/95
              border
              border-red-200
              shadow-sm
            "
          >
            <div
              className="
                text-3xl
                confused-character
              "
            >
              😕
            </div>

            <div>
              <div
                className="
                  text-sm
                  font-extrabold
                  text-red-600
                "
              >
                Almost there!
              </div>

              <div
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                Check your circuit
                connections.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div
        className="
          shrink-0
          flex
          items-center
          justify-center
          gap-2
          pt-1
        "
      >
        <button
          type="button"
          onClick={
            simulateCircuit
          }
          className="
            px-4
            py-2
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            text-xs
            font-bold
            shadow-sm
            transition
          "
        >
          ⚡ Simulate Circuit
        </button>

        <button
          type="button"
          onClick={
            resetCircuit
          }
          className="
            px-4
            py-2
            rounded-xl
            bg-white
            hover:bg-slate-50
            text-slate-700
            border
            border-slate-300
            text-xs
            font-bold
            shadow-sm
            transition
          "
        >
          ↻ Reset
        </button>
      </div>

      {/* =====================================================
          INSTRUCTION
      ===================================================== */}

      <div
        className="
          shrink-0
          text-center
          text-[10px]
          text-slate-400
          font-medium
          pb-1
        "
      >
        Connect: 🔋 + → 🔘 IN → 🔘 OUT → 💡 IN → 💡 OUT → 🔋 −
      </div>
    </div>
  );
}

/* =========================================================
   PORT BUTTON
========================================================= */

type PortButtonProps = {
  portId: PortId;

  label: string;

  position:
    | "left"
    | "right"
    | "top"
    | "bottom";

  onStartWire: (
    event: React.PointerEvent,
    portId: PortId
  ) => void;
};

function PortButton({
  portId,
  label,
  position,
  onStartWire,
}: PortButtonProps) {
  let positionClass = "";

  /* -------------------------
     LEFT
  ------------------------- */

  if (position === "left") {
    positionClass =
      "left-[-15px] top-1/2 -translate-y-1/2";
  }

  /* -------------------------
     RIGHT
  ------------------------- */

  if (position === "right") {
    positionClass =
      "right-[-15px] top-1/2 -translate-y-1/2";
  }

  /* -------------------------
     TOP
  ------------------------- */

  if (position === "top") {
    positionClass =
      "top-[-15px] left-1/2 -translate-x-1/2";
  }

  /* -------------------------
     BOTTOM
  ------------------------- */

  if (position === "bottom") {
    positionClass =
      "bottom-[-15px] left-1/2 -translate-x-1/2";
  }

  return (
    <button
      type="button"
      data-port-id={
        portId
      }
      aria-label={`Connect ${label}`}
      className={`
        absolute
        ${positionClass}

        z-50

        w-[28px]
        h-[28px]

        rounded-full

        bg-slate-900
        border-[3px]
        border-white

        shadow-md

        flex
        items-center
        justify-center

        text-[8px]
        font-extrabold
        text-white

        hover:scale-110
        hover:bg-blue-600

        active:scale-95

        transition

        touch-none
      `}
      onPointerDown={(
        event
      ) => {
        event.preventDefault();
        event.stopPropagation();

        onStartWire(
          event,
          portId
        );
      }}
    >
      {label}
    </button>
  );
}