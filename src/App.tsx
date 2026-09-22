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

  /* 0 - FRONT COVER */
  <div className="h-full w-full bg-white" />,

  /* 1 - THE PROBLEM */
  <Page1RiyaStory />,

  /* 2 - THE DISCOVERY */
  <Page2GoogleSearch />,

  /* 3 - HOW IT WORKS */
  <Page3HowItWorks />,

  /* 4 - GOOGLE SEARCH */
  <Page4GoogleSearchTwo />,

  /* 5 - ANIMATION */
  <Page5Animation />,

  /* 6 - CIRCUIT THEORY */
  <Page6CircuitTheory />,

  /* 7 - CIRCUIT SIMULATION */
  <Page7CircuitSim />,

  /* 8 - QUICK QUIZ
     Questions 1, 2, 3 */
  <Page8Workbook />,

  /* 9 - QUICK QUIZ
     Questions 4, 5 */
  <Page9Workbook />,

  /* 10 - ELECTRONICS COVER
     BIG COVER */
  <Page10ElectronicsCover />,

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
    w-full
    max-w-4xl
    flex
    items-center
    justify-between
    gap-4
    mb-6
    px-5
    py-4
    rounded-2xl
    bg-slate-800
    border-2
    border-slate-600
    shadow-2xl
    transition-all
    duration-300
    ${
      !bookOpened
        ? "opacity-0 pointer-events-none"
        : "opacity-100"
    }
  `}
>

  {/* PREVIOUS BUTTON */}

  <button
    onClick={previousPage}
    disabled={!bookOpened || currentPage <= 1}
    className="
      min-w-[130px]
      px-5
      py-3
      rounded-xl
      bg-white
      text-slate-800
      border-2
      border-slate-300
      font-bold
      text-sm
      shadow-lg
      flex
      items-center
      justify-center
      gap-2
      transition-all
      duration-200
      hover:bg-blue-50
      hover:border-blue-400
      hover:text-blue-700
      active:scale-95
      disabled:opacity-40
      disabled:cursor-not-allowed
    "
  >
    <span className="text-xl">
      ←
    </span>

    Previous
  </button>


  {/* PAGE NUMBER */}

  <div
    className="
      min-w-[120px]
      px-5
      py-3
      rounded-xl
      bg-slate-700
      border-2
      border-slate-500
      text-white
      font-extrabold
      text-sm
      text-center
      shadow-inner
    "
  >
    Page {currentPage} / {pages.length - 1}
  </div>


  {/* NEXT BUTTON */}

  <button
    onClick={nextPage}
    disabled={
      !bookOpened ||
      currentPage >= pages.length - 1
    }
    className="
      min-w-[130px]
      px-5
      py-3
      rounded-xl
      bg-blue-600
      text-white
      border-2
      border-blue-400
      font-bold
      text-sm
      shadow-lg
      flex
      items-center
      justify-center
      gap-2
      transition-all
      duration-200
      hover:bg-blue-700
      hover:border-blue-300
      active:scale-95
      disabled:opacity-40
      disabled:cursor-not-allowed
    "
  >
    Next

    <span className="text-xl">
      →
    </span>
  </button>

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

function Page1RiyaStory() {

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

function Page2GoogleSearch() {

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

function Page4GoogleSearchTwo() {

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

function Page5Animation() {

  return (

    <div
      className="
        h-full
        flex
        flex-col
        p-10
        bg-slate-50
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
          5
        </div>

        <h2
          className="
            text-3xl
            font-extrabold
            text-slate-900
          "
        >
          Electronics in Action
        </h2>

      </div>


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
          shadow-sm
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
          [ Insert Custom Electronics
          <br />
          Animation Here ]
        </p>

      </div>

    </div>

  );
}


/* =========================================================
   PAGE 6
========================================================= */

function Page6CircuitTheory() {

  return (

    <div
      className="
        h-full
        flex
        flex-col
        p-7
        bg-white
        overflow-hidden
      "
    >


      {/* HEADER */}

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
          6
        </div>

        <h2
          className="
            text-2xl
            font-extrabold
            text-slate-900
          "
        >
          How a Circuit Works
        </h2>

      </div>


      {/* MAIN FRAME */}

      <div
        className="
          flex-1
          min-h-0
          rounded-2xl
          border-2
          border-slate-200
          bg-slate-50
          p-4
          flex
          flex-col
        "
      >


        {/* CIRCUIT IMAGE */}

        <div
          className="
            w-full
            h-[150px]
            rounded-xl
            bg-white
            border
            border-slate-200
            overflow-hidden
            shrink-0
          "
        >

          <img
            src="/images/circuit_anim_v9.webp"
            alt="Simple closed circuit"
            className="
              w-full
              h-full
              object-contain
            "
          />

        </div>


        {/* EXPLANATION */}

        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-2
          "
        >


          {/* BATTERY */}

          <div
            className="
              p-2.5
              rounded-lg
              bg-blue-50
              border
              border-blue-100
            "
          >

            <h4
              className="
                font-extrabold
                text-blue-900
                text-sm
              "
            >
              🔋 Battery
            </h4>

            <p
              className="
                text-blue-800
                text-xs
                mt-1
              "
            >
              Electrons leave the
              <b> Negative (−) </b>
              terminal.
            </p>

          </div>


          {/* SWITCH */}

          <div
            className="
              p-2.5
              rounded-lg
              bg-indigo-50
              border
              border-indigo-100
            "
          >

            <h4
              className="
                font-extrabold
                text-indigo-900
                text-sm
              "
            >
              🔘 Switch
            </h4>

            <p
              className="
                text-indigo-800
                text-xs
                mt-1
              "
            >
              The switch opens or closes the circuit.
            </p>

          </div>


          {/* BULB */}

          <div
            className="
              p-2.5
              rounded-lg
              bg-amber-50
              border
              border-amber-100
            "
          >

            <h4
              className="
                font-extrabold
                text-amber-900
                text-sm
              "
            >
              💡 Bulb
            </h4>

            <p
              className="
                text-amber-800
                text-xs
                mt-1
              "
            >
              Electrons flow through the bulb and it glows.
            </p>

          </div>


          {/* POSITIVE */}

          <div
            className="
              p-2.5
              rounded-lg
              bg-emerald-50
              border
              border-emerald-100
            "
          >

            <h4
              className="
                font-extrabold
                text-emerald-900
                text-sm
              "
            >
              🔋 Positive (+)
            </h4>

            <p
              className="
                text-emerald-800
                text-xs
                mt-1
              "
            >
              Electrons return to the Positive (+) terminal.
            </p>

          </div>

        </div>


        {/* FLOW */}

        <div
          className="
            mt-3
            p-2.5
            rounded-lg
            bg-white
            border
            border-slate-200
            text-center
          "
        >

          <p
            className="
              text-sm
              font-extrabold
              text-slate-700
            "
          >
            🔋 Negative (−)
            → 🔘 Switch
            → 💡 Bulb
            → 🔋 Positive (+)
          </p>

        </div>


        {/* KEY IDEA */}

        <div
          className="
            mt-2
            p-2.5
            rounded-lg
            bg-blue-600
            text-white
            text-center
          "
        >

          <p
            className="
              text-xs
              font-bold
            "
          >
            ⚡ Closed circuit = electrons can flow
          </p>

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   PAGE 7
========================================================= */

function Page7CircuitSim() {

  return (

    <div
      className="
        h-full
        flex
        flex-col
        p-7
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
          7
        </div>


        <div>

          <h2
            className="
              text-3xl
              font-extrabold
              text-slate-900
            "
          >
            Form a Circuit
          </h2>

          <p
            className="
              text-slate-500
              text-xs
              font-medium
              mt-1
            "
          >
            Drag and drop the components to connect the battery to the LED!
          </p>

        </div>

      </div>


      <div
        className="
          flex-1
          min-h-0
        "
      >
        <CircuitBuilder />
      </div>

    </div>

  );
}


/* =========================================================
   PAGE 8
========================================================= */

function Page8Workbook() {
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

/* =========================================================
   PAGE 9 — QUICK QUIZ
========================================================= */

function Page9Workbook() {
  const [answers, setAnswers] = useState<{
    q4: string | null;
    q5: string | null;
  }>({
    q4: null,
    q5: null,
  });

  const selectAnswer = (
    question: "q4" | "q5",
    answer: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const getAnswerStyle = (
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

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center gap-3 mb-2 shrink-0">

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
            shrink-0
          "
        >
          9
        </div>

        <div>
          <h2
            className="
              text-2xl
              font-extrabold
              text-slate-900
              leading-none
            "
          >
            Quick Quiz
          </h2>

          <p
            className="
              text-[11px]
              text-slate-500
              font-medium
              mt-1
            "
          >
            Think • Choose • Learn!
          </p>
        </div>

      </div>


      {/* =====================================================
          SCENARIO IMAGE INSERTION FRAME
          Keep your Page 9 scenario image here
      ===================================================== */}

      <div
        className="
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
        "
      >

        <img
          src="/images/page9-scenario.png"
          alt="Electricity scenario"
          className="
            w-full
            h-full
            object-contain
          "
        />

      </div>


      {/* =====================================================
          QUESTIONS 4 & 5
      ===================================================== */}

      <div
        className="
          flex-1
          min-h-0
          grid
          grid-cols-2
          gap-4
        "
      >

        {/* ===================================================
            QUESTION 4
        =================================================== */}

        <div
          className="
            rounded-xl
            border-2
            border-blue-200
            bg-blue-50
            p-3
            flex
            flex-col
            min-h-0
            overflow-hidden
          "
        >

          {/* Question heading */}

          <div className="flex items-start gap-2 mb-2">

            <div
              className="
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
              "
            >
              4
            </div>

            <p
              className="
                text-[12px]
                font-extrabold
                text-slate-900
                leading-tight
              "
            >
              What happens when the switch is closed?
            </p>

          </div>


          {/* Answer buttons */}

          <div className="space-y-1.5">

            {/* A */}

            <button
              onClick={() => selectAnswer("q4", "A")}
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
                ${getAnswerStyle("q4", "A", "B")}
              `}
            >

              <span
                className="
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
                "
              >
                A
              </span>

              The circuit is broken

            </button>


            {/* B */}

            <button
              onClick={() => selectAnswer("q4", "B")}
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
                ${getAnswerStyle("q4", "B", "B")}
              `}
            >

              <span
                className="
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
                "
              >
                B
              </span>

              Electric current can flow

            </button>


            {/* C */}

            <button
              onClick={() => selectAnswer("q4", "C")}
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
                ${getAnswerStyle("q4", "C", "B")}
              `}
            >

              <span
                className="
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
                "
              >
                C
              </span>

              The battery stops working

            </button>


            {/* D */}

            <button
              onClick={() => selectAnswer("q4", "D")}
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
                ${getAnswerStyle("q4", "D", "B")}
              `}
            >

              <span
                className="
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
                "
              >
                D
              </span>

              The wire disappears

            </button>

          </div>


          {/* =================================================
              QUESTION 4 ANIMATION
          ================================================= */}

          <div className="mt-auto pt-2 text-center">

            {answers.q4 === "B" && (
              <div className="animate-bounce">

                <div className="text-2xl">
                  🤩
                </div>

                <p
                  className="
                    text-[10px]
                    font-extrabold
                    text-emerald-600
                  "
                >
                  Correct! 🎉
                </p>

              </div>
            )}

            {answers.q4 && answers.q4 !== "B" && (
              <div className="animate-pulse">

                <div className="text-2xl">
                  😟
                </div>

                <p
                  className="
                    text-[10px]
                    font-extrabold
                    text-red-600
                  "
                >
                  No, it's wrong!
                </p>

              </div>
            )}

          </div>

        </div>


        {/* ===================================================
            QUESTION 5
        =================================================== */}

        <div
          className="
            rounded-xl
            border-2
            border-emerald-200
            bg-emerald-50
            p-3
            flex
            flex-col
            min-h-0
            overflow-hidden
          "
        >

          {/* Question heading */}

          <div className="flex items-start gap-2 mb-2">

            <div
              className="
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
              "
            >
              5
            </div>

            <p
              className="
                text-[12px]
                font-extrabold
                text-slate-900
                leading-tight
              "
            >
              What happens to the LED when current flows?
            </p>

          </div>


          {/* Answer buttons */}

          <div className="space-y-1.5">

            {/* A */}

            <button
              onClick={() => selectAnswer("q5", "A")}
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
                ${getAnswerStyle("q5", "A", "C")}
              `}
            >

              <span
                className="
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
                "
              >
                A
              </span>

              It turns off

            </button>


            {/* B */}

            <button
              onClick={() => selectAnswer("q5", "B")}
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
                ${getAnswerStyle("q5", "B", "C")}
              `}
            >

              <span
                className="
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
                "
              >
                B
              </span>

              It breaks the wire

            </button>


            {/* C */}

            <button
              onClick={() => selectAnswer("q5", "C")}
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
                ${getAnswerStyle("q5", "C", "C")}
              `}
            >

              <span
                className="
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
                "
              >
                C
              </span>

              It lights up

            </button>


            {/* D */}

            <button
              onClick={() => selectAnswer("q5", "D")}
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
                ${getAnswerStyle("q5", "D", "C")}
              `}
            >

              <span
                className="
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
                "
              >
                D
              </span>

              It becomes a battery

            </button>

          </div>


          {/* =================================================
              QUESTION 5 ANIMATION
          ================================================= */}

          <div className="mt-auto pt-2 text-center">

            {answers.q5 === "C" && (
              <div className="animate-bounce">

                <div className="text-2xl">
                  🤩
                </div>

                <p
                  className="
                    text-[10px]
                    font-extrabold
                    text-emerald-600
                  "
                >
                  Correct! 🎉
                </p>

              </div>
            )}

            {answers.q5 && answers.q5 !== "C" && (
              <div className="animate-pulse">

                <div className="text-2xl">
                  😟
                </div>

                <p
                  className="
                    text-[10px]
                    font-extrabold
                    text-red-600
                  "
                >
                  No, it's wrong!
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

function Page10ElectronicsCover() {
  return (
    <div
      className="
        h-full
        w-full
        relative
        overflow-hidden
        bg-gradient-to-br
        from-blue-950
        via-blue-800
        to-indigo-950
        flex
        items-center
        justify-center
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          absolute
          w-[420px]
          h-[420px]
          rounded-full
          bg-cyan-400/20
          blur-[100px]
        "
      />

      <div
        className="
          absolute
          -top-20
          -right-20
          w-[260px]
          h-[260px]
          rounded-full
          bg-blue-400/20
          blur-[80px]
        "
      />

      <div
        className="
          absolute
          -bottom-20
          -left-20
          w-[280px]
          h-[280px]
          rounded-full
          bg-indigo-400/20
          blur-[80px]
        "
      />


      {/* DECORATIVE CIRCUIT LINES */}

      <div
        className="
          absolute
          top-[18%]
          left-0
          w-[30%]
          h-px
          bg-cyan-300/40
        "
      />

      <div
        className="
          absolute
          top-[18%]
          right-0
          w-[30%]
          h-px
          bg-cyan-300/40
        "
      />

      <div
        className="
          absolute
          bottom-[18%]
          left-0
          w-[25%]
          h-px
          bg-blue-300/30
        "
      />

      <div
        className="
          absolute
          bottom-[18%]
          right-0
          w-[25%]
          h-px
          bg-blue-300/30
        "
      />


      {/* MAIN COVER */}

      <div
        className="
          relative
          z-10
          w-[82%]
          h-[82%]
          rounded-3xl
          border
          border-cyan-300/30
          bg-white/10
          backdrop-blur-xl
          shadow-[0_25px_80px_rgba(0,0,0,0.35)]
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-8
        "
      >

        {/* ELECTRON ICON */}

        <div
          className="
            w-24
            h-24
            rounded-full
            bg-white
            shadow-[0_0_45px_rgba(34,211,238,0.55)]
            flex
            items-center
            justify-center
            text-5xl
            mb-7
            animate-pulse
          "
        >
          ⚡
        </div>


        {/* SMALL LABEL */}

        <p
          className="
            text-cyan-200
            text-xs
            font-extrabold
            uppercase
            tracking-[0.35em]
            mb-4
          "
        >
          Next Chapter
        </p>


        {/* TITLE */}

        <h1
          className="
            text-5xl
            font-black
            text-white
            leading-tight
          "
        >
          Electronics
        </h1>


        {/* SUBTITLE */}

        <p
          className="
            mt-4
            text-blue-100
            text-sm
            font-semibold
            max-w-[360px]
            leading-relaxed
          "
        >
          Discover circuits, components,
          current, voltage and how electronic
          devices work.
        </p>


        {/* COMPONENT ROW */}

        <div
          className="
            mt-8
            flex
            items-center
            gap-5
            text-3xl
          "
        >
          <div
            className="
              w-14
              h-14
              rounded-xl
              bg-white/10
              border
              border-white/20
              flex
              items-center
              justify-center
            "
          >
            🔋
          </div>

          <span className="text-cyan-300 text-xl">
            →
          </span>

          <div
            className="
              w-14
              h-14
              rounded-xl
              bg-white/10
              border
              border-white/20
              flex
              items-center
              justify-center
            "
          >
            🔘
          </div>

          <span className="text-cyan-300 text-xl">
            →
          </span>

          <div
            className="
              w-14
              h-14
              rounded-xl
              bg-white/10
              border
              border-white/20
              flex
              items-center
              justify-center
            "
          >
            💡
          </div>
        </div>


        {/* FOOTER */}

        <div
          className="
            absolute
            bottom-6
            left-0
            right-0
            text-center
          "
        >
          <p
            className="
              text-cyan-200/70
              text-[10px]
              font-bold
              uppercase
              tracking-[0.25em]
            "
          >
            MEG-Zcuit • Interactive Electronics
          </p>
        </div>

      </div>

    </div>
  );
}