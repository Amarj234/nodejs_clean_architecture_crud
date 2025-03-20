import { Router } from "express";
import container from "./container";


const router: Router = Router();

const leadSourceController = container.resolve("leadSourceController");
const userSourceController = container.resolve("userSourceController");


router.use("/lead-source", leadSourceController.router);

router.use("/users", userSourceController.router);




// router.get("/:id", UserController.getUserById);
// router.put("/:id", UserController.updateUser);
// router.delete("/:id", UserController.deleteUser);

export default router;
