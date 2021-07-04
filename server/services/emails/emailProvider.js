const nodemailer = require("nodemailer");
const { emailConfig } = require("../../config/vars");
const Email = require("email-templates");

const domainUrl = "http://localhost:8080";

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const transporter = nodemailer.createTransport({
  port: emailConfig.port,
  host: emailConfig.host,
  auth: {
    user: emailConfig.username,
    pass: emailConfig.password,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log("error with email connection");
  }
});

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "flushcancerproject@gmail.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    preview: false,
    transport: transporter,
  });

  email
    .send({
      template: "passwordReset",
      message: {
        to: passwordResetObject.userEmail,
      },
      locals: {
        productName: "Flush Cancer Project",
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `https://your-app/new-password/view?resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch(() => console.log("error sending password reset email"));
};

exports.sendEmailVerification = async (emailVerObj) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "flushcancerproject@gmail.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    preview: false,
    transport: transporter,
  });

  email
    .send({
      template: "emailVerification",
      message: {
        to: emailVerObj.user.email,
      },
      locals: {
        productName: "Flush Cancer Project",
        userName: emailVerObj.user.name,
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        emailVerificationUrl: `${domainUrl}/user-verify/${emailVerObj.token.refreshToken}`,
      },
    })
    .catch(() => console.log("error sending user verification email"));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "flushcancerproject@gmail.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "passwordChange",
      message: {
        to: user.email,
      },
      locals: {
        productName: "FlushCancerProject",
        name: user.name,
      },
    })
    .catch(() => console.log("error sending change password email"));
};
