const DEFAULT_DOCTOR_PASSWORD = process.env.DEFAULT_DOCTOR_PASSWORD || "Doctor@123";

const defaultDoctors = [
  {
    name: "Dr. Meera Sharma",
    email: "meera.sharma@meditrack.com",
    password: DEFAULT_DOCTOR_PASSWORD,
  },
  {
    name: "Dr. Arjun Reddy",
    email: "arjun.reddy@meditrack.com",
    password: DEFAULT_DOCTOR_PASSWORD,
  },
  {
    name: "Dr. Priya Nair",
    email: "priya.nair@meditrack.com",
    password: DEFAULT_DOCTOR_PASSWORD,
  },
];

module.exports = {
  defaultDoctors,
  DEFAULT_DOCTOR_PASSWORD,
};
