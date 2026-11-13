'use strict';
'require view';
'require form';
'require poll';
'require rpc';
'require ui';
'require uci';

var callStatus = rpc.declare({
    object: 'auto-pci-cell',
    method: 'status',
    expect: {}
});

var callPorts = rpc.declare({
    object: 'auto-pci-cell',
    method: 'ports',
    expect: { ports: [] }
});

var callTest = rpc.declare({
    object: 'auto-pci-cell',
    method: 'test_port',
    params: [ 'port' ],
    expect: {}
});

var callFxsStatus = rpc.declare({
    object: 'fxs',
    method: 'status',
    expect: {}
});

var callClearHistory = rpc.declare({
    object: 'auto-pci-cell',
    method: 'clear_history',
    expect: {}
});

var CSS = [
    '@keyframes apc-spin {',
    '  0% { transform: rotate(0deg); }',
    '  100% { transform: rotate(360deg); }',
    '}',
    '@keyframes apc-swap-flash {',
    '  0% { box-shadow: 0 0 0 2px #16a34a; background: rgba(22,163,74,0.22); }',
    '  100% { box-shadow: none; }',
    '}',
    '@keyframes apc-dot-tick {',
    '  0% { opacity: 0.35; transform: scale(0.82); box-shadow: 0 0 0 0 rgba(22,163,74,0.75); }',
    '  35% { opacity: 1; transform: scale(1.08); box-shadow: 0 0 0 4px rgba(22,163,74,0.18); }',
    '  100% { opacity: 0.88; transform: scale(1); box-shadow: 0 0 0 6px rgba(22,163,74,0); }',
    '}',
    '@keyframes apc-amber-pulse {',
    '  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(234,179,8,0.55); }',
    '  50% { opacity: 0.35; transform: scale(0.86); box-shadow: 0 0 0 4px rgba(234,179,8,0); }',
    '}',
    '@keyframes apc-time-tick {',
    '  0% { opacity: 0.55; transform: translateY(-1px); }',
    '  100% { opacity: 1; transform: translateY(0); }',
    '}',
    '@keyframes apc-fade {',
    '  0% { opacity: 0.4; transform: translateY(2px); }',
    '  100% { opacity: 1; transform: translateY(0); }',
    '}',
    '@keyframes apc-rj11-rock {',
    '  0%, 100% { transform: rotate(0deg); }',
    '  15% { transform: rotate(-3.4deg); }',
    '  30% { transform: rotate(3.4deg); }',
    '  45% { transform: rotate(-2.8deg); }',
    '  60% { transform: rotate(2.8deg); }',
    '  75% { transform: rotate(-1.5deg); }',
    '}',
    '@keyframes apc-rj11-wave-in {',
    '  0%, 100% { opacity: 0.18; }',
    '  35%, 65% { opacity: 1; }',
    '}',
    '@keyframes apc-rj11-wave-out {',
    '  0%, 20%, 100% { opacity: 0.1; }',
    '  55%, 80% { opacity: 0.95; }',
    '}',
    '@keyframes apc-rj11-key-blink {',
    '  0%, 100% { fill: #8e96a0; r: 3.3px; }',
    '  50% { fill: #eab308; r: 4.1px; }',
    '}',
    '.apc-wrapper {',
    '  --apc-ok: #16a34a;',
    '  --apc-warn: #d97706;',
    '  --apc-bad: #dc2626;',
    '  --apc-info: #2563eb;',
    '  --apc-line: rgba(127,127,127,0.26);',
    '  --apc-soft: rgba(127,127,127,0.08);',
    '  width: 100%;',
    '  max-width: 860px;',
    '  margin: 0 auto 1.5em auto;',
    '  padding: 0 6px;',
    '  box-sizing: border-box;',
    '}',
    '.apc-swapped {',
    '  animation: apc-swap-flash 0.48s ease-out !important;',
    '}',
    '.apc-head-wrap {',
    '  margin: 4px 0 14px 0;',
    '  padding: 0;',
    '  background: transparent !important;',
    '  border: 0 !important;',
    '  box-shadow: none !important;',
    '}',
    '.apc-head {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  align-items: center;',
    '  gap: 8px;',
    '  margin: 0 0 3px 0;',
    '  padding: 0;',
    '  background: transparent !important;',
    '}',
    '.apc-head-title {',
    '  margin: 0 !important;',
    '  padding: 0 !important;',
    '  border: 0 !important;',
    '  background: transparent !important;',
    '  background-color: transparent !important;',
    '  box-shadow: none !important;',
    '  font-size: 1.38em !important;',
    '  font-weight: 700 !important;',
    '  line-height: 1.22 !important;',
    '  color: inherit !important;',
    '}',
    '.apc-sub-desc {',
    '  margin: 0 0 7px 0 !important;',
    '  padding: 0 !important;',
    '  font-size: 0.88em;',
    '  line-height: 1.42;',
    '  opacity: 0.78;',
    '  background: transparent !important;',
    '}',
    '.apc-time-bar {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 7px;',
    '  padding: 3px 10px;',
    '  border-radius: 999px;',
    '  background: rgba(127,127,127,0.1);',
    '  border: 1px solid rgba(127,127,127,0.22);',
    '  font-size: 0.82em;',
    '  font-weight: 600;',
    '  font-variant-numeric: tabular-nums;',
    '}',
    '.apc-time-dot {',
    '  display: inline-block;',
    '  width: 7px;',
    '  height: 7px;',
    '  border-radius: 50%;',
    '  background: #16a34a;',
    '  flex-shrink: 0;',
    '}',
    '.apc-time-dot.apc-dot-tick {',
    '  animation: apc-dot-tick 0.55s ease-out;',
    '}',
    '.apc-time-text {',
    '  opacity: 0.88;',
    '  display: inline-block;',
    '}',
    '.apc-time-text.apc-time-tick {',
    '  animation: apc-time-tick 0.32s ease-out;',
    '}',
    '.apc-pill {',
    '  display: inline-block;',
    '  padding: 0.22em 0.75em;',
    '  border-radius: 999px;',
    '  font-size: 0.84em;',
    '  font-weight: 600;',
    '  color: #ffffff;',
    '  background: #6b7280;',
    '  white-space: nowrap;',
    '}',
    '.apc-pill.ok { background: var(--apc-ok); }',
    '.apc-pill.warn { background: var(--apc-warn); }',
    '.apc-pill.bad { background: var(--apc-bad); }',
    '.apc-pill.info { background: var(--apc-info); }',
    '.apc-grid {',
    '  display: grid;',
    '  grid-template-columns: 1fr;',
    '  gap: 0.75em;',
    '  margin-bottom: 1.15em;',
    '}',
    '.apc-card {',
    '  border: 1px solid var(--apc-line);',
    '  border-radius: 10px;',
    '  background: var(--apc-soft);',
    '  padding: 0.9em 1em;',
    '  min-width: 0;',
    '}',
    '.apc-card h4 {',
    '  margin: 0 0 0.45em 0 !important;',
    '  padding: 0 !important;',
    '  border: 0 !important;',
    '  background: none !important;',
    '  font-size: 0.78em !important;',
    '  font-weight: 600 !important;',
    '  text-transform: uppercase;',
    '  letter-spacing: 0.05em;',
    '  opacity: 0.7;',
    '}',
    '.apc-big {',
    '  font-size: 1.45em;',
    '  font-weight: 700;',
    '  line-height: 1.25;',
    '  font-variant-numeric: tabular-nums;',
    '}',
    '.apc-sub {',
    '  margin-top: 0.3em;',
    '  font-size: 0.88em;',
    '  opacity: 0.8;',
    '  font-variant-numeric: tabular-nums;',
    '}',
    '.apc-card-switch {',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  gap: 12px;',
    '  padding: 0.82em 1em;',
    '  transition: border-color 0.22s ease, background 0.22s ease;',
    '}',
    '.apc-card-switch.is-call-active {',
    '  border-color: rgba(217,119,6,0.52);',
    '  background: linear-gradient(90deg, rgba(127,127,127,0.08) 0%, rgba(217,119,6,0.09) 100%);',
    '}',
    '.apc-card-switch.is-ringing {',
    '  border-color: rgba(234,179,8,0.62);',
    '  background: linear-gradient(90deg, rgba(127,127,127,0.08) 0%, rgba(234,179,8,0.12) 100%);',
    '}',
    '.apc-switch-left {',
    '  flex: 1 1 auto;',
    '  min-width: 0;',
    '}',
    '.apc-rj11-widget {',
    '  flex: 0 0 auto;',
    '  display: flex;',
    '  flex-direction: column;',
    '  align-items: center;',
    '  justify-content: center;',
    '  min-width: 118px;',
    '  user-select: none;',
    '}',
    '.apc-rj11-svg {',
    '  width: 90px;',
    '  height: 62px;',
    '  overflow: visible;',
    '  display: block;',
    '}',
    '.apc-rj11-phone {',
    '  transform-origin: 90px 85px;',
    '}',
    '.apc-rj11-base {',
    '  fill: #393e46;',
    '  stroke: #8e96a0;',
    '  stroke-width: 2.6;',
    '  stroke-linejoin: round;',
    '}',
    '.apc-rj11-plunger {',
    '  fill: #8e96a0;',
    '  transition: transform 0.22s ease;',
    '}',
    '.apc-rj11-key {',
    '  fill: #8e96a0;',
    '  transition: fill 0.15s ease;',
    '}',
    '.apc-rj11-cord {',
    '  fill: none;',
    '  stroke: #8e96a0;',
    '  stroke-width: 2.6;',
    '  stroke-dasharray: 4 4.5;',
    '  stroke-linecap: round;',
    '}',
    '.apc-rj11-handset {',
    '  transform-origin: 90px 34px;',
    '  transition: transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);',
    '}',
    '.apc-rj11-handset-path {',
    '  fill: #57606a;',
    '  stroke: #9ca3af;',
    '  stroke-width: 2.6;',
    '  stroke-linejoin: round;',
    '  transition: fill 0.2s ease, stroke 0.2s ease;',
    '}',
    '.apc-rj11-wave {',
    '  fill: none;',
    '  stroke: #c58e11;',
    '  stroke-width: 3;',
    '  stroke-linecap: round;',
    '  opacity: 0;',
    '  transition: opacity 0.18s ease;',
    '}',
    '.apc-rj11-widget.st-dialtone .apc-rj11-handset,',
    '.apc-rj11-widget.st-dialing .apc-rj11-handset,',
    '.apc-rj11-widget.st-calling .apc-rj11-handset,',
    '.apc-rj11-widget.st-connected .apc-rj11-handset {',
    '  transform: translate(-3px, -11px) rotate(-11deg);',
    '}',
    '.apc-rj11-widget.st-dialtone .apc-rj11-handset-path,',
    '.apc-rj11-widget.st-dialing .apc-rj11-handset-path,',
    '.apc-rj11-widget.st-calling .apc-rj11-handset-path,',
    '.apc-rj11-widget.st-connected .apc-rj11-handset-path {',
    '  fill: #c58e11;',
    '  stroke: #cbd5e1;',
    '}',
    '.apc-rj11-widget.st-dialtone .apc-rj11-plunger,',
    '.apc-rj11-widget.st-dialing .apc-rj11-plunger,',
    '.apc-rj11-widget.st-calling .apc-rj11-plunger,',
    '.apc-rj11-widget.st-connected .apc-rj11-plunger {',
    '  transform: translateY(-2.5px);',
    '}',
    '.apc-rj11-widget.st-dialing .apc-rj11-key.k1 { animation: apc-rj11-key-blink 1.2s infinite 0.0s; }',
    '.apc-rj11-widget.st-dialing .apc-rj11-key.k5 { animation: apc-rj11-key-blink 1.2s infinite 0.25s; }',
    '.apc-rj11-widget.st-dialing .apc-rj11-key.k9 { animation: apc-rj11-key-blink 1.2s infinite 0.5s; }',
    '.apc-rj11-widget.st-dialing .apc-rj11-key.k3 { animation: apc-rj11-key-blink 1.2s infinite 0.75s; }',
    '.apc-rj11-widget.st-dialing .apc-rj11-key.k7 { animation: apc-rj11-key-blink 1.2s infinite 1.0s; }',
    '.apc-rj11-widget.st-ringing .apc-rj11-phone {',
    '  animation: apc-rj11-rock 0.55s infinite ease-in-out;',
    '}',
    '.apc-rj11-widget.st-ringing .apc-rj11-wave.w-inner {',
    '  animation: apc-rj11-wave-in 0.9s infinite ease-in-out;',
    '}',
    '.apc-rj11-widget.st-ringing .apc-rj11-wave.w-outer {',
    '  animation: apc-rj11-wave-out 0.9s infinite ease-in-out;',
    '}',
    '.apc-rj11-pill {',
    '  margin-top: 4px;',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 5px;',
    '  padding: 2px 9px;',
    '  border-radius: 999px;',
    '  background: rgba(127,127,127,0.12);',
    '  border: 1px solid rgba(127,127,127,0.24);',
    '  font-size: 0.74em;',
    '  font-weight: 600;',
    '  line-height: 1.32;',
    '  white-space: nowrap;',
    '}',
    '.apc-rj11-dot {',
    '  width: 6.5px;',
    '  height: 6.5px;',
    '  border-radius: 50%;',
    '  background: #22c55e;',
    '  flex-shrink: 0;',
    '}',
    '.apc-rj11-widget.st-off .apc-rj11-dot {',
    '  background: #6b7280;',
    '}',
    '.apc-rj11-widget.st-dialtone .apc-rj11-dot,',
    '.apc-rj11-widget.st-dialing .apc-rj11-dot,',
    '.apc-rj11-widget.st-calling .apc-rj11-dot,',
    '.apc-rj11-widget.st-ringing .apc-rj11-dot,',
    '.apc-rj11-widget.st-connected .apc-rj11-dot {',
    '  background: #eab308;',
    '  animation: apc-amber-pulse 1.15s infinite ease-in-out;',
    '}',
    '.apc-rj11-peer {',
    '  margin-top: 2px;',
    '  font-size: 0.73em;',
    '  font-weight: 600;',
    '  font-variant-numeric: tabular-nums;',
    '  font-family: monospace;',
    '  opacity: 0.86;',
    '  line-height: 1.2;',
    '  max-width: 124px;',
    '  overflow: hidden;',
    '  text-overflow: ellipsis;',
    '  white-space: nowrap;',
    '}',
    '.apc-title {',
    '  font-size: 1.06em;',
    '  font-weight: 700;',
    '  margin: 1.05em 0 0.55em 0;',
    '}',
    '.apc-scroll {',
    '  overflow-x: auto;',
    '  border: 1px solid var(--apc-line);',
    '  border-radius: 10px;',
    '  background: rgba(127,127,127,0.03);',
    '  margin-bottom: 1.1em;',
    '}',
    '#apc-scroll-hist {',
    '  margin-bottom: 0.42em;',
    '}',
    '.apc-hist-actions {',
    '  display: flex;',
    '  justify-content: flex-end;',
    '  align-items: center;',
    '  margin: 0 0 1.1em 0;',
    '}',
    '.apc-clear-hist-btn {',
    '  display: inline-flex !important;',
    '  align-items: center !important;',
    '  gap: 4px !important;',
    '  padding: 3px 10px !important;',
    '  border-radius: 6px !important;',
    '  font-size: 0.76em !important;',
    '  font-weight: 600 !important;',
    '  line-height: 1.3 !important;',
    '  color: inherit !important;',
    '  opacity: 0.72;',
    '  background: rgba(127,127,127,0.09) !important;',
    '  border: 1px solid var(--apc-line) !important;',
    '  cursor: pointer;',
    '  transition: opacity 0.15s ease, transform 0.12s ease, border-color 0.15s ease !important;',
    '}',
    '.apc-clear-hist-btn:hover {',
    '  opacity: 1;',
    '  border-color: rgba(220,38,38,0.45) !important;',
    '}',
    '.apc-clear-hist-btn:active {',
    '  transform: scale(0.93) !important;',
    '}',
    '.apc-clear-hist-btn.is-empty {',
    '  opacity: 0.32 !important;',
    '  pointer-events: none !important;',
    '}',
    '.apc-scroll table {',
    '  width: 100%;',
    '  border-collapse: collapse;',
    '  margin: 0 !important;',
    '}',
    '.apc-scroll th, .apc-scroll td {',
    '  padding: 0.68em 0.85em !important;',
    '  text-align: left;',
    '  border-top: 1px solid var(--apc-line);',
    '  white-space: nowrap;',
    '  font-size: 0.98em;',
    '}',
    '.apc-scroll tr:first-child th { border-top: 0; }',
    '.apc-scroll th {',
    '  font-size: 0.82em !important;',
    '  font-weight: 700 !important;',
    '  text-transform: uppercase;',
    '  letter-spacing: 0.04em;',
    '  opacity: 0.75;',
    '}',
    '.apc-scroll tr.now td {',
    '  font-weight: 600;',
    '  background: rgba(37,99,235,0.1);',
    '}',
    '.apc-empty {',
    '  padding: 1em 1.1em;',
    '  font-size: 0.95em;',
    '  opacity: 0.7;',
    '}',
    '.apc-warn {',
    '  border: 1px solid var(--apc-warn);',
    '  border-radius: 10px;',
    '  padding: 0.7em 1em;',
    '  margin: 0 0 1em 0;',
    '}',
    '.apc-switch-flow {',
    '  display: inline-grid;',
    '  grid-template-columns: 76px 24px 76px;',
    '  align-items: center;',
    '  justify-items: center;',
    '  font-variant-numeric: tabular-nums;',
    '}',
    '.apc-switch-node {',
    '  display: inline-block;',
    '  width: 76px;',
    '  text-align: center;',
    '  padding: 3px 5px;',
    '  border-radius: 6px;',
    '  background: rgba(127,127,127,0.13);',
    '  border: 1px solid rgba(127,127,127,0.24);',
    '  font-family: monospace;',
    '  font-size: 0.95em;',
    '  box-sizing: border-box;',
    '}',
    '.apc-switch-arrow {',
    '  display: inline-block;',
    '  width: 24px;',
    '  text-align: center;',
    '  opacity: 0.85;',
    '  font-weight: 700;',
    '}',
    '.apc-btn, .apc-wrapper .cbi-button, .cbi-page-actions .cbi-button {',
    '  display: inline-flex !important;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 5px;',
    '  border-radius: 7px !important;',
    '  font-weight: 600 !important;',
    '  transition: transform 0.14s ease, opacity 0.2s ease, filter 0.2s ease !important;',
    '  cursor: pointer;',
    '}',
    '.apc-btn:hover, .apc-wrapper .cbi-button:hover, .cbi-page-actions .cbi-button:hover {',
    '  filter: brightness(1.08);',
    '}',
    '.apc-btn:active, .apc-wrapper .cbi-button:active, .cbi-page-actions .cbi-button:active {',
    '  transform: scale(0.91) !important;',
    '}',
    '.apc-btn.is-busy {',
    '  opacity: 0.82 !important;',
    '  pointer-events: none !important;',
    '}',
    '.apc-spinner {',
    '  width: 12px;',
    '  height: 12px;',
    '  border: 2px solid rgba(255,255,255,0.3);',
    '  border-top-color: #ffffff;',
    '  border-radius: 50%;',
    '  animation: apc-spin 0.6s linear infinite;',
    '  display: inline-block;',
    '  flex-shrink: 0;',
    '}',
    '#apc-form-holder { width: 100% !important; margin: 0 !important; padding: 0 !important; }',
    '#apc-form-holder .cbi-map { margin: 0 !important; padding: 0 !important; width: 100% !important; }',
    '#apc-form-holder .cbi-map-descr { display: none !important; }',
    '#apc-form-holder .cbi-section {',
    '  padding: 13px !important;',
    '  margin: 0 0 14px 0 !important;',
    '  border-radius: 10px !important;',
    '  border: 1px solid var(--apc-line) !important;',
    '  background: rgba(127,127,127,0.04) !important;',
    '  width: 100% !important;',
    '  box-sizing: border-box !important;',
    '}',
    '#apc-form-holder .cbi-section > h3,',
    '#apc-form-holder .cbi-section > legend {',
    '  display: flex !important;',
    '  align-items: center !important;',
    '  margin: 0 0 10px 0 !important;',
    '  padding: 8px 12px !important;',
    '  font-size: 15px !important;',
    '  font-weight: 700 !important;',
    '  border-radius: 7px !important;',
    '  width: 100% !important;',
    '  box-sizing: border-box !important;',
    '}',
    '#apc-form-holder .cbi-section-descr {',
    '  margin: 0 2px 12px 2px !important;',
    '  font-size: 12px !important;',
    '  line-height: 1.45 !important;',
    '  opacity: 0.78 !important;',
    '}',
    '#apc-form-holder .cbi-tabmenu {',
    '  display: flex !important;',
    '  gap: 8px !important;',
    '  margin: 0 0 12px 0 !important;',
    '  padding: 0 !important;',
    '  list-style: none !important;',
    '  border: 0 !important;',
    '  flex-wrap: wrap !important;',
    '}',
    '#apc-form-holder .cbi-tabmenu > li {',
    '  border-radius: 7px !important;',
    '  overflow: hidden;',
    '}',
    '#apc-form-holder .cbi-value {',
    '  position: relative !important;',
    '  display: block !important;',
    '  padding: 11px 13px !important;',
    '  margin: 0 0 9px 0 !important;',
    '  background: rgba(127,127,127,0.07) !important;',
    '  border: 1px solid rgba(127,127,127,0.18) !important;',
    '  border-radius: 9px !important;',
    '  box-sizing: border-box !important;',
    '  width: 100% !important;',
    '}',
    '#apc-form-holder .cbi-value:last-child { margin-bottom: 0 !important; }',
    '#apc-form-holder .cbi-value > .cbi-value-title {',
    '  display: block !important;',
    '  float: none !important;',
    '  width: 100% !important;',
    '  margin: 0 0 6px 0 !important;',
    '  padding: 0 !important;',
    '  font-size: 13.5px !important;',
    '  font-weight: 600 !important;',
    '  line-height: 1.35 !important;',
    '  text-align: left !important;',
    '  white-space: normal !important;',
    '}',
    '#apc-form-holder .cbi-value > .cbi-value-field {',
    '  position: static !important;',
    '  display: block !important;',
    '  float: none !important;',
    '  width: 100% !important;',
    '  margin: 0 !important;',
    '  padding: 0 !important;',
    '  text-align: left !important;',
    '}',
    '#apc-form-holder .cbi-value .cbi-value-description {',
    '  display: block !important;',
    '  width: 100% !important;',
    '  margin: 5px 0 0 0 !important;',
    '  padding: 0 !important;',
    '  font-size: 11.8px !important;',
    '  line-height: 1.4 !important;',
    '  opacity: 0.75 !important;',
    '  text-align: left !important;',
    '  white-space: normal !important;',
    '}',
    '#apc-form-holder .cbi-value select,',
    '#apc-form-holder .cbi-value input[type="text"],',
    '#apc-form-holder .cbi-value .cbi-dropdown {',
    '  width: 100% !important;',
    '  max-width: 100% !important;',
    '  box-sizing: border-box !important;',
    '}',
    '#apc-form-holder .cbi-value[data-name="enabled"] > .cbi-value-title,',
    '#apc-form-holder .cbi-value[data-name="probe"] > .cbi-value-title,',
    '#apc-form-holder .cbi-value[data-name="probe_schedule"] > .cbi-value-title,',
    '#apc-form-holder .cbi-value[data-name="main_list"] > .cbi-value-title {',
    '  width: calc(100% - 46px) !important;',
    '  margin: 0 0 4px 0 !important;',
    '}',
    '#apc-form-holder .cbi-value[data-name="enabled"] .cbi-value-description,',
    '#apc-form-holder .cbi-value[data-name="probe"] .cbi-value-description,',
    '#apc-form-holder .cbi-value[data-name="probe_schedule"] .cbi-value-description,',
    '#apc-form-holder .cbi-value[data-name="main_list"] .cbi-value-description {',
    '  width: calc(100% - 46px) !important;',
    '  margin: 0 !important;',
    '}',
    '#apc-form-holder .cbi-value[data-name="enabled"] .cbi-checkbox,',
    '#apc-form-holder .cbi-value[data-name="probe"] .cbi-checkbox,',
    '#apc-form-holder .cbi-value[data-name="probe_schedule"] .cbi-checkbox,',
    '#apc-form-holder .cbi-value[data-name="main_list"] .cbi-checkbox,',
    '#apc-form-holder .cbi-value[data-name="enabled"] > .cbi-value-field > input[type="checkbox"],',
    '#apc-form-holder .cbi-value[data-name="probe"] > .cbi-value-field > input[type="checkbox"],',
    '#apc-form-holder .cbi-value[data-name="probe_schedule"] > .cbi-value-field > input[type="checkbox"],',
    '#apc-form-holder .cbi-value[data-name="main_list"] > .cbi-value-field > input[type="checkbox"] {',
    '  position: absolute !important;',
    '  top: 13px !important;',
    '  right: 13px !important;',
    '  margin: 0 !important;',
    '}',
    '#apc-form-holder [data-tab="general"] > .cbi-value[data-name="enabled"] {',
    '  background: linear-gradient(90deg, rgba(22,163,74,0.14) 0%, rgba(22,163,74,0.03) 100%) !important;',
    '  border: 1px solid rgba(22,163,74,0.4) !important;',
    '  border-left: 4px solid #16a34a !important;',
    '  padding: 13px 13px 13px 15px !important;',
    '  margin-bottom: 11px !important;',
    '}',
    '#apc-form-holder [data-tab="general"] > .cbi-value[data-name="enabled"].is-master-off {',
    '  background: linear-gradient(90deg, rgba(220,38,38,0.12) 0%, rgba(127,127,127,0.04) 100%) !important;',
    '  border: 1px solid rgba(220,38,38,0.35) !important;',
    '  border-left: 4px solid #dc2626 !important;',
    '}',
    '#apc-form-holder [data-tab="general"] > .cbi-value[data-name="enabled"] > .cbi-value-title {',
    '  display: inline-flex !important;',
    '  align-items: center !important;',
    '  flex-wrap: wrap !important;',
    '  gap: 8px !important;',
    '  font-size: 14px !important;',
    '  font-weight: 700 !important;',
    '  color: #3fb950 !important;',
    '}',
    '#apc-form-holder [data-tab="general"] > .cbi-value[data-name="enabled"].is-master-off > .cbi-value-title {',
    '  color: #ff7b72 !important;',
    '}',
    '#apc-form-holder [data-tab="general"] > .cbi-value[data-name="enabled"] > .cbi-value-title::after {',
    '  content: "MAIN";',
    '  display: inline-flex;',
    '  align-items: center;',
    '  padding: 1px 7px;',
    '  border-radius: 999px;',
    '  font-size: 10px;',
    '  font-weight: 700;',
    '  background: rgba(22,163,74,0.2);',
    '  color: #3fb950;',
    '  border: 1px solid rgba(22,163,74,0.4);',
    '}',
    '#apc-form-holder [data-tab="general"] > .cbi-value[data-name="enabled"].is-master-off > .cbi-value-title::after {',
    '  content: "DISABLED";',
    '  background: rgba(220,38,38,0.18);',
    '  color: #ff7b72;',
    '  border: 1px solid rgba(220,38,38,0.4);',
    '}',
    '#apc-form-holder .cbi-section-table {',
    '  width: 100% !important;',
    '  display: block !important;',
    '  border: 0 !important;',
    '  counter-reset: apc-prio-idx;',
    '}',
    '#apc-form-holder .cbi-section-table-titles,',
    '#apc-form-holder .cbi-section-table-descr {',
    '  display: none !important;',
    '}',
    '#apc-form-holder .cbi-section-table-row {',
    '  counter-increment: apc-prio-idx;',
    '  display: grid !important;',
    '  grid-template-columns: 56px minmax(0, 1fr) minmax(0, 1.15fr) !important;',
    '  gap: 10px !important;',
    '  align-items: end !important;',
    '  background: rgba(127,127,127,0.07) !important;',
    '  border: 1px solid rgba(127,127,127,0.22) !important;',
    '  border-left: 3px solid #2563eb !important;',
    '  border-radius: 10px !important;',
    '  padding: 12px !important;',
    '  margin: 0 0 10px 0 !important;',
    '  width: 100% !important;',
    '  box-sizing: border-box !important;',
    '}',
    '#apc-form-holder .cbi-section-table-row > td.cbi-value-field {',
    '  display: flex !important;',
    '  flex-direction: column !important;',
    '  align-items: stretch !important;',
    '  justify-content: flex-end !important;',
    '  width: 100% !important;',
    '  padding: 0 !important;',
    '  margin: 0 !important;',
    '  border: 0 !important;',
    '  background: transparent !important;',
    '}',
    '#apc-form-holder .cbi-section-table-row > td.cbi-value-field::before {',
    '  content: attr(data-title);',
    '  display: block !important;',
    '  font-size: 11px !important;',
    '  font-weight: 700 !important;',
    '  text-transform: uppercase !important;',
    '  opacity: 0.78 !important;',
    '  margin: 0 0 5px 0 !important;',
    '  white-space: nowrap !important;',
    '}',
    '#apc-form-holder .cbi-section-table-row > td.cbi-value-field:first-child {',
    '  align-items: center !important;',
    '  justify-content: center !important;',
    '  padding-bottom: 6px !important;',
    '}',
    '#apc-form-holder .cbi-section-table-row > td.cbi-value-field input[type="text"] {',
    '  width: 100% !important;',
    '  height: 36px !important;',
    '  padding: 4px 10px !important;',
    '  font-size: 13.5px !important;',
    '  font-weight: 600 !important;',
    '  box-sizing: border-box !important;',
    '}',
    '#apc-form-holder .cbi-section-table-row > td.cbi-section-table-cell {',
    '  grid-column: 1 / -1 !important;',
    '  display: flex !important;',
    '  align-items: center !important;',
    '  justify-content: flex-end !important;',
    '  gap: 6px !important;',
    '  width: 100% !important;',
    '  padding: 8px 0 0 0 !important;',
    '  margin: 2px 0 0 0 !important;',
    '  border: 0 !important;',
    '  border-top: 1px solid rgba(127,127,127,0.14) !important;',
    '  background: transparent !important;',
    '}',
    '#apc-form-holder .cbi-section-table-row > td.cbi-section-table-cell::before {',
    '  content: "Priority #" counter(apc-prio-idx);',
    '  margin-right: auto !important;',
    '  display: inline-flex;',
    '  align-items: center;',
    '  padding: 2px 9px;',
    '  border-radius: 999px;',
    '  font-size: 11px;',
    '  font-weight: 700;',
    '  background: rgba(37,99,235,0.16);',
    '  color: #58a6ff;',
    '  border: 1px solid rgba(37,99,235,0.35);',
    '}',
    '.apc-move-btn {',
    '  display: inline-flex !important;',
    '  align-items: center !important;',
    '  justify-content: center !important;',
    '  flex: 0 0 auto !important;',
    '  width: 32px !important;',
    '  min-width: 32px !important;',
    '  height: 32px !important;',
    '  padding: 0 !important;',
    '  margin: 0 !important;',
    '  border-radius: 7px !important;',
    '  background: rgba(88,166,255,0.16) !important;',
    '  color: #58a6ff !important;',
    '  border: 1px solid rgba(88,166,255,0.38) !important;',
    '  font-size: 11px !important;',
    '  font-weight: 800 !important;',
    '  cursor: pointer !important;',
    '  transition: transform 0.12s ease, background 0.15s ease !important;',
    '}',
    '.apc-move-btn:active { transform: scale(0.85) !important; background: rgba(88,166,255,0.32) !important; }',
    '.apc-move-btn:disabled { opacity: 0.25 !important; pointer-events: none !important; }',
    '.apc-sched-list {',
    '  width: 100%;',
    '  box-sizing: border-box;',
    '}',
    '.apc-sched-row {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 6px;',
    '  width: 100%;',
    '  padding: 6px 8px;',
    '  margin: 0 0 7px 0;',
    '  background: rgba(127,127,127,0.08);',
    '  border: 1px solid rgba(127,127,127,0.24);',
    '  border-left: 3px solid #2563eb;',
    '  border-radius: 8px;',
    '  box-sizing: border-box;',
    '}',
    '.apc-sched-prio {',
    '  flex: 0 0 auto;',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  padding: 2px 7px;',
    '  border-radius: 999px;',
    '  font-size: 11px;',
    '  font-weight: 700;',
    '  background: rgba(37,99,235,0.16);',
    '  color: #58a6ff;',
    '  border: 1px solid rgba(37,99,235,0.35);',
    '}',
    '.apc-sched-input {',
    '  flex: 1 1 0% !important;',
    '  width: 0 !important;',
    '  min-width: 0 !important;',
    '  height: 32px !important;',
    '  padding: 4px 9px !important;',
    '  margin: 0 !important;',
    '  font-family: monospace !important;',
    '  font-size: 13.5px !important;',
    '  font-weight: 600 !important;',
    '  box-sizing: border-box !important;',
    '}',
    '.apc-sched-del {',
    '  display: inline-flex !important;',
    '  align-items: center !important;',
    '  justify-content: center !important;',
    '  flex: 0 0 auto !important;',
    '  width: 32px !important;',
    '  min-width: 32px !important;',
    '  height: 32px !important;',
    '  padding: 0 !important;',
    '  margin: 0 !important;',
    '  border-radius: 7px !important;',
    '  background: rgba(220,38,38,0.85) !important;',
    '  color: #ffffff !important;',
    '  border: 1px solid rgba(220,38,38,0.95) !important;',
    '  font-size: 14px !important;',
    '  font-weight: 800 !important;',
    '  cursor: pointer !important;',
    '}',
    '.apc-sched-add-row {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 6px;',
    '  width: 100%;',
    '  padding: 6px 8px;',
    '  margin: 2px 0 0 0;',
    '  background: rgba(127,127,127,0.05);',
    '  border: 1px dashed rgba(127,127,127,0.3);',
    '  border-radius: 8px;',
    '  box-sizing: border-box;',
    '}',
    '.apc-sched-add-btn {',
    '  display: inline-flex !important;',
    '  align-items: center !important;',
    '  justify-content: center !important;',
    '  flex: 0 0 auto !important;',
    '  width: 34px !important;',
    '  min-width: 34px !important;',
    '  height: 32px !important;',
    '  padding: 0 !important;',
    '  margin: 0 !important;',
    '  border-radius: 7px !important;',
    '  background: #16a34a !important;',
    '  color: #ffffff !important;',
    '  border: 1px solid #16a34a !important;',
    '  font-size: 16px !important;',
    '  font-weight: 800 !important;',
    '  cursor: pointer !important;',
    '}',
    '#apc-form-holder .cbi-section-remove {',
    '  background: rgba(37,99,235,0.1) !important;',
    '  border: 1px solid rgba(88,166,255,0.28) !important;',
    '  border-bottom: 0 !important;',
    '  border-radius: 10px 10px 0 0 !important;',
    '  padding: 9px 12px !important;',
    '  margin: 10px 0 0 0 !important;',
    '  display: flex !important;',
    '  align-items: center !important;',
    '  justify-content: space-between !important;',
    '}',
    '#apc-form-holder .cbi-section-remove::before {',
    '  content: "Scheduled Priority List";',
    '  font-size: 12.5px;',
    '  font-weight: 700;',
    '  color: #58a6ff;',
    '}',
    '#apc-form-holder .cbi-section-remove + .cbi-section-node {',
    '  background: rgba(127,127,127,0.04) !important;',
    '  border: 1px solid rgba(88,166,255,0.25) !important;',
    '  border-radius: 0 0 10px 10px !important;',
    '  padding: 12px !important;',
    '  margin: 0 0 14px 0 !important;',
    '}',
    '.apc-test-result {',
    '  margin-top: 8px;',
    '  padding: 8px 12px;',
    '  border-radius: 7px;',
    '  font-size: 12px;',
    '  font-weight: 600;',
    '  animation: apc-fade 0.2s ease;',
    '}',
    '.apc-test-result.ok { background: rgba(22,163,74,0.16); color: #3fb950; border: 1px solid rgba(22,163,74,0.35); }',
    '.apc-test-result.bad { background: rgba(220,38,38,0.16); color: #ff7b72; border: 1px solid rgba(220,38,38,0.35); }',
    '.apc-signature-footer {',
    '  margin: 18px 0 28px 0;',
    '  padding: 13px 16px;',
    '  border-radius: 10px;',
    '  background: rgba(127,127,127,0.06);',
    '  border: 1px solid var(--apc-line);',
    '  display: flex;',
    '  flex-direction: column;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 6px;',
    '  font-size: 12.5px;',
    '  width: 100%;',
    '  box-sizing: border-box;',
    '  text-align: center;',
    '}',
    '.apc-sig-top {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 8px;',
    '  flex-wrap: wrap;',
    '}',
    '.apc-sig-credits {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  flex-wrap: wrap;',
    '  gap: 6px;',
    '  font-size: 12px;',
    '  opacity: 0.88;',
    '}',
    '.apc-ver-pill {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  padding: 2px 9px;',
    '  border-radius: 999px;',
    '  font-size: 11px;',
    '  font-weight: 700;',
    '  background: rgba(22,163,74,0.18);',
    '  color: #3fb950;',
    '  border: 1px solid rgba(22,163,74,0.35);',
    '}',
    '.apc-orig-name { font-weight: 700; color: #c084fc; }',
    '.apc-dev-name { font-weight: 700; color: #58a6ff; }'
].join('\n');

