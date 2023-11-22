import withMiddleware from "@/utils/middleware/withMiddleware.js";
import prisma from "@/utils/prisma.js";
const handler = async (req, res) => {
  if (req.method === "POST") {
    if(req.body){
      try {
        await prisma.pairs.delete({
          where : {
            id : +req.body.id
          }
        })

        let pair = await prisma.pairs.findMany({});
        if(pair){
          return res.status(200).send({text : pair , status : 200});
        }else{
          return res.status(500).send({ text: "Pair id does not exist.." , status : 500});
        }
      } catch (error) {
        return res.status(500).send({ text: error.message,status : 500});
      }
    }
    return res.status(500).send({ text: "Pair id does not exist..",status : 500 });
  }

  if (req.method === "POST") {
    return res.status(200).send(req.body);
  }

  return res.status(400).send({ text: "Bad request" });
};

export default withMiddleware("verifyRequest")(handler);
