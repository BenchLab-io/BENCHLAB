<div align="center">

# BENCHLAB

**Illuminate your insights — real-time system telemetry for PC DIY enthusiasts and labs.**

[Website](https://benchlab.io) · [Shop](https://benchlab.io) · [BENCHLAB 2 Announcement](https://benchlab.io/blogs/news/introducing-benchlab-2)

</div>

---

## What is BENCHLAB?

BENCHLAB is a compact, real-time system telemetry board that connects over USB Type-C and lets you monitor:

- **Power** — per-rail and per-pin draw, including individual 12VHPWR pin monitoring on BENCHLAB 2
- **Voltage**
- **Temperature** — including 12VHPWR power in/out temperature on BENCHLAB 2
- **Humidity**
- **Fan speed**, with manual and automated control

Telemetry is displayed live in the BENCHLAB Dashboard app, and can be logged/exported to a file or to HWiNFO.

**BENCHLAB 2** launched in 2026 as a redesign of the original BENCHLAB (available since December 2023), with a 6-layer PCB for lower noise and voltage drop, full 12VHPWR pin-level monitoring, physical power/reset buttons, built-in fault detection with an audible alarm, and support for up to 2 SSDs. Read more in the [BENCHLAB 2 announcement](https://benchlab.io/blogs/news/introducing-benchlab-2).

Hardware is available for purchase at [benchlab.io](https://benchlab.io).

<table>
<tr>
<th>BENCHLAB 2</th>
<th>BENCHLAB 1</th>
</tr>
<tr>
<td><img src="https://benchlab.io/cdn/shop/files/BENCHLAB2_Front.png" width="400" alt="BENCHLAB 2"></td>
<td><img src="https://github.com/BENCHLAB-io/BENCHLAB/assets/2151317/6aa9c95a-c936-4c4b-9b91-a81a62c2ebf7" width="400" alt="BENCHLAB 1"></td>
</tr>
</table>

---

## Software, firmware & tools

This repo is the central index for everything BENCHLAB. The table below is regenerated automatically every day (see [`.github/workflows/sync-readme.yml`](.github/workflows/sync-readme.yml)) from [`repos.json`](repos.json), pulling each project's latest release directly from GitHub — so it's always current.

Source for some projects is kept private; for those, use the release link to download installers/binaries directly.

<!-- BENCHLAB-REPOS:START -->

| Project | Description | Source | Latest release | Updated |
|---|---|---|---|---|
| **BENCHLAB 2 Firmware** | Firmware for the BENCHLAB 2 hardware board | Private source | [benchlab2/v0.7.4](https://github.com/BenchLab-io/BENCHLAB-FW/releases/tag/benchlab2/v0.7.4) | 2026-10-16 |
| **BENCHLAB 1 Firmware** | Firmware for the original BENCHLAB hardware board | Private source | [benchlab1/v0.6.0](https://github.com/BenchLab-io/BENCHLAB-FW/releases/tag/benchlab1/v0.6.0) | 2026-09-29 |
| **BENCHLAB Dashboard** | Windows desktop app for monitoring & controlling BENCHLAB hardware | Private source | [v1.0.0](https://github.com/BenchLab-io/BENCHLAB.BENCHLAB_Software/releases/tag/v1.0.0) | 2024-11-12 |
| **BENCHLAB Service** | BENCHLAB software core exposed as a background service | Private source | [v2.6.1](https://github.com/BenchLab-io/BENCHLAB.BENCHLAB_Service/releases/tag/v2.6.1) | 2026-09-29 |
| **BENCHLAB PyCore** | Python interface library for talking to BENCHLAB hardware | Private source | [v0.8.0](https://github.com/BenchLab-io/benchlab-pycore/releases/tag/v0.8.0) | 2026-09-29 |
| **BENCHLAB PyTools** | Python tools & scripts built on top of BENCHLAB PyCore | [Public source](https://github.com/BenchLab-io/benchlab-pytools) | [v3.3.1](https://github.com/BenchLab-io/benchlab-pytools/releases/tag/v3.3.1) | 2026-10-17 |
| **BENCHLAB iCUE Widget** | BENCHLAB widget integration for Corsair iCUE | Private source | [v1.0.12](https://github.com/BenchLab-io/benchlab-icue-widget/releases/tag/v1.0.12) | 2026-09-09 |

<!-- BENCHLAB-REPOS:END -->

---

## FAQ

**My antivirus flags the software when I unzip / run it.**
This can happen with Windows Defender SmartScreen or similar tools — as a small team, we're not yet a "known" source for software distribution to every AV vendor.

**Can I talk to BENCHLAB hardware from a script?**
Yes — see [benchlab-pycore](https://github.com/BenchLab-io/benchlab-pycore) for the Python interface, and [benchlab-pytools](https://github.com/BenchLab-io/benchlab-pytools) for ready-made scripts built on top of it.

**Where do I report a bug?**
Open an issue on the specific project's repository (see the table above). For general support, contact [contact@benchlab.io](mailto:contact@benchlab.io).

## Professional services & support

For professional partners, labs, and benchmark-automation groups: get in touch at [contact@benchlab.io](mailto:contact@benchlab.io) for alternative integration options, dedicated support, and calibration services.

## Disclaimer

The BENCHLAB team aims to provide a reliable, polished experience, but as with any actively developed hardware/software project, bugs and limitations can still be present. Please report issues via the relevant project's GitHub Issues tab.

---

<div align="center">

BENCHLAB is brought to you by **The OpenBenchtable Project** & **ElmorLabs**

</div>

### Open source components used

- [SkiaSharp](https://github.com/mono/SkiaSharp)
- [HarfBuzz](https://github.com/harfbuzz/harfbuzz)
- [AvaloniaUI](https://github.com/AvaloniaUI/Avalonia)
