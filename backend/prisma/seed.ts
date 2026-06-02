/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const subjects = [
  {
    code: "IF-101",
    name: "Introduction to Programming",
    description: "Basic programming concepts using Python.",
  },
  {
    code: "IF-102",
    name: "Calculus I",
    description: "Differential and integral calculus fundamentals.",
  },
  {
    code: "IF-201",
    name: "Advanced Web Programming",
    description: "Modern web development with React and Node.js.",
  },
  {
    code: "IF-202",
    name: "Data Structures and Algorithms",
    description: "Core data structures and algorithmic complexity.",
  },
  {
    code: "IF-301",
    name: "Database Systems",
    description: "Relational database design and SQL.",
  },
  {
    code: "IF-302",
    name: "Software Engineering",
    description: "Software development life cycles and methodologies.",
  },
  {
    code: "IF-401",
    name: "Artificial Intelligence",
    description: "Introduction to AI and Machine Learning.",
  },
  {
    code: "IF-402",
    name: "Computer Networks",
    description: "Network protocols and architecture.",
  },
];

async function main() {
  console.log("Seeding database...");

  // 1. Seed Subjects
  console.log("Seeding subjects...");
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: {},
      create: subject,
    });
  }

  const dbSubjects = await prisma.subject.findMany();
  const getSubj = (code: string) => dbSubjects.find((s) => s.code === code)!.id;

  // 2. Seed Users
  console.log("Seeding users and profiles...");
  const defaultPassword = await bcrypt.hash("password123", 10);

  const dummyUsers = [
    {
      username: "zeleo",
      email: "zeleo@studycircle.ac.id",
      fullName: "Shin Zeleo",
      semester: 4,
      style: "Visual",
    },
    {
      username: "imam",
      email: "imam@studycircle.ac.id",
      fullName: "Imam Dzaqhoir",
      semester: 2,
      style: "Auditory",
    },
    {
      username: "haris",
      email: "haris@studycircle.ac.id",
      fullName: "Haris",
      semester: 6,
      style: "Kinesthetic",
    },
    {
      username: "hanif",
      email: "hanif@studycircle.ac.id",
      fullName: "Hanif Nurmahdin",
      semester: 4,
      style: "Reading/Writing",
    },
    {
      username: "siti",
      email: "siti@studycircle.ac.id",
      fullName: "Siti Aminah",
      semester: 4,
      style: "Visual",
    },
  ];

  for (const u of dummyUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        username: u.username,
        fullName: u.fullName,
        semester: u.semester,
      },
      create: {
        username: u.username,
        email: u.email,
        passwordHash: defaultPassword,
        fullName: u.fullName,
        semester: u.semester,
      },
    });

    // Create LearningStyle
    await prisma.learningStyle.upsert({
      where: { userId: user.id },
      update: { primaryStyle: u.style },
      create: {
        userId: user.id,
        primaryStyle: u.style,
      },
    });
  }

  const dbUsers = await prisma.user.findMany();
  const getUser = (username: string) =>
    dbUsers.find((u) => u.username === username)!.id;

  // 3. Seed Progress (Enrolled subjects)
  console.log("Seeding progress...");
  const progressMap = [
    { username: "zeleo", codes: ["IF-201", "IF-202"] },
    { username: "imam", codes: ["IF-101", "IF-102"] },
    { username: "haris", codes: ["IF-301", "IF-302", "IF-401"] },
    { username: "hanif", codes: ["IF-201", "IF-301"] },
    { username: "siti", codes: ["IF-201", "IF-202"] },
  ];

  for (const pm of progressMap) {
    const userId = getUser(pm.username);
    for (const code of pm.codes) {
      await prisma.progress.upsert({
        where: { userId_subjectId: { userId, subjectId: getSubj(code) } },
        update: {},
        create: {
          userId,
          subjectId: getSubj(code),
          estimatedMasteryLevel: "Beginner",
        },
      });
    }
  }

  // 4. Seed Study Groups (With keywords for recommendation engine)
  console.log("Seeding study groups...");
  const groups = [
    {
      name: "Web Dev Diagram Masters",
      description:
        "We draw architecture diagrams and mindmaps for Advanced Web Programming.",
      subjectId: getSubj("IF-201"),
      createdBy: getUser("siti"),
      maxMembers: 5,
    },
    {
      name: "IF-201 Discussion & Podcast",
      description: "We learn by discussing and listening to coding podcasts.",
      subjectId: getSubj("IF-201"),
      createdBy: getUser("imam"),
      maxMembers: 10,
    },
    {
      name: "Algo Practice Squad",
      description:
        "Hands-on practice and building real mini-projects for Data Structures.",
      subjectId: getSubj("IF-202"),
      createdBy: getUser("haris"),
      maxMembers: 4,
    },
    {
      name: "Database Textbook Readers",
      description:
        "Reading SQL textbooks, writing notes, and sharing articles.",
      subjectId: getSubj("IF-301"),
      createdBy: getUser("hanif"),
      maxMembers: 8,
    },
  ];

  for (const g of groups) {
    const existingGroup = await prisma.studyGroup.findFirst({
      where: { name: g.name },
    });
    let group = existingGroup;
    if (!existingGroup) {
      group = await prisma.studyGroup.create({
        data: g,
      });

      // Add creator as member
      await prisma.member.create({
        data: {
          studyGroupId: group.id,
          userId: g.createdBy,
          role: "admin",
        },
      });

      // Randomize some members
      if (g.name === "Web Dev Diagram Masters") {
        await prisma.member.create({
          data: {
            studyGroupId: group.id,
            userId: getUser("hanif"),
            role: "member",
          },
        });
      }
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
