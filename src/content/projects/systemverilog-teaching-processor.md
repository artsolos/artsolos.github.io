---
title: A teaching processor in SystemVerilog
summary: Seven connected labs turn a 16-bit signed adder into a small FPGA processor with registers, load/store memory, instruction fetch, and conditional branches. The documented hardware program multiplies 4 by 3 through a loop.
description: EECE 2323 Fundamentals of Digital Design coursework in SystemVerilog and Vivado on a TUL PYNQ board, with simulation waveforms, VIO hardware evidence, reviewed report downloads, and selected source excerpts.
contribution: Implemented and tested the individual lab designs, integrated the evolving datapath with course support blocks, and wrote the reports. Added branch logic and the multiplication test program in the final lab.
categories: [digital-design]
setting: coursework
role: SystemVerilog design, datapath integration, simulation, hardware tests, reports
context: EECE 2323 Fundamentals of Digital Design, Northeastern University (Labs 1–7)
period: May–June 2026
sortDate: 2026-06-17
tools: [SystemVerilog, Vivado, Behavioral simulation, Virtual Input/Output (VIO), TUL PYNQ FPGA board, Distributed Memory Generator IP]
status: complete
placement: coursework
order: 20
cover: ../../assets/projects/systemverilog-teaching-processor/instruction-fetch-datapath.png
coverAlt: Datapath diagram from the Lab 6 report, showing program counter, instruction memory, mapper, instruction decoder, register file, ALU, data memory, and VIO observation signals.
figures:
  - src: ../../assets/projects/systemverilog-teaching-processor/signed-adder-waveform.png
    alt: Vivado waveform for the 16-bit adder testbench, showing input operands, sum, and signed-overflow flag across the test vectors.
    caption: Lab 1, Figure A1. Simulation covers ordinary signed addition, positive and negative overflow, and mixed-sign inputs.
    group: Arithmetic and stored operands
  - src: ../../assets/projects/systemverilog-teaching-processor/register-file-vio.png
    alt: Two VIO captures showing a register value of hexadecimal 0011 and an ADD result of 001D from operands 000C and 0011.
    caption: Lab 3, Figures C2–C3. Register-backed operands 12 and 17 produce 29 in the ALU.
    group: Arithmetic and stored operands
  - src: ../../assets/projects/systemverilog-teaching-processor/memory-writeback-vio.png
    alt: VIO capture showing register read data 0006 and 0004, with ALU output 000A after memory load tests.
    caption: Lab 4, Figure C7. The final check uses loaded values 6 and 4 as ALU operands and produces hexadecimal 000A.
    group: Memory and instruction control
  - src: ../../assets/projects/systemverilog-teaching-processor/decoder-waveform.png
    alt: Vivado simulation showing decoder control signals as opcodes cycle through load, store, arithmetic, logic, shifts, branches, and an invalid opcode.
    caption: Lab 5, Figure A1. Decoder simulation checks the control outputs before full-datapath hardware testing.
    group: Memory and instruction control
  - src: ../../assets/projects/systemverilog-teaching-processor/instruction-fetch-datapath.png
    alt: Lab 6 datapath with an eight-bit program counter feeding instruction memory, a field mapper, and the instruction decoder.
    caption: Lab 6, Figure A1. The report's course datapath diagram shows instruction fetch added to the existing register/ALU/memory structure. This is the Lab 6 structure, before Lab 7's nine-bit branching PC.
    group: Fetch and branch control
  - src: ../../assets/projects/systemverilog-teaching-processor/branch-taken-vio.png
    alt: VIO capture at PC 008 showing the BNEZ instruction FDF5, a negative offset, and the branch flag asserted.
    caption: Lab 7, Figure C9. The nonzero loop counter causes a backward branch from PC 008 toward the loop at PC 006.
    group: Fetch and branch control
  - src: ../../assets/projects/systemverilog-teaching-processor/loop-result-vio.png
    alt: VIO capture at PC 00F with register read values 000C and live ALU and writeback values 0018.
    caption: Lab 7, Figure C15. Register read data shows the loop result 000C (12). The live ALU/writeback value is 0018, so this capture does not verify a result-preserving halt instruction.
    group: Fetch and branch control