var STATES = {
    starting: [ _('Starting'), '' ],
    off: [ _('Off'), '' ],
    no_cells: [ _('No cells set'), 'warn' ],
    no_list: [ _('No list active'), 'warn' ],
    other_lock: [ _('Paused, firmware PCI lock is on'), 'warn' ],
    list_change: [ _('Changing list'), 'warn' ],
    no_modem: [ _('Modem not found'), 'bad' ],
    no_answer: [ _('Modem not answering'), 'bad' ],
    locked: [ _('Locked'), 'ok' ],
    switching: [ _('Switching'), 'warn' ],
    signal_lost: [ _('Signal lost'), 'warn' ],
    wrong_cell: [ _('On another cell'), 'warn' ],
    recovery: [ _('Lock open, all cells lost'), 'bad' ]
};

var CELL_STATES = {
    active: [ _('Active'), 'ok' ],
    available: [ _('Available'), 'info' ],
    unavailable: [ _('Unavailable'), 'warn' ],
    unknown: [ _('Unknown'), '' ]
};

var REASONS = {
    cell_lost: _('Cell lost'),
    higher_returned: _('Better cell returned'),
    probe: _('Tried better cell'),
    all_cells_lost: _('All cells lost'),
    cell_returned: _('Cell returned'),
    lock_lost: _('Lock was changed')
};

