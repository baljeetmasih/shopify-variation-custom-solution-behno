import withMiddleware from "@/utils/middleware/withMiddleware.js";
import prisma from "@/utils/prisma.js";
import { Prisma } from "@prisma/client";


const handler = async (req, res) => {
  if (req.method === "PATCH") {
    if(req.body){
      try {
        let data = req?.body;
        let ids = data?.id;
        delete data['id']
        const updatePairs = await prisma.pairs.update({
            where: {
              id: ids,
            },
            data:data
          })
        if(updatePairs){
          return res.status(200).send({text : updatePairs , status : 200});
        }else{
          return res.status(500).send({ text: "Pair id does not exist.. " , status : 500});
        }
      } catch (error) {
        return res.status(500).send({ text: error.message,status : 500});
      }
    }
    return res.status(500).send({ text: "Pair id does not exist..",status : 500 });
  }

  if (req.method === "GET") {
   
    return res.status(200).send(req.body);
  }

  return res.status(400).send({ text: "Bad request" });
};

export default withMiddleware("verifyRequest")(handler);
