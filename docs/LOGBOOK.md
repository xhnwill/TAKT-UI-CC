# 项目日志

## 2026-10-24 — 1.1.0 Windows 11

### 目标与决策

将 macOS 优先的多机 Claude Code 工作台交付为可在 Windows 11 x64 直接运行的桌面程序，复用现有 Web 工作台及 Linux tmux 会话模型。

- 桌面采用 Electron，后端运行在独立的 Node.js 进程，避免 Electron ABI 与 node-pty 原生模块不匹配。安装/便携包内置运行时，不要求 WSL 或 Git Bash。
- Windows OpenSSH 不使用 ControlMaster socket。由 MCP 进程持有每节点的前台 `ssh -N -T` 子进程；重连只操作专用隧道，节点停用/删除及应用退出回收子进程，不使用 pkill 或杀远端占用进程。
- 保留回环监听、SSH 反向隧道和 Token 鉴权。Tailscale 安装与授权独立进行，只需将 SSH 别名配置为服务器的 Tailscale 地址。
- 保留 MCP 服务/工具名称兼容旧的远端配置；Windows 使用 PowerShell、COM、CIM、System.Drawing 及 Windows 工具路径，隐藏两个 Xcode 工具。
- 本地盘符/中文/混合分隔符与 Linux 路径分开处理，拖入终端的路径按目标系统转换。通过 AsyncLocalStorage 隔离并发 MCP 请求所属节点。
- 新增“本机终端”，方便无服务器时检查 OpenSSH 和工具配置。Token 首次生成应用当前用户专属 NTFS ACL。

### 验证边界

执行 JavaScript/前端语法、ESLint、路径/引用/隧道生命周期测试、真实 Windows OpenSSH 到临时 SSH 服务的反向 HTTP 转发和重连测试、服务/API/MCP/ConPTY 集成测试、Electron 界面/终端/文件预览及进程退出测试。构建并验证 Windows 桌面产物。

自动化产生的报告在 `build/`，安装/便携产物在 `dist/windows/`，不纳入源码提交。当前未指定可用 Linux 节点与硬件设备，因此真实远端 Claude 对话、Syncthing 双向配对、可选 CAD/EDA 与固件烧录需要在对应环境进一步验收；不能由本机测试推断通过。

本机 Windows 验证结果：6 项测试通过；服务集成检查通过（21 个 MCP 工具、PowerShell、COM/USB 枚举、截图、中文文件预览/上传、ConPTY 输入输出/缩放/关闭）；Electron 源码及打包 EXE 检查通过（项目列表、终端和预览渲染、Node 隔离、退出清理）。打包 EXE 在 PATH 仅含 Windows 系统目录时仍可运行，确认后端使用内置 Node 与依赖。界面实测图见 `images/windows11.png`。

便携版验证中发现自解压启动器与实际桌面进程生命周期不同，测试脚本须跟踪实际桌面 PID，不能因启动器退出就删除测试数据。同步修正应用错误提示以显示后端日志真实原因；第二实例退出只清理自身持有的子进程，不能向第一实例发送服务关闭请求。EXE 资源元数据与包版本统一为 1.1.0，保留未配置签名证书的实际状态。

完整退出日志确认便携版启动失败的直接原因是 `node-pty` 没有进入包内：通用 extraResources 匹配器过滤了嵌套 node_modules；在工程内验证解包版时 Node 又沿祖先目录找到了源码依赖，掩盖缺失。增加以生产 node_modules 为根的独立资源匹配器，并在 afterPack 中强制检查所有运行依赖存在、由内置 Node 加载且解析路径位于包内；最终以临时目录解压的便携 EXE 验证独立运行。

最终便携 EXE 已在限制 PATH、工程外临时解压环境通过界面、终端、中文文件预览及退出清理检查，rendererErrors 为 0。源码/解包 EXE 的重复实例检查通过；便携启动器的重复实例检查未执行，报告以 null 标记未验证项，不当作失败或通过。
