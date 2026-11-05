// Project categories. Used for filters on /projects/, capability groups on the
// homepage, and the hero diagram's layer buttons.
export const categoryIds = [
  'digital-design',
  'embedded-software',
  'sensing-actuation',
  'robotics',
  'prototyping',
  'cad',
  'algorithms',
  'programming',
  'experimental-physics',
  'financial-analysis',
  'marketing-strategy',
] as const;

export type CategoryId = (typeof categoryIds)[number];

export const categories: Record<CategoryId, { label: string; short: string }> = {
  'digital-design': { label: 'Digital design', short: 'FPGA logic' },
  'embedded-software': { label: 'Embedded software', short: 'C++ / Linux' },
  'sensing-actuation': { label: 'Sensing & actuation', short: 'Sensors & motors' },
  robotics: { label: 'Robotics', short: 'Robotics' },
  prototyping: { label: 'Physical prototyping', short: 'Prototyping' },
  cad: { label: 'CAD', short: 'CAD' },
  algorithms: { label: 'Algorithms', short: 'Data structures' },
  programming: { label: 'Programming', short: 'Python' },
  'experimental-physics': { label: 'Experimental physics', short: 'Measurements & models' },
  'financial-analysis': { label: 'Financial analysis', short: 'Accounting & reporting' },
  'marketing-strategy': { label: 'Marketing strategy', short: 'Audience & positioning' },
};

export const settingLabels = {
  coursework: 'Course lab',
  homework: 'Homework',
  'course-project': 'Course project',
  team: 'Team project',
  individual: 'Individual build',
  independent: 'Independent project',
} as const;

export const statusLabels = {
  complete: 'Complete',
  prototype: 'Prototype',
  'in-progress': 'In progress',
} as const;

// Homepage capability groups. Each group is backed by the projects whose
// categories include `match`; the evidence list names what those projects show.
export const capabilityGroups: {
  id: string;
  title: string;
  match: CategoryId[];
  evidence: string[];
}[] = [
  {
    id: 'digital-design',
    title: 'Digital design',
    match: ['digital-design'],
    evidence: [
      'Hierarchical schematics and simulation in Quartus Prime',
      'Karnaugh-map minimization, registers, comparators',
      'Counter-based timing and PWM generation on an FPGA',
      'Platform Designer systems with PIO and the lightweight AXI bridge',
    ],
  },
  {
    id: 'embedded-software',
    title: 'Embedded software',
    match: ['embedded-software'],
    evidence: [
      'C++ on ARM Linux, compiled on the target with g++ and make',
      'Memory-mapped I/O through /dev/mem and mmap()',
      'Bit masking, shifting, and edge-detected button input',
      'Extending a multi-file, class-based robot control program',
    ],
  },
  {
    id: 'sensing-actuation',
    title: 'Sensing & actuation',
    match: ['sensing-actuation'],
    evidence: [
      'HC-SR04 ultrasonic ranging with pulse-width timing',
      'DC motor PWM through an H-bridge, RC servo and stepper control',
      'Level shifting between 3.3 V and 5 V logic',
      'Checking signals with an oscilloscope and logic analyzer',
    ],
  },
  {
    id: 'prototyping',
    title: 'Physical prototyping & CAD',
    match: ['prototyping', 'cad'],
    evidence: [
      'Arduino input/output builds with buttons, LEDs, LCDs, and switches',
      'Iterating enclosures from cardboard to laser-cut wood',
      'SolidWorks part modeling and technical drawings',
      'Team builds documented through each failed and working attempt',
    ],
  },
];