var PROTECT = {
    phone: _('Phone in use'),
    sip: _('SIP call'),
    call: _('SIM call'),
    sms: _('SMS'),
    unknown: _('Cannot read call state')
};

var CORD_ONHOOK  = 'M 42 50 C 20 66, 20 94, 37 108';
var CORD_OFFHOOK = 'M 38 36 C 17 58, 19 92, 37 108';

function pill(label, kind) {
    return E('span', { 'class': 'apc-pill ' + (kind || '') }, label);
}

function card(title, big, sub) {
    return E('div', { 'class': 'apc-card' }, [
        E('h4', {}, title),
        E('div', { 'class': 'apc-big' }, big),
        E('div', { 'class': 'apc-sub' }, sub || '\u00a0')
    ]);
}

function table(heads, rows, scrollId) {
    return E('div', { 'class': 'apc-scroll', 'id': scrollId || null }, E('table', {}, [
        E('tr', {}, heads.map(function(h) { return E('th', {}, h); }))
    ].concat(rows)));
}

function pad2(n) {
    return n < 10 ? '0' + n : String(n);
}

function formatLiveClock(d) {
    return pad2(d.getHours()) + ':' +
           pad2(d.getMinutes()) + ':' +
           pad2(d.getSeconds());
}

function formatShortStamp(ts) {
    if (!ts) return '-';
    var d = new Date(ts * 1000);
    return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + ' ' +
           pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
}

