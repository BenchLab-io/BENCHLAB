# BENCHLAB
ILLUMINATE YOUR INSIGHTS | REAL-TIME SYSTEM TELEMETRY SOLUTION

BENCHLAB is a cutting-edge, compact, real-time system telemetry solution engineered for PC DIY enthusiasts.
It allows you to effortlessly monitor critical system metrics, including temperature, power usage, and voltage levels.
You can also manage system fan speeds. The telemetry data is displayed in the BENCHLAB software, and you can log and export data to a file or to HWiNFO.

Monitoring is available for:
- Power
- Voltage
- Temperature
- Humidity

BENCHLAB is available for purchase starting from December 29th, 2023 at BENCHLAB.io.
![image](https://github.com/BENCHLAB-io/BENCHLAB/assets/2151317/6aa9c95a-c936-4c4b-9b91-a81a62c2ebf7)

# How to install & use the BENCHLAB software
- Download the BENCHLAB software from the official Github releases page: [https://github.com/BENCHLAB-io/BENCHLAB.BENCHLAB_Software/releases](https://github.com/BENCHLAB-io/BENCHLAB.BENCHLAB_Software/releases)
- Unzip the files in a new folder
- Double-click the executable "BENCHLAB.exe" to start the software
- Make sure the BENCHLAB is connected to the system where the software is installed
- Run the software, you should see that the BENCHLAB device is connected

# Our software & tools

This table is regenerated automatically every day from each project's latest GitHub release (see `.github/workflows/sync-readme.yml`). Some source repos are kept private; for those, use the release link to get installers/binaries.

<!-- BENCHLAB-REPOS:START -->

| Project | Description | Source | Latest release | Updated |
|---|---|---|---|---|
| **BENCHLAB Firmware** | Firmware running on the BENCHLAB hardware board | Private source | [benchlab2/v0.7.4](https://github.com/BenchLab-io/BENCHLAB-FW/releases/tag/benchlab2/v0.7.4) | 2026-10-16 |
| **BENCHLAB Software** | Windows desktop app for monitoring & controlling BENCHLAB hardware | Private source | [v1.0.0](https://github.com/BenchLab-io/BENCHLAB.BENCHLAB_Software/releases/tag/v1.0.0) | 2024-11-12 |
| **BENCHLAB Service** | BENCHLAB software core exposed as a background service | Private source | [v2.6.1](https://github.com/BenchLab-io/BENCHLAB.BENCHLAB_Service/releases/tag/v2.6.1) | 2026-09-29 |
| **BENCHLAB PyCore** | Python interface library for talking to BENCHLAB hardware | Private source | [v0.8.0](https://github.com/BenchLab-io/benchlab-pycore/releases/tag/v0.8.0) | 2026-09-29 |
| **BENCHLAB PyTools** | Python tools & scripts built on top of BENCHLAB PyCore | [Public source](https://github.com/BenchLab-io/benchlab-pytools) | [v3.3.1](https://github.com/BenchLab-io/benchlab-pytools/releases/tag/v3.3.1) | 2026-10-17 |
| **BENCHLAB iCUE Widget** | BENCHLAB widget integration for Corsair iCUE | Private source | [v1.0.12](https://github.com/BenchLab-io/benchlab-icue-widget/releases/tag/v1.0.12) | 2026-09-09 |

<!-- BENCHLAB-REPOS:END -->

# FAQ
- My antivirus is giving a warning when I unzip / run the program
This can happen with Windows Defender SmartScreen or AVAST as we are a small team we are not yet a "known" source for software distribution.

- Can I communicate with the BENCHLAB Hardware with a script?
Yes, check out [benchlab-pycore](https://github.com/BenchLab-io/benchlab-pycore) and [benchlab-pytools](https://github.com/BenchLab-io/benchlab-pytools).

# Change log
Check each project's release page for changes.

# Professional services, support & calibration
For professional partners, Labs and Benchmark-automation groups, feel free to contact us at contact@BENCHLAB.io for alternative ways to communicate with the BENCHLAB hardware, dedicated support and extra calibration needs.

# Disclaimer
The BENCHLAB Team's goals are to provide a reliable and good user experience, keep in mind that bugs & limitations can still be present.
If you encounter a bug in the software, you can report it in the "issue" tab of the relevant repository. If you need support, contact us at contact@BENCHLAB.io.

## BENCHLAB is brought to you by The OpenBenchtable Project & ElmorLabs

## This project is made possible using Open Source components
- SkiaSharp https://github.com/mono/SkiaSharp
- HarfBuzz https://github.com/harfbuzz/harfbuzz
- AvaloniaUI https://github.com/AvaloniaUI/Avalonia
