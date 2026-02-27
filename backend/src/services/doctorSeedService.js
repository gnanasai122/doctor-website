const bcrypt = require("bcryptjs");
const { userRepository } = require("../store/repository");
const { defaultDoctors } = require("../config/defaultDoctors");

const seedDefaultDoctors = async () => {
  let created = 0;

  for (const doctor of defaultDoctors) {
    const existing = await userRepository.findByEmail(doctor.email);
    if (existing) {
      continue;
    }

    const hashedPassword = await bcrypt.hash(doctor.password, 10);
    await userRepository.create({
      name: doctor.name,
      email: doctor.email,
      password: hashedPassword,
      role: "doctor",
    });
    created += 1;
  }

  return created;
};

module.exports = {
  seedDefaultDoctors,
};