function createRj11PhoneElement() {
    var wrap = E('div', { 'class': 'apc-rj11-widget st-idle', 'id': 'apc-rj11-widget' });
    var svgHolder = E('div', {});
    var xs = [ 76, 90, 104 ];
    var ys = [ 68, 79, 90, 101 ];
    var keys = [];
    var kIdx = 1;
    ys.forEach(function(y) {
        xs.forEach(function(x) {
            keys.push('<circle class="apc-rj11-key k' + kIdx + '" cx="' + x + '" cy="' + y + '" r="3.3"/>');
            kIdx++;
        });
    });

    svgHolder.innerHTML =
        '<svg class="apc-rj11-svg" viewBox="0 0 180 124" aria-hidden="true">' +
            '<path class="apc-rj11-wave w-inner" d="M 25 46 A 20 20 0 0 1 28 19"/>' +
            '<path class="apc-rj11-wave w-outer" d="M 17 50 A 28 28 0 0 1 21 12"/>' +
            '<path class="apc-rj11-wave w-inner" d="M 155 46 A 20 20 0 0 0 152 19"/>' +
            '<path class="apc-rj11-wave w-outer" d="M 163 50 A 28 28 0 0 0 159 12"/>' +
            '<g class="apc-rj11-phone">' +
                '<path class="apc-rj11-cord" id="apc-rj11-cord" d="' + CORD_ONHOOK + '"/>' +
                '<rect class="apc-rj11-plunger" x="48" y="45" width="11" height="7" rx="2"/>' +
                '<rect class="apc-rj11-plunger" x="121" y="45" width="11" height="7" rx="2"/>' +
                '<path class="apc-rj11-base" d="M 57 50 L 123 50 C 133 50, 139 55, 141 64 L 150 107 C 151 113, 147 117, 140 117 L 40 117 C 33 117, 29 113, 30 107 L 39 64 C 41 55, 47 50, 57 50 Z"/>' +
                keys.join('') +
                '<g class="apc-rj11-handset">' +
                    '<path class="apc-rj11-handset-path" d="M 34 34 C 34 22, 43 18, 58 18 L 122 18 C 137 18, 146 22, 146 34 L 146 43 C 146 47, 142 49, 135 49 L 119 49 C 113 49, 111 46, 111 40 L 111 33 L 69 33 L 69 40 C 69 46, 67 49, 61 49 L 45 49 C 38 49, 34 47, 34 43 Z"/>' +
                '</g>' +
            '</g>' +
        '</svg>';

    var svgNode = svgHolder.firstChild;
    var pillNode = E('div', { 'class': 'apc-rj11-pill' }, [
        E('span', { 'class': 'apc-rj11-dot' }),
        E('span', { 'id': 'apc-rj11-pill-text' }, _('Idle (on hook)'))
    ]);
    var peerNode = E('div', {
        'class': 'apc-rj11-peer',
        'id': 'apc-rj11-peer',
        'style': 'display:none'
    }, '');

    wrap.appendChild(svgNode);
    wrap.appendChild(pillNode);
    wrap.appendChild(peerNode);
    return wrap;
}

