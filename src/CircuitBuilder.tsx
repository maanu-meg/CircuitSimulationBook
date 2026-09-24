import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type ComponentId = "battery" | "switch" | "led";

type PaletteId = ComponentId | "wire";

type PortId =
  | "battery-positive"
  | "battery-negative"
  | "switch-input"
  | "switch-output"
  | "led-input"
  | "led-output";

type PortSide = "left" | "right" | "top" | "bottom";

type Point = {
  x: number;
  y: number;
};

type ComponentState = {
  id: ComponentId;
  instanceId: string;
  x: number;
  y: number;
};

type Wire = {
  id: string;

  x1: number;
  y1: number;
  x2: number;
  y2: number;

  startPort?: PortId;
  endPort?: PortId;
};

/* =========================================================
   CONSTANTS
========================================================= */

const COMPONENT_WIDTH = 104;
const COMPONENT_HEIGHT = 88;



/* =========================================================
   PORT CONFIGURATION
========================================================= */

const PORTS: Record<
  PortId,
  {
    label: string;
    side: PortSide;
  }
> = {
  "battery-positive": {
    label: "+",
    side: "top",
  },

  "battery-negative": {
    label: "−",
    side: "bottom",
  },

  "switch-input": {
    label: "IN",
    side: "left",
  },

  "switch-output": {
    label: "OUT",
    side: "right",
  },

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
   HELPERS
========================================================= */

function getPortOwner(
  portId: PortId
): ComponentId {
  return PORT_OWNER[portId];
}

function createId(prefix: string) {
  return (
    prefix +
    "-" +
    Date.now().toString(36) +
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
   PORT POSITION
========================================================= */

function getPortPosition(
  component: ComponentState,
  portId: PortId
): Point {
  const port = PORTS[portId];

  if (port.side === "top") {
    return {
      x:
        component.x +
        COMPONENT_WIDTH / 2,

      y: component.y,
    };
  }

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

  if (port.side === "left") {
    return {
      x: component.x,
      y:
        component.y +
        COMPONENT_HEIGHT / 2,
    };
  }

  return {
    x:
      component.x +
      COMPONENT_WIDTH,

    y:
      component.y +
      COMPONENT_HEIGHT / 2,
  };
}

/* =========================================================
   COMPONENT PORTS
========================================================= */

function getPortsForComponent(
  componentId: ComponentId
): PortId[] {
  if (componentId === "battery") {
    return [
      "battery-positive",
      "battery-negative",
    ];
  }

  if (componentId === "switch") {
    return [
      "switch-input",
      "switch-output",
    ];
  }

  return [
    "led-input",
    "led-output",
  ];
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
     COMPONENTS
  ======================================================= */

  const [components, setComponents] =
    useState<ComponentState[]>([]);

  /* =======================================================
     WIRES
  ======================================================= */

  const [wires, setWires] =
    useState<Wire[]>([]);

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
      width: 700,
      height: 400,
    });

  /* =======================================================
     COMPONENT DRAG
  ======================================================= */

  const [
    draggingComponent,
    setDraggingComponent,
  ] =
    useState<string | null>(null);

  const [
    componentOffset,
    setComponentOffset,
  ] = useState<Point>({
    x: 0,
    y: 0,
  });

  /* =======================================================
     WIRE END DRAG
  ======================================================= */

  const [
    draggingWireEnd,
    setDraggingWireEnd,
  ] = useState<{
    wireId: string;
    end: "start" | "end";
  } | null>(null);

  /* =======================================================
     BOARD SIZE UPDATE
  ======================================================= */

  useEffect(() => {
    const updateSize = () => {
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

    updateSize();

    const observer =
      new ResizeObserver(updateSize);

    if (boardRef.current) {
      observer.observe(
        boardRef.current
      );
    }

    window.addEventListener(
      "resize",
      updateSize
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateSize
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
        /*
         * Only one of each component type
         * is needed for this circuit builder.
         */
        map.set(
          component.id,
          component
        );
      }
    );

    return map;
  }, [components]);

  /* =======================================================
     ABSOLUTE PORT POSITION
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
     BOARD POINT
  ======================================================= */

  const getBoardPoint =
    useCallback(
      (
        event:
          | React.PointerEvent
          | React.DragEvent
      ): Point | null => {
        const board =
          boardRef.current?.getBoundingClientRect();

        if (!board) {
          return null;
        }

        return {
          x: clamp(
            event.clientX -
              board.left,
            0,
            board.width
          ),

          y: clamp(
            event.clientY -
              board.top,
            0,
            board.height
          ),
        };
      },
      []
    );

  /* =======================================================
     DRAG COMPONENT
  ======================================================= */

  const startComponentDrag =
    useCallback(
      (
        event: React.PointerEvent,
        component: ComponentState
      ) => {
        event.preventDefault();
        event.stopPropagation();

        const board =
          boardRef.current?.getBoundingClientRect();

        if (!board) {
          return;
        }

        setDraggingComponent(
          component.instanceId
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
          //
        }
      },
      []
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

        setComponents(
          (previous) =>
            previous.map(
              (component) =>
                component.instanceId ===
                draggingComponent
                  ? {
                      ...component,

                      x: clamp(
                        rawX,
                        0,
                        maxX
                      ),

                      y: clamp(
                        rawY,
                        0,
                        maxY
                      ),
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
     PALETTE DRAG START
  ======================================================= */

  const startPaletteDrag = (
    event: React.DragEvent,
    paletteId: PaletteId
  ) => {
    event.dataTransfer.setData(
      "palette-id",
      paletteId
    );

    event.dataTransfer.effectAllowed =
      "copy";
  };

  /* =======================================================
     BOARD DROP
  ======================================================= */

  const handleBoardDrop = (
    event: React.DragEvent
  ) => {
    event.preventDefault();

    const paletteId =
      event.dataTransfer.getData(
        "palette-id"
      ) as PaletteId;

    if (!paletteId) {
      return;
    }

    const point =
      getBoardPoint(event);

    if (!point) {
      return;
    }

    /* ---------------------------------------
       COMPONENT DROP
    --------------------------------------- */

    if (
      paletteId === "battery" ||
      paletteId === "switch" ||
      paletteId === "led"
    ) {
      const alreadyPlaced =
        components.some(
          (component) =>
            component.id ===
            paletteId
        );

      if (alreadyPlaced) {
        return;
      }

      const x = clamp(
        point.x -
          COMPONENT_WIDTH / 2,
        0,
        boardSize.width -
          COMPONENT_WIDTH
      );

      const y = clamp(
        point.y -
          COMPONENT_HEIGHT / 2,
        0,
        boardSize.height -
          COMPONENT_HEIGHT
      );

      setComponents(
        (previous) => [
          ...previous,

          {
            id: paletteId,

            instanceId:
              createId(paletteId),

            x,
            y,
          },
        ]
      );

      setSimulationState(
        "idle"
      );

      return;
    }

    /* ---------------------------------------
       WIRE DROP
    --------------------------------------- */

    if (paletteId === "wire") {
      const wireWidth = 150;

      const x1 = clamp(
        point.x -
          wireWidth / 2,
        10,
        boardSize.width - 10
      );

      const y1 = clamp(
        point.y,
        10,
        boardSize.height - 10
      );

      const x2 = clamp(
        x1 + wireWidth,
        10,
        boardSize.width - 10
      );

      setWires(
        (previous) => [
          ...previous,

          {
            id: createId("wire"),

            x1,
            y1,

            x2,
            y2: y1,
          },
        ]
      );
    }
  };

  /* =======================================================
     FIND PORT UNDER POINTER
  ======================================================= */

  const findPortAtPointer =
    useCallback(
      (
        event: React.PointerEvent
      ): PortId | null => {
        const element =
          document.elementFromPoint(
            event.clientX,
            event.clientY
          );

        const port =
          element?.closest(
            "[data-port-id]"
          ) as HTMLElement | null;

        if (!port) {
          return null;
        }

        return (
          port.dataset.portId as
            | PortId
            | undefined
        ) ?? null;
      },
      []
    );

  /* =======================================================
     START WIRE END DRAG
  ======================================================= */

  const startWireEndDrag = (
    event: React.PointerEvent,
    wireId: string,
    end: "start" | "end"
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDraggingWireEnd({
      wireId,
      end,
    });

    try {
      (
        event.currentTarget as HTMLElement
      ).setPointerCapture(
        event.pointerId
      );
    } catch {
      //
    }
  };

  /* =======================================================
     MOVE WIRE END
  ======================================================= */

  const moveWireEnd =
    useCallback(
      (
        event: React.PointerEvent
      ) => {
        if (!draggingWireEnd) {
          return;
        }

        const point =
          getBoardPoint(event);

        if (!point) {
          return;
        }

        setWires(
          (previous) =>
            previous.map(
              (wire) => {
                if (
                  wire.id !==
                  draggingWireEnd.wireId
                ) {
                  return wire;
                }

                if (
                  draggingWireEnd.end ===
                  "start"
                ) {
                  return {
                    ...wire,

                    x1: point.x,
                    y1: point.y,

                    startPort:
                      undefined,
                  };
                }

                return {
                  ...wire,

                  x2: point.x,
                  y2: point.y,

                  endPort:
                    undefined,
                };
              }
            )
        );
      },
      [
        draggingWireEnd,
        getBoardPoint,
      ]
    );

  /* =======================================================
     STOP WIRE END DRAG
  ======================================================= */

  const stopWireEndDrag =
    useCallback(
      (
        event: React.PointerEvent
      ) => {
        if (!draggingWireEnd) {
          return;
        }

        const port =
          findPortAtPointer(event);

        if (port) {
          const position =
            getAbsolutePortPosition(
              port
            );

          if (position) {
            setWires(
              (previous) =>
                previous.map(
                  (wire) => {
                    if (
                      wire.id !==
                      draggingWireEnd.wireId
                    ) {
                      return wire;
                    }

                    if (
                      draggingWireEnd.end ===
                      "start"
                    ) {
                      return {
                        ...wire,

                        x1: position.x,
                        y1: position.y,

                        startPort: port,
                      };
                    }

                    return {
                      ...wire,

                      x2: position.x,
                      y2: position.y,

                      endPort: port,
                    };
                  }
                )
            );
          }
        }

        setDraggingWireEnd(null);

        setSimulationState(
          "idle"
        );
      },
      [
        draggingWireEnd,
        findPortAtPointer,
        getAbsolutePortPosition,
      ]
    );

  /* =======================================================
     KEEP CONNECTED WIRES WITH COMPONENT
  ======================================================= */

  useEffect(() => {
    setWires(
      (previous) =>
        previous.map((wire) => {
          let updated = {
            ...wire,
          };

          if (wire.startPort) {
            const position =
              getAbsolutePortPosition(
                wire.startPort
              );

            if (position) {
              updated.x1 =
                position.x;

              updated.y1 =
                position.y;
            }
          }

          if (wire.endPort) {
            const position =
              getAbsolutePortPosition(
                wire.endPort
              );

            if (position) {
              updated.x2 =
                position.x;

              updated.y2 =
                position.y;
            }
          }

          return updated;
        })
    );
  }, [
    components,
    getAbsolutePortPosition,
  ]);

  /* =======================================================
     DELETE WIRE
  ======================================================= */

  const deleteWire = (
    event: React.PointerEvent,
    wireId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();

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
  };

  /* =======================================================
     CHECK CONNECTION
  ======================================================= */

  const hasConnection = (
    first: PortId,
    second: PortId
  ) => {
    return wires.some(
      (wire) =>
        (wire.startPort === first &&
          wire.endPort === second) ||
        (wire.startPort === second &&
          wire.endPort === first)
    );
  };

  /* =======================================================
     SIMULATE
  ======================================================= */

  const simulateCircuit =
    useCallback(() => {
      const batteryToSwitch =
        hasConnection(
          "battery-positive",
          "switch-input"
        );

      const switchToLed =
        hasConnection(
          "switch-output",
          "led-input"
        );

      const ledToBattery =
        hasConnection(
          "led-output",
          "battery-negative"
        );

      const allComponentsPlaced =
        components.some(
          (c) =>
            c.id === "battery"
        ) &&
        components.some(
          (c) =>
            c.id === "switch"
        ) &&
        components.some(
          (c) =>
            c.id === "led"
        );

      const correct =
        allComponentsPlaced &&
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
    }, [
      wires,
      components,
      switchOn,
    ]);

  /* =======================================================
     RESET
  ======================================================= */

  const resetCircuit =
    useCallback(() => {
      setComponents([]);

      setWires([]);

      setSwitchOn(false);

      setSimulationState(
        "idle"
      );

      setDraggingComponent(
        null
      );

      setDraggingWireEnd(
        null
      );
    }, []);

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

    return (
      <div
        key={component.instanceId}
        className="absolute select-none"
        style={{
          left: component.x,
          top: component.y,

          width:
            COMPONENT_WIDTH,

          height:
            COMPONENT_HEIGHT,

          zIndex:
            draggingComponent ===
            component.instanceId
              ? 30
              : 10,

          cursor:
            "grab",

          touchAction:
            "none",
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
          className="
            component-float
            w-full
            h-full
            rounded-2xl
            bg-white
            border
            border-slate-200
            shadow-lg
            flex
            flex-col
            items-center
            justify-center
            relative
          "
        >
          {/* BATTERY */}

          {isBattery && (
            <>
              <div className="text-4xl leading-none">
                🔋
              </div>

              <div className="
                mt-1
                text-[10px]
                font-bold
                text-slate-600
              ">
                Battery
              </div>
            </>
          )}

          {/* SWITCH */}

          {isSwitch && (
            <>
              <div className="text-4xl leading-none">
                🔘
              </div>

              <div className="
                mt-1
                text-[10px]
                font-bold
                text-slate-600
              ">
                Switch
              </div>

              <button
                type="button"
                className={`
                  mt-1
                  px-3
                  py-1
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

          {/* LED */}

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

              <div className="
                mt-1
                text-[10px]
                font-bold
                text-slate-600
              ">
                LED
              </div>
            </>
          )}

          {/* PORTS */}

          {getPortsForComponent(
            component.id
          ).map(
            (portId) => {
              const port =
                PORTS[portId];

              return (
                <PortButton
                  key={portId}
                  portId={portId}
                  label={
                    port.label
                  }
                  position={
                    port.side
                  }
                />
              );
            }
          )}
        </div>
      </div>
    );
  };

  /* =======================================================
     RENDER WIRES
  ======================================================= */

  const renderedWires =
    wires.map((wire) => {
      const start =
        wire.startPort
          ? getAbsolutePortPosition(
              wire.startPort
            )
          : {
              x: wire.x1,
              y: wire.y1,
            };

      const end =
        wire.endPort
          ? getAbsolutePortPosition(
              wire.endPort
            )
          : {
              x: wire.x2,
              y: wire.y2,
            };

      if (!start || !end) {
        return null;
      }

      const isCorrectWire =
        (wire.startPort ===
          "battery-positive" &&
          wire.endPort ===
            "switch-input") ||
        (wire.startPort ===
          "switch-input" &&
          wire.endPort ===
            "battery-positive") ||

        (wire.startPort ===
          "switch-output" &&
          wire.endPort ===
            "led-input") ||
        (wire.startPort ===
          "led-input" &&
          wire.endPort ===
            "switch-output") ||

        (wire.startPort ===
          "led-output" &&
          wire.endPort ===
            "battery-negative") ||
        (wire.startPort ===
          "battery-negative" &&
          wire.endPort ===
            "led-output");

      const currentFlow =
        simulationState ===
          "success" &&
        isCorrectWire &&
        switchOn;

      return (
        <g key={wire.id}>
          {/* MAIN WIRE */}

          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={
              currentFlow
                ? "#22c55e"
                : "#64748b"
            }
            strokeWidth={4}
            strokeLinecap="round"
            className={
              currentFlow
                ? "current-wire"
                : ""
            }
          />

          {/* CLICK TO DELETE */}

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
              cursor:
                "pointer",
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

          {/* START HANDLE */}

          <circle
            cx={start.x}
            cy={start.y}
            r={7}
            fill="#2563eb"
            stroke="white"
            strokeWidth={3}
            style={{
              cursor:
                "grab",
              pointerEvents:
                "auto",
            }}
            onPointerDown={(
              event
            ) =>
              startWireEndDrag(
                event,
                wire.id,
                "start"
              )
            }
          />

          {/* END HANDLE */}

          <circle
            cx={end.x}
            cy={end.y}
            r={7}
            fill="#2563eb"
            stroke="white"
            strokeWidth={3}
            style={{
              cursor:
                "grab",
              pointerEvents:
                "auto",
            }}
            onPointerDown={(
              event
            ) =>
              startWireEndDrag(
                event,
                wire.id,
                "end"
              )
            }
          />

          {/* CURRENT FLOW */}

          {currentFlow && (
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
     RETURN
  ======================================================= */

  return (
    <div
      className="
        w-full
        h-full
        min-h-0
        flex
        flex-col
        gap-2
        overflow-hidden
      "
    >

      {/* ===================================================
    COMPONENT LIBRARY
=================================================== */}

<div
  className="
    shrink-0

    rounded-2xl

    border-2
    border-slate-200

    bg-slate-50

    shadow-sm

    px-3
    py-2
  "
>
  {/* HEADER */}

  <div
    className="
      flex
      items-center
      justify-between

      mb-2
    "
  >
    <div>
      <div
        className="
          text-xs
          font-extrabold
          text-slate-800
        "
      >
        Component Library
      </div>

      <div
        className="
          text-[9px]
          text-slate-400
          mt-0.5
        "
      >
        Drag a component into the circuit area
      </div>
    </div>

    <div
      className="
        px-2
        py-0.5

        rounded-full

        bg-blue-50
        border
        border-blue-100

        text-[8px]
        font-bold
        text-blue-600
      "
    >
      Drag & Drop
    </div>
  </div>

  {/* COMPONENT SLOTS */}

  <div
    className="
      grid
      grid-cols-4
      gap-2
      w-full
    "
  >
    {/* BATTERY SLOT */}

    <div
      className="
        min-w-0

        rounded-2xl

        border
        border-dashed
        border-slate-300

        bg-white

        p-1

        flex
        justify-center
        min-h-0
      "
    >
      <PaletteItem
        id="battery"
        emoji="🔋"
        title="Battery"
        onDragStart={
          startPaletteDrag
        }
      />
    </div>

    {/* SWITCH SLOT */}

    <div
      className="
        min-w-0

        rounded-2xl

        border
        border-dashed
        border-slate-300

        bg-white

        p-1

        flex
        justify-center
        min-h-0
      "
    >
      <PaletteItem
        id="switch"
        emoji="🔘"
        title="Switch"
        onDragStart={
          startPaletteDrag
        }
      />
    </div>

    {/* LED SLOT */}

    <div
      className="
        min-w-0

        rounded-2xl

        border
        border-dashed
        border-slate-300

        bg-white

        p-1

        flex
        justify-center
        min-h-0
      "
    >
      <PaletteItem
        id="led"
        emoji="💡"
        title="LED"
        onDragStart={
          startPaletteDrag
        }
      />
    </div>

    {/* WIRE SLOT */}

    <div
      className="
        min-w-0

        rounded-2xl

        border
        border-dashed
        border-slate-300

        bg-white

        p-1

        flex
        justify-center
        min-h-0
      "
    >
      <PaletteItem
        id="wire"
        emoji="🔌"
        title="Wire"
        onDragStart={
          startPaletteDrag
        }
      />
    </div>
  </div>
</div>

      {/* ===================================================
          INSTRUCTION
      =================================================== */}

      <div className="
        shrink-0
        text-center
        text-[9px]
        text-slate-500
        font-medium
        leading-none
      ">
        Drag components into the circuit area. Drag wire ends to connect the terminals.
      </div>

      {/* ===================================================
          CIRCUIT FRAME
      =================================================== */}

      <div
        ref={boardRef}
        className="
          relative
          flex-1
          min-h-0
          overflow-hidden
          rounded-2xl
          border-2
          border-slate-300
          bg-white
          circuit-grid
          shadow-inner
        "
        onDragOver={(
          event
        ) => {
          event.preventDefault();

          event.dataTransfer.dropEffect =
            "copy";
        }}
        onDrop={
          handleBoardDrop
        }
        onPointerMove={(
          event
        ) => {
          moveComponent(event);
          moveWireEnd(event);
        }}
        onPointerUp={(
          event
        ) => {
          stopComponentDrag();
          stopWireEndDrag(event);
        }}
        onPointerCancel={(
          event
        ) => {
          stopComponentDrag();
          stopWireEndDrag(event);
        }}
      >

        {/* EMPTY BOARD MESSAGE */}

        {components.length ===
          0 &&
          wires.length === 0 && (
            <div className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              pointer-events-none
            ">
              <div className="
                text-center
                text-slate-400
              ">
                <div className="
                  text-4xl
                  mb-2
                ">
                  ⚡
                </div>

                <div className="
                  text-sm
                  font-bold
                ">
                  Drop components here
                </div>

                <div className="
                  text-xs
                  mt-1
                ">
                  Build your own circuit
                </div>
              </div>
            </div>
          )}

        {/* =================================================
            SVG WIRE LAYER
        ================================================= */}

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
        </svg>

        {/* =================================================
            COMPONENT LAYER
        ================================================= */}

        {components.map(
          renderComponent
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {simulationState ===
          "success" && (
          <div className="
            absolute
            left-1/2
            bottom-4
            -translate-x-1/2
            z-40
            flex
            items-center
            gap-2
            px-4
            py-1.5
            rounded-xl
            bg-white/95
            border
            border-green-200
            shadow-md
          ">
            <div className="
              text-3xl
              joy-character
            ">
              🤩
            </div>

            <div>
              <div className="
                text-sm
                font-extrabold
                text-green-700
              ">
                Awesome!
              </div>

              <div className="
                text-[10px]
                text-slate-500
              ">
                The LED is glowing.
              </div>
            </div>

            <div className="
              text-lg
              joy-stars
            ">
              ✨
            </div>
          </div>
        )}

        {/* =================================================
            WRONG
        ================================================= */}

        {simulationState ===
          "wrong" && (
          <div className="
            absolute
            left-1/2
            bottom-4
            -translate-x-1/2
            z-40
            flex
            items-center
            gap-2
            px-4
            py-1.5
            rounded-xl
            bg-white/95
            border
            border-red-200
            shadow-md
          ">
            <div className="
              text-3xl
              confused-character
            ">
              😕
            </div>

            <div>
              <div className="
                text-sm
                font-extrabold
                text-red-600
              ">
                Almost there!
              </div>

              <div className="
                text-[10px]
                text-slate-500
              ">
                Check your circuit
                connections.
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ===================================================
          BUTTONS
      =================================================== */}

      <div className="
        shrink-0
        flex
        items-center
        justify-center
        gap-2
      ">

        <button
          type="button"
          onClick={
            simulateCircuit
          }
          className="
            px-4
            py-1.5
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
            py-1.5
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

      {/* ===================================================
          CONNECTION GUIDE
      =================================================== */}

      <div className="
        shrink-0
        text-center
        text-[10px]
        text-slate-400
        font-medium
        pb-1
      ">
        🔋 + → 🔘 IN → 🔘 OUT → 💡 IN → 💡 OUT → 🔋 −
      </div>

    </div>
  );
}

/* =========================================================
   COMPONENT LIBRARY ITEM
========================================================= */

type PaletteItemProps = {
  id: PaletteId;
  emoji: string;
  title: string;

  onDragStart: (
    event: React.DragEvent,
    id: PaletteId
  ) => void;
};

function PaletteItem({
  id,
  emoji,
  title,
  onDragStart,
}: PaletteItemProps) {
  return (
    <div
      draggable={true}
      onDragStart={(event) =>
        onDragStart(event, id)
      }
      className="
        w-[88px]
        h-[58px]

        shrink-0

        rounded-2xl

        border-2
        border-slate-200

        bg-white

        shadow-sm

        flex
        flex-col
        items-center
        justify-center

        select-none

        cursor-grab

        transition-all
        duration-200

        hover:-translate-y-1
        hover:border-blue-300
        hover:shadow-lg

        active:cursor-grabbing
        active:scale-95
      "
    >
      {/* EMOJI */}

      <div
        className="
          text-2xl
          leading-none
          component-float
        "
      >
        {emoji}
      </div>

      {/* NAME */}

      <div
        className="
          mt-1
          text-[9px]
          font-extrabold
          text-slate-600
        "
      >
        {title}
      </div>

      {/* DRAG LABEL */}

      <div
        className="
          text-[7px]
          text-slate-400
          mt-0
        "
      >
        Drag to board
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
  position: PortSide;
};

function PortButton({
  portId,
  label,
  position,
}: PortButtonProps) {
  let positionClass = "";

  if (position === "left") {
    positionClass =
      "left-[-15px] top-1/2 -translate-y-1/2";
  }

  if (position === "right") {
    positionClass =
      "right-[-15px] top-1/2 -translate-y-1/2";
  }

  if (position === "top") {
    positionClass =
      "top-[-15px] left-1/2 -translate-x-1/2";
  }

  if (position === "bottom") {
    positionClass =
      "bottom-[-15px] left-1/2 -translate-x-1/2";
  }

  return (
    <div
      data-port-id={portId}
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

        transition
        hover:scale-110
        hover:bg-blue-600

        cursor-crosshair
      `}
      title={`Connect ${label}`}
    >
      {label}
    </div>
  );
}