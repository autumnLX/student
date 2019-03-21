function create(phone, password) {
  return `{
    "identity": "student",
    "username": "${phone}",
    "password": "${password}"
  }`
}

module.exports = create
