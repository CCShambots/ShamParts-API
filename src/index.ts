import { Post } from "./entity/Post"
import { AppDataSource } from "./data-source"
import {Part} from "./entity/Part";
import {Onshape} from "./util/Onshape";


AppDataSource.initialize()
  .then(async () => {

    const part = new Part()
      part.number = "5907-1"
      part.material = "Aluminum"
      part.weight = 0.5
    part.quantityNeeded = 10
    part.quantityInStock = 10
    part.quantityRequested = 10

    // await AppDataSource.manager.save(part)

    // console.log("Post has been saved: ", part)

    // const parts = await AppDataSource.manager
    //   .createQueryBuilder(Part, "part")
    //   .getMany();

    // console.log("All parts: ", parts)\

    var res = await Onshape.getDocuments();

    console.log(res)
  })
  .catch((error) => console.log("Error: ", error))