var CBIScheduledCells = form.Value.extend({
    renderWidget: function(section_id, option_index, cfgvalue) {
        var initialArr = [];
        if (Array.isArray(cfgvalue)) {
            initialArr = cfgvalue.slice();
        } else if (typeof cfgvalue === 'string' && cfgvalue.trim() !== '') {
            initialArr = [ cfgvalue.trim() ];
        } else {
            var uciVal = uci.get('auto-pci-cell', section_id, 'cell');
            if (Array.isArray(uciVal)) initialArr = uciVal.slice();
            else if (typeof uciVal === 'string' && uciVal.trim() !== '') initialArr = [ uciVal.trim() ];
        }

        var container = E('div', {
            'class': 'apc-sched-list',
            'id': this.cbid(section_id)
        });
        var rowsHolder = E('div', { 'class': 'apc-sched-rows' });
        var addInput = E('input', {
            'type': 'text',
            'class': 'cbi-input-text apc-sched-input',
            'placeholder': '175,400'
        });

        var readCurrentArray = function() {
            var inps = rowsHolder.querySelectorAll('.apc-sched-row-input');
            var out = [];
            inps.forEach(function(inp) {
                var v = (inp.value || '').trim();
                if (v) out.push(v);
            });
            return out;
        };

        var syncToUciMemory = function() {
            var arr = readCurrentArray();
            if (arr.length > 0) {
                uci.set('auto-pci-cell', section_id, 'cell', arr);
            } else {
                uci.unset('auto-pci-cell', section_id, 'cell');
            }
        };

        var renderRows = function(arr, flashIdx) {
            while (rowsHolder.firstChild) rowsHolder.removeChild(rowsHolder.firstChild);
            arr.forEach(function(val, idx) {
                var rowInp = E('input', {
                    'type': 'text',
                    'class': 'cbi-input-text apc-sched-input apc-sched-row-input',
                    'value': val,
                    'change': function() {
                        syncToUciMemory();
                    }
                });

                var upBtn = E('button', {
                    'type': 'button',
                    'class': 'btn apc-move-btn',
                    'title': _('Move Up'),
                    'disabled': idx === 0 ? 'disabled' : null,
                    'click': function(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        var cur = readCurrentArray();
                        if (idx <= 0 || idx >= cur.length) return;
                        var tmp = cur[idx - 1];
                        cur[idx - 1] = cur[idx];
                        cur[idx] = tmp;
                        renderRows(cur, idx - 1);
                        syncToUciMemory();
                    }
                }, '\u25b2');

                var dnBtn = E('button', {
                    'type': 'button',
                    'class': 'btn apc-move-btn',
                    'title': _('Move Down'),
                    'disabled': idx >= arr.length - 1 ? 'disabled' : null,
                    'click': function(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        var cur = readCurrentArray();
                        if (idx < 0 || idx >= cur.length - 1) return;
                        var tmp = cur[idx + 1];
                        cur[idx + 1] = cur[idx];
                        cur[idx] = tmp;
                        renderRows(cur, idx + 1);
                        syncToUciMemory();
                    }
                }, '\u25bc');

                var delBtn = E('button', {
                    'type': 'button',
                    'class': 'btn apc-sched-del',
                    'title': _('Remove'),
                    'click': function(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        var cur = readCurrentArray();
                        cur.splice(idx, 1);
                        renderRows(cur, -1);
                        syncToUciMemory();
                    }
                }, '\u00d7');

                var rowEl = E('div', {
                    'class': 'apc-sched-row' + (idx === flashIdx ? ' apc-swapped' : '')
                }, [
                    E('span', { 'class': 'apc-sched-prio' }, '#' + (idx + 1)),
                    rowInp,
                    upBtn,
                    dnBtn,
                    delBtn
                ]);

                rowsHolder.appendChild(rowEl);
            });
        };

        var handleAddCell = function(ev) {
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            var v = (addInput.value || '').trim();
            if (!v) return;
            var r = /^([0-9]{1,3}),([0-9]{1,6})$/.exec(v);
            if (!r || +r[1] > 503 || +r[2] > 262143) {
                ui.addNotification(null, E('p', {}, _('Format as PCI,EARFCN (e.g. 175,400)')), 'warning');
                return;
            }
            var cur = readCurrentArray();
            if (cur.length >= 5) {
                ui.addNotification(null, E('p', {}, _('Maximum of 5 scheduled cells allowed.')), 'warning');
                return;
            }
            if (cur.indexOf(v) !== -1) {
                ui.addNotification(null, E('p', {}, _('This PCI,EARFCN cell is already in the list.')), 'warning');
                return;
            }
            cur.push(v);
            addInput.value = '';
            renderRows(cur, cur.length - 1);
            syncToUciMemory();
        };

        addInput.addEventListener('keydown', function(ev) {
            if (ev.key === 'Enter') {
                handleAddCell(ev);
            }
        });

        var addBtn = E('button', {
            'type': 'button',
            'class': 'btn apc-sched-add-btn',
            'title': _('Add Cell'),
            'click': handleAddCell
        }, '+');

        renderRows(initialArr, -1);

        container.appendChild(rowsHolder);
        container.appendChild(E('div', { 'class': 'apc-sched-add-row' }, [
            addInput,
            addBtn
        ]));

        return container;
    },

    formvalue: function(section_id) {
        var container = document.getElementById(this.cbid(section_id));
        if (!container) return uci.get('auto-pci-cell', section_id, 'cell') || [];
        var inps = container.querySelectorAll('.apc-sched-row-input');
        var out = [];
        inps.forEach(function(inp) {
            var v = (inp.value || '').trim();
            if (v) out.push(v);
        });
        var pendingAdd = container.querySelector('.apc-sched-add-row input');
        if (pendingAdd && pendingAdd.value.trim() !== '') {
            var pv = pendingAdd.value.trim();
            if (/^([0-9]{1,3}),([0-9]{1,6})$/.test(pv) && out.indexOf(pv) === -1 && out.length < 5) {
                out.push(pv);
                pendingAdd.value = '';
            }
        }
        return out;
    },

    validate: function(section_id, value) {
        var arr = this.formvalue(section_id);
        for (var i = 0; i < arr.length; i++) {
            var r = /^([0-9]{1,3}),([0-9]{1,6})$/.exec(arr[i] || '');
            if (!r || +r[1] > 503 || +r[2] > 262143) {
                return _('Format as PCI,EARFCN (e.g. 175,400)');
            }
        }
        return true;
    },

    write: function(section_id, formvalue) {
        uci.set('auto-pci-cell', section_id, 'cell', formvalue);
    },

    remove: function(section_id) {
        uci.unset('auto-pci-cell', section_id, 'cell');
    }
});

