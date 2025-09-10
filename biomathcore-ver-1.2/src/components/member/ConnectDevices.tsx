"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Provider = {
  key: string;
  name: string;
  brand?: string;
  description?: string;
  connected: boolean;
  docs?: string;
};
type ProvidersResponse = { providers: Provider[] };

export default function ConnectDevices() {
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/providers", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: ctrl.signal,
      });
      if (!res.ok)
        throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
      const data = (await res.json()) as ProvidersResponse;
      if (!data || !Array.isArray(data.providers))
        throw new Error("Bad API response.");
      setProviders(data.providers);
    } catch (e: any) {
      if (e?.name !== "AbortError")
        setError(e?.message ?? "Failed to load providers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    return () => abortRef.current?.abort();
  }, []);

  const total = providers?.length ?? 0;
  const connected = useMemo(
    () => (providers ? providers.filter((p) => p.connected).length : 0),
    [providers],
  );

 
  const forceHorizontal = {
    writingMode: "horizontal-tb" as const,
    transform: "none",
    whiteSpace: "normal" as const,
  };
  const breakText = {
    overflowWrap: "anywhere" as const,
    wordBreak: "break-word" as const,
    hyphens: "auto" as const,
  };

  return (
    <section
      aria-labelledby="dev-heading"
      style={{
        ...forceHorizontal,
        unicodeBidi: "plaintext",
      }}
    >
      {}
      <div
        style={{
          ...forceHorizontal,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h3
            id="dev-heading"
            style={{
              ...forceHorizontal,
              ...breakText,
              margin: 0,
              color: "rgba(255,255,255,0.92)",
              fontWeight: 700,
              fontSize: "1.1rem",
              lineHeight: 1.3,
            }}
          >
            Connect Devices
          </h3>
          <p
            style={{
              ...forceHorizontal,
              ...breakText,
              margin: "4px 0 0",
              color: "rgba(255,255,255,0.6)",
              fontSize: ".95rem",
              maxWidth: "60ch",
            }}
          >
            Link your wearables and apps to unlock live biometrics and richer
            reports.
          </p>
        </div>

        <div
          style={{
            ...forceHorizontal,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {providers && (
            <span
              style={{
                ...forceHorizontal,
                ...breakText,
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 8px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.78)",
                fontSize: 12,
              }}
              title="How many devices are connected"
            >
              Connected: {connected}/{total}
            </span>
          )}

          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
            title="Refresh"
            style={{
              ...forceHorizontal,
              ...breakText,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.92)",
              fontSize: ".95rem",
              cursor: "pointer",
            }}
          >
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>
      </div>

      {}
      <div
        style={{
          height: 1,
          margin: "8px 0 14px",
          borderRadius: 2,
          background:
            "linear-gradient(90deg, rgba(34,211,238,.35), rgba(217,70,239,.35), rgba(139,92,246,.35))",
        }}
      />

      {}
      {error && (
        <div
          style={{
            ...forceHorizontal,
            ...breakText,
            background: "rgba(248,113,113,.08)",
            border: "1px solid rgba(248,113,113,.35)",
            borderRadius: 14,
            padding: "12px 14px",
            color: "#fecaca",
            fontSize: ".95rem",
            marginBottom: 8,
          }}
        >
          Failed to load providers: {error}
        </div>
      )}
      {loading && !providers && (
        <div
          style={{
            ...forceHorizontal,
            ...breakText,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
            borderRadius: 14,
            padding: "12px 14px",
            color: "rgba(255,255,255,0.78)",
            fontSize: ".95rem",
            marginBottom: 8,
          }}
        >
          Loading providers…
        </div>
      )}
      {!loading && providers && providers.length === 0 && (
        <div
          style={{
            ...forceHorizontal,
            ...breakText,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
            borderRadius: 14,
            padding: "12px 14px",
            color: "rgba(255,255,255,0.78)",
            fontSize: ".95rem",
            marginBottom: 8,
          }}
        >
          No integrations available yet.
        </div>
      )}

      {}
      {providers && providers.length > 0 && (
        <div
          
          style={{
            ...forceHorizontal,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 6,
          }}
        >
          <div
            
            className="cd_wrap"
            style={{
              ...forceHorizontal,
              display: "flex",
              gap: 16,
              minHeight: 1,
            }}
          >
            {providers.map((p) => {
              const statusEl = (
                <span
                  style={{
                    ...forceHorizontal,
                    ...breakText,
                    flex: "0 0 auto",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "2px 8px",
                    borderRadius: 8,
                    border: `1px solid ${p.connected ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.10)"}`,
                    background: p.connected
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(255,255,255,.06)",
                    color: p.connected
                      ? "rgb(110,231,183)"
                      : "rgba(255,255,255,0.78)",
                    fontSize: 12,
                  }}
                  title={p.connected ? "Connected" : "Not Connected"}
                >
                  {p.connected ? "Connected" : "Not Connected"}
                </span>
              );

              return (
                <article
                  key={p.key}
                  style={{
                    ...forceHorizontal,
                    position: "relative",
                    minWidth: 280,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 18,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    overflow: "hidden",
                  }}
                >
                  <header
                    style={{
                      ...forceHorizontal,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div style={{ ...forceHorizontal, minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          ...forceHorizontal,
                          ...breakText,
                          color: "rgba(255,255,255,0.92)",
                          fontWeight: 700,
                          fontSize: "1rem",
                          lineHeight: 1.25,
                        }}
                        title={p.name}
                      >
                        {p.name}
                      </div>
                      {p.brand && (
                        <div
                          style={{
                            ...forceHorizontal,
                            ...breakText,
                            color: "rgba(255,255,255,0.60)",
                            fontSize: 12,
                            marginTop: 2,
                          }}
                          title={p.brand}
                        >
                          {p.brand}
                        </div>
                      )}
                    </div>
                    {statusEl}
                  </header>

                  {p.description && (
                    <p
                      style={{
                        ...forceHorizontal,
                        ...breakText,
                        color: "rgba(255,255,255,0.78)",
                        fontSize: ".95rem",
                        margin: "2px 0 8px",
                        display: "-webkit-box",
                        WebkitLineClamp: 6,
                        lineClamp: 6 as any,
                        WebkitBoxOrient: "vertical" as any,
                        overflow: "hidden",
                      }}
                      title={p.description}
                    >
                      {p.description}
                    </p>
                  )}

                  <footer
                    style={{
                      ...forceHorizontal,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: "auto",
                      paddingTop: 4,
                    }}
                  >
                    {p.connected ? (
                      <Link
                        href={`/integrations/${encodeURIComponent(p.key)}/manage`}
                        prefetch={false}
                        style={{
                          ...forceHorizontal,
                          ...breakText,
                          flex: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "9px 12px",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.10)",
                          background: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.92)",
                          textDecoration: "none",
                          fontSize: ".95rem",
                          fontWeight: 600,
                        }}
                        aria-label={`Manage ${p.name}`}
                      >
                        Manage
                      </Link>
                    ) : (
                      <Link
                        href={`/integrations/${encodeURIComponent(p.key)}/connect`}
                        prefetch={false}
                        style={{
                          ...forceHorizontal,
                          ...breakText,
                          flex: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "9px 12px",
                          borderRadius: 10,
                          border: "none",
                          background: "rgba(8,145,178,0.92)",
                          color: "#fff",
                          textDecoration: "none",
                          fontSize: ".95rem",
                          fontWeight: 700,
                        }}
                        aria-label={`Connect ${p.name}`}
                      >
                        Connect
                      </Link>
                    )}

                    {p.docs && (
                      <a
                        href={p.docs}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          ...forceHorizontal,
                          ...breakText,
                          flex: "0 0 auto",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 10px",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.10)",
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.78)",
                          textDecoration: "none",
                          fontSize: 12,
                        }}
                        aria-label={`${p.name} docs`}
                      >
                        Docs
                      </a>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>

          {}
          <style jsx>{`
            @media (min-width: 1024px) {
              .cd_wrap {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 16px;
              }
            }
            @media (min-width: 1280px) {
              .cd_wrap {
                grid-template-columns: repeat(4, minmax(0, 1fr));
              }
            }
          `}</style>
        </div>
      )}
    </section>
  );
}
