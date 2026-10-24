# Changelog

## 1.1.1 — 2026-10-24

- Point the Windows source and clone instructions at the user-owned xhnwill/TAKT-UI-CC fork.
- Align desktop, backend and macOS shell version metadata with the corrected repository handoff; preserve the Windows runtime and dependency-packaging fixes.

## 1.1.0 — 2026-10-24

- Add a Windows 11 x64 Electron desktop, NSIS installer, portable EXE and double-click source launcher; bundle Node.js and production ConPTY dependencies.
- Replace Windows-local Bash/ControlMaster requirements with Node session launchers and owned foreground SSH tunnel children with reconnect and cleanup.
- Add Windows PowerShell, CIM USB/COM, SerialPort, screenshot, browser/application launch and flashing adapters; keep MCP names compatible and hide Xcode tools.
- Correct Windows/Linux mirror paths, terminal path quoting, per-request MCP node context and environment handling. Protect new tokens with NTFS ACLs.
- Add authenticated service lifecycle endpoints, local terminal, Windows guide/logbook, platform tests, real loopback OpenSSH reverse-forward test and service/desktop smoke checks.

## 1.0.0 — first public release

- Multi-node workbench: any number of Linux hosts, each with its own local mirror folder, Syncthing folder and MCP tunnel.
- Codex-style sidebar: machine switch, projects → conversations, tags with colour filter, "see all" folding, rename/delete.
- Local SQLite state store — the sidebar is served from the database and never loses entries when a server is offline.
- Persistent terminals (ssh + tmux) with auto-reconnect; native SwiftTerm engine in the macOS app, xterm.js/node-pty in the browser.
- Local file mirror with instant preview, drag & drop in/out of the terminal.
- One-click node provisioning including **automatic two-way Syncthing pairing**.
- Local MCP server with 23 tools, reverse-tunnelled to every node; generic multi-node watchdog with tunnel self-heal.
- Security hardening: loopback-only servers, Host/Origin validation, bearer-token auth on MCP, `mac_host_exec` = ask by default.
- Scripts: `install`, `start`, `stop`, `doctor`, `build-app`, `remote-bootstrap`.
