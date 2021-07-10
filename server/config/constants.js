exports.PUBLICACCESS = "PUBLICACCESS";
exports.DONORACCESS = "DONORACCESS";
exports.ADMINACCESS = "ADMINACCESS";
exports.CAMPAIGNERACCESS = "CAMPAIGNERACCESS";
exports.PUBLIC = "PUBLIC";
exports.DONOR = "DONOR";
exports.CAMPAIGNER = "CAMPAIGNER";
exports.ADMIN = "ADMIN";
exports.ROLES = [this.PUBLIC, this.DONOR, this.CAMPAIGNER, this.ADMIN];

//FD is for field
exports.ROLE_USER_FD = "role";
exports.PASSWORD_USER_FD = "password";
exports.SERVICES_USER_FD = "services";
exports.ISVERIFIEDEMAIL_USER_FD = "isEmailVerified";
exports.ISACTIVE_USER_FD = "isActive";
exports.ADMIN_ONLY_REPLACABLE_USER_FDS = [
    this.ROLE_USER_FD,
    this.ISVERIFIEDEMAIL_USER_FD,
    this.ISACTIVE_USER_FD,
];
