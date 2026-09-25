import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import CircuitSimulator from "./CircuitSimulator";
import VoltageCurrentSimulator from "./VoltageCurrentSimulator";
import CircuitBuilder from "./CircuitBuilder";
import HTMLFlipBook from "react-pageflip";

import { Button } from "./components/ui/button";

import {
  CircuitBoard,
  Menu,
  X,
  Code,
  Search,
  BookOpen,
  User,
  Hash,
  School,
  PlayCircle,
  Clock,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";


type ComponentType =
  | "battery"
  | "wire"
  | "switch"
  | "led"
  | "resistor"
  | "diode"
  | "transistor"
  | "capacitor";

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <Router>

      <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">

        <Navbar />

        <Routes>

          <Route path="/" element={<ForumBook />} />

          <Route path="/forum" element={<ForumBook />} />

        </Routes>

      </div>

    </Router>
  );
}


/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {

  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, []);


  const links = [
    {
      name: "Forum",
      path: "/forum",
    },
  ];


  return (

    <header
      className={`
        fixed
        left-0
        right-0
        top-0
        z-50
        px-4
        pt-4
        sm:px-6
        transition-all
        duration-500
        ${scrolled ? "translate-y-0" : "translate-y-2"}
      `}
    >

      <nav
        className="
          mx-auto
          flex
          max-w-6xl
          items-center
          justify-between
          rounded-full
          border
          border-white/60
          bg-white/40
          px-6
          py-4
          shadow-[0_8px_32px_rgba(0,0,0,0.05)]
          backdrop-blur-2xl
          transition-all
        "
      >

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-2"
        >

          <span className="text-xl font-extrabold tracking-tight">

            <span
              className="
                bg-gradient-to-r
                from-[#0ea5e9]
                to-[#2563eb]
                bg-clip-text
                text-transparent
              "
            >
              MEG-Zcuit
            </span>

          </span>

        </Link>


        {/* DESKTOP LINKS */}

        <div className="hidden items-center gap-6 md:flex">

          {links.map((link) => {

            const active =
              location.pathname === link.path;

            return (

              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-sm
                  font-semibold
                  transition-all
                  hover:-translate-y-0.5
                  ${
                    active
                      ? "text-[#1a237e]"
                      : "text-slate-600 hover:text-slate-900"
                  }
                `}
              >
                {link.name}
              </Link>

            );

          })}

        </div>


        {/* DESKTOP RIGHT */}

        <div className="hidden items-center gap-4 md:flex">

          <Code
            className="
              w-5
              h-5
              text-slate-500
              hover:text-blue-600
              cursor-pointer
              transition-colors
            "
          />

          <div className="h-4 w-px bg-slate-300/50" />

          <Link to="/forum">

            <Button
              className="
                bg-[#1a237e]
                hover:bg-[#121858]
                text-white
                rounded-full
                px-6
                shadow-md
                transition-transform
                hover:scale-105
              "
            >
              Read Book
            </Button>

          </Link>

        </div>


        {/* MOBILE MENU */}

        <button
          onClick={() =>
            setMobileOpen(!mobileOpen)
          }
          className="text-slate-600 md:hidden"
        >

          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}

        </button>

      </nav>

    </header>

  );
}


/* =========================================================
   FORUM BOOK
========================================================= */

function ForumBook() {

  const [bookOpened, setBookOpened] =
    useState(false);

  const [selectedComponent, setSelectedComponent] =
    useState<ComponentType>("battery");

  /* STUDENT DETAILS */

  const [studentName, setStudentName] =
    useState("");

  const [studentClass, setStudentClass] =
    useState("");

  const [rollNo, setRollNo] =
    useState("");

  const [schoolName, setSchoolName] =
    useState("");


  /* FLIPBOOK */

  const flipBookRef =
    useRef<any>(null);

  const [currentPage, setCurrentPage] =
    useState(0);


  /* =======================================================
     CHECK DETAILS
  ======================================================= */

  const detailsCompleted =
    studentName.trim() !== "" &&
    studentClass.trim() !== "" &&
    rollNo.trim() !== "" &&
    schoolName.trim() !== "";


  /* =======================================================
     ENTER BOOK
  ======================================================= */

  const handleEnterBook = () => {

    if (!detailsCompleted) {
      return;
    }

    setBookOpened(true);

    setTimeout(() => {

      if (flipBookRef.current) {

        const book =
          flipBookRef.current.pageFlip();

        book.flipNext();

      }

    }, 400);

  };


  /* =======================================================
     BOOK PAGES
  ======================================================= */

  const pages = [

    /* 0 - COVER */
    <div key="page-0" className="h-full w-full bg-white" />,

    /* 1 - THE PROBLEM */
    <Page1TheProblem />,

    /* 2 - THE DISCOVERY */
    <Page2TheDiscovery />,

    /* 3 - HOW IT WORKS — KEEP EXISTING PAGE 3 */
    <Page3HowItWorks />,

    /* 4 - VOLTAGE & CURRENT */
    <Page4VoltageAndCurrent />,

    /* 5 - ELECTRONICS INTRODUCTION */
    <Page5ElectronicsInAction />,

    /* 6 - WHAT IS ELECTRONICS? */
    <Page6WhatIsElectronics />,

    /* 7 - WHAT IS A CIRCUIT? */
    <Page7WhatIsCircuit />,

    /* 8 - HOW A CIRCUIT WORKS */
    <Page8HowACircuitWorks />,

    /* 9 - HOW TO FORM A SIMPLE CIRCUIT — 5 STEPS */
    <Page9HowToFormASimpleCircuit />,

    /* 10 - FORM A CIRCUIT — CIRCUIT BUILDER */
    <Page10FormACircuitCircuitBuilder />,

    /* 11 - COMPONENTS */
    <Page11ExploringElectronicComponents
      onSelectComponent={(component) => {
        setSelectedComponent(component);

        setTimeout(() => {
          if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flip(12);
          }
        }, 100);
      }}
    />,

    /* 12 - COMPONENT WORKING */
    <Page12ComponentWorkingMethod
      selectedComponent={selectedComponent}
    />,

    /* 13 - FINAL RECAP */
    <Page13FinalRecap />,

    /* 14 - QUICK QUIZ 1–3 */
    <Page14QuickQuizOne />,

    /* 15 - QUICK QUIZ 4–5 */
    <Page15QuickQuizTwo />,

  ];


  /* =======================================================
     FLIP EVENT
  ======================================================= */

  const handleFlip = (e: any) => {

    setCurrentPage(e.data);

  };


  /* =======================================================
     NEXT
  ======================================================= */

  const nextPage = () => {

    if (!bookOpened) {
      return;
    }

    if (!flipBookRef.current) {
      return;
    }

    const book =
      flipBookRef.current.pageFlip();

    if (
      currentPage <
      pages.length - 1
    ) {

      book.flipNext();

    }

  };


  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previousPage = () => {

    if (!bookOpened) {
      return;
    }

    if (!flipBookRef.current) {
      return;
    }

    const book =
      flipBookRef.current.pageFlip();

    if (currentPage > 1) {

      book.flipPrev();

    }

  };


  return (

    <main
      className="
        min-h-screen
        bg-[#f1f5f9]
        pt-36
        px-6
        pb-20
        flex
        flex-col
        items-center
        relative
        overflow-hidden
      "
    >


      {/* ===================================================
          BOOK AREA
      =================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-6xl
          flex
          flex-col
          items-center
        "
      >


        {/* =================================================
            BOOK CONTROLS
        ================================================= */}

        <div
          className={`
            flex
            items-center
            gap-6
            mb-8
            bg-white/70
            backdrop-blur-xl
            px-8
            py-3
            rounded-full
            border
            border-white/70
            shadow-lg
            transition-all
            duration-300
            ${
              !bookOpened
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }
          `}
        >

          <Button
            variant="outline"
            onClick={previousPage}
            disabled={currentPage <= 1}
            className="
              rounded-full
              border-blue-200
              text-blue-700
              hover:bg-blue-50
              bg-white
            "
          >
            ← Prev
          </Button>


          <div
            className="
              text-sm
              font-bold
              text-slate-500
              min-w-[100px]
              text-center
            "
          >
            Page {currentPage} / {pages.length - 1}
          </div>


          <Button
            onClick={nextPage}
            disabled={
              !bookOpened ||
              currentPage >= pages.length - 1
            }
            className="
              rounded-full
              bg-blue-600
              text-white
              hover:bg-blue-700
            "
          >
            Next →
          </Button>

        </div>


        {/* =================================================
            FLIP BOOK
        ================================================= */}

        <div className="w-full flex justify-center">

          <HTMLFlipBook
            ref={flipBookRef}

            style={{
              margin: "0 auto",
            }}

            width={560}
            height={700}

            size="stretch"

            minWidth={350}
            maxWidth={650}

            minHeight={450}
            maxHeight={750}

            drawShadow={true}

            flippingTime={900}

            usePortrait={false}

            startPage={0}

            startZIndex={0}

            autoSize={true}

            maxShadowOpacity={0.45}

            showCover={true}

            mobileScrollSupport={false}

            swipeDistance={0}

            clickEventForward={false}

            useMouseEvents={false}

            showPageCorners={false}

            disableFlipByClick={true}

            onFlip={handleFlip}

            className="real-book"
          >

            {pages.map(
              (page, index) => (

                <div
                  key={index}
                  className="
                    bg-white
                    h-full
                    w-full
                    overflow-hidden
                  "
                >
                  {page}
                </div>

              )
            )}

          </HTMLFlipBook>

        </div>

      </div>


      {/* ===================================================
          STUDENT ENTRY SCREEN
          IMPORTANT:
          Navbar will stay visible
      =================================================== */}

      {!bookOpened && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-[#f1f5f9]
            overflow-hidden
          "
        >

          {/* =================================================
              BACKGROUND ANIMATION
          ================================================= */}

          <div
            className="
              absolute
              inset-0
              pointer-events-none
              overflow-hidden
            "
          >

            {/* BLUE GLOW */}

            <div
              className="
                absolute
                w-[550px]
                h-[550px]
                rounded-full
                bg-blue-300/20
                blur-[120px]
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                entry-glow
              "
            />


            {/* CYAN GLOW */}

            <div
              className="
                absolute
                w-[280px]
                h-[280px]
                rounded-full
                bg-cyan-300/20
                blur-[90px]
                top-[10%]
                left-[8%]
                entry-float
              "
            />


            {/* PURPLE GLOW */}

            <div
              className="
                absolute
                w-[300px]
                h-[300px]
                rounded-full
                bg-indigo-300/20
                blur-[100px]
                bottom-[5%]
                right-[8%]
                entry-float-delay
              "
            />


            {/* GRID */}

            <div
              className="
                absolute
                inset-0
                opacity-40
              "
              style={{
                backgroundImage: `
                  linear-gradient(
                    rgba(59,130,246,0.08) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    90deg,
                    rgba(59,130,246,0.08) 1px,
                    transparent 1px
                  )
                `,
                backgroundSize: "40px 40px",
              }}
            />


            {/* ORBIT 1 */}

            <div
              className="
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[500px]
                h-[500px]
                rounded-full
                border
                border-blue-300/20
                entry-orbit
              "
            />


            {/* ORBIT 2 */}

            <div
              className="
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[360px]
                h-[360px]
                rounded-full
                border
                border-cyan-300/20
                entry-orbit-reverse
              "
            />


            {/* FLOATING SYMBOLS */}

            <div
              className="
                absolute
                top-[22%]
                left-[18%]
                text-blue-400/40
                text-3xl
                font-bold
                entry-float
              "
            >
              ⚡
            </div>


            <div
              className="
                absolute
                top-[28%]
                right-[18%]
                text-indigo-400/40
                text-3xl
                font-bold
                entry-float-delay
              "
            >
              e⁻
            </div>


            <div
              className="
                absolute
                bottom-[24%]
                left-[20%]
                text-cyan-400/40
                text-3xl
                font-bold
                entry-float-slow
              "
            >
              +
            </div>


            <div
              className="
                absolute
                bottom-[22%]
                right-[20%]
                text-blue-400/40
                text-3xl
                font-bold
                entry-float
              "
            >
              −
            </div>


            {/* SMALL PARTICLES */}

            <div className="entry-particle absolute top-[30%] left-[30%]" />

            <div className="entry-particle-delay absolute top-[35%] right-[30%]" />

            <div className="entry-particle absolute bottom-[30%] left-[35%]" />

            <div className="entry-particle-delay absolute bottom-[32%] right-[35%]" />

          </div>


          {/* =================================================
              TOP NAVBAR
              SAME STYLE AS YOUR SCREENSHOT
          ================================================= */}

          <div
            className="
              absolute
              top-5
              left-1/2
              -translate-x-1/2
              w-[calc(100%-48px)]
              max-w-[1150px]
              h-[72px]
              rounded-full
              bg-white/80
              backdrop-blur-xl
              border
              border-white
              shadow-[0_10px_35px_rgba(15,23,42,0.08)]
              flex
              items-center
              px-7
              z-50
            "
          >

            {/* LOGO */}

            <div
              className="
                text-xl
                font-extrabold
                text-blue-600
              "
            >
              MEG-Zcuit
            </div>


            {/* CENTER */}

            <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                text-sm
                font-semibold
                text-slate-600
              "
            >
              Forum
            </div>


            {/* RIGHT */}

            <div
              className="
                ml-auto
                flex
                items-center
                gap-4
              "
            >

              {/* SVG / CODE ICON */}

              <div
                className="
                  text-slate-500
                  text-lg
                  font-bold
                "
              >
                &lt; &gt;
              </div>


              {/* READ BOOK */}

              <div
                className="
                  h-10
                  min-w-[125px]
                  px-5
                  rounded-lg
                  bg-white
                  shadow-md
                  flex
                  items-center
                  justify-center
                  text-sm
                  font-bold
                  text-slate-500
                "
              >
                Read Book
              </div>

            </div>

          </div>


          {/* =================================================
              CENTER STUDENT FORM
          ================================================= */}

          <div
            className="
              relative
              z-40
              h-full
              flex
              items-center
              justify-center
              px-4
              pt-20
            "
          >

            <div
              className="
                w-[380px]
                max-w-full
                rounded-3xl
                bg-white
                border
                border-white
                p-7
                shadow-[0_25px_70px_rgba(15,23,42,0.18)]
              "
            >

              {/* TITLE */}

              <div
                className="
                  text-center
                  mb-5
                "
              >

                <div
                  className="
                    mx-auto
                    mb-3
                    w-12
                    h-12
                    rounded-2xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                    text-2xl
                    entry-icon
                  "
                >
                  ⚡
                </div>


                <h1
                  className="
                    text-2xl
                    font-extrabold
                    text-slate-900
                  "
                >
                  Basics of Electricity
                  <br />
                  & Electronics
                </h1>


                <p
                  className="
                    text-slate-500
                    mt-2
                    font-bold
                    uppercase
                    tracking-widest
                    text-[10px]
                  "
                >
                  Interactive Workbook
                </p>

              </div>


              {/* STUDENT DETAILS */}

              <div
                className="
                  space-y-4
                  bg-slate-50
                  p-5
                  rounded-2xl
                  border
                  border-slate-200
                "
              >

                {/* NAME */}

                <div
                  className="
                    flex
                    items-end
                    gap-3
                    border-b
                    border-slate-300
                    pb-2
                  "
                >

                  <User
                    className="
                      w-4
                      h-4
                      text-slate-400
                      mb-1
                      shrink-0
                    "
                  />

                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) =>
                      setStudentName(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {

                      if (
                        e.key === "Enter" &&
                        detailsCompleted
                      ) {
                        handleEnterBook();
                      }

                    }}
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-slate-800
                      font-semibold
                      text-sm
                      placeholder:text-slate-300
                    "
                    placeholder="Name"
                  />

                </div>


                {/* CLASS + ROLL */}

                <div
                  className="
                    flex
                    gap-4
                  "
                >

                  {/* CLASS */}

                  <div
                    className="
                      flex
                      items-end
                      gap-2
                      border-b
                      border-slate-300
                      pb-2
                      w-1/2
                    "
                  >

                    <BookOpen
                      className="
                        w-4
                        h-4
                        text-slate-400
                        mb-1
                        shrink-0
                      "
                    />

                    <input
                      type="text"
                      value={studentClass}
                      onChange={(e) =>
                        setStudentClass(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        text-slate-800
                        font-semibold
                        text-sm
                        placeholder:text-slate-300
                      "
                      placeholder="Class"
                    />

                  </div>


                  {/* ROLL */}

                  <div
                    className="
                      flex
                      items-end
                      gap-2
                      border-b
                      border-slate-300
                      pb-2
                      w-1/2
                    "
                  >

                    <Hash
                      className="
                        w-4
                        h-4
                        text-slate-400
                        mb-1
                        shrink-0
                      "
                    />

                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) =>
                        setRollNo(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        text-slate-800
                        font-semibold
                        text-sm
                        placeholder:text-slate-300
                      "
                      placeholder="Roll No."
                    />

                  </div>

                </div>


                {/* SCHOOL */}

                <div
                  className="
                    flex
                    items-end
                    gap-3
                    border-b
                    border-slate-300
                    pb-2
                  "
                >

                  <School
                    className="
                      w-4
                      h-4
                      text-slate-400
                      mb-1
                      shrink-0
                    "
                  />

                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) =>
                      setSchoolName(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-slate-800
                      font-semibold
                      text-sm
                      placeholder:text-slate-300
                    "
                    placeholder="School Name"
                  />

                </div>

              </div>


              {/* ENTER BUTTON */}

              <button
                onClick={handleEnterBook}
                disabled={!detailsCompleted}
                className={`
                  mt-5
                  w-full
                  py-3
                  rounded-xl
                  font-extrabold
                  text-sm
                  transition-all
                  duration-300
                  ${
                    detailsCompleted
                      ? `
                        bg-[#1a237e]
                        text-white
                        hover:bg-[#121858]
                        hover:-translate-y-1
                        hover:shadow-xl
                        cursor-pointer
                      `
                      : `
                        bg-slate-200
                        text-slate-400
                        cursor-not-allowed
                      `
                  }
                `}
              >
                Enter Book →
              </button>


              {/* BRAND */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[#1a237e]
                "
              >

                <CircuitBoard
                  className="w-5 h-5"
                />

                <span
                  className="
                    font-extrabold
                    tracking-widest
                    text-xs
                    uppercase
                  "
                >
                  MEG-Zcuit
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              ANIMATION CSS
          ================================================= */}

          <style>{`

            @keyframes entryFloat {

              0%,
              100% {
                transform:
                  translateY(0px)
                  rotate(0deg);
              }

              50% {
                transform:
                  translateY(-18px)
                  rotate(5deg);
              }

            }


            @keyframes entryFloatSlow {

              0%,
              100% {
                transform:
                  translateY(0px);
              }

              50% {
                transform:
                  translateY(-25px);
              }

            }


            @keyframes entryGlow {

              0%,
              100% {
                opacity: 0.45;
                transform:
                  translate(-50%, -50%)
                  scale(1);
              }

              50% {
                opacity: 0.8;
                transform:
                  translate(-50%, -50%)
                  scale(1.12);
              }

            }


            @keyframes entryOrbit {

              from {
                transform:
                  translate(-50%, -50%)
                  rotate(0deg);
              }

              to {
                transform:
                  translate(-50%, -50%)
                  rotate(360deg);
              }

            }


            @keyframes entryOrbitReverse {

              from {
                transform:
                  translate(-50%, -50%)
                  rotate(360deg);
              }

              to {
                transform:
                  translate(-50%, -50%)
                  rotate(0deg);
              }

            }


            @keyframes entryParticle {

              0%,
              100% {
                opacity: 0.2;
                transform: scale(1);
              }

              50% {
                opacity: 1;
                transform: scale(1.8);
              }

            }


            @keyframes entryIcon {

              0%,
              100% {
                transform: translateY(0px);
              }

              50% {
                transform: translateY(-5px);
              }

            }


            .entry-float {
              animation:
                entryFloat
                4s
                ease-in-out
                infinite;
            }


            .entry-float-delay {
              animation:
                entryFloat
                5s
                ease-in-out
                infinite
                1s;
            }


            .entry-float-slow {
              animation:
                entryFloatSlow
                6s
                ease-in-out
                infinite;
            }


            .entry-glow {
              animation:
                entryGlow
                5s
                ease-in-out
                infinite;
            }


            .entry-orbit {
              animation:
                entryOrbit
                20s
                linear
                infinite;
            }


            .entry-orbit-reverse {
              animation:
                entryOrbitReverse
                14s
                linear
                infinite;
            }


            .entry-particle,
            .entry-particle-delay {
              width: 6px;
              height: 6px;
              border-radius: 999px;
              background: #60a5fa;
              box-shadow:
                0 0 18px
                rgba(59,130,246,0.7);
              animation:
                entryParticle
                2s
                ease-in-out
                infinite;
            }


            .entry-particle-delay {
              animation-delay: 0.8s;
            }


            .entry-icon {
              animation:
                entryIcon
                2s
                ease-in-out
                infinite;
            }

          `}</style>

        </div>

      )}

    </main>

  );
}

/* =========================================================
   PAGE 1
========================================================= */

function Page1TheProblem() {

  return (

    <div
      className="
        h-full
        flex
        flex-col
        p-10
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          mb-6
        "
      >

        <div
          className="
            w-8
            h-8
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            font-bold
          "
        >
          1
        </div>

        <h2
          className="
            text-3xl
            font-extrabold
            text-slate-900
          "
        >
          The Problem
        </h2>

      </div>


      <p
        className="
          text-slate-600
          mb-6
          font-medium
          leading-relaxed
          text-lg
        "
      >
        Watch Riya's story to see what happens when her bicycle torch goes out in the dark!
      </p>


      <div
        className="
          flex-1
          rounded-2xl
          border-4
          border-dashed
          border-slate-300
          bg-white
          flex
          flex-col
          items-center
          justify-center
          text-slate-400
          gap-4
          shadow-inner
          relative
          overflow-hidden
        "
      >

        <PlayCircle
          className="
            w-16
            h-16
            opacity-50
          "
        />

        <p
          className="
            font-bold
            text-sm
            uppercase
            tracking-widest
            text-center
            px-8
          "
        >
          [ Full Story Animation
          <br />
          Video Placeholder ]
        </p>

      </div>

    </div>

  );
}


/* =========================================================
   PAGE 2
========================================================= */

function Page2TheDiscovery() {

  const [
    selectedSearch,
    setSelectedSearch,
  ] = useState<
    "electricity" |
    "how-it-works" |
    null
  >(null);


  const [
    searching,
    setSearching,
  ] = useState(false);


  const handleSearchClick = (
    search:
      | "electricity"
      | "how-it-works"
  ) => {

    setSearching(true);

    setSelectedSearch(null);

    setTimeout(() => {

      setSearching(false);

      setSelectedSearch(search);

    }, 800);

  };


  const handleReset = () => {

    setSelectedSearch(null);

    setSearching(false);

  };


  return (

    <div
      className="
        h-full
        flex
        flex-col
        p-8
        bg-white
        overflow-hidden
      "
    >


      {/* PAGE TITLE */}

      <div
        className="
          flex
          items-center
          gap-3
          mb-4
          shrink-0
        "
      >

        <div
          className="
            w-8
            h-8
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            font-bold
          "
        >
          2
        </div>

        <h2
          className="
            text-3xl
            font-extrabold
            text-slate-900
          "
        >
          The Discovery
        </h2>

      </div>


      {/* BROWSER FRAME */}

      <div
        className="
          flex-1
          min-h-0
          border
          border-slate-200
          rounded-2xl
          overflow-hidden
          shadow-sm
          flex
          flex-col
          bg-slate-50
        "
      >


        {/* TOP BAR */}

        <div
          className="
            bg-slate-200
            px-4
            py-2
            flex
            items-center
            gap-2
            shrink-0
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <div className="w-3 h-3 rounded-full bg-red-400" />

            <div className="w-3 h-3 rounded-full bg-yellow-400" />

            <div className="w-3 h-3 rounded-full bg-green-400" />

          </div>


          <div
            className="
              ml-4
              px-4
              py-1
              rounded-md
              bg-white
              text-slate-600
              text-xs
              font-bold
            "
          >
            Search
          </div>


          {selectedSearch !== null && (

            <button
              onClick={() =>
                setSelectedSearch(null)
              }
              className="
                ml-auto
                px-4
                py-1
                rounded-md
                bg-white
                text-slate-600
                text-xs
                font-bold
                hover:bg-slate-100
                transition-all
              "
            >
              ← Back
            </button>

          )}

        </div>


        {/* GOOGLE BODY */}

        <div
          className="
            flex-1
            min-h-0
            p-6
            flex
            flex-col
            overflow-hidden
          "
        >


          {/* GOOGLE LOGO */}

          <div
            className="
              flex
              justify-center
              shrink-0
            "
          >

            <h3
              className="
                text-4xl
                font-extrabold
                tracking-tighter
              "
            >

              <span className="text-blue-500">
                G
              </span>

              <span className="text-red-500">
                o
              </span>

              <span className="text-yellow-500">
                o
              </span>

              <span className="text-blue-500">
                g
              </span>

              <span className="text-green-500">
                l
              </span>

              <span className="text-red-500">
                e
              </span>

            </h3>

          </div>


          {/* SEARCH BAR */}

          <div
            className={`
              w-full
              mt-5
              bg-white
              border
              border-slate-300
              rounded-full
              px-4
              py-3
              flex
              items-center
              gap-3
              shadow-sm
              shrink-0
              ${
                searching ||
                selectedSearch
                  ? "ring-2 ring-blue-100"
                  : ""
              }
            `}
          >

            <Search
              className="
                w-5
                h-5
                text-slate-400
                shrink-0
              "
            />

            <div
              className="
                flex-1
                font-medium
                text-slate-700
              "
            >

              {selectedSearch ===
                "electricity" &&
                "What is electricity?"}


              {selectedSearch ===
                "how-it-works" &&
                "How does it work?"}


              {!selectedSearch &&
                !searching && (

                  <span
                    className="
                      text-slate-400
                    "
                  >
                    Search Google or type a URL
                  </span>

                )}


              {searching && (

                <span
                  className="
                    text-slate-400
                  "
                >
                  Searching...
                </span>

              )}

            </div>

          </div>


          {/* CONTENT */}

          <div
            className="
              flex-1
              min-h-0
              mt-5
              overflow-y-auto
            "
          >


            {/* RECENT SEARCHES */}

            {!searching &&
              !selectedSearch && (

                <div className="w-full">

                  <p
                    className="
                      text-xs
                      font-bold
                      text-slate-400
                      uppercase
                      tracking-widest
                      mb-3
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <Clock
                      className="
                        w-4
                        h-4
                      "
                    />

                    Recent Searches

                  </p>


                  {/* SEARCH 1 */}

                  <button
                    onClick={() =>
                      handleSearchClick(
                        "electricity"
                      )
                    }
                    className="
                      w-full
                      text-left
                      p-4
                      mb-3
                      bg-white
                      border
                      border-slate-200
                      rounded-xl
                      shadow-sm
                      hover:border-blue-400
                      hover:bg-blue-50
                      transition-colors
                      flex
                      items-center
                      gap-3
                      group
                    "
                  >

                    <Search
                      className="
                        w-5
                        h-5
                        text-slate-400
                        group-hover:text-blue-500
                        shrink-0
                      "
                    />

                    <span
                      className="
                        font-semibold
                        text-slate-700
                        group-hover:text-blue-700
                      "
                    >
                      What is electricity?
                    </span>

                  </button>


                  {/* SEARCH 2 */}

                  <button
                    onClick={() =>
                      handleSearchClick(
                        "how-it-works"
                      )
                    }
                    className="
                      w-full
                      text-left
                      p-4
                      bg-white
                      border
                      border-slate-200
                      rounded-xl
                      shadow-sm
                      hover:border-blue-400
                      hover:bg-blue-50
                      transition-colors
                      flex
                      items-center
                      gap-3
                      group
                    "
                  >

                    <Search
                      className="
                        w-5
                        h-5
                        text-slate-400
                        group-hover:text-blue-500
                        shrink-0
                      "
                    />

                    <span
                      className="
                        font-semibold
                        text-slate-700
                        group-hover:text-blue-700
                      "
                    >
                      How does it work?
                    </span>

                  </button>

                </div>

              )}


            {/* SEARCHING */}

            {searching && (

              <div
                className="
                  h-full
                  flex
                  items-center
                  justify-center
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    border-4
                    border-blue-100
                    border-t-blue-600
                    rounded-full
                    animate-spin
                  "
                />

              </div>

            )}


            {/* ELECTRICITY ANSWER */}

            {!searching &&
              selectedSearch ===
                "electricity" && (

                <div
                  className="
                    w-full
                    space-y-4
                  "
                >

                  <div
                    className="
                      bg-white
                      p-5
                      rounded-xl
                      border
                      border-slate-200
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        text-sm
                        text-blue-600
                        font-bold
                        mb-1
                      "
                    >
                      What is Electricity?
                    </div>

                    <div
                      className="
                        text-lg
                        font-bold
                        text-slate-800
                      "
                    >
                      Electricity
                    </div>

                    <p
                      className="
                        text-slate-600
                        mt-2
                        leading-relaxed
                        font-medium
                      "
                    >
                      Electricity is a form of
                      energy caused by the movement
                      of electric charges.
                    </p>

                  </div>


                  <div
                    className="
                      bg-white
                      p-5
                      rounded-xl
                      border
                      border-slate-200
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        text-sm
                        text-blue-600
                        font-bold
                        mb-1
                      "
                    >
                      Simple Explanation
                    </div>

                    <p
                      className="
                        text-slate-600
                        mt-2
                        leading-relaxed
                        font-medium
                      "
                    >
                      Electricity flows through a
                      circuit and helps devices like
                      LEDs, bulbs, and motors work.
                    </p>

                  </div>

                </div>

              )}


            {/* HOW IT WORKS */}

            {!searching &&
              selectedSearch ===
                "how-it-works" && (

                <div
                  className="
                    w-full
                    space-y-4
                  "
                >

                  <div
                    className="
                      bg-white
                      p-5
                      rounded-xl
                      border
                      border-slate-200
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        text-sm
                        text-blue-600
                        font-bold
                        mb-1
                      "
                    >
                      How It Works
                    </div>

                    <div
                      className="
                        text-lg
                        font-bold
                        text-slate-800
                      "
                    >
                      Electricity flows through a circuit
                    </div>

                    <p
                      className="
                        text-slate-600
                        mt-2
                        leading-relaxed
                        font-medium
                      "
                    >
                      Electricity flows through a
                      complete path called a circuit.
                    </p>

                  </div>


                  <div
                    className="
                      bg-white
                      p-5
                      rounded-xl
                      border
                      border-slate-200
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        text-sm
                        text-blue-600
                        font-bold
                        mb-1
                      "
                    >
                      Circuit
                    </div>

                    <div
                      className="
                        text-lg
                        font-bold
                        text-slate-800
                      "
                    >
                      Closed Path
                    </div>

                    <p
                      className="
                        text-slate-600
                        mt-2
                        leading-relaxed
                        font-medium
                      "
                    >
                      A closed circuit gives electricity
                      a complete path to flow from the
                      power source and back.
                    </p>

                  </div>

                </div>

              )}

          </div>

        </div>

      </div>


      {/* BOTTOM BACK */}

      {selectedSearch &&
        !searching && (

          <Button
            variant="outline"
            className="
              mt-3
              w-full
              rounded-full
              shrink-0
            "
            onClick={handleReset}
          >
            ← Back to Recent Searches
          </Button>

        )}

    </div>

  );
}


/* =========================================================
   PAGE 3
========================================================= */

function Page3HowItWorks() {

  return (

    <div
      className="
        h-full
        overflow-hidden
        flex
        flex-col
        p-8
        bg-slate-50
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          mb-3
          shrink-0
        "
      >

        <div
          className="
            w-8
            h-8
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            font-bold
          "
        >
          3
        </div>

        <h2
          className="
            text-3xl
            font-extrabold
            text-slate-900
          "
        >
          How does it work?
        </h2>

      </div>


      <p
        className="
          text-slate-600
          mb-4
          font-medium
          leading-relaxed
          text-base
          shrink-0
        "
      >
        Build the circuit and observe how electrical energy reaches the LED.
      </p>


      <div
        className="
          flex-1
          min-h-0
          overflow-hidden
        "
      >
        <CircuitSimulator />
      </div>

    </div>

  );
}


/* =========================================================
   PAGE 4
========================================================= */

function Page4VoltageAndCurrent() {

  return (

    <div
      className="
        h-full
        overflow-hidden
        bg-slate-50
        p-8
      "
    >

      <div className="mb-4">

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-blue-600
              text-sm
              font-bold
              text-white
            "
          >
            4
          </div>

          <h2
            className="
              text-3xl
              font-extrabold
              text-slate-900
            "
          >
            Voltage & Current
          </h2>

        </div>


        <p
          className="
            mt-2
            text-sm
            font-medium
            text-slate-600
          "
        >
          Control the voltage and observe how electrical power flows to the bulb.
        </p>

      </div>


      <div
        className="
          h-[calc(100%-85px)]
        "
      >
        <VoltageCurrentSimulator />
      </div>

    </div>

  );
}


/* =========================================================
   PAGE 5
========================================================= */

function Page5ElectronicsInAction() {
  return (
    <div className="h-full flex flex-col p-8 bg-slate-50 overflow-hidden">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">5</div>
        <h2 className="text-3xl font-extrabold text-slate-900">💡 Electronics in Action</h2>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-5">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm text-center">
          <div className="text-6xl mb-4">⚡ 💡 ⚙️</div>
          <h3 className="text-2xl font-extrabold text-slate-800">Electronics starts here!</h3>
          <p className="text-slate-600 font-medium leading-relaxed mt-3 max-w-xl mx-auto">
            Electronics uses electrical components to control and process electrical signals.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-center">
            <div className="text-3xl">📥</div>
            <p className="font-extrabold text-slate-800 mt-2">Input</p>
          </div>
          <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-center">
            <div className="text-3xl">⚙️</div>
            <p className="font-extrabold text-slate-800 mt-2">Control / Process</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center">
            <div className="text-3xl">📤</div>
            <p className="font-extrabold text-slate-800 mt-2">Output</p>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-blue-100 px-5 py-3 text-center text-sm font-bold text-blue-700">
          INPUT → CONTROL / PROCESS → OUTPUT
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   NEW PAGE 6 - WHAT IS ELECTRONICS?
========================================================= */
function Page6WhatIsElectronics() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className="h-full w-full bg-slate-50 p-5 overflow-hidden">
      {/* OUTER FRAME */}
      <div
        className="
          h-full w-full
          rounded-3xl
          border-2 border-blue-200
          bg-white
          shadow-lg
          p-4
          flex flex-col
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 shrink-0 mb-3">
          <div
            className="
              w-8 h-8 rounded-full bg-blue-600
              text-white flex items-center justify-center
              font-bold text-sm shrink-0
            "
          >
            6
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              💡 What is Electronics?
            </h2>

            <p className="text-xs text-slate-500 font-medium">
              Let's understand electronics with simple examples!
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="
            flex-1 min-h-0
            grid grid-rows-[auto_auto_auto_1fr]
            gap-2.5
            overflow-hidden
          "
        >
          {/* WHAT IS ELECTRONICS */}
          <div
            className="
              rounded-2xl
              border border-blue-100
              bg-blue-50
              px-4 py-3
            "
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌟</span>

              <h3 className="text-sm font-extrabold text-slate-900">
                What is Electronics?
              </h3>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Electronics uses electrical components to control electricity
              and make useful devices work.
            </p>
          </div>

          {/* ELECTRONICS AROUND US */}
          <div
            className="
              rounded-2xl
              border border-slate-200
              bg-white
              px-4 py-3
            "
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔍</span>

              <h3 className="text-sm font-extrabold text-slate-900">
                Electronics Around Us
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="h-[58px] rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center">
                <span className="text-2xl">📱</span>
                <span className="text-[10px] font-extrabold text-slate-700">
                  Mobile
                </span>
              </div>

              <div className="h-[58px] rounded-xl bg-yellow-50 border border-yellow-100 flex flex-col items-center justify-center">
                <span className="text-2xl">💡</span>
                <span className="text-[10px] font-extrabold text-slate-700">
                  Smart Light
                </span>
              </div>

              <div className="h-[58px] rounded-xl bg-purple-50 border border-purple-100 flex flex-col items-center justify-center">
                <span className="text-2xl">🎧</span>
                <span className="text-[10px] font-extrabold text-slate-700">
                  Earphones
                </span>
              </div>

              <div className="h-[58px] rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center">
                <span className="text-2xl">🔔</span>
                <span className="text-[10px] font-extrabold text-slate-700">
                  Doorbell
                </span>
              </div>
            </div>
          </div>

          {/* HOW ELECTRONICS WORK */}
          <div
            className="
              rounded-2xl
              border border-indigo-100
              bg-indigo-50
              px-4 py-3
            "
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚙️</span>

              <h3 className="text-sm font-extrabold text-slate-900">
                How Does Electronics Work?
              </h3>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
              <div className="h-[58px] rounded-xl bg-white border border-blue-200 flex flex-col items-center justify-center">
                <span className="text-xl">📥</span>
                <span className="text-[10px] font-extrabold text-blue-700">
                  INPUT
                </span>
                <span className="text-[9px] text-slate-500">
                  Sensor
                </span>
              </div>

              <span className="text-lg font-bold text-blue-500">
                →
              </span>

              <div className="h-[58px] rounded-xl bg-white border border-indigo-200 flex flex-col items-center justify-center">
                <span className="text-xl">⚙️</span>
                <span className="text-[10px] font-extrabold text-indigo-700">
                  PROCESS
                </span>
                <span className="text-[9px] text-slate-500">
                  Circuit
                </span>
              </div>

              <span className="text-lg font-bold text-indigo-500">
                →
              </span>

              <div className="h-[58px] rounded-xl bg-white border border-emerald-200 flex flex-col items-center justify-center">
                <span className="text-xl">📤</span>
                <span className="text-[10px] font-extrabold text-emerald-700">
                  OUTPUT
                </span>
                <span className="text-[9px] text-slate-500">
                  Light
                </span>
              </div>
            </div>
          </div>

          {/* REAL-TIME NIGHT LIGHT SIMULATION */}
          <div
            className={`
              min-h-0
              rounded-2xl
              border-2
              ${
                isDark
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-amber-200 bg-amber-50"
              }
              px-4 py-3
              flex flex-col
              overflow-hidden
              transition-colors duration-300
            `}
          >
            {/* TITLE */}
            <div className="flex items-center justify-between gap-2 shrink-0 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {isDark ? "🌙" : "☀️"}
                </span>

                <h3 className="text-sm font-extrabold text-slate-900">
                  Automatic Night Light
                </h3>
              </div>

              <span
                className={`
                  px-2 py-1 rounded-full
                  text-[9px] font-extrabold
                  ${
                    isDark
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-amber-100 text-amber-700"
                  }
                `}
              >
                REAL-TIME
              </span>
            </div>

            {/* DAY / NIGHT BUTTONS */}
            <div className="flex justify-center gap-2 shrink-0 mb-2">
              <button
                type="button"
                onClick={() => setIsDark(false)}
                className={`
                  px-4 py-1.5
                  rounded-lg
                  text-xs font-extrabold
                  border
                  transition-all
                  ${
                    !isDark
                      ? "bg-amber-400 text-white border-amber-400 shadow-md"
                      : "bg-white text-slate-600 border-slate-200"
                  }
                `}
              >
                ☀️ DAY
              </button>

              <button
                type="button"
                onClick={() => setIsDark(true)}
                className={`
                  px-4 py-1.5
                  rounded-lg
                  text-xs font-extrabold
                  border
                  transition-all
                  ${
                    isDark
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white text-slate-600 border-slate-200"
                  }
                `}
              >
                🌙 NIGHT
              </button>
            </div>

            {/* SIMULATION FLOW */}
            <div
              className="
                flex-1 min-h-0
                flex items-center justify-center
              "
            >
              <div className="w-full grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">

                {/* ENVIRONMENT */}
                <div
                  className={`
                    h-[70px]
                    rounded-xl
                    border
                    bg-white
                    flex flex-col
                    items-center justify-center
                    transition-all duration-300
                    ${
                      isDark
                        ? "border-indigo-300 shadow-md"
                        : "border-amber-200"
                    }
                  `}
                >
                  <span className="text-2xl">
                    {isDark ? "🌙" : "☀️"}
                  </span>

                  <span className="text-[10px] font-extrabold text-slate-700">
                    {isDark ? "DARK" : "BRIGHT"}
                  </span>
                </div>

                <span
                  className={`
                    text-lg font-bold
                    transition-colors
                    ${
                      isDark
                        ? "text-indigo-500"
                        : "text-slate-300"
                    }
                  `}
                >
                  →
                </span>

                {/* SENSOR */}
                <div
                  className={`
                    h-[70px]
                    rounded-xl
                    border
                    bg-white
                    flex flex-col
                    items-center justify-center
                    transition-all duration-300
                    ${
                      isDark
                        ? "border-indigo-300 shadow-md"
                        : "border-slate-200"
                    }
                  `}
                >
                  <span className="text-2xl">
                    🔍
                  </span>

                  <span className="text-[10px] font-extrabold text-slate-700">
                    SENSOR
                  </span>

                  <span className="text-[9px] text-slate-500">
                    {isDark ? "Dark detected" : "Light detected"}
                  </span>
                </div>

                <span
                  className={`
                    text-lg font-bold
                    transition-colors
                    ${
                      isDark
                        ? "text-indigo-500"
                        : "text-slate-300"
                    }
                  `}
                >
                  →
                </span>

                {/* CIRCUIT + LED */}
                <div
                  className={`
                    h-[70px]
                    rounded-xl
                    border
                    bg-white
                    flex flex-col
                    items-center justify-center
                    transition-all duration-300
                    ${
                      isDark
                        ? "border-yellow-300 shadow-md"
                        : "border-slate-200"
                    }
                  `}
                >
                  <span
                    className={`
                      text-2xl
                      transition-all duration-300
                      ${
                        isDark
                          ? "drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] scale-110"
                          : ""
                      }
                    `}
                  >
                    {isDark ? "💡" : "💡"}
                  </span>

                  <span
                    className={`
                      text-[10px] font-extrabold
                      ${
                        isDark
                          ? "text-yellow-600"
                          : "text-slate-700"
                      }
                    `}
                  >
                    {isDark ? "LED ON" : "LED OFF"}
                  </span>

                  <span className="text-[9px] text-slate-500">
                    {isDark ? "Light is glowing" : "Waiting..."}
                  </span>
                </div>

              </div>
            </div>

            {/* STATUS */}
            <div
              className={`
                shrink-0
                mt-2
                rounded-xl
                px-3 py-2
                text-center
                ${
                  isDark
                    ? "bg-yellow-100 border border-yellow-200"
                    : "bg-white border border-slate-200"
                }
              `}
            >
              <p className="text-[11px] font-bold text-slate-700">
                {isDark
                  ? "🌙 Darkness detected → Circuit turns the LED ON"
                  : "☀️ Enough light detected → LED stays OFF"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   NEW PAGE 7 - WHAT IS A CIRCUIT?
========================================================= */
function Page7WhatIsCircuit() {
  const [isOpen, setIsOpen] = useState(false);
  const [narrate, setNarrate] = useState(true);

  // =========================================================
  // CAR REFS
  // =========================================================

  const carWrapRef = useRef<HTMLDivElement | null>(null);

  const forwardCarRef =
    useRef<HTMLImageElement | null>(null);

  const backwardCarRef =
    useRef<HTMLImageElement | null>(null);

  // requestAnimationFrame reference
  const rafRef =
    useRef<number | null>(null);

  const isOpenRef =
    useRef<boolean>(false);

  // Exact current car position
  const posRef =
    useRef<number>(9);

  // Current movement phase
  const phaseRef =
    useRef<
      "toBulb" |
      "turnAtBulb" |
      "toBattery" |
      "turnAtBattery"
    >("toBulb");

  // Start time of a turn
  const phaseStartRef =
    useRef<number | null>(null);

  // Last animation frame time
  const lastTimeRef =
    useRef<number | null>(null);

  // Used only when paused during a turn
  const pauseStartRef =
    useRef<number | null>(null);

  // false = front faces RIGHT / END
  // true  = front faces LEFT / START
  const carFacingLeftRef =
    useRef<boolean>(false);

  // =========================================================
  // ROAD LIMITS
  // =========================================================

  const LEFT_BOUND = 9;
  const RIGHT_BOUND = 88;

  const ONE_WAY_MS = 4400;
  const TURN_MS = 500;

  const SPEED =
    (RIGHT_BOUND - LEFT_BOUND) /
    ONE_WAY_MS;

  // =========================================================
  // CAR DISPLAY
  // =========================================================

  const setCar = (
    pos: number,
    facingLeft: boolean
  ) => {
    if (!carWrapRef.current) return;

    // Keep exact position
    carWrapRef.current.style.left =
      `${pos}%`;

    carWrapRef.current.style.transform =
      "translateY(-50%)";

    // Remember direction
    carFacingLeftRef.current =
      facingLeft;

    // -------------------------------------------------------
    // Forward image
    // Front faces RIGHT → END
    // -------------------------------------------------------

    if (forwardCarRef.current) {
      forwardCarRef.current.style.display =
        facingLeft
          ? "none"
          : "block";
    }

    // -------------------------------------------------------
    // Mirrored image
    // Front faces LEFT → START
    // -------------------------------------------------------

    if (backwardCarRef.current) {
      backwardCarRef.current.style.display =
        facingLeft
          ? "block"
          : "none";
    }
  };

  // =========================================================
  // KEEP REF IN SYNC
  // =========================================================

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // =========================================================
  // CAR ANIMATION
  // =========================================================

  useEffect(() => {
    function frame(timestamp: number) {
      const previous =
        lastTimeRef.current ??
        timestamp;

      const dt =
        timestamp - previous;

      lastTimeRef.current =
        timestamp;

      // =====================================================
      // OPEN CIRCUIT
      //
      // IMPORTANT:
      // Do NOTHING.
      //
      // Position, direction and phase stay exactly the same.
      // =====================================================

      if (isOpenRef.current) {
        rafRef.current =
          requestAnimationFrame(frame);

        return;
      }

      // =====================================================
      // CLOSED CIRCUIT
      // =====================================================

      const phase =
        phaseRef.current;

      // =====================================================
      // START / BATTERY → END / LED
      // =====================================================

      if (phase === "toBulb") {
        let pos =
          posRef.current +
          SPEED * dt;

        if (
          pos >= RIGHT_BOUND
        ) {
          pos =
            RIGHT_BOUND;

          posRef.current =
            RIGHT_BOUND;

          phaseRef.current =
            "turnAtBulb";

          phaseStartRef.current =
            timestamp;

          // Front faces END
          setCar(
            RIGHT_BOUND,
            false
          );
        } else {
          posRef.current =
            pos;

          // Front faces END
          setCar(
            pos,
            false
          );
        }
      }

      // =====================================================
      // TURN AT END / LED
      // =====================================================

      else if (
        phase === "turnAtBulb"
      ) {
        const start =
          phaseStartRef.current ??
          timestamp;

        const elapsed =
          timestamp - start;

        // Stay at END for the turn duration.
        // NO rotation.
        if (
          elapsed < TURN_MS
        ) {
          setCar(
            RIGHT_BOUND,
            false
          );
        } else {
          // Switch to mirrored car.
          // Front now faces START.
          setCar(
            RIGHT_BOUND,
            true
          );

          phaseRef.current =
            "toBattery";

          phaseStartRef.current =
            null;
        }
      }

      // =====================================================
      // END / LED → START / BATTERY
      // =====================================================

      else if (
        phase === "toBattery"
      ) {
        let pos =
          posRef.current -
          SPEED * dt;

        if (
          pos <= LEFT_BOUND
        ) {
          pos =
            LEFT_BOUND;

          posRef.current =
            LEFT_BOUND;

          phaseRef.current =
            "turnAtBattery";

          phaseStartRef.current =
            timestamp;

          // Front faces START
          setCar(
            LEFT_BOUND,
            true
          );
        } else {
          posRef.current =
            pos;

          // Front faces START
          setCar(
            pos,
            true
          );
        }
      }

      // =====================================================
      // TURN AT START / BATTERY
      // =====================================================

      else if (
        phase === "turnAtBattery"
      ) {
        const start =
          phaseStartRef.current ??
          timestamp;

        const elapsed =
          timestamp - start;

        if (
          elapsed < TURN_MS
        ) {
          // Stay at START
          // Front faces START
          setCar(
            LEFT_BOUND,
            true
          );
        } else {
          // Return to normal image
          // Front faces END
          setCar(
            LEFT_BOUND,
            false
          );

          phaseRef.current =
            "toBulb";

          phaseStartRef.current =
            null;
        }
      }

      rafRef.current =
        requestAnimationFrame(frame);
    }

    rafRef.current =
      requestAnimationFrame(frame);

    return () => {
      if (
        rafRef.current !== null
      ) {
        cancelAnimationFrame(
          rafRef.current
        );

        rafRef.current =
          null;
      }
    };
  }, []);

  // =========================================================
  // VOICE NARRATION
  // =========================================================

  const speak = (
    text: string
  ) => {
    if (!narrate) return;

    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(
      utterance
    );
  };

  const openLine =
    "Open circuit. The switch is open, so the electrical path is broken. Electrons stop at the switch. The wire remains visible, but the path is interrupted. The bridge separates in the middle. The car stops exactly where it is. The L E D turns off.";

  const closeLine =
    "Closed circuit. The switch is closed, so the electrical path is complete. Electrons flow continuously around the loop. The bridge is fully connected. The car continues from the same position in the same direction. The L E D glows steadily.";

  // =========================================================
  // OPEN CIRCUIT
  //
  // IMPORTANT:
  // Do NOT change car position.
  // Do NOT reset phase.
  // Do NOT reset direction.
  // =========================================================

  const handleOpen = () => {
    if (!isOpenRef.current) {
      pauseStartRef.current =
        performance.now();
    }

    isOpenRef.current =
      true;

    setIsOpen(true);

    // Prevent one large dt after resume
    lastTimeRef.current =
      null;

    // Freeze exactly where the car currently is
    setCar(
      posRef.current,
      carFacingLeftRef.current
    );

    speak(openLine);
  };

  // =========================================================
  // CLOSE CIRCUIT
  //
  // Resume from EXACT same position,
  // phase and direction.
  // =========================================================

  const handleClose = () => {
    const now =
      performance.now();

    // If the car was paused during a turn,
    // preserve the remaining turn duration.
    if (
      pauseStartRef.current !== null &&
      phaseStartRef.current !== null
    ) {
      const pausedDuration =
        now -
        pauseStartRef.current;

      phaseStartRef.current +=
        pausedDuration;
    }

    pauseStartRef.current =
      null;

    isOpenRef.current =
      false;

    setIsOpen(false);

    // Prevent one large dt after resume
    lastTimeRef.current =
      null;

    // Restore exact position and direction
    setCar(
      posRef.current,
      carFacingLeftRef.current
    );

    speak(closeLine);
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    isOpenRef.current =
      false;

    setIsOpen(false);

    posRef.current =
      LEFT_BOUND;

    phaseRef.current =
      "toBulb";

    phaseStartRef.current =
      null;

    pauseStartRef.current =
      null;

    lastTimeRef.current =
      null;

    carFacingLeftRef.current =
      false;

    setCar(
      LEFT_BOUND,
      false
    );

    speak(
      "Reset. " +
      closeLine
    );
  };

  // =========================================================
  // VOICE TOGGLE
  // =========================================================

  const toggleNarrate = () => {
    setNarrate((prev) => {
      const next =
        !prev;

      if (
        !next &&
        typeof window !==
          "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }

      return next;
    });
  };

  // =========================================================
  // WIRES
  //
  // IMPORTANT:
  // Switch → LED wire ALWAYS remains visible.
  // =========================================================

  const wireSegments = [
    // Battery → Switch
    "M 92 58 H 275",

    // Switch → LED
    // ALWAYS visible
    "M 325 58 H 460",

    // LED connection
    "M 460 58 H 500",

    "M 500 58 H 508",

    // Right return
    "M 508 58 V 145",

    // Bottom return
    "M 508 145 H 92",

    // Left return
    "M 92 145 V 70",
  ];

  return (
    <div className="h-full w-full bg-slate-50 p-6 flex flex-col overflow-hidden">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex items-center gap-3 mb-3 shrink-0">

        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          7
        </div>

        <div className="flex-1">

          <h2 className="text-2xl font-extrabold text-slate-900">
            🔌 What is a Circuit?
          </h2>

          <p className="text-sm text-slate-500 font-medium mt-1">
            A real electrical circuit compared with a real road and bridge.
          </p>

        </div>

        <button
          type="button"
          onClick={toggleNarrate}
          className={`
            shrink-0
            px-3
            py-2
            rounded-xl
            text-xs
            font-extrabold
            border
            transition-all
            ${
              narrate
                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
            }
          `}
        >
          {narrate
            ? "🔊 Voice On"
            : "🔇 Voice Off"}
        </button>

      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-3">

        {/* ================================================= */}
        {/* ELECTRICAL CIRCUIT */}
        {/* ================================================= */}

        <div
          className="
            relative
            flex-1
            min-h-0
            rounded-2xl
            border
            border-slate-300
            shadow-md
            overflow-hidden
          "
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #ffffff 0%, #f1f5f9 55%, #e2e8f0 100%)",
          }}
        >

          <div className="absolute top-3 left-4 z-20">
            <div className="text-[10px] font-extrabold tracking-widest text-slate-500">
              ELECTRICAL CIRCUIT
            </div>
          </div>

          {/* Circuit status */}

          <div
            className={`
              absolute
              top-3
              right-3
              z-30
              px-3
              py-1.5
              rounded-full
              text-[10px]
              font-extrabold
              border
              shadow-sm
              ${
                isOpen
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
              }
            `}
          >
            {isOpen
              ? "🔴 OPEN CIRCUIT"
              : "🟢 CLOSED CIRCUIT"}
          </div>

          <div className="absolute inset-0 pt-8">

            <svg
              viewBox="0 0 600 190"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >

              <defs>

                {/* Wire highlight */}

                <linearGradient
                  id="p7WireHighlight"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0"
                    stopColor="#cbd5e1"
                  />

                  <stop
                    offset="1"
                    stopColor="#64748b"
                  />
                </linearGradient>

                {/* Metal */}

                <radialGradient
                  id="p7PostMetal"
                  cx="35%"
                  cy="30%"
                  r="70%"
                >
                  <stop
                    offset="0"
                    stopColor="#f1f5f9"
                  />

                  <stop
                    offset="0.5"
                    stopColor="#94a3b8"
                  />

                  <stop
                    offset="1"
                    stopColor="#334155"
                  />
                </radialGradient>

                {/* Switch plate */}

                <linearGradient
                  id="p7PlateMetal"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0"
                    stopColor="#475569"
                  />

                  <stop
                    offset="1"
                    stopColor="#1e293b"
                  />
                </linearGradient>

                {/* Closed lever */}

                <linearGradient
                  id="p7LeverClosed"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0"
                    stopColor="#4ade80"
                  />

                  <stop
                    offset="1"
                    stopColor="#15803d"
                  />
                </linearGradient>

                {/* Open lever */}

                <linearGradient
                  id="p7LeverOpen"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0"
                    stopColor="#fca5a5"
                  />

                  <stop
                    offset="1"
                    stopColor="#b91c1c"
                  />
                </linearGradient>

                {/* LED ON */}

                <radialGradient
                  id="p7LedOn"
                  cx="35%"
                  cy="30%"
                  r="75%"
                >
                  <stop
                    offset="0"
                    stopColor="#fff8d6"
                  />

                  <stop
                    offset="0.45"
                    stopColor="#fde047"
                  />

                  <stop
                    offset="1"
                    stopColor="#ca8a04"
                  />
                </radialGradient>

                {/* LED OFF */}

                <radialGradient
                  id="p7LedOff"
                  cx="35%"
                  cy="30%"
                  r="75%"
                >
                  <stop
                    offset="0"
                    stopColor="#e5e7eb"
                  />

                  <stop
                    offset="1"
                    stopColor="#9ca3af"
                  />
                </radialGradient>

                {/* LED glow */}

                <radialGradient
                  id="p7LedGlow"
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop
                    offset="0"
                    stopColor="#fde047"
                    stopOpacity="0.85"
                  />

                  <stop
                    offset="1"
                    stopColor="#fde047"
                    stopOpacity="0"
                  />
                </radialGradient>

                {/* Electron glow */}

                <radialGradient
                  id="p7ElectronGlow"
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop
                    offset="0"
                    stopColor="#93c5fd"
                    stopOpacity="0.95"
                  />

                  <stop
                    offset="1"
                    stopColor="#93c5fd"
                    stopOpacity="0"
                  />
                </radialGradient>

              </defs>

              {/* ================================================= */}
              {/* WIRES — ALWAYS VISIBLE */}
              {/* ================================================= */}

              {wireSegments.map(
                (d, i) => (
                  <g key={i}>

                    <path
                      d={d}
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="9"
                      strokeLinecap="round"
                      style={{
                        filter:
                          "drop-shadow(0 2px 2px rgba(0,0,0,0.35))",
                      }}
                    />

                    <path
                      d={d}
                      fill="none"
                      stroke="url(#p7WireHighlight)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.55"
                      transform="translate(0,-2)"
                    />

                  </g>
                )
              )}

              {/* ================================================= */}
              {/* SWITCH PLATE */}
              {/* ================================================= */}

              <rect
                x="258"
                y="40"
                width="84"
                height="34"
                rx="6"
                fill="url(#p7PlateMetal)"
                stroke="#0f172a"
                strokeWidth="1"
              />

              <circle
                cx="332"
                cy="47"
                r="3"
                fill={
                  isOpen
                    ? "#ef4444"
                    : "#22c55e"
                }
                style={{
                  filter:
                    isOpen
                      ? "drop-shadow(0 0 3px #ef4444)"
                      : "drop-shadow(0 0 3px #22c55e)",
                }}
              />

              {/* ================================================= */}
              {/* SWITCH CONTACTS */}
              {/* ================================================= */}

              <circle
                cx="275"
                cy="58"
                r="8"
                fill="url(#p7PostMetal)"
                stroke="#1e293b"
                strokeWidth="1"
              />

              <circle
                cx="325"
                cy="58"
                r="8"
                fill="url(#p7PostMetal)"
                stroke="#1e293b"
                strokeWidth="1"
              />

              {/* ================================================= */}
              {/* SWITCH LEVER */}
              {/* ================================================= */}

              <line
                x1="275"
                y1="58"
                x2={
                  isOpen
                    ? "305"
                    : "325"
                }
                y2={
                  isOpen
                    ? "27"
                    : "58"
                }
                stroke={
                  isOpen
                    ? "url(#p7LeverOpen)"
                    : "url(#p7LeverClosed)"
                }
                strokeWidth="6"
                strokeLinecap="round"
              />

              <circle
                cx="275"
                cy="58"
                r="3.5"
                fill="#e2e8f0"
                stroke="#475569"
                strokeWidth="0.75"
              />

              {/* Open gap */}

              {isOpen && (
                <line
                  x1="288"
                  y1="58"
                  x2="307"
                  y2="58"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              )}

              {/* ================================================= */}
              {/* LED */}
              {/* ================================================= */}

              <g>

                {!isOpen && (
                  <circle
                    cx="480"
                    cy="38"
                    r="34"
                    fill="url(#p7LedGlow)"
                  />
                )}

                <rect
                  x="468"
                  y="52"
                  width="24"
                  height="6"
                  rx="2"
                  fill="#475569"
                />

                <line
                  x1="474"
                  y1="58"
                  x2="474"
                  y2="52"
                  stroke="#334155"
                  strokeWidth="2"
                />

                <line
                  x1="486"
                  y1="58"
                  x2="486"
                  y2="52"
                  stroke="#334155"
                  strokeWidth="2"
                />

                <path
                  d="
                    M 462 52
                    C 462 32 468 18 480 18
                    C 492 18 498 32 498 52 Z
                  "
                  fill={
                    isOpen
                      ? "url(#p7LedOff)"
                      : "url(#p7LedOn)"
                  }
                  stroke="#78350f"
                  strokeWidth="1"
                />

                {!isOpen && (
                  <ellipse
                    cx="474"
                    cy="30"
                    rx="4"
                    ry="7"
                    fill="#fff9c4"
                    opacity="0.8"
                  />
                )}

              </g>

              {/* ================================================= */}
              {/* ELECTRONS */}
              {/* ================================================= */}

              {!isOpen ? (
                <>
                  <path
                    id="p7ElectronLoop"
                    d="
                      M 110 58
                      H 508
                      V 145
                      H 92
                      V 58
                      H 110
                    "
                    fill="none"
                    stroke="none"
                  />

                  {[0, 1.1, 2.2].map(
                    (delay, i) => (
                      <g key={i}>

                        <circle
                          r="7"
                          fill="url(#p7ElectronGlow)"
                        >
                          <animateMotion
                            dur="3.4s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          >
                            <mpath href="#p7ElectronLoop" />
                          </animateMotion>
                        </circle>

                        <text
                          fill="#1d4ed8"
                          fontSize="11"
                          fontWeight="800"
                          textAnchor="middle"
                          dy="3"
                        >
                          e⁻

                          <animateMotion
                            dur="3.4s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          >
                            <mpath href="#p7ElectronLoop" />
                          </animateMotion>
                        </text>

                      </g>
                    )
                  )}
                </>
              ) : (
                <g>

                  {/* Electron stopped before switch */}

                  <circle
                    cx="255"
                    cy="58"
                    r="7"
                    fill="url(#p7ElectronGlow)"
                  />

                  <text
                    x="255"
                    y="61"
                    fill="#1d4ed8"
                    fontSize="11"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    e⁻
                  </text>

                </g>
              )}

              {/* ================================================= */}
              {/* CIRCUIT MESSAGE */}
              {/* ================================================= */}

              {!isOpen && (
                <text
                  x="290"
                  y="112"
                  textAnchor="middle"
                  fill="#1d4ed8"
                  fontSize="12"
                  fontWeight="800"
                >
                  ⚡ CURRENT FLOWS CONTINUOUSLY AROUND THE LOOP
                </text>
              )}

              {isOpen && (
                <text
                  x="290"
                  y="112"
                  textAnchor="middle"
                  fill="#dc2626"
                  fontSize="12"
                  fontWeight="800"
                >
                  ⛔ SWITCH OPEN — CURRENT STOPS
                </text>
              )}

            </svg>

            {/* ================================================= */}
            {/* BATTERY */}
            {/* ================================================= */}

            <div className="absolute left-[8%] top-[32%] -translate-x-1/2 flex flex-col items-center">

              <div
                className="relative flex items-center"
                style={{
                  filter:
                    "drop-shadow(0 3px 3px rgba(0,0,0,0.3))",
                }}
              >

                <div
                  className="h-4 w-2 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(to bottom, #4b5563, #1f2937)",
                  }}
                />

                <div
                  className="
                    h-9
                    w-16
                    rounded-md
                    relative
                    overflow-hidden
                    border
                    border-slate-700
                  "
                  style={{
                    background:
                      "linear-gradient(to bottom, #f8fafc 0%, #94a3b8 25%, #475569 55%, #334155 100%)",
                  }}
                >

                  <div className="absolute inset-x-0 top-1 h-1.5 bg-white/40 rounded-full mx-2" />

                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-800">
                    −
                  </span>

                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-amber-100">
                    +
                  </span>

                </div>

                <div
                  className="h-3 w-2.5 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(to bottom, #fcd34d, #b45309)",
                  }}
                />

              </div>

              <div className="mt-1.5 rounded-lg bg-white/80 border border-slate-300 px-2 py-0.5 text-[9px] font-extrabold text-slate-600 shadow-sm">
                BATTERY
              </div>

            </div>

            {/* ================================================= */}
            {/* SWITCH LABEL */}
            {/* ================================================= */}

            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 text-center">

              <div
                className={`
                  rounded-md
                  px-2
                  py-1
                  text-[9px]
                  font-extrabold
                  border
                  shadow-sm
                  ${
                    isOpen
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-emerald-50 text-emerald-600 border-emerald-200"
                  }
                `}
              >
                SWITCH{" "}
                {isOpen
                  ? "OPEN"
                  : "CLOSED"}
              </div>

            </div>

            {/* ================================================= */}
            {/* LED LABEL */}
            {/* ================================================= */}

            <div className="absolute right-[9%] top-[46%] translate-x-1/2 text-center">

              <div
                className={`
                  rounded-md
                  px-2
                  py-1
                  text-[9px]
                  font-extrabold
                  border
                  shadow-sm
                  ${
                    isOpen
                      ? "bg-slate-100 text-slate-500 border-slate-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }
                `}
              >
                LED{" "}
                {isOpen
                  ? "OFF"
                  : "ON"}
              </div>

            </div>

          </div>
        </div>

        {/* ================================================= */}
        {/* ROAD + BRIDGE */}
        {/* ================================================= */}

        <div
          className="
            relative
            h-[190px]
            shrink-0
            rounded-2xl
            border
            border-slate-300
            shadow-md
            overflow-hidden
          "
          style={{
            background:
              "linear-gradient(to bottom, #e2e8f0, #cbd5e1)",
          }}
        >

          <div className="absolute top-3 left-4 z-20">

            <div className="text-[10px] font-extrabold tracking-widest text-slate-500">
              ROAD + BRIDGE ANALOGY
            </div>

          </div>

          {/* ================================================= */}
          {/* START */}
          {/* ================================================= */}

          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center">

            <div
              className="
                rounded-sm
                px-3
                py-1.5
                text-center
                border-2
                border-white
                shadow-md
              "
              style={{
                background:
                  "linear-gradient(to bottom, #16a34a, #14532d)",
              }}
            >

              <div className="text-[9px] font-black text-white tracking-wider">
                START
              </div>

            </div>

            <div className="w-1 h-3 bg-slate-500" />

          </div>

          {/* ================================================= */}
          {/* END */}
          {/* ================================================= */}

          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center">

            <div
              className="
                rounded-sm
                px-3
                py-1.5
                text-center
                border-2
                border-white
                shadow-md
              "
              style={{
                background:
                  "linear-gradient(to bottom, #2563eb, #1e3a8a)",
              }}
            >

              <div className="text-[9px] font-black text-white tracking-wider">
                END
              </div>

            </div>

            <div className="w-1 h-3 bg-slate-500" />

          </div>

          {/* ================================================= */}
          {/* ROAD */}
          {/* ================================================= */}

          <div
            className="
              absolute
              left-[9%]
              right-[9%]
              top-1/2
              -translate-y-1/2
              h-[70px]
              rounded-md
              overflow-hidden
              border-y-2
              border-slate-600
              shadow-inner
            "
            style={{
              background:
                "linear-gradient(to bottom, #4b5563 0%, #374151 45%, #1f2937 100%)",
            }}
          >

            {/* Road line */}

            <div
              className="
                absolute
                left-0
                right-0
                top-1/2
                -translate-y-1/2
                h-[3px]
              "
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, #fde68a 0px, #fde68a 20px, transparent 20px 40px)",
                boxShadow:
                  "0 0 3px rgba(253,230,138,0.6)",
              }}
            />

            {/* ================================================= */}
            {/* CONNECTED BRIDGE */}
            {/* ================================================= */}

            {!isOpen && (
              <div
                className="
                  absolute
                  left-[40%]
                  right-[40%]
                  top-0
                  bottom-0
                  z-20
                  border-x-2
                  border-slate-400
                "
                style={{
                  background:
                    "linear-gradient(to bottom, #e2e8f0 0%, #94a3b8 45%, #64748b 100%)",
                }}
              >

                <div
                  className="
                    absolute
                    top-0
                    left-0
                    right-0
                    h-1.5
                  "
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to right, #334155 0 3px, transparent 3px 12px)",
                  }}
                />

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-1.5
                  "
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to right, #334155 0 3px, transparent 3px 12px)",
                  }}
                />

                <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-[2px] bg-slate-400/70" />

              </div>
            )}

            {/* ================================================= */}
            {/* BROKEN BRIDGE */}
            {/* ================================================= */}

            {isOpen && (
              <>

                {/* Left bridge half */}

                <div
                  className="
                    absolute
                    left-[33%]
                    top-0
                    bottom-0
                    w-[9%]
                    z-20
                  "
                  style={{
                    background:
                      "linear-gradient(to bottom, #e2e8f0 0%, #94a3b8 45%, #64748b 100%)",
                  }}
                >

                  <div
                    className="
                      absolute
                      top-0
                      left-0
                      right-0
                      h-1.5
                    "
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, #334155 0 3px, transparent 3px 12px)",
                    }}
                  />

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      h-1.5
                    "
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, #334155 0 3px, transparent 3px 12px)",
                    }}
                  />

                  <div
                    className="
                      absolute
                      right-0
                      top-0
                      bottom-0
                      w-1.5
                    "
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, #facc15 0 5px, #1f2937 5px 10px)",
                    }}
                  />

                </div>

                {/* Right bridge half */}

                <div
                  className="
                    absolute
                    right-[33%]
                    top-0
                    bottom-0
                    w-[9%]
                    z-20
                  "
                  style={{
                    background:
                      "linear-gradient(to bottom, #e2e8f0 0%, #94a3b8 45%, #64748b 100%)",
                  }}
                >

                  <div
                    className="
                      absolute
                      top-0
                      left-0
                      right-0
                      h-1.5
                    "
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, #334155 0 3px, transparent 3px 12px)",
                    }}
                  />

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      h-1.5
                    "
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, #334155 0 3px, transparent 3px 12px)",
                    }}
                  />

                  <div
                    className="
                      absolute
                      left-0
                      top-0
                      bottom-0
                      w-1.5
                    "
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, #facc15 0 5px, #1f2937 5px 10px)",
                    }}
                  />

                </div>

                {/* Warning */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    z-30
                  "
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft:
                      "13px solid transparent",
                    borderRight:
                      "13px solid transparent",
                    borderBottom:
                      "22px solid #facc15",
                    filter:
                      "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                  }}
                >

                  <span
                    className="
                      absolute
                      font-black
                      text-slate-900
                    "
                    style={{
                      top: "9px",
                      left: "-3px",
                      fontSize: "11px",
                    }}
                  >
                    !
                  </span>

                </div>

              </>
            )}

            {/* ================================================= */}
            {/* CAR */}
            {/* ================================================= */}

            <div
              ref={carWrapRef}
              className="
                absolute
                top-1/2
                z-40
              "
              style={{
                left:
                  `${LEFT_BOUND}%`,
                transform:
                  "translateY(-50%)",
                width: "52px",
                height: "40px",
              }}
            >

              {/* ================================================= */}
              {/* FORWARD CAR
                  START → END
                  FRONT = RIGHT
              ================================================= */}

              <img
                ref={forwardCarRef}
                src="/images/car.png"
                alt="Car moving from start to end"
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-contain
                "
                style={{
                  display: "block",
                }}
              />

              {/* ================================================= */}
              {/* MIRRORED CAR
                  END → START
                  FRONT = LEFT
              ================================================= */}

              <img
                ref={backwardCarRef}
                src="/images/car.png"
                alt="Car returning from end to start"
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-contain
                "
                style={{
                  display: "none",
                  transform:
                    "scaleX(-1)",
                  transformOrigin:
                    "center",
                }}
              />

            </div>

          </div>

          {/* ================================================= */}
          {/* ROAD STATUS */}
          {/* ================================================= */}

          <div
            className={`
              absolute
              bottom-3
              left-1/2
              -translate-x-1/2
              px-4
              py-1.5
              rounded-full
              text-[10px]
              font-extrabold
              border
              shadow-sm
              ${
                isOpen
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
              }
            `}
          >
            {isOpen
              ? "⛔ BRIDGE BROKEN → CAR FROZEN AT CURRENT POSITION"
              : "⚡ BRIDGE CONNECTED → CAR MOVES CONTINUOUSLY"}
          </div>

        </div>

        {/* ================================================= */}
        {/* BUTTONS */}
        {/* ================================================= */}

        <div className="shrink-0 flex justify-center items-center gap-3">

          <button
            type="button"
            onClick={handleOpen}
            className={`
              min-w-[135px]
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-extrabold
              transition-all
              ${
                isOpen
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }
            `}
          >
            🔓 Open Circuit
          </button>

          <button
            type="button"
            onClick={handleClose}
            className={`
              min-w-[135px]
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-extrabold
              transition-all
              ${
                !isOpen
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }
            `}
          >
            🔒 Close Circuit
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="
              min-w-[100px]
              px-4
              py-2.5
              rounded-xl
              bg-slate-700
              text-white
              text-sm
              font-extrabold
              shadow-md
              hover:bg-slate-800
              transition-all
            "
          >
            ↻ Reset
          </button>

        </div>

        {/* ================================================= */}
        {/* EXPLANATION */}
        {/* ================================================= */}

        <div
          className={`
            shrink-0
            rounded-xl
            px-4
            py-2.5
            text-center
            text-xs
            font-bold
            border
            ${
              isOpen
                ? "bg-red-50 border-red-100 text-red-700"
                : "bg-blue-50 border-blue-100 text-blue-700"
            }
          `}
        >

          {isOpen ? (
            <>
              🔴 Open switch → electrical path breaks →
              electrons stop → bridge separates → car freezes
              exactly where it is → LED turns OFF.
            </>
          ) : (
            <>
              🟢 Closed switch → electrical path is complete →
              electrons flow → bridge connects → car resumes from
              the same position → LED stays ON.
            </>
          )}

        </div>

      </div>
    </div>
  );
}
/* =========================================================
   NEW PAGE 8 - HOW A CIRCUIT WORKS
========================================================= */
function Page8HowACircuitWorks() {
  return (
    <div className="h-full w-full flex flex-col p-7 bg-slate-50 overflow-hidden">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <div
          className="
            w-8 h-8 rounded-full bg-blue-600
            text-white flex items-center justify-center
            font-bold
          "
        >
          8
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900">
          🔌 How a Circuit Works
        </h2>
      </div>


      {/* =====================================================
          CIRCUIT WORKING IMAGE
      ===================================================== */}
      <div
        className="
          w-full
          h-[230px]
          bg-white
          rounded-2xl
          border-2
          border-blue-100
          shadow-sm
          overflow-hidden
          flex
          items-center
          justify-center
          shrink-0
          mb-4
        "
      >
        <img
          src="/images/Circuit%20working.webp"
          alt="Circuit working"
          className="
            w-full
            h-full
            object-contain
            object-center
          "
        />
      </div>


      {/* =====================================================
          COMPONENT DETAILS
      ===================================================== */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-3">

        {/* BATTERY */}
        <div
          className="
            rounded-2xl
            bg-blue-50
            border
            border-blue-100
            p-4
            flex
            items-center
            gap-3
          "
        >
          <div className="text-4xl shrink-0">
            🔋
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900">
              Battery
            </h3>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Provides electrical energy.
            </p>
          </div>
        </div>


        {/* WIRES */}
        <div
          className="
            rounded-2xl
            bg-slate-100
            border
            border-slate-200
            p-4
            flex
            items-center
            gap-3
          "
        >
          <div className="text-4xl shrink-0">
            〰️
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900">
              Wires
            </h3>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Provide a path for current.
            </p>
          </div>
        </div>


        {/* SWITCH */}
        <div
          className="
            rounded-2xl
            bg-amber-50
            border
            border-amber-100
            p-4
            flex
            items-center
            gap-3
          "
        >
          <div className="text-4xl shrink-0">
            🔘
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900">
              Switch
            </h3>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Opens or closes the path.
            </p>
          </div>
        </div>


        {/* BULB / LED */}
        <div
          className="
            rounded-2xl
            bg-yellow-50
            border
            border-yellow-100
            p-4
            flex
            items-center
            gap-3
          "
        >
          <div className="text-4xl shrink-0">
            💡
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900">
              Bulb / LED
            </h3>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Uses electrical energy and produces light.
            </p>
          </div>
        </div>

      </div>


      {/* =====================================================
          KEY IDEA
      ===================================================== */}
      <div
        className="
          mt-3
          rounded-2xl
          bg-blue-50
          border
          border-blue-100
          px-4
          py-3
          text-center
          shrink-0
        "
      >
        <span className="font-extrabold text-blue-700">
          ⚡ Key idea:
        </span>{" "}

        <span className="font-medium text-slate-700">
          Together, the components form a complete circuit.
        </span>
      </div>

    </div>
  );
}

/* =========================================================
   NEW PAGE 9 - HOW TO FORM A SIMPLE CIRCUIT
========================================================= */
function Page9HowToFormASimpleCircuit() {
  const steps = [
    ['1', '🔋', 'Take a battery.', 'The battery provides electrical energy.'],
    ['2', '🔌', 'Connect one wire from the battery to the bulb.', 'This starts the path.'],
    ['3', '〰️', 'Connect another wire from the bulb back to the battery.', 'This completes the path.'],
    ['4', '🔄', 'Make sure the path is closed.', 'A complete path allows current to flow.'],
    ['5', '💡', 'Observe the bulb.', 'The bulb can light when current flows.'],
  ];

  return (
    <div className="h-full flex flex-col p-7 bg-slate-50 overflow-hidden">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">9</div>
        <h2 className="text-2xl font-extrabold text-slate-900">🛠️ How to Form a Simple Circuit — 5 Steps</h2>
      </div>

      <div className="flex-1 min-h-0 grid grid-rows-5 gap-2">
        {steps.map(([number, icon, title, description]) => (
          <div key={number} className="rounded-xl bg-white border border-slate-200 px-4 py-2 flex items-center gap-4 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">{number}</div>
            <div className="text-2xl w-9 text-center shrink-0">{icon}</div>
            <div className="min-w-0">
              <p className="font-extrabold text-slate-800 text-sm">{title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   NEW PAGE 10 - CIRCUIT BUILDER
========================================================= */
function Page10FormACircuitCircuitBuilder() {
  return (
    <div className="h-full flex flex-col p-7 bg-slate-50 overflow-hidden">
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">10</div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">🧩 Form a Circuit — Circuit Builder</h2>
          <p className="text-slate-500 text-xs font-medium mt-1">Drag and drop the components to connect the battery to the LED!</p>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <CircuitBuilder />
      </div>
    </div>
  );
}

/* =========================================================
   PAGE 11 - EXPLORING ELECTRONIC COMPONENTS
========================================================= */

function Page11ExploringElectronicComponents({
  onSelectComponent,
}: {
  onSelectComponent: (component: ComponentType) => void;
}) {
  const components: Array<{
    type: ComponentType;
    image: string;
    name: string;
    short: string;
  }> = [
    {
      type: "battery",
      image: "/images/component-images/battery.png",
      name: "Battery",
      short: "Gives Energy",
    },
    {
      type: "wire",
      image: "/images/component-images/wire.png",
      name: "Wire",
      short: "Carries Current",
    },
    {
      type: "switch",
      image: "/images/component-images/switch.png",
      name: "Switch",
      short: "Controls Flow",
    },
    {
      type: "led",
      image: "/images/component-images/led.png",
      name: "LED",
      short: "Produces Light",
    },
    {
      type: "resistor",
      image: "/images/component-images/resistor.png",
      name: "Resistor",
      short: "Limits Current",
    },
    {
      type: "diode",
      image: "/images/component-images/diode.png",
      name: "Diode",
      short: "One Direction",
    },
    {
      type: "transistor",
      image: "/images/component-images/transistor.png",
      name: "Transistor",
      short: "Switches / Controls",
    },
    {
      type: "capacitor",
      image: "/images/component-images/capacitor.png",
      name: "Capacitor",
      short: "Stores Energy",
    },
  ];

  return (
    <div className="h-full w-full flex flex-col p-6 bg-slate-50 overflow-hidden">

      {/* ================= HEADER ================= */}

      <div className="flex items-center gap-3 mb-4 shrink-0">

        <div
          className="
            w-9 h-9
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            font-bold
            text-sm
            shrink-0
          "
        >
          11
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
            🔌 Exploring Electronic Components
          </h2>

          <p className="text-sm text-slate-500 font-medium mt-1">
            Click on any component to learn how it works!
          </p>
        </div>

      </div>


      {/* ================= COMPONENT GRID ================= */}

      <div className="flex-1 min-h-0 grid grid-cols-4 grid-rows-2 gap-3">

        {components.map((component) => (

          <button
            key={component.type}
            type="button"
            onClick={() => onSelectComponent(component.type)}
            className="
              group
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-3
              flex
              flex-col
              items-center
              justify-center
              text-center
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-1
              hover:shadow-lg
              hover:border-blue-400
              active:scale-95
              overflow-hidden
            "
          >

            {/* ================= IMAGE ================= */}

            <div
              className="
                w-full
                h-[105px]
                flex
                items-center
                justify-center
                mb-2
                shrink-0
              "
            >

              <img
                src={component.image}
                alt={component.name}
                className="
                  max-w-[120px]
                  max-h-[95px]
                  w-auto
                  h-auto
                  object-contain
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />

            </div>


            {/* ================= NAME ================= */}

            <div
              className="
                text-sm
                font-extrabold
                text-slate-900
                leading-tight
              "
            >
              {component.name}
            </div>


            {/* ================= DESCRIPTION ================= */}

            <div
              className="
                text-[10px]
                text-slate-500
                font-medium
                mt-1
                leading-tight
              "
            >
              {component.short}
            </div>


            {/* ================= VIEW WORKING ================= */}

            <div
              className="
                mt-2
                text-[10px]
                font-bold
                text-blue-600
                group-hover:text-blue-700
                transition-colors
              "
            >
              ▶ View working
            </div>

          </button>

        ))}

      </div>

    </div>
  );
}
/* =========================================================
   PAGE 12 - COMPONENT WORKING METHOD
========================================================= */

function Page12ComponentWorkingMethod({
  selectedComponent,
}: {
  selectedComponent: ComponentType;
}) {
  const componentInfo: Record<
    ComponentType,
    {
      icon: string;
      name: string;
      gif: string;
      what: string;
      how: string;
      used: string;
    }
  > = {
    battery: {
      icon: "🔋",
      name: "Battery",
      gif: "/images/GIF/battery.gif",
      what: "A battery is a source of electrical energy.",
      how:
        "It creates a voltage difference that pushes electric charges through a circuit.",
      used:
        "Used in torches, toys, remotes, portable devices and many electronic circuits.",
    },

    wire: {
      icon: "🔌",
      name: "Wire",
      gif: "/images/GIF/wire.gif",
      what: "A wire provides a conducting path for electric current.",
      how:
        "Electrons can move through the conducting material when a voltage is applied.",
      used:
        "Used to connect batteries, switches, LEDs and other circuit components.",
    },

    switch: {
      icon: "🔘",
      name: "Switch",
      gif: "/images/GIF/switch.gif",
      what: "A switch controls whether a circuit is open or closed.",
      how:
        "When closed, it completes the electrical path. When open, it breaks the path.",
      used:
        "Used in lights, appliances, machines and electronic devices.",
    },

    led: {
      icon: "💡",
      name: "LED",
      gif: "/images/GIF/led.gif",
      what: "An LED is a semiconductor device that produces light.",
      how:
        "When current flows through the LED in the correct direction, electrical energy is converted into light.",
      used:
        "Used in indicators, displays, lighting and electronic devices.",
    },

    resistor: {
      icon: "〰️",
      name: "Resistor",
      gif: "/images/GIF/resistor.gif",
      what: "A resistor is a component that limits electric current.",
      how:
        "It provides resistance to the flow of electric current.",
      used:
        "Used to control current and protect other components in circuits.",
    },

    diode: {
      icon: "➡️",
      name: "Diode",
      gif: "/images/GIF/diode.gif",
      what:
        "A diode is a semiconductor component that mainly allows current in one direction.",
      how:
        "It conducts when forward biased and restricts current in the opposite direction.",
      used:
        "Used in power supplies, protection circuits and signal processing.",
    },

    transistor: {
      icon: "🔀",
      name: "Transistor",
      gif: "/images/GIF/transistor.gif",
      what:
        "A transistor is a semiconductor device used to control electrical signals.",
      how:
        "A small control signal can control a larger current through the device.",
      used:
        "Used in switches, amplifiers, processors and electronic circuits.",
    },

    capacitor: {
      icon: "⚡",
      name: "Capacitor",
      gif: "/images/GIF/capacitor.gif",
      what:
        "A capacitor is a component that stores electrical energy.",
      how:
        "Electrical charge builds up on its plates and can later be released.",
      used:
        "Used for energy storage, filtering, smoothing and timing circuits.",
    },
  };

  const item = componentInfo[selectedComponent];

  return (
    <div className="h-full w-full flex flex-col p-6 bg-slate-50 overflow-hidden">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-3 shrink-0">

        <div
          className="
            w-9 h-9
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            font-bold
            text-sm
            shrink-0
          "
        >
          12
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Component Working Method
          </h2>

          <p className="text-sm text-slate-500 font-medium mt-1">
            See how the selected component works
          </p>
        </div>

      </div>


      {/* GIF FRAME */}

      <div
        className="
          shrink-0
          w-full
          h-[260px]
          bg-white
          rounded-2xl
          border-2
          border-slate-200
          shadow-md
          overflow-hidden
          p-2
        "
      >

        <div
          className="
            relative
            w-full
            h-full
            flex
            items-center
            justify-center
            overflow-hidden
          "
        >

          <img
            key={item.gif}
            src={item.gif}
            alt={`${item.name} working animation`}
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-[92%]
              h-[92%]
              object-contain
              object-center
              block
            "
          />

        </div>

      </div>


      {/* COMPONENT NAME */}

      <div className="shrink-0 text-center mt-3 mb-3">

        <h3 className="text-xl font-extrabold text-blue-700">
          {item.icon} {item.name}
        </h3>

      </div>


      {/* CONTENT */}

      <div className="flex-1 min-h-0 grid grid-cols-2 gap-3">

        {/* WHAT IS IT */}

        <div
          className="
            bg-white
            rounded-xl
            border
            border-slate-200
            shadow-sm
            p-4
            overflow-hidden
          "
        >

          <h4 className="text-base font-extrabold text-slate-900 mb-2">
            🔎 What is it?
          </h4>

          <p className="text-sm text-slate-600 leading-relaxed">
            {item.what}
          </p>

        </div>


        {/* HOW DOES IT WORK */}

        <div
          className="
            bg-white
            rounded-xl
            border
            border-slate-200
            shadow-sm
            p-4
            overflow-hidden
          "
        >

          <h4 className="text-base font-extrabold text-slate-900 mb-2">
            ⚙️ How does it work?
          </h4>

          <p className="text-sm text-slate-600 leading-relaxed">
            {item.how}
          </p>

        </div>


        {/* WHERE IS IT USED */}

        <div
          className="
            col-span-2
            bg-white
            rounded-xl
            border
            border-slate-200
            shadow-sm
            p-4
            overflow-hidden
          "
        >

          <h4 className="text-base font-extrabold text-slate-900 mb-2">
            📍 Where is it used?
          </h4>

          <p className="text-sm text-slate-600 leading-relaxed">
            {item.used}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   NEW PAGE 13 - RECAP
========================================================= */
function Page13FinalRecap() {
  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-hidden">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">13</div>
        <h2 className="text-3xl font-extrabold text-slate-900">🎯 Final Recap</h2>
      </div>
      <div className="space-y-3 flex-1">
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4"><b>⚡ Electricity</b><span className="text-slate-600"> — movement of electric charges.</span></div>
        <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4"><b>💡 Electronics</b><span className="text-slate-600"> — electrical components can control or process electrical signals.</span></div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4"><b>🔌 Circuit</b><span className="text-slate-600"> — a complete path through which electric current can flow.</span></div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4"><b>🧩 Simple circuit</b><span className="text-slate-600"> — battery, wires, switch and bulb/LED work together.</span></div>
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-center"><span className="text-xl font-extrabold">🔋 → 🔘 → 💡</span><p className="text-sm text-slate-500 mt-2">Complete the path to allow current to flow.</p></div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE 7
========================================================= */

/* =========================================================
   PAGE 8
========================================================= */

function Page14QuickQuizOne() {
  const [answers, setAnswers] = useState<{
    q1: string | null;
    q2: string | null;
    q3: string | null;
  }>({
    q1: null,
    q2: null,
    q3: null,
  });

  const selectAnswer = (
    question: "q1" | "q2" | "q3",
    answer: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const getAnswerStyle = (
    question: "q1" | "q2" | "q3",
    option: string,
    correct: string
  ) => {
    const selected = answers[question];

    if (!selected) {
      return "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50";
    }

    if (selected === option && option === correct) {
      return "bg-emerald-100 border-emerald-400";
    }

    if (selected === option && option !== correct) {
      return "bg-red-100 border-red-400";
    }

    return "bg-white border-slate-200";
  };

  return (
    <div className="h-full flex flex-col p-5 bg-white overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center gap-3 mb-2 shrink-0">

        <div className="
          w-8
          h-8
          rounded-full
          bg-blue-600
          text-white
          flex
          items-center
          justify-center
          font-bold
          shrink-0
        ">
          8
        </div>

        <div>
          <h2 className="
            text-2xl
            font-extrabold
            text-slate-900
            leading-none
          ">
            Quick Quiz
          </h2>

          <p className="
            text-[11px]
            text-slate-500
            font-medium
            mt-1
          ">
            Think • Choose • Learn!
          </p>
        </div>

      </div>


      {/* =====================================================
          LARGE SCENARIO IMAGE
      ===================================================== */}

      <div className="
        w-full
        h-[250px]
        rounded-2xl
        border-2
        border-blue-200
        bg-slate-50
        overflow-hidden
        shrink-0
        mb-4
        shadow-sm
      ">

        <img
          src="/images/page8-scenario.png"
          alt="Electricity scenario"
          className="
            w-full
            h-full
            object-contain
          "
        />

      </div>


      {/* =====================================================
          QUESTIONS BELOW IMAGE
      ===================================================== */}

      <div className="
        flex-1
        min-h-0
        grid
        grid-cols-3
        gap-3
      ">


        {/* ===================================================
            QUESTION 1
        =================================================== */}

        <div className="
          rounded-xl
          border-2
          border-blue-200
          bg-blue-50
          p-2.5
          flex
          flex-col
          min-h-0
          overflow-hidden
        ">

          <div className="flex items-start gap-2 mb-2">

            <div className="
              w-7
              h-7
              rounded-full
              bg-yellow-400
              text-slate-900
              flex
              items-center
              justify-center
              font-extrabold
              shrink-0
              text-sm
            ">
              1
            </div>

            <p className="
              text-[12px]
              font-extrabold
              text-slate-900
              leading-tight
            ">
              What is electricity?
            </p>

          </div>


          <div className="space-y-1.5">

            <button
              onClick={() => selectAnswer("q1", "A")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q1", "A", "A")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                A
              </span>

              Movement of electric charges
            </button>

            <button
              onClick={() => selectAnswer("q1", "B")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q1", "B", "A")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                B
              </span>

              Movement of water
            </button>

            <button
              onClick={() => selectAnswer("q1", "C")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q1", "C", "A")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                C
              </span>

              Movement of air
            </button>

            <button
              onClick={() => selectAnswer("q1", "D")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q1", "D", "A")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                D
              </span>

              Movement of light
            </button>

          </div>


          {/* ANIMATION */}

          <div className="mt-auto pt-1 text-center">

            {answers.q1 === "A" && (
              <div className="animate-bounce">

                <div className="text-xl">
                  🤩
                </div>

                <p className="
                  text-[10px]
                  font-extrabold
                  text-emerald-600
                ">
                  Correct! 🎉
                </p>

              </div>
            )}

            {answers.q1 && answers.q1 !== "A" && (
              <div className="animate-pulse">

                <div className="text-xl">
                  😟
                </div>

                <p className="
                  text-[10px]
                  font-extrabold
                  text-red-600
                ">
                  Noo, it's wrong!
                </p>

              </div>
            )}

          </div>

        </div>


        {/* ===================================================
            QUESTION 2
        =================================================== */}

        <div className="
          rounded-xl
          border-2
          border-yellow-300
          bg-yellow-50
          p-2.5
          flex
          flex-col
          min-h-0
          overflow-hidden
        ">

          <div className="flex items-start gap-2 mb-2">

            <div className="
              w-7
              h-7
              rounded-full
              bg-yellow-400
              text-slate-900
              flex
              items-center
              justify-center
              font-extrabold
              shrink-0
              text-sm
            ">
              2
            </div>

            <p className="
              text-[12px]
              font-extrabold
              text-slate-900
              leading-tight
            ">
              What does a battery provide to a circuit?
            </p>

          </div>


          <div className="space-y-1.5">

            <button
              onClick={() => selectAnswer("q2", "A")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q2", "A", "B")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                A
              </span>

              Sound energy
            </button>

            <button
              onClick={() => selectAnswer("q2", "B")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q2", "B", "B")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                B
              </span>

              Electrical energy
            </button>

            <button
              onClick={() => selectAnswer("q2", "C")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q2", "C", "B")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                C
              </span>

              Heat only
            </button>

            <button
              onClick={() => selectAnswer("q2", "D")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q2", "D", "B")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                D
              </span>

              Water
            </button>

          </div>


          {/* ANIMATION */}

          <div className="mt-auto pt-1 text-center">

            {answers.q2 === "B" && (
              <div className="animate-bounce">

                <div className="text-xl">
                  🤩
                </div>

                <p className="
                  text-[10px]
                  font-extrabold
                  text-emerald-600
                ">
                  Correct! 🎉
                </p>

              </div>
            )}

            {answers.q2 && answers.q2 !== "B" && (
              <div className="animate-pulse">

                <div className="text-xl">
                  😟
                </div>

                <p className="
                  text-[10px]
                  font-extrabold
                  text-red-600
                ">
                  Noo, it's wrong!
                </p>

              </div>
            )}

          </div>

        </div>


        {/* ===================================================
            QUESTION 3
        =================================================== */}

        <div className="
          rounded-xl
          border-2
          border-emerald-200
          bg-emerald-50
          p-2.5
          flex
          flex-col
          min-h-0
          overflow-hidden
        ">

          <div className="flex items-start gap-2 mb-2">

            <div className="
              w-7
              h-7
              rounded-full
              bg-yellow-400
              text-slate-900
              flex
              items-center
              justify-center
              font-extrabold
              shrink-0
              text-sm
            ">
              3
            </div>

            <p className="
              text-[12px]
              font-extrabold
              text-slate-900
              leading-tight
            ">
              What is the main job of a wire?
            </p>

          </div>


          <div className="space-y-1.5">

            <button
              onClick={() => selectAnswer("q3", "A")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q3", "A", "C")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                A
              </span>

              Store charge
            </button>

            <button
              onClick={() => selectAnswer("q3", "B")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q3", "B", "C")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                B
              </span>

              Produce light
            </button>

            <button
              onClick={() => selectAnswer("q3", "C")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q3", "C", "C")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                C
              </span>

              Provide a path for electric current
            </button>

            <button
              onClick={() => selectAnswer("q3", "D")}
              className={`
                w-full
                text-left
                px-2
                py-2
                rounded-lg
                border
                transition-all
                duration-200
                text-[10px]
                font-semibold
                ${getAnswerStyle("q3", "D", "C")}
              `}
            >
              <span className="
                inline-flex
                w-5
                h-5
                rounded-full
                bg-cyan-100
                text-cyan-700
                items-center
                justify-center
                mr-1
                font-extrabold
              ">
                D
              </span>

              Stop current
            </button>

          </div>


          {/* ANIMATION */}

          <div className="mt-auto pt-1 text-center">

            {answers.q3 === "C" && (
              <div className="animate-bounce">

                <div className="text-xl">
                  🤩
                </div>

                <p className="
                  text-[10px]
                  font-extrabold
                  text-emerald-600
                ">
                  Correct! 🎉
                </p>

              </div>
            )}

            {answers.q3 && answers.q3 !== "C" && (
              <div className="animate-pulse">

                <div className="text-xl">
                  😟
                </div>

                <p className="
                  text-[10px]
                  font-extrabold
                  text-red-600
                ">
                  Noo, it's wrong!
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

function Page15QuickQuizTwo() {
  const [answers, setAnswers] = useState<{
    q4: string | null;
    q5: string | null;
  }>({
    q4: null,
    q5: null,
  });

  const selectAnswer = (question: "q4" | "q5", answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const answerStyle = (
    question: "q4" | "q5",
    option: string,
    correct: string
  ) => {
    const selected = answers[question];

    if (!selected) {
      return "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50";
    }

    if (selected === option && option === correct) {
      return "bg-emerald-100 border-emerald-400";
    }

    if (selected === option && option !== correct) {
      return "bg-red-100 border-red-400";
    }

    return "bg-white border-slate-200";
  };

  return (
    <div className="h-full flex flex-col p-5 bg-white overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          15
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-none">
            Quick Quiz
          </h2>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Think • Choose • Learn!
          </p>
        </div>
      </div>

      {/* LARGE IMAGE INSERT FRAME — NO GIF */}
      <div className="w-full h-[220px] rounded-2xl border-2 border-blue-200 bg-slate-50 overflow-hidden shrink-0 mb-4 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-xs font-bold uppercase tracking-wide">
            Scenario Image
          </p>
          <p className="text-[10px] mt-1">
            Insert your image here
          </p>
        </div>
      </div>

      {/* QUESTIONS 4 + 5 */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-3">

        {/* QUESTION 4 */}
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-3 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-start gap-2 mb-3">
            <div className="w-7 h-7 shrink-0 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-extrabold text-sm">
              4
            </div>
            <p className="font-extrabold text-xs leading-tight text-slate-900">
              What happens when a switch is ON?
            </p>
          </div>

          <div className="space-y-2">
            {[
              ["A", "The circuit becomes complete"],
              ["B", "The current stops"],
              ["C", "The battery turns OFF"],
              ["D", "The wire disappears"],
            ].map(([letter, text]) => (
              <button
                key={letter}
                onClick={() => selectAnswer("q4", letter)}
                className={`w-full text-left px-2 py-2 rounded-lg border transition-all duration-200 text-[10px] font-semibold ${answerStyle("q4", letter, "A")}`}
              >
                <span className="inline-flex w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 items-center justify-center mr-1 font-extrabold">
                  {letter}
                </span>
                {text}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-2 text-center">
            {answers.q4 === "A" && (
              <div className="animate-bounce">
                <div className="text-2xl">🤩</div>
                <p className="text-[10px] font-extrabold text-emerald-600">
                  Correct! 🎉
                </p>
              </div>
            )}
            {answers.q4 && answers.q4 !== "A" && (
              <div className="animate-pulse">
                <div className="text-2xl">😟</div>
                <p className="text-[10px] font-extrabold text-red-600">
                  Noo, it's wrong!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* QUESTION 5 */}
        <div className="rounded-xl border-2 border-yellow-300 bg-yellow-50 p-3 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-start gap-2 mb-3">
            <div className="w-7 h-7 shrink-0 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-extrabold text-sm">
              5
            </div>
            <p className="font-extrabold text-xs leading-tight text-slate-900">
              Which component limits the flow of current?
            </p>
          </div>

          <div className="space-y-2">
            {[
              ["A", "Battery"],
              ["B", "Resistor"],
              ["C", "Bulb"],
              ["D", "Wire"],
            ].map(([letter, text]) => (
              <button
                key={letter}
                onClick={() => selectAnswer("q5", letter)}
                className={`w-full text-left px-2 py-2 rounded-lg border transition-all duration-200 text-[10px] font-semibold ${answerStyle("q5", letter, "B")}`}
              >
                <span className="inline-flex w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 items-center justify-center mr-1 font-extrabold">
                  {letter}
                </span>
                {text}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-2 text-center">
            {answers.q5 === "B" && (
              <div className="animate-bounce">
                <div className="text-2xl">🤩</div>
                <p className="text-[10px] font-extrabold text-emerald-600">
                  Correct! 🎉
                </p>
              </div>
            )}
            {answers.q5 && answers.q5 !== "B" && (
              <div className="animate-pulse">
                <div className="text-2xl">😟</div>
                <p className="text-[10px] font-extrabold text-red-600">
                  Noo, it's wrong!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


