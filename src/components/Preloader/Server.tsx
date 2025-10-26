export default function ServerPreloader() {
  return (
    <>
      <div
        id="ssr-preloader"
        role="status"
        aria-busy="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40, // SSR di bawah Client
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "wait",
        }}
      >
        {/* SOLID BASE: menutup total konten di bawah */}
        <div
          className="ssr-solid-bg"
          style={{ position: "absolute", inset: 0, backgroundColor: "#ffffff" }}
        />

        {/* Background - Light (non-transparan) */}
        <div
          className="ssr-bg-light"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #ffffff 100%)",
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Background - Dark */}
        <div
          className="ssr-bg-dark"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Orbs - Light */}
        <div
          className="ssr-orb-1 ssr-orb-light"
          style={{
            position: "absolute",
            top: "5rem",
            left: "5rem",
            width: "16rem",
            height: "16rem",
            backgroundColor: "rgba(191, 219, 254, 0.1)",
            borderRadius: "50%",
            filter: "blur(48px)",
            animationDuration: "4s",
            transition: "opacity 0.3s ease",
          }}
        />
        <div
          className="ssr-orb-2 ssr-orb-light"
          style={{
            position: "absolute",
            bottom: "5rem",
            right: "5rem",
            width: "20rem",
            height: "20rem",
            backgroundColor: "rgba(147, 197, 253, 0.1)",
            borderRadius: "50%",
            filter: "blur(48px)",
            animationDuration: "5s",
            animationDelay: "1s",
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Orbs - Dark */}
        <div
          className="ssr-orb-1 ssr-orb-dark"
          style={{
            position: "absolute",
            top: "5rem",
            left: "5rem",
            width: "16rem",
            height: "16rem",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            borderRadius: "50%",
            filter: "blur(48px)",
            animationDuration: "4s",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />
        <div
          className="ssr-orb-2 ssr-orb-dark"
          style={{
            position: "absolute",
            bottom: "5rem",
            right: "5rem",
            width: "20rem",
            height: "20rem",
            backgroundColor: "rgba(96, 165, 250, 0.05)",
            borderRadius: "50%",
            filter: "blur(48px)",
            animationDuration: "5s",
            animationDelay: "1s",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Main Content */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          {/* Spinner */}
          <div style={{ position: "relative", margin: "0 auto 2rem", width: "4rem", height: "4rem" }}>
            <div
              className="ssr-spinner"
              style={{
                width: "4rem",
                height: "4rem",
                border: "4px solid rgba(219, 234, 254, 1)",
                borderTop: "4px solid rgb(37, 99, 235)",
                borderRadius: "50%",
                animation: "ssrspin 1s linear infinite",
                transition: "border-color 0.3s ease",
              }}
            />
            <div
              className="ssr-spinner-dot"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "2rem",
                height: "2rem",
                backgroundColor: "rgb(37, 99, 235)",
                borderRadius: "50%",
                animation: "ssrpulse 2s ease-in-out infinite",
                transition: "background-color 0.3s ease",
              }}
            />
          </div>

          {/* Brand + divider + teks (TANPA % di SSR) */}
          <div>
            <h2
              className="pre-title font-playfair"
              style={{
                fontSize: "1.5rem",
                fontWeight: 300,
                letterSpacing: "0.1em",
                color: "#374151",
                marginBottom: "0.5rem",
                fontFamily: "var(--font-playfair)",
                transition: "color 0.3s ease",
                visibility: "hidden", // tampil saat html.font-ready
              }}
            >
              Veda Bezaleel
            </h2>
            <div
              className="pre-divider"
              style={{
                width: "6rem",
                height: "2px",
                background: "linear-gradient(90deg, transparent 0%, rgb(37, 99, 235) 50%, transparent 100%)",
                margin: "0 auto 1rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="pre-divider-shimmer"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  animation: "ssrshimmer 2s infinite",
                }}
              />
            </div>

            <p className="pre-loading" style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500, margin: 0 }}>
              Loading...
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ssrspin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
            @keyframes ssrpulse { 0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1);} 50% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.95);} }
            @keyframes ssrorbpulse { 0%, 100% { opacity: 1;} 50% { opacity: 0.5;} }
            @keyframes ssrshimmer { 0% { transform: translateX(-100%);} 100% { transform: translateX(100%);} }
            .ssr-orb-1, .ssr-orb-2 { animation: ssrorbpulse 4s ease-in-out infinite; }

            /* Dark mode */
            .dark .ssr-solid-bg { background-color: #020617; }
            .dark .ssr-bg-light { opacity: 0 !important; }
            .dark .ssr-bg-dark  { opacity: 1 !important; }
            .dark .ssr-orb-light { opacity: 0 !important; }
            .dark .ssr-orb-dark  { opacity: 1 !important; }
            .dark .ssr-spinner { border: 4px solid rgba(30, 58, 138, 1) !important; border-top: 4px solid rgb(96, 165, 250) !important; }
            .dark .ssr-spinner-dot { background-color: rgb(96, 165, 250) !important; }
            .dark .pre-title { color: #e5e7eb !important; }
            .dark .pre-loading { color: #9ca3af !important; }
            .dark .pre-divider { background: linear-gradient(90deg, transparent 0%, rgb(96, 165, 250) 50%, transparent 100%) !important; }

            /* Font siap → tampilkan brand agar tidak FOIT/shift */
            .font-ready .pre-title { visibility: visible !important; }
          `,
        }}
      />
    </>
  );
}