return view.extend({
    mapContainer: null,
    dashboardBox: null,
    lastStatus: null,
    lastFxs: null,
    _rj11WidgetEl: null,
    _fxsInFlight: false,

    setBtnSpin: function(btn, text, busy) {
        if (!btn) return;
        while (btn.firstChild) btn.removeChild(btn.firstChild);
        if (busy) {
            btn.classList.add('is-busy');
            btn.disabled = true;
            btn.appendChild(E('span', { 'class': 'apc-spinner' }));
        } else {
            btn.classList.remove('is-busy');
            btn.disabled = false;
        }
        btn.appendChild(E('span', {}, text));
    },

    clearRecentSwitches: function() {
        var self = this;
        return callClearHistory().then(function() {
            return L.resolveDefault(callStatus(), {});
        }).then(function(st) {
            if (self.dashboardBox && st) self.updateDashboardPreservingScroll(self.dashboardBox, st);
        }).catch(function(e) {
            ui.addNotification(null, E('p', {}, _('Could not clear the list: ') + e.message));
        });
    },

    resolvePhoneVisual: function(s, fxs) {
        s = s || {};
        fxs = fxs || {};

        var hasFxs = (typeof fxs.state === 'string' && fxs.state.length > 0) || (typeof fxs.offhook !== 'undefined');
        var rawState = String(fxs.state || '').toLowerCase().trim();
        var offhook = fxs.offhook === true || fxs.offhook === 1 || fxs.offhook === '1';
        var testring = fxs.testring === true || fxs.testring === 1 || fxs.testring === '1';
        var peer = String(fxs.peer || '').trim();
        var apcPhone = String(s.phone || '').toLowerCase().trim();
        var apcProtect = String(s.protect || '').toLowerCase().trim();
        var pending = +(s.pending || 0);

        var stClass = 'st-idle';
        var cardClass = '';
        var isOffhook = false;
        var pillLabel = _('Idle (on hook)');
        var showPeer = '';
        var isLiveFxsActive = false;

        if (hasFxs) {
            if (testring || rawState === 'ringing' || rawState === 'ring' || rawState === 'incoming') {
                stClass = 'st-ringing';
                cardClass = 'is-ringing';
                isOffhook = false;
                pillLabel = _('Ringing');
                showPeer = peer;
                isLiveFxsActive = true;
            } else if (rawState === 'calling' || rawState === 'outgoing' || rawState === 'alerting' || rawState === 'ringback' || rawState === 'progress' || rawState === 'proceeding') {
                stClass = 'st-calling';
                cardClass = 'is-call-active';
                isOffhook = true;
                pillLabel = _('Calling');
                showPeer = peer;
                isLiveFxsActive = true;
            } else if (rawState === 'dialing' || rawState === 'dial' || rawState === 'dtmf' || rawState === 'digits') {
                stClass = 'st-dialing';
                cardClass = 'is-call-active';
                isOffhook = true;
                pillLabel = _('Dialing');
                showPeer = '';
                isLiveFxsActive = true;
            } else if (rawState === 'connected' || rawState === 'in_call' || rawState === 'incall' || rawState === 'in-call' || rawState === 'talking' || rawState === 'answered' || rawState === 'conversation') {
                stClass = 'st-connected';
                cardClass = 'is-call-active';
                isOffhook = true;
                pillLabel = _('In call');
                showPeer = peer;
                isLiveFxsActive = true;
            } else if (rawState === 'hold' || rawState === 'held') {
                stClass = 'st-dialtone';
                cardClass = 'is-call-active';
                isOffhook = true;
                pillLabel = _('On hold');
                showPeer = peer;
                isLiveFxsActive = true;
            } else if (offhook || rawState === 'dialtone' || rawState === 'dial_tone' || rawState === 'dial-tone' || rawState === 'dial tone' || rawState === 'offhook' || rawState === 'off_hook' || rawState === 'off-hook' || rawState === 'tone') {
                stClass = 'st-dialtone';
                cardClass = 'is-call-active';
                isOffhook = true;
                pillLabel = _('Dial tone');
                showPeer = '';
                isLiveFxsActive = true;
            } else if (fxs.enabled === false || fxs.running === false) {
                stClass = 'st-off';
                pillLabel = _('Idle (on hook)');
            }
        } else {
            if (apcPhone.indexOf('ring') !== -1) {
                stClass = 'st-ringing';
                cardClass = 'is-ringing';
                pillLabel = _('Ringing');
                isLiveFxsActive = true;
            } else if (offhook || apcProtect === 'phone' || apcPhone !== 'none' && apcPhone !== '' && apcPhone !== 'idle') {
                stClass = 'st-dialtone';
                cardClass = 'is-call-active';
                isOffhook = true;
                pillLabel = _('Dial tone');
                isLiveFxsActive = true;
            }
        }

        var nonPhoneProtect = (apcProtect && apcProtect !== 'phone') ? PROTECT[s.protect] : '';
        var paused = Boolean(isLiveFxsActive || nonPhoneProtect || (apcProtect === 'phone' && !hasFxs));
        if (paused && !cardClass) {
            cardClass = 'is-call-active';
        }

        var bigText = paused ? _('Paused') : _('Allowed');
        var subText = '';
        if (isLiveFxsActive) {
            subText = _('Phone in use') + ' \u2022 ' + pillLabel + (showPeer ? ' (' + showPeer + ')' : '');
        } else if (nonPhoneProtect) {
            subText = nonPhoneProtect;
        } else if (pending > 0) {
            subText = _('Waiting to go to priority') + ' ' + pending;
        } else {
            subText = _('Phone') + ': ' + _('idle');
        }

        return {
            stClass: stClass,
            cardClass: cardClass,
            isOffhook: isOffhook,
            pillLabel: pillLabel,
            peer: showPeer,
            bigText: bigText,
            subText: subText
        };
    },

    applyPhoneVisualToDOM: function() {
        var vis = this.resolvePhoneVisual(this.lastStatus, this.lastFxs);
        if (!this._rj11WidgetEl) {
            this._rj11WidgetEl = createRj11PhoneElement();
        }
        var w = this._rj11WidgetEl;
        var targetCls = 'apc-rj11-widget ' + vis.stClass;
        if (w.className !== targetCls) {
            w.className = targetCls;
        }
        var cord = w.querySelector('#apc-rj11-cord');
        if (cord) {
            var targetD = vis.isOffhook ? CORD_OFFHOOK : CORD_ONHOOK;
            if (cord.getAttribute('d') !== targetD) {
                cord.setAttribute('d', targetD);
            }
        }
        var pillTxt = w.querySelector('#apc-rj11-pill-text');
        if (pillTxt && pillTxt.textContent !== vis.pillLabel) {
            pillTxt.textContent = vis.pillLabel;
        }
        var peerEl = w.querySelector('#apc-rj11-peer');
        if (peerEl) {
            if (vis.peer) {
                peerEl.textContent = vis.peer;
                peerEl.style.display = '';
            } else {
                peerEl.textContent = '';
                peerEl.style.display = 'none';
            }
        }

        var swCard = document.getElementById('apc-switching-card');
        if (swCard) {
            var swCls = 'apc-card apc-card-switch' + (vis.cardClass ? ' ' + vis.cardClass : '');
            if (swCard.className !== swCls) {
                swCard.className = swCls;
            }
        }
        var swBig = document.getElementById('apc-switching-big');
        if (swBig && swBig.textContent !== vis.bigText) {
            swBig.textContent = vis.bigText;
        }
        var swSub = document.getElementById('apc-switching-sub');
        if (swSub && swSub.textContent !== vis.subText) {
            swSub.textContent = vis.subText;
        }
        return vis;
    },

    startLivePhoneTicker: function() {
        var self = this;
        if (window._apcFxsTimer) {
            window.clearInterval(window._apcFxsTimer);
        }
        if (!self.hasFxs) return;
        var pollFxs = function() {
            if (document.hidden || self._fxsInFlight) return;
            if (!document.getElementById('apc-switching-card')) return;
            self._fxsInFlight = true;
            L.resolveDefault(callFxsStatus(), null).then(function(fxs) {
                self._fxsInFlight = false;
                if (fxs && typeof fxs === 'object') {
                    self.lastFxs = fxs;
                    self.applyPhoneVisualToDOM();
                }
            }).catch(function() {
                self._fxsInFlight = false;
            });
        };
        pollFxs();
        window._apcFxsTimer = window.setInterval(pollFxs, 1500);
    },

    updateDashboardPreservingScroll: function(box, st) {
        this.lastStatus = st;
        var savedScrolls = {};
        var oldScrolls = box.querySelectorAll('.apc-scroll');
        oldScrolls.forEach(function(el, i) {
            var key = el.id || ('idx_' + i);
            savedScrolls[key] = el.scrollLeft;
        });

        box.dataset.port = st.port || '';
        while (box.firstChild) box.removeChild(box.firstChild);
        box.appendChild(this.renderDashboard(st));

        var newScrolls = box.querySelectorAll('.apc-scroll');
        newScrolls.forEach(function(el, i) {
            var key = el.id || ('idx_' + i);
            if (savedScrolls[key] && savedScrolls[key] > 0) {
                el.scrollLeft = savedScrolls[key];
            }
        });
    },

    syncFormValuesToMemory: function() {
        if (!this.mapContainer) return;
        var cellSecs = uci.sections('auto-pci-cell', 'cell');
        var rows = this.mapContainer.querySelectorAll('.cbi-section-table-row');
        rows.forEach(function(r, i) {
            if (!cellSecs[i]) return;
            var sid = cellSecs[i]['.name'];
            var cb = r.querySelector('input[type="checkbox"]');
            var txts = r.querySelectorAll('input[type="text"]');
            if (cb) uci.set('auto-pci-cell', sid, 'enabled', cb.checked ? '1' : '0');
            if (txts[0] && txts[0].value.trim() !== '') {
                uci.set('auto-pci-cell', sid, 'pci', txts[0].value.trim());
            }
            if (txts[1] && txts[1].value.trim() !== '') {
                uci.set('auto-pci-cell', sid, 'earfcn', txts[1].value.trim());
            }
        });
    },

    clearUnsavedBanner: function() {
        if (ui.changes) {
            if (ui.changes.changes && ui.changes.changes['auto-pci-cell']) {
                delete ui.changes.changes['auto-pci-cell'];
            }
            if (typeof ui.changes.setIndicator === 'function') {
                var total = 0;
                for (var cfg in (ui.changes.changes || {})) {
                    if (Array.isArray(ui.changes.changes[cfg]))
                        total += ui.changes.changes[cfg].length;
                }
                ui.changes.setIndicator(total);
            }
        }
    },

    triggerSynchronizedClockTick: function() {
        var clkEl = document.getElementById('apc-live-clock-text');
        var dotEl = document.getElementById('apc-live-clock-dot');
        if (!clkEl) return;
        clkEl.textContent = _('Updated') + ' ' + formatLiveClock(new Date());
        clkEl.classList.remove('apc-time-tick');
        if (dotEl) dotEl.classList.remove('apc-dot-tick');
        void clkEl.offsetWidth;
        clkEl.classList.add('apc-time-tick');
        if (dotEl) dotEl.classList.add('apc-dot-tick');
    },

    startLiveSecondTicker: function() {
        var self = this;
        if (window._apcClockTimer) {
            window.clearInterval(window._apcClockTimer);
        }
        var lastSec = -1;
        var checkTick = function() {
            var now = new Date();
            var s = now.getSeconds();
            if (s !== lastSec) {
                lastSec = s;
                self.triggerSynchronizedClockTick();
            }
        };
        checkTick();
        window._apcClockTimer = window.setInterval(checkTick, 500);
    },

    renderDashboard: function(s) {
        var self = this;
        this.lastStatus = s;
        var st = !s.running
            ? [ _('Service stopped'), 'bad' ]
            : (STATES[s.state] || [ s.state || '-', '' ]);
        var on = s.enabled == '1';
        var isLte = s.serving == 'lte';
        var prio = +s.priority;
        var cell = isLte
            ? (s.pci + ' / ' + s.earfcn)
            : (s.serving == 'other' ? _('Not on 4G') : (s.serving == 'none' ? _('No service') : '-'));

        var cellSub = isLte
            ? ((s.list && s.list != 'main' && s.list != 'none' ? (s.list_name || _('Timed list')) + ', ' : '') +
               (prio > 0 ? _('Priority') + ' ' + prio : _('Not on the list')) +
               (s.band ? ', ' + _('band') + ' ' + s.band : ''))
            : '';

        var sigSub = isLte
            ? ('RSRQ ' + s.rsrq + ' dB, SINR ' + s.sinr + ' dB, RSSI ' + s.rssi + ' dBm')
            : '';

        var portSub = (s.port_mode == 'manual' ? _('Manual') : _('Auto')) +
                      (s.port == 'mm' ? ', ModemManager' : ', at-daemon ' + (s.atd ? _('running') : _('not running')));

        var vis = this.applyPhoneVisualToDOM();

        var switchingCard = E('div', {
            'class': 'apc-card apc-card-switch' + (vis.cardClass ? ' ' + vis.cardClass : ''),
            'id': 'apc-switching-card'
        }, [
            E('div', { 'class': 'apc-switch-left' }, [
                E('h4', {}, _('Switching')),
                E('div', { 'class': 'apc-big', 'id': 'apc-switching-big' }, vis.bigText),
                E('div', { 'class': 'apc-sub', 'id': 'apc-switching-sub' }, vis.subText || '\u00a0')
            ]),
            this._rj11WidgetEl
        ]);

        var cellRows = (s.cells || []).map(function(c, i) {
            var cst = CELL_STATES[c.state] || [ c.state, '' ];
            return E('tr', { 'class': c.state == 'active' ? 'now' : '' }, [
                E('td', {}, String(i + 1)),
                E('td', {}, c.pci),
                E('td', {}, c.earfcn),
                E('td', {}, pill(cst[0], cst[1]))
            ]);
        });

        var visibleHist = s.history || [];
        var histRows = visibleHist.slice().reverse().map(function(h) {
            var switchCell = E('div', { 'class': 'apc-switch-flow' }, [
                E('span', { 'class': 'apc-switch-node' }, h.from || 'open'),
                E('span', { 'class': 'apc-switch-arrow' }, '\u2192'),
                E('span', { 'class': 'apc-switch-node' }, h.to || '-')
            ]);
            return E('tr', {}, [
                E('td', {}, formatShortStamp(h.time)),
                E('td', {}, [ switchCell ]),
                E('td', {}, REASONS[h.reason] || h.reason),
                E('td', {}, h.secs + ' s'),
                E('td', {}, pill(h.result == 'ok' ? _('Done') : _('Failed'), h.result == 'ok' ? 'ok' : 'warn'))
            ]);
        });

        var clearBtn = E('button', {
            'type': 'button',
            'class': 'apc-clear-hist-btn' + (histRows.length ? '' : ' is-empty'),
            'title': _('Clear recent switches'),
            'click': function(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                self.clearRecentSwitches();
            }
        }, [
            E('span', {}, '\u00d7'),
            E('span', {}, _('Clear'))
        ]);

        var nowStr = _('Updated') + ' ' + formatLiveClock(new Date());

        return E('div', {}, [
            E('div', { 'class': 'apc-head-wrap' }, [
                E('div', { 'class': 'apc-head' }, [
                    E('div', { 'class': 'apc-head-title' }, _('Auto Pci Cell')),
                    pill(on ? _('ON') : _('OFF'), on ? 'ok' : ''),
                    pill(st[0], st[1])
                ]),
                E('p', { 'class': 'apc-sub-desc' },
                    _('Intelligent 4G LTE cell locking & failover automation. Preserves 5G, bands & active calls.')),
                E('div', { 'class': 'apc-time-bar' }, [
                    E('span', { 'class': 'apc-time-dot', 'id': 'apc-live-clock-dot' }),
                    E('span', { 'class': 'apc-time-text', 'id': 'apc-live-clock-text' }, nowStr)
                ])
            ]),

            E('p', {
                'class': 'apc-warn',
                'style': s.state == 'other_lock' ? '' : 'display:none'
            }, _('The firmware has its own PCI lock turned on. Auto Pci Cell changes nothing until that lock is turned off.')),

            E('div', { 'class': 'apc-grid' }, [
                card(_('Current cell (PCI / EARFCN)'), cell, cellSub),
                card(_('Signal'), isLte && s.rsrp ? s.rsrp + ' dBm' : '-', sigSub),
                switchingCard,
                card(_('AT port'), s.port || '-', portSub)
            ]),

            E('div', { 'class': 'apc-title' }, _('Cells')),
            cellRows.length
                ? table([ _('Priority'), 'PCI', 'EARFCN', _('Status') ], cellRows, 'apc-scroll-cells')
                : E('div', { 'class': 'apc-scroll', 'id': 'apc-scroll-cells' },
                    E('div', { 'class': 'apc-empty' }, _('No cells yet. Add them below.'))),

            E('div', { 'class': 'apc-title' }, _('Recent switches')),
            histRows.length
                ? table([ _('Time'), _('Switch (From \u2192 To)'), _('Reason'), _('Took'), _('Result') ], histRows, 'apc-scroll-hist')
                : E('div', { 'class': 'apc-scroll', 'id': 'apc-scroll-hist' },
                    E('div', { 'class': 'apc-empty' }, _('No switches since the last restart.'))),
            E('div', { 'class': 'apc-hist-actions' }, [ clearBtn ])
        ]);
    },

    rerenderFormMap: function() {
        var self = this;
        var savedY = window.pageYOffset || document.documentElement.scrollTop || 0;
        return self.map.render().then(function(newNode) {
            if (self.mapContainer) {
                while (self.mapContainer.firstChild)
                    self.mapContainer.removeChild(self.mapContainer.firstChild);
                self.mapContainer.appendChild(newNode);
                self.bindEnhancements(self.mapContainer);
                window.scrollTo(0, savedY);
            }
        });
    },

    bindMainPriorityMove: function(rootEl) {
        var tableEl = rootEl.querySelector('.cbi-section-table');
        if (!tableEl) return;

        var rows = Array.prototype.slice.call(tableEl.querySelectorAll('.cbi-section-table-row'));
        var swapMainRows = function(idxA, idxB) {
            var curRows = Array.prototype.slice.call(tableEl.querySelectorAll('.cbi-section-table-row'));
            var rowA = curRows[idxA];
            var rowB = curRows[idxB];
            if (!rowA || !rowB) return;

            var cbA = rowA.querySelector('input[type="checkbox"]');
            var cbB = rowB.querySelector('input[type="checkbox"]');
            var txtsA = rowA.querySelectorAll('input[type="text"]');
            var txtsB = rowB.querySelectorAll('input[type="text"]');

            if (cbA && cbB) {
                var tmpCb = cbA.checked;
                cbA.checked = cbB.checked;
                cbB.checked = tmpCb;
            }
            if (txtsA[0] && txtsB[0]) {
                var tmpPci = txtsA[0].value;
                txtsA[0].value = txtsB[0].value;
                txtsB[0].value = tmpPci;
                txtsA[0].dispatchEvent(new Event('change', { bubbles: true }));
                txtsB[0].dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (txtsA[1] && txtsB[1]) {
                var tmpEar = txtsA[1].value;
                txtsA[1].value = txtsB[1].value;
                txtsB[1].value = tmpEar;
                txtsA[1].dispatchEvent(new Event('change', { bubbles: true }));
                txtsB[1].dispatchEvent(new Event('change', { bubbles: true }));
            }

            var cellSecs = uci.sections('auto-pci-cell', 'cell');
            if (cellSecs[idxA] && cellSecs[idxB]) {
                var sidA = cellSecs[idxA]['.name'];
                var sidB = cellSecs[idxB]['.name'];
                if (cbA) uci.set('auto-pci-cell', sidA, 'enabled', cbA.checked ? '1' : '0');
                if (txtsA[0]) uci.set('auto-pci-cell', sidA, 'pci', txtsA[0].value.trim());
                if (txtsA[1]) uci.set('auto-pci-cell', sidA, 'earfcn', txtsA[1].value.trim());
                if (cbB) uci.set('auto-pci-cell', sidB, 'enabled', cbB.checked ? '1' : '0');
                if (txtsB[0]) uci.set('auto-pci-cell', sidB, 'pci', txtsB[0].value.trim());
                if (txtsB[1]) uci.set('auto-pci-cell', sidB, 'earfcn', txtsB[1].value.trim());
            }

            rowB.classList.remove('apc-swapped');
            void rowB.offsetWidth;
            rowB.classList.add('apc-swapped');
        };

        rows.forEach(function(row, idx) {
            var actionCell = row.querySelector('td.cbi-section-table-cell');
            if (!actionCell) return;
            var oldBtns = actionCell.querySelectorAll('.apc-move-btn');
            oldBtns.forEach(function(b) { b.remove(); });

            var upBtn = E('button', {
                'type': 'button',
                'class': 'btn apc-move-btn',
                'title': _('Move Up'),
                'disabled': idx === 0 ? 'disabled' : null,
                'click': function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (idx > 0) swapMainRows(idx, idx - 1);
                }
            }, '\u25b2');

            var downBtn = E('button', {
                'type': 'button',
                'class': 'btn apc-move-btn',
                'title': _('Move Down'),
                'disabled': idx >= rows.length - 1 ? 'disabled' : null,
                'click': function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (idx < rows.length - 1) swapMainRows(idx, idx + 1);
                }
            }, '\u25bc');

            actionCell.insertBefore(downBtn, actionCell.firstChild);
            actionCell.insertBefore(upBtn, actionCell.firstChild);
        });
    },

    bindEnhancements: function(rootEl) {
        if (!rootEl) return;

        var masterRow = rootEl.querySelector('[data-tab="general"] .cbi-value[data-name="enabled"]') ||
                        rootEl.querySelector('.cbi-value[data-name="enabled"]');
        if (masterRow) {
            var cb = masterRow.querySelector('input[type="checkbox"]');
            if (cb) {
                var updateVisual = function() {
                    if (cb.checked) masterRow.classList.remove('is-master-off');
                    else masterRow.classList.add('is-master-off');
                };
                updateVisual();
                cb.addEventListener('change', updateVisual);
            }
        }

        this.bindMainPriorityMove(rootEl);
    },

    load: function() {
        var self = this;
        self.clearUnsavedBanner();
        return Promise.all([
            L.resolveDefault(callStatus(), {}),
            L.resolveDefault(callPorts(), []),
            uci.load('auto-pci-cell'),
            L.resolveDefault(callFxsStatus(), null)
        ]);
    },

    render: function(data) {
        var self = this;
        self.lastStatus = data[0] || {};
        self.lastFxs = data[3] || {};
        self.hasFxs = !!data[3];
        var box = E('div', {});
        self.dashboardBox = box;
        box.appendChild(self.renderDashboard(self.lastStatus));
        var ports = data[1];
        var m, s, o;

        m = new form.Map('auto-pci-cell', null, null);
        this.map = m;

        s = m.section(form.NamedSection, 'main', 'settings', _('Service & Modem Settings'));
        s.tab('general', _('General'));
        s.tab('timing', _('Timing & Probing'));

        o = s.taboption('general', form.Flag, 'enabled', _('Enable Auto Pci Cell'),
            _('Master switch: Automatically lock and maintain the best 4G cell from your priority list.'));
        o.rmempty = false;

        o = s.taboption('general', form.ListValue, 'off_action', _('Action When Turned Off'),
            _('Choose how the modem 4G cell lock should be left when this service is disabled.'));
        o.value('restore', _('Restore previous lock from before service started'));
        o.value('keep', _('Keep current active 4G lock'));
        o.value('clear', _('Clear and remove 4G cell lock'));

        o = s.taboption('general', form.ListValue, 'at_port_mode', _('AT Port Selection Mode'),
            _('Automatically detect modem AT port or specify a custom port manually.'));
        o.value('auto', _('Automatic Detection'));
        o.value('manual', _('Manual Port Selection'));

        o = s.taboption('general', form.ListValue, 'manual_at_port', _('Manual AT Port'));
        ports.forEach(function(p) { o.value(p, p == 'mm' ? 'ModemManager' : p); });
        if (!ports.length)
            o.value('/dev/ttyUSB2');
        o.depends('at_port_mode', 'manual');

        o = s.taboption('general', form.Button, '_test', _('Test Modem AT Port'),
            _('Safely queries modem model and current lock state without interrupting connection.'));
        o.inputtitle = _('Test Port');
        o.inputstyle = 'action';
        o.onclick = function(ev, sid) {
            var btn = ev.currentTarget;
            var mode = this.section.getUIElement(sid, 'at_port_mode');
            var man = this.section.getUIElement(sid, 'manual_at_port');
            var port = (mode && mode.getValue() == 'manual' && man)
                ? man.getValue()
                : (box.dataset.port || '/dev/ttyUSB2');
            var fieldHolder = btn.closest('.cbi-value-field');

            self.setBtnSpin(btn, _('Testing...'), true);

            return callTest(port).then(function(r) {
                self.setBtnSpin(btn, _('Test Port'), false);
                if (fieldHolder) {
                    var oldRes = fieldHolder.querySelector('.apc-test-result');
                    if (oldRes) oldRes.remove();
                    var msg = r.ok
                        ? ('\u2713 ' + port + ' - ' + _('Connected') +
                           (r.model ? ' (' + r.model + ')' : '') +
                           (r.lock ? ' \u2022 ' + _('Lock: ') + r.lock : ''))
                        : ('\u2717 ' + port + ' - ' + (r.error || _('No response from modem')));
                    fieldHolder.appendChild(
                        E('div', { 'class': 'apc-test-result ' + (r.ok ? 'ok' : 'bad') }, msg)
                    );
                }
            }).catch(function() {
                self.setBtnSpin(btn, _('Test Port'), false);
            });
        };

        function num(tab, name, title, desc, lo, hi, def) {
            var v = s.taboption(tab, form.Value, name, title, desc);
            v.datatype = 'range(' + lo + ',' + hi + ')';
            v.placeholder = String(def);
            v.rmempty = true;
            return v;
        }

        num('timing', 'interval', _('Status Check Interval (Seconds)'),
            _('How often to check serving cell and signal metrics (1-60s).'), 1, 60, 3);
        num('timing', 'lost_secs', _('Signal Loss Hold Time (Seconds)'),
            _('Seconds signal must stay lost or weak before switching to next cell.'), 3, 300, 10);
        o = s.taboption('timing', form.Value, 'min_rsrp', _('Minimum RSRP Threshold (dBm)'),
            _('Treat current cell as weak/lost when RSRP drops below this level.'));
        o.datatype = 'range(-140,-44)';
        o.placeholder = '-125';
        num('timing', 'verify_timeout', _('New Cell Lock Timeout (Seconds)'),
            _('Maximum seconds to wait for modem to attach after locking a cell.'), 5, 120, 20);
        num('timing', 'retry_delay', _('Failed Cell Retry Cooldown (Seconds)'),
            _('Initial cooldown before retrying a failed cell (doubles on each failure up to 15m).'), 10, 900, 60);
        num('timing', 'neighbour_interval', _('Neighbour Cell Scan Interval (Seconds)'),
            _('How often to scan neighbouring LTE cells for higher-priority towers.'), 5, 600, 15);

        o = s.taboption('timing', form.Flag, 'probe', _('Actively Probe Better Cells'),
            _('Periodically test higher-priority cells even if they do not appear in neighbour scans.'));
        o.default = '1';
        num('timing', 'probe_interval', _('Active Probe Interval (Seconds)'),
            _('Time between active probes for a higher-priority cell.'), 60, 3600, 300).depends('probe', '1');
        num('timing', 'probe_timeout', _('Probe Attach Timeout (Seconds)'),
            _('Maximum time allowed for each active cell probe attempt.'), 5, 120, 12).depends('probe', '1');

        o = s.taboption('timing', form.Flag, 'probe_schedule', _('Restrict Probing to Time Window'),
            _('Only run active cell probes during specific hours to prevent daytime interruptions.'));
        o.depends('probe', '1');
        o = s.taboption('timing', form.Value, 'probe_from', _('Probe Window Start Time (24h)'));
        o.placeholder = '01:00';
        o.default = '01:00';
        o.depends('probe_schedule', '1');
        o.validate = hhmm;
        o = s.taboption('timing', form.Value, 'probe_to', _('Probe Window End Time (24h)'));
        o.placeholder = '06:00';
        o.default = '06:00';
        o.depends('probe_schedule', '1');
        o.validate = hhmm;

        num('timing', 'call_grace', _('Voice Call Grace Delay (Seconds)'),
            _('Wait time after a voice call finishes before switching cells.'), 0, 120, 5);
        num('timing', 'sms_hold', _('SMS Protection Hold Time (Seconds)'),
            _('Wait time after sending/receiving an SMS before switching cells.'), 0, 120, 20);

        s = m.section(form.NamedSection, 'main', 'settings', _('Main Priority List Control'));
        o = s.option(form.Flag, 'main_list', _('Enable Main Priority List'),
            _('Use the Main Priority List whenever no Timed Priority List covers the current router time.'));
        o.default = '1';
        o.rmempty = false;

        s = m.section(form.TableSection, 'cell', _('Main Priority List (Up to 5 Cells)'),
            _('Top row is Priority #1. Use the Up/Down arrows to reorder priority.'));
        s.anonymous = true;
        s.addremove = true;
        s.nodescriptions = true;
        s.handleAdd = function(ev) {
            if (this.cfgsections().length >= 5) {
                ui.addNotification(null, E('p', {}, _('Maximum of 5 priority cells allowed.')), 'warning');
                return Promise.resolve();
            }
            self.syncFormValuesToMemory();
            var sid = uci.add('auto-pci-cell', 'cell');
            uci.set('auto-pci-cell', sid, 'enabled', '1');
            return self.rerenderFormMap();
        };
        s.handleRemove = function(section_id, ev) {
            self.syncFormValuesToMemory();
            uci.remove('auto-pci-cell', section_id);
            return self.rerenderFormMap();
        };

        o = s.option(form.Flag, 'enabled', _('Enable'));
        o.default = '1';
        o.rmempty = false;

        function pair(section_id, name, value) {
            var sec = this.section, list = sec.cfgsections(), i, a, b;
            var pci = name == 'pci' ? value : sec.formvalue(section_id, 'pci');
            var ear = name == 'earfcn' ? value : sec.formvalue(section_id, 'earfcn');

            for (i = 0; i < list.length; i++) {
                if (list[i] == section_id)
                    continue;
                a = sec.formvalue(list[i], 'pci') || uci.get('auto-pci-cell', list[i], 'pci');
                b = sec.formvalue(list[i], 'earfcn') || uci.get('auto-pci-cell', list[i], 'earfcn');
                if (a && b && a == pci && b == ear)
                    return _('This PCI/EARFCN pair is already in the list');
            }
            return true;
        }

        o = s.option(form.Value, 'pci', _('PCI (0-503)'));
        o.datatype = 'range(0,503)';
        o.placeholder = '175';
        o.rmempty = false;
        o.validate = function(id, v) { return pair.call(this, id, 'pci', v); };

        o = s.option(form.Value, 'earfcn', _('EARFCN'));
        o.datatype = 'range(0,262143)';
        o.placeholder = '400';
        o.rmempty = false;
        o.validate = function(id, v) { return pair.call(this, id, 'earfcn', v); };

        s = m.section(form.TypedSection, 'schedule', _('Timed Priority Lists (Scheduled)'),
            _('Automatically switch to a custom cell list during specific hours. Use Up/Down arrows to reorder cells.'));
        s.anonymous = true;
        s.addremove = true;
        s.handleAdd = function(ev) {
            self.syncFormValuesToMemory();
            var sid = uci.add('auto-pci-cell', 'schedule');
            uci.set('auto-pci-cell', sid, 'enabled', '1');
            uci.set('auto-pci-cell', sid, 'name', 'Night');
            uci.set('auto-pci-cell', sid, 'from', '18:00');
            uci.set('auto-pci-cell', sid, 'to', '08:00');
            return self.rerenderFormMap();
        };
        s.handleRemove = function(section_id, ev) {
            self.syncFormValuesToMemory();
            uci.remove('auto-pci-cell', section_id);
            return self.rerenderFormMap();
        };

        o = s.option(form.Flag, 'enabled', _('Enable This Schedule'));
        o.default = '1';
        o.rmempty = false;

        o = s.option(form.Value, 'name', _('Schedule Name'));
        o.placeholder = _('Night');
        o.default = 'Night';
        o.datatype = 'maxlength(24)';

        function hhmm(id, v) {
            return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(v || '')
                ? true
                : _('Use 24-hour format (e.g. 18:30)');
        }

        o = s.option(form.Value, 'from', _('Start Time (24h)'));
        o.placeholder = '18:00';
        o.default = '18:00';
        o.rmempty = false;
        o.validate = hhmm;

        o = s.option(form.Value, 'to', _('End Time (24h)'));
        o.placeholder = '08:00';
        o.default = '08:00';
        o.rmempty = false;
        o.validate = hhmm;

        o = s.option(CBIScheduledCells, 'cell', _('Scheduled Cells (PCI,EARFCN)'),
            _('Enter each cell as PCI,EARFCN (e.g. 175,400) and press + to add. Use Up/Down arrows to reorder priority (Max 5).'));

        poll.add(function() {
            return L.resolveDefault(callStatus(), {}).then(function(st) {
                self.updateDashboardPreservingScroll(box, st);
            });
        }, 5);

        box.dataset.port = self.lastStatus.port || '';

        var signatureFooter = E('div', { 'class': 'apc-signature-footer' }, [
            E('div', { 'class': 'apc-sig-top' }, [
                E('span', { 'style': 'font-weight:700;opacity:0.94;' }, 'Auto Pci Cell')
            ]),
            E('div', { 'class': 'apc-sig-credits' }, [
                E('span', {}, [
                    _('Original by '),
                    E('span', { 'class': 'apc-orig-name' }, 'Perz3us')
                ]),
                E('span', { 'style': 'opacity:0.45;' }, '\u2022'),
                E('span', {}, [
                    _('Customized by '),
                    E('span', { 'class': 'apc-dev-name' }, 'LakshanRM')
                ])
            ])
        ]);

        return m.render().then(function(node) {
            var formHolder = E('div', { 'id': 'apc-form-holder' }, [ node ]);
            self.mapContainer = formHolder;
            self.bindEnhancements(formHolder);

            window.setTimeout(function() {
                self.clearUnsavedBanner();
                self.startLiveSecondTicker();
                self.startLivePhoneTicker();
                var actionsBar = document.querySelector('.cbi-page-actions');
                if (actionsBar && actionsBar.parentNode) {
                    actionsBar.parentNode.insertBefore(signatureFooter, actionsBar.nextSibling);
                }
            }, 50);

            return E('div', { 'class': 'apc-wrapper' }, [
                E('style', {}, CSS),
                box,
                formHolder,
                signatureFooter
            ]);
        });
    },

    handleReset: function(ev) {
        var self = this;
        uci.unload('auto-pci-cell');
        return uci.load('auto-pci-cell').then(function() {
            self.clearUnsavedBanner();
            return self.rerenderFormMap();
        });
    }
});
