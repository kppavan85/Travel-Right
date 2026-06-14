const fs = require('fs');
const path = require('path');

const PAGE = `"use client";
import { useState, useEffect } from "react";

// ─── TOKENS ────────────────────────────────────────────────────────────────
const GOLD   = "#C9A84C";
const BG     = "#0A0D14";
const CARD   = "#0F1218";
const BORDER = "rgba(201,168,76,0.12)";
const MUTED  = "rgba(255,255,255,0.5)";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const CAT_COLOR = {
  Heritage:"#D4A844", Beach:"#38B2AC", Wildlife:"#48BB78",
  "Hill Station":"#90CDF4", Plantation:"#68D391", "Alpine Meadow":"#76E4F7",
  Valley:"#9AE6B4", Himalayan:"#E2E8F0", Cultural:"#F6AD55",
  Spiritual:"#B794F4", Backwaters:"#38B2AC", Offbeat:"#FC8181",
  Nature:"#68D391", Mountains:"#90CDF4", Island:"#38B2AC",
  Northeast:"#68D391", "Hill station":"#90CDF4",
};
const CAT_TINT = {
  Heritage:"rgba(212,168,68,0.22)", Beach:"rgba(56,178,172,0.2)", Wildlife:"rgba(72,187,120,0.2)",
  "Hill Station":"rgba(144,205,244,0.2)", Plantation:"rgba(104,211,145,0.2)",
  "Alpine Meadow":"rgba(118,228,247,0.2)", Valley:"rgba(154,230,180,0.2)",
  Himalayan:"rgba(226,232,240,0.2)", Cultural:"rgba(246,173,85,0.2)",
  Spiritual:"rgba(183,148,244,0.2)", Backwaters:"rgba(56,178,172,0.2)",
  Offbeat:"rgba(252,129,129,0.2)", Nature:"rgba(104,211,145,0.2)",
  Mountains:"rgba(144,205,244,0.2)", Island:"rgba(56,178,172,0.2)",
  Northeast:"rgba(104,211,145,0.2)",
};
const CAT_GRAD = {
  Heritage:"linear-gradient(135deg,#1a1005,#2a1a08)",
  Beach:"linear-gradient(135deg,#051525,#0a1a2a)",
  Wildlife:"linear-gradient(135deg,#051505,#0a1a0a)",
  "Hill Station":"linear-gradient(135deg,#051515,#0a1a1a)",
  Plantation:"linear-gradient(135deg,#051505,#071a07)",
  "Alpine Meadow":"linear-gradient(135deg,#051510,#071a10)",
  Valley:"linear-gradient(135deg,#051510,#051f10)",
  Himalayan:"linear-gradient(135deg,#050f1a,#081520)",
  Cultural:"linear-gradient(135deg,#150520,#1a0825)",
  Spiritual:"linear-gradient(135deg,#100520,#15081a)",
  Backwaters:"linear-gradient(135deg,#051515,#051f1a)",
  Offbeat:"linear-gradient(135deg,#150a05,#1f0f08)",
  Nature:"linear-gradient(135deg,#051510,#071a10)",
  Mountains:"linear-gradient(135deg,#050f1a,#081520)",
  Island:"linear-gradient(135deg,#051525,#0a1a2a)",
  Northeast:"linear-gradient(135deg,#051510,#071a10)",
};

const MONTH_INFO = {
  January:  { mood:"Peak India. Crystal skies, dry air, and every destination firing on all cylinders. The single best all-rounder month.", highlights:["Desert Festival Jaisalmer","Perfect beach weather across coasts","Top wildlife sightings — low vegetation"] },
  February: { mood:"All the perfection of January with the crowds beginning to ease. Flowers blooming, temples glowing.", highlights:["Khajuraho Dance Festival","Taj Mahal at its most photogenic","Wildlife parks at peak season"] },
  March:    { mood:"Last comfortable month before the heat arrives. Holi transforms everything in the third week.", highlights:["Holi in Mathura & Vrindavan","First flush Darjeeling tea harvest","Last cool fort-hopping weather"] },
  April:    { mood:"The plains heat up and the hills come alive. Kashmir blooms with tulips.", highlights:["Tulip garden Kashmir peak bloom","Rishikesh rafting season peak","Sikkim rhododendrons in full bloom"] },
  May:      { mood:"Beat the heat by going up. Ladakh opens, Spiti is silent and extraordinary.", highlights:["Ladakh season opens — all passes","Rohtang Pass opens for Manali","Ziro Valley rice planting season"] },
  June:     { mood:"Monsoon splits India — the south turns electric green while Ladakh is at peak perfection.", highlights:["Kerala and Coorg in first monsoon green","Ladakh prime season begins","Valley of Flowers opens June 1"] },
  July:     { mood:"Deep monsoon magic. Waterfalls everywhere, high Himalayas at their absolute peak.", highlights:["Ladakh and Spiti at absolute best","Valley of Flowers — peak bloom","Dzukou Valley — Nagaland lilies"] },
  August:   { mood:"India's most dramatic month — golden temples in rain, rivers full, hills impossibly green.", highlights:["Golden Temple in monsoon mist","Onam — Kerala's greatest festival","Lonavala and Mahabaleshwar at peak"] },
  September:{ mood:"Post-monsoon India at its most beautiful — freshly washed, wildlife emerging, trails drying.", highlights:["Ladakh golden and quiet","McLeod Ganj Triund Trek opens","Meghalaya root bridges freshly green"] },
  October:  { mood:"Perfect conditions everywhere. Durga Puja, Diwali approaching, parks re-opening.", highlights:["Diwali in Varanasi","Durga Puja Kolkata — UNESCO","Wildlife parks reopen Oct 1"] },
  November: { mood:"Ideal everywhere. Pushkar Camel Fair, beaches opening, Jim Corbett at its finest.", highlights:["Pushkar Camel Fair","Jim Corbett — best visibility","Dholavira and Rann accessible"] },
  December: { mood:"Peak season returns. Beaches perfect, forts glowing, Lakshadweep at maximum clarity.", highlights:["Lakshadweep diving — 30m+ visibility","Goa Christmas and New Year","Ajanta & Ellora in winter clarity"] },
};

// ─── RATING CONFIG ────────────────────────────────────────────────────────
const R_ICON  = { safety:"🛡️", beauty:"🌄", food:"🍽️", budget:"💰", transport:"🚗", crowd:"👥", weather:"🌤️", stays:"🏨" };
const R_LABEL = { safety:"Safety", beauty:"Beauty", food:"Food", budget:"Budget", transport:"Transport", crowd:"Crowd Free", weather:"Weather", stays:"Stays" };
const R_COLOR = { safety:"#48BB78", beauty:"#9F7AEA", food:"#F6AD55", budget:"#38B2AC", transport:"#FC8181", crowd:"#76E4F7", weather:"#FBD38D", stays:"#B794F4" };
const R_ORDER = ["safety","beauty","food","budget","transport","crowd","weather","stays"];

// ─── PARSE LIST ── handles JSON arrays, pipe-separated, newline-separated ──
function parseList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof raw !== "string") return [];
  const s = raw.trim();
  // JSON array string like ["item1","item2"]
  if (s.startsWith("[")) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map(String).map(x => x.trim()).filter(Boolean);
    } catch {}
  }
  // pipe-separated
  if (s.includes("|")) return s.split("|").map(x => x.trim()).filter(Boolean);
  // newline-separated
  if (s.includes("\\n")) return s.split("\\n").map(x => x.trim()).filter(Boolean);
  // single item
  return [s];
}

// ─── TRANSFORM Airtable record → UI data object ───────────────────────────
function transform(rec) {
  const tags = parseList(rec.tags).flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean);
  const must = parseList(rec.must_do);
  const warn = parseList(rec.warnings);
  const images = [rec.image_1, rec.image_2, rec.image_3].filter(Boolean);

  return {
    id:      rec.id,
    dest:    rec.destination || "",
    state:   rec.state || "",
    cat:     rec.category || "",
    nick:    rec.nickname || "",
    emoji:   rec.emoji || "🗺️",
    gem:     rec.gem === true || rec.gem === "true",
    best:    rec.best_for || "",
    month:   rec.month || "",
    dur:     rec.trip_duration || "",
    rating:  parseFloat(rec.overall_rating) || 0,
    desc:    rec.short_desc || "",
    why:     rec.why_this_month || "",
    expect:  rec.travel_intel || "",
    crowd:   rec.crowd_level || "",
    diff:    rec.difficulty || "",
    tags,
    must,
    warn,
    bMin:    parseInt(rec.budget_min) || 0,
    bMax:    parseInt(rec.budget_max) || 0,
    apt:     rec.nearest_airport || "",
    apt1Opts:rec.airport_1_options || "",
    apt2:    rec.airport_2 || "",
    apt2Opts:rec.airport_2_options || "",
    aptIns:  rec.airport_insight || "",
    rail:    rec.nearest_railway || "",
    railOpts:rec.railway_options || "",
    bus:     rec.nearest_bus || "",
    busSvcs: rec.bus_services || "",
    images,
    sub: {
      safety:    parseFloat(rec.safety)    || 0,
      beauty:    parseFloat(rec.beauty)    || 0,
      food:      parseFloat(rec.food)      || 0,
      budget:    parseFloat(rec.budget)    || 0,
      transport: parseFloat(rec.transport) || 0,
      crowd:     parseFloat(rec.crowd_free)|| 0,
      weather:   parseFloat(rec.weather)   || 0,
      stays:     parseFloat(rec.stays)     || 0,
    },
  };
}

// ─── BLOCK RATINGS ────────────────────────────────────────────────────────
function RBlocks({ label, val, color, icon }) {
  const full  = Math.floor(val);
  const half  = (val % 1) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
        <span style={{ fontSize:15, lineHeight:1 }}>{icon}</span>
        <span style={{ fontSize:12, color:MUTED, flex:1 }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:600, color }}>{val}/5</span>
      </div>
      <div style={{ display:"flex", gap:3 }}>
        {Array.from({length:full}).map((_,i)=>(
          <div key={"f"+i} style={{ flex:1, height:7, borderRadius:3, background:color }}/>
        ))}
        {half===1&&(
          <div style={{ flex:1, height:7, borderRadius:3,
            background:\`linear-gradient(to right,\${color} 55%,rgba(255,255,255,0.08) 55%)\` }}/>
        )}
        {Array.from({length:empty}).map((_,i)=>(
          <div key={"e"+i} style={{ flex:1, height:7, borderRadius:3, background:"rgba(255,255,255,0.08)" }}/>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────
function Sec({ label, children }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:GOLD,
        textTransform:"uppercase", marginBottom:10,
        display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ flex:1, height:1, background:\`linear-gradient(to right,\${GOLD}44,transparent)\` }}/>
        {label}
        <div style={{ flex:1, height:1, background:\`linear-gradient(to left,\${GOLD}44,transparent)\` }}/>
      </div>
      {children}
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────
function Card({ d, onClick }) {
  const [hov, setHov] = useState(false);
  const cc    = CAT_COLOR[d.cat] || GOLD;
  const ct    = CAT_TINT[d.cat]  || "rgba(201,168,76,0.2)";
  const bg    = CAT_GRAD[d.cat]  || "linear-gradient(135deg,#1a2030,#0a1420)";
  const img   = d.images && d.images[0];
  const isGem = d.gem;

  return (
    <div onClick={()=>onClick(d)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: isGem ? "rgba(201,168,76,0.04)" : CARD,
        borderRadius:16, overflow:"hidden", cursor:"pointer",
        border: isGem
          ? \`1px solid rgba(201,168,76,\${hov?0.65:0.4})\`
          : \`1px solid \${hov?"rgba(201,168,76,0.35)":BORDER}\`,
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: isGem
          ? \`0 0 \${hov?28:14}px rgba(201,168,76,\${hov?0.22:0.1}), 0 4px 20px rgba(0,0,0,0.3)\`
          : hov ? "0 24px 60px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.3)"
      }}>

      <div style={{ position:"relative", height:240, overflow:"hidden", background:bg }}>
        {img&&(
          <img src={img} alt={d.dest} onError={e=>{e.target.style.display="none"}}
            style={{ width:"100%", height:"100%", objectFit:"cover",
              position:"absolute", inset:0,
              filter:"contrast(1.08) saturate(1.2) brightness(0.95)",
              transform: hov?"scale(1.06)":"scale(1)",
              transition:"transform 0.5s ease" }}/>
        )}
        <div style={{ position:"absolute", inset:0,
          background:\`linear-gradient(to bottom,rgba(0,0,0,0.05) 15%,\${ct} 50%,rgba(0,0,0,0.85) 100%)\` }}/>

        {isGem
          ? <div style={{ position:"absolute", top:12, left:12, zIndex:2,
              background:"rgba(201,168,76,0.92)", borderRadius:20,
              padding:"3px 10px", fontSize:10, fontWeight:700, color:"#0a0d14" }}>
              ✦ HIDDEN GEM
            </div>
          : <div style={{ position:"absolute", top:12, left:12, zIndex:2,
              background:"rgba(0,0,0,0.5)", border:"0.5px solid rgba(255,255,255,0.15)",
              borderRadius:20, padding:"3px 10px", fontSize:11,
              color:"rgba(255,255,255,0.78)", display:"flex", alignItems:"center", gap:4 }}>
              🗓 {d.dur}
            </div>
        }

        <div style={{ position:"absolute", top:12, right:12, zIndex:2,
          background:"rgba(0,0,0,0.55)", border:\`1px solid \${cc}55\`,
          borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600, color:cc }}>
          {d.cat}
        </div>

        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 16px 16px", zIndex:2 }}>
          <div style={{ fontFamily:"'Yatra One','Cormorant Garamond',serif",
            fontSize:22, fontWeight:600, color:"#fff", lineHeight:1.2, marginBottom:6 }}>
            <span style={{ marginRight:6, fontSize:20 }}>{d.emoji}</span>{d.dest}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.65)",
              display:"flex", alignItems:"center", gap:4 }}>
              📍 {d.state}
            </span>
            <span style={{ background:"rgba(0,0,0,0.65)",
              border:\`1px solid rgba(201,168,76,0.35)\`, borderRadius:20,
              padding:"4px 10px", fontSize:13, fontWeight:700, color:GOLD }}>
              ★ {d.rating}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding:"13px 16px 17px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:600,
            color:  isGem ? "rgba(201,168,76,0.9)"  : "rgba(16,185,129,0.9)",
            background: isGem ? "rgba(201,168,76,0.1)" : "rgba(16,185,129,0.1)",
            border: isGem ? "1px solid rgba(201,168,76,0.25)" : "1px solid rgba(16,185,129,0.2)",
            borderRadius:20, padding:"2px 10px" }}>
            {isGem ? \`✦ \${d.nick}\` : d.nick}
          </span>
          <span style={{ fontSize:11, color:MUTED, fontStyle:"italic" }}>explore →</span>
        </div>
        <p style={{ fontSize:13, color:MUTED, lineHeight:1.5, margin:0,
          display:"-webkit-box", WebkitLineClamp:2,
          WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {d.desc}
        </p>
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────
function Modal({ d, onClose }) {
  const [img, setImg] = useState(0);
  const imgArr = d.images && d.images.length ? d.images : [];
  const isGem  = d.gem;

  useEffect(()=>{
    if(!imgArr.length) return;
    const t = setInterval(()=>setImg(i=>(i+1)%imgArr.length),3500);
    return ()=>clearInterval(t);
  },[imgArr.length]);

  useEffect(()=>{
    document.body.style.overflow = "hidden";
    return ()=>{ document.body.style.overflow = ""; };
  },[]);

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0,
      background:"rgba(0,0,0,0.88)", zIndex:1000, overflow:"auto", padding:"20px 16px" }}>
      <div onClick={e=>e.stopPropagation()} style={{ maxWidth:700, margin:"0 auto",
        background:BG, borderRadius:20,
        border:\`1px solid \${isGem?"rgba(201,168,76,0.4)":BORDER}\`,
        boxShadow: isGem?"0 0 40px rgba(201,168,76,0.12)":"none",
        overflow:"hidden" }}>

        {/* header */}
        <div style={{ padding:"28px 28px 0", textAlign:"center" }}>
          <div style={{ fontFamily:"'Yatra One','Cormorant Garamond',serif",
            fontSize:34, fontWeight:400, color:"#fff", lineHeight:1.1 }}>
            <span style={{ marginRight:8 }}>{d.emoji}</span>{d.dest}
          </div>
          <div style={{ fontSize:14, color:GOLD, fontStyle:"italic",
            marginTop:6, marginBottom:20, opacity:0.85 }}>
            {d.nick}
          </div>
        </div>

        {/* image carousel */}
        <div style={{ position:"relative", height:280,
          background:CAT_GRAD[d.cat]||"linear-gradient(135deg,#1a2030,#0a1420)", overflow:"hidden" }}>
          {imgArr[img]&&(
            <img src={imgArr[img]} alt={d.dest} onError={e=>{e.target.style.display="none"}}
              style={{ width:"100%", height:"100%", objectFit:"cover",
                filter:"contrast(1.08) saturate(1.2) brightness(0.92)",
                transition:"opacity 0.5s ease" }}/>
          )}
          <div style={{ position:"absolute", inset:0,
            background:"linear-gradient(to top,rgba(0,0,0,0.5),transparent 50%)" }}/>
          {imgArr.length > 1 && (
            <div style={{ position:"absolute", bottom:14, left:0, right:0,
              display:"flex", justifyContent:"center", gap:6 }}>
              {imgArr.map((_,i)=>(
                <div key={i} onClick={()=>setImg(i)}
                  style={{ width:i===img?20:6, height:6, borderRadius:3,
                    background:i===img?GOLD:"rgba(255,255,255,0.3)",
                    cursor:"pointer", transition:"all 0.3s" }}/>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding:"24px 28px" }}>
          {/* info pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8,
            marginBottom:20, justifyContent:"center" }}>
            {isGem&&(
              <span style={{ background:"rgba(201,168,76,0.12)",
                border:"1px solid rgba(201,168,76,0.4)", borderRadius:20,
                padding:"5px 12px", fontSize:12,
                color:"rgba(201,168,76,0.95)", fontWeight:600 }}>
                ✦ Hidden Gem
              </span>
            )}
            {[
              {i:"★", v:d.rating},
              {i:"📅", v:d.month},
              {i:"📍", v:d.state},
              {i:"👥", v:d.best},
              {i:"🗓", v:d.dur},
              {i:"₹",  v:\`\${(d.bMin/1000).toFixed(0)}k–\${(d.bMax/1000).toFixed(0)}k\`},
              {i:"",   v:d.cat},
            ].map((p,i)=>(
              <span key={i} style={{ background:"rgba(255,255,255,0.05)",
                border:\`1px solid \${BORDER}\`, borderRadius:20,
                padding:"5px 12px", fontSize:12, color:"rgba(255,255,255,0.8)" }}>
                {p.i&&<span style={{ marginRight:4 }}>{p.i}</span>}{p.v}
              </span>
            ))}
          </div>

          <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", lineHeight:1.7, marginBottom:20 }}>
            {d.desc}
          </p>

          <Sec label="Why This Month">
            <p style={{ fontSize:13, color:MUTED, lineHeight:1.7, margin:0 }}>{d.why}</p>
          </Sec>

          {d.expect&&(
            <Sec label="Travel Intel">
              <p style={{ fontSize:13, color:MUTED, lineHeight:1.7, margin:0 }}>{d.expect}</p>
            </Sec>
          )}

          {/* BLOCK RATINGS */}
          {d.sub&&(
            <Sec label="Ratings">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" }}>
                {R_ORDER.map(k=>d.sub[k]!=null&&d.sub[k]>0&&(
                  <RBlocks key={k} label={R_LABEL[k]} val={d.sub[k]}
                    color={R_COLOR[k]} icon={R_ICON[k]}/>
                ))}
              </div>
            </Sec>
          )}

          {/* TRANSPORT */}
          <Sec label="Getting There">
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {d.apt&&(
                <div style={{ background:"rgba(255,255,255,0.03)",
                  border:\`1px solid \${BORDER}\`, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:12, fontWeight:600,
                    color:"rgba(255,255,255,0.9)", marginBottom:4 }}>✈️ By Flight</div>
                  <div style={{ fontSize:12, color:MUTED, marginBottom:4 }}>{d.apt}</div>
                  {d.apt1Opts&&<div style={{ fontSize:11, color:MUTED, marginBottom:4 }}>{d.apt1Opts}</div>}
                  {d.apt2&&<div style={{ fontSize:12, color:MUTED, marginBottom:4 }}>{d.apt2}</div>}
                  {d.apt2Opts&&<div style={{ fontSize:11, color:MUTED, marginBottom:6 }}>{d.apt2Opts}</div>}
                  {d.aptIns&&(
                    <div style={{ fontSize:11, color:GOLD, fontStyle:"italic" }}>💡 {d.aptIns}</div>
                  )}
                </div>
              )}
              {d.rail&&(
                <div style={{ background:"rgba(255,255,255,0.03)",
                  border:\`1px solid \${BORDER}\`, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:12, fontWeight:600,
                    color:"rgba(255,255,255,0.9)", marginBottom:4 }}>🚂 By Train</div>
                  <div style={{ fontSize:12, color:MUTED, marginBottom:d.railOpts?4:0 }}>{d.rail}</div>
                  {d.railOpts&&<div style={{ fontSize:11, color:MUTED, fontStyle:"italic" }}>{d.railOpts}</div>}
                </div>
              )}
              {d.bus&&(
                <div style={{ background:"rgba(255,255,255,0.03)",
                  border:\`1px solid \${BORDER}\`, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:12, fontWeight:600,
                    color:"rgba(255,255,255,0.9)", marginBottom:4 }}>🚌 By Bus</div>
                  <div style={{ fontSize:12, color:MUTED, marginBottom:d.busSvcs?4:0 }}>{d.bus}</div>
                  {d.busSvcs&&(
                    <div style={{ fontSize:11, color:MUTED, fontStyle:"italic" }}>
                      Direct services: {d.busSvcs}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Sec>

          {/* MUST DO */}
          {d.must&&d.must.length>0&&(
            <Sec label="Must Do">
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {d.must.map((m,i)=>(
                  <span key={i} style={{ background:"rgba(72,187,120,0.08)",
                    border:"1px solid rgba(72,187,120,0.2)", borderRadius:20,
                    padding:"5px 12px", fontSize:12, color:"rgba(72,187,120,0.9)",
                    display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ color:"rgba(72,187,120,0.6)" }}>✓</span>{m}
                  </span>
                ))}
              </div>
            </Sec>
          )}

          {/* WARNINGS */}
          {d.warn&&d.warn.length>0&&(
            <Sec label="Key Warnings">
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {d.warn.map((w,i)=>(
                  <div key={i} style={{ background:"rgba(246,173,85,0.06)",
                    border:"1px solid rgba(246,173,85,0.2)", borderRadius:10,
                    padding:"10px 14px", fontSize:12, color:"rgba(246,173,85,0.85)",
                    display:"flex", gap:8, alignItems:"flex-start" }}>
                    <span style={{ marginTop:1, opacity:0.7 }}>⚠️</span>{w}
                  </div>
                ))}
              </div>
            </Sec>
          )}

          {/* TAGS */}
          {d.tags&&d.tags.length>0&&(
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:4 }}>
              {d.tags.map((t,i)=>(
                <span key={i} style={{ background:"rgba(255,255,255,0.04)",
                  border:\`1px solid \${BORDER}\`, borderRadius:20,
                  padding:"3px 10px", fontSize:11, color:MUTED }}>
                  #{t.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <button onClick={onClose} style={{ display:"block", width:"100%",
          padding:"16px", background:"rgba(201,168,76,0.08)", border:"none",
          borderTop:\`1px solid \${BORDER}\`, color:GOLD, fontSize:13,
          fontWeight:600, cursor:"pointer", letterSpacing:"0.05em" }}>
          CLOSE
        </button>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [month,        setMonth]        = useState("January");
  const [selected,     setSelected]     = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // Load fonts
  useEffect(()=>{
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Yatra+One&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Nunito+Sans:wght@300;400;600&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
  },[]);

  // Fetch all destinations once
  useEffect(()=>{
    fetch("/api/destinations")
      .then(r=>r.json())
      .then(data=>{
        if(data.records){
          setDestinations(data.records.map(transform));
        } else {
          setError("Failed to load destinations.");
        }
        setLoading(false);
      })
      .catch(()=>{ setError("Network error."); setLoading(false); });
  },[]);

  const filtered = destinations.filter(d=>d.month===month);
  const info     = MONTH_INFO[month] || {};

  return (
    <div style={{ minHeight:"100vh", background:BG, color:"#fff",
      fontFamily:"'Nunito Sans',sans-serif" }}>

      {/* HERO */}
      <div style={{ textAlign:"center", padding:"44px 24px 28px" }}>
        <h1 style={{ fontFamily:"'Yatra One',serif",
          fontSize:"clamp(36px,6vw,58px)", fontWeight:400,
          lineHeight:1.1, margin:"0 0 16px", letterSpacing:"0.01em" }}>
          <span style={{ color:"#fff" }}>Travel </span>
          <span style={{ color:GOLD }}>Right</span>
        </h1>
        <div style={{ display:"flex", alignItems:"center",
          justifyContent:"center", gap:12, marginBottom:14 }}>
          <div style={{ height:1, width:60,
            background:\`linear-gradient(to right,transparent,\${GOLD}66)\` }}/>
          <span style={{ color:GOLD, fontSize:16 }}>✦</span>
          <div style={{ height:1, width:60,
            background:\`linear-gradient(to left,transparent,\${GOLD}66)\` }}/>
        </div>
        <p style={{ fontSize:"clamp(13px,2vw,16px)",
          color:"rgba(255,255,255,0.65)", margin:0, letterSpacing:"0.01em" }}>
          Find the right destination at the right time.
        </p>
      </div>

      {/* MONTH SELECTOR */}
      <div style={{ padding:"0 24px 28px", maxWidth:900, margin:"0 auto" }}>
        <div style={{ border:\`1px solid \${BORDER}\`, borderRadius:50,
          padding:"6px 8px", display:"flex", gap:2 }}>
          {MONTHS.map(m=>(
            <button key={m} onClick={()=>setMonth(m)}
              style={{ flex:1, padding:"8px 4px", borderRadius:40, border:"none",
                cursor:"pointer", fontWeight:month===m?700:400,
                fontSize:"clamp(10px,1.2vw,12px)",
                background: month===m ? GOLD : "transparent",
                color: month===m ? "#0a0d14" : "rgba(255,255,255,0.6)",
                transition:"all 0.25s", whiteSpace:"nowrap",
                textAlign:"center", letterSpacing:month===m?"0.02em":0 }}>
              {m.slice(0,3)}
            </button>
          ))}
        </div>
      </div>

      {/* MONTH MOOD */}
      <div style={{ maxWidth:900, margin:"0 auto",
        padding:"0 24px 32px", textAlign:"center" }}>
        <p style={{ fontSize:15, color:"rgba(255,255,255,0.65)",
          lineHeight:1.7, margin:"0 0 12px" }}>
          {info.mood}
        </p>
        {info.highlights&&(
          <div style={{ display:"flex", flexWrap:"wrap",
            justifyContent:"center", gap:8 }}>
            {info.highlights.map((h,i)=>(
              <span key={i} style={{ fontSize:12, color:GOLD,
                background:"rgba(201,168,76,0.08)",
                border:\`1px solid rgba(201,168,76,0.2)\`,
                borderRadius:20, padding:"4px 12px" }}>
                {h}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CARDS */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px 60px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:MUTED }}>
            <div style={{ fontSize:32, marginBottom:16 }}>✦</div>
            <div style={{ fontSize:14 }}>Loading destinations…</div>
          </div>
        ) : error ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(252,129,129,0.8)" }}>
            {error}
          </div>
        ) : (
          <>
            <div style={{ fontSize:13, color:MUTED, marginBottom:20 }}>
              {filtered.length} destination{filtered.length!==1?"s":""} this month
            </div>
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:24 }}>
              {filtered.map(d=>(
                <Card key={d.id} d={d} onClick={setSelected}/>
              ))}
              {filtered.length===0&&(
                <div style={{ gridColumn:"1/-1", textAlign:"center",
                  padding:"60px 0", color:MUTED, fontSize:14 }}>
                  No destinations for {month} yet.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selected&&(
        <Modal d={selected} onClose={()=>setSelected(null)}/>
      )}
    </div>
  );
}
`;

