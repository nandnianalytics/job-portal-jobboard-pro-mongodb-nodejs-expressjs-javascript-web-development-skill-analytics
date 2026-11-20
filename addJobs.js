
require("dotenv").config();
const mongoose = require("mongoose");
const Job = require("./src/models/Job");
const Company = require("./src/models/Company");
const User = require("./src/models/User");

const newJobs = [
  {
    title: "Robotics Engineer",
    category: "Robotics",
    description: "Design and develop robotic systems, automation solutions and intelligent machines.",
    location: "Karachi",
    jobType: "Full-time",
    salaryMin: 60000,
    salaryMax: 120000,
    skills: ["C++", "ROS", "Arduino", "Robotics"]
  },
  {
    title: "Robotics Software Developer",
    category: "Robotics",
    description: "Develop software for robots, sensors and automated systems.",
    location: "Lahore",
    jobType: "Full-time",
    salaryMin: 70000,
    salaryMax: 140000,
    skills: ["Python", "C++", "ROS", "Automation"]
  },
  {
    title: "Machine Learning Engineer",
    category: "Machine Learning",
    description: "Build and train machine learning models for real-world applications.",
    location: "Remote",
    jobType: "Full-time",
    salaryMin: 80000,
    salaryMax: 160000,
    skills: ["Python", "TensorFlow", "Scikit-learn", "Machine Learning"]
  },
  {
    title: "AI Engineer",
    category: "Artificial Intelligence",
    description: "Develop AI-powered applications and intelligent software solutions.",
    location: "Islamabad",
    jobType: "Full-time",
    salaryMin: 90000,
    salaryMax: 180000,
    skills: ["Python", "Deep Learning", "PyTorch", "AI"]
  },
  {
    title: "Data Scientist",
    category: "Data Science",
    description: "Analyze complex datasets and build predictive models.",
    location: "Karachi",
    jobType: "Full-time",
    salaryMin: 70000,
    salaryMax: 150000,
    skills: ["Python", "Pandas", "NumPy", "SQL"]
  },
  {
    title: "Computer Vision Engineer",
    category: "Artificial Intelligence",
    description: "Build image recognition and computer vision applications.",
    location: "Lahore",
    jobType: "Full-time",
    salaryMin: 85000,
    salaryMax: 160000,
    skills: ["Python", "OpenCV", "Computer Vision", "Deep Learning"]
  },
  {
    title: "Deep Learning Engineer",
    category: "Machine Learning",
    description: "Develop deep learning models for intelligent applications.",
    location: "Remote",
    jobType: "Full-time",
    salaryMin: 90000,
    salaryMax: 170000,
    skills: ["Python", "PyTorch", "TensorFlow", "Deep Learning"]
  },
  {
    title: "Python Developer",
    category: "Technology",
    description: "Develop backend applications and software using Python.",
    location: "Hyderabad",
    jobType: "Full-time",
    salaryMin: 45000,
    salaryMax: 90000,
    skills: ["Python", "Django", "SQL", "MongoDB"]
  },
  {
    title: "Data Engineer",
    category: "Data Science",
    description: "Build data pipelines and manage large datasets.",
    location: "Karachi",
    jobType: "Full-time",
    salaryMin: 75000,
    salaryMax: 145000,
    skills: ["Python", "SQL", "AWS", "Docker"]
  },
  {
    title: "Cybersecurity Analyst",
    category: "Cybersecurity",
    description: "Monitor systems, identify security threats and protect company data.",
    location: "Islamabad",
    jobType: "Full-time",
    salaryMin: 60000,
    salaryMax: 120000,
    skills: ["Cybersecurity", "Linux", "Networking"]
  },
  {
    title: "Cloud Engineer",
    category: "Cloud Computing",
    description: "Manage cloud infrastructure and deploy scalable applications.",
    location: "Remote",
    jobType: "Full-time",
    salaryMin: 80000,
    salaryMax: 150000,
    skills: ["AWS", "Azure", "Docker", "Kubernetes"]
  },
  {
    title: "Automation Engineer",
    category: "Robotics",
    description: "Develop automation systems and improve industrial processes.",
    location: "Lahore",
    jobType: "Full-time",
    salaryMin: 65000,
    salaryMax: 125000,
    skills: ["Automation", "Arduino", "C++", "Python"]
  },
  {
    title: "IoT Developer",
    category: "Technology",
    description: "Develop Internet of Things applications and connected devices.",
    location: "Karachi",
    jobType: "Full-time",
    salaryMin: 55000,
    salaryMax: 110000,
    skills: ["Arduino", "Python", "C++", "IoT"]
  },
  {
    title: "NLP Engineer",
    category: "Artificial Intelligence",
    description: "Develop natural language processing applications and language models.",
    location: "Remote",
    jobType: "Full-time",
    salaryMin: 85000,
    salaryMax: 160000,
    skills: ["Python", "NLP", "Machine Learning", "Deep Learning"]
  },
  {
    title: "AI Research Assistant",
    category: "Artificial Intelligence",
    description: "Assist with AI research, experiments and machine learning projects.",
    location: "Hyderabad",
    jobType: "Internship",
    salaryMin: 20000,
    salaryMax: 40000,
    skills: ["Python", "Machine Learning", "TensorFlow"]
  }
];

async function addJobs() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from your .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas.");

    const companies = await Company.find({});
    if (companies.length === 0) {
      throw new Error("No companies found. Add a company first.");
    }

    const employer = await User.findOne({ role: "employer" });
    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < newJobs.length; i++) {
      const job = newJobs[i];
      const company = companies[i % companies.length];

      const existingJob = await Job.findOne({
        title: job.title,
        company: company._id,
        location: job.location
      });

      if (existingJob) {
        skipped++;
        continue;
      }

      const jobData = {
        ...job,
        company: company._id,
        status: "Open"
      };

      const postedBy = employer?._id || company.owner;
      if (postedBy) jobData.postedBy = postedBy;

      await Job.create(jobData);
      inserted++;
    }

    console.log(`Successfully added ${inserted} jobs.`);
    console.log(`Skipped ${skipped} duplicate jobs.`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

addJobs();
