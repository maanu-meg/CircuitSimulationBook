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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

import { useEffect, useRef, useState, type ReactNode } from "react";


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

  const [isGeneratingPDF, setIsGeneratingPDF] =
    useState(false);

  const pdfPagesRef =
    useRef<HTMLDivElement>(null);


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
    <div className="h-full w-full bg-white" />,

    /* 1 - THE PROBLEM */
    <Page1RiyaStory />,

    /* 2 - THE DISCOVERY */
    <Page2GoogleSearch />,

    /* 3 - HOW IT WORKS — KEEP EXISTING PAGE 3 */
    <Page3HowItWorks />,

    /* 4 - VOLTAGE & CURRENT */
    <Page4GoogleSearchTwo />,

    /* 5 - ELECTRONICS INTRODUCTION */
    <Page5Animation />,

    /* 6 - WHAT IS ELECTRONICS? */
    <Page6WhatIsElectronics />,

    /* 7 - WHAT IS A CIRCUIT? */
    <Page7WhatIsCircuit />,

    /* 8 - HOW A CIRCUIT WORKS */
    <Page8HowCircuitWorks />,

    /* 9 - HOW TO FORM A SIMPLE CIRCUIT — 5 STEPS */
    <Page9SimpleCircuit />,

    /* 10 - FORM A CIRCUIT — CIRCUIT BUILDER */
    <Page10CircuitBuilder />,

    /* 11 - COMPONENTS */
    <Page11Components
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
    <Page12componentFlowVideo
      selectedComponent={selectedComponent}
    />,

    /* 13 - FINAL RECAP */
    <Page13Recap />,

    /* 14 - QUICK QUIZ 1–3 */
    <Page14QuizOne />,

    /* 15 - QUICK QUIZ 4–5 */
    <Page15QuizTwo />,

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

  /* =======================================================
     DOWNLOAD COMPLETE BOOK AS ONE PDF
  ======================================================= */

  const downloadPDF = async () => {

    if (isGeneratingPDF) {
      return;
    }

    setIsGeneratingPDF(true);

    try {

      const pdfPages =
        pdfPagesRef.current?.querySelectorAll<HTMLElement>(
          "[data-pdf-page]"
        );

      if (!pdfPages || pdfPages.length === 0) {
        console.error("PDF pages were not found.");
        return;
      }

      // Keep the same 560 × 700 aspect ratio as the ebook page.
      const pdfWidth = 210;
      const pdfHeight = 262.5;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
        compress: true,
      });

      for (let i = 0; i < pdfPages.length; i++) {

        const page = pdfPages[i];

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          width: 560,
          height: 700,
          windowWidth: 560,
          windowHeight: 700,
        });

        const imageData =
          canvas.toDataURL("image/jpeg", 0.95);

        if (i > 0) {
          pdf.addPage([pdfWidth, pdfHeight], "portrait");
        }

        pdf.addImage(
          imageData,
          "JPEG",
          0,
          0,
          pdfWidth,
          pdfHeight,
          undefined,
          "FAST"
        );
      }

      pdf.save("MEG-Zcuit.pdf");

    } catch (error) {

      console.error(
        "PDF generation failed:",
        error
      );

    } finally {

      setIsGeneratingPDF(false);

    }

  };


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


          <Button
            onClick={downloadPDF}
            disabled={isGeneratingPDF}
            className="
              rounded-full
              bg-emerald-600
              text-white
              hover:bg-emerald-700
              disabled:opacity-60
            "
          >
            {isGeneratingPDF
              ? "Creating PDF..."
              : "⬇ Download PDF"}
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

          {/* =================================================
              HIDDEN PDF PAGES
              These are only used when creating the PDF.
              The visible flipbook above is unchanged.
          ================================================= */}

          <div
            ref={pdfPagesRef}
            className="
              fixed
              left-[-10000px]
              top-0
              pointer-events-none
            "
            aria-hidden="true"
          >
            {pages.map((page, index) => (
              <div
                key={`pdf-page-${index}`}
                data-pdf-page
                className="bg-white overflow-hidden"
                style={{
                  width: "560px",
                  height: "700px",
                }}
              >
                {page}
              </div>
            ))}
          </div>

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
  return (
    <div className="h-full flex flex-col p-7 bg-white overflow-hidden">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">6</div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">💡 What is Electronics?</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Using electrical components to control and process electrical signals.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-5">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-center">
          <p className="text-slate-700 font-medium leading-relaxed">
            Electronics uses electrical components to control or process electrical signals.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 items-center">
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 text-center">
            <div className="text-3xl mb-2">📥</div>
            <h3 className="font-extrabold text-slate-800">INPUT</h3>
            <p className="text-xs text-slate-500 mt-1">A signal or information enters.</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">→</div>
            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="font-extrabold text-slate-800">CONTROL / PROCESS</h3>
              <p className="text-xs text-slate-500 mt-1">The circuit processes the signal.</p>
            </div>
            <div className="text-2xl font-bold text-blue-500 mt-1">→</div>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-center">
            <div className="text-3xl mb-2">📤</div>
            <h3 className="font-extrabold text-slate-800">OUTPUT</h3>
            <p className="text-xs text-slate-500 mt-1">The result is produced.</p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-center text-sm font-bold text-slate-700">
          Example: an automatic night light detects darkness → processes the signal → switches the LED on.
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   NEW PAGE 7 - WHAT IS A CIRCUIT?
========================================================= */
function Page7WhatIsCircuit() {
  return (
    <div className="h-full flex flex-col p-8 bg-slate-50 overflow-hidden">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">7</div>
        <h2 className="text-3xl font-extrabold text-slate-900">🔌 What is a Circuit?</h2>
      </div>
      <p className="text-slate-600 font-medium mb-5 shrink-0">
        A circuit is a complete path through which electric current can flow.
      </p>

      <div className="flex-1 min-h-0 grid grid-cols-2 gap-5">
        <div className="rounded-3xl bg-white border-2 border-emerald-200 p-6 flex flex-col justify-center text-center shadow-sm">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-extrabold text-emerald-700">Complete Path</h3>
          <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
            The path is complete, so electric current can flow.
          </p>
        </div>
        <div className="rounded-3xl bg-white border-2 border-red-200 p-6 flex flex-col justify-center text-center shadow-sm">
          <div className="text-5xl mb-4">❌</div>
          <h3 className="text-xl font-extrabold text-red-600">Broken Path</h3>
          <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
            The path is broken, so electric current cannot flow.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-center shrink-0">
        <span className="font-extrabold text-blue-700">⚡ Key idea:</span>{' '}
        <span className="font-medium text-slate-700">Complete path = current can flow.</span>
      </div>
    </div>
  );
}

/* =========================================================
   NEW PAGE 8 - HOW A CIRCUIT WORKS
========================================================= */
function Page8HowCircuitWorks() {
  return (
    <div className="h-full flex flex-col p-7 bg-white overflow-hidden">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">8</div>
        <h2 className="text-2xl font-extrabold text-slate-900">🔌 How a Circuit Works</h2>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-center">
            <div className="text-4xl">🔋</div>
            <h3 className="font-extrabold mt-2">Battery</h3>
            <p className="text-xs text-slate-600 mt-1">Provides electrical energy.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
            <div className="text-4xl">〰️</div>
            <h3 className="font-extrabold mt-2">Wires</h3>
            <p className="text-xs text-slate-600 mt-1">Provide a path for current.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-center">
            <div className="text-4xl">🔘</div>
            <h3 className="font-extrabold mt-2">Switch</h3>
            <p className="text-xs text-slate-600 mt-1">Opens or closes the path.</p>
          </div>
          <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-4 text-center">
            <div className="text-4xl">💡</div>
            <h3 className="font-extrabold mt-2">Bulb / LED</h3>
            <p className="text-xs text-slate-600 mt-1">Uses electrical energy and produces light.</p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-blue-200 bg-slate-50 p-5 text-center">
          <div className="text-xl font-extrabold text-blue-700">🔋 → 〰️ → 🔘 → 〰️ → 💡</div>
          <p className="text-sm text-slate-600 font-medium mt-2">Together, the components form a complete circuit.</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   NEW PAGE 9 - HOW TO FORM A SIMPLE CIRCUIT
========================================================= */
function Page9SimpleCircuit() {
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
function Page10CircuitBuilder() {
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
   NEW PAGE 11 - COMPONENTS
========================================================= */
/* =========================================================
   PAGE 11 - COMPONENTS
========================================================= */

function Page11Components({
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

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
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

      {/* COMPONENT GRID */}
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

            {/* COMPONENT IMAGE */}
            <div className="w-full h-[105px] flex items-center justify-center mb-2 shrink-0">
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

            {/* COMPONENT NAME */}
            <div className="text-sm font-extrabold text-slate-900 leading-tight">
              {component.name}
            </div>

            {/* DESCRIPTION */}
            <div className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">
              {component.short}
            </div>

            {/* BUTTON TEXT */}
            <div className="mt-2 text-[10px] font-bold text-blue-600 group-hover:text-blue-700">
              ▶ View working
            </div>

          </button>
        ))}

      </div>
    </div>
  );
}
function Page12componentFlowVideo({
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

      {/* ================= HEADER ================= */}

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


      {/* =====================================================
          GIF FRAME
          GIF IS FITTED INSIDE THE WHITE FRAME
      ====================================================== */}

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


      {/* ================= COMPONENT NAME ================= */}

      <div className="shrink-0 text-center mt-3 mb-3">

        <h3 className="text-xl font-extrabold text-blue-700">
          {item.icon} {item.name}
        </h3>

      </div>


      {/* ================= CONTENT ================= */}

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
function Page13Recap() {
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
   QUIZ PAGE ALIASES — KEEP EXISTING QUIZ CONTENT
========================================================= */
function Page14QuizOne() {
  return <Page8Workbook />;
}

function Page15QuizTwo() {
  return <Page9Workbook />;
}

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

function Page9Workbook() {
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
          9
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


function Page10ElectronicsCover() {
  return (
    <div className="h-full w-full relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-950 flex items-center justify-center">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-cyan-400/20 blur-[100px]" />
      <div className="absolute -top-20 -right-20 w-[260px] h-[260px] rounded-full bg-blue-400/20 blur-[80px]" />
      <div className="absolute -bottom-20 -left-20 w-[280px] h-[280px] rounded-full bg-indigo-400/20 blur-[80px]" />

      {/* CIRCUIT LINES */}
      <div className="absolute top-[18%] left-0 w-[30%] h-px bg-cyan-300/50" />
      <div className="absolute top-[18%] right-0 w-[30%] h-px bg-cyan-300/50" />
      <div className="absolute bottom-[18%] left-0 w-[25%] h-px bg-blue-300/40" />
      <div className="absolute bottom-[18%] right-0 w-[25%] h-px bg-blue-300/40" />

      {/* COVER */}
      <div className="relative z-10 w-[84%] h-[84%] rounded-3xl border border-cyan-300/30 bg-white/10 backdrop-blur-md shadow-[0_25px_80px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-center px-8">

        <div className="w-24 h-24 rounded-full bg-white/15 border-2 border-cyan-300/40 flex items-center justify-center text-5xl shadow-[0_0_45px_rgba(34,211,238,0.35)] animate-pulse mb-7">
          ⚡
        </div>

        <p className="text-cyan-200 text-xs font-extrabold uppercase tracking-[0.35em] mb-4">
          Next Chapter
        </p>

        <h1 className="text-5xl font-black text-white leading-tight">
          Electronics
        </h1>

        <div className="mt-4 w-20 h-1 rounded-full bg-cyan-400" />

        <p className="mt-5 text-blue-100 text-sm font-semibold max-w-[380px] leading-relaxed">
          Explore electronic components, circuits, current, voltage and how electronic devices work together.
        </p>

        <div className="mt-8 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
            🔋
          </div>
          <span className="text-cyan-300 text-2xl">→</span>
          <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
            🔘
          </div>
          <span className="text-cyan-300 text-2xl">→</span>
          <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
            💡
          </div>
        </div>

        <p className="absolute bottom-6 text-white/50 text-[9px] font-bold uppercase tracking-[0.25em]">
          MEG-Zcuit • Interactive Electronics
        </p>
      </div>
    </div>
  );
}

