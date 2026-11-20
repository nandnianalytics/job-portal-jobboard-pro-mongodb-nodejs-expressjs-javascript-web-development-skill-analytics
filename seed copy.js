require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const Company = require("./src/models/Company");
const Job = require("./src/models/Job");
const Application = require("./src/models/Application");
const SavedJob = require("./src/models/SavedJob");

const categories = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Human Resources",
  "Customer Support",
  "Data",
  "Robotics",
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing"
];
const locations = ["Karachi", "Hyderabad", "Lahore", "Islamabad", "Remote"];
const titles = [
  "Junior Web Developer",
  "Data Analyst",
  "UI/UX Designer",
  "Digital Marketing Officer",
  "Software Engineer",
  "Business Analyst",
  "HR Assistant",
  "Support Executive",

  // Robotics
  "Robotics Engineer",
  "Robotics Software Developer",
  "ROS Developer",
  "Automation Engineer",
  "Robotics Research Assistant",

  // Machine Learning
  "Machine Learning Engineer",
  "Machine Learning Intern",
  "Deep Learning Engineer",

  // Artificial Intelligence
  "AI Engineer",
  "NLP Engineer",
  "Computer Vision Engineer",
  "Generative AI Developer",

  // Data Science
  "Data Scientist",
  "Data Engineer",
  "Junior Data Scientist",

  // Cybersecurity
  "Cybersecurity Analyst",
  "Security Engineer",
  "Penetration Tester",

  // Cloud Computing
  "Cloud Engineer",
  "AWS Engineer",
  "DevOps Engineer"
];
const skillsPool = [
  "Excel",
  "SQL",
  "Python",
  "JavaScript",
  "React",
  "MongoDB",
  "Communication",
  "Figma",
  "Power BI",
  "Node.js",
  "C++",
  "ROS",
  "Arduino",
  "Robotics",
  "Automation",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Machine Learning",
  "Deep Learning",
  "OpenCV",
  "Computer Vision",
  "NLP",
  "Pandas",
  "NumPy",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Cybersecurity",
  "Linux"];
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([Company.deleteMany({}), Job.deleteMany({}), Application.deleteMany({}), SavedJob.deleteMany({})]);

  const password = await bcrypt.hash("Password123", 10);
  const admin = await User.create({ name: "Demo Admin", email: "admin@jobboardpro.com", password, role: "admin" });
  const employer = await User.create({ name: "Demo Employer", email: "employer@jobboardpro.com", password, role: "employer" });
  const candidates = await User.insertMany(Array.from({ length: 25 }, (_, i) => ({
    name: `Candidate ${i + 1}`, email: `candidate${i + 1}@example.com`, password,
    role: "candidate", skills: [pick(skillsPool), pick(skillsPool)]
  })));
  const companies = await Company.insertMany(Array.from({ length: 12 }, (_, i) => ({
    name: ["TechNova", "Bright Future", "DataBridge", "PixelWorks", "NextGen", "CloudNine"][i % 6] + ` ${i + 1}`,
    industry: pick(categories), location: pick(locations), description: "A growing organization hiring talented people.", owner: employer._id
  })));

  const jobs = [];
  for (let i = 0; i < 1100; i++) {
    const title = pick(titles);
    const category = pick(categories);
    jobs.push({
      title, description: `${title} opportunity. Work with a collaborative team. Skills include ${pick(skillsPool)} and ${pick(skillsPool)}.`, category,
      location: pick(locations), jobType: pick(["Full-time", "Part-time", "Internship", "Contract"]),
      salaryMin: 30000 + Math.floor(Math.random() * 90000),
      salaryMax: 80000 + Math.floor(Math.random() * 170000),
      skills: [pick(skillsPool), pick(skillsPool), pick(skillsPool)],
      company: pick(companies)._id, postedBy: employer._id,
      status: Math.random() > 0.08 ? "Open" : "Closed",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 300) * 86400000)
    });
  }
  const insertedJobs = await Job.insertMany(jobs);
  const apps = [];
  for (let i = 0; i < 450; i++) {
    apps.push({
      job: pick(insertedJobs)._id, candidate: pick(candidates)._id,
      status: pick(["Submitted", "Reviewing", "Shortlisted", "Rejected", "Hired"]),
      coverLetter: "I am interested in this opportunity.",
      appliedAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 86400000)
    });
  }
  // Avoid duplicate candidate/job pairs because the schema has a unique compound index.
  const unique = new Map();
  for (const a of apps) unique.set(`${a.job}-${a.candidate}`, a);
  await Application.insertMany([...unique.values()]);
  await Job.syncIndexes(); await Application.syncIndexes(); await SavedJob.syncIndexes();
  console.log(`Seed complete: ${companies.length} companies, ${insertedJobs.length} jobs, ${unique.size} applications, ${candidates.length} candidates.`);
  console.log("Demo login: admin@jobboardpro.com / Password123 (admin analytics)");
  console.log("Demo employer: employer@jobboardpro.com / Password123");
  console.log("Candidate: candidate1@example.com / Password123");
  await mongoose.disconnect();
}
seed().catch(err => { console.error(err); process.exit(1); });