downloads:
  - label: Download Lab 1 report (PDF)
    path: downloads/eece2323/lab-1-report.pdf
  - label: Download Lab 2 report (PDF)
    path: downloads/eece2323/lab-2-report.pdf
  - label: Download Lab 3 report (PDF)
    path: downloads/eece2323/lab-3-report.pdf
  - label: Download Lab 4 report (PDF)
    path: downloads/eece2323/lab-4-report.pdf
  - label: Download Lab 5 report (PDF)
    path: downloads/eece2323/lab-5-report.pdf
  - label: Download Lab 6 report (PDF)
    path: downloads/eece2323/lab-6-report.pdf
  - label: Download Lab 7 report (PDF)
    path: downloads/eece2323/lab-7-report.pdf
    note: Report copies omit instructor identity and document metadata; the technical content is retained.
  - label: Download selected source excerpts (ZIP)
    path: downloads/eece2323/selected-source-excerpts.zip
    note: SystemVerilog, testbenches, assembly, and COE recovered from the report appendices. Includes a README; this is not a complete Vivado project.
related: [fpga-digital-logic, arm-fpga-servo-control]
series:
  name: EECE 2323
  part: Labs 1–7
openQuestions:
  - Lab 6's final PC labels differ between its table and captions. Exact final instruction indices are not asserted here.
  - Lab 7's done listing and Figure C15 disagree about the live writeback value. Only the pre-end-step loop result is claimed; no verified halt or persistence after another clock.
---

## Goal and my contribution

The goal was to build a processor datapath in stages: first compute a value, then store operands, move data through memory, decode instructions, fetch a program, and finally execute a loop. These were individual labs. I wrote and tested the lab designs in SystemVerilog, integrated the growing datapath, and documented the simulation and FPGA tests in seven reports.

The course supplied support infrastructure, including the initial top/display/constraint setup and generated IP. My contribution is the lab implementation and integration described in the reports, rather than an independently invented processor architecture or a complete commercial instruction set.

## Lab 1: Signed addition

I implemented a 16-bit two's-complement adder and detected signed overflow from the operand and result sign bits. Behavioral simulation includes `7FFF + 0001 = 8000` with overflow asserted. VIO hardware captures also show ordinary addition and an overflow case. This extends the arithmetic ideas from my earlier DE1-SoC schematic work using HDL and a different FPGA toolchain.

## Lab 2: Arithmetic and logic

I expanded the adder into a combinational ALU with nine operations: addition, inversion, AND, OR, arithmetic right shift, logical left shift, branch-if-zero, branch-if-nonzero, and XOR. Default assignments define the outputs for unused selectors. Simulation and VIO tests cover signed overflow, sign-preserving right shift, and branch conditions.

## Lab 3: Register-backed operands

I added eight 16-bit registers, two combinational read ports, clocked writes, and input-selection muxes. The documented check stores `000C` and `0011`, reads them into the ALU, and produces `001D`—12 + 17 = 29. Separating clocked storage from combinational computation made the datapath easier to test one step at a time.

## Lab 4: Load and store

I integrated a 1,024-word, 16-bit data memory generated with Vivado's Distributed Memory Generator. The ALU supplies the low ten address bits, while a writeback mux selects the ALU result or memory data. The report documents storing 4 and 6, loading them into registers, and adding the loaded values to obtain `000A`. I disabled register and memory writes while changing VIO inputs to avoid unintended state changes.

## Lab 5: Instruction decoding

I replaced manually selected control signals with an instruction decoder. It generates register, mux, ALU, and memory controls from opcode and immediate fields. The testbench steps through the supported opcodes and an invalid one; hardware captures document arithmetic, conditional branch signals, and a store/load round trip of `0008`.

## Lab 6: Fetching stored instructions

I added an eight-bit program counter and connected a 256-entry, 16-bit instruction ROM to the mapper and decoder. Reset returns the PC to zero, and a debounced button press advances one instruction. VIO captures show the supplied program's instruction stream and stored values `000B` and `0003` being loaded back from data memory. I also appended instruction tests for immediate addition, shift, and AND.

## Lab 7: Branches and a multiplication loop

I extended the PC to nine bits and added the choice between `PC + 1` and `PC + signed offset`. I also checked immediate sign extension and prepared a repeated-addition program using registers x8–x11.

For the documented **4 × 3** hardware test, the program adds 4 into the product while a counter counts down. The report records products 4, 8, and 12, backward branches while the counter is nonzero, and a forward branch when the loop finishes. The final capture shows register read data `000C` (12). Its live ALU/writeback value is `0018`, so I do not treat the instruction labeled “done” as a verified halt or claim that another clock preserves the result.

The assembly includes negative-multiplier and zero-multiplier paths, but those paths were not hardware-validated in the supplied work. The demonstrated result is the positive multiplication loop, rather than general signed-multiplication correctness.

## Evidence and downloads

The figures below come from the reports. All seven reviewed PDF copies and a ZIP of selected source excerpts are available in Reports and links. The source ZIP contains the printed HDL/testbench listings, the branching PC, and the final program/COE data; generated IP, board constraints, and the complete final integration project were not supplied. The recovered excerpts have not been rerun in Vivado during this portfolio update.
