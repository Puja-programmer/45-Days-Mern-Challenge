const skills = [
  { name: "HTML", proficiency: "Intermediate" },{ name: "CSS", proficiency: "Advanced" },
  { name: "JavaScript", proficiency: "Beginner" },{ name: "Node.js", proficiency: "Intermediate" },
  { name: "Express", proficiency: "Beginner" },{ name: "MongoDB", proficiency: "Advanced" }
];
// 1. Filter by proficiency: Show only "Advanced" skills
const advancedSkills = skills.filter(skill => skill.proficiency === "Advanced");
console.log("🔹 Advanced Skills:");
console.log(advancedSkills);
console.log();
// 2. Sort by name: Alphabetize the skills
const sortedSkills = [...skills].sort((a, b) => a.name.localeCompare(b.name));
console.log("🔹 Alphabetically Sorted Skills:");
console.log(sortedSkills);
console.log();
// 3. Add experience years: Include random years of experience (1-6)
const skillsWithExperience = skills.map(skill => ({...skill,experience: Math.floor(Math.random() * 6) + 1
}));
console.log("🔹 Skills with Experience:");
console.log(skillsWithExperience);
console.log();
// 4. Group into categories: frontend/backend
const categories = {
  frontend: ["HTML", "CSS", "JavaScript"],
  backend: ["Node.js", "Express", "MongoDB"]
};
const groupedSkills = skills.reduce((acc, skill) => {
  for (const category in categories) {
    if (categories[category].includes(skill.name)) {
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
    }
  }
  return acc;
}, {});
console.log("🔹 Grouped Skills by Category:");
console.log(groupedSkills);