const ROUTE = `import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

function url(v) {
  if (!v) return null;
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && v[0]) return v[0].url || null;
  return null;
}

function sel(v) {
  if (!v) return null;
  if (typeof v === 'object' && v.name) return v.name;
  return v;
}

export async function GET() {
  try {
    const rows = await base(process.env.AIRTABLE_TABLE_ID)
      .select({ pageSize: 100 })
      .all();

    const records = rows.map(r => ({
      id:                r.id,
      destination:       r.get('destination'),
      state:             r.get('state'),
      category:          sel(r.get('category')),
      nickname:          r.get('nickname'),
      emoji:             r.get('emoji'),
      gem:               r.get('is_hidden_gem'),
      best_for:          r.get('best_for'),
      month:             r.get('month_text') || sel(r.get('month')),
      trip_duration:     r.get('trip_duration'),
      overall_rating:    r.get('overall_rating'),
      safety:            r.get('safety_rating'),
      beauty:            r.get('beauty_rating'),
      food:              r.get('food_rating'),
      budget:            r.get('budget_rating'),
      transport:         r.get('transport_rating'),
      crowd_free:        r.get('crowd_free_rating'),
      weather:           r.get('weather_rating'),
      stays:             r.get('stays_rating'),
      short_desc:        r.get('short_description'),
      tags:              r.get('tags'),
      why_this_month:    r.get('why_this_month'),
      travel_intel:      r.get('travel_intel'),
      must_do:           r.get('must_do'),
      warnings:          r.get('warnings'),
      budget_min:        r.get('budget_min_inr'),
      budget_max:        r.get('budget_max_inr'),
      nearest_airport:   r.get('nearest_airport'),
      airport_1_options: r.get('airport_1_options'),
      airport_2:         r.get('airport_2'),
      airport_2_options: r.get('airport_2_options'),
      airport_insight:   r.get('airport_insight'),
      nearest_railway:   r.get('nearest_railway'),
      railway_options:   r.get('railway_travel_options'),
      nearest_bus:       r.get('nearest_bus_stand'),
      bus_services:      r.get('bus_direct_services'),
      image_1:           url(r.get('image_1_url')),
      image_2:           url(r.get('image_2_url')),
      image_3:           url(r.get('image_3_url')),
    }));

    return Response.json({ records });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
`;

const appDir = path.join(__dirname, 'app');
const apiDir = path.join(__dirname, 'app', 'api', 'destinations');
fs.mkdirSync(apiDir, { recursive: true });
fs.writeFileSync(path.join(appDir, 'page.js'), PAGE, 'utf8');
fs.writeFileSync(path.join(apiDir, 'route.js'), ROUTE, 'utf8');
console.log('app/page.js written');
console.log('app/api/destinations/route.js written');
console.log('Done! Run: rmdir /s /q .next && npm run dev');
