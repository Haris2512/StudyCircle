import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const subjects = [
  { code: 'IF-101', name: 'Introduction to Programming', description: 'Basic programming concepts using Python.' },
  { code: 'IF-102', name: 'Calculus I', description: 'Differential and integral calculus fundamentals.' },
  { code: 'IF-201', name: 'Advanced Web Programming', description: 'Modern web development with React and Node.js.' },
  { code: 'IF-202', name: 'Data Structures and Algorithms', description: 'Core data structures and algorithmic complexity.' },
  { code: 'IF-301', name: 'Database Systems', description: 'Relational database design and SQL.' },
  { code: 'IF-302', name: 'Software Engineering', description: 'Software development life cycles and methodologies.' },
  { code: 'IF-401', name: 'Artificial Intelligence', description: 'Introduction to AI and Machine Learning.' },
  { code: 'IF-402', name: 'Computer Networks', description: 'Network protocols and architecture.' },
];

async function main() {
  console.log('Seeding subjects...');
  
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: {},
      create: subject,
    });
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
