exports.PUBLICACCESS = "PUBLICACCESS";
exports.DONORACCESS = "DONORACCESS";
exports.ADMINACCESS = "ADMINACCESS";
exports.CAMPAIGNERACCESS = "CAMPAIGNERACCESS";

exports.PUBLIC = "PUBLIC";
exports.DONOR = "DONOR";
exports.CAMPAIGNER = "CAMPAIGNER";
exports.ADMIN = "ADMIN";

exports.ROLES = [this.PUBLIC, this.DONOR, this.CAMPAIGNER, this.ADMIN];

exports.LOGGED_USER = "_loggedUser";

//FD is for field
//User Fds
exports.ROLE_USER_FD = "role";
exports.PASSWORD_USER_FD = "password";
exports.SERVICES_USER_FD = "services";
exports.ISVERIFIEDEMAIL_USER_FD = "isEmailVerified";
exports.ISACTIVE_USER_FD = "isActive";

//Campaign fds
exports.ISVERIFIED_CAMPAIGN_FD = "isVerified";
exports.REMARKS_CAMPAIGN_FD = "remarks";

//Proof fds
exports.ISCHECKED_PROOF_FD = "isChecked";
exports.ADMIN_ONLY_REPLACABLE_PROOF_FDS = [this.ISCHECKED_PROOF_FD];

exports.ADMIN_ONLY_REPLACABLE_USER_FDS = [
    this.ROLE_USER_FD,
    this.ISVERIFIEDEMAIL_USER_FD,
    this.ISACTIVE_USER_FD,
];

exports.ADMIN_ONLY_REPLACABLE_CAMPAIGN_FDS = [
    this.ISVERIFIED_CAMPAIGN_FD,
    this.REMARKS_CAMPAIGN_FD,
];

exports.USER_CAMPAIGN_RATING_THRESHOLD = 7;
