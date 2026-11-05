// Shared profile details. Edit these values to change the name, contact links,
// education line, and resume. Leave a value undefined when it is unknown: the
// site hides any link or button whose value is missing.
//
// Items marked CONFIRM are source-backed drafts that need confirmation before
// publication. See docs/content-inventory.md > "Open questions".

export const profile = {
  // CONFIRM: lab reports use "Arefin Mahmood"; the old Google Site also uses "Arfin".
  name: 'Arefin Mahmood',
  identity: 'Computer engineering student',
  school: 'Northeastern University',
  // Shown in the hero. Keep it to one or two sentences.
  intro:
    'I build where software meets hardware: FPGA logic, C++ that drives registers on embedded Linux, and physical prototypes with sensors, motors, and Arduino.',
  // College and personal addresses confirmed by the user on 2026-10-25.
  email: 'mahmood.ar@northeastern.edu' as string | undefined,
  personalEmail: 'arefinmahmood11@gmail.com' as string | undefined,
  // Add full URLs once they exist, e.g. 'https://github.com/<username>'.
  github: undefined as string | undefined,
  linkedin: undefined as string | undefined,
  // Path inside public/. The Resume button appears only when this file exists.
  resume: 'resume/Arefin-Mahmood-Resume.pdf',
  education: {
    school: 'Northeastern University',
    program: 'Computer Engineering',
    minor: 'Business Administration',
    // Add only when confirmed, e.g. 'Expected May 2029'.
    graduation: undefined as string | undefined,
  },
};
