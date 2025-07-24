import jwt from "jsonwebtoken";

const secret = "secret";

const basePayload = {
  email: "john.smith@mail.com",
  sessionId: "sessionId123",
};

const signed = jwt.sign(basePayload, secret, {
  expiresIn: "1y",
  subject: "userId213",
});
const payload = jwt.verify(signed, secret);

console.log({ signed, payload });
