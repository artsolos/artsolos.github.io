import mapping from './organization.json';
export const subjects = [
  { id: 'hardware', label: 'Hardware & robotics' },
  { id: 'software', label: 'Software & algorithms' },
  { id: 'design', label: 'Design & fabrication' },
  { id: 'physics', label: 'Physics' },
  { id: 'business', label: 'Business' },
] as const;
export function subjectFor(slug: string) {
  const label = mapping.find(p => p.slug === slug)?.primarySubject;
  return subjects.find(s => s.label === label) ?? subjects[0];
}
export const selectedSlugs = ['spider-hexapod-control', 'systemverilog-teaching-processor', 'forge-of-hephaestus'];
export const courses = [
  { id: 'embedded-design', title: 'Embedded Design: Enabling Robotics', code: 'EECE 2160', group: 'Engineering', description: 'Eight labs across six case studies, from FPGA logic to embedded C++ and robot control.' },
  { id: 'digital-design', title: 'Fundamentals of Digital Design', code: 'EECE 2323', group: 'Engineering', description: 'Seven individual labs developing a connected SystemVerilog datapath and teaching processor.' },
  { id: 'engineering-algorithms', title: 'Fundamentals of Engineering Algorithms', code: 'EECE 2560', group: 'Engineering', description: 'Four team C++ projects in object models, linked lists, sorting, search and backtracking.' },
  { id: 'computing-fundamentals', title: 'Computing Fundamentals', code: 'Python coursework', group: 'Engineering', description: 'Individual exercises, numerical methods and a file-backed inventory application.' },
  { id: 'physics-1', title: 'Physics 1 Labs', code: 'Spring 2025', group: 'Physics', description: 'Shared experiments in measurement, motion, rotation, energy and momentum.' },
  { id: 'physics-2', title: 'Physics 2 Labs', code: 'Fall 2025', group: 'Physics', description: 'Partner experiments in oscillations, waves, electrical measurements and magnetism.' },
  { id: 'financial-reporting', title: 'Financial Reporting and Accounting', code: 'ACCT1209', group: 'Business', description: 'Two individual reports forming one historical company and financial-statement analysis.' },
  { id: 'marketing', title: 'Introduction to Marketing', code: 'MKTG2209', group: 'Business', description: 'An individual hypothetical cereal concept and marketing plan, with proposed outcomes.' },
];
export const courseProjectSlugs = (id: string) => mapping.filter(p => p.collection === `/coursework/${id}/`).map(p => p.slug);
