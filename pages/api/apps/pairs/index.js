//This is the same as `pages/api/index.js`.

import withMiddleware from "@/utils/middleware/withMiddleware.js";
import prisma from "@/utils/prisma.js";

const handler = async (req, res) => {
  if (req.method === "GET") {
    let data = await prisma.pairs.findMany({});
    return res.status(200).send({ text: data });
  }

  if (req.method === "POST") {
    return res.status(200).send(req.body);
  }

  return res.status(400).send({ text: "Bad request" });
};

export default withMiddleware("verifyRequest")(handler);
